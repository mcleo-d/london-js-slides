#!/usr/bin/env bash
# Exports the london-js-slides presentation to PDF using Chrome headless.
# Auto-detects google-chrome, Google Chrome (macOS app bundle), and chromium.
# Exits with a clear message if none are present (Chrome is not available in
# headless CI containers; this is expected and is a host-side operation).
# Idempotent: re-running overwrites the previous PDF output file.
#
# Usage:
#   ./scripts/export-pdf.sh [URL] [OUTPUT_PATH]
#
# Defaults:
#   URL         http://localhost:8000/London\ JS\ -\ April\ 2026.html
#   OUTPUT_PATH ./output.pdf

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
URL="${1:-http://localhost:8000/London%20JS%20-%20April%202026.html}"
OUTPUT="${2:-$REPO_ROOT/output.pdf}"

find_chrome() {
  for candidate in \
    "google-chrome" \
    "google-chrome-stable" \
    "chromium" \
    "chromium-browser" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  do
    if command -v "$candidate" &>/dev/null; then
      echo "$candidate"
      return 0
    fi
    if [ -x "$candidate" ]; then
      echo "$candidate"
      return 0
    fi
  done
  return 1
}

CHROME=$(find_chrome || true)

if [ -z "$CHROME" ]; then
  echo "export-pdf: no Chrome/Chromium binary found." >&2
  echo "  Install google-chrome, chromium, or run on macOS with Google Chrome." >&2
  echo "  This script is intended for host-side use; Chrome is not present in CI containers." >&2
  exit 1
fi

echo "export-pdf: using $CHROME"
echo "export-pdf: rendering $URL -> $OUTPUT"

"$CHROME" \
  --headless \
  --disable-gpu \
  --no-sandbox \
  --window-size=1920,1080 \
  --print-to-pdf="$OUTPUT" \
  "$URL"

echo "export-pdf: written to $OUTPUT"
