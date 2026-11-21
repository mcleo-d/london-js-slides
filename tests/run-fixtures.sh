#!/usr/bin/env bash
# Fixture test harness for scripts/check-announcement.sh /
# scripts/check_announcement.py. Exercises the valid case, one fixture per
# failing rule, and the other-files warn-but-pass case, directly against
# fixture files -- no git repo or GitHub Actions needed.
#
# Usage: bash tests/run-fixtures.sh

set -euo pipefail

TEST_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$TEST_DIR/.." && pwd)"
FIXTURES="$TEST_DIR/fixtures"
CHECK="$REPO_ROOT/scripts/check-announcement.sh"

PASS_COUNT=0
FAIL_COUNT=0

run_case() {
  local name="$1" head="$2" expect_exit="$3" expect_grep="$4" changed="${5:-}"
  local args=(--base-file "$FIXTURES/base-entry.html" --head-file "$FIXTURES/$head" --entry-name "entry.html")
  if [ -n "$changed" ]; then
    args+=(--changed-files-file "$FIXTURES/$changed")
  fi

  local output exit_code
  set +e
  output="$(bash "$CHECK" "${args[@]}" 2>&1)"
  exit_code=$?
  set -e

  local ok=1
  if [ "$exit_code" -ne "$expect_exit" ]; then
    ok=0
  fi
  if [ -n "$expect_grep" ] && ! printf '%s' "$output" | grep -qF -- "$expect_grep"; then
    ok=0
  fi

  if [ "$ok" -eq 1 ]; then
    echo "PASS: $name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "FAIL: $name (exit $exit_code, expected $expect_exit; looked for: $expect_grep)"
    echo "$output" | sed 's/^/    /'
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

run_case "valid announcement passes"            head-valid.html          0 "check-announcement: PASS."             changed-files-entry-only.txt
run_case "too many announcements fails"          head-too-many.html       1 "FAIL [too-many-announcements]"         changed-files-entry-only.txt
run_case "missing attribute fails"               head-missing-attr.html   1 "FAIL [missing-attribute]"              changed-files-entry-only.txt
run_case "non-https link fails"                  head-bad-link.html       1 "FAIL [link-not-https]"                 changed-files-entry-only.txt
run_case "title over limit fails"                head-too-long.html       1 "FAIL [title-too-long]"                 changed-files-entry-only.txt
run_case "wrong position fails"                  head-wrong-position.html 1 "FAIL [wrong-position]"                 changed-files-entry-only.txt
run_case "curly quote delimiters fail"           head-curly-quotes.html   1 "FAIL [curly-quotes]"                   changed-files-entry-only.txt
run_case "other files changed warns but passes"  head-valid.html          0 "WARN [other-files-changed]"            changed-files-other.txt

echo
echo "fixture tests: $PASS_COUNT passed, $FAIL_COUNT failed"
[ "$FAIL_COUNT" -eq 0 ]
