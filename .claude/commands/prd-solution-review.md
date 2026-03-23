---
description: Analyze the repo and draft a concise review-ready solution from a PRD or requirements doc
argument-hint: [prd-path or requirement summary]
---

Use these project instructions:
- @.agents/skills/prd-solution-review/SKILL.md
- @.agents/skills/prd-solution-review/references/review-template.md

Task:
1. Analyze the current project structure and identify only the modules relevant to the requested change.
2. Read the PRD or requirements from `$ARGUMENTS`. If `$ARGUMENTS` looks like a file path, open that file. If it is plain text, treat it as the requirement content.
3. Produce a concise review-ready solution with these sections:
   - Context
   - Proposed Solution
   - Risks and Questions
   - Validation
4. Keep the response short and decision-oriented. Separate confirmed facts from assumptions.
