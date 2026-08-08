.PHONY: dev smoke pdf fix-quotes install-hooks

dev:
	python3 -m http.server 8000

smoke:
	bash scripts/smoke-check.sh

pdf:
	bash scripts/export-pdf.sh

fix-quotes:
	python3 scripts/fix-curly-quotes.py .

install-hooks:
	bash scripts/install-hooks.sh
