# London.JS slides repository, agent instructions

> Current event metadata: London.js at Slack, Monday 23 November 2026 (Salesforce Tower, 110 Bishopsgate). Update this metadata when the repository is reused for a future London.js event. The generic agent rules below apply to every event.

## Content production

All London.js community content produced for or about this repository MUST be authored by the `londonjs-content-creator` subagent, canonically defined in this repository at [`agents/londonjs-content-creator.md`](./agents/londonjs-content-creator.md). Install it to `~/.claude/agents/londonjs-content-creator.md` (or your Claude Code agents directory) to activate it for a session. This includes (non-exhaustive): event listings, slide copy, website copy, speaker bios, social posts.

Binding rule: any change to repo content covered by the categories above is produced by invoking the subagent. The subagent is the single source of style, persona, and tone. Agents that bypass the subagent for these content categories are out of compliance with this repository's agent instructions.

For content categories not listed above (e.g. technical documentation, code comments, build instructions), the subagent need not be invoked; the agent author exercises judgement.

## Known Issues & Lessons Learned

### Curly/smart quotes break Babel standalone JSX parsing
**Symptom:** Slides go blank. Browser console shows `Uncaught SyntaxError: Unexpected character '"'` pointing at a JSX attribute delimiter.

**Cause:** The Edit tool can silently substitute Unicode curly quotes (`"` U+201C, `"` U+201D) in place of straight ASCII double quotes (`"` U+0022) when writing JSX string attribute values. Node.js and most editors accept these silently, but Babel standalone's JSX parser rejects them outright.

**Resolution:** Run the following to detect and fix the file:
```bash
python3 -c "
path = 'slides.jsx'
with open(path, 'rb') as f:
    content = f.read()
fixed = content.replace(b'\xe2\x80\x9c', b'\"').replace(b'\xe2\x80\x9d', b'\"')
with open(path, 'wb') as f:
    f.write(fixed)
print('Fixed', content.count(b'\xe2\x80\x9c') + content.count(b'\xe2\x80\x9d'), 'curly quote sequences')
"
```

**Prevention:** After any Edit to JSX string attributes, verify no curly quotes were introduced. For abstract/bio content containing double quotes, always use JSX expression syntax with a template literal — e.g. `abstract={\`text with "quotes" inside\`}` — never escaped `\"` inside a double-quoted attribute.

### Cache-bust on every slides.jsx edit

Bump the `?v=N` cache-bust on the `<script>` tag in `London JS - November 2026.html` after every edit to `slides.jsx` to ensure the browser fetches the updated file.

---

## Project overview

A browser-based presentation deck (no build step) for the London.JS meetup, Monday 23 November 2026 at Salesforce Tower, 110 Bishopsgate (hosted by Slack).

**Stack:** HTML + React 18 (CDN) + Babel standalone  
**Dev server:** `python3 -m http.server 8765` from project root  
**Entry point:** `London JS - November 2026.html`

### Key files
| File | Purpose |
|---|---|
| `slides.jsx` | All 14 slide components |
| `deck-stage.js` | Web component: keyboard nav, scaling, speaker notes, PDF print |
| `reveals.js` | Staggered entry animations |
| `tweaks-panel.jsx` | Live edit mode for logo sizing |
| `tokens.css` | Design tokens |

### Slides

Slide content lives in `slides.jsx`. Slide play order lives in `London JS - November 2026.html` as the document order of `<section>` elements inside `<deck-stage>`. The procedure to add or reorder slides is documented in `docs/SLIDE_ORDER_MECHANISM.md`. Do not maintain a per-slide table here; the deck file and the slide-order doc are the canonical sources.

### Event details
- **Date:** Monday 23 November 2026, doors 17:30, welcome and talks from 18:30, close 20:30
- **Venue:** Salesforce Tower, 110 Bishopsgate, London EC2N 4AY
- **Organizers:** James McLeod (NatWest Group), Jordan Potts (Albany Growth), Will Laing (Plan:it)
- **Host and sponsor:** Slack
- **Running order:** 18:30 Welcome; 18:40 Tom Kearsley; 19:00 Daryl Cecile; 19:20 Networking; 19:50 Ryan Cormack; 20:10 Jason Pope and Megan Maguire; 20:30 Close
- **Talks:** Tom Kearsley (Omnea), "Your API's newest user is an LLM"; Daryl Cecile (GitHub), "Beyond the Reply: Building an AI Support Teammate"; Ryan Cormack, "Building Open Source Agents using Open Protocols"; Jason Pope and Megan Maguire (Slack), "Slack for Communities & Engineering"
- **Content pack:** `docs/events/2026-11-slack/content-pack.md`

## Slide order

Play order is the document order of the `<section>` elements inside `<deck-stage>` in `London JS - November 2026.html`, NOT the `slides.jsx` `window.Slides` key order. Authoritative reference: `docs/SLIDE_ORDER_MECHANISM.md`.

### When adding or removing slides

When the slide count changes, every component's `label="NN / 14"` prop in `slides.jsx` MUST be updated to reflect the new total. The procedure in `docs/SLIDE_ORDER_MECHANISM.md` names this step (step 5 of "How to add a slide") but it is a frequent miss in agent-driven edits. Verify the count match after any slide insertion or removal by grepping `label="` in `slides.jsx` and confirming every match uses the same denominator.

## Documentation policy

- All PRs that introduce a new feature, new mechanism, or change to wiring must include documentation that explains the change.
- Mechanism changes (ordering, routing, mounting, dispatch) must update or add a doc under `docs/` in the same PR.
- Repo state must not carry technical ambiguity that an executor or future contributor has to infer from a single file.

## See also

- `docs/SLIDE_ORDER_MECHANISM.md`, canonical procedure for slide order and slide addition.
- `README.md`, repository overview and licence notes (brand assets carry a separate licence carve-out).
- `London JS - November 2026.html`, the entry point and the canonical play-order source.
- `agents/londonjs-content-creator.md`, the binding content-production subagent, source-of-truth in this repository; install to `~/.claude/agents/` to activate (see Content production above).
