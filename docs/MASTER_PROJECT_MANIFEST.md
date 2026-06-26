# HotelsVendors — Master Project Manifest

> Auto-generated on 2026-06-25. Single source of truth for project state, setup, and onboarding.

---

## 1. Project Identity

- **Product**: HotelsVendors — B2B hospitality procurement marketplace
- **Domain**: hotelsvendors.com
- **Company**: Restaurants for E-Marketing (Tax ID: 704226146)
- **License**: Digital marketing license only — NO cash custody, NO factoring, NO lending
- **Production**: Vercel auto-deploy from `main` branch
- **Repo**: `Moataz301179/hotels-vendors` (GitHub)
- **Local path**: `/Users/Moataz/hotels-vendors/`

## 2. Tech Stack

| Layer | Version | Notes |
|---|---|---|
| Next.js | 16.2.4 | App Router + Turbopack |
| React | 18.3.1 | TypeScript strict |
| Tailwind CSS | v4.2.4 | CSS-native, no external UI libs |
| Prisma | 6.6 | PostgreSQL via `pg` Pool (Prisma 7 in blueprint) |
| Database | PostgreSQL | Supabase SDK installed but not wired |
| Deployment | Vercel | Auto-deploy from main |
| Testing | Vitest 4 | |
| AI SDK | @ai-sdk/react, ai, ollama | |
| Search | MeiliSearch | In .env but not installed |

## 3. Critical Rules

- NEVER create worktrees, duplicate repos, or external project folders
- Push to main → Vercel auto-deploy. Verify at hotelsvendors.com before saying "done."
- RBAC isolation on backend routes (Hotel scope ≠ Supplier scope)
- Liability disclaimer on every transaction failure: "Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults."
- Run `npx vitest run` before declaring any task complete

## 4. Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis for BullMQ queues, rate limiting, sessions
- `SESSION_SECRET` — 64-char random string
- `NEXTAUTH_SECRET` — 64-char random string
- `NEXTAUTH_URL` — App URL (http://localhost:3000 in dev)
- `GOOGLE_CLIENT_ID` — (optional) OAuth
- `GOOGLE_CLIENT_SECRET` — (optional) OAuth
- `ETA_AUTH_URL` — Egyptian Tax Authority auth endpoint
- `ETA_API_URL` — Egyptian Tax Authority invoicing endpoint
- `ETA_CLIENT_ID` — ETA registered app client ID
- `ETA_CLIENT_SECRET` — ETA registered app client secret
- `ETA_WEBHOOK_SECRET` — ETA webhook signing secret
- `ETA_STUB_MODE` — Toggle ETA stub mode (true/false)
- `PAYMOB_API_KEY` — Paymob gateway API key
- `PAYMOB_HMAC_SECRET` — Paymob HMAC secret
- `PAYMOB_INTEGRATION_ID` — Paymob integration ID
- `RESEND_API_KEY` — Resend email API key
- `SENTRY_DSN` — Sentry error tracking DSN
- `SENTRY_AUTH_TOKEN` — Sentry auth token
- `R2_ACCOUNT_ID` — Cloudflare R2 account ID
- `R2_ACCESS_KEY_ID` — Cloudflare R2 access key
- `R2_SECRET_ACCESS_KEY` — Cloudflare R2 secret key
- `R2_BUCKET_NAME` — Cloudflare R2 bucket name
- `MEILISEARCH_HOST` — MeiliSearch host
- `MEILISEARCH_API_KEY` — MeiliSearch API key
- `OLLAMA_URL` — Ollama local/VPS endpoint
- `OLLAMA_MODEL` — Primary Ollama model
- `OLLAMA_EMBED_MODEL` — Ollama embedding model
- `GROQ_API_KEY` — Groq free-tier fallback
- `OPENROUTER_API_KEY` — OpenRouter universal fallback
- `KIMI_API_KEY` — Kimi via Moonshot
- `XAI_API_KEY` — Grok via xAI
- `GOOGLE_MAPS_API_KEY` — Google Maps
- `GOOGLE_MAPS_PLACES_API_KEY` — Google Places
- `VPS_API_URL` — (optional) VPS backend for AI calls
- `NEXT_PUBLIC_VPS_API_URL` — (optional) Public VPS URL
- `VERCEL_URL` — (optional) Vercel URL for CORS
- `NEXT_PUBLIC_APP_URL` — (optional) Public app URL

## 5. Revenue Model

1. **SaaS subscription** — Supplier listing plans via INVO
2. **Document processing** — Per ETA invoice submission fee
3. **Marketplace commission** — % of transaction value (NOT financial spread)

No factoring fees. No cash custody. No lending. No wallet balances.

## 6. ETA Compliance

- Egyptian Tax Authority (ETA) e-invoicing mandatory
- Platform submits invoices on behalf of suppliers
- Per-document processing fee applies
- Pre-production endpoints: `id.preprod.eta.gov.eg`, `api.preprod.invoicing.eta.gov.eg`
- Stub mode available for development

## 7. Developer Setup

```bash
# Clone
git clone https://github.com/Moataz301179/hotels-vendors.git
cd hotels-vendors

# Install
npm install --legacy-peer-deps

# Environment
cp .env.example .env
# Fill in: DATABASE_URL, SESSION_SECRET, PAYMOB_*, etc.

# Database
npx prisma generate
npx prisma migrate dev   # dev
npx prisma db seed       # optional seed

# Run
npm run dev              # http://localhost:3000
npm run build            # production build
npm run test             # vitest
```

## 8. Supplier Onboarding Pipeline

1. Supplier registers via `/register` → selects "Supplier" sector
2. KYC verification (trade license + tax ID)
3. Product catalog upload (5 categories: F&B, Consumables, Guest Supplies, FF&E, Services)
4. Credit limit negotiation (Net-30 / Net-60 terms)
5. ETA e-invoicing onboarding (tax authority integration)
6. First listing goes live on marketplace

## 9. Current Focus (June 2026)

- Stack decisions pending: Supabase integration, Auth strategy, Jakarta Sans typography
- Marketplace Layer 1: 25 hardcoded vendor preview grid
- Theme: Deep obsidian #0B0F17 hybrid with glassmorphic panels
- Compliance: ETA e-invoicing mapping, fee structure hardening

## 10. Open Decisions

- [ ] Database: Supabase vs Neon vs Hostinger VPS
- [ ] Auth: Supabase Auth vs custom JWT (jose)
- [ ] Font: Jakarta Sans vs Jakarta Sans
- [ ] Theme: OLED #000000 vs obsidian #0B0F17
- [ ] Search: MeiliSearch vs Prisma full-text

---

Last updated: 2026-06-25
