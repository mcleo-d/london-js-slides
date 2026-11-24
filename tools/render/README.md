# Render check and PDF export

Headless check of the deck at a true 1920x1080 viewport, plus a 16:9 PDF export.
Playwright lives here only. There is no `package.json` or lockfile at the repo
root, so the Netlify build is unaffected (the root is published as-is and
`tools/` is not served by the render server).

## Setup (once)

```sh
make render-setup
```

This runs `npm ci` in `tools/render/` and installs Playwright's Chromium inside
`tools/render/node_modules/`. Needs Node 18 or later and network access.

The install is keyed to the pinned Playwright version through a stamp file, `tools/render/node_modules/.pw-<version>`, so `make render-setup` reinstalls the browser when that version changes in `package.json` and skips it when unchanged.

## Usage

```sh
make render   # PNGs, per-slide report and PDF
make pdf      # same run, PDF and report only (no PNGs)
```

Or directly: `cd tools/render && node render-check.mjs [--pdf-only]`.

`make pdf` used to run `scripts/export-pdf.sh` (Chrome headless, port 8765). That
script is unchanged and is now `make pdf-chrome`.

## What it does

1. Finds the entry HTML from the root redirect in `netlify.toml` and prints it.
2. Serves the repo root on `PORT` (default `8766`) and stops the server on exit.
   Port 8765 is the review server and is refused. If the port is busy it exits
   without touching whatever is listening.
3. Opens the entry at 1920x1080, then steps through every `<section>` in play
   order with the right arrow key. After each step it waits for network idle,
   then 500 ms.
4. Saves one PNG per slide and checks the slide.
5. Exports `deck.pdf` from the same page using the deck's print layout, one slide
   per page, and checks the page count equals the section count.

Output goes to `tools/render/out/` (git-ignored): `NN-label.png` and `deck.pdf`.

## Per-slide checks

| Check | Severity |
|---|---|
| Console errors, page errors, failed requests, HTTP 4xx/5xx | fails the run |
| Broken `<img>` | fails the run |
| Any element past the 1080px bottom edge, or past the right, left or top edge | fails the run |
| Any element past the 984px bottom safe margin (but inside the edge) | warning |
| Horizontal overflow (document, section, or clipped overflow containers) | warning |

The exit code is non-zero on any failing check, or if the PDF page count does not
match the slide count.

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8766` | Port for the temporary server. `8765` is refused. |
| `PLAYWRIGHT_BROWSERS_PATH` | `0` | Keeps Chromium inside `node_modules`. |

The deck loads React and Babel from `https://unpkg.com`, so the run needs network
access to unpkg.
