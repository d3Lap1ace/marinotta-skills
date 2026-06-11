# Marinotta Skills

English | [中文](./README.zh-CN.md)

A small collection of reusable skills for coding agents.

## Skills

| Skill | What it does |
| --- | --- |
| `exchange-rate` | Currency conversion, latest rates, historical rates, and rate trends. |
| `medium-track` | Fetches a Medium article via your own sid cookie, then translates it and produces a key-point summary inline. |
| `prd-solution-review` | Turns repo context plus requirements into a concise review proposal. |
| `translate-en-zh` | Translates English pages, PDFs, Markdown, HTML, and text into Simplified Chinese. |

## Install

Install with the [skills CLI](https://skills.sh) (supports Claude Code, Codex, Cursor, and 40+ other agents):

```bash
npx skills add d3Lap1ace/marinotta-skills
```

Install all skills without prompts:

```bash
npx skills add d3Lap1ace/marinotta-skills --skill '*'
```

Install only the skill you need:

| Skill | Install command |
| --- | --- |
| `exchange-rate` | `npx skills add d3Lap1ace/marinotta-skills --skill exchange-rate` |
| `medium-track` | `npx skills add d3Lap1ace/marinotta-skills --skill medium-track` |
| `prd-solution-review` | `npx skills add d3Lap1ace/marinotta-skills --skill prd-solution-review` |
| `translate-en-zh` | `npx skills add d3Lap1ace/marinotta-skills --skill translate-en-zh` |

Add `-g` to install globally (user-level) instead of per-project.

## Examples

```text
/exchange-rate Convert 100 USD to CNY
/medium-track https://medium.com/<author>/<slug>
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
