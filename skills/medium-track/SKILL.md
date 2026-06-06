---
name: medium-track
description: Fetch a Medium article (including member-only paywalled posts via the user's own sid cookie), produce a polished Simplified Chinese translation, and a structured key-point summary. Output everything inline in the conversation so the user can copy and save it themselves. Use whenever the user pastes a medium.com URL (or a Medium custom-domain article URL) and asks to read, translate, summarize, "翻译", or "提炼" it.
---

# medium-track

Turn a Medium article URL into a Simplified Chinese translation and a structured summary, delivered inline in the conversation. Nothing is written to disk — the user copies whatever they want to keep.

## Core Workflow

1. Confirm the URL points to a Medium article (`medium.com`, `*.medium.com`, or a known Medium custom domain). If not, ask the user before continuing.
2. Run the fetcher:
   ```
   python3 scripts/fetch_medium.py <url>
   ```
   On success it prints YAML frontmatter (`title, author, url, published, fetched_at, word_count, lang`) followed by the cleaned article Markdown to stdout. On failure it exits non-zero with a standard instruction message on stderr.
3. If the fetcher failed, **read the stderr verbatim and relay it to the user**. Do not improvise alternative login methods or scraping tricks. Wait for them to fix the cookie and rerun.
4. On success, translate the article body to Simplified Chinese using the Translation Prompt below.
5. Generate the summary using the Summary Prompt below.
6. Output **directly in the conversation**, in this order:
   - Title (H1)
   - `## 译文` — the full Simplified Chinese translation
   - `## 要点` — the four-section summary
   At the end, add a one-line hint: 「需要保存请直接复制上面内容。」
   Do not write to any file. Do not save anything to disk.

## Auth Handling

- Cookie source: `~/.config/medium-track/config.json` only, JSON shape `{"sid": "<value>"}`. No environment variable, no browser auto-extraction, no other path.
- The `sid` field accepts either a bare `sid` cookie value or the full `Cookie:` request header — the fetcher extracts the `sid` token internally.
- When the fetcher fails with a cookie-related message, paste its stderr to the user. The message already contains the setup instructions; do not summarize it away.
- Never attempt to "log in" yourself, generate a sid value, or scrape via alternative mirrors. The user re-configures, then retries.

## Translation Prompt

Translate the article body into Simplified Chinese with these rules:

- Output natural Simplified Chinese suitable for technical or knowledge articles.
- Preserve the source structure: heading levels (H1–H6), bullet and numbered lists, blockquotes, tables, fenced code blocks, inline code, links, images, footnotes.
- Do **not** translate code, commands, file paths, URLs, package names, API names, model names, environment variables, or identifiers.
- Translate table cells one by one while keeping the column count and the alignment row.
- On first occurrence of a technical term, use `中文（English）`; afterwards use the Chinese term consistently.
- Keep well-known proper nouns in English when translating would reduce clarity.
- Do not add translator commentary unless there is genuine ambiguity worth surfacing under a short `译者备注` block at the end.
- Translate in chunks for long articles; merge into a single coherent manuscript before output.

## Summary Prompt

Right after translation, produce a summary with exactly these four sections in Simplified Chinese:

```
## 一句话概括
<60 字以内，准确不夸张>

## 核心观点（3–7 条）
- <每条一句话，按文章逻辑顺序>

## 关键事实与数据
- <可被引用的数字、日期、人名、机构、版本号；没有就写"原文未给出具体数据">

## 给我的启发
- <可执行的 takeaway，2–4 条>
```

Rules:
- Summary is not a rewrite. Do not paraphrase the whole article.
- Quote numbers and proper nouns verbatim.
- If the article makes claims you cannot verify, frame them as the author's claim rather than fact.

## Output Rules

- Output entirely inline in the conversation. Do not call Write/Edit/Bash to save the result anywhere.
- Order: `# <title>` → `## 译文` (full translation) → `## 要点` (the four summary sections) → 「需要保存请直接复制上面内容。」
- Do not paste the original English body; the translation replaces it.

## Quality Checklist

Before sending the final reply, verify:

- The translation is Simplified Chinese throughout, reads like a finished manuscript, not a literal gloss.
- Headings, lists, tables, links, code blocks, footnotes, and blockquotes survived the round-trip.
- Code, commands, paths, URLs, package/API names were not translated.
- Terminology is consistent across chunks.
- No Medium furniture leaked through: Follow buttons, "Member-only story", "Sign in", response counts, "Recommended from Medium", "Written by" footers, claps, share buttons.
- Cookie failure mode was honored: if the fetcher refused, you relayed its message rather than improvising.
- Nothing was written to disk; the full content sits in the conversation for the user to copy.
