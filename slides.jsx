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
  veedInk: '#121212',                // VEED ink: guest accent on light slides
  veedLime: '#96FF1A',               // VEED lime: kickers and rules on the dark slides (02 to 11)
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
      <span>28 · 10 · 2026</span>
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

// VEED.IO: host-supplied wordmark; source of record is assets/veed-wordmark.svg.
// Inline SVG (not <img>) so fill="currentColor" follows `color`: ink on light
// slides, cream on dark. Never lime. `size` is the rendered height in px.
const VEED_PATH = 'm32.626.367-8.802 21.589a3.28 3.28 0 0 1-3.041 2.043h-8.895a3.28 3.28 0 0 1-3.04-2.04L.02.367A.266.266 0 0 1 .266 0h8.91c.222 0 .421.138.5.346l6.672 17.795L22.967.348a.53.53 0 0 1 .5-.348h8.912c.189 0 .318.192.247.367m.813-.1v23.466c0 .147.12.267.267.267h24.463c.146 0 .266-.12.266-.267v-5.851a.267.267 0 0 0-.266-.267h-15.92a.267.267 0 0 1-.266-.267v-1.927c0-.146.12-.266.267-.266h15.557c.147 0 .267-.12.267-.267V9.082a.267.267 0 0 0-.267-.267H42.25a.267.267 0 0 1-.267-.267V6.652c0-.147.12-.267.267-.267h15.919c.146 0 .266-.12.266-.267V.267A.267.267 0 0 0 58.17 0H33.706a.267.267 0 0 0-.267.267m26.12 0v23.466c0 .147.12.267.268.267H84.29c.146 0 .266-.12.266-.267v-5.851a.27.27 0 0 0-.266-.267H68.37a.267.267 0 0 1-.266-.267v-1.927c0-.146.12-.266.267-.266h15.557c.147 0 .267-.12.267-.267V9.082a.267.267 0 0 0-.267-.267H68.37a.267.267 0 0 1-.267-.267V6.652c0-.147.12-.267.267-.267H84.29c.146 0 .266-.12.266-.267V.267A.27.27 0 0 0 84.29 0H59.826a.267.267 0 0 0-.266.267m26.123 23.466c0 .147.12.267.266.267h16.76c3.668 0 6.627-.951 8.891-2.868q3.396-2.852 3.396-9.147 0-6.294-3.396-9.148C109.335.95 106.377 0 102.708 0h-16.76a.267.267 0 0 0-.266.267zm8.81-6.163a.267.267 0 0 1-.267-.267V6.697c0-.147.12-.267.266-.267h6.255q2.898 0 4.302 1.268c.936.845 1.403 2.279 1.403 4.287s-.467 3.472-1.403 4.317q-1.404 1.268-4.302 1.268z';
const VeedMark = ({ size = 88, color = C.bg, title = 'VEED.IO' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 115 24"
    role="img" aria-label={title}
    style={{ height: size, width: size * 115 / 24, display: 'inline-block', flexShrink: 0, color }}
  >
    <path fill="currentColor" d={VEED_PATH} />
  </svg>
);

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
function S01_Title({ veedSize = 40 } = {}) {
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
            // london.js · october 2026
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
            Building a video-editing agent from a prompt, and using LLMs to
            punch above your weight. JavaScript, doing serious work.
          </div>
        </div>
        <div>
          <FooterCoBrand veedSize={veedSize} />
        </div>
      </div>
    </Frame>
  );
}

