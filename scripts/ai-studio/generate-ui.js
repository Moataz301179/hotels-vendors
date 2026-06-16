#!/usr/bin/env node
/**
 * Playwright UI automation for Open Generative AI studio.
 * Use this when the headless API proxy is unavailable or when you specifically
 * need the studio's workflow / node-based pipeline.
 *
 * Usage:
 *   node scripts/ai-studio/generate-ui.js --prompt "..." --api-key MUAPI_KEY
 *   node scripts/ai-studio/generate-ui.js --prompt "..." --api-key MUAPI_KEY --model veo3-fast-text-to-video
 *
 * What it does:
 *   1. Launches a Chromium browser
 *   2. Sets `muapi_key` in localStorage
 *   3. Navigates to http://localhost:3000/studio
 *   4. Selects the target model
 *   5. Fills the prompt and clicks Generate
 *   6. Waits for the result and downloads it to ./output.<ext>
 */

const { chromium } = await import('playwright');
const fs = await import('node:fs');
const argv = parseArgs(process.argv.slice(2));
const SERVER = argv.server || 'http://localhost:3000';
const MODEL = argv.model || 'kling-v2.1-master-t2v';
const KEY = argv.api-key || process.env.MUAPI_API_KEY;
const PROMPT = argv.prompt;
const ASPECT = argv.aspect || '16:9';
const DURATION = argv.duration ? Number(argv.duration) : undefined;
const TIMEOUT_MS = Number(argv.timeout || 120_000);

if (!PROMPT) die('Missing --prompt');
if (!KEY) die('Missing --api-key (or MUAPI_API_KEY)');

console.log(`[ai-studio-ui] launching Chromium → ${SERVER}`);
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  ignoreHTTPSErrors: true,
});
const page = await context.newPage();

// Inject the API key into localStorage on every origin we visit
page.on('framenavigated', async () => {
  try {
    await page.evaluate(k => { try { localStorage.setItem('muapi_key', k); } catch {} }, KEY);
  } catch {}
});
await page.goto(SERVER, { waitUntil: 'domcontentloaded' });
await page.evaluate(k => localStorage.setItem('muapi_key', KEY), KEY);
console.log(`[ai-studio-ui] key injected`);

// Navigate to studio
await page.goto(`${SERVER}/studio`, { waitUntil: 'networkidle', timeout: 30_000 });
await page.evaluate(k => localStorage.setItem('muapi_key', KEY), KEY);

// Select model — the studio exposes a model selector in the sidebar
const modelSel = page.locator('[data-testid="model-select"], select[id*="model"], [class*="model"] select').first();
const anySel = page.locator('select').first();
const sel = (await modelSel.count()) ? modelSel : anySel;
if (await sel.count()) {
  await sel.selectOption({ label: MODEL }).catch(async () => {
    await sel.selectOption({ value: MODEL }).catch(() => {});
  });
  console.log(`[ai-studio-ui] model set to ${MODEL}`);
}

// Fill prompt
const textarea = page.locator('textarea').first();
await textarea.waitFor({ state: 'visible', timeout: 10_000 });
await textarea.fill(PROMPT);
console.log(`[ai-studio-ui] prompt filled`);

// Set aspect ratio if available
const aspectEl = page.locator('select').or(page.locator('button')).filter({ hasText: /aspect|16:9|9:16|1:1/i }).first();
if (await aspectEl.count()) {
  await aspectEl.click({ timeout: 5000 }).catch(() => {});
  const opt = page.locator('[role="option"], option').filter({ hasText: new RegExp(ASPECT.replace(':', ':?')) }).first();
  if (await opt.count()) await opt.click({ timeout: 5000 }).catch(() => {});
}

// Click generate
const genBtn = page.locator('button').filter({ hasText: /generate|create|run|submit/i }).first();
await genBtn.waitFor({ state: 'visible', timeout: 10_000 });
await genBtn.click();
console.log(`[ai-studio-ui] generation started — waiting up to ${TIMEOUT_MS / 1000}s`);

// Wait for result: appearace of an <img> or <video> in the result area, or an element with text "download"
const t0 = Date.now();
let url = null;
while (Date.now() - t0 < TIMEOUT_MS) {
  const vid = page.locator('video source, video').first();
  if (await vid.count()) {
    url = await vid.getAttribute('src');
    if (url && url.startsWith('http')) break;
  }
  const img = page.locator('img[src*="muapi"], img[src*="cloudfront"], img[src*="s3"], img[src*="storage"]').first();
  if (await img.count()) {
    url = await img.getAttribute('src');
    if (url && url.length > 20) break;
  }
  await page.waitForTimeout(2000);
}
if (!url) {
  // fall back: take screenshot for debug, then die
  await page.screenshot({ path: 'debug-ai-studio.png', fullPage: true });
  await browser.close();
  die(`Timed out. See debug-ai-studio.png`);
}

console.log(`[ai-studio-ui] media ready: ${url}`);
const resp = await page.request.get(url);
const buf = Buffer.from(await resp.body());
const ext = /\.(mp4|webm|mov)/i.test(url) ? 'mp4' : 'png';
const out = argv.out || `./output.${ext}`;
fs.writeFileSync(out, buf);
console.log(`[ai-studio-ui] saved ${out} (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);

await browser.close();
process.exit(0);

function parseArgs(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const k = args[i].slice(2);
      const v = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
      out[k] = v;
    }
  }
  return out;
}
function die(msg) { console.error('[ai-studio-ui] ' + msg); process.exit(1); }
