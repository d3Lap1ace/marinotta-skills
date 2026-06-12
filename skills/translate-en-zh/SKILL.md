---
name: translate-en-zh
description: Translate English web pages, local PDFs, saved HTML, Markdown, and plain text into polished Simplified Chinese manuscripts while preserving source structure. Use when the user asks to translate English articles, documentation, web pages, PDF files, Markdown files, or text into Chinese, especially when they want natural Chinese output with headings, lists, tables, code blocks, links, footnotes, and quotes retained.
---

# Translate English to Chinese

Translate English source material into a coherent Simplified Chinese manuscript. Default to a finished Chinese draft, not bilingual output, unless the user explicitly asks for side-by-side translation.

**Always translate the full text. Never summarize, condense, or omit content.** Render every sentence of the source. The output must be a complete translation of the entire source, not a digest, abstract, or paraphrase. If the user wants a summary, that is a different task—do not substitute one for a translation.

## Core Workflow

1. Identify the source type: web page, local PDF, local Markdown, plain text, or saved HTML.
2. Extract the main content before translating. Prefer the current agent's web/PDF/document tools when they can read the source directly. For local files or saved HTML, run `scripts/extract_source.py <input> --format markdown`.
3. Remove navigation, ads, cookie banners, newsletter boxes, sidebars, recommendation modules, and repeated page furniture before translation.
4. Read `references/translation-style.md` when handling technical, long-form, terminology-heavy, or publication-quality translation.
5. Translate in chunks for long sources, then merge the chunks into one consistent Chinese manuscript.
6. Run the quality checklist before returning the final answer or writing the translated file.

## Source Handling

### Web Pages

- Use available web-reading tools to fetch the article body. If the user provided a saved HTML file, extract it with `scripts/extract_source.py`.
- Keep the original hierarchy of headings, lists, tables, quotes, code blocks, links, footnotes, and images when present.
- Exclude site chrome and unrelated content unless the user asks to translate the whole page.
- If the page is inaccessible, paywalled, script-rendered, or partially loaded, state what could be extracted and ask for the saved page or source text.

### PDFs

- For local PDFs, run `scripts/extract_source.py <file.pdf> --format markdown` when no better PDF tool is available.
- Preserve page break clues as `<!-- page: N -->` only when they help align or debug the translation. Do not translate repeated headers and footers as body text.
- If the PDF has no extractable text, state that OCR is required. Do not invent missing content.
- For figures, tables, captions, and equations, preserve structure where extractable and translate surrounding prose.

### Markdown And Text

- Preserve Markdown syntax, heading levels, list nesting, tables, links, footnotes, block quotes, and blank-line rhythm.
- Do not translate fenced code blocks, inline code, commands, file paths, URLs, package names, API names, model names, environment variables, or identifiers.
- Translate table cells one by one while keeping the same column count and alignment row.
- For Markdown with embedded HTML, translate visible prose and preserve tags unless rewriting is necessary for clean Markdown output.

## Output Rules

- Write natural, accurate Simplified Chinese suitable for technical and knowledge articles.
- Keep the source structure unless the user asks for restructuring.
- Introduce key terms as `中文（English）` on first occurrence when the English term is useful for recognition; use the agreed Chinese term afterward.
- Keep proper nouns in English when translation would reduce clarity, or use `中文（English）` for well-known translated terms.
- For long sources (roughly 2000+ English words, or any article long enough that a reader benefits from an overview), prepend a `## TL;DR` section at the very top: 3–6 Simplified Chinese bullet points capturing the article's key points. This is an addition for navigation only—it never replaces or shortens the full translation, which must still follow in its entirety below the TL;DR.
- After the full translation, append a `## 启示与思考` section: your own genuine takeaways and reflections on the article—what is insightful, what is questionable, how it connects to broader context, and what the reader might do with it. This is your perspective, not a restatement of the source; keep it honest and substantive rather than flattering filler. It comes after the complete translation and never replaces any part of it.
- Add a short `译者备注` section only when there are uncertain terms, extraction gaps, or source ambiguities worth surfacing.
- If writing a file, use the same base name with a clear suffix such as `.zh.md` unless the user specifies a path.

## Quality Checklist

- Confirm the output is Simplified Chinese and reads like a finished manuscript.
- Confirm the translation covers the entire source with nothing summarized, condensed, or skipped.
- Confirm headings, lists, tables, links, code blocks, footnotes, and quote blocks are preserved.
- Confirm code, commands, paths, URLs, package names, API names, and identifiers were not translated.
- Confirm terminology is consistent across chunks.
- Confirm no navigation, ads, cookie prompts, or unrelated recommendations entered the translation.
- Confirm any missing text, OCR need, or uncertain terminology is disclosed instead of guessed.
