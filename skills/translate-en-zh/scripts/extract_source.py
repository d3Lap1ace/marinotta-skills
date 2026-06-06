#!/usr/bin/env python3
"""Extract local source files into normalized Markdown for translation."""

from __future__ import annotations

import argparse
import html
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable


SUPPORTED_EXTENSIONS = {".pdf", ".md", ".markdown", ".txt", ".html", ".htm"}
BLOCK_TAGS = {
    "address",
    "article",
    "aside",
    "blockquote",
    "br",
    "dd",
    "div",
    "dl",
    "dt",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hr",
    "li",
    "main",
    "nav",
    "ol",
    "p",
    "pre",
    "section",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "tr",
    "ul",
}
SKIP_TAGS = {"script", "style", "noscript", "svg", "canvas", "iframe"}
VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}
DROP_HINTS = (
    "nav",
    "menu",
    "cookie",
    "banner",
    "advert",
    "ads",
    "sidebar",
    "footer",
    "header",
    "newsletter",
    "subscribe",
    "recommend",
    "related",
    "share",
    "social",
    "promo",
)
MAIN_HINTS = (
    "article",
    "post",
    "content",
    "entry",
    "main",
    "story",
    "document",
    "markdown",
)


class MarkdownHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.skip_depth = 0
        self.link_stack: list[tuple[str | None, int]] = []
        self.list_stack: list[str] = []
        self.table_rows: list[tuple[list[str], bool]] | None = None
        self.table_row: list[str] | None = None
        self.table_row_is_header = False
        self.table_cell_start: int | None = None
        self.in_pre = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {name.lower(): value or "" for name, value in attrs}
        if self.skip_depth:
            if tag not in VOID_TAGS:
                self.skip_depth += 1
            return
        if tag in SKIP_TAGS or self._should_drop(attr_map):
            self.skip_depth += 1
            return

        if tag in {"article", "main", "section", "div", "header", "footer"}:
            self._break(2)
        elif tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self._break(2)
            self.parts.append("#" * int(tag[1]) + " ")
        elif tag == "p":
            self._break(2)
        elif tag == "br":
            self.parts.append("\n")
        elif tag == "blockquote":
            self._break(2)
            self.parts.append("> ")
        elif tag in {"ul", "ol"}:
            self.list_stack.append(tag)
            self._break(1)
        elif tag == "li":
            self._break(1)
            marker = "1." if self.list_stack and self.list_stack[-1] == "ol" else "-"
            indent = "  " * max(len(self.list_stack) - 1, 0)
            self.parts.append(f"{indent}{marker} ")
        elif tag == "a":
            self.link_stack.append((attr_map.get("href"), len(self.parts)))
        elif tag in {"strong", "b"}:
            self.parts.append("**")
        elif tag in {"em", "i"}:
            self.parts.append("*")
        elif tag == "code" and not self.in_pre:
            self.parts.append("`")
        elif tag == "pre":
            self._break(2)
            self.parts.append("```text\n")
            self.in_pre = True
        elif tag == "table":
            self._break(2)
            self.table_rows = []
        elif tag == "tr":
            self.table_row = []
            self.table_row_is_header = False
        elif tag in {"td", "th"} and self.table_row is not None:
            self.table_cell_start = len(self.parts)
            if tag == "th":
                self.table_row_is_header = True

    def handle_endtag(self, tag: str) -> None:
        if self.skip_depth:
            self.skip_depth = max(self.skip_depth - 1, 0)
            return

        if tag in {"h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote"}:
            self._break(2)
        elif tag in {"ul", "ol"}:
            if self.list_stack:
                self.list_stack.pop()
            self._break(1)
        elif tag == "a":
            href, start = self.link_stack.pop() if self.link_stack else (None, len(self.parts))
            text = self._pop_since(start)
            if href:
                self.parts.append(f"[{text}]({href})" if text else href)
            elif text:
                self.parts.append(text)
        elif tag in {"strong", "b"}:
            self.parts.append("**")
        elif tag in {"em", "i"}:
            self.parts.append("*")
        elif tag == "code" and not self.in_pre:
            self.parts.append("`")
        elif tag == "pre":
            if not self._endswith("\n"):
                self.parts.append("\n")
            self.parts.append("```\n")
            self.in_pre = False
        elif tag in {"td", "th"} and self.table_row is not None:
            start = self.table_cell_start if self.table_cell_start is not None else len(self.parts)
            cell = self._pop_since(start)
            self.table_row.append(normalize_inline(cell))
            self.table_cell_start = None
        elif tag == "tr" and self.table_row is not None:
            cells = self.table_row
            self.table_row = None
            if cells and self.table_rows is not None:
                self.table_rows.append((cells, self.table_row_is_header))
            self.table_row_is_header = False
        elif tag == "table":
            if self.table_rows:
                self._break(2)
                self.parts.append(render_markdown_table(self.table_rows))
                self._break(2)
            self.table_rows = None

    def handle_data(self, data: str) -> None:
        if self.skip_depth:
            return
        if self.in_pre:
            self.parts.append(data)
            return
        text = normalize_inline(data)
        if text:
            if self.parts and not self._endswith((" ", "\n", "[", "(", "`", "*")):
                self.parts.append(" ")
            self.parts.append(text)

    def _should_drop(self, attr_map: dict[str, str]) -> bool:
        joined = " ".join(
            attr_map.get(key, "").lower() for key in ("class", "id", "role", "aria-label")
        )
        return any(hint in joined for hint in DROP_HINTS)

    def _break(self, count: int) -> None:
        if count <= 0:
            return
        current = "".join(self.parts)
        trailing = len(current) - len(current.rstrip("\n"))
        if trailing < count:
            self.parts.append("\n" * (count - trailing))

    def _endswith(self, suffix: str | tuple[str, ...]) -> bool:
        return bool(self.parts) and "".join(self.parts[-3:]).endswith(suffix)

    def _pop_since(self, start: int) -> str:
        if start >= len(self.parts):
            return ""
        text = "".join(self.parts[start:]).strip()
        del self.parts[start:]
        return text

    def markdown(self) -> str:
        return normalize_markdown("".join(self.parts))


