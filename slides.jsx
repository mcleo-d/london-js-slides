/* global React */
const { useEffect, useState } = React;

// --- Type & spacing system ---------------------------------------------------
const TYPE = {
  display: 168,   // hero numerals / big marks
  title: 88,      // slide titles
  subtitle: 52,
  lead: 40,
  body: 32,
  small: 26,
  micro: 24,      // labels, mono accents
};

const SPACE = {
  padX: 120,
  padY: 100,
  padBottom: 96,
  titleGap: 44,
  itemGap: 28,
};

const C = {
  bg: '#F2EEE4',          // warm off-white
  bgAlt: '#1B1D1C',       // deep ink (Omnea-ish)
  bgWarm: '#FFD93D',      // motorway yellow
  ink: '#161514',
  inkSoft: '#3A3631',
  inkMute: '#7A726A',
  rule: '#1615141A',
  ruleStrong: '#16151433',
  accent: '#FFD93D',                  // motorway yellow
  accentMint: '#3DD9A5',              // omnea green
  accentInk: '#7C4A00',
  paper: '#FFFFFF',
};

// --- Atoms -------------------------------------------------------------------

const Frame = ({ bg = C.bg, ink = C.ink, children, hideChrome, label = '' }) => (
  <div style={{
    position: 'absolute', inset: 0,
    background: bg, color: ink,
    fontFamily: '"Inter Tight", system-ui, sans-serif',
    fontFeatureSettings: '"ss01","cv11"',
    overflow: 'hidden',
  }}>
    {!hideChrome && <Chrome ink={ink} bg={bg} label={label} />}
    {children}
  </div>
);

const Chrome = ({ ink, bg, label }) => (
  <>
    <div style={{
      position: 'absolute', top: 44, left: SPACE.padX, right: SPACE.padX,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: TYPE.micro, color: ink, letterSpacing: '0.02em',
      opacity: bg === C.bgAlt ? 1 : 0.7,
    }}>
      <span>london.js</span>
      <span>{label}</span>
      <span>30 · 04 · 2026</span>
    </div>
    <div style={{
      position: 'absolute', top: 88, left: SPACE.padX, right: SPACE.padX,
      height: 1, background: ink, opacity: 0.18,
    }} />
  </>
);

const Mono = ({ children, style }) => (
  <span style={{
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    letterSpacing: '0.02em',
    ...style,
  }}>{children}</span>
);

// Wordmark placeholders rendered as type  –  original, not lifted brand assets.
const Wordmark = ({ name, color = C.ink, size = 56, weight = 700 }) => (
  <span style={{
    fontFamily: '"Inter Tight", system-ui, sans-serif',
    fontWeight: weight, fontSize: size, color,
    letterSpacing: '-0.025em', lineHeight: 1,
  }}>{name}</span>
);

