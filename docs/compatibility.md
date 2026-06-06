# Compatibility

This repository keeps source skills in `skills/` and installs them into tool-specific locations.

## Codex

`scripts/install.py codex` copies each `skills/<name>/` package to:

```text
$CODEX_HOME/skills/<name>/
```

If `CODEX_HOME` is not set, the installer uses:

```text
~/.codex/skills/<name>/
```

## Agent-Style Loaders

`scripts/install.py agents` copies each skill to:

```text
$AGENTS_HOME/skills/<name>/
```

If `AGENTS_HOME` is not set, the installer uses:

```text
~/.agents/skills/<name>/
```

## Claude Code

`scripts/install.py claude-code` copies command templates from:

```text
commands/claude-code/
```

to:

```text
~/.claude/commands/
```

Claude command templates are intentionally lightweight. The reusable behavior remains in `skills/`.
