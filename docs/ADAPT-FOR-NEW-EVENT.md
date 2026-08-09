# Adapting the deck for a new event

This runbook walks you through every change needed to repurpose the slide deck for the next London.js event, from duplicating the entry HTML through archiving the outgoing event. Follow the steps in order.

Cross-reference `README.md` for the overall project layout, key files, and navigation shortcuts. Do not edit `README.md` as part of this process.

---

## Before you start

Gather the following from the event organisers before touching any files:

- **Event date** and venue / host company name
- **Host company**: logo files (SVG preferred) in light and dark variants, one-line description, stats for the "By numbers" slide
- **Sponsor company** (if separate from host): same as above
- **Three talks**: for each -- speaker name, job title and company, talk title, abstract (2-4 sentences), speaker biography (2-4 sentences), speaker headshot (optional)
- **Wi-Fi credentials**: network name and password
- **Organiser photograph** (if updated)

---

## Step 1 -- Archive the outgoing event

The archive is created **before** making any changes to `main`. This preserves the live state of the previous event at a permanent reference point.

Identify the outgoing event month and year (for example `july-2026`). Run `scripts/archive-event.sh` with that slug to cut and push the archive branch from `origin/main`:

```bash
bash scripts/archive-event.sh july-2026
```

The naming convention, observed from the repo's live branch list, is `archive/<month>-<year>` (lowercase, hyphenated); the script builds this from the slug you pass it. It refuses to run against a dirty working tree, and it is idempotent: if `archive/<slug>` already exists on origin it reports that and exits cleanly rather than erroring.

After running it, verify the branch appears at `github.com/mcleo-d/london-js-slides/branches`.

---

## Step 2 -- Create a working branch

```bash
git checkout -b event/october-2026-acme-corp
```

Use the format `event/<month>-<year>-<host-slug>` as described in `CONTRIBUTING.md`.

---

## Step 3 -- Duplicate the entry HTML

Identify the current entry HTML. As of the July 2026 event it is `London JS - July 2026.html`. Confirm which file `netlify.toml` is currently redirecting to:

```bash
grep -A2 '\[\[redirects\]\]' netlify.toml
```

Copy it to a new file named for the incoming event:

```bash
cp "London JS - July 2026.html" "London JS - October 2026.html"
```

---

## Step 4 -- Update the new entry HTML

Open `London JS - October 2026.html` in a text editor and make the following changes.

### 4a -- Update the page title

```html
<title>London.js - October 2026</title>
```

### 4b -- Bump the `?v=N` cache-bust integer

Locate the `slides.jsx` script tag:

```html
<script type="text/babel" src="slides.jsx?v=75"></script>
```

Increment the integer by one:

```html
<script type="text/babel" src="slides.jsx?v=76"></script>
```

Do the same for `reveals.js?v=N` if the outgoing value was recently bumped (check the file and use the current value plus one). See `CONTRIBUTING.md` for a full explanation of the cache-bust convention.

### 4c -- Update `TWEAK_DEFAULTS` for the new sponsor

The `TWEAK_DEFAULTS` block controls live-adjustable parameters on the title slide, typically logo sizes. Update the keys and values to reflect the new host/sponsor logo dimensions:

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "acmeSize": 40
}/*EDITMODE-END*/;
```

Also update the `<TweaksPanel>` section below to reference the new parameter names:

```jsx
<TweakSection label="Title slide - Acme Corp logo" />
<TweakSlider label="Logo size" value={t.acmeSize}
  min={24} max={80} unit="px"
  onChange={(v) => setTweak('acmeSize', v)} />
```

And pass the prop to `S.S01_Title`:

```jsx
<S.S01_Title
  acmeSize={t.acmeSize}
