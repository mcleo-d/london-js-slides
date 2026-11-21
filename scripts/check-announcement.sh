#!/usr/bin/env bash
# Validates community announcement slides added to the entry HTML in a pull
# request. Delegates the actual rules to scripts/check_announcement.py and
# only handles discovering the entry HTML and diffing it against the pull
# request base (see README.md, "Add an announcement slide").
#
# Usage (CI, default): bash scripts/check-announcement.sh
#   Diffs the entry HTML between origin/$GITHUB_BASE_REF (default: main) and
#   the current checkout, and the full list of changed files between them.
#
# Usage (fixture tests): bash scripts/check-announcement.sh \
#   --base-file <path> --head-file <path> [--entry-name <name>] \
#   [--changed-files-file <path>]
#   Skips git entirely and validates the two files directly. Used by
#   tests/run-fixtures.sh.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

BASE_FILE=""
HEAD_FILE=""
ENTRY_NAME=""
CHANGED_FILES_FILE=""

while [ $# -gt 0 ]; do
  case "$1" in
    --base-file) BASE_FILE="$2"; shift 2 ;;
    --head-file) HEAD_FILE="$2"; shift 2 ;;
    --entry-name) ENTRY_NAME="$2"; shift 2 ;;
    --changed-files-file) CHANGED_FILES_FILE="$2"; shift 2 ;;
    *) echo "check-announcement: unknown argument: $1" >&2; exit 1 ;;
  esac
done

# Discover the entry HTML at runtime (same approach as scripts/smoke-check.sh):
# prefer netlify.toml's redirect target, falling back to the newest
# "London JS - *.html" file in the repo root.
find_entry_file() {
  local target
  target=$(awk '
    /^\[\[redirects\]\]/ { f=1; next }
    /^\[\[/ { f=0 }
    f && /^[[:space:]]*to[[:space:]]*=/ {
      gsub(/^[[:space:]]*to[[:space:]]*=[[:space:]]*"/, "")
      gsub(/"[[:space:]]*$/, "")
      print
      exit
    }
  ' "$REPO_ROOT/netlify.toml" 2>/dev/null || true)

  if [ -n "$target" ]; then
    python3 -c "import urllib.parse,sys; print(urllib.parse.unquote(sys.argv[1]).lstrip('/'))" "$target"
    return 0
  fi

  local f newest="" newest_mtime=-1 mtime
  for f in "$REPO_ROOT"/London\ JS\ -\ *.html; do
    [ -e "$f" ] || continue
    mtime=$(stat -c %Y "$f" 2>/dev/null || stat -f %m "$f" 2>/dev/null || echo -1)
    if [ "$mtime" -gt "$newest_mtime" ]; then
      newest_mtime="$mtime"
      newest="$f"
    fi
  done
  if [ -n "$newest" ]; then
    basename "$newest"
  fi
}

CLEANUP_FILES=()
cleanup() {
  local f
  for f in "${CLEANUP_FILES[@]}"; do
    rm -f "$f"
  done
}
trap cleanup EXIT

if [ -z "$BASE_FILE" ] || [ -z "$HEAD_FILE" ]; then
  # CI / git mode: diff the entry HTML between the pull request base and HEAD.
  DISCOVERED_ENTRY_FILE="$(find_entry_file)"
  if [ -z "$DISCOVERED_ENTRY_FILE" ]; then
    echo "check-announcement: FAIL - could not discover entry HTML from netlify.toml or repo tree" >&2
    exit 1
  fi
  HEAD_FILE="$REPO_ROOT/$DISCOVERED_ENTRY_FILE"
  [ -n "$ENTRY_NAME" ] || ENTRY_NAME="$DISCOVERED_ENTRY_FILE"

  BASE_REF="${GITHUB_BASE_REF:-main}"
  if ! git -C "$REPO_ROOT" rev-parse --verify "origin/${BASE_REF}" &>/dev/null; then
    git -C "$REPO_ROOT" fetch --no-tags origin "${BASE_REF}" &>/dev/null || true
  fi
  if ! git -C "$REPO_ROOT" rev-parse --verify "origin/${BASE_REF}" &>/dev/null; then
    echo "check-announcement: FAIL - could not resolve base ref origin/${BASE_REF}" >&2
    exit 1
  fi

  BASE_FILE="$(mktemp /tmp/check_announcement_base.XXXXXX.html)"
  CLEANUP_FILES+=("$BASE_FILE")
  if ! git -C "$REPO_ROOT" show "origin/${BASE_REF}:${DISCOVERED_ENTRY_FILE}" > "$BASE_FILE" 2>/dev/null; then
    : > "$BASE_FILE"  # Entry file is new on this PR; treat base as empty.
  fi

  if [ -z "$CHANGED_FILES_FILE" ]; then
    CHANGED_FILES_FILE="$(mktemp /tmp/check_announcement_changed.XXXXXX.txt)"
    CLEANUP_FILES+=("$CHANGED_FILES_FILE")
    git -C "$REPO_ROOT" diff --name-only "origin/${BASE_REF}...HEAD" > "$CHANGED_FILES_FILE" 2>/dev/null || \
      git -C "$REPO_ROOT" diff --name-only "origin/${BASE_REF}" HEAD > "$CHANGED_FILES_FILE"
  fi
else
  [ -n "$ENTRY_NAME" ] || ENTRY_NAME="$(basename "$HEAD_FILE")"
fi

PY_ARGS=(--base-file "$BASE_FILE" --head-file "$HEAD_FILE" --entry-name "$ENTRY_NAME")
if [ -n "$CHANGED_FILES_FILE" ]; then
  PY_ARGS+=(--changed-files-file "$CHANGED_FILES_FILE")
fi

set +e
OUTPUT="$(python3 "$REPO_ROOT/scripts/check_announcement.py" "${PY_ARGS[@]}")"
RESULT=$?
set -e

echo "$OUTPUT"

if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  {
    echo "## Announcement slide check"
    echo '```'
    echo "$OUTPUT"
    echo '```'
  } >> "$GITHUB_STEP_SUMMARY"
fi

exit "$RESULT"
