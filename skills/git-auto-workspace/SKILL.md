---
name: git-auto-workspace
description: Resolve GitHub remote URLs into a deterministic local workspace path and create or clone the repository there. Use when Codex is given a GitHub git URL, SSH remote, or HTTPS remote and needs to run git commands, clone a repo, inspect a remote repository locally, or ensure missing local directories exist under the user's Code/Github.com owner and repo folder convention.
---

# Git Auto Workspace

Use this skill whenever a GitHub remote URL should become a local working directory before running git commands.

## Path Rule

- Map every GitHub repository to `~/Code/Github.com/<owner>/<repo>`.
- Lowercase `<owner>` because GitHub owner names are case-insensitive and the user's workspace convention is lowercase owners.
- Preserve `<repo>` as written after stripping a trailing `.git`.
- For `git@github.com:d3Lap1ace/gitso.git`, use `~/Code/Github.com/d3lap1ace/gitso`.

## Workflow

1. Resolve the target path with:
   ```bash
   python3 scripts/git_auto_workspace.py <remote-url>
   ```
2. Before cloning or running repository-local git commands, ensure the local workspace exists:
   ```bash
   python3 scripts/git_auto_workspace.py --mkdir <remote-url>
   ```
3. If the repo is not present locally and the user expects local work, clone through the helper:
   ```bash
   python3 scripts/git_auto_workspace.py --clone <remote-url>
   ```
4. Run follow-up git commands from the printed path.

## Safety Rules

- If the target path already contains a git repo, reuse it.
- If the target path exists, is non-empty, and is not a git repo, stop and ask before changing it.
- Do not clone GitHub repos into arbitrary current directories when a remote URL is provided; use the path rule.
- If the remote is not a GitHub repo root URL, ask the user for the intended local path.
