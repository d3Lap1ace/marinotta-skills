# translate-en-zh

Translate English web pages, PDFs, Markdown, HTML, and plain text into polished Simplified Chinese while preserving source structure.

## Use When

- You need a finished Chinese manuscript, not a bilingual draft.
- You want headings, lists, tables, links, quotes, and code blocks preserved.
- You need local PDF, Markdown, text, or saved HTML extraction before translation.

## Trigger

```text
$translate-en-zh
```

## Contents

```text
SKILL.md
agents/openai.yaml
references/translation-style.md
scripts/extract_source.py
```

## Optional PDF Dependencies

For PDF extraction, install one of:

```bash
python3 -m pip install pypdf
python3 -m pip install pdfminer.six
python3 -m pip install pymupdf
```
