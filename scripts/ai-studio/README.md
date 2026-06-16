# AI Studio — Headless automation for Open Generative AI

Two scripts to drive the studio without manual UI work. Both require a **Muapi.ai API key** (sign up at https://muapi.ai).

## 1. Headless API (recommended)

Pure Node.js, no browser. Calls the studio's API proxy directly.

```bash
# Video (Kling v2.1 Master, 16:9, 5s)
node scripts/ai-studio/generate.js \
  --api-key YOUR_MUAPI_KEY \
  --prompt "Aerial drone shot of a luxury Red Sea resort at sunset, infinity pool merging with the ocean, palm trees swaying, golden hour, cinematic" \
  --model kling-v2.1-master-t2v \
  --aspect 16:9 \
  --duration 5

# Image (Flux Dev)
node scripts/ai-studio/generate.js \
  --api-key YOUR_MUAPI_KEY \
  --prompt "Upscale hotel restaurant with fresh seafood buffet, Red Sea view through floor-to-ceiling windows, warm ambient lighting" \
  --model flux-dev \
  --image \
  --width 1920 --height 1080

# Vertical video for social (Veo 3 Fast, 9:16)
node scripts/ai-studio/generate.js \
  --api-key YOUR_MUAPI_KEY \
  --prompt "Couple dining under stars at a beachfront hotel restaurant, candlelit table, waves in background, romantic" \
  --model veo3-fast-text-to-video \
  --aspect 9:16
```

Options: `--model`, `--aspect`, `--duration`, `--width`, `--height`, `--poll-ms`, `--max-poll`, `--out`, `--server`.

## 2. Playwright UI automation

Uses a real Chromium browser. Use when the API proxy is unavailable or you need workflow features.

```bash
node scripts/ai-studio/generate-ui.js \
  --api-key YOUR_MUAPI_KEY \
  --prompt "..." \
  --model kling-v2.1-master-t2v
```

## Available models

### Video (t2v)
- `kling-v2.1-master-t2v` — Kling v2.1 Master (5–10s)
- `kling-v2.5-turbo-pro-t2v` — Kling v2.5 Turbo Pro
- `kling-v2.6-pro-t2v` — Kling v2.6 Pro
- `kling-v3.0-pro-text-to-video` — Kling v3.0 Pro
- `kling-v3.0-standard-text-to-video` — Kling v3.0 Standard
- `veo3-text-to-video` — Veo 3
- `veo3-fast-text-to-video` — Veo 3 Fast
- `veo3.1-text-to-video` — Veo 3.1 (8s, 1080p)
- `seedance-lite-t2v`, `seedance-pro-t2v`, `seedance-v2.0-t2v`

### Image (t2i)
- `flux-dev` — Flux Dev
- `flux-schnell` — Flux Schnell (fast)
- `flux-kontext-pro-t2i` — Flux Kontext Pro
- `midjourney-v7-text-to-image` — Midjourney v7
- `google-imagen4` — Google Imagen 4
- `sdxl-image` — SDXL

## Prerequisites

1. Dev server running: `cd ~/Open-Generative-AI && npm run dev`
2. Muapi.ai API key in `--api-key` or `MUAPI_API_KEY` env var
