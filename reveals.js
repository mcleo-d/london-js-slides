/* ============================================================================
 * London.js — Reveal driver
 * ----------------------------------------------------------------------------
 * Auto-fires reveal animations when a slide becomes active.
 *
 * Contract: any element with [data-reveal] inside an active <section> animates
 * in (token CSS handles the styling). The active section gets [data-revealed]
 * set on a short delay after activation.
 *
 * Why this is more involved than `addEventListener('slidechange')`:
 *
 *   - Slides are React-mounted ASYNC (Babel transform + createRoot), so the
 *     [data-reveal] children don't exist when slidechange first fires.
 *   - deck-stage.js fires its initial slidechange before this script's
 *     listener is attached on slow loads.
 *
 * So we use a MutationObserver: watch every <section> for the
 * [data-deck-active] attribute, and (re)run activate() each time it appears.
 * We also poll once after React mount via a small RAF chain so the very-first
 * activation doesn't race with the initial mount.
 * ========================================================================= */

(function () {
  'use strict';

  function indexReveals(slideRoot) {
    const items = slideRoot.querySelectorAll('[data-reveal]');
    items.forEach((el, i) => {
      const override = el.getAttribute('data-reveal-i');
      const idx = override !== null ? parseInt(override, 10) : i;
      el.style.setProperty('--reveal-i', String(idx));
    });
  }

  function activate(slide) {
    if (!slide) return;
    indexReveals(slide);
    // Use setTimeout instead of RAF — RAF may not fire reliably on hidden tabs
    // or in certain iframe contexts (this preview).
    setTimeout(() => slide.setAttribute('data-revealed', ''), 16);
  }

  function deactivate(slide) {
    if (!slide) return;
    slide.removeAttribute('data-revealed');
  }

  function attach() {
    const sections = document.querySelectorAll('deck-stage > section');
    if (!sections.length) {
      // deck-stage hasn't slotted yet — try again next frame
      setTimeout(attach, 16);
      return;
    }
    document.body.dataset.revealsAttached = String(sections.length);

    sections.forEach((section) => {
      // Watch for [data-deck-active] flipping on/off
      const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.attributeName !== 'data-deck-active') continue;
          if (section.hasAttribute('data-deck-active')) {
            document.body.dataset.revealsLastObserver = section.getAttribute('data-label');
            activate(section);
          } else {
            deactivate(section);
          }
        }
      });
      obs.observe(section, { attributes: true, attributeFilter: ['data-deck-active'] });
    });

    // Continuously poll for the active slide having reveal children mounted —
    // fires once when both conditions are first met. Caps at ~5s; if React
    // takes longer than that something else is wrong and we'd want to know.
    let polled = 0;
    const seedActive = () => {
      try {
        const active = document.querySelector('deck-stage > section[data-deck-active]');
        document.body.dataset.revealsLastPoll = (polled++) + '/active=' + (active ? active.getAttribute('data-label') : 'none') + '/children=' + (active ? active.querySelectorAll('[data-reveal]').length : 0) + '/revealed=' + (active ? active.hasAttribute('data-revealed') : 'na');
        if (active && active.querySelector('[data-reveal]') && !active.hasAttribute('data-revealed')) {
          document.body.dataset.revealsSeedHit = active.getAttribute('data-label') + '@' + polled;
          activate(active);
          return;
        }
        if (active && polled > 5 && !active.hasAttribute('data-revealed')) {
          document.body.dataset.revealsSeedHit = 'noop@' + polled;
          activate(active);
          return;
        }
        if (polled < 300) setTimeout(seedActive, 16);
      } catch (e) {
        document.body.dataset.revealsErr = String(e);
      }
    };
    setTimeout(seedActive, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }
})();
