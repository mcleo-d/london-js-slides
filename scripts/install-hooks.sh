#!/usr/bin/env bash
# Installs a Git pre-commit hook that runs fix-curly-quotes.py in check mode.
# The commit is blocked if the script reports any JSX attribute curly quotes
# that would be replaced.  Idempotent: re-running is safe and updates the hook.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"
HOOK_FILE="$HOOKS_DIR/pre-commit"
SCRIPT="$REPO_ROOT/scripts/fix-curly-quotes.py"

if [ ! -f "$SCRIPT" ]; then
  echo "install-hooks: scripts/fix-curly-quotes.py not found at $SCRIPT" >&2
  exit 1
fi

mkdir -p "$HOOKS_DIR"

cat > "$HOOK_FILE" <<'HOOK'
#!/usr/bin/env bash
# pre-commit hook: block commits containing curly-quote JSX attribute delimiters.
set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
exec python3 "$REPO_ROOT/scripts/fix-curly-quotes.py" --check "$REPO_ROOT"
HOOK

chmod +x "$HOOK_FILE"

echo "install-hooks: pre-commit hook installed at $HOOK_FILE"
