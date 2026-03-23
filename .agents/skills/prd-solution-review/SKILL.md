---
name: prd-solution-review
description: Analyze an existing project structure, combine the findings with a PRD or requirements doc, and write a concise solution proposal for review. Use when Codex needs to inspect a repo, identify the relevant architecture and impacted modules, map requirements to implementation changes, or draft a short review-ready technical plan.
---

# PRD Solution Review

## Workflow

1. Build context from the project.
- Inspect top-level directories, manifests, build and test config, entrypoints, and nearby docs.
- Identify the stack, module boundaries, data flow, integrations, and obvious constraints.
- Stop after the architecture is clear; avoid deep reading in unrelated areas.

2. Read the PRD or requirements.
- Extract the goal, scope, user-visible changes, constraints, non-goals, and acceptance signals.
- Note ambiguity, missing acceptance criteria, and items that need product or engineering confirmation.

3. Map the requirements to the codebase.
- List the files, modules, APIs, schemas, jobs, pages, or services most likely to change.
- Call out dependencies, rollout needs, data migration risk, and test impact.
- Separate confirmed facts from assumptions.

4. Write the review-ready solution.
- Keep it short and decision-oriented.
- Prefer four sections or fewer.
- Use the template in [references/review-template.md](references/review-template.md) when helpful.

## Output Rules

- Optimize for review, not for exhaustive implementation detail.
- Mention only the parts of the codebase that matter to the requested change.
- Name concrete files or modules when known.
- State assumptions explicitly.
- If the repository or PRD is incomplete, say what is missing and still produce the smallest useful proposal.

## Default Output Shape

### Context

Summarize the relevant current structure in one or two sentences.

### Proposed Solution

Describe the implementation approach and the main impacted areas.

### Risks and Questions

List the main tradeoffs, unknowns, and decisions needed for review.

### Validation

List the key test, rollout, or verification steps.
