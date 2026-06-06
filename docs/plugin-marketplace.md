# Claude Code Plugin Marketplace

This repository can be installed as a Claude Code plugin marketplace.

## Install From Claude Code

Add the marketplace:

```text
/plugin marketplace add d3Lap1ace/marinotta-skills
```

Install the plugin:

```text
/plugin install marinotta-skills@marinotta-skills
```

Reload plugins after local development changes:

```text
/reload-plugins
```

## Structure

```text
.claude-plugin/
  marketplace.json
  plugin.json
skills/
  <skill-name>/SKILL.md
commands/
  claude-code/*.md
```

`marketplace.json` lets Claude Code discover this repository as a marketplace. `plugin.json` defines the installable plugin metadata. Skills are loaded from the repository-level `skills/` directory.

Installed plugin skills are namespaced:

```text
/marinotta-skills:translate-en-zh
/marinotta-skills:auto-code-review
```
