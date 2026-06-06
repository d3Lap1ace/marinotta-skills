#!/usr/bin/env python3
"""Validate repository structure for reusable skills."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"
COMMANDS_DIR = ROOT / "commands" / "claude-code"


def parse_frontmatter(text: str) -> dict[str, str]:
    match = re.match(r"---\n(.*?)\n---\n", text, flags=re.DOTALL)
    if not match:
        return {}
    fields: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        fields[key.strip()] = value.strip()
    return fields


def validate_skills() -> list[str]:
    issues: list[str] = []
    if not SKILLS_DIR.is_dir():
        return ["missing skills/ directory"]

    for skill_dir in sorted(path for path in SKILLS_DIR.iterdir() if path.is_dir()):
        skill_file = skill_dir / "SKILL.md"
        readme_file = skill_dir / "README.md"
        if not skill_file.is_file():
            issues.append(f"{skill_dir.relative_to(ROOT)} is missing SKILL.md")
            continue
        if not readme_file.is_file():
            issues.append(f"{skill_dir.relative_to(ROOT)} is missing README.md")

        fields = parse_frontmatter(skill_file.read_text(encoding="utf-8"))
        if fields.get("name") != skill_dir.name:
            issues.append(
                f"{skill_file.relative_to(ROOT)} frontmatter name must be {skill_dir.name!r}"
            )
        if not fields.get("description"):
            issues.append(f"{skill_file.relative_to(ROOT)} is missing description")
    return issues


def validate_commands() -> list[str]:
    issues: list[str] = []
    if not COMMANDS_DIR.is_dir():
        return issues
    for command in sorted(COMMANDS_DIR.glob("*.md")):
        text = command.read_text(encoding="utf-8")
        if ".agents/skills" in text or ".claude/commands" in text:
            issues.append(f"{command.relative_to(ROOT)} still references old hidden paths")
    return issues


def main() -> int:
    issues = validate_skills() + validate_commands()
    if issues:
        for issue in issues:
            print(f"error: {issue}", file=sys.stderr)
        return 1
    print("ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