/>
```

---

## Step 5 -- Replace assets

Replace the files in `assets/` with the new host/sponsor brand materials. Do not rename the directory.

Typical files to replace:

| Current file (example) | Replace with |
|---|---|
| `wordmark-colour-dark.svg` | New sponsor wordmark (dark background variant) |
| `wordmark-colour-light.svg` | New sponsor wordmark (light background variant) |
| `icon-dark.svg` | New sponsor icon/logomark (dark variant) |
| `icon-light.svg` | New sponsor icon/logomark (light variant) |
| `london-js-organisers.jpeg` | Updated organiser photo (if provided) |

Brand assets must be provided by or with written permission from the brand owner. Note any licence restrictions in `LICENSE` if they differ from the repo's MIT licence.

---

## Step 6 -- Update slide content in `slides.jsx`

`slides.jsx` is the single source of truth for all slide copy. Edit it to replace the outgoing event's content:

- **S01_Title**: update event name, date, host/sponsor logo references (swap import paths and component prop names to match the new assets and `TWEAK_DEFAULTS`)
- **S02_Agenda**: update the run-of-show and timings
- **S03_Housekeeping**: venue-specific details (fire exits, facilities, code of conduct link if changed)
- **S04_Talk1, S05_Talk2, S06_Talk3**: replace speaker name, job title, company, talk title, abstract, and biography for each speaker
- **S07_Wifi**: update network name and password
- **S08_Host**: update host company name, description, and stats
- **S09_Sponsor**: update sponsor company name, description, and stats (omit if host and sponsor are the same entity)
- **S10_Thanks**: update organiser details if changed
- **S11_ByNumbers**: update the highlights and stats
- **S12_Announcements**: this slide is event-neutral; update only if the organisers request a specific announcement

After editing `slides.jsx`, confirm you bumped `?v=N` in the entry HTML (Step 4b) to force browsers to fetch the updated file.

**Curly-quote warning**: if your editor replaces straight ASCII double quotes with Unicode curly quotes inside JSX attributes, Babel will reject the file and the slides will go blank. Run the pre-commit hook (`bash scripts/install-hooks.sh` once after cloning) or check manually with:

```bash
python3 scripts/fix-curly-quotes.py --check .
```

---

## Step 7 -- Update `netlify.toml`

The root redirect must point to the new entry HTML. Open `netlify.toml` and update the `to` value in the `[[redirects]]` block:

```toml
[[redirects]]
  from = "/"
  to = "/London%20JS%20-%20October%202026.html"
  status = 302
  force = true
```

Note the URL-encoded space (`%20`) between words.

---

## Step 8 -- Verify with `git diff --name-only`

Confirm you have only changed the files you intended:

```bash
git diff --name-only main
```

For a new event the expected changed files are typically:

```
London JS - October 2026.html   (new file)
assets/<new-logo-files>         (replaced)
netlify.toml
slides.jsx
```

`CONTRIBUTING.md`, `README.md`, `CHANGELOG.md`, `Makefile`, `scripts/*`, and `.github/*` must not appear in this diff.

---

## Step 9 -- Run the pre-merge checklist

Follow every item in the **Pre-merge checklist** section of `CONTRIBUTING.md` before opening the PR.

Key points:
- Serve locally via `python3 -m http.server 8765` and open the new entry HTML (not the old one).
- Walk all 12 slides; check keyboard nav, speaker notes (`S`), and print mode (`P`).
- Confirm the Netlify Deploy Preview works after opening the PR.

---

## Step 10 -- Open the PR

Push your branch and open the PR targeting `main`:

```bash
git add .
git commit -m "feat(slides): rebuild [Month] [Year] deck for [host] (ST-XXX)"
git push -u origin event/october-2026-acme-corp
gh pr create --title "[ST-XXX] feat(slides): rebuild October 2026 deck for Acme Corp" \
  --body "Adapts the deck for London.js October 2026..."
```

The Netlify Deploy Preview URL will appear automatically on the PR:

```
https://deploy-preview-{PR-number}--london-js-slides.netlify.app
```

Use it to verify the live render before merging.

---

## Quick reference

| Thing to change | Where |
|---|---|
| Slide copy (talks, bios, stats) | `slides.jsx` |
| Logo files | `assets/` |
| Entry point HTML | New `London JS - [Month] [Year].html` (copied from previous) |
| Cache-bust integers | `<script src="slides.jsx?v=N">` inside the new HTML |
| Root redirect | `netlify.toml` |
| Archive of outgoing event | Git branch `archive/<month>-<year>` pushed to origin |
