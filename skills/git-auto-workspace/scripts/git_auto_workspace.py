#!/usr/bin/env python3
"""Resolve GitHub remotes to the user's canonical local workspace path."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse


DEFAULT_BASE = Path.home() / "Code" / "Github.com"


class RemoteError(ValueError):
    pass


@dataclass(frozen=True)
class GitHubRepo:
    remote: str
    owner: str
    repo: str

    def workspace_path(self, base: Path) -> Path:
        return base.expanduser() / self.owner.lower() / self.repo


def strip_git_suffix(name: str) -> str:
    return name[:-4] if name.lower().endswith(".git") else name


def validate_segment(label: str, value: str) -> str:
    if not value or value in {".", ".."} or "/" in value or "\\" in value:
        raise RemoteError(f"invalid GitHub {label}: {value!r}")
    return value


def parse_github_remote(remote: str) -> GitHubRepo:
    raw = remote.strip()
    if not raw:
        raise RemoteError("missing remote URL")

    if "://" not in raw and ":" in raw:
        host_part, path_part = raw.split(":", 1)
        host = host_part.split("@")[-1].lower()
        if host != "github.com":
            raise RemoteError(f"expected github.com remote, got {host!r}")
        parts = path_part.strip("/").split("/")
    else:
        parsed = urlparse(raw)
        host = (parsed.hostname or "").lower()
        if host != "github.com":
            raise RemoteError(f"expected github.com remote, got {host!r}")
        parts = parsed.path.strip("/").split("/")

    if len(parts) != 2:
        raise RemoteError("remote must point to a GitHub repo root like owner/repo.git")

    owner = validate_segment("owner", parts[0])
    repo = validate_segment("repo", strip_git_suffix(parts[1]))
    return GitHubRepo(remote=raw, owner=owner, repo=repo)


def is_git_repo(path: Path) -> bool:
    return (path / ".git").exists()


def is_empty_dir(path: Path) -> bool:
    return path.is_dir() and not any(path.iterdir())


def ensure_directory(path: Path, *, dry_run: bool) -> None:
    if dry_run:
        return
    path.mkdir(parents=True, exist_ok=True)


def clone_repo(remote: str, target: Path, *, dry_run: bool) -> str:
    if is_git_repo(target):
        return "exists"
    if target.exists() and not is_empty_dir(target):
        raise RemoteError(f"target exists and is not an empty git repo: {target}")

    if dry_run:
        return "would-clone"

    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "clone", remote, str(target)], check=True)
    return "cloned"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Resolve a GitHub remote to ~/Code/Github.com/<owner>/<repo>."
    )
    parser.add_argument("remote", help="GitHub remote URL, e.g. git@github.com:owner/repo.git")
    parser.add_argument(
        "--base",
        default=str(DEFAULT_BASE),
        help="Workspace root. Defaults to ~/Code/Github.com.",
    )
    parser.add_argument("--mkdir", action="store_true", help="Create the target directory.")
    parser.add_argument("--clone", action="store_true", help="Clone into the target if absent.")
    parser.add_argument("--dry-run", action="store_true", help="Print the plan without changes.")
    parser.add_argument("--json", action="store_true", help="Print machine-readable details.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        repo = parse_github_remote(args.remote)
        target = repo.workspace_path(Path(args.base))
        action = "resolved"

        if args.clone:
            action = clone_repo(repo.remote, target, dry_run=args.dry_run)
        elif args.mkdir:
            ensure_directory(target, dry_run=args.dry_run)
            action = "would-create" if args.dry_run else "created"

        if args.json:
            print(
                json.dumps(
                    {
                        "action": action,
                        "remote": repo.remote,
                        "owner": repo.owner.lower(),
                        "repo": repo.repo,
                        "path": str(target),
                    },
                    ensure_ascii=False,
                )
            )
        else:
            print(target)
        return 0
    except (RemoteError, subprocess.CalledProcessError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