// Footer - single co-brand line: "hosted & sponsored by" + one wordmark,
// with when/where on the right. VEED is both host and sponsor for
// this event, so there is only one logo (no partner-toggle needed).
const FOOTER_TOP_PAD = 56;
function FooterCoBrand({ veedSize = 40 }) {
  const labelStyle = {
    fontSize: TYPE.micro, color: C.inkMute,
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    letterSpacing: '0.02em', lineHeight: 1, whiteSpace: 'nowrap',
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: FOOTER_TOP_PAD, borderTop: `1px solid ${C.ruleStrong}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={labelStyle}>HOSTED &amp; SPONSORED BY</span>
        <span style={{ display: 'inline-block' }}>
          <VeedMark size={veedSize} color={C.veedInk} />
        </span>
      </div>
      <div style={{
        textAlign: 'right',
        fontSize: TYPE.body, lineHeight: 1.2, fontWeight: 500,
      }}>
        <span style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>WHEN · WHERE</span>
        Wed 28 October 2026 · 18:00<br />
        <span style={{ color: C.inkSoft, fontSize: TYPE.small, fontWeight: 400 }}>
          17-18 Clere Street, EC2A 4LJ
        </span>
      </div>
    </div>
  );
}

// --- Slide 02  –  Run of show --------------------------------------------------
function S02_Agenda() {
  const rows = [
    ['18:00', 'Doors open', 'Food, drinks and hellos at VEED'],
    ['18:30', 'Welcome', 'Intro and housekeeping'],
    ['18:40', 'Talk 01', 'Joséphine Parquet, VEED'],
    ['19:25', 'Talk 02', 'Sam Starling, Semaloop'],
    ['20:10', 'Q&A + hangout', 'Questions for both speakers, then chat'],
    ['20:30', 'Wrap', 'Close, then the pub for anyone keen'],
  ];
  return (
    <Frame bg={C.bgAlt} ink={C.bg} label="04 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.veedLime }}>// run_of_show</Mono>
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
              borderTop: '1px solid #F2EEE433',
              borderBottom: i === rows.length - 1 ? '1px solid #F2EEE433' : 'none',
            }}>
              <Mono style={{ fontSize: TYPE.body, color: C.veedLime, fontWeight: 600 }}>{t}</Mono>
              <span style={{ fontSize: TYPE.lead, fontWeight: 600 }}>{k}</span>
              <span style={{ fontSize: TYPE.body, color: '#F2EEE4CC' }}>{d}</span>
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
    { num: '01', label: 'Fire',            body: "Note your nearest exit. In an alarm, follow the VEED team's lead." },
    { num: '02', label: 'Code of conduct', body: 'Be kind. Anything feel off? Find an organiser. confcodeofconduct.com' },
    { num: '03', label: 'Food & drink',    body: 'Not just pizza. Allergies and diets catered for where possible.' },
  ];
  return (
    <Frame bg={C.bgAlt} ink={C.bg} label="05 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'flex', flexDirection: 'column',
      }}>
        <div>
          <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.veedLime }}>// before_we_start</Mono>
          <h2 style={{
            margin: '16px 0 0', fontSize: TYPE.title, lineHeight: 1,
            fontWeight: 600, letterSpacing: '-0.03em', color: C.bg,
          }}>The important bits</h2>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48,
          }}>
            {items.map(({ num, label, body }, i) => (
              <div key={num} data-reveal style={{
                ['--reveal-i']: i + 2,
                borderTop: `2px solid ${C.veedLime}`,
                paddingTop: 32,
              }}>
                <Mono style={{ fontSize: TYPE.micro, color: C.veedLime, fontWeight: 600 }}>
                  {num}
                </Mono>
                <div style={{
                  fontSize: TYPE.subtitle, fontWeight: 600, marginTop: 16,
                  letterSpacing: '-0.02em',
                }}>{label}</div>
                <p style={{
                  fontSize: TYPE.body, lineHeight: 1.35, marginTop: 24,
                  color: '#F2EEE4',
                }}>{body}</p>
              </div>
            ))}
          </div>
          <p data-reveal style={{
            ['--reveal-i']: 5,
            marginTop: 72, fontSize: TYPE.lead, lineHeight: 1.35,
            color: '#F2EEE499', maxWidth: 1400,
          }}>
            Any questions tonight? Find Will, James or the VEED team.
          </p>
        </div>
      </div>
    </Frame>
  );
}

// --- Talk slide template -----------------------------------------------------
function TalkSlide({ idx, num, total, name, role, brand, title, abstract, bio, photo, label, accent = C.veedLime, bg = C.bg, ink = C.ink }) {
  // No published abstract: the right-hand panel carries the bio instead.
  const panelLabel = abstract ? 'ABSTRACT' : 'ABOUT THE SPEAKER';
  const panelText = abstract || bio;
  const bioInline = abstract ? bio : null;
  const nameStack = (
    <>
      <div style={{ fontSize: TYPE.subtitle, fontWeight: 600, letterSpacing: '-0.02em' }}>
        {name}
      </div>
      <div style={{ fontSize: TYPE.body, color: ink === C.bg ? '#F2EEE499' : C.inkSoft, marginTop: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>{role}</span>
        <span style={{ opacity: 0.5 }}>·</span>
        {brand}
      </div>
      {bioInline && (
        <p style={{
          margin: '24px 0 0', fontSize: TYPE.small, lineHeight: 1.45,
          color: ink === C.bg ? '#F2EEE4B0' : C.inkSoft,
          textWrap: 'pretty', maxWidth: 620,
        }}>{bioInline}</p>
      )}
    </>
  );
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
            {photo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                <img src={photo} alt={name} style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, flex: 'none' }} />
                <div>{nameStack}</div>
              </div>
            ) : nameStack}
          </div>
        </div>
        <div data-reveal style={{
          ['--reveal-i']: 4,
          alignSelf: 'stretch',
          background: ink === C.bg ? '#FFFFFF14' : '#16151418',
          padding: '48px 44px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          borderLeft: `2px solid ${accent}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Mono style={{ fontSize: TYPE.micro, color: ink === C.bg ? '#F2EEE499' : C.inkMute }}>
              {panelLabel}
            </Mono>
            <span style={{
              fontSize: 140, fontWeight: 700, lineHeight: 0.8,
              letterSpacing: '-0.04em', color: accent, opacity: 0.14,
              fontFamily: '"Inter Tight", system-ui, sans-serif',
            }}>{num}</span>
          </div>
          <p style={{
            margin: '20px 0 0', fontSize: TYPE.body, lineHeight: 1.4,
            color: ink === C.bg ? '#F2EEE4E0' : C.inkSoft,
            textWrap: 'pretty',
          }}>{panelText}</p>
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 04  –  Talk 1 -------------------------------------------------------
function S04_Talk1() {
  return (
    <TalkSlide
      label="10 / 11"
      bg={C.bgAlt} ink={C.bg}
      num="01" total="02"
      name="Joséphine Parquet"
      role="Head of API Products"
      brand={<VeedMark size={26} color={C.bg} />}
      accent={C.veedLime}
      title="Prompt to Video: Building a Video-Editing Agent"
      photo="assets/speaker-parquet.jpg"
      bio="Joséphine builds consumer AI products where creativity meets physical storytelling. Before VEED: Product Manager at Stability AI across image, 3D and audio models, PM for Clipdrop, then Entrepreneur in Residence at Entrepreneurs First. Also London Chair of AI Circle, founder of Field Notes and a Women Who Build mentor."
    />
  );
}

// --- Slide 05  –  Talk 2 -------------------------------------------------------
function S05_Talk2() {
  return (
    <TalkSlide
      label="11 / 11"
      num="02" total="02"
      bg={C.bgAlt} ink={C.bg}
      name="Sam Starling"
      role="Founding Engineer"
      brand={<Mono>Semaloop</Mono>}
      accent={C.veedLime}
      title="Using LLMs to punch above my weight"
      photo="assets/speaker-starling.jpg"
      bio="At Semaloop, Sam builds agents that test mobile apps the way humans do: through sight, sound and touch. Before that, Sam was a Tech Lead at incident.io (our July hosts), growing the Response team from five engineers to fifteen and shipping Catalog, Scribe and Microsoft Teams support. Earlier: Monzo, SoundCloud and the BBC."
    />
  );
}

// --- Slide 07  –  Wi-Fi --------------------------------------------------------
function S07_Wifi() {
  return (
    <Frame bg={C.bgAlt} ink={C.bg} label="02 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'flex', flexDirection: 'column',
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.veedLime }}>// first_things_first</Mono>
        <h2 style={{
          margin: '16px 0 0', fontSize: TYPE.title, lineHeight: 1,
          fontWeight: 600, letterSpacing: '-0.03em',
        }}>Wi-Fi</h2>

        <div style={{
          marginTop: 80, flex: 1,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr', gap: 32,
        }}>
          <div data-reveal style={{
            ['--reveal-i']: 2,
            background: '#FFFFFF14', padding: '64px 56px',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            border: '1px solid #F2EEE433',
          }}>
            <Mono style={{ fontSize: TYPE.micro, color: C.veedLime }}>NETWORK</Mono>
            <Mono style={{
              fontSize: 56, fontWeight: 600, lineHeight: 1.05,
              marginTop: 16, color: C.bg, letterSpacing: '-0.02em',
            }}>
              VEEDGuest
            </Mono>
          </div>
          <div data-reveal style={{
            ['--reveal-i']: 3,
            background: C.ink, padding: '64px 56px',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            color: C.bg, border: '1px solid #F2EEE433',
          }}>
            <Mono style={{ fontSize: TYPE.micro, color: C.veedLime }}>PASSWORD</Mono>
            <Mono style={{
              fontSize: 64, fontWeight: 600, lineHeight: 1.1,
              marginTop: 16, color: C.bg, letterSpacing: '-0.02em',
            }}>
              Ask the host<br />on the night
            </Mono>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 08  –  Host ---------------------------------------------------------
function S08_Host() {
  return (
    <Frame bg={C.bgAlt} ink={C.bg} label="06 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100,
      }}>
        <div>
          <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.veedLime }}>// our_host</Mono>
          <div data-reveal style={{ ['--reveal-i']: 1, marginTop: 24 }}>
            <VeedMark size={100} color={C.bg} />
          </div>
          <p data-reveal style={{
            ['--reveal-i']: 2,
            marginTop: 56, fontSize: TYPE.lead, lineHeight: 1.3,
            color: '#F2EEE4CC', textWrap: 'pretty', maxWidth: 700,
          }}>
            VEED is an AI video creation platform, founded in London in 2018
            and still headquartered here. Its mission: "Making video creation
            fast enough that the idea doesn't die before the video does."
            Thank you for having us.
          </p>
        </div>
        <div style={{
          alignSelf: 'stretch',
          display: 'grid', gridTemplateRows: '1fr 1fr', gap: 24,
        }}>
          <Stat n="2018" label="Founded in London" i={0} accentBorder={C.veedLime} />
          <Stat n="150+" label="People, remote-first" i={1} accentBorder={C.veedLime} />
        </div>
      </div>
    </Frame>
  );
}

