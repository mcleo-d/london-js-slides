#!/usr/bin/env bash
set -euo pipefail

SLUG="${1:-}"

usage() {
  echo "Usage: $0 <event-slug>" >&2
  echo "  e.g. $0 july-2026" >&2
  exit 1
}

if [ -z "$SLUG" ]; then
  echo "ERROR: event slug is required." >&2
  usage
fi

# Validate: only lowercase letters, digits, and hyphens
if ! echo "$SLUG" | grep -qE '^[a-z0-9][a-z0-9-]*[a-z0-9]$'; then
  echo "ERROR: slug must contain only lowercase letters, digits, and hyphens, with no leading/trailing hyphens." >&2
  exit 1
fi

BRANCH="archive/${SLUG}"

# Refuse dirty working tree
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: working tree is dirty. Commit or stash changes before archiving." >&2
  exit 1
fi

# Fetch latest state from remote
git fetch origin --quiet

# Check if the branch already exists on the remote
if git ls-remote --exit-code origin "refs/heads/${BRANCH}" > /dev/null 2>&1; then
  echo "INFO: branch '${BRANCH}' already exists on origin. Nothing to do (idempotent)."
  exit 0
fi

# Cut the archive branch from origin/main
echo "Cutting '${BRANCH}' from origin/main ..."
git checkout -b "$BRANCH" "origin/main"
git push origin "$BRANCH"
echo "Done. Branch '${BRANCH}' is now live on origin."
echo ""
echo "Next steps:"
echo "  1. Add any event-specific archival notes or final slide tweaks on '${BRANCH}'."
echo "  2. Confirm the branch is visible in the GitHub repository."
echo "  3. Update CHANGELOG.md on main to reference the archive branch."
