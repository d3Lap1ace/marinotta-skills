---
description: Automatically review code with Claude and apply fixes based on feedback
argument-hint: [file-path or code snippet] — defaults to git recent changes if empty
---

Use these project instructions:
- @.agents/skills/auto-code-review/SKILL.md

Task:
1. Identify the code to review:
   - If `$ARGUMENTS` is provided and looks like a file path, read that file
   - If `$ARGUMENTS` is provided but not a path, treat it as a code snippet
   - If `$ARGUMENTS` is empty, use git to find recently modified files:
     - Check `git status --short` for staged/unstaged changes
     - If no uncommitted changes, use `git diff --name-only HEAD~1` for last commit's files
     - Review the most relevant code file from the results

2. Call the Claude API to perform a comprehensive code review.

3. Parse the review feedback and categorize issues (critical, important, suggestions).

4. Apply the fixes automatically to the code.

5. Present a summary of changes made with before/after comparison for significant changes.
