#!/usr/bin/env python3
"""Install Marinotta skills and Claude Code commands."""

from __future__ import annotations

import argparse
import os
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"
CLAUDE_COMMANDS_DIR = ROOT / "commands" / "claude-code"


def default_codex_home() -> Path:
    return Path(os.environ.get("CODEX_HOME", Path.home() / ".codex")).expanduser()


def default_agents_home() -> Path:
    return Path(os.environ.get("AGENTS_HOME", Path.home() / ".agents")).expanduser()


def copy_dir(src: Path, dest: Path, *, force: bool, dry_run: bool) -> str:
    if dest.exists() and not force:
        return f"skip existing {dest} (use --force to overwrite)"
    if dry_run:
        action = "replace" if dest.exists() else "copy"
        return f"{action} {src} -> {dest}"
    if dest.exists():
        shutil.rmtree(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(src, dest)
    return f"copied {src} -> {dest}"


def copy_file(src: Path, dest: Path, *, force: bool, dry_run: bool) -> str:
    if dest.exists() and not force:
        return f"skip existing {dest} (use --force to overwrite)"
    if dry_run:
        action = "replace" if dest.exists() else "copy"
        return f"{action} {src} -> {dest}"
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    return f"copied {src} -> {dest}"


def install_skills(dest_root: Path, *, force: bool, dry_run: bool) -> list[str]:
    messages: list[str] = []
    for skill_dir in sorted(path for path in SKILLS_DIR.iterdir() if path.is_dir()):
        messages.append(
            copy_dir(skill_dir, dest_root / skill_dir.name, force=force, dry_run=dry_run)
        )
    return messages


def install_claude_commands(*, force: bool, dry_run: bool) -> list[str]:
    dest_root = Path.home() / ".claude" / "commands"
    messages: list[str] = []
    for command in sorted(CLAUDE_COMMANDS_DIR.glob("*.md")):
        messages.append(copy_file(command, dest_root / command.name, force=force, dry_run=dry_run))
    return messages


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Install Marinotta skills.")
    parser.add_argument(
        "target",
        choices=("all", "codex", "agents", "claude-code"),
        help="Installation target.",
    )
    parser.add_argument("--force", action="store_true", help="Overwrite existing installed files.")
    parser.add_argument("--dry-run", action="store_true", help="Show actions without copying files.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    messages: list[str] = []

    if args.target in {"all", "codex"}:
        messages.extend(
            install_skills(default_codex_home() / "skills", force=args.force, dry_run=args.dry_run)
        )
    if args.target in {"all", "agents"}:
        messages.extend(
            install_skills(default_agents_home() / "skills", force=args.force, dry_run=args.dry_run)
        )
    if args.target in {"all", "claude-code"}:
        messages.extend(install_claude_commands(force=args.force, dry_run=args.dry_run))

    for message in messages:
        print(message)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
