# translate-en-zh

Translate English web pages, PDFs, Markdown, HTML, and plain text into polished Simplified Chinese while preserving source structure.

## Use When

- You need a finished Chinese manuscript, not a bilingual draft.
- You want headings, lists, tables, links, quotes, and code blocks preserved.
- You need local PDF, Markdown, text, or saved HTML extraction before translation.

## Output Structure

The translation is always complete—every sentence is rendered, never summarized. A typical output looks like:

```text
## TL;DR          # long sources only: 3–6 Chinese bullets up top
（full translation）# the entire source, sentence by sentence
## 启示与思考      # the model's own takeaways and reflections
## 译者备注        # only when terms or extraction need disclosing
```

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
