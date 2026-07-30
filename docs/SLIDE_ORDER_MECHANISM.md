# Slide order mechanism

How slide play order is set in this deck.

## Canonical source

Play order is the document order of the `<section>` elements inside `<deck-stage>` in `London JS - July 2026.html`. The `<deck-stage>` web component, defined in `deck-stage.js`, iterates its direct element children to drive the play sequence.

Each `<section data-label="NN ...">` carries a single `<div>` whose `id` matches the slide's mount target (`s01` to `s12`). The leading `NN` in the `data-label` is the visual position indicator and matches the slide's position in document order.

## Registry

The `window.Slides = { ... }` object literal at the end of `slides.jsx` is a label-to-component map. Its key order has no rendering effect. Treat it as a registry only.

The inline `<script type="text/babel">` block in `London JS - July 2026.html` reads `window.Slides` and mounts each component into its target `<div>` via the `staticMounts` list. `S01_Title` is mounted separately because it shares state with the tweaks panel. The order of `staticMounts` is also irrelevant to play order, because each entry mounts to a fixed `id`.

## How to change play order

1. Open `London JS - July 2026.html`. Reorder the `<section>` lines inside `<deck-stage>`.
2. Renumber the leading `NN` in each affected `data-label`.
3. Renumber the corresponding `label="NN / 12"` props on each affected component in `slides.jsx` so the visual indicator matches the new position.
4. Bump the `?v=N` cache-bust on the `slides.jsx` `<script>` tag in the HTML (see `CLAUDE.md` for the rule).

## How to add a slide

1. Author a new component in `slides.jsx` (e.g. `S12_Foo`).
2. Add `S12_Foo` to the `window.Slides` literal at the bottom of `slides.jsx`.
3. Add `<section data-label="NN Foo"><div id="s12"></div></section>` to `<deck-stage>` in `London JS - July 2026.html` at the desired play position.
4. Add `['s12', S.S12_Foo]` to the `staticMounts` array in the HTML inline `<script>` block. Position in this array does not affect play order.
5. Renumber `label="NN / 12"` props on every component whose play position changed, and update the total (`/ NN`) on every component if the slide count changed.
6. Bump the `?v=N` cache-bust.

## Cache-bust

See `CLAUDE.md` for the cache-bust rule that applies to every `slides.jsx` edit.

---

Last verified against repo state on 2026-07-30, against the reordered 12-slide event/july-2026-incident-io deck (S9.3/S9.6).
