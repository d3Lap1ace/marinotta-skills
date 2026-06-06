---
description: Fetch a Medium article, translate it to Simplified Chinese, and produce a structured summary inline
argument-hint: [medium article url]
---

Use the `medium-track` skill workflow. In this repository, the source lives at:
- `skills/medium-track/SKILL.md`
- `skills/medium-track/scripts/fetch_medium.py`
- `skills/medium-track/scripts/setup_cookie.py`

Task:
1. Confirm `$ARGUMENTS` points to a Medium article (`medium.com`, `*.medium.com`, or a known Medium custom domain). If not, ask the user before continuing.
2. Run `python3 skills/medium-track/scripts/fetch_medium.py $ARGUMENTS` to fetch the article. The fetcher reads the user's sid cookie from `~/.config/medium-track/config.json`.
3. If the fetcher exits non-zero, relay its stderr verbatim to the user — it already contains the setup instructions.
4. On success, translate the article body into Simplified Chinese following the Translation Prompt in `SKILL.md` and produce the four-section summary from the Summary Prompt.
5. Output inline in this order: `# <title>` → `## 译文` → `## 要点` → 「需要保存请直接复制上面内容。」 Do not write anything to disk.
