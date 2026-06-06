# Skill Authoring

Add new reusable skills under `skills/<skill-name>/`.

Recommended structure:

```text
skills/<skill-name>/
  SKILL.md
  README.md
  agents/
  references/
  scripts/
  examples/
```

Rules:

- `SKILL.md` is the source of truth for agent behavior.
- `README.md` is for people browsing GitHub.
- Keep helper scripts self-contained when possible.
- Put prompts or model profiles in `agents/`.
- Put templates, style guides, and examples in `references/` or `examples/`.
- Avoid generated outputs and local secrets in skill directories.

Run validation before publishing:

```bash
python3 scripts/validate.py
```
