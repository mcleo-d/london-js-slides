# London.JS — April 2026 Slide Deck

Browser-based presentation deck for the London.JS meetup, 30 April 2026.  
Hosted by **Motorway** · Sponsored by **Omnea** · Venue: 12 Wells Mews, W1T 3HE.

## Stack

No build step. Open the HTML file in a browser via a local server.

| Technology | Role |
|---|---|
| React 18 (CDN) + Babel standalone | UI / JSX transpiled in-browser |
| `deck-stage.js` | Web component — keyboard nav, viewport scaling, speaker notes, PDF print |
| `reveals.js` | MutationObserver-based staggered entry animations |
| `tweaks-panel.jsx` | Live logo-size controls on the title slide |
| `tokens.css` | Design tokens |
| Google Fonts | Inter Tight · JetBrains Mono |

## Running locally

```bash
python3 -m http.server 8765
```

Then open: [http://localhost:8765/London%20JS%20-%20April%202026.html](http://localhost:8765/London%20JS%20-%20April%202026.html)

> **Why a server?** Babel standalone fetches the `.jsx` file via XHR — it cannot
> run from `file://`. Any static HTTP server works; `python3 -m http.server` is
> the zero-dependency option.

## Navigation

| Key | Action |
|---|---|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `S` | Toggle speaker notes |
| `P` | Print / export to PDF |

## Slides

| # | Label | Content |
|---|---|---|
| 01 | Title | Motorway + Omnea logos, animated noise field |
| 02 | Agenda | Run of show with timings |
| 03 | Wi-Fi | Network + password |
| 04 | Housekeeping | Fire exits, facilities, code of conduct |
| 05 | Host | Motorway company info |
| 06 | Sponsor | Omnea company info |
| 07 | Talk 01 | Ed Cooper (Omnea) |
| 08 | Talk 02 | Ryan Cormack & Jamie Toloui (Motorway) |
| 09 | Talk 03 | Johannes Stein |
| 10 | Thanks | Organisers + LinkedIn QR |

## Forking for your own meetup

1. Update event details in `slides.jsx` — search for `S01_Title`, `S02_Agenda`, and `S10_Thanks`.
2. Replace talk content in `S04_Talk1`, `S05_Talk2`, `S06_Talk3`.
3. Swap host/sponsor logos and copy in `S08_Host` and `S09_Sponsor`.
4. Replace `assets/omnea-logo.png` with your sponsor's mark.
5. Update the slide count label in `London JS - April 2026.html` (`data-label` attributes).
6. Bump the `?v=N` cache-bust on `<script src="slides.jsx?v=N">` after every edit.

## Brand assets

The Motorway wordmark (inline SVG in `slides.jsx`) and the Omnea logo (`assets/omnea-logo.png`) are included with permission for this event. They are **not** covered by the MIT licence — see `LICENSE` for details. Replace them with your own sponsors' marks when forking.

## Organisers

- James McLeod — NatWest Group
- Jordan Potts — Albany Growth
- Will Laing — Plan:it

## Licence

MIT — see [LICENSE](LICENSE).
