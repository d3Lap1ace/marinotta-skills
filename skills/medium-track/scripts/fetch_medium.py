#!/usr/bin/env python3
"""Fetch a Medium article using the user's sid cookie and save it as Markdown.

Cookie source: ~/.config/medium-track/config.json (only). Missing or invalid
cookie causes a hard failure with a standard instruction message on stderr.
The skill SKILL.md relays that message to the user so they can re-configure.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup, Tag
from markdownify import markdownify as html_to_markdown

DEFAULT_CONFIG_PATH = Path.home() / ".config" / "medium-track" / "config.json"
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/125.0.0.0 Safari/537.36"
)
PAYWALL_HTML_MARKERS = (
    'data-testid="storyPaywall"',
    'data-testid="paywall"',
    'Member-only story',
    'Get unlimited access to the best of Medium',
    'Read the rest of this story with a free account',
)
MIN_FULL_ARTICLE_WORDS = 300

INSTRUCTION_MSG = """\
medium-track: could not read a valid Medium sid cookie.

Configure it with any one of these three methods:

  1. Interactive script:
       python3 scripts/setup_cookie.py

  2. Manual file ~/.config/medium-track/config.json:
       {"sid": "<paste-value-here>"}
     then `chmod 600 ~/.config/medium-track/config.json`.

  3. Tell the agent: paste your sid into the chat and ask it to configure
     medium-track. The agent runs `setup_cookie.py --sid '<value>' --force`
     for you.

