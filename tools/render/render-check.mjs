#!/usr/bin/env node
// Headless render check and PDF export for the London.js deck.
//
// Serves the repo root on PORT (default 8766, never 8765), opens the entry
// HTML at 1920x1080, steps through every <section> in play order, saves one
// PNG per slide, reports per-slide problems and exports a 16:9 PDF from the
// same run. Exits non-zero on console errors, broken images or anything past
// the slide edge.
//
// Flags: --pdf-only   do not write PNGs (checks and PDF still run)

import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, rmSync, writeFileSync, statSync, createReadStream } from 'node:fs';
import { dirname, join, resolve, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Chromium is installed inside node_modules (see README), so tell Playwright.
process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';
const { chromium } = await import('playwright');
const { PDFDocument } = await import('pdf-lib');

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..');
const OUT = join(HERE, 'out');
const PORT = Number(process.env.PORT ?? 8766);
const OWNER_PORT = 8765;
const W = 1920;
const H = 1080;
const SAFE_BOTTOM = 984;
const PDF_ONLY = process.argv.includes('--pdf-only');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.json': 'application/json', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
};

function fail(msg) {
  console.error(`render-check: ${msg}`);
  process.exitCode = 2;
}

function findEntry() {
  const toml = readFileSync(join(REPO, 'netlify.toml'), 'utf8');
  const block = toml.split(/^\[\[redirects\]\]/m)[1];
  const m = block && block.match(/^\s*to\s*=\s*"([^"]+)"/m);
  if (!m) throw new Error('no redirect target found in netlify.toml');
  const name = decodeURIComponent(m[1]).replace(/^\//, '');
  if (!existsSync(join(REPO, name))) throw new Error(`entry HTML not found: ${name}`);
  return name;
}

function startServer() {
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = normalize(join(REPO, path));
    const rel = file.slice(REPO.length);
    // Stay inside the repo and keep tooling and git internals out of reach.
    if (!file.startsWith(REPO + sep) || /^\/(\.git|tools)(\/|$)/.test(rel.split(sep).join('/'))) {
      res.writeHead(403).end();
      return;
    }
    if (!existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    createReadStream(file).pipe(res);
  });
  return new Promise((ok, bad) => {
    server.once('error', bad);
    server.listen(PORT, '127.0.0.1', () => ok(server));
  });
}

// Runs in the page for the active slide. Returns geometry problems.
function inspectSlide({ index, safeBottom, w, h }) {
  const stage = document.querySelector('deck-stage');
  const section = stage.querySelectorAll(':scope > section')[index];
  const result = { broken: [], bottom: [], edge: [], hscroll: [] };
  const desc = (el) => {
    const t = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const cls = typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30);
    return `${t}${id}${cls}${txt ? ` "${txt}"` : ''}`;
  };
  for (const img of section.querySelectorAll('img')) {
    if (!img.complete || img.naturalWidth === 0) result.broken.push(img.getAttribute('src') || '(no src)');
  }
  const round = (n) => Math.round(n * 10) / 10;
  for (const el of section.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.bottom > h + 0.5 || r.right > w + 0.5 || r.top < -0.5 || r.left < -0.5) {
      result.edge.push(`${desc(el)} [top ${round(r.top)} right ${round(r.right)} bottom ${round(r.bottom)} left ${round(r.left)}]`);
    } else if (r.bottom > safeBottom + 0.5) {
      result.bottom.push(`${desc(el)} [bottom ${round(r.bottom)}]`);
    }
    if ((cs.overflowX === 'hidden' || cs.overflowX === 'auto' || cs.overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 1) {
      result.hscroll.push(`${desc(el)} [scrollWidth ${el.scrollWidth} > clientWidth ${el.clientWidth}]`);
    }
  }
  const de = document.documentElement;
  if (de.scrollWidth > w) result.hscroll.push(`document [scrollWidth ${de.scrollWidth} > ${w}]`);
  if (section.scrollWidth > section.clientWidth + 1) {
    result.hscroll.push(`section [scrollWidth ${section.scrollWidth} > clientWidth ${section.clientWidth}]`);
  }
  return result;
}

