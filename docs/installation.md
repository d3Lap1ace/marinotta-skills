# Installation

Clone the repository:

```bash
git clone https://github.com/d3Lap1ace/marinotta-skills.git
cd marinotta-skills
```

Install all supported targets:

```bash
python3 scripts/install.py all
```

Install one target:

```bash
python3 scripts/install.py codex
python3 scripts/install.py agents
python3 scripts/install.py claude-code
```

Default destinations:

| Target | Destination |
| --- | --- |
| `codex` | `$CODEX_HOME/skills` or `~/.codex/skills` |
| `agents` | `$AGENTS_HOME/skills` or `~/.agents/skills` |
| `claude-code` | `~/.claude/commands` |

Use `--force` when updating an existing installation:

```bash
python3 scripts/install.py all --force
```

Preview actions without copying files:

```bash
python3 scripts/install.py all --dry-run
```
