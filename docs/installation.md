# Installation

## skills CLI (recommended)

Install directly from GitHub with the [skills CLI](https://skills.sh):

```bash
npx skills add d3Lap1ace/marinotta-skills
```

Useful variants:

```bash
# Install all skills without prompts
npx skills add d3Lap1ace/marinotta-skills --skill '*'

# Install a single skill
npx skills add d3Lap1ace/marinotta-skills --skill exchange-rate

# Install globally (user-level) instead of per-project
npx skills add d3Lap1ace/marinotta-skills -g
```

Manage installed skills:

```bash
npx skills list
npx skills remove <name>
```

## Manual install script

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
