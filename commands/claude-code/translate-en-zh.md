---
description: Translate English source material into polished Simplified Chinese
argument-hint: [url, file-path, or pasted text]
---

Use the `translate-en-zh` skill workflow. In this repository, the source lives at:
- `skills/translate-en-zh/SKILL.md`
- `skills/translate-en-zh/references/translation-style.md`

Task:
1. Identify the source type from `$ARGUMENTS`: web page, local PDF, local Markdown, saved HTML, plain text, or pasted content.
2. Extract the main content before translating. For local files or saved HTML, use `skills/translate-en-zh/scripts/extract_source.py` when appropriate.
3. Remove navigation, ads, cookie banners, sidebars, recommendations, and repeated page furniture.
4. Translate into natural Simplified Chinese while preserving headings, lists, tables, links, quotes, code blocks, and footnotes.
5. Keep code, commands, paths, URLs, package names, API names, model names, environment variables, and identifiers untranslated.
6. Add a short translator note only for extraction gaps, uncertain terms, or source ambiguities.