const Stat = ({ n, label, i = 0, accentBorder }) => (
  <div data-reveal style={{
    ['--reveal-i']: 3 + i,
    background: '#FFFFFF14',
    border: '1px solid #F2EEE433',
    borderTop: accentBorder ? `4px solid ${accentBorder}` : '1px solid #F2EEE433',
    padding: '40px 48px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  }}>
    <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1, color: C.bg }}>
      {n}
    </div>
    <Mono style={{ fontSize: TYPE.micro, color: '#F2EEE4CC', marginTop: 16, textTransform: 'uppercase' }}>
      {label}
    </Mono>
  </div>
);

// --- Slide 09  –  Sponsor ------------------------------------------------------
function S09_Sponsor() {
  return (
    <Frame bg={C.bgAlt} ink={C.bg} label="07 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100,
      }}>
        <div>
          <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.veedLime }}>// our_sponsor</Mono>
          <div data-reveal style={{ ['--reveal-i']: 1, marginTop: 56, marginBottom: 40 }}>
            <VeedMark size={64} color={C.bg} />
          </div>
          <p data-reveal style={{
            ['--reveal-i']: 2,
            marginTop: 40, fontSize: TYPE.lead, lineHeight: 1.3,
            color: '#F2EEE4CC', textWrap: 'pretty', maxWidth: 700,
          }}>
            Generate and edit in one workflow. VEED lets you create talking
            heads, edit with AI, dub videos and add subtitles in 100+
            languages. Thank you to VEED for sponsoring London.js tonight.
          </p>
        </div>
        <div style={{
          alignSelf: 'stretch',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: 24,
        }}>
          {[
            ['Used by', '10M+ people every month'],
            ['Trusted by', '76% of Fortune 500 companies'],
            ['Rated', '4.6 from 2,100+ reviews'],
            ['Get started', 'veed.io'],
          ].map(([k, v], i) => (
            <div key={k} data-reveal style={{
              ['--reveal-i']: i + 3,
              padding: '28px 0',
              borderTop: '1px solid #F2EEE433',
              borderBottom: i === 3 ? '1px solid #F2EEE433' : 'none',
              display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32,
              alignItems: 'baseline',
            }}>
              <Mono style={{ fontSize: TYPE.micro, color: C.veedLime, fontWeight: 600 }}>{k}</Mono>
              <div style={{ fontSize: TYPE.body, color: C.bg, lineHeight: 1.3 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 11  –  London.js by numbers ----------------------------------------
function S11_ByNumbers() {
  return (
    <Frame bg={C.bgAlt} ink={C.bg} label="08 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'flex', flexDirection: 'column',
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.veedLime }}>// london_js.by_numbers</Mono>
        <h2 data-reveal style={{
          ['--reveal-i']: 1,
          marginTop: 24, marginBottom: 0,
          fontSize: TYPE.title, fontWeight: 600,
          letterSpacing: '-0.03em', lineHeight: 1.02, color: C.bg,
        }}>
          London.js by numbers
        </h2>
        <p data-reveal style={{
          ['--reveal-i']: 2,
          marginTop: 20, marginBottom: 0,
          fontSize: TYPE.lead, lineHeight: 1.3,
          color: '#F2EEE4CC', maxWidth: 1200,
        }}>
          23 events in just over four years, back to a Thursday at Netflix in September 2022.
        </p>

        <div style={{
          marginTop: 56,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 32,
        }}>
          <Stat n="4,499" label="community members"         i={0} accentBorder={C.veedLime} />
          <Stat n="98"    label="registered tonight"        i={1} accentBorder={C.veedLime} />
          <Stat n="1,812" label="linkedin followers"        i={2} accentBorder={C.veedLime} />
          <Stat n="23"    label="events since the relaunch" i={3} accentBorder={C.veedLime} />
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
    <Frame bg={C.bgAlt} ink={C.bg} label="03 / 11">
      <NoiseHero color={C.bg} density={0.08} />
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.veedLime }}>// welcome</Mono>
            <h2 style={{
              margin: '24px 0 0', fontSize: 200, lineHeight: 0.88,
              fontWeight: 600, letterSpacing: '-0.045em',
              whiteSpace: 'nowrap',
            }}>
              Register now.
            </h2>
            <p data-reveal style={{
              ['--reveal-i']: 1,
              margin: '32px 0 0', fontSize: TYPE.lead, color: '#F2EEE4CC', lineHeight: 1.3,
            }}>
              Glad you made it. Scan the QR to follow us on LinkedIn.
            </p>
            <p data-reveal style={{
              ['--reveal-i']: 2,
              margin: '16px 0 0', fontSize: TYPE.body, color: '#F2EEE499', lineHeight: 1.3,
            }}>
              Two talks coming up - grab a drink and find a seat.
            </p>
          </div>
          <div style={{
            marginTop: 64, paddingTop: 32, borderTop: '1px solid #F2EEE433',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32,
          }}>
            {[
              ['James McLeod', 'Open Source Program Lead, NatWest Group · FINOS Board Member · London.js Organiser'],
              ['Jordan Potts', 'Head of Technology, Albany Growth · Co-Founder, London.js'],
              ['Will Laing', 'Co-Founder, Plan:it · Co-Founder & Organiser, London.js'],
            ].map(([n, c], i) => (
              <div key={n} data-reveal style={{ ['--reveal-i']: 2 + i }}>
                <Mono style={{ fontSize: TYPE.micro, color: C.veedLime }}>ORGANISER</Mono>
                <div style={{ fontSize: TYPE.body, fontWeight: 600, marginTop: 8 }}>{n}</div>
                <div style={{ fontSize: 20, lineHeight: 1.35, color: '#F2EEE4CC', marginTop: 6 }}>{c}</div>
              </div>
            ))}
          </div>
        </div>
        <div data-reveal style={{
          ['--reveal-i']: 5,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
        }}>
          <img src="assets/london-js-organisers.jpeg" alt="London.js organisers" style={{ width: 393, display: 'block', marginBottom: 20 }} />
          <div style={{
            background: C.paper, padding: 24, border: `3px solid ${C.bgWarm}`,
          }}>
            {qrSrc && <img src={qrSrc} width={345} height={345} alt="Follow London.js on LinkedIn" style={{ display: 'block' }} />}
          </div>
          <Mono style={{ fontSize: TYPE.micro, color: '#F2EEE4CC', marginTop: 20 }}>
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
    <Frame bg={C.bgAlt} ink={C.bg} label="09 / 11">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 320, bottom: SPACE.padBottom,
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.veedLime }}>
          // section_divider
        </Mono>
        <h2 data-reveal style={{
          ['--reveal-i']: 1,
          margin: '24px 0 0', fontSize: TYPE.display, lineHeight: 0.9,
          fontWeight: 700, letterSpacing: '-0.04em', color: C.bg,
        }}>
          Your Announcements
        </h2>
        <p data-reveal style={{
          ['--reveal-i']: 2,
          margin: '40px 0 0', fontSize: TYPE.lead, lineHeight: 1.3,
          color: '#F2EEE4CC',
        }}>
          Got something for the community? Grab the mic.
        </p>
      </div>
    </Frame>
  );
}

// --- Export ------------------------------------------------------------------
// Label-to-component registry only. Play order is set by <section> order in
// London JS - October 2026.html. See docs/SLIDE_ORDER_MECHANISM.md.
window.Slides = {
  S01_Title, S02_Agenda, S03_Housekeeping,
  S04_Talk1, S05_Talk2,
  S07_Wifi, S08_Host, S09_Sponsor,
  S11_ByNumbers,
  S10_Thanks,
  S12_Announcements,
};
