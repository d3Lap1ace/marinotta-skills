# Claude Code Plugin Marketplace

This repository is a Claude Code plugin marketplace with one installable plugin per skill.

## Install From Claude Code

Add the marketplace:

```text
/plugin marketplace add d3Lap1ace/marinotta-skills
```

Install a single plugin:

```text
/plugin install exchange-rate@marinotta-skills
/plugin install auto-code-review@marinotta-skills
/plugin install prd-solution-review@marinotta-skills
/plugin install translate-en-zh@marinotta-skills
```

Reload plugins after local development changes:

```text
/reload-plugins
```

## Structure

```text
.claude-plugin/
  marketplace.json
skills/
  <skill-name>/
    .claude-plugin/plugin.json
    SKILL.md
```

`marketplace.json` lets Claude Code discover this repository as a marketplace. Each skill directory is also a single-skill plugin root with its own `plugin.json`.