function pngSize(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function main() {
  if (PORT === OWNER_PORT) throw new Error(`port ${OWNER_PORT} is reserved for the owner's review server`);
  const entry = findEntry();
  console.log(`Entry HTML: ${entry}`);

  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  let server;
  let browser;
  try {
    try {
      server = await startServer();
    } catch (e) {
      throw new Error(`could not listen on 127.0.0.1:${PORT} (${e.code ?? e.message}); not touching whatever is there`);
    }
    console.log(`Serving ${REPO} on http://127.0.0.1:${PORT}`);

    browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    const page = await context.newPage();

    let current = 0;
    const consoleErrors = new Map();
    const note = (msg) => {
      if (!consoleErrors.has(current)) consoleErrors.set(current, []);
      consoleErrors.get(current).push(msg);
    };
    page.on('console', (m) => { if (m.type() === 'error') note(`console.error: ${m.text()}`); });
    page.on('pageerror', (e) => note(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => note(`request failed: ${r.url()} (${r.failure()?.errorText})`));
    page.on('response', (r) => { if (r.status() >= 400) note(`HTTP ${r.status()}: ${r.url()}`); });

    await page.goto(`http://127.0.0.1:${PORT}/${encodeURIComponent(entry)}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => {
      const s = document.querySelector('deck-stage');
      return s && s.querySelector(':scope > section') && s.querySelector(':scope > section > div')?.children.length > 0;
    }, null, { timeout: 30000 });
    await page.waitForTimeout(500);

    const meta = await page.evaluate(() => {
      const s = document.querySelector('deck-stage');
      return [...s.querySelectorAll(':scope > section')].map((sec) => sec.getAttribute('data-label') || '');
    });
    const total = meta.length;
    console.log(`Slides: ${total}`);
    console.log(`Viewport: ${W}x${H}, safe bottom margin ${SAFE_BOTTOM}px\n`);

    const rows = [];
    let hardFail = false;
    for (let i = 0; i < total; i++) {
      current = i;
      if (i > 0) {
        await page.keyboard.press('ArrowRight');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      }
      const active = await page.evaluate(() => document.querySelector('deck-stage').index);
      if (active !== i) throw new Error(`expected slide index ${i} but deck-stage is on ${active}`);

      const label = meta[i] || `slide ${i + 1}`;
      const file = `${String(i + 1).padStart(2, '0')}-${slug(label.replace(/^\d+\s*/, '')) || 'slide'}.png`;
      const buf = await page.screenshot({ type: 'png' });
      const size = pngSize(buf);
      if (size.w !== W || size.h !== H) throw new Error(`${file} is ${size.w}x${size.h}, expected ${W}x${H}`);
      if (!PDF_ONLY) writeFileSync(join(OUT, file), buf);

      const geo = await page.evaluate(inspectSlide, { index: i, safeBottom: SAFE_BOTTOM, w: W, h: H });
      const errs = [...new Set(consoleErrors.get(i) ?? [])];
      const bad = errs.length > 0 || geo.broken.length > 0 || geo.edge.length > 0;
      if (bad) hardFail = true;
      rows.push({ i, label, file, errs, geo, bad });
    }

    // Same run, same page: print layout via deck-stage's @media print rules.
    await page.emulateMedia({ media: 'print' });
    const pdfPath = join(OUT, 'deck.pdf');
    await page.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });
    const pdf = await PDFDocument.load(readFileSync(pdfPath));
    const pages = pdf.getPageCount();
    const { width, height } = pdf.getPage(0).getSize();
    const ratio = width / height;
    const pdfOk = pages === total && Math.abs(ratio - 16 / 9) < 0.01;

    // Report
    console.log('Per-slide report');
    console.log('----------------');
    for (const r of rows) {
      const n = String(r.i + 1).padStart(2, '0');
      const issues = [];
      for (const e of r.errs) issues.push(`ERROR console/network: ${e}`);
      for (const b of r.geo.broken) issues.push(`ERROR broken image: ${b}`);
      for (const e of r.geo.edge) issues.push(`ERROR past slide edge: ${e}`);
      for (const b of r.geo.bottom) issues.push(`WARN past ${SAFE_BOTTOM}px safe margin: ${b}`);
      for (const h of r.geo.hscroll) issues.push(`WARN horizontal overflow: ${h}`);
      console.log(`${n} ${r.label}${PDF_ONLY ? '' : ` -> ${r.file}`}: ${issues.length ? (r.bad ? 'FAIL' : 'WARN') : 'ok'}`);
      for (const line of issues) console.log(`    ${line}`);
    }
    console.log('\nSummary');
    console.log('-------');
    console.log(`Entry HTML: ${entry}`);
    console.log(`Slides (<section>): ${total}`);
    console.log(PDF_ONLY ? 'PNGs: skipped (--pdf-only)' : `PNGs: ${total} at ${W}x${H} in tools/render/out/`);
    console.log(`PDF: tools/render/out/deck.pdf, ${pages} pages, ${Math.round(width)}x${Math.round(height)} pt (ratio ${ratio.toFixed(4)})`);
    console.log(`PDF page count matches slide count: ${pages === total ? 'yes' : 'NO'}`);
    console.log(`Slides failing: ${rows.filter((r) => r.bad).length}`);

    if (!pdfOk) hardFail = true;
    process.exitCode = hardFail ? 1 : 0;
    console.log(`Result: ${hardFail ? 'FAIL' : 'PASS'}`);
  } finally {
    if (browser) await browser.close().catch(() => {});
    if (server) {
      await new Promise((ok) => { server.close(ok); server.closeAllConnections?.(); });
      console.log(`Server on port ${PORT} stopped.`);
    }
  }
}

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(130));
main().catch((e) => { fail(e.stack ?? String(e)); });
