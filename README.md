# London.js Slide Deck

Browser-based presentation deck for the [London.js](https://www.meetup.com/london-javascript-community/) monthly meetup. No build step; the deck runs entirely in the browser via Babel standalone and React from CDN.

**Current event:** July 2026, hosted and sponsored by [incident.io](https://incident.io/). Entry file: `London JS - July 2026.html`. Live at [https://london-js-slides.netlify.app](https://london-js-slides.netlify.app).

Past events are preserved on archive branches (for example `archive/april-2026`).

## Key files

| File | Role |
|---|---|
| `slides.jsx` | All slide content — the only file you normally need to edit |
| `London JS - July 2026.html` | Entry point: loads React, Babel, and the deck |
| `deck-stage.js` | Web component — keyboard nav, viewport scaling, speaker notes, PDF print |
| `reveals.js` | MutationObserver-based staggered entry animations |
| `tweaks-panel.jsx` | Live logo-size controls on the title slide |
| `tokens.css` | Design tokens (colours, typography, spacing) |
| `netlify.toml` | Netlify config; root redirect points to the current entry HTML |

## Running locally

```bash
python3 -m http.server 8765
```

Then open: [http://localhost:8765/London%20JS%20-%20July%202026.html](http://localhost:8765/London%20JS%20-%20July%202026.html)

> **Why a server?** Babel standalone fetches `slides.jsx` via XHR and cannot run from `file://`. Any static HTTP server works; `python3 -m http.server` is the zero-dependency option.

## Navigation

| Key | Action |
|---|---|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `S` | Toggle speaker notes |
| `P` | Print / export to PDF |

## Slide structure

The deck has 12 slides rendered in this order:

| Position | Slot | Typical content |
|---|---|---|
| 01 | Title | Event name, host/sponsor logos, animated background |
| 02 | Agenda | Run of show with timings |
| 03 | Housekeeping | Fire exits, facilities, code of conduct |
| 04 | Talk 01 | Speaker bio, talk title, abstract |
| 05 | Talk 02 | Speaker bio, talk title, abstract |
| 06 | Talk 03 | Speaker bio, talk title, abstract |
| 07 | Wi-Fi | Network name and password |
| 08 | Host | Host company info and stats |
| 09 | Sponsor | Sponsor company info and stats |
| 10 | By numbers | Highlights and stats |
| 11 | Thanks | Organisers, photo, LinkedIn QR code |
| 12 | Announcements | Open-floor announcements section |

## Making edits

Edit `slides.jsx`. After any change, bump the `?v=N` cache-bust integer on the `<script src="slides.jsx?v=N">` tag inside `London JS - July 2026.html` to force browsers to fetch the updated file.

**Curly quote warning:** some editors silently replace straight ASCII double quotes with Unicode curly quotes inside JSX attribute values. Babel standalone rejects curly quotes and the slides go blank with a syntax error. Always use straight quotes in JSX attributes. See `CLAUDE.md` for a detection and fix script.

## Contributing via pull request

Every PR targeting `main` automatically gets a Netlify Deploy Preview at:

```
https://deploy-preview-{PR-number}--london-js-slides.netlify.app
```

Use the deploy preview to verify slides render correctly before requesting review.

## Deployment

Merging to `main` auto-deploys to [https://london-js-slides.netlify.app](https://london-js-slides.netlify.app). The root URL redirects to the current entry HTML file. No build step; Netlify serves the repo root as-is.

## Organisers

- James McLeod — Open Source Lead, NatWest Group · FINOS Board Member · London.js Organiser
- Jordan Potts — Head of Technology, Albany Growth · Co-Founder, London.js
- Will Laing — Co-Founder, Plan:it · Co-Founder and Organiser, London.js

## Brand assets

The incident.io wordmark and icon (official SVG assets, provided by incident.io) are staged in `assets/` with permission for this event. They are **not** covered by the MIT licence — see `LICENSE` for details. Replace them with your own host/sponsor marks when forking.

## Licence

MIT — see [LICENSE](LICENSE).