// Motorway: official wordmark path data (provided by Motorway).
// Single SVG, scales with `size` (treated as cap-height in px).
// The viewBox spans the full path bounds incl. the y-descender at y≈41.
const MotorwayMark = ({ size = 88, color = C.ink }) => {
  // Source path uses a coordinate system where caps are roughly 26 units tall
  // (y≈7 to y≈33), so 1px-cap-height ≈ size/26 of viewBox units.
  // We render at width = size * (168/26) ≈ 6.46×size.
  const widthPx = size * (168 / 26);
  const heightPx = size * (42 / 26);
  return (
    <svg
      width={widthPx}
      height={heightPx}
      viewBox="0 0 168 42"
      style={{ display: 'inline-block', flexShrink: 0 }}
      aria-label="Motorway"
      role="img"
    >
      <g fill={color}>
        <path d="M39.46 12.19c-5.89 0-10 4.3-10 10.44 0 6.15 4.11 10.41 10 10.41 5.9 0 10.05-4.28 10.05-10.4s-4.23-10.45-10.05-10.45m0 15.88c-2.66 0-4.32-2.08-4.32-5.44 0-3.35 1.7-5.47 4.32-5.47s4.29 2.1 4.29 5.47c0 3.38-1.64 5.44-4.29 5.44M20.75 12.2a7.6 7.6 0 0 0-5.58 2.4.2.2 0 0 1-.32-.02 5.9 5.9 0 0 0-4.88-2.39A5.6 5.6 0 0 0 5.6 14.6a.2.2 0 0 1-.37-.06l-.48-1.68a.34.34 0 0 0-.33-.25H.35c-.2 0-.35.15-.35.35v19.32c0 .2.16.35.35.35H5.2c.2 0 .35-.16.35-.35v-11.3c0-2.24 1.12-3.62 2.93-3.62 1.68 0 2.6 1.07 2.6 3.01v11.91c0 .2.16.35.35.35h4.85c.19 0 .35-.16.35-.35V20.86c0-2.2 1.1-3.5 2.97-3.5 1.67 0 2.6 1.08 2.6 3.05v11.87c0 .2.15.35.34.35h4.86c.19 0 .34-.16.34-.35V19.16c0-4.1-2.87-6.97-6.98-6.97zm52.19-.01c-5.89 0-10 4.3-10 10.44 0 6.15 4.11 10.41 10 10.41 5.9 0 10.05-4.28 10.05-10.4s-4.23-10.45-10.05-10.45m0 15.88c-2.66 0-4.32-2.08-4.32-5.44 0-3.35 1.7-5.47 4.32-5.47s4.29 2.1 4.29 5.47c0 3.38-1.64 5.44-4.29 5.44M61.82 28a.3.3 0 0 0-.38-.17c-.4.18-1.07.4-1.78.4q-1.5 0-1.75-1.37l-.03-.26v-.03l-.01-.3V17.3q.02-.2.2-.21h4.23c.2 0 .35-.16.35-.35v-3.79c0-.2-.15-.35-.35-.35h-4.23a.2.2 0 0 1-.2-.2V7.28c0-.18-.16-.3-.33-.27l-5 .95a.3.3 0 0 0-.22.27v4.17c0 .12-.1.2-.2.2h-2.18c-.19 0-.34.16-.34.35v3.8c0 .19.15.34.34.34h2.17c.12 0 .21.1.21.2V27.3l.04.8v.06l.09.62.04.2.08.33v.01c.67 2.44 2.66 3.72 5.74 3.72 2.44 0 3.95-.95 4.48-1.35.09-.07.13-.2.1-.3zm65.32-15.4h-4.9c-.16 0-.3.12-.34.28l-2.85 12.62c-.03.15-.24.15-.27 0l-3-12.63a.35.35 0 0 0-.34-.27h-5.47c-.16 0-.3.12-.34.27l-2.94 12.59c-.03.14-.23.14-.27 0l-2.76-12.58a.35.35 0 0 0-.34-.28h-5.2a.28.28 0 0 0-.27.35l5.17 19.42q.08.24.34.25h6.15c.16 0 .3-.1.33-.26l2.65-11.55c.03-.14.24-.14.27 0l2.66 11.55c.03.15.17.26.33.26h6.14q.26-.01.34-.25l5.17-19.42a.28.28 0 0 0-.27-.35m18.84 16.36c-.97-.23-1.7-.67-1.7-2.06v-8.67c0-1.01-.35-6.06-7.23-6.06-5.56 0-8.08 2.9-8.82 3.96-.1.14-.08.33.05.45l2.92 2.75c.12.12.31.1.41-.03a6 6 0 0 1 4.46-2.3c1.3 0 2.67.68 2.67 1.92v1.01c0 .1-.08.2-.18.21l-4.46.52c-4.27.5-6.62 2.64-6.62 6.02 0 3.74 2.87 6.36 6.99 6.36 2.2 0 4.1-.71 5.34-2.01l.13-.13.1.15a4.9 4.9 0 0 0 3.86 2.02q.16 0 .25-.14l2-3.57a.27.27 0 0 0-.17-.4m-7.24-3.04c0 1.69-1.3 2.86-3.15 2.86-1.74 0-2.53-1.11-2.53-2.14 0-1.11.88-1.88 2.42-2.11l3.02-.51a.2.2 0 0 1 .24.2zM96.15 12.28a5.82 5.82 0 0 0-5.88 2.35.2.2 0 0 1-.37-.06l-.46-1.7a.35.35 0 0 0-.34-.26h-4.08c-.2 0-.35.15-.35.34v19.33c0 .2.15.35.35.35h4.85c.19 0 .34-.16.34-.35v-9.04q.01-5.14 4.28-5.16c.61 0 1.17.06 1.56.12.2.03.4-.13.4-.34v-5.23a.34.34 0 0 0-.3-.35"/>
        <path d="M151.33 12.78a.4.4 0 0 0-.3-.17h-5.77a.28.28 0 0 0-.24.4l7.55 13.46c.12.2.12.46 0 .67l-7.55 13.45c-.1.18.03.41.24.41h5.77q.2 0 .3-.18l7.6-13.54a1 1 0 0 0 0-.95zm15.39-.18h-5.81a.4.4 0 0 0-.3.18l-2.15 3.83a.4.4 0 0 0 0 .34l2.9 5.17c.11.18.38.18.49 0l5.11-9.1a.28.28 0 0 0-.24-.42"/>
      </g>
    </svg>
  );
};

