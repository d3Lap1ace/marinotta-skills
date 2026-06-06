---
name: auto-code-review
description: Automatically review code using Claude API and apply fixes based on feedback. Use when you want automated code review with self-healing capabilities.
---

# Auto Code Review

## Workflow

1. **Input Analysis**
   - Accept a file path, code snippet, or no input (auto-detect)
   - If no input provided: use git to find recently modified files
     - Check `git status --short` for staged/unstaged changes
     - If no uncommitted changes, use `git diff --name-only HEAD~1` for last commit's files
     - Select the most relevant code file from results
   - Determine the programming language and context
   - Extract relevant code for review

2. **Code Review via Claude API**
   - Call Claude API with a comprehensive review prompt
   - Request analysis of: code quality, bugs, security issues, performance, best practices
   - Ask for specific, actionable feedback with line numbers

3. **Feedback Processing**
   - Parse and categorize review results:
     - **Critical**: Bugs, security vulnerabilities, crashes
     - **Important**: Performance issues, code smells, anti-patterns
     - **Suggestions**: Style improvements, optimizations

4. **Auto-Fix Application**
   - Apply critical and important fixes automatically
   - For suggestions, ask user confirmation if changes are substantial
   - Preserve code intent while improving quality

5. **Summary Report**
   - List all issues found and their severity
   - Show before/after for significant changes
   - Provide rationale for each fix

## Review Prompt Template

```
Please review the following code for:
1. Bugs and logical errors
2. Security vulnerabilities
3. Performance issues
4. Code quality and maintainability
5. Best practices violations

Language: {language}
Code:
{code}

Provide feedback in JSON format:
{
  "critical": [{"line": number, "issue": "description", "fix": "suggested code"}],
  "important": [{"line": number, "issue": "description", "fix": "suggested code"}],
  "suggestions": [{"line": number, "issue": "description", "fix": "suggested code"}]
}
```

## Output Rules

- Always show what was changed and why
- Preserve existing code style unless it's problematic
- For ambiguous fixes, prefer safer options
- If a fix could break functionality, flag it for manual review

## Error Handling

- If API call fails, report error and retry once
- If JSON parsing fails, ask for feedback in natural language format
- If code cannot be read, validate file path and permissions
