# medium-track

Fetch a Medium article (including member-only paywalled posts via your own Medium membership cookie), then have Claude translate it into Simplified Chinese and produce a structured key-point summary. The translation and summary are delivered inline in the conversation — copy them out if you want to keep them. Nothing is written to disk on the skill's behalf.

> **Membership required.** This skill needs your personal Medium `sid` cookie to read paywalled member-only stories. It cannot bypass the paywall; it just uses your existing paid access.

## Install

With the [skills CLI](https://skills.sh):

```bash
npx skills add d3Lap1ace/marinotta-skills --skill medium-track -g
```

Then install Python dependencies and configure your Medium cookie once:

```bash
pip install requests beautifulsoup4 markdownify
python3 ~/.claude/skills/medium-track/scripts/setup_cookie.py
```

(If you installed per-project instead of with `-g`, the script lives at `.claude/skills/medium-track/scripts/setup_cookie.py`.)

After that, paste a Medium URL into Claude Code and ask "翻译并提炼这篇". The skill triggers automatically.

## Getting your `sid` cookie

This skill never logs in for you. You paste the cookie value from your own browser, exactly once. If it expires later, you redo this step.

1. Sign in to https://medium.com in your browser.
2. Open DevTools:
   - **Chrome**: `Cmd+Opt+I` → **Application** → **Cookies** → `https://medium.com`
   - **Firefox**: `Cmd+Opt+I` → **Storage** → **Cookies** → `https://medium.com`
   - **Safari**: enable Develop menu, then **Develop → Show Web Inspector → Storage → Cookies**
3. Either (a) find the cookie named `sid` and copy its **value** (a long opaque string), OR (b) copy the whole `Cookie:` request header from the Network tab — the setup script auto-extracts the `sid` token either way.
4. Save the value using **one of the three methods below**.

> The file is the **only** source of authentication this skill reads. There is no env var, no browser auto-extraction, no remote config.

## Three ways to save the cookie

Once you have the `sid` value (or full `Cookie:` header), pick whichever is easiest. All three end up writing the same `~/.config/medium-track/config.json` at mode `0600`.

1. **Interactive script** — run it and paste when prompted:
   ```bash
   python3 ~/.claude/skills/medium-track/scripts/setup_cookie.py
   ```
2. **Manual file** — create `~/.config/medium-track/config.json` yourself:
   ```json
   { "sid": "<your-sid-value>" }
   ```
   then `chmod 600` it.
3. **Let the agent do it** — paste your `sid` into Claude Code and say "用这个 sid 配置 medium-track". The agent runs `setup_cookie.py --sid '<value>' --force` for you. Handy when cookie extraction fails or you'd rather not touch the terminal. (Your sid is your Medium login — only paste it into a session you trust.)

## Privacy

- Your `sid` cookie is stored only in `~/.config/medium-track/config.json`, locally, with file permission `0600`.
- The skill's only network destination is `medium.com` (and its custom-domain hosts for articles). No telemetry, no third-party services, no mirror sites.
- The fetcher prints the cleaned Markdown to stdout; the translation and summary appear inline in the conversation. The skill never writes article content to disk on its own.

## When the cookie expires

You'll see an error message like:

```
medium-track: redirected to sign-in (...). Cookie likely expired.

Please configure it once:
  ...
```

Just grab a fresh `sid` and save it again with any of the three methods above. Cookies on Medium typically last weeks to months.

## Security notes

- The `sid` cookie is functionally equivalent to your Medium login. **Never share it, paste it in chat, or commit it.**
- If you suspect leakage, sign out of all sessions in your Medium account settings (this invalidates the cookie), then re-grab a fresh one.
- The skill performs no scraping outside `medium.com` itself. No paywall bypass, no third-party mirror.

## Legal

For personal use by a paying Medium member to read content you already have access to. You are responsible for your own use under [Medium's Terms of Service](https://policy.medium.com/medium-terms-of-service-9db0094a1e0f).

## Layout

```
medium-track/
├── .claude-plugin/plugin.json   Plugin manifest
├── SKILL.md                     Skill entrypoint (loaded by Claude Code)
├── README.md                    This file
└── scripts/
    ├── fetch_medium.py          Fetch URL with cookie, output cleaned Markdown
    └── setup_cookie.py          Interactive sid-cookie configurator
```
