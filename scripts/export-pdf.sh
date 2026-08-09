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
#   URL         http://localhost:8765/<entry HTML discovered at runtime>
#   OUTPUT_PATH ./output.pdf

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT=8765

# Discover the entry HTML at runtime: prefer netlify.toml's redirect target,
# falling back to the newest "London JS - *.html" file in the repo root.
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

  local newest
  newest=$(ls -t "$REPO_ROOT"/London\ JS\ -\ *.html 2>/dev/null | head -1 || true)
  if [ -n "$newest" ]; then
    basename "$newest"
  fi
}

if [ -z "${1:-}" ]; then
  ENTRY_FILE="$(find_entry_file)"
  if [ -z "$ENTRY_FILE" ]; then
    echo "export-pdf: could not discover entry HTML from netlify.toml or repo tree" >&2
    exit 1
  fi
  URL="http://localhost:${PORT}/$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$ENTRY_FILE")"
else
  URL="$1"
fi
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
