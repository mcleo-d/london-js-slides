/* global React */

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
  // Slack design system (slides 02-12), measured 11 Nov 2026 from slack.com
  // computed styles; contrast checked against this background.
  aubergine: '#481A54',
  creamOnAubergine: '#F2EEE4',
  lavender: '#F9F0FF',
  // Per-talk panel accents (talk 01 keeps `accent` yellow). Chosen to stay
  // clearly visible on the aubergine background at projector brightness.
  accentPurple: '#B794FF',            // talk 02
  accentTeal: '#2DD4BF',              // talk 03
  accentPink: '#FF7AC6',              // talk 04
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

const Chrome = ({ ink, bg, label }) => {
  const isAubergine = bg === C.aubergine;
  return (
    <>
      <div style={{
        position: 'absolute', top: 44, left: SPACE.padX, right: SPACE.padX,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: TYPE.micro, color: ink, letterSpacing: '0.02em',
        opacity: isAubergine ? 1 : 0.7,
      }}>
        {isAubergine
          ? <span style={{ color: C.accent }}>london.js</span>
          : <span>london.js</span>}
        <span>{label}</span>
        <span>23 · 11 · 2026</span>
      </div>
      <div style={{
        position: 'absolute', top: 88, left: SPACE.padX, right: SPACE.padX,
        height: 1, background: ink, opacity: 0.18,
      }} />
    </>
  );
};

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

// Slack logo: Slack gave written permission to use its logo on 12 Nov 2026
// (Cassie Hatfield, Senior Slack Specialist, Salesforce). Rendered via <img>
// from the committed, unmodified brand files rather than inlined, because
// both SVGs share internal id/class names and would collide if inlined
// side-by-side. `full` on light backgrounds only, `white` on aubergine only,
// per Slack's Brand Terms. Padding bakes in clear space (approximating the
// "one pill width" rule) so every placement keeps it automatically.
const SlackLogo = ({ variant = 'full', height = 32, style }) => (
  <img
    src={variant === 'white'
      ? 'assets/slack-logo-white.svg'
      : 'assets/slack-logo-full-colour.svg'}
    alt="Slack"
    style={{
      height, width: 'auto', display: 'block',
      padding: Math.round(height * 0.3),
      boxSizing: 'content-box',
      ...style,
    }}
  />
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
function S01_Title({ hostSize = 96 } = {}) {
  return (
    <Frame bg={C.bgWarm} label="01 / 14">
      <NoiseHero color={C.ink} density={0.04} />
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 180, bottom: SPACE.padBottom,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <Mono style={{ fontSize: TYPE.micro, color: C.inkMute }}>
            // london.js · november 2026
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
            JavaScript in the conversation: chat, bots and agents in the
            room.
          </div>
        </div>
        <div>
          <FooterCoBrand hostSize={hostSize} />
        </div>
      </div>
    </Frame>
  );
}

// Footer - single co-brand line: "hosted & sponsored by" + one wordmark,
// with when/where on the right. Slack is both host and sponsor for this
// event, so there is only one name (no partner-toggle needed).
const FOOTER_TOP_PAD = 56;
function FooterCoBrand({ hostSize = 40 }) {
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
        <SlackLogo variant="full" height={hostSize} style={{ filter: 'brightness(0)' }} />
      </div>
      <div style={{
        textAlign: 'right',
        fontSize: TYPE.body, lineHeight: 1.2, fontWeight: 500,
      }}>
        <span style={{ ...labelStyle, display: 'block', marginBottom: 12 }}>WHEN · WHERE</span>
        Mon 23 November 2026 · Doors 17:30<br />
        <span style={{ color: C.inkSoft, fontSize: TYPE.small, fontWeight: 400 }}>
          Salesforce Tower, 110 Bishopsgate, London EC2N 4AY
        </span>
      </div>
    </div>
  );
}

// --- Slide 02  –  Run of show --------------------------------------------------
// Talk titles shown on the agenda (03) and lineup (08) slides: one source.
const TALK_TITLES = {
  tom: `Your API’s newest user is an LLM`,
  daryl: 'Beyond the Reply: Building an AI Support Teammate',
  ryan: 'Building Open Source Agents using Open Protocols',
  slack: 'Slack for Communities & Engineering',
};

