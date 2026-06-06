# Marinotta Skills

English | [中文](./README.zh-CN.md)

A small Claude Code plugin marketplace for reusable skills.

## Skills

| Skill | What it does |
| --- | --- |
| `exchange-rate` | Currency conversion, latest rates, historical rates, and rate trends. |
| `auto-code-review` | Reviews code and applies safe fixes from Claude feedback. |
| `prd-solution-review` | Turns repo context plus requirements into a concise review proposal. |
| `translate-en-zh` | Translates English pages, PDFs, Markdown, HTML, and text into Simplified Chinese. |

## Install From Claude Code

Add the marketplace:

```text
/plugin marketplace add d3Lap1ace/marinotta-skills
```

Install only the plugin you need:

| Plugin | Install command |
| --- | --- |
| `exchange-rate` | `/plugin install exchange-rate@marinotta-skills` |
| `auto-code-review` | `/plugin install auto-code-review@marinotta-skills` |
| `prd-solution-review` | `/plugin install prd-solution-review@marinotta-skills` |
| `translate-en-zh` | `/plugin install translate-en-zh@marinotta-skills` |

## Examples

```text
/exchange-rate Convert 100 USD to CNY
/auto-code-review Review my current git changes
/prd-solution-review Analyze this repo and draft a review-ready plan
/translate-en-zh Translate this saved HTML article into Chinese
```

## Local Install

Install all supported local targets:

```bash
python3 scripts/install.py all
```

Install one target:

```bash
python3 scripts/install.py claude-code
python3 scripts/install.py codex
python3 scripts/install.py agents
```

Preview without copying:

```bash
python3 scripts/install.py all --dry-run
```

## Layout

```text
.claude-plugin/              Marketplace manifest
commands/claude-code/        Slash command templates
docs/                        Installation and authoring notes
scripts/                     Install and validation helpers
skills/<name>/SKILL.md       Single-skill plugin roots
```

Each skill keeps agent-facing instructions in `SKILL.md` and human-facing notes in its own `README.md`.

## Validate

```bash
python3 scripts/validate.py
claude plugin validate --strict .
```

## License

MIT. See [LICENSE](LICENSE).
