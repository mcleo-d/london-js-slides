.PHONY: dev smoke pdf pdf-chrome render render-setup fix-quotes install-hooks

dev:
	python3 -m http.server 8765

smoke:
	bash scripts/smoke-check.sh

# Headless render check and PDF export (tools/render/README.md). Serves on
# PORT (default 8766), never 8765. Output goes to tools/render/out/ (ignored).
render: tools/render/node_modules
	cd tools/render && node render-check.mjs

# Same run as render, without writing PNGs. Replaces the old Chrome-based
# target, which is still available as pdf-chrome.
pdf: tools/render/node_modules
	cd tools/render && node render-check.mjs --pdf-only

pdf-chrome:
	bash scripts/export-pdf.sh

render-setup: tools/render/node_modules

tools/render/node_modules: tools/render/package-lock.json
	cd tools/render && npm ci && PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install chromium
	touch tools/render/node_modules

fix-quotes:
	python3 scripts/fix-curly-quotes.py .

install-hooks:
	bash scripts/install-hooks.sh