function S02_Agenda() {
  const rows = [
    ['18:30', 'Welcome', 'Intro, house rules and announcements'],
    ['18:40', 'Tom Kearsley', TALK_TITLES.tom, true, 'omnea'],
    ['19:00', 'Daryl Cecile', TALK_TITLES.daryl, true, 'github'],
    ['19:20', 'Networking', 'Drinks, conversation and a chance to stretch'],
    ['19:50', 'Ryan Cormack', TALK_TITLES.ryan, true],
    ['20:10', 'Jason & Megan', TALK_TITLES.slack, true, 'slack'],
    ['20:30', 'Close', 'Thank you and goodnight, then the pub'],
  ];
  return (
    <Frame bg={C.aubergine} ink={C.creamOnAubergine} label="03 / 14">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.creamOnAubergine }}>// run_of_show</Mono>
        <h2 style={{
          margin: '16px 0 56px', fontSize: TYPE.title, lineHeight: 1,
          fontWeight: 600, letterSpacing: '-0.03em',
        }}>Tonight</h2>
        <div>
          {rows.map(([t, k, d, talk, logo], i) => (
            <div key={i} data-reveal style={{
              ['--reveal-i']: i + 2,
              display: 'grid',
              gridTemplateColumns: '180px 1fr 1.4fr',
              alignItems: 'baseline',
              gap: 40,
              padding: '20px 24px',
              background: talk ? '#FFFFFF14' : undefined,
              borderTop: `1px solid #F9F0FF33`,
              borderBottom: i === rows.length - 1 ? `1px solid #F9F0FF33` : 'none',
            }}>
              <Mono style={{ fontSize: TYPE.body, color: C.creamOnAubergine, fontWeight: 600 }}>{t}</Mono>
              <span style={{ fontSize: TYPE.lead, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, width: '100%' }}>
                {k}
                {logo === 'omnea' && <img src="assets/omnea-logo.png" alt="Omnea" style={{ height: 40, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />}
                {logo === 'github' && <img src="assets/github-lockup-white.svg" alt="GitHub" style={{ height: 40, width: 'auto', display: 'block' }} />}
                {logo === 'slack' && <SlackLogo variant="white" height={56} style={{ padding: 0 }} />}
              </span>
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
    { num: '01', label: 'Fire',            body: "Note your nearest exit. If the alarm sounds, leave calmly by the stairs, not the lifts, and follow the Slack team's lead." },
    { num: '02', label: 'Code of conduct', body: (
      <>
        {"London.js is a friendly, inclusive space for everyone. Be kind and respectful. Anything feel off? Talk to James, Jordan or Will, or anyone from the Slack team."}
        <br />
        <a href="https://confcodeofconduct.com" style={{ color: C.accent, textDecoration: 'underline', textUnderlineOffset: 6 }}>confcodeofconduct.com</a>
      </>
    ) },
    { num: '03', label: 'Food & drink',    body: 'Soft drinks, water and nibbles at the drinks station, thanks to Slack. Ask the Slack team for toilets or anything else. We close at 20:30.' },
    { num: '04', label: 'Wi-Fi',           body: 'Ask the Slack team for the guest Wi-Fi details.' },
  ];
  return (
    <Frame bg={C.aubergine} ink={C.creamOnAubergine} label="04 / 14">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'flex', flexDirection: 'column',
      }}>
        <div>
          <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.creamOnAubergine }}>// before_we_start</Mono>
          <h2 style={{
            margin: '16px 0 24px', fontSize: TYPE.title, lineHeight: 1,
            fontWeight: 600, letterSpacing: '-0.03em', color: C.creamOnAubergine,
          }}>The important bits</h2>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'auto auto', gap: 32,
          }}>
            {items.map(({ num, label, body }, i) => (
              <div key={num} data-reveal style={{
                ['--reveal-i']: i + 2,
                borderTop: `2px solid ${C.lavender}`,
                paddingTop: 24,
              }}>
                <Mono style={{ fontSize: TYPE.micro, color: C.lavender, fontWeight: 600 }}>
                  {num}
                </Mono>
                <div style={{
                  fontSize: TYPE.subtitle, fontWeight: 600, marginTop: 16,
                  letterSpacing: '-0.02em',
                }}>{label}</div>
                <p style={{
                  fontSize: TYPE.body, lineHeight: 1.35, margin: '16px 0 0',
                  color: C.creamOnAubergine,
                }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

// --- Talk slide template -----------------------------------------------------
function TalkSlide({ idx, num, total, name, role, brand, title, abstract, bio, photo, speakers, label, accent = C.accentInk, panelAccent = accent, bg = C.bg, ink = C.ink }) {
  // No published abstract: the right-hand panel carries the bio instead.
  const coSpeakers = speakers && speakers.length === 2;
  const panelLabel = abstract ? 'ABSTRACT' : (coSpeakers ? 'ABOUT THE SPEAKERS' : 'ABOUT THE SPEAKER');
  const panelText = abstract || bio;
  const bioInline = abstract ? bio : null;
  const nameStack = (
    <>
      <div style={{ fontSize: TYPE.subtitle, fontWeight: 600, letterSpacing: '-0.02em' }}>
        {name}
      </div>
      <div style={{ fontSize: TYPE.body, color: ink === C.bg ? '#F2EEE4CC' : C.inkSoft, marginTop: 12 }}>
        {role}
      </div>
      {brand && (
        <div style={{ marginTop: 14 }}>
          {brand}
        </div>
      )}
      {bioInline && (
        <p style={{
          margin: '24px 0 0', fontSize: TYPE.small, lineHeight: 1.45,
          color: ink === C.bg ? '#F2EEE4CC' : C.inkSoft,
          textWrap: 'pretty', maxWidth: 620,
        }}>{bioInline}</p>
      )}
    </>
  );
  // Optional co-speakers: two left-aligned blocks, each with its own logo.
  const speakerRow = coSpeakers ? (
    <>
      <div style={{ display: 'flex', gap: 64, alignItems: 'stretch' }}>
        {speakers.map((sp) => (
          <div key={sp.name} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <img src={sp.photo} alt={sp.alt || sp.name} style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, display: 'block' }} />
            <div style={{ fontSize: TYPE.subtitle, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 20 }}>
              {sp.name}
            </div>
            <div style={{ fontSize: TYPE.body, color: ink === C.bg ? '#F2EEE4CC' : C.inkSoft, marginTop: 12 }}>
              {sp.role}
            </div>
            {sp.logo && (
              <div style={{ marginTop: 'auto', paddingTop: 14 }}>
                {sp.logo}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  ) : null;
  return (
    <Frame bg={bg} ink={ink} label={label}>
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.creamOnAubergine, fontWeight: 600 }}>
            // talk_{num} of {total} · talk + q&amp;a
          </Mono>
          <h2 style={{
            margin: '24px 0 0', fontSize: 88, lineHeight: 1.02,
            fontWeight: 600, letterSpacing: '-0.03em',
            textWrap: 'balance',
          }}>{title}</h2>
          <div style={{ flex: 1 }} />
          <div data-reveal style={{
            ['--reveal-i']: 3,
            paddingTop: 32, borderTop: `1px solid ${ink === C.bg ? '#F9F0FF33' : C.ruleStrong}`,
          }}>
            {speakerRow ? speakerRow : photo ? (
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
          background: ink === C.bg ? '#FFFFFF14' : (bg === C.bgWarm ? 'rgba(255,255,255,0.35)' : '#16151418'),
          padding: '48px 44px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          borderLeft: `2px solid ${panelAccent}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Mono style={{ fontSize: TYPE.micro, color: ink === C.bg ? '#F2EEE4CC' : C.inkMute }}>
              {panelLabel}
            </Mono>
            <span style={{
              fontSize: 140, fontWeight: 700, lineHeight: 0.8,
              letterSpacing: '-0.04em', color: accent, opacity: 0.14,
              fontFamily: '"Inter Tight", system-ui, sans-serif',
            }}>{num}</span>
          </div>
          {coSpeakers && !abstract ? speakers.map((sp, i) => (
            <div key={sp.name} style={{ marginTop: i === 0 ? 20 : 40 }}>
              <Mono style={{ fontSize: TYPE.micro, color: panelAccent, fontWeight: 600 }}>{sp.name}</Mono>
              <p style={{
                margin: '8px 0 0', fontSize: TYPE.small, lineHeight: 1.4,
                color: ink === C.bg ? '#F2EEE4CC' : C.inkSoft,
                textWrap: 'pretty',
              }}>{sp.bio}</p>
            </div>
          )) : (
          <p style={{
            margin: '20px 0 0', fontSize: TYPE.body, lineHeight: 1.4,
            color: ink === C.bg ? '#F2EEE4CC' : C.inkSoft,
            textWrap: 'pretty',
          }}>{panelText}</p>
          )}
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 08  –  Lineup (chat-style card) -------------------------------------
// Chat-channel card in the deck's own design language; deliberately not a
// copy of the Slack app UI. Accent bars use the per-talk panel accents.
function S16_Lineup() {
  // Roles are as written in the content pack (Talk 04) and the talk 04 slide panel.
  const talks = [
    { num: '01', color: C.accent, photos: [['assets/speaker-kearsley.jpg', 'Tom Kearsley']],
      lines: [[{ name: 'Tom Kearsley', role: 'Product Engineer', logo: <img src="assets/omnea-logo.png" alt="Omnea" style={{ height: 28, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} /> }]], title: TALK_TITLES.tom },
    { num: '02', color: C.accentPurple, photos: [['assets/speaker-cecile.jpg', 'Daryl Cecile']],
      lines: [[{ name: 'Daryl Cecile', role: 'Software Engineer', logo: <img src="assets/github-lockup-white.svg" alt="GitHub" style={{ height: 28, width: 'auto', display: 'block' }} /> }]], title: TALK_TITLES.daryl },
    { num: '03', color: C.accentTeal, photos: [['assets/speaker-cormack.jpg', 'Ryan Cormack']],
      lines: [[{ name: 'Ryan Cormack', role: 'AI Engineer' }]], title: TALK_TITLES.ryan },
    { num: '04', color: C.accentPink,
      photos: [['assets/speaker-pope.jpg', 'Jason Pope'], ['assets/speaker-maguire.jpg', 'Megan Maguire']],
      lines: [[{ name: 'Jason Pope', role: 'Senior Manager, Solution Engineering', logo: <SlackLogo variant="white" height={32} style={{ padding: 0 }} /> }], [{ name: 'Megan Maguire', role: 'Principal Solution Engineer', logo: <SlackLogo variant="white" height={32} style={{ padding: 0 }} /> }]], title: TALK_TITLES.slack },
  ];
  return (
    <Frame bg={C.aubergine} ink={C.creamOnAubergine} label="08 / 14">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'flex', flexDirection: 'column',
      }}>
        <div data-reveal style={{
          ['--reveal-i']: 1,
          background: '#FFFFFF14', borderRadius: 20,
          display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0,
        }}>
          <h2 style={{
            margin: 0, padding: '10px 32px', borderBottom: '1px solid #F9F0FF33',
            display: 'flex', alignItems: 'center', columnGap: 16,
            fontSize: TYPE.body, fontWeight: 600, lineHeight: 1.2, color: C.creamOnAubergine,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '0.02em',
          }}>
            <span aria-hidden="true" style={{
              width: 46, height: 46, borderRadius: 11, background: C.accent, color: C.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"Inter Tight", system-ui, sans-serif',
              fontSize: 23, fontWeight: 700, letterSpacing: '-0.04em', flex: 'none',
            }}>.js</span>
            <span>tonight’s speakers</span>
          </h2>
          <div style={{ padding: '20px 32px 20px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0 }}>
            {talks.map((t) => (
              <div key={t.num} style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 32,
                background: '#FFFFFF14', borderLeft: `8px solid ${t.color}`,
                borderRadius: '4px 14px 14px 4px', padding: '0 32px 0 32px', minHeight: 0,
              }}>
                <div style={{ display: 'flex', width: 264, flex: 'none', alignItems: 'center', justifyContent: 'flex-start' }}>
                  {t.photos.map(([src, alt], i) => (
                    <img key={src} src={src} alt={alt} style={{
                      width: 140, height: 140, boxSizing: 'border-box', borderRadius: '50%', objectFit: 'cover',
                      border: `3px solid ${t.color}`, display: 'block', flex: 'none',
                      marginLeft: i === 0 ? 0 : -16,
                    }} />
                  ))}
                </div>
                <div style={{ minWidth: 0 }}>
                  {t.lines.map((line, li) => (
                    <div key={li} style={{ display: 'flex', alignItems: 'center', columnGap: 24, whiteSpace: 'nowrap', marginTop: li ? 4 : 0 }}>
                      {line.map((pp, pi) => (
                        <React.Fragment key={pp.name}>
                          {pi > 0 && <span style={{ fontSize: TYPE.small, color: C.lavender }}>·</span>}
                          <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: C.creamOnAubergine }}>{pp.name}</span>
                          <span style={{ fontSize: TYPE.small, color: C.lavender, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                            {pp.role}{pp.logo ? ' at' : ''}{pp.logo}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  ))}
                  <div style={{
                    marginTop: 6, fontSize: 32, fontWeight: 400, lineHeight: 1.2,
                    color: C.creamOnAubergine, textWrap: 'balance',
                  }}>{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 04  –  Talk 1 -------------------------------------------------------
function S04_Talk1() {
  return (
    <TalkSlide
      label="09 / 14"
      num="01" total="04"
      bg={C.aubergine} ink={C.creamOnAubergine}
      name="Tom Kearsley"
      role="Product Engineer"
      brand={<img src="assets/omnea-logo.png" alt="Omnea" style={{ height: 40, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />}
      accent={C.accent}
      title={TALK_TITLES.tom}
      bio={`Tom Kearsley is a Product Engineer at Omnea, the procurement platform, and leads its MCP project: the layer that lets Claude, ChatGPT, Copilot, Gemini and customers' own agents work with their company's procurement data.`}
      photo="assets/speaker-kearsley.jpg"
    />
  );
}

// --- Slide 05  –  Talk 2 -------------------------------------------------------
function S05_Talk2() {
  return (
    <TalkSlide
      label="12 / 14"
      num="03" total="04"
      bg={C.aubergine} ink={C.creamOnAubergine}
      name="Ryan Cormack"
      role="AI Engineer"
      accent={C.accent}
      panelAccent={C.accentTeal}
      title="Building Open Source Agents using Open Protocols"
      bio="Ryan is an AI engineer and self-described renaissance developer. Most recently a Principal Engineer at Motorway, Ryan was previously a Principal Engineer at Moonpig and spent four years engineering at Just Eat. Before software, Ryan worked in digital marketing and co-founded MemoryStoria, an EU-backed startup."
      photo="assets/speaker-cormack.jpg"
    />
  );
}

// --- Slide 06  –  Talk 3 -------------------------------------------------------
function S06_Talk3() {
  return (
    <TalkSlide
      label="13 / 14"
      num="04" total="04"
      bg={C.aubergine} ink={C.creamOnAubergine}
      speakers={[
        { name: 'Jason Pope', role: 'Senior Manager, Solution Engineering', photo: 'assets/speaker-pope.jpg', alt: 'Jason Pope', bio: "Jason leads Slack's UK Solution Engineering team and sits on its UK go-to-market leadership team, helping customers solve business challenges and showing how generative AI changes the way teams work.", logo: <SlackLogo variant="white" height={40} style={{ paddingLeft: 0 }} /> },
        { name: 'Megan Maguire', role: 'Principal Solution Engineer', photo: 'assets/speaker-maguire.jpg', alt: 'Megan Maguire', bio: 'Megan leads enterprise solution architecture for Slack across the UK and Ireland, helping organisations work together with AI, workflow automation and platform integrations. She speaks regularly at community events, including Slack City Tour Europe.', logo: <SlackLogo variant="white" height={40} style={{ paddingLeft: 0 }} /> },
      ]}
      accent={C.accent}
      panelAccent={C.accentPink}
      title="Slack for Communities & Engineering"
    />
  );
}

// --- Slide 09: Talk 2 (Daryl Cecile) ---
function S15_TalkCecile() {
  return (
    <TalkSlide
      label="10 / 14"
      num="02" total="04"
      bg={C.aubergine} ink={C.creamOnAubergine}
      name="Daryl Cecile"
      role="Software Engineer"
      brand={<img src="assets/github-lockup-white.svg" alt="GitHub" style={{ height: 40, width: 'auto', display: 'block' }} />}
      accent={C.accent}
      panelAccent={C.accentPurple}
      title="Beyond the Reply: Building an AI Support Teammate"
      bio="Daryl is a Software Engineer at GitHub. Before GitHub, Daryl spent nearly four years at Capital One, latterly as a Senior Software Engineer, and co-founded ProjectFunction. Outside work, Daryl is building Knosh.app and writes about engineering with AI agents at darylcecile.net."
      photo="assets/speaker-cecile.jpg"
    />
  );
}

// --- Slide 10  –  Networking ---------------------------------------------
function S14_Break() {
  return (
    <Frame bg={C.aubergine} ink={C.creamOnAubergine} label="11 / 14">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 96, bottom: 96,
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'center',
          height: '100%',
        }}>
          <div>
            <h2 style={{
              margin: 0, fontSize: 140, fontWeight: 700, lineHeight: 0.95,
              letterSpacing: '-0.03em',
            }}>Networking</h2>
            <p style={{ margin: '40px 0 0', fontSize: TYPE.lead, lineHeight: 1.3 }}>
              Back at 19:50 with Ryan Cormack
            </p>
            <p style={{ margin: '16px 0 0', fontSize: TYPE.body, color: '#F2EEE4CC', lineHeight: 1.3 }}>
              Grab a drink, meet someone new and stretch your legs.
            </p>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            gap: 24,
          }}>
            <div style={{
              width: 340, height: 340, boxSizing: 'border-box',
              background: C.paper, padding: 24, border: `3px solid ${C.bgWarm}`,
            }}>
              <img src="assets/qr-linkedin-london-js.svg" width={280} height={280} alt="Follow London.js on LinkedIn" style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <Mono style={{ fontSize: TYPE.micro, color: C.lavender, whiteSpace: 'nowrap', textAlign: 'center' }}>FOLLOW</Mono>
              <br />
              <Mono style={{ fontSize: TYPE.micro, color: C.lavender, whiteSpace: 'nowrap', textAlign: 'center' }}>linkedin.com/company/london-js</Mono>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 05  –  Thank you, Slack (merged host + sponsor) --------------------
function S08_ThankYouSlack() {
  return (
    <Frame bg={C.aubergine} ink={C.creamOnAubergine} label="05 / 14">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 96, bottom: 96,
        display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 64, alignItems: 'center',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', justifySelf: 'center', width: 'fit-content', maxWidth: '100%', textAlign: 'left' }}>
          <h2 data-reveal style={{
            ['--reveal-i']: 1,
            margin: 0, fontSize: 140, lineHeight: 1,
            fontWeight: 600, letterSpacing: '-0.03em',
          }}>Thank you, Slack</h2>
          <p data-reveal style={{
            ['--reveal-i']: 3,
            marginTop: 32, fontSize: TYPE.lead, lineHeight: 1.3,
            color: '#F2EEE4CC', textWrap: 'pretty',
          }}>
            Slack is the AI-powered work OS, and the best place for Multiplayer AI: where people, agents, and apps work together.
          </p>
        </div>
        <div data-reveal style={{
          ['--reveal-i']: 2,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
          <SlackLogo variant="white" height={300} style={{ padding: 0 }} />
        </div>
      </div>
    </Frame>
  );
}

const Stat = ({ n, label, i = 0, accentBorder }) => (
  <div data-reveal style={{
    ['--reveal-i']: 3 + i,
    background: '#FFFFFF14',
    border: '1px solid #F9F0FF33',
    borderTop: `4px solid ${C.accent}`,
    padding: '40px 48px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  }}>
    <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1, color: C.creamOnAubergine }}>
      {n}
    </div>
    <Mono style={{ fontSize: TYPE.micro, color: '#F2EEE4CC', marginTop: 16, textTransform: 'uppercase' }}>
      {label}
    </Mono>
  </div>
);

// --- Slide 06  –  London.js by numbers ----------------------------------------
function S11_ByNumbers() {
  return (
    <Frame bg={C.aubergine} ink={C.creamOnAubergine} label="06 / 14">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'flex', flexDirection: 'column',
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.creamOnAubergine }}>// london_js.by_numbers</Mono>
        <h2 data-reveal style={{
          ['--reveal-i']: 1,
          marginTop: 24, marginBottom: 0,
          fontSize: TYPE.title, fontWeight: 600,
          letterSpacing: '-0.03em', lineHeight: 1.02, color: C.creamOnAubergine,
        }}>
          London.js by numbers
        </h2>
        <p data-reveal style={{
          ['--reveal-i']: 2,
          marginTop: 20, marginBottom: 0,
          fontSize: TYPE.lead, lineHeight: 1.3,
          color: '#F2EEE4CC', maxWidth: 1200,
        }}>
          24 events since the relaunch, and counting.
        </p>

        <div style={{
          marginTop: 56,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: 32,
        }}>
          <Stat n="24"    label="events since the relaunch" i={0} accentBorder={C.lavender} />
          <Stat n="4,555" label="Meetup members"             i={1} accentBorder={C.lavender} />
          <Stat n="1,829" label="LinkedIn followers"         i={2} accentBorder={C.lavender} />
          <Stat n="110"   label="places tonight"             i={3} accentBorder={C.lavender} />
          <Stat n="4.7"   label="stars from 517 Meetup reviews" i={4} accentBorder={C.lavender} />
          <Stat n="26"    label="floors up tonight"           i={5} accentBorder={C.lavender} />
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 02  –  Welcome -------------------------------------------------------
function S10_Welcome() {
  return (
    <Frame bg={C.aubergine} ink={C.creamOnAubergine} label="02 / 14">
      <NoiseHero color={C.creamOnAubergine} density={0.08} />
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.creamOnAubergine }}>// welcome</Mono>
            <h2 style={{
              margin: '24px 0 0', fontSize: 160, lineHeight: 0.88,
              fontWeight: 600, letterSpacing: '-0.03em',
              whiteSpace: 'nowrap',
            }}>
              Follow London.js
            </h2>
            <p data-reveal style={{
              ['--reveal-i']: 1,
              margin: '32px 0 0', fontSize: TYPE.lead, color: '#F2EEE4CC', lineHeight: 1.3,
            }}>
              Glad you made it. Scan the QR to follow us on LinkedIn.
            </p>
          </div>
          <div style={{
            marginTop: 64, paddingTop: 32, borderTop: `1px solid #F9F0FF33`,
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32,
          }}>
            {[
              ['James McLeod', 'Open Source Program Lead, NatWest Group · FINOS Board Member · London.js Organiser'],
              ['Jordan Potts', 'Head of Technology, Albany Growth · Co-Founder, London.js'],
              ['Will Laing', 'Co-Founder, Plan:it · Co-Founder & Organiser, London.js'],
            ].map(([n, c], i) => (
              <div key={n} data-reveal style={{ ['--reveal-i']: 2 + i }}>
                <Mono style={{ fontSize: TYPE.micro, color: C.lavender }}>ORGANISER</Mono>
                <div style={{ fontSize: TYPE.lead, fontWeight: 600, marginTop: 8 }}>{n}</div>
                <div style={{ fontSize: TYPE.body, lineHeight: 1.35, color: '#F2EEE4CC', marginTop: 10 }}>{c}</div>
              </div>
            ))}
          </div>
        </div>
        <div data-reveal style={{
          ['--reveal-i']: 5,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          gap: 24,
        }}>
          <img src="assets/london-js-organisers.jpeg" alt="London.js organisers" style={{ width: 340, height: 340, objectFit: 'cover', display: 'block' }} />
          <div style={{
            width: 340, height: 340, boxSizing: 'border-box',
            background: C.paper, padding: 24, border: `3px solid ${C.bgWarm}`,
          }}>
            <img src="assets/qr-linkedin-london-js.svg" width={280} height={280} alt="Follow London.js on LinkedIn" style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <Mono style={{ fontSize: TYPE.micro, color: C.lavender, whiteSpace: 'nowrap', textAlign: 'center' }}>FOLLOW</Mono>
            <br />
            <Mono style={{ fontSize: TYPE.micro, color: C.lavender, whiteSpace: 'nowrap', textAlign: 'center' }}>linkedin.com/company/london-js</Mono>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// --- Slide 07  Announcements section divider ----------------------------
function S12_Announcements() {
  return (
    <Frame bg={C.aubergine} ink={C.creamOnAubergine} label="07 / 14">
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 320, bottom: SPACE.padBottom,
      }}>
        <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.creamOnAubergine }}>
          // section_divider
        </Mono>
        <h2 data-reveal style={{
          ['--reveal-i']: 1,
          margin: '24px 0 0', fontSize: TYPE.display, lineHeight: 0.9,
          fontWeight: 700, letterSpacing: '-0.04em', color: C.creamOnAubergine,
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

// --- Slide 11  –  Closing -------------------------------------------------------
function S13_Closing() {
  return (
    <Frame bg={C.aubergine} ink={C.creamOnAubergine} label="14 / 14">
      <NoiseHero color={C.creamOnAubergine} density={0.08} />
      <div style={{
        position: 'absolute', left: SPACE.padX, right: SPACE.padX,
        top: 160, bottom: SPACE.padBottom,
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Mono data-reveal style={{ fontSize: TYPE.micro, color: C.creamOnAubergine }}>// thank_you_and_whats_next</Mono>
          <h2 style={{
            margin: '24px 0 0', fontSize: 200, lineHeight: 0.88,
            fontWeight: 600, letterSpacing: '-0.03em',
          }}>
            Thank you
          </h2>
          <p data-reveal style={{
            ['--reveal-i']: 1,
            margin: '24px 0 0', fontSize: 56, fontWeight: 600, lineHeight: 1.1,
            letterSpacing: '-0.02em', color: C.accent,
          }}>
            Merry Christmas and Happy New Year
          </p>
          <p data-reveal style={{
            ['--reveal-i']: 2,
            margin: '32px 0 0', fontSize: TYPE.lead, color: '#F2EEE4CC', lineHeight: 1.3,
          }}>
            Thanks to Slack for hosting and sponsoring tonight, and to tonight's speakers for sharing their time and knowledge.
          </p>
          <p data-reveal style={{
            ['--reveal-i']: 3,
            margin: '24px 0 0', fontSize: TYPE.lead, fontWeight: 600, color: C.creamOnAubergine, lineHeight: 1.3,
          }}>
            London.js returns in early 2027.
          </p>
        </div>
        <div data-reveal style={{
          ['--reveal-i']: 4,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        }}>
          <div style={{
            width: 340, height: 340, boxSizing: 'border-box',
            background: C.paper, padding: 24, border: `3px solid ${C.bgWarm}`,
          }}>
            <img src="assets/qr-linkedin-london-js.svg" width={280} height={280} alt="Follow London.js on LinkedIn" style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Mono style={{ fontSize: TYPE.micro, color: C.lavender, whiteSpace: 'nowrap', textAlign: 'center' }}>FOLLOW</Mono>
            <br />
            <Mono style={{ fontSize: TYPE.micro, color: C.lavender, whiteSpace: 'nowrap', textAlign: 'center' }}>linkedin.com/company/london-js</Mono>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 32 }}>
            <SlackLogo variant="white" height={120} />
          </div>
        </div>
      </div>
    </Frame>
  );
}

// --- Export ------------------------------------------------------------------
// Label-to-component registry only. Play order is set by <section> order in
// London JS - November 2026.html. See docs/SLIDE_ORDER_MECHANISM.md.
window.Slides = {
  S01_Title, S02_Agenda, S03_Housekeeping,
  S04_Talk1, S05_Talk2, S06_Talk3,
  S14_Break, S15_TalkCecile,
  S08_ThankYouSlack,
  S11_ByNumbers,
  S10_Welcome,
  S12_Announcements,
  S13_Closing,
  S16_Lineup,
};
