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
      <span>30 · 07 · 2026</span>
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

// incident.io: official SVG assets (provided by incident.io), staged in assets/.
// `kind` selects wordmark vs the standalone icon; `variant` selects the
// colourway. `size` is the rendered height in px (width follows the SVG's
// native aspect ratio via width: 'auto').
//   wordmark colour-dark  = dark ink text + orange  -> use on light/cream/yellow backgrounds
//   wordmark colour-light = white text + orange      -> use on dark backgrounds
//   wordmark mono-dark    = ink-only, no orange       -> mono on light backgrounds
//   wordmark mono-light   = white-only, no orange      -> mono on an orange fill or dark bg
//   icon alarmalade       = orange icon mark, for small accent use
const IncidentMark = ({ kind = 'wordmark', variant = 'colour-dark', size = 88, alt = 'incident.io' }) => {
  const src = kind === 'icon'
    ? (variant === 'alarmalade' ? 'assets/icon-alarmalade.svg' : `assets/icon-${variant}.svg`)
    : `assets/wordmark-${variant}.svg`;
  return (
    <img
      src={src}
      alt={alt}
      style={{ height: size, width: 'auto', display: 'inline-block', flexShrink: 0 }}
    />
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
function S01_Title({ incidentSize = 40 } = {}) {
  return (
    <Frame bg={C.bgWarm} label="01 / 12">
      <NoiseHero color={C.ink} density={0.04} />
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 180, bottom: SPACE.padBottom,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <Mono style={{ fontSize: TYPE.micro, color: C.inkMute }}>
            // london.js · july 2026
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
            Gardening the frontend in the LLM era, clinical AI in JavaScript,
            and an agentic software factory. JavaScript, doing serious work.
          </div>
        </div>
        <div>
          <FooterCoBrand incidentSize={incidentSize} />
        </div>
      </div>
    </Frame>
  );
}

// Footer - single co-brand line: "hosted & sponsored by" + one wordmark,
// with when/where on the right. incident.io is both host and sponsor for
// this event, so there is only one logo (no partner-toggle needed).
const FOOTER_TOP_PAD = 56;
function FooterCoBrand({ incidentSize = 40 }) {
  const labelStyle = {
    fontSize: TYPE.micro, color: C.inkMute,
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    letterSpacing: '0.02em', lineHeight: 1, whiteSpace: 'nowrap',
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      paddingTop: FOOTER_TOP_PAD, borderTop: `1px solid ${C.ruleStrong}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
        <span style={labelStyle}>HOSTED &amp; SPONSORED BY</span>
        <IncidentMark kind="wordmark" variant="colour-dark" size={incidentSize} />
      </div>
      <div style={{
        textAlign: 'right',
        fontSize: TYPE.body, lineHeight: 1.2, fontWeight: 500,
      }}>
        <span style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>WHEN · WHERE</span>
        Thu 30 July 2026 · 18:00<br />
        <span style={{ color: C.inkSoft, fontSize: TYPE.small, fontWeight: 400 }}>
          Floor 5, The Bower, 207-211 Old Street, EC1V 9NR
        </span>
      </div>
    </div>
  );
}

// --- Slide 02  –  Run of show --------------------------------------------------
function S02_Agenda() {
  const rows = [
    ['18:00', 'Doors open', 'Drinks, food, say hello to someone new'],
    ['18:30', 'Welcome', 'Your hosts open the night (5-10 min)'],
    ['18:40', 'Talk 01', 'Joe Hart, incident.io'],
    ['19:15', 'Talk 02', 'Isabelle Taylor, Healthtech 1'],
    ['19:50', 'Talk 03', 'Igor Luchenkov, Clarify'],
    ['20:25', 'Q&A + hangout', 'Wrapping up around 20:30'],
  ];
  return (
    <Frame bg={C.bg} label="02 / 12">
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
    { num: '01', label: 'Fire',            body: 'Follow the exit signs; your hosts will point the way.' },
    { num: '02', label: 'Code of conduct', body: 'Be excellent to each other. confcodeofconduct.com.' },
  ];
  return (
    <Frame bg={C.bgAlt} ink={C.bg} label="04 / 12">
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
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 36,
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
        <p data-reveal style={{
          ['--reveal-i']: 4,
          marginTop: 56, fontSize: TYPE.body, lineHeight: 1.35,
          color: '#F2EEE499', maxWidth: 1100,
        }}>
          Everything else, Will, Jordan and incident.io will cover on the night.
        </p>
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
      label="10 / 12"
      num="01" total="03"
      name="Joe Hart"
      role="Product Engineer"
      brand={<IncidentMark kind="wordmark" variant="colour-dark" size={30} />}
      accent="#F25533"
      title="Frontend gardening in the new world of LLMs."
      bio="JavaScript/TypeScript engineer with almost a decade of experience, focused on charming, performant, accessible UIs. React for 7+ years, full-stack when needed. Goldsmiths, University of London. Writes at joehart.co.uk."
      abstract="Weeds, pruning and the odd rogue commit. Joe on tending a frontend codebase now the LLMs have picked up a trowel, and keeping the craft alive while the machines garden alongside you."
    />
  );
}

// --- Slide 05  –  Talk 2 -------------------------------------------------------
function S05_Talk2() {
  return (
    <TalkSlide
      label="11 / 12"
      num="02" total="03"
      bg={C.bgAlt} ink={C.bg}
      name="Isabelle Taylor"
      role="Tech Lead"
      brand={<Mono>Healthtech 1</Mono>}
      accent="#F25533"
      title="Shipping clinical AI you can trust, in JavaScript."
      bio="Full-stack engineer with an interest in building products that matter. Tech Lead at Healthtech 1 (joined 2025). University of Canterbury. Based in London."
      abstract="Clinical AI where a wrong answer actually matters. Isabelle on how Healthtech 1 built a sophisticated triage product in JavaScript, and lived to tell the tale."
    />
  );
}

// --- Slide 06  –  Talk 3 -------------------------------------------------------
function S06_Talk3() {
  return (
    <TalkSlide
      label="12 / 12"
      num="03" total="03"
      name="Igor Luchenkov"
      role="Staff Product Engineer"
      brand={<Mono>Clarify</Mono>}
      accent="#F25533"
      title="Building an agentic software factory with JS."
      bio="Staff Product Engineer at Clarify, applying product engineering and machine learning to make a joyful CRM more intelligent and AI-driven. Full-stack, TypeScript, Python, applied ML and NLP. Runs hackathons. Based in London."
      abstract="Back for a second helping. Igor turns a swarm of agents into a working software factory, all in JS. Bring your own hard hat."
    />
  );
}

// --- Slide 07  –  Wi-Fi --------------------------------------------------------
function S07_Wifi() {
  return (
    <Frame bg={C.bg} label="03 / 12">
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
              Ask a host
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
              On the night
            </Mono>
            <div style={{ fontSize: TYPE.small, color: '#F2EEE499', marginTop: 24, fontFamily: '"Inter Tight", sans-serif' }}>
              Venue wifi is available on the night. Ask a host for details.
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
    <Frame bg={C.bg} label="05 / 12">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100,
      }}>
        <div>
          <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.inkMute }}>// our_host</Mono>
          <div data-reveal style={{ ['--reveal-i']: 1, marginTop: 24 }}>
            <IncidentMark kind="wordmark" variant="colour-dark" size={100} />
          </div>
          <p data-reveal style={{
            ['--reveal-i']: 2,
            marginTop: 56, fontSize: TYPE.lead, lineHeight: 1.3,
            color: C.inkSoft, textWrap: 'pretty', maxWidth: 700,
          }}>
            incident.io host tonight, their 4th London.js, in their new
            office at The Bower. The single place you turn to when things go
            wrong: incident response, on-call and post-incident learning in
            one platform.
          </p>
        </div>
        <div style={{
          alignSelf: 'stretch',
          display: 'grid', gridTemplateRows: '1fr 1fr', gap: 24,
        }}>
          <Stat n="250,000+" label="incidents powered" i={0} accentBorder="#F25533" />
          <Stat n="$62M" label="Series B, led by Insight Partners (2025)" i={1} accentBorder="#F25533" />
        </div>
      </div>
    </Frame>
  );
}

const Stat = ({ n, label, i = 0, accentBorder }) => (
  <div data-reveal style={{
    ['--reveal-i']: 3 + i,
    background: C.paper,
    border: `1px solid ${C.ruleStrong}`,
    borderTop: accentBorder ? `4px solid ${accentBorder}` : `1px solid ${C.ruleStrong}`,
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
    <Frame bg={C.bgAlt} ink={C.bg} label="06 / 12">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100,
      }}>
        <div>
          <Mono data-reveal style={{ fontSize: TYPE.micro, color: '#F25533' }}>// our_sponsor</Mono>
          <div data-reveal style={{ ['--reveal-i']: 1, marginTop: 56, marginBottom: 40 }}>
            <IncidentMark kind="wordmark" variant="colour-light" size={64} />
          </div>
          <p data-reveal style={{
            ['--reveal-i']: 2,
            marginTop: 40, fontSize: TYPE.lead, lineHeight: 1.3,
            color: '#F2EEE4CC', textWrap: 'pretty', maxWidth: 700,
          }}>
            AI that works incidents with you. incident.io's AI SRE
            investigates autonomously, correlates across your stack and
            drafts fixes: up to 90% accuracy, 5x faster resolution. On-call
            launched 2024.
          </p>
        </div>
        <div style={{
          alignSelf: 'stretch',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: 24,
        }}>
          {[
            ['Trusted by', 'OpenAI · Netflix · Airbnb · Etsy'],
            ['AI SRE', 'Autonomous investigation, ~90% accuracy, 5x faster'],
            ['Scale', '2,000+ companies, 250,000+ incidents'],
          ].map(([k, v], i) => (
            <div key={k} data-reveal style={{
              ['--reveal-i']: i + 3,
              padding: '28px 0',
              borderTop: '1px solid #F2EEE433',
              display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32,
              alignItems: 'baseline',
            }}>
              <Mono style={{ fontSize: TYPE.micro, color: '#F25533', fontWeight: 600 }}>{k}</Mono>
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
    <Frame bg={C.bg} label="07 / 12">
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
          Students, career-switchers, seniors - same Thursday, same welcome.
        </p>

        <div style={{
          marginTop: 56,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 32,
        }}>
          <Stat n="4,481" label="community members"       i={0} />
          <Stat n="157"   label="registered tonight"      i={1} />
          <Stat n="1,783" label="linkedin followers"      i={2} />
          <Stat n="20+"   label="london.js project nights" i={3} />
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
    <Frame bg={C.bg} label="08 / 12">
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
              ['James McLeod', 'Open Source Lead, NatWest Group · FINOS Board Member · London.js Organiser'],
              ['Jordan Potts', 'Head of Technology, Albany Growth · Co-Founder, London.js'],
              ['Will Laing', 'Co-Founder, Plan:it · Co-Founder & Organiser, London.js'],
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
          <img src="assets/london-js-organisers.jpeg" alt="London.js organisers" style={{ width: 420, display: 'block', marginBottom: 24 }} />
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

// --- Slide 12  Announcements section divider ----------------------------
function S12_Announcements() {
  return (
    <Frame bg={C.bg} label="09 / 12">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 320, bottom: SPACE.padBottom,
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.inkMute }}>
          // section_divider
        </Mono>
        <h2 data-reveal style={{
          ['--reveal-i']: 1,
          margin: '24px 0 0', fontSize: TYPE.display, lineHeight: 0.9,
          fontWeight: 700, letterSpacing: '-0.04em', color: C.ink,
        }}>
          Your Announcements
        </h2>
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
  S12_Announcements,
};