// Omnea: official PNG wordmark. `size` = wordmark cap-height in px (so it
// matches MotorwayMark's contract  –  both render at the same visual height).
//
// We render an outer box exactly `size` tall containing the wordmark, with
// the image scaled and shifted so its WORDMARK sits centered within the box.
// The icon overhangs above and below  –  caller is responsible for clearance.
const OMNEA_WORDMARK_RATIO = 0.526;       // wordmark height / image height
const OMNEA_WORDMARK_TOP_OFFSET = 0.236;  // wordmark-top y / image height (= 99/420)

const OmneaMark = ({ size = 88, inverted = false }) => {
  const imgHeight = size / OMNEA_WORDMARK_RATIO;
  // Wordmark center y in image coordinates:
  const wordmarkCenterInImg = imgHeight * (OMNEA_WORDMARK_TOP_OFFSET + OMNEA_WORDMARK_RATIO / 2);
  // Box center y is size / 2; shift image up by (wordmark center - box center).
  const topShift = (size / 2) - wordmarkCenterInImg;
  return (
    <span style={{
      display: 'inline-block',
      height: size,
      position: 'relative',
      // Allow vertical overflow (icon overhang); clip nothing.
    }}>
      <img
        src="assets/omnea-logo.png"
        alt="Omnea"
        style={{
          height: imgHeight,
          width: 'auto',
          display: 'block',
          marginTop: topShift,
          filter: inverted ? 'invert(1) hue-rotate(180deg)' : 'none',
        }}
      />
    </span>
  );
};

