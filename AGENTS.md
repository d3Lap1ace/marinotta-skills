# Project Instructions

- This repository ships reusable Codex skills:
  - `.agents/skills/prd-solution-review` — Use `$prd-solution-review` when the user asks to analyze project structure and then draft a concise review-ready solution from a PRD or requirements doc.
  - `.agents/skills/auto-code-review` — Use `$auto-code-review` when the user asks to automatically review code and apply fixes based on Claude's feedback.

- Keep outputs short and decision-oriented.

- In Claude Code, project commands are defined in `.claude/commands/`:
  - `/prd-solution-review` — Analyze repo and draft solution from PRD
  - `/auto-code-review` — Automatically review and fix code
