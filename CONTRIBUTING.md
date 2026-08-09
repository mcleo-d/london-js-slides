# Contributing to london-js-slides

This is the browser-based slide deck for the [London.js](https://www.meetup.com/london-javascript-community/) monthly meetup. There is no build step; the deck runs entirely in the browser.

---

## Branch naming

| Work type | Convention | Example |
|---|---|---|
| New event deck | `event/<month>-<year>-<host-slug>` | `event/october-2026-acme-corp` |
| Story / feature | `st<N>/<short-slug>` | `st383/contributor-docs` |
| Hotfix | `fix/<short-slug>` | `fix/broken-logo-path` |

All branches target `main`.

---

## Commit convention

This repo uses [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short imperative description
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`.  
Common scopes: `slides`, `html`, `assets`, `scripts`, `docs`.

Story reference goes at the end of the subject line in parentheses where applicable:

```
feat(slides): rebuild October 2026 deck for acme corp (ST-400)
docs: add contributing guide (ST-383)
```

---

## Pre-merge checklist

Before opening or merging a PR, run through every item below.

1. **Open in a browser via a local server** -- never from `file://` (Babel fetches `slides.jsx` via XHR).
   ```bash
   python3 -m http.server 8765
   # then open http://localhost:8765/London%20JS%20-%20[Month]%20[Year].html
   ```

2. **Walk every slide** using the keyboard:
   - `Right arrow` / `Space` -- next slide
   - `Left arrow` -- previous slide
   - Confirm all 12 slides render with no blank or broken content.

3. **Keyboard navigation** -- verify transitions feel correct end-to-end.

4. **Speaker notes** -- press `S` to toggle; confirm notes appear for any slides that carry them.

5. **Print preview** -- press `P` to enter PDF/print mode; confirm slide dimensions are correct and nothing is clipped.

6. **Check the `?v=N` cache-bust integer** has been incremented (see below).

7. **Run the curly-quote check** (see below) or confirm the pre-commit hook blocked any curly-quote regressions.

---

## Cache-bust convention (`?v=N`)

The Netlify CDN caches JS and JSX files with a one-year immutable TTL. After editing `slides.jsx` (or `reveals.js`), you **must** increment the integer on the corresponding `<script src>` tag inside the event HTML file, otherwise visitors see a stale deck.

Locate the line in `London JS - [Month] [Year].html`:

```html
<script type="text/babel" src="slides.jsx?v=75"></script>
```

Bump the number by one:

```html
<script type="text/babel" src="slides.jsx?v=76"></script>
```

Do the same for `reveals.js?v=N` if you change that file. You do **not** need to bump `deck-stage.js` or `tweaks-panel.jsx` as they carry no version query string; if you modify them, add one.

---

## Curly-quote footgun

Some editors silently replace straight ASCII double quotes (`"`) with Unicode curly quotes (`"` `"`) inside JSX attribute values. Babel standalone rejects curly quotes and the slides go blank with a syntax error -- there is no on-screen error message, just a blank screen.

### Install the pre-commit hook (once per clone)

```bash
bash scripts/install-hooks.sh
```

This installs a Git pre-commit hook that runs `scripts/fix-curly-quotes.py --check` before every commit. If curly quotes are found the commit is blocked with a clear message.

### Fix curly quotes manually

```bash
python3 scripts/fix-curly-quotes.py .
```

Run this if you are working with the hook disabled or if you want to fix an existing file before committing.

---

## Netlify Deploy Preview

Every PR targeting `main` automatically gets a Netlify Deploy Preview. The URL is:

```
https://deploy-preview-{PR-number}--london-js-slides.netlify.app
```

Use the deploy preview to verify slides render correctly in a live environment before requesting review.

---

## Merge policy for automated contributors

Automated agents (Claude Code, Cowork) merge PRs under the standing GL-58 policy grant after satisfying the Definition of Done for the relevant story. The merge must be squash-merge unless the story explicitly states otherwise. Human contributors follow the standard review process.

---

## What the repo contains

| File / directory | Purpose |
|---|---|
| `slides.jsx` | All slide content -- the only file you normally need to edit |
| `London JS - [Month] [Year].html` | Entry point: loads React, Babel, and the deck |
| `deck-stage.js` | Web component -- keyboard nav, viewport scaling, speaker notes, PDF print |
| `reveals.js` | MutationObserver-based staggered entry animations |
| `tweaks-panel.jsx` | Live logo-size controls on the title slide |
| `tokens.css` | Design tokens (colours, typography, spacing) |
| `assets/` | Host and sponsor logos, organiser photograph |
| `netlify.toml` | Netlify config; root redirect points to the current entry HTML |
| `scripts/install-hooks.sh` | Installs the curly-quote pre-commit hook |
| `scripts/fix-curly-quotes.py` | Detects and fixes curly-quote JSX regressions |
| `scripts/export-pdf.sh` | Exports the deck to PDF via Puppeteer |
| `scripts/smoke-check.sh` | Smoke test: verifies the entry HTML loads without errors |
| `docs/` | Additional technical documentation |

See `README.md` for deployment, navigation shortcuts, and the organiser list.
