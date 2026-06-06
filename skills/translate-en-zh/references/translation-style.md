# English To Chinese Translation Style

Use this reference for technical, long-form, terminology-heavy, or publication-quality English-to-Chinese translation.

## Voice

- Default to Simplified Chinese.
- Write fluent Chinese rather than literal word-by-word translation.
- Preserve the author's meaning, emphasis, and logical flow.
- Prefer concise modern Chinese for technical and knowledge writing.
- Keep a steady register: professional, clear, and readable.

## Structure Preservation

- Preserve Markdown heading levels, list nesting, table shape, code fences, links, footnotes, block quotes, and image references.
- Translate visible prose in headings, paragraphs, list items, captions, table cells, and quote text.
- Keep link targets unchanged while translating link text when it is ordinary prose.
- Keep table column count unchanged. If a cell contains code or a command, leave that part unchanged.

## Do Not Translate

Leave these unchanged unless the user explicitly asks otherwise:

- Fenced code blocks and inline code.
- Shell commands, flags, file paths, URLs, package names, module names, identifiers, environment variables, API names, class names, function names, method names, and config keys.
- Product names, project names, model names, organization names, and personal names when a Chinese name is not standard.
- Version numbers, RFC names, standards IDs, license names, and protocol names.

## Terminology

- For important first-use terms, use `中文（English）` when the English original helps recognition.
- After the first use, prefer the Chinese term if it is clear and conventional.
- Keep the English term if no reliable Chinese equivalent exists or if the English name is how practitioners recognize it.
- Use one translation consistently across the whole manuscript.
- When uncertain, keep the English term and add a concise `译者备注` at the end.

## Technical Prose

- Translate "should", "must", and "may" according to strength:
  - `must`: 必须
  - `should`: 应该 / 建议
  - `may`: 可以 / 可能
- Translate "performance", "latency", "throughput", "runtime", and "memory" according to context instead of using one fixed mapping.
- Keep examples intact unless the prose around them needs translation.
- Preserve mathematical notation and equations.

## Common Cleanups

- Remove extraction artifacts such as repeated headers, footers, navigation labels, cookie prompts, newsletter CTAs, unrelated recommendations, and duplicated page titles.
- Smooth English-heavy sentence order into natural Chinese where needed.
- Prefer active and concrete Chinese phrasing when the English source is dense.

## Translator Notes

Add `译者备注` only when useful. Good reasons include:

- A term has multiple plausible translations.
- Source text is visibly missing or malformed.
- A PDF page appears to require OCR.
- A link, figure, or table could not be extracted.
