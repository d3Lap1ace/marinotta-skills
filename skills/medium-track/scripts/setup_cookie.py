#!/usr/bin/env python3
"""Write ~/.config/medium-track/config.json with the user's Medium sid.

Accepts either a bare `sid` cookie value or a full `Cookie:` request header.
The value is validated (a `sid` token must be present) and saved verbatim — a
full header is kept whole so the fetcher can send the entire session, which some
member-only stories require. File mode is set to 0600.
"""
from __future__ import annotations

import argparse
import json
import os
import stat
import sys
from pathlib import Path

CONFIG_DIR = Path.home() / ".config" / "medium-track"
CONFIG_PATH = CONFIG_DIR / "config.json"

PROMPT = """\
Paste your Medium sid cookie (or the whole `Cookie:` header — we'll pick out
sid for you). Where to find it:

  Chrome:  DevTools -> Application -> Cookies -> https://medium.com -> sid
  Firefox: DevTools -> Storage     -> Cookies -> https://medium.com -> sid
  Safari:  Web Inspector -> Storage -> Cookies -> medium.com -> sid

The value is saved only to {path} (mode 0600) and is never uploaded.
""".format(path=CONFIG_PATH)


def extract_sid(cookie_value: str) -> str | None:
    value = cookie_value.strip()
    if not value:
        return None
    if "=" in value:
        for part in value.split(";"):
            part = part.strip()
            if part.startswith("sid="):
                return part[len("sid="):].strip()
        return None
    return value


def write_config(sid_value: str) -> Path:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    CONFIG_PATH.write_text(
        json.dumps({"sid": sid_value}, indent=2) + "\n", encoding="utf-8"
    )
    os.chmod(CONFIG_PATH, stat.S_IRUSR | stat.S_IWUSR)
    return CONFIG_PATH


def confirm_overwrite() -> bool:
    if not CONFIG_PATH.exists():
        return True
    answer = input(f"Overwrite existing {CONFIG_PATH}? [y/N] ").strip().lower()
    return answer in ("y", "yes")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Configure Medium sid cookie.")
    parser.add_argument(
        "--sid",
        help="Cookie value: either a bare sid or a full Cookie header (skips prompt)",
    )
    parser.add_argument("--force", action="store_true", help="Overwrite without confirmation")
    args = parser.parse_args(argv)

    if args.sid:
        raw = args.sid.strip()
    else:
        print(PROMPT)
        raw = input("> ").strip()

    if not raw:
        sys.stderr.write("medium-track: empty value; aborting.\n")
        return 1

    sid = extract_sid(raw)
    if not sid:
        sys.stderr.write(
            "medium-track: that looks like a Cookie header but has no `sid=...` token. "
            "Make sure you are signed in to Medium.\n"
        )
        return 1

    if not args.force and not confirm_overwrite():
        sys.stderr.write("medium-track: aborted by user.\n")
        return 1

    path = write_config(raw)
    print(f"OK. Saved to {path} (mode 0600). sid token length: {len(sid)}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
