#!/usr/bin/env bash
# Smoke-checks the london-js-slides presentation.
# Steps:
#   1. Starts python3 -m http.server directly in the background (no subshell
#      wrapping the daemon) on a fixed port, so $! captures the real server
#      PID.
#   2. Curls the entry HTML (discovered at runtime) and asserts a 200
#      response.
#   3. If Chrome/Chromium is available, dumps the rendered DOM and greps for
#      Babel syntax errors.  Chrome step is skipped (with a notice) if absent.
#   4. A trap on EXIT kills the server PID on every exit path, so no listener
#      survives the script regardless of how it exits.
#   5. Exits 0 only when all available checks pass.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT=8765
SERVER_PID=""

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

ENTRY_FILE="$(find_entry_file)"
if [ -z "$ENTRY_FILE" ]; then
  echo "smoke-check: FAIL - could not discover entry HTML from netlify.toml or repo tree" >&2
  exit 1
fi

URL="http://localhost:${PORT}/$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$ENTRY_FILE")"

cleanup() {
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
    echo "smoke-check: server stopped (pid $SERVER_PID)"
  fi
}
trap cleanup EXIT

echo "smoke-check: starting http.server on port $PORT in $REPO_ROOT"
python3 -m http.server "$PORT" --directory "$REPO_ROOT" &>/dev/null &
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
