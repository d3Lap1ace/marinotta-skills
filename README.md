# Marinotta Skills

English | [中文](./README.zh-CN.md)

A small collection of reusable skills for Claude Code, Codex, and agent-style skill loaders.

Use it as a Claude Code plugin marketplace, or copy individual skills into your local agent setup.

## Skills

| Skill | What it does |
| --- | --- |
| `exchange-rate` | Currency conversion, latest rates, historical rates, and rate trends. |
| `prd-to-solution` | Generates full technical solution documents from PRDs. |
| `auto-code-review` | Reviews code and applies safe fixes from Claude feedback. |
| `prd-solution-review` | Turns repo context plus requirements into a concise review proposal. |
| `translate-en-zh` | Translates English pages, PDFs, Markdown, HTML, and text into Simplified Chinese. |

## Claude Code Marketplace

Add this repository as a marketplace:

```text
/plugin marketplace add d3Lap1ace/marinotta-skills
```

Plugin install list:

The marketplace currently publishes one compact plugin package; choose individual skills when invoking them.

| Plugin | Install command |
| --- | --- |
| All Marinotta skills | `/plugin install marinotta-skills@marinotta-skills` |

After installation, call skills with the plugin namespace:

```text
/marinotta-skills:exchange-rate
/marinotta-skills:prd-to-solution
/marinotta-skills:translate-en-zh
/marinotta-skills:auto-code-review
/marinotta-skills:prd-solution-review
```

## Examples

```text
/marinotta-skills:exchange-rate Convert 100 USD to CNY
/marinotta-skills:prd-to-solution Create a technical solution from this PRD
/marinotta-skills:auto-code-review Review my current git changes
/marinotta-skills:prd-solution-review Analyze this repo and draft a review-ready plan
/marinotta-skills:translate-en-zh Translate this saved HTML article into Chinese
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
.claude-plugin/         Claude Code marketplace and plugin manifests
commands/claude-code/   Slash command templates
docs/                   Installation and authoring notes
scripts/                Install and validation helpers
skills/                 Reusable skill packages
```

Each skill keeps agent-facing instructions in `SKILL.md` and human-facing notes in its own `README.md`.

## Validate

```bash
python3 scripts/validate.py
claude plugin validate .
```

## License

MIT. See [LICENSE](LICENSE).
