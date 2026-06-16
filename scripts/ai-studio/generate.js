#!/usr/bin/env node
/**
 * Headless video/image generator — drives the Open Generative AI studio API.
 * No Playwright, no UI. Pure Node.js fetch against the running dev server.
 *
 * Reads MUAPI_API_KEY from process.env or .env.local (via dotenv).
 * Usage:
 *   node scripts/ai-studio/generate.js --prompt "..." --model kling-v2.1-master-t2v --api-key MUAPI_KEY
 *   node scripts/ai-studio/generate.js --prompt "..." --model flux-dev --api-key MUAPI_KEY --image
 *   node scripts/ai-studio/generate.js --prompt "..." --model veo3-fast-text-to-video --api-key MUAPI_KEY --aspect 9:16
 *
 * Defaults:
 *   --server   http://localhost:3000
 *   --model    kling-v2.1-master-t2v
 *   --poll-ms  2000   (poll interval)
 *   --max-poll 600    (max polls = 20 min for video)
 *   --out      ./output.{mp4|png}
 */

// Load .env / .env.local from the project root
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..', '..');
for (const f of ['.env.local', '.env']) {
  const p = resolve(projectRoot, f);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const argv = parseArgs(process.argv.slice(2));
const SERVER = argv.server || 'http://localhost:3000';
const API = `${SERVER}/api/api/v1`;
const MODEL = argv.model || 'kling-v2.1-master-t2v';
const KEY = argv['api-key'] || process.env.MUAPI_API_KEY;
const PROMPT = argv.prompt;
const IMAGE = Boolean(argv.image);
const ASPECT = argv.aspect || '16:9';
const DURATION = argv.duration ? Number(argv.duration) : undefined;
const WIDTH = argv.width ? Number(argv.width) : undefined;
const HEIGHT = argv.height ? Number(argv.height) : undefined;
const POLL_MS = Number(argv['poll-ms'] || 2000);
const MAX_POLL = Number(argv['max-poll'] || 600);
const OUT = argv.out;

if (!PROMPT) die('Missing --prompt');
if (!KEY) die('Missing --api-key (or set MUAPI_API_KEY env)');

const isVideo = !IMAGE && /t2v|video|lip-sync|audio/i.test(MODEL);
const ext = isVideo ? 'mp4' : 'png';
const outPath = OUT || `./output.${ext}`;

const body = { prompt: PROMPT };
if (ASPECT) body.aspect_ratio = ASPECT;
if (DURATION) body.duration = DURATION;
if (WIDTH) body.width = WIDTH;
if (HEIGHT) body.height = HEIGHT;

console.log(`[ai-studio] model=${MODEL} aspect=${ASPECT}${DURATION ? ` duration=${DURATION}s` : ''}`);
console.log(`[ai-studio] prompt: ${PROMPT}`);
console.log(`[ai-studio] submitting to ${API}/${MODEL} ...`);

const submitRes = await fetch(`${API}/${MODEL}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-api-key': KEY },
  body: JSON.stringify(body),
});
if (!submitRes.ok) {
  const txt = await submitRes.text();
  die(`Submit failed ${submitRes.status}: ${txt}`);
}
const submit = await submitRes.json();
const requestId = submit.id || submit.request_id || submit.task_id;
if (!requestId) {
  console.error('[ai-studio] full submit response:', JSON.stringify(submit, null, 2));
  die('No request id returned — check model id and API key');
}
console.log(`[ai-studio] request id: ${requestId}`);

let result, polls = 0;
while (polls++ < MAX_POLL) {
  await sleep(POLL_MS);
  const r = await fetch(`${API}/predictions/${requestId}/result`, {
    headers: { 'x-api-key': KEY },
  });
  if (!r.ok) { console.warn(`[ai-studio] poll ${polls}: HTTP ${r.status}`); continue; }
  const data = await r.json();
  const status = (data.status || '').toLowerCase();
  if (status === 'completed' || status === 'succeeded' || status === 'success') {
    result = data;
    break;
  }
  if (status === 'failed' || status === 'error') {
    die(`Generation failed: ${data.error || JSON.stringify(data)}`);
  }
  if (polls % 10 === 0) console.log(`[ai-studio] polling... ${polls}/${MAX_POLL} (status=${status})`);
}
if (!result) die(`Timed out after ${MAX_POLL} polls`);

const url = extractMediaUrl(result);
if (!url) {
  console.error('[ai-studio] full result:', JSON.stringify(result, null, 2));
  die('Generation succeeded but no media URL found');
}
console.log(`[ai-studio] media URL: ${url}`);

const media = await fetch(url);
if (!media.ok) die(`Download failed: ${media.status}`);
const buf = Buffer.from(await media.arrayBuffer());
const fs = await import('fs');
fs.writeFileSync(outPath, buf);
console.log(`[ai-studio] saved ${outPath} (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
process.exit(0);

function extractMediaUrl(result) {
  if (result.url) return result.url;
  if (result.output) {
    if (typeof result.output === 'string') return result.output;
    if (Array.isArray(result.output)) return result.output[0];
  }
  if (result.video?.url) return result.video.url;
  if (result.image?.url) return result.image.url;
  if (result.data?.url) return result.data.url;
  if (Array.isArray(result.data) && result.data[0]?.url) return result.data[0].url;
  return null;
}

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
function die(msg) { console.error('[ai-studio] ' + msg); process.exit(1); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
