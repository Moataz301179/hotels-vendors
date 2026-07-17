# Hybrid Deployment Config — Vercel + VPS Ollama

## Overview
This is the **recommended production architecture** for Hotels Vendors:
- **Vercel** → Static marketing pages, auth, dashboard UI (fast global CDN)
- **Hostinger VPS** → AI chat API, Ollama LLM, database, background workers

## Why Hybrid?
| Concern | Pure Vercel | Pure VPS | Hybrid |
|---------|------------|----------|--------|
| Global speed | ✅ Excellent | ⚠️ Single region | ✅ Excellent |
| Ollama hosting | ❌ Impossible | ✅ Easy | ✅ VPS handles it |
| Serverless limits | ❌ 10s timeout | ✅ Unlimited | ✅ API on VPS |
| Cost | ⚠️ Expensive at scale | ✅ Fixed cost | ✅ Balanced |
| SSL/Domain | ✅ Automatic | ⚠️ Manual setup | ✅ Both covered |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌─────────────────────┐         ┌─────────────────────┐
        │      Vercel         │         │   Hostinger VPS     │
        │  (Edge Network)     │         │  (Cairo/Egypt)      │
        │                     │         │                     │
        │  ┌───────────────┐  │         │  ┌───────────────┐  │
        │  │ Marketing     │  │         │  │ Next.js API   │  │
        │  │ Pages         │  │         │  │ (/api/*)      │  │
        │  └───────────────┘  │         │  └───────────────┘  │
        │  ┌───────────────┐  │         │  ┌───────────────┐  │
        │  │ Auth Pages    │  │         │  │ Ollama        │  │
        │  │ (login, etc.) │  │         │  │ (LLM Engine)  │  │
        │  └───────────────┘  │         │  └───────────────┘  │
        │  ┌───────────────┐  │         │  ┌───────────────┐  │
        │  │ Dashboard UI  │  │         │  │ PostgreSQL    │  │
        │  │ (static)      │  │         │  │ Redis         │  │
        │  └───────────────┘  │         │  └───────────────┘  │
        │  ┌───────────────┐  │         │  ┌───────────────┐  │
        │  │ Marketplace   │  │         │  │ Swarm Workers │  │
        │  │ V2            │  │         │  │               │  │
        │  └───────────────┘  │         │  └───────────────┘  │
        └─────────────────────┘         └─────────────────────┘
                    │                               │
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    AI API calls go to VPS
                    (streaming SSE supported)
```

---

## Configuration

### 1. Vercel Environment Variables

Set these in [Vercel Dashboard](https://vercel.com/dashboard) → Project → Settings → Environment Variables:

```bash
# Core
SESSION_SECRET=your-64-char-secret
NEXTAUTH_URL=https://hotelsvendors.com

# VPS API Endpoint (for AI chat)
VPS_API_URL=https://vps.hotelsvendors.com
# OR use direct IP if no subdomain:
# VPS_API_URL=https://203.0.113.10

# Fallback LLM (if VPS is down)
XAI_API_KEY=xai-your-key

# Email
RESEND_API_KEY=re_your_key

# Google Maps
GOOGLE_MAPS_API_KEY=AIza...

# ETA (Egyptian Tax Authority)
ETA_API_BASE_URL=https://api.invoicing.eta.gov.eg
```

**Do NOT set `OLLAMA_URL` on Vercel** — Ollama lives on the VPS only.

---

### 2. VPS Environment Variables

On your Hostinger VPS, in `.env`:

```bash
# Internal services (Docker network)
DATABASE_URL=postgresql://hotels_vendors:password@postgres:5432/hotels_vendors
REDIS_URL=redis://redis:6379

# Ollama (internal only — never exposed)
OLLAMA_URL=http://ollama:11434
OLLAMA_MODEL=llama3.2:3b
OLLAMA_EMBED_MODEL=nomic-embed-text

# Fallbacks
XAI_API_KEY=xai-your-key
GROQ_API_KEY=
OPENROUTER_API_KEY=

# External services
RESEND_API_KEY=re_your_key
GOOGLE_MAPS_API_KEY=AIza...
```

---

### 3. API Routing

#### Option A: Vercel Rewrites (Simplest)
Add to `vercel.json`:

```json
{
  "buildCommand": "npm ci --legacy-peer-deps && npx prisma generate && npm run build",
  "rewrites": [
    {
      "source": "/api/v1/ai/:path*",
      "destination": "https://vps.hotelsvendors.com/api/v1/ai/:path*"
    }
  ]
}
```

**Pros:** Zero client changes, works immediately  
**Cons:** Vercel rewrites add ~100-300ms latency, streaming SSE may have issues through Vercel's edge

#### Option B: Client-Side API Routing (Recommended)
The workspace chatbot already calls `/api/v1/ai/assistant`. On Vercel, this would hit the serverless function. Instead, modify the client to call the VPS directly for AI:

```typescript
// In workspace-chatbot.tsx
const VPS_API_URL = process.env.NEXT_PUBLIC_VPS_API_URL || "/api/v1/ai/assistant";

const res = await fetch(`${VPS_API_URL}/ai/assistant`, {
  ...
});
```

Add to `.env.local` (dev) and Vercel env (prod):
```bash
NEXT_PUBLIC_VPS_API_URL=https://vps.hotelsvendors.com/api/v1
```

**Pros:** Direct connection = faster streaming, no Vercel function limits  
**Cons:** CORS must be configured on VPS

#### Option C: CORS-Enabled VPS API (Best for Streaming)
Update the VPS Next.js app to accept CORS from your Vercel domain:

```typescript
// middleware.ts or API route
const allowedOrigins = [
  "https://hotelsvendors.com",
  "https://www.hotelsvendors.com",
  "https://hotels-vendors.vercel.app", // preview deployments
];
```

The workspace chatbot then calls the VPS API directly with `credentials: "include"` for auth cookies.

**Pros:** Fastest streaming, clean separation  
**Cons:** Requires auth token sharing between Vercel and VPS (use JWT)

---

### 4. Auth Token Strategy

Since Vercel and VPS are different domains, cookies don't transfer. Solutions:

#### A. Shared JWT (Recommended)
Both Vercel and VPS use the same `SESSION_SECRET`. The JWT cookie is read by both:
- Vercel sets the cookie on login
- VPS reads the same cookie (if user visits VPS directly)
- For API calls from Vercel frontend → VPS backend, include the cookie:

```typescript
fetch(`${VPS_API_URL}/ai/assistant`, {
  credentials: "include", // sends cookies
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({...}),
});
```

#### B. API Token in Header
Generate API tokens per user, store in localStorage (less secure):

```typescript
fetch(`${VPS_API_URL}/ai/assistant`, {
  headers: {
    "Authorization": `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  },
});
```

---

### 5. CORS Configuration on VPS

Add to `next.config.js` or handle in API routes:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/v1/ai/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://hotelsvendors.com" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
    ];
  },
};
```

---

## Implementation Steps

### Step 1: Deploy VPS First
```bash
# On Hostinger VPS
git pull origin main
docker compose -f docker-compose.swarm.yml up -d --build
bash deploy/ollama-pull.sh
npx prisma db push
```

### Step 2: Test VPS Independently
```bash
# VPS should respond
curl https://vps.hotelsvendors.com/api/health
curl https://vps.hotelsvendors.com/api/v1/ai/public \
  -X POST -H "Content-Type: application/json" \
  -d '{"question": "hello"}'
```

### Step 3: Configure Vercel
1. Add all environment variables (see section 1 above)
2. Add `NEXT_PUBLIC_VPS_API_URL` to Vercel env vars
3. Update `workspace-chatbot.tsx` to use `NEXT_PUBLIC_VPS_API_URL`

### Step 4: Test Hybrid
1. Visit Vercel deployment URL
2. Open AI chat
3. Send a message
4. Verify it streams from VPS Ollama
5. Check VPS logs: `docker logs -f hv-app`

---

## Monitoring

### VPS Health
```bash
# Check all services
docker compose -f docker-compose.swarm.yml ps

# Check Ollama
curl http://localhost:11434/api/tags

# Check app
curl http://localhost:3000/api/health

# Resource usage
docker stats --no-stream
```

### Vercel Monitoring
- Use Vercel Analytics for Web Vitals
- Use Vercel Logs for function errors
- Set up alerts for 5xx errors

---

## Rollback Plan

If VPS fails:
1. Vercel frontend automatically falls back to xAI Groq (set `XAI_API_KEY` on Vercel)
2. Update `NEXT_PUBLIC_VPS_API_URL` to empty string → uses Vercel serverless functions
3. Fix VPS, then restore URL

```typescript
// In assistant API route
const VPS_URL = process.env.NEXT_PUBLIC_VPS_API_URL;
if (!VPS_URL) {
  // Fallback to serverless execution
  return executeLLM(systemPrompt, question, { preferredModel: "xai" });
}
```
