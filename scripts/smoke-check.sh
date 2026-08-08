#!/usr/bin/env bash
# Smoke-checks the london-js-slides presentation.
# Steps:
#   1. Starts python3 -m http.server in the background on a free port.
#   2. Curls the entry HTML and asserts a 200 response.
#   3. If Chrome/Chromium is available, dumps the rendered DOM and greps for
#      Babel syntax errors.  Chrome step is skipped (with a notice) if absent.
#   4. Always kills the background server, even on error.
#   5. Exits 0 only when all available checks pass.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT=18080
ENTRY_FILE="London JS - April 2026.html"
URL="http://localhost:${PORT}/$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$ENTRY_FILE")"
SERVER_PID=""

cleanup() {
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" 2>/dev/null || true
    echo "smoke-check: server stopped (pid $SERVER_PID)"
  fi
}
trap cleanup EXIT

echo "smoke-check: starting http.server on port $PORT in $REPO_ROOT"
(cd "$REPO_ROOT" && python3 -m http.server "$PORT" &>/dev/null) &
SERVER_PID=$!

# Wait up to 5 seconds for server to be ready.
for i in $(seq 1 10); do
  curl -sf --max-time 1 "http://localhost:${PORT}/" &>/dev/null && break || true
  sleep 0.5
done

echo "smoke-check: fetching $URL"
HTTP_STATUS=$(curl -s -o /tmp/smoke_page.html -w "%{http_code}" "$URL")

if [ "$HTTP_STATUS" != "200" ]; then
  echo "smoke-check: FAIL - HTTP status $HTTP_STATUS for $URL" >&2
  exit 1
fi

echo "smoke-check: HTTP $HTTP_STATUS OK"

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
  echo "smoke-check: Chrome not found; skipping DOM/Babel check (host-side only)."
  echo "smoke-check: PASS (static HTTP check only)"
  exit 0
fi

echo "smoke-check: dumping DOM via headless Chrome"
"$CHROME" \
  --headless \
  --disable-gpu \
  --no-sandbox \
  --dump-dom \
  "$URL" 2>/tmp/smoke_chrome_stderr.txt > /tmp/smoke_dom.html || true

if grep -qi "SyntaxError\|Babel.*error\|Uncaught.*Error" /tmp/smoke_dom.html /tmp/smoke_chrome_stderr.txt 2>/dev/null; then
  echo "smoke-check: FAIL - Babel/JS syntax error detected in rendered page" >&2
  grep -i "SyntaxError\|Babel.*error\|Uncaught.*Error" /tmp/smoke_dom.html /tmp/smoke_chrome_stderr.txt >&2 || true
  exit 1
fi

echo "smoke-check: no Babel/JS errors found"
echo "smoke-check: PASS"