The value can be either the bare `sid` cookie or the full `Cookie:` request
header from DevTools — the script auto-extracts the sid token.
"""


def fail(reason: str, code: int = 2) -> None:
    sys.stderr.write(reason.rstrip() + "\n")
    sys.exit(code)


def extract_sid(cookie_value: str) -> str | None:
    """Accept a bare sid value or a full Cookie header; return the sid token."""
    value = cookie_value.strip()
    if not value:
        return None
    if "=" in value:
        for part in value.split(";"):
            part = part.strip()
            if part.startswith("sid="):
                return part[len("sid="):].strip()
        return None
    return value


def load_sid(config_path: Path) -> str:
    if not config_path.exists():
        fail(INSTRUCTION_MSG)
    try:
        data = json.loads(config_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"medium-track: cookie file {config_path} is not valid JSON ({exc}).\n\n{INSTRUCTION_MSG}")
    raw = (data.get("sid") or "").strip()
    if not raw:
        fail(f"medium-track: cookie file {config_path} has no `sid` field.\n\n{INSTRUCTION_MSG}")
    sid = extract_sid(raw)
    if not sid:
        fail(
            f"medium-track: cookie file {config_path} has a `sid` value but no `sid=...` token could be extracted from it.\n\n{INSTRUCTION_MSG}"
        )
    return sid


def fetch_html(url: str, sid: str) -> str:
    session = requests.Session()
    session.headers.update({
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
    })
    session.cookies.set("sid", sid, domain=".medium.com")
    try:
        resp = session.get(url, timeout=30, allow_redirects=True)
    except requests.RequestException as exc:
        fail(f"medium-track: network error fetching {url}: {exc}", code=3)
    if resp.status_code >= 400:
        fail(f"medium-track: HTTP {resp.status_code} fetching {url}", code=3)
    if "/m/signin" in resp.url or "/m/global-identity" in resp.url:
        fail(f"medium-track: redirected to sign-in ({resp.url}). Cookie likely expired.\n\n{INSTRUCTION_MSG}")
    return resp.text


def parse_metadata(soup: BeautifulSoup, url: str) -> dict:
    def meta(name_or_prop: str) -> str | None:
        tag = soup.find("meta", attrs={"property": name_or_prop}) or soup.find(
            "meta", attrs={"name": name_or_prop}
        )
        return tag.get("content").strip() if tag and tag.get("content") else None

    published = meta("article:published_time") or meta("datePublished")
    title = meta("og:title") or (soup.title.string.strip() if soup.title else "Untitled")
    author = meta("author") or meta("article:author") or "Unknown"
    return {
        "title": title,
        "author": author,
        "published": published,
        "url": url,
    }


NOISE_SELECTORS = [
    'button',
    '[role="button"]',
    '[data-testid="storyPaywall"]',
    '[data-testid="audioPlayButton"]',
    '[data-testid="headerSocialShareButton"]',
    '[data-testid="postFooterSocialMenu"]',
    '[data-testid="footerSocialShareButton"]',
    'aside',
    'nav',
    'script',
    'style',
    'noscript',
    'svg',
    'form',
]

NOISE_TEXT_PATTERNS = [
    re.compile(r'^\s*Follow\s*$', re.I),
    re.compile(r'^\s*Sign in\s*$', re.I),
    re.compile(r'^\s*Sign up\s*$', re.I),
    re.compile(r'^\s*Subscribe\s*$', re.I),
    re.compile(r'^\s*Member-only story\s*$', re.I),
    re.compile(r'^\s*\d+\s*$'),
]


def extract_article(soup: BeautifulSoup) -> Tag:
    article = soup.find("article")
    if article is None:
        fail("medium-track: no <article> element found; the page layout may have changed.", code=4)
    for selector in NOISE_SELECTORS:
        for node in article.select(selector):
            node.decompose()
    for el in article.find_all(["p", "span", "div", "h1", "h2", "h3", "h4"]):
        text = el.get_text(" ", strip=True)
        if not text:
            continue
        for pat in NOISE_TEXT_PATTERNS:
            if pat.fullmatch(text):
                el.decompose()
                break
    return article


def to_markdown(article: Tag) -> str:
    md = html_to_markdown(
        str(article),
        heading_style="ATX",
        bullets="-",
        strip=["a"] if False else None,  # keep links
        code_language="",
    )
    md = re.sub(r"\n{3,}", "\n\n", md).strip()
    return md


def detect_paywall_in_html(html: str) -> str | None:
    """Return the matched paywall marker if the page looks paywalled, else None.

    Run against raw HTML before noise stripping — markdown post-processing removes
    these markers, so we'd miss them if we checked after extraction.
    """
    for marker in PAYWALL_HTML_MARKERS:
        if marker in html:
            return marker
    return None


def detect_short_body(markdown: str, html: str) -> bool:
    """Body looks suspiciously short AND raw HTML shows any hint of member-only flow.

    Some Medium articles legitimately are 1 paragraph. Only flag if the article
    seems short AND the page header explicitly marked it as member-only.
    """
    word_count = len(markdown.split())
    if word_count >= MIN_FULL_ARTICLE_WORDS:
        return False
    return "Member-only" in html or "member-only" in html


def render_output(meta: dict, markdown: str) -> str:
    fetched_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    word_count = len(markdown.split())
    front = {
        "title": meta["title"],
        "author": meta["author"],
        "url": meta["url"],
        "published": meta.get("published") or "",
        "fetched_at": fetched_at,
        "word_count": word_count,
        "lang": "en",
    }
    lines = ["---"]
    for k, v in front.items():
        lines.append(f"{k}: {json.dumps(v, ensure_ascii=False)}")
    lines.append("---")
    lines.append("")
    lines.append(markdown)
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Fetch a Medium article and print Markdown to stdout."
    )
    parser.add_argument("url", help="Medium article URL")
    parser.add_argument(
        "--config",
        type=Path,
        default=DEFAULT_CONFIG_PATH,
        help=f"Path to cookie config (default: {DEFAULT_CONFIG_PATH})",
    )
    args = parser.parse_args(argv)

    sid = load_sid(args.config)
    html = fetch_html(args.url, sid)

    paywall_marker = detect_paywall_in_html(html)
    if paywall_marker:
        fail(
            "medium-track: page contains a paywall block "
            f"({paywall_marker}); your cookie is invalid or this content needs a "
            "different account.\n\n" + INSTRUCTION_MSG,
            code=5,
        )

    soup = BeautifulSoup(html, "html.parser")
    meta = parse_metadata(soup, args.url)
    article = extract_article(soup)
    markdown = to_markdown(article)

    if detect_short_body(markdown, html):
        fail(
            "medium-track: extracted body is short and the page is flagged "
            "as member-only; cookie may be invalid or expired.\n\n"
            + INSTRUCTION_MSG,
            code=5,
        )

    sys.stdout.write(render_output(meta, markdown) + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
