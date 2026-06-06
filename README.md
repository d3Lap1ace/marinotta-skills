# Marinotta Skills

A curated collection of reusable skills for Claude Code, Codex, and agent-style skill loaders.

## Available Skills

| Skill | Purpose | Stack |
| --- | --- | --- |
| `exchange-rate` | Query real-time rates, historical rates, and exchange-rate trends. | TypeScript, Bun |
| `prd-to-solution` | Generate full technical solution documents from PRDs. | TypeScript, Bun |
| `auto-code-review` | Review code with Claude feedback and apply safe fixes. | Markdown workflow |
| `prd-solution-review` | Analyze a repo plus requirements and draft a concise review-ready solution. | Markdown workflow |
| `translate-en-zh` | Translate English web pages, PDFs, Markdown, HTML, and text into polished Simplified Chinese. | Python helper |

Each skill lives under `skills/<name>/`. Agent-facing instructions are in `SKILL.md`; human-facing notes are in each skill's `README.md`.

## Installation

Install all supported targets:

```bash
python3 scripts/install.py all
```

Install only Claude Code commands:

```bash
python3 scripts/install.py claude-code
```

Install only Codex or Agent-style skills:

```bash
python3 scripts/install.py codex
python3 scripts/install.py agents
```

Preview actions without copying:

```bash
python3 scripts/install.py all --dry-run
```

Use `--force` to overwrite an existing installed copy.

## Repository Layout

```text
commands/claude-code/   Claude Code slash command templates
docs/                   Installation and authoring notes
scripts/                Installer and validation helpers
skills/                 Reusable skill packages
```

## Validate

```bash
python3 scripts/validate.py
```

or:

```bash
npm run validate
```

## Usage Notes

`exchange-rate` and `prd-to-solution` include TypeScript command helpers. Use Bun or `npx tsx` as shown in each skill's documentation.

`translate-en-zh` includes a Python extraction helper for local Markdown, text, saved HTML, and PDFs. PDF extraction needs one optional package such as `pypdf`, `pdfminer.six`, or `pymupdf`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
