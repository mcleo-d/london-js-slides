# London.js Slide Deck

Browser-based presentation deck for the [London.js](https://www.meetup.com/london-javascript-community/) monthly meetup. No build step; the deck runs entirely in the browser via Babel standalone and React from CDN.

**Current event:** London.js at Slack, Monday 23 November 2026, hosted and sponsored by [Slack](https://slack.com/), at Salesforce Tower, 110 Bishopsgate. Entry file: `London JS - November 2026.html`. Content pack: `docs/events/2026-11-slack/content-pack.md`. Live at [https://london-js-slides.netlify.app](https://london-js-slides.netlify.app).

Past events are preserved on archive branches (`archive/april-2026`, `archive/july-2026`, `archive/october-2026`).

## Add an announcement slide

Want to tell the room about something at London.js on Monday 23 November 2026? You can add one slide with a pull request. No local setup is needed.

**What to submit**

- A title, one or two lines of text, one link, and your name (and your company if you like).
- One slide per person.
- You must be at the event to present it.

**Deadline:** open your pull request by midday on Monday 23 November 2026.

**Steps**

1. Fork this repo on GitHub.
2. Copy the announcement template: the commented example above `AnnouncementSlide` in `slides.jsx`. It is a single `<section>` line.
3. Fill in your title, text, link and name.
4. Add that one `<section>` line after the "Your announcements" section (`07 Announcements`) in `London JS - November 2026.html`, below any announcements already there, so your pull request does not clash with others. The slide mounts itself, so nothing else needs editing.
5. Open a pull request to `main`.

You do not need to change the `slides.jsx` version number; announcements live in the HTML file, which is never cached.

For more detail on how slide order works, see [docs/SLIDE_ORDER_MECHANISM.md](docs/SLIDE_ORDER_MECHANISM.md).

**How to preview:** once your pull request is open, the Netlify deploy preview link appears on it automatically. Open it and press `→` to find your slide.

Announcement slides have no slide number. Leave the other slides unchanged.

The organisers review every pull request and may edit or decline slides to keep the evening on time. Slides follow the London.js [Code of Conduct](https://confcodeofconduct.com).

### Automated announcement check

Every pull request runs an automated check (`.github/workflows/announcement-check.yml`, `scripts/check-announcement.sh`) that fails with a readable message when an announcement pull request:

- adds more than one new announcement (one per pull request);
- is missing a required attribute (`data-title`, `data-body`, `data-link`, `data-name`);
- has a link that is not `https://`;
- has a title over 60 characters or a body over 160 characters;
- is not positioned directly after the "Your announcements" section.

It also warns, without failing, if the pull request changes any file other than the entry HTML. The check reports in the job log and the step summary, not as a pull request comment; it does not require any secrets. Organisers should still check the Netlify deploy preview before merging -- the check catches the common mistakes, it is not a substitute for review.

## Key files

| File | Role |
|---|---|
| `slides.jsx` | All slide content: the only file you normally need to edit |
| `London JS - November 2026.html` | Entry point: loads React, Babel, and the deck |
| `deck-stage.js` | Web component: keyboard nav, viewport scaling, PDF print |
| `reveals.js` | MutationObserver-based staggered entry animations |
| `tweaks-panel.jsx` | Live logo-size controls on the title slide |
| `tokens.css` | Design tokens (colours, typography, spacing) |
| `netlify.toml` | Netlify config; root redirect points to the current entry HTML |

## Running locally

```bash
python3 -m http.server 8765
```

Then open: [http://localhost:8765/London%20JS%20-%20November%202026.html](http://localhost:8765/London%20JS%20-%20November%202026.html)

> **Why a server?** Babel standalone fetches `slides.jsx` via XHR and cannot run from `file://`. Any static HTTP server works; `python3 -m http.server` is the zero-dependency option.

### Smoke check

```bash
make smoke
# or: bash scripts/smoke-check.sh
```

`scripts/smoke-check.sh` never starts or stops a server on port 8765 (the review server above) unless you explicitly ask it to. By default it reads `PORT` (default `8766`): if a deck is already answering on that port it reuses it and leaves it running; otherwise it starts its own server and stops only that one on exit. To check against your own review server instead, run `PORT=8765 bash scripts/smoke-check.sh` -- it will detect and reuse it rather than touching it.

## Navigation

| Key | Action |
|---|---|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `Home` / `End` | First / last slide |
| `1`-`9`, `0` | Jump to slide 1-9, `0` for slide 10 |
| `R` | Back to slide 1 |

There is no speaker-notes toggle key. To export, use the browser's own print (`Cmd`/`Ctrl` + `P`): `@media print` lays out one slide per page. `make pdf` does the same headlessly (see `scripts/export-pdf.sh`).

## Slide structure

The deck has 14 slides. Play order is the document order of the `<section>` elements inside `<deck-stage>` in `London JS - November 2026.html` (see `docs/SLIDE_ORDER_MECHANISM.md`), extracted here rather than asserted:

```
$ grep -n '<section data-label' "London JS - November 2026.html" | awk -F'"' '{print NR": "$2" -> "$4}'
1: 01 Title -> s01
2: 02 Welcome -> s10
3: 03 Tonight -> s02
4: 04 House rules -> s03
5: 05 Thank you, Slack -> s08
6: 06 By numbers -> s11
7: 07 Announcements -> s12
8: 08 Lineup -> s16
9: 09 Talk 01 -> s04
10: 10 Talk 02 -> s15
11: 11 Networking break -> s14
12: 12 Talk 03 -> s05
13: 13 Talk 04 -> s06
14: 14 Closing -> s13
```

| Position | Slot | Typical content |
|---|---|---|
| 01 | Title | Event name, host logo, animated background |
| 02 | Welcome | Organisers, photo, LinkedIn QR code |
| 03 | Tonight | Run of show with timings and talk titles |
| 04 | House rules | Fire exits, facilities, Wi-Fi, code of conduct |
| 05 | Thank you, Slack | Thanks to the host and sponsor |
| 06 | By numbers | Highlights and stats |
| 07 | Announcements | Open-floor announcements section |
| 08 | Lineup | Speakers in running order, with roles and talk titles |
| 09 | Talk 01 | Speaker bio, talk title |
| 10 | Talk 02 | Speaker bio, talk title |
| 11 | Networking break | Break, return time, LinkedIn QR code |
| 12 | Talk 03 | Speaker bio, talk title |
| 13 | Talk 04 | Co-speakers' bios, talk title |
| 14 | Closing | Thanks, next event, LinkedIn QR code |

## Making edits

Edit `slides.jsx`. After any change, bump the `?v=N` cache-bust integer on the `<script src="slides.jsx?v=N">` tag inside `London JS - November 2026.html` to force browsers to fetch the updated file.

**Curly quote warning:** some editors silently replace straight ASCII double quotes with Unicode curly quotes inside JSX attribute values. Babel standalone rejects curly quotes and the slides go blank with a syntax error. Always use straight quotes in JSX attributes. See `scripts/fix-curly-quotes.py` for a detection and fix script.

## Contributing via pull request

Every PR targeting `main` automatically gets a Netlify Deploy Preview at:

```
https://deploy-preview-{PR-number}--london-js-slides.netlify.app
```

Use the deploy preview to verify slides render correctly before requesting review.

## Deployment

Merging to `main` auto-deploys to [https://london-js-slides.netlify.app](https://london-js-slides.netlify.app). The root URL redirects to the current entry HTML file. No build step; Netlify serves the repo root as-is.

## Organisers

- James McLeod: NatWest Group
- Jordan Potts: Albany
- Will Laing: Plan:it

## Brand assets

The incident.io wordmark and icon (official SVG assets, provided by incident.io) are staged in `assets/` with permission for this event. They are **not** covered by the MIT licence, see `LICENSE` for details. Replace them with your own host/sponsor marks when forking.

The Slack logo files (`assets/slack-logo-white.svg`, `assets/slack-logo-full-colour.svg`) are used unmodified with Slack's written permission dated 12 November 2026 for the November 2026 event. The GitHub and Omnea logos (`assets/github-lockup-white.svg`, `assets/omnea-logo.png`) and the speaker photos (`assets/speaker-kearsley.jpg`, `assets/speaker-cecile.jpg`, `assets/speaker-cormack.jpg`, `assets/speaker-pope.jpg`, `assets/speaker-maguire.jpg`) are used with the speakers' agreement for this event. None of these are covered by the MIT licence.

The organiser firm logos (`assets/natwestgroup-logo-white.svg`, `assets/albany-logo-white.svg`, `assets/planit-logo-white.svg`) are used with each firm's permission, obtained via the organisers, for this event. They are **not** covered by the MIT licence.

## Licence

MIT, see [LICENSE](LICENSE). The brand assets and photos listed under Brand assets above are not covered by it.