// --- Canvas hero (slide 01) ---------------------------------------------------
// Slow noise field  –  three sine layers sampled and painted as warm dots on cream.
// Pure Canvas2D. Pauses under prefers-reduced-motion (we just don't kick the loop).
const NoiseHero = ({ color = C.ink, density = 0.18 }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let t0 = performance.now();

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();

    // Pre-build a sparse dot grid; on each frame we adjust each dot's alpha
    // by sampling three sine layers at its position + time. Cheap.
    const STEP = 28; // px between dots
    const dots = [];
    for (let y = 0; y < canvas.clientHeight + STEP; y += STEP) {
      for (let x = 0; x < canvas.clientWidth + STEP; x += STEP) {
        // Slight jitter so the grid isn't square-on-square
        dots.push({
          x: x + (Math.sin(x * 0.13 + y * 0.07) * 6),
          y: y + (Math.cos(x * 0.09 - y * 0.11) * 6),
        });
      }
    }

    function frame(now) {
      const t = (now - t0) * 0.0006; // slow time
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      for (const d of dots) {
        // Three sine layers  –  different scales, summed.
        const a =
          Math.sin(d.x * 0.0042 + t * 1.1) +
          Math.sin(d.y * 0.0035 + t * 0.9 + 1.7) +
          Math.sin((d.x + d.y) * 0.0023 - t * 1.3 + 3.1);
        // Map [-3, 3] → [0, 1] then ease toward extremes
        const n = (a + 3) / 6;
        const alpha = Math.pow(n, 2.2) * density;
        if (alpha < 0.005) continue;
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(frame);
    }

    if (reduce) {
      // Paint a single still frame so the slide isn't blank.
      frame(performance.now());
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onResize = () => { size(); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [color, density]);
  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

// --- Slide 01  –  Title --------------------------------------------------------
function S01_Title({ motorwaySize = 60, omneaSize = 60, partnersStyle = 'stacked' } = {}) {
  // partnersStyle: 'stacked' (label above logo) or 'inline' (label inline left of logo)
  return (
    <Frame bg={C.bgWarm} label="01 / 11">
      <NoiseHero color={C.ink} density={0.04} />
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 180, bottom: SPACE.padBottom,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <Mono style={{ fontSize: TYPE.micro, color: C.inkMute }}>
            // meetup_no.014 – april edition
          </Mono>
          <h1
            style={{
              margin: '24px 0 0', fontSize: 240, lineHeight: 0.92,
              fontWeight: 700, letterSpacing: '-0.04em', color: C.ink,
              paddingBottom: 24,
              fontFamily: '"Inter Tight", system-ui, sans-serif',
            }}
          >
            <span style={{
              display: 'inline-block',
              fontFamily: '"Inter Tight", system-ui, sans-serif',
              fontWeight: 700,
            }}>London</span><span style={{ color: C.ink, fontFamily: '"Inter Tight", system-ui, sans-serif', fontWeight: 700 }}>.js</span>
          </h1>
          <div style={{
            marginTop: 48, fontSize: TYPE.lead, color: C.ink,
            maxWidth: 1500, lineHeight: 1.25,
          }}>
            AI you can actually trust. APIs at scale. A JavaScript engine,
            built from scratch.
          </div>
        </div>
        <div>
        {partnersStyle === 'inline'
          ? <FooterInline motorwaySize={motorwaySize} omneaSize={omneaSize} />
          : <FooterStacked motorwaySize={motorwaySize} omneaSize={omneaSize} />}
        </div>
      </div>
    </Frame>
  );
}

// Footer (stacked)  –  uses an explicit 2-row grid:
//   row 1: all three column labels, sharing one baseline
//   row 2: all three column bodies, vertically CENTERED on a shared center line
// This anchors each logo / text block by its mid-point rather than its bottom,
// which keeps Motorway's wordmark (no overhang) visually aligned with Omnea's
// wordmark (centered inside its taller icon overhang) and the WHEN·WHERE text.
const FOOTER_LABEL_GAP = 32;
const FOOTER_TOP_PAD = 56;
const FOOTER_BODY_ROW_H = 120;   // tall enough to absorb Omnea icon overhang
function FooterStacked({ motorwaySize, omneaSize }) {
  const labelStyle = {
    fontSize: TYPE.micro, color: C.inkMute,
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    letterSpacing: '0.02em', lineHeight: 1,
  };
  const cellStyle = {
    height: FOOTER_BODY_ROW_H,
    display: 'flex', alignItems: 'center',
  };
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'auto auto 1fr',
      gridTemplateRows: `auto ${FOOTER_BODY_ROW_H}px`,
      rowGap: FOOTER_LABEL_GAP,
      columnGap: 120,
      paddingTop: FOOTER_TOP_PAD,
      borderTop: `1px solid ${C.ruleStrong}`,
    }}>
      {/* Row 1: labels  –  top-aligned within their auto row, sharing baseline */}
      <span style={labelStyle}>HOSTED BY</span>
      <span style={labelStyle}>SPONSORED BY</span>
      <span style={{ ...labelStyle, justifySelf: 'end', whiteSpace: 'nowrap' }}>WHEN · WHERE</span>

      {/* Row 2: bodies  –  fixed height, all vertically centered */}
      <div style={cellStyle}>
        <MotorwayMark size={motorwaySize} color={C.ink} />
      </div>
      <div style={cellStyle}>
        <OmneaMark size={omneaSize} />
      </div>
      <div style={{
        ...cellStyle, justifyContent: 'center', justifySelf: 'end',
        whiteSpace: 'nowrap', textAlign: 'right',
        flexDirection: 'column', alignItems: 'flex-end',
        fontSize: TYPE.body, lineHeight: 1.2, fontWeight: 500,
      }}>
        <span>Thu 30 April · 18:00</span>
        <span style={{ color: C.inkSoft, fontSize: TYPE.small, fontWeight: 400, marginTop: 6 }}>
          12 Wells Mews, W1T 3HE
        </span>
      </div>
    </div>
  );
}

