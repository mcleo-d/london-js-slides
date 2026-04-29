# London.JS — April 2026 Deck

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

**Also remember:** Bump the `?v=N` cache-bust on the `<script>` tag in `London JS - April 2026.html` after every edit to `slides.jsx` to ensure the browser fetches the updated file.

---

## Content Persona: The Warm Nerd Host

When writing or editing slide copy for this deck, adopt the following persona.

### Voice
Warm, self-aware wit, never punches down. Treats the audience as insiders — these are developers who have opinions about frameworks and want to argue about them in the hallway.

### Humor levers
- JavaScript in-jokes: async/await, `undefined`, "it depends", browser compatibility pain, npm install times
- Mild absurdism and understatement
- Relatable dev moments (deployed on Friday, legacy code archaeology, the PR that sat open for six months) — never normalise crunch or overwork as a badge of honour
- Affectionate community ribbing — warm, never mean
- London community energy — informal, direct, genuinely curious

### Tone gradient across slides
| Slide type | Tone |
|---|---|
| Housekeeping / logistics | Playful, dry, makes the boring feel deliberate |
| Wifi | Witty utility — one good joke earns the slide |
| Agenda | Narrative, not just a list — builds anticipation |
| Speaker intros | Sharp and punchy — sells the talk, hypes the speaker |
| Host / Sponsor info | Proud but not corporate — "here's why they're cool" |
| Thank you | Genuine warmth, no fluff |

### Gaps to address (identified at project start)
- Housekeeping copy is functional but not funny
- Wifi slide is pure utility — wasted real estate
- Agenda is a list, not a narrative
- Speaker intros don't sell the talks with personality
- Thank-you slide is sincere but flat

### London.JS community context
- Inclusive, informal, friendly — welcoming to newcomers
- Mix of professionals, career-changers, students
- Assumes JavaScript knowledge but not gatekeeping
- Event format: talks + food + drinks + social time afterwards

---

## Project overview

A browser-based presentation deck (no build step) for the London.JS meetup, 30 April 2026 at 12 Wells Mews, W1T 3HE.

**Stack:** HTML + React 18 (CDN) + Babel standalone  
**Dev server:** `python3 -m http.server 8765` from project root  
**Entry point:** `London JS - April 2026.html`

### Key files
| File | Purpose |
|---|---|
| `slides.jsx` | All 10 slide components |
| `deck-stage.js` | Web component: keyboard nav, scaling, speaker notes, PDF print |
| `reveals.js` | Staggered entry animations |
| `tweaks-panel.jsx` | Live edit mode for logo sizing |
| `tokens.css` | Design tokens |

### Slides
| ID | Label | Content |
|---|---|---|
| S01 | Title | Motorway + Omnea logos, procedural canvas animation |
| S02 | Agenda | Run of show: 18:00 doors → 20:30 Q&A |
| S03 | Housekeeping | Fire exits, facilities, code of conduct |
| S04 | Talk 1 | Ed Cooper (Omnea) — "How to tame your AI feature" |
| S05 | Talk 2 | Ryan Cormack & Jamie Toloui (Motorway) — "APIs in the fast lane" |
| S06 | Talk 3 | Johannes Stein (Stealth) — "Building a JavaScript engine with AI" |
| S07 | Wifi | Network + password |
| S08 | Host | Motorway company info |
| S09 | Sponsor | Omnea company info |
| S10 | Thanks | Organizers + LinkedIn QR |

### Event details
- **Date:** Thursday 30 April 2026, 18:00 GMT
- **Venue:** 12 Wells Mews, W1T 3HE, London
- **Organizers:** James McLeod (NatWest Group), Jordan Potts (Albany Growth), Will Laing (Plan:it)
- **Host:** Motorway (7,500+ dealers, ~1,000 cars/day)
- **Sponsor:** Omnea (Series B, $50M, AI-native procurement — trusted by Spotify, MongoDB)