def normalize_inline(text: str) -> str:
    text = html.unescape(text)
    text = text.replace("\xa0", " ")
    return re.sub(r"[ \t\r\f\v]+", " ", text).strip()


def normalize_markdown(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = [line.rstrip() for line in text.split("\n")]
    cleaned: list[str] = []
    blank = 0
    for line in lines:
        if not line.strip():
            blank += 1
            if blank <= 2:
                cleaned.append("")
            continue
        blank = 0
        cleaned.append(line)
    output = "\n".join(cleaned).strip()
    return output + "\n" if output else ""


def render_markdown_table(rows: list[tuple[list[str], bool]]) -> str:
    max_columns = max(len(cells) for cells, _is_header in rows)
    normalized_rows = [
        [escape_table_cell(cell) for cell in cells + [""] * (max_columns - len(cells))]
        for cells, _is_header in rows
    ]
    header_index = next((index for index, row in enumerate(rows) if row[1]), 0)
    header = normalized_rows[header_index]
    body = [
        cells
        for index, cells in enumerate(normalized_rows)
        if index != header_index or len(normalized_rows) == 1
    ]
    lines = [
        "| " + " | ".join(header) + " |",
        "| " + " | ".join("---" for _ in header) + " |",
    ]
    if len(normalized_rows) > 1:
        lines.extend("| " + " | ".join(cells) + " |" for cells in body)
    return "\n".join(lines) + "\n"


def escape_table_cell(text: str) -> str:
    return text.replace("\n", " ").replace("|", "\\|").strip()


def read_text(path: Path) -> str:
    for encoding in ("utf-8", "utf-8-sig", "gb18030", "latin-1"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    raise RuntimeError(f"Unable to decode text file: {path}")


def extract_markdown_or_text(path: Path) -> str:
    return normalize_markdown(read_text(path))


def extract_html(path: Path) -> str:
    raw = read_text(path)
    body = choose_html_body(raw)
    parser = MarkdownHTMLParser()
    parser.feed(body)
    parser.close()
    return parser.markdown()


def choose_html_body(raw: str) -> str:
    candidates = re.findall(
        r"<(article|main|section|div)\b([^>]*)>(.*?)</\1>",
        raw,
        flags=re.IGNORECASE | re.DOTALL,
    )
    scored: list[tuple[int, str]] = []
    for tag, attrs, body in candidates:
        attr_text = attrs.lower()
        hint_score = 2000 if tag.lower() in {"article", "main"} else 0
        hint_score += 1000 if any(hint in attr_text for hint in MAIN_HINTS) else 0
        text_len = len(re.sub(r"<[^>]+>", " ", body))
        scored.append((hint_score + text_len, body))
    if scored:
        return max(scored, key=lambda item: item[0])[1]
    match = re.search(r"<body\b[^>]*>(.*?)</body>", raw, flags=re.IGNORECASE | re.DOTALL)
    return match.group(1) if match else raw


def extract_pdf(path: Path) -> str:
    errors: list[str] = []
    extractors = (extract_pdf_with_pypdf, extract_pdf_with_pdfminer, extract_pdf_with_pymupdf)
    for extractor in extractors:
        try:
            pages = extractor(path)
        except ImportError as exc:
            errors.append(str(exc))
            continue
        if any(page.strip() for page in pages):
            return pages_to_markdown(remove_repeated_page_furniture(pages))
    detail = "; ".join(errors) if errors else "no extractable text was found"
    raise RuntimeError(
        "Unable to extract text from this PDF. It may be scanned or require OCR. "
        f"Details: {detail}"
    )


def extract_pdf_with_pypdf(path: Path) -> list[str]:
    try:
        from pypdf import PdfReader
    except ImportError:
        try:
            from PyPDF2 import PdfReader
        except ImportError as exc:
            raise ImportError("pypdf/PyPDF2 is not installed") from exc
    reader = PdfReader(str(path))
    return [page.extract_text() or "" for page in reader.pages]


def extract_pdf_with_pdfminer(path: Path) -> list[str]:
    try:
        from pdfminer.high_level import extract_pages
        from pdfminer.layout import LTTextContainer
    except ImportError as exc:
        raise ImportError("pdfminer.six is not installed") from exc
    pages: list[str] = []
    for page_layout in extract_pages(str(path)):
        chunks = [
            element.get_text()
            for element in page_layout
            if isinstance(element, LTTextContainer)
        ]
        pages.append("".join(chunks))
    return pages


def extract_pdf_with_pymupdf(path: Path) -> list[str]:
    try:
        import fitz
    except ImportError as exc:
        raise ImportError("PyMuPDF is not installed") from exc
    with fitz.open(path) as document:
        return [page.get_text("text") for page in document]


def remove_repeated_page_furniture(pages: list[str]) -> list[str]:
    if len(pages) < 3:
        return [normalize_markdown(page) for page in pages]

    top_lines = repeated_edge_lines(pages, start=True)
    bottom_lines = repeated_edge_lines(pages, start=False)
    cleaned: list[str] = []
    for page in pages:
        lines = page.replace("\r\n", "\n").replace("\r", "\n").split("\n")
        while lines and normalize_inline(lines[0]) in top_lines:
            lines.pop(0)
        while lines and normalize_inline(lines[-1]) in bottom_lines:
            lines.pop()
        cleaned.append(normalize_markdown("\n".join(lines)))
    return cleaned


def repeated_edge_lines(pages: list[str], *, start: bool) -> set[str]:
    counts: dict[str, int] = {}
    for page in pages:
        lines = [normalize_inline(line) for line in page.splitlines() if normalize_inline(line)]
        sample = lines[:3] if start else lines[-3:]
        for line in sample:
            if len(line) >= 4 and not re.fullmatch(r"\d+", line):
                counts[line] = counts.get(line, 0) + 1
    threshold = max(2, len(pages) // 2)
    return {line for line, count in counts.items() if count >= threshold}


def pages_to_markdown(pages: Iterable[str]) -> str:
    parts: list[str] = []
    for index, page in enumerate(pages, start=1):
        page_text = normalize_markdown(page)
        if not page_text:
            continue
        parts.append(f"<!-- page: {index} -->\n\n{page_text}")
    return "\n\n".join(parts).strip() + "\n" if parts else ""


def extract(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        supported = ", ".join(sorted(SUPPORTED_EXTENSIONS))
        raise RuntimeError(f"Unsupported file extension '{suffix}'. Supported: {supported}")
    if suffix in {".md", ".markdown", ".txt"}:
        return extract_markdown_or_text(path)
    if suffix in {".html", ".htm"}:
        return extract_html(path)
    if suffix == ".pdf":
        return extract_pdf(path)
    raise RuntimeError(f"Unsupported file extension '{suffix}'")


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract PDF, Markdown, text, or saved HTML into Markdown for translation."
    )
    parser.add_argument("input", help="Source file path")
    parser.add_argument(
        "--format",
        choices=("markdown",),
        default="markdown",
        help="Output format. Only markdown is currently supported.",
    )
    parser.add_argument("-o", "--output", help="Write extracted Markdown to this path")
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    path = Path(args.input).expanduser().resolve()
    if not path.exists():
        print(f"error: input file not found: {path}", file=sys.stderr)
        return 2
    if not path.is_file():
        print(f"error: input path is not a file: {path}", file=sys.stderr)
        return 2
    try:
        output = extract(path)
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    if args.output:
        Path(args.output).expanduser().write_text(output, encoding="utf-8")
    else:
        sys.stdout.write(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