// Footer (inline)  –  labels sit left of each logo on a single row, all bottom-aligned.
function FooterInline({ motorwaySize, omneaSize }) {
  const labelStyle = {
    fontSize: TYPE.micro, color: C.inkMute,
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    letterSpacing: '0.02em', lineHeight: 1, whiteSpace: 'nowrap',
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 80,
      paddingTop: FOOTER_TOP_PAD, borderTop: `1px solid ${C.ruleStrong}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
        <span style={labelStyle}>HOSTED BY</span>
        <MotorwayMark size={motorwaySize} color={C.ink} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
        <span style={labelStyle}>SPONSORED BY</span>
        <OmneaMark size={omneaSize} />
      </div>
      <div style={{
        marginLeft: 'auto', textAlign: 'right',
        fontSize: TYPE.body, lineHeight: 1.2, fontWeight: 500,
      }}>
        <span style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>WHEN · WHERE</span>
        Thu 30 April · 18:00<br />
        <span style={{ color: C.inkSoft, fontSize: TYPE.small, fontWeight: 400 }}>
          12 Wells Mews, W1T 3HE
        </span>
      </div>
    </div>
  );
}

// --- Slide 02  –  Run of show --------------------------------------------------
function S02_Agenda() {
  const rows = [
    ['18:00', 'Doors open', 'Drinks, food, say hello to someone new'],
    ['18:30', 'Welcome', 'Your hosts for the evening'],
    ['18:50', 'Talk 01', 'Can an AI feature earn real trust?'],
    ['19:10', 'Talk 02', 'Design-first APIs at Motorway scale'],
    ['19:30', 'Talk 03', 'A JS engine built with AI – what could go wrong?'],
    ['19:50', 'Q&A + hangout', 'Wrapping up around 20:30'],
  ];
  return (
    <Frame bg={C.bg} label="02 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.inkMute }}>// run_of_show</Mono>
        <h2 style={{
          margin: '16px 0 56px', fontSize: TYPE.title, lineHeight: 1,
          fontWeight: 600, letterSpacing: '-0.03em',
        }}>Tonight</h2>
        <div>
          {rows.map(([t, k, d], i) => (
            <div key={i} data-reveal style={{
              ['--reveal-i']: i + 2,
              display: 'grid',
              gridTemplateColumns: '180px 1fr 1.4fr',
              alignItems: 'baseline',
              gap: 40,
              padding: '28px 0',
              borderTop: `1px solid ${C.ruleStrong}`,
              borderBottom: i === rows.length - 1 ? `1px solid ${C.ruleStrong}` : 'none',
            }}>
              <Mono style={{ fontSize: TYPE.body, color: C.accentInk, fontWeight: 600 }}>{t}</Mono>
              <span style={{ fontSize: TYPE.lead, fontWeight: 600 }}>{k}</span>
              <span style={{ fontSize: TYPE.body, color: C.inkSoft }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 03  –  Housekeeping -------------------------------------------------
function S03_Housekeeping() {
  const items = [
    { num: '01', label: 'Fire exits',  body: 'Two of them. Back through reception (the way you came in) or the stairwell at the rear. Assembly point is on Wells Mews – please do not stop to finish your slide first.' },
    { num: '02', label: 'Toilets',     body: 'Down the corridor, past the kitchen on your left. Please don\'t take a call in there  –  we can hear you.' },
    { num: '03', label: 'Food & drinks', body: 'Help yourself all evening. Allergens labelled where we know them  –  ask a host if you\'re unsure. No last orders, and no judgment on seconds.' },
    { num: '04', label: 'Code of conduct', body: 'Be excellent to each other. Ask good questions, listen generously, and leave people\'s inboxes alone. Tab vs spaces is a personal choice  –  keep it that way.' },
  ];
  return (
    <Frame bg={C.bgAlt} ink={C.bg} label="04 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: '#F2EEE499' }}>// before_we_start</Mono>
        <h2 style={{
          margin: '16px 0 64px', fontSize: TYPE.title, lineHeight: 1,
          fontWeight: 600, letterSpacing: '-0.03em', color: C.bg,
        }}>The important bits</h2>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 36,
        }}>
          {items.map(({ num, label, body }, i) => (
            <div key={num} data-reveal style={{
              ['--reveal-i']: i + 2,
              borderTop: `2px solid ${C.accent}`,
              paddingTop: 28,
            }}>
              <Mono style={{ fontSize: TYPE.micro, color: C.accent, fontWeight: 600 }}>
                {num}
              </Mono>
              <div style={{
                fontSize: TYPE.subtitle, fontWeight: 600, marginTop: 12,
                letterSpacing: '-0.02em',
              }}>{label}</div>
              <p style={{
                fontSize: TYPE.body, lineHeight: 1.35, marginTop: 20,
                color: '#F2EEE4',
              }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// --- Talk slide template -----------------------------------------------------
function TalkSlide({ idx, num, total, name, role, brand, title, abstract, bio, label, accent = C.accentInk, bg = C.bg, ink = C.ink }) {
  return (
    <Frame bg={bg} ink={ink} label={label}>
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Mono data-reveal style={{ fontSize: TYPE.micro, color: accent, fontWeight: 600 }}>
            // talk_{num} of {total}
          </Mono>
          <h2 style={{
            margin: '24px 0 0', fontSize: 88, lineHeight: 1.02,
            fontWeight: 600, letterSpacing: '-0.03em',
            textWrap: 'balance',
          }}>{title}</h2>
          <div style={{ flex: 1 }} />
          <div data-reveal style={{
            ['--reveal-i']: 3,
            paddingTop: 32, borderTop: `1px solid ${ink === C.bg ? '#F2EEE433' : C.ruleStrong}`,
          }}>
            <div style={{ fontSize: TYPE.subtitle, fontWeight: 600, letterSpacing: '-0.02em' }}>
              {name}
            </div>
            <div style={{ fontSize: TYPE.body, color: ink === C.bg ? '#F2EEE499' : C.inkSoft, marginTop: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span>{role}</span>
              <span style={{ opacity: 0.5 }}>·</span>
              {brand}
            </div>
            {bio && (
              <p style={{
                margin: '24px 0 0', fontSize: TYPE.small, lineHeight: 1.45,
                color: ink === C.bg ? '#F2EEE4B0' : C.inkSoft,
                textWrap: 'pretty', maxWidth: 620,
              }}>{bio}</p>
            )}
          </div>
        </div>
        <div data-reveal style={{
          ['--reveal-i']: 4,
          alignSelf: 'stretch',
          background: ink === C.bg ? '#FFFFFF14' : (bg === C.bgWarm ? 'rgba(255,255,255,0.35)' : '#16151418'),
          padding: '48px 44px',
          display: 'flex', flexDirection: 'column',
          borderLeft: `2px solid ${accent}`,
        }}>
          <Mono style={{ fontSize: TYPE.micro, color: ink === C.bg ? '#F2EEE499' : C.inkMute }}>
            ABSTRACT
          </Mono>
          <p style={{
            margin: '20px 0 0', fontSize: TYPE.body, lineHeight: 1.4,
            color: ink === C.bg ? '#F2EEE4E0' : C.inkSoft,
            textWrap: 'pretty',
          }}>{abstract}</p>
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 04  –  Talk 1 -------------------------------------------------------
function S04_Talk1() {
  return (
    <TalkSlide
      label="09 / 11"
      num="01" total="03"
      name="Ed Cooper"
      role="Senior Engineer"
      brand={<OmneaMark size={32} />}
      accent="#10A87A"
      title="How to tame your AI feature."
      bio="Senior Engineer at Omnea, building AI features that have to earn trust in production  –  not just in the demo."
      abstract={`Shipping an AI feature that demos well is easy; shipping one enterprise users trust with six-figure decisions is another story. Ed walks through what it actually took to get from "it works in the demo" to "we'd bet the contract on it."`}
    />
  );
}

// --- Slide 05  –  Talk 2 -------------------------------------------------------
function S05_Talk2() {
  return (
    <TalkSlide
      label="10 / 11"
      num="02" total="03"
      bg={C.bgWarm}
      name="Ryan Cormack & Jamie Toloui"
      role="Principal Eng. & Senior Backend Eng."
      brand={<MotorwayMark size={36} color={C.ink} />}
      accent={C.ink}
      title="APIs in the fast lane."
      bio="Ryan crossed over from digital marketing into engineering and never looked back  –  he ships fast and thinks in systems. Jamie builds the backend APIs that keep Motorway running at scale  –  the infrastructure that has to be right before anything else can happen."
      abstract="How Motorway are building new, and evolving existing, APIs across their platform with a design-first approach. Smithy keeps documentation, SDKs and implementation in sync – real-world examples of APIs handling millions of requests, type-safe and doing exactly what they say on the tin."
    />
  );
}

// --- Slide 06  –  Talk 3 -------------------------------------------------------
function S06_Talk3() {
  return (
    <TalkSlide
      label="11 / 11"
      num="03" total="03"
      bg={C.bgAlt} ink={C.bg}
      accent={C.accent}
      name="Johannes Stein"
      role="Head of Engineering & Startup CTO"
      brand={<span style={{ color: C.accent, fontFamily: '"JetBrains Mono", monospace', fontSize: 28 }}>// stealth</span>}
      title="Building a JavaScript engine with AI."
      bio="Head of Engineering and startup CTO. Open source contributor and maintainer across web, mobile and cross-platform. Thinks JavaScript deserves better  –  and is doing something about it."
      abstract="What if we built a JavaScript engine without the bloat of backward compatibility? Modern features only – let/const, arrow functions, zero dynamic code execution, TypeScript-compatible. How far did they get? Further than you'd expect. What broke? More than planned."
    />
  );
}

// --- Slide 07  –  Wi-Fi --------------------------------------------------------
function S07_Wifi() {
  return (
    <Frame bg={C.bg} label="03 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'flex', flexDirection: 'column',
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.inkMute }}>// finally</Mono>
        <h2 style={{
          margin: '16px 0 0', fontSize: TYPE.title, lineHeight: 1,
          fontWeight: 600, letterSpacing: '-0.03em',
        }}>Wi-Fi</h2>

        <div style={{
          marginTop: 80, flex: 1,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
        }}>
          <div data-reveal style={{
            ['--reveal-i']: 2,
            background: C.paper, padding: '56px 56px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            border: `1px solid ${C.ruleStrong}`,
          }}>
            <Mono style={{ fontSize: TYPE.micro, color: C.inkMute }}>NETWORK</Mono>
            <Mono style={{
              fontSize: 84, fontWeight: 600, lineHeight: 1.05,
              marginTop: 16, color: C.ink, letterSpacing: '-0.02em',
            }}>
              Motorway Guest
            </Mono>
          </div>
          <div data-reveal style={{
            ['--reveal-i']: 3,
            background: C.ink, padding: '56px 56px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            color: C.bg,
          }}>
            <Mono style={{ fontSize: TYPE.micro, color: C.accent }}>PASSWORD</Mono>
            <Mono style={{
              fontSize: 84, fontWeight: 600, lineHeight: 1.05,
              marginTop: 16, color: C.bg, letterSpacing: '-0.02em',
            }}>
              ••••••••••
            </Mono>
            <div style={{ fontSize: TYPE.small, color: '#F2EEE499', marginTop: 24, fontFamily: '"Inter Tight", sans-serif' }}>
              Yes, it's case sensitive. Ask a host if you need it.
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 08  –  Host ---------------------------------------------------------
function S08_Host() {
  return (
    <Frame bg={C.bg} label="05 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100,
      }}>
        <div>
          <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.inkMute }}>// our_host</Mono>
          <div data-reveal style={{ ['--reveal-i']: 1, marginTop: 24 }}>
            <MotorwayMark size={140} color={C.ink} />
          </div>
          <p data-reveal style={{
            ['--reveal-i']: 2,
            marginTop: 56, fontSize: TYPE.lead, lineHeight: 1.3,
            color: C.inkSoft, textWrap: 'pretty', maxWidth: 700,
          }}>
            Motorway runs a real-time marketplace connecting thousands of
            dealers with sellers across the UK  –  instant valuations, competitive
            bidding, built right here off Oxford Street.
          </p>
        </div>
        <div style={{
          alignSelf: 'stretch',
          display: 'grid', gridTemplateRows: '1fr 1fr', gap: 24,
        }}>
          <Stat n="7,500+" label="verified dealers" i={0} />
          <Stat n="1,000/day" label="cars sold on platform" i={1} />
        </div>
      </div>
    </Frame>
  );
}

const Stat = ({ n, label, i = 0 }) => (
  <div data-reveal style={{
    ['--reveal-i']: 3 + i,
    background: C.paper,
    border: `1px solid ${C.ruleStrong}`,
    padding: '40px 48px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  }}>
    <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1, color: C.ink }}>
      {n}
    </div>
    <Mono style={{ fontSize: TYPE.micro, color: C.inkSoft, marginTop: 16, textTransform: 'uppercase' }}>
      {label}
    </Mono>
  </div>
);

// --- Slide 09  –  Sponsor ------------------------------------------------------
function S09_Sponsor() {
  return (
    <Frame bg={C.bgAlt} ink={C.bg} label="06 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100,
      }}>
        <div>
          <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.accent }}>// our_sponsor</Mono>
          <div data-reveal style={{ ['--reveal-i']: 1, marginTop: 56, marginBottom: 40 }}>
            <OmneaMark size={96} inverted />
          </div>
          <p data-reveal style={{
            ['--reveal-i']: 2,
            marginTop: 40, fontSize: TYPE.lead, lineHeight: 1.3,
            color: '#F2EEE4CC', textWrap: 'pretty', maxWidth: 700,
          }}>
            Omnea is an AI-native platform that brings procurement, finance,
            legal and IT together in one place  –  faster approvals, better
            visibility, less back-and-forth. Series B, $50M. They're making
            tonight possible.
          </p>
        </div>
        <div style={{
          alignSelf: 'stretch',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: 24,
        }}>
          {[
            ['Series B', '$50M led by Insight & Khosla'],
            ['AI-native', 'Intake, approvals, supplier onboarding'],
            ['Trusted by', 'Spotify · McAfee · MongoDB · Hargreaves Lansdown'],
          ].map(([k, v], i) => (
            <div key={k} data-reveal style={{
              ['--reveal-i']: i + 3,
              padding: '28px 0',
              borderTop: '1px solid #F2EEE433',
              display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32,
              alignItems: 'baseline',
            }}>
              <Mono style={{ fontSize: TYPE.micro, color: C.accent, fontWeight: 600 }}>{k}</Mono>
              <div style={{ fontSize: TYPE.body, color: C.bg, lineHeight: 1.3 }}>{v}</div>
            </div>
          ))}
          <div style={{
            padding: '28px 0',
            borderTop: '1px solid #F2EEE433',
            borderBottom: '1px solid #F2EEE433',
          }} />
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 11  –  London.js by numbers ----------------------------------------
function S11_ByNumbers() {
  return (
    <Frame bg={C.bg} label="07 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'flex', flexDirection: 'column',
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.inkMute }}>// london_js.by_numbers</Mono>
        <h2 data-reveal style={{
          ['--reveal-i']: 1,
          marginTop: 24, marginBottom: 0,
          fontSize: TYPE.title, fontWeight: 600,
          letterSpacing: '-0.03em', lineHeight: 1.02, color: C.ink,
        }}>
          London.js by numbers
        </h2>
        <p data-reveal style={{
          ['--reveal-i']: 2,
          marginTop: 20, marginBottom: 0,
          fontSize: TYPE.lead, lineHeight: 1.3,
          color: C.inkSoft, maxWidth: 1200,
        }}>
          Students, career-switchers, seniors  –  same Thursday, same welcome.
        </p>

        <div style={{
          marginTop: 56,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 32,
        }}>
          <Stat n="4,434"   label="community members"          i={0} />
          <Stat n={'166 🌈'} label="registered tonight"         i={1} />
          <Stat n="1,734"   label="linkedin followers (+33)"   i={2} />
          <Stat n="20"      label="london.js project nights"   i={3} />
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 10  –  Thanks -------------------------------------------------------
function S10_Thanks({ qrUrl = 'https://www.linkedin.com/company/london-js/' }) {
  const [qrSrc, setQrSrc] = useState('');
  useEffect(() => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=0&data=${encodeURIComponent(qrUrl)}`;
    setQrSrc(url);
  }, [qrUrl]);
  return (
    <Frame bg={C.bg} label="08 / 11">
      <NoiseHero color={C.ink} density={0.08} />
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.inkMute }}>// thanks_for_coming</Mono>
            <h2 style={{
              margin: '24px 0 0', fontSize: 200, lineHeight: 0.88,
              fontWeight: 600, letterSpacing: '-0.045em',
              whiteSpace: 'nowrap',
            }}>
              Register now.
            </h2>
            <p data-reveal style={{
              ['--reveal-i']: 1,
              margin: '32px 0 0', fontSize: TYPE.lead, color: C.inkSoft, lineHeight: 1.3,
            }}>
              Glad you made it. Scan the QR to follow us on LinkedIn.
            </p>
            <p data-reveal style={{
              ['--reveal-i']: 2,
              margin: '16px 0 0', fontSize: TYPE.body, color: C.inkMute, lineHeight: 1.3,
            }}>
              Three talks coming up  –  grab a drink and find a seat.
            </p>
          </div>
          <div style={{
            paddingTop: 32, borderTop: `1px solid ${C.ruleStrong}`,
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32,
          }}>
            {[
              ['James McLeod', 'NatWest Group'],
              ['Jordan Potts', 'Albany Growth'],
              ['Will Laing', 'Plan:it'],
            ].map(([n, c], i) => (
              <div key={n} data-reveal style={{ ['--reveal-i']: 2 + i }}>
                <Mono style={{ fontSize: TYPE.micro, color: C.inkMute }}>ORGANISER</Mono>
                <div style={{ fontSize: TYPE.body, fontWeight: 600, marginTop: 8 }}>{n}</div>
                <div style={{ fontSize: TYPE.small, color: C.inkSoft }}>{c}</div>
              </div>
            ))}
          </div>
        </div>
        <div data-reveal style={{
          ['--reveal-i']: 5,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end',
        }}>
          <div style={{
            background: C.paper, padding: 28, border: `3px solid ${C.bgWarm}`,
          }}>
            {qrSrc && <img src={qrSrc} width={420} height={420} alt="Follow London.js on LinkedIn" style={{ display: 'block' }} />}
          </div>
          <Mono style={{ fontSize: TYPE.micro, color: C.inkSoft, marginTop: 20 }}>
            FOLLOW · linkedin.com/company/london-js
          </Mono>
        </div>
      </div>
    </Frame>
  );
}

// --- Export ------------------------------------------------------------------
// Label-to-component registry only. Play order is set by <section> order in
// London JS - April 2026.html. See docs/SLIDE_ORDER_MECHANISM.md.
window.Slides = {
  S01_Title, S02_Agenda, S03_Housekeeping,
  S04_Talk1, S05_Talk2, S06_Talk3,
  S07_Wifi, S08_Host, S09_Sponsor,
  S11_ByNumbers,
  S10_Thanks,
};
