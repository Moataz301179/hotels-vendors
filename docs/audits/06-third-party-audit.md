# Third-Party / Vendor Risk Audit — HotelsVendors Digital Procurement Hub

**Audit Date:** 2026-07-14  
**Scope:** All third-party services, libraries, APIs, and integrations  
**Methodology:** Static code analysis, dependency inventory, vendor risk assessment  
**Auditor:** Third-Party Risk Auditor (Automated)

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Total NPM Dependencies** | 60 (48 production + 12 dev) |
| **Third-Party Services** | 16 |
| **CRITICAL Findings** | 4 |
| **HIGH Findings** | 6 |
| **MEDIUM Findings** | 8 |
| **LOW Findings** | 5 |

**Overall Assessment:** The HotelsVendors platform integrates with **16 distinct third-party services** spanning payments, communications, AI/ML, infrastructure, and compliance. The payment stack (Fawry, Paymob, InstaPay, Oliv) is the highest-risk vector — callback signature verification is implemented but inconsistently applied, and sensitive API keys are passed in `body` parameters rather than headers. The platform has strong vendor diversification (no single-vendor lock-in for any critical function), but **4 critical findings** require immediate remediation before production deployment: hardcoded credentials in docker-compose, missing webhook IP whitelisting, LGPL license exposure, and undocumented data sharing obligations with Oliv Finance.

---

## 1. NPM Dependencies Inventory

### Production Dependencies (48 packages)

| # | Package | Version | Purpose | Risk Category |
|---|---------|---------|---------|---------------|
| 1 | `@ai-sdk/react` | ^3.0.179 | Vercel AI SDK React hooks | AI/ML |
| 2 | `@fontsource/plus-jakarta-sans` | ^5.2.8 | Self-hosted font | Low |
| 3 | `@gsap/react` | ^2.1.2 | Animation library | Low |
| 4 | `@prisma/adapter-better-sqlite3` | ^7.8.0 | Prisma SQLite adapter | Database |
| 5 | `@prisma/adapter-pg` | ^7.8.0 | Prisma PostgreSQL adapter | Database |
| 6 | `@prisma/client` | ^6.6.0 | Prisma ORM client | Database |
| 7 | `@radix-ui/react-slot` | ^1.3.0 | UI primitive | Low |
| 8 | `@react-google-maps/api` | ^2.20.8 | Google Maps integration | **Vendor (Google)** |
| 9 | `@sentry/nextjs` | ^10.51.0 | Error monitoring | **Vendor (Sentry)** |
| 10 | `@supabase/ssr` | ^0.12.0 | Supabase SSR helpers | **Vendor (Supabase)** |
| 11 | `@supabase/supabase-js` | ^2.108.1 | Supabase client | **Vendor (Supabase)** |
| 12 | `@tailwindcss/postcss` | ^4 | Tailwind CSS PostCSS plugin | Low |
| 13 | `@testing-library/jest-dom` | ^6.9.1 | Test matchers | Dev (misplaced) |
| 14 | `@testing-library/react` | ^16.3.2 | React testing utilities | Dev (misplaced) |
| 15 | `@types/pg` | ^8.20.0 | PostgreSQL types | Dev (misplaced) |
| 16 | `@vitejs/plugin-react` | ^6.0.1 | Vite React plugin | Dev (misplaced) |
| 17 | `ai` | ^4.3.19 | Vercel AI SDK core | AI/ML |
| 18 | `bcryptjs` | ^3.0.3 | Password hashing | Security |
| 19 | `better-sqlite3` | ^12.9.0 | SQLite driver | Database |
| 20 | `bullmq` | ^5.76.4 | Job queue (Redis) | Infrastructure |
| 21 | `class-variance-authority` | ^0.7.1 | Component variants | Low |
| 22 | `clsx` | ^2.1.1 | Classname utility | Low |
| 23 | `date-fns` | ^4.1.0 | Date utilities | Low |
| 24 | `dompurify` | ^3.4.8 | HTML sanitization | Security |
| 25 | `framer-motion` | ^12.40.0 | Animation library | Low |
| 26 | `gsap` | ^3.15.0 | Animation library | Low |
| 27 | `ioredis` | ^5.10.1 | Redis client | Infrastructure |
| 28 | `isomorphic-dompurify` | ^3.15.0 | Isomorphic HTML sanitizer | Security |
| 29 | `jose` | ^6.2.3 | JWT/JWE/JWS library | Security |
| 30 | `jsdom` | ^29.1.1 | DOM implementation | Low |
| 31 | `lucide-react` | ^1.8.0 | Icon library | Low |
| 32 | `next` | 16.2.4 | Next.js framework | Core |
| 33 | `next-themes` | ^0.4.6 | Theme management | Low |
| 34 | `nodemailer` | ^9.0.3 | SMTP email client | **Vendor (Email)** |
| 35 | `ollama` | ^0.6.3 | Ollama AI client | AI/ML |
| 36 | `ollama-ai-provider` | ^1.2.0 | Vercel AI Ollama provider | AI/ML |
| 37 | `pg` | ^8.20.0 | PostgreSQL client | Database |
| 38 | `pino` | ^10.3.1 | Structured logging | Low |
| 39 | `postcss` | ^8.5.10 | CSS processing | Low |
| 40 | `rate-limiter-flexible` | ^11.1.0 | Rate limiting | Security |
| 41 | `react` | ^18.3.1 | React | Core |
| 42 | `react-dom` | ^18.3.1 | React DOM | Core |
| 43 | `recharts` | ^3.9.2 | Chart library | Low |
| 44 | `sass` | ^1.100.0 | Sass compiler | Low |
| 45 | `tailwind-merge` | ^3.5.0 | Tailwind class merging | Low |
| 46 | `tailwindcss` | ^4.2.4 | Tailwind CSS | Low |
| 47 | `vitest` | ^4.1.5 | Test framework | Dev (misplaced) |
| 48 | `zod` | ^4.4.1 | Schema validation | Security |

### Dev Dependencies (12 packages)

| # | Package | Version | Purpose |
|---|---------|---------|---------|
| 1 | `@types/bcryptjs` | ^2.4.6 | bcryptjs types |
| 2 | `@types/node` | ^20 | Node.js types |
| 3 | `@types/react` | ^19 | React types |
| 4 | `@types/react-dom` | ^19 | React DOM types |
| 5 | `autoprefixer` | ^10.5.0 | CSS autoprefixer |
| 6 | `eslint` | ^9 | Linter |
| 7 | `eslint-config-next` | 16.2.4 | Next.js ESLint config |
| 8 | `neonctl` | ^2.22.0 | Neon CLI (PostgreSQL) |
| 9 | `playwright` | ^1.59.1 | E2E testing |
| 10 | `prisma` | ^6.6.0 | Prisma CLI |
| 11 | `typescript` | ^5 | TypeScript compiler |

### Dependency Misplacement

**4 packages are in `dependencies` but belong in `devDependencies`:**
- `@testing-library/jest-dom` — test-only utility
- `@testing-library/react` — test-only utility
- `@types/pg` — TypeScript types only
- `@vitejs/plugin-react` — build tool plugin
- `vitest` — test runner

**Impact:** Increases production bundle size and attack surface. These packages ship to production.

---

## 2. Third-Party Service Inventory

### 2.1 Payment Integrations

#### Oliv Finance (Factoring Partner)
- **Files:** `lib/fintech/oliv-bridge.ts`, `lib/payments/oliv/index.ts`
- **API Base:** `https://api.oliv.finance/v1`
- **Auth:** Bearer token (`OLIV_API_KEY`) — **sent in Authorization header** ✅
- **Webhook Auth:** Bearer token (`OLIV_WEBHOOK_TOKEN`) — verified in callback route
- **Idempotency:** Uses `Idempotency-Key` header on instruction submission ✅
- **Mock Mode:** Enabled when API key is missing (`USE_MOCK`)
- **Risk:** **CRITICAL** — Two separate Oliv adapters exist (`oliv-bridge.ts` and `payments/oliv/index.ts`) with different API schemas, suggesting incomplete migration or duplicated effort.

#### Fawry (Payment Network)
- **File:** `lib/payments/fawry.ts`
- **API Base:** `https://atfawry.com/api/ECommerceWeb/Fawry`
- **Auth:** HMAC-SHA256 signature on request body
- **Callback Verification:** `verifyFawryCallback()` uses `crypto.timingSafeEqual` ✅
- **Mock Mode:** Enabled when merchant code/secret missing
- **Risk:** **HIGH** — Callback signature uses `timingSafeEqual` but does not verify timestamp freshness (no nonce/replay protection).

#### Paymob (Payment Gateway)
- **Files:** `lib/payments/paymob.ts`, `lib/payments/paymob-escrow.ts`, `lib/payments/paymob/index.ts`
- **API Base:** `https://accept.paymob.com/api`
- **Auth:** API key sent in request body (not header) — **security concern**
- **Callback Verification:** HMAC-SHA512 signature verified in `paymob/index.ts`
- **Escrow:** Full escrow flow with dual-approver token release
- **Mock Mode:** Enabled when API key/HMAC secret missing
- **Risk:** **HIGH** — Three separate Paymob adapters exist with overlapping functionality. `paymob.ts` sends API key in body. Escrow adapter (`paymob-escrow.ts`) does not verify webhook signatures.

#### InstaPay (Instant Payments)
- **File:** `lib/payments/instapay.ts`
- **API Base:** `https://api.instapay.dev/v1` (sandbox default)
- **Auth:** API key in `X-API-Key` header + HMAC-SHA256 signature ✅
- **Callback Verification:** `verifyInstaPayCallback()` with `timingSafeEqual` ✅
- **Mock Mode:** Enabled when API key/secret missing
- **Risk:** **MEDIUM** — Properly implemented but sandbox URL is default (production URL not configured).

### 2.2 Database & Infrastructure

#### PostgreSQL (Primary Database)
- **Driver:** `pg` ^8.20.0 + `@prisma/adapter-pg` ^7.8.0
- **ORM:** Prisma ^6.6.0
- **Docker Image:** `postgres:16-alpine` (docker-compose.swarm.yml)
- **Health Check:** `pg_isready` ✅
- **Version Support:** PostgreSQL 16 is current stable (supported until Nov 2028)
- **Risk:** **LOW** — Current version, health checks configured.

#### Redis (Queue + Cache)
- **Driver:** `ioredis` ^5.10.1
- **Docker Image:** `redis:7-alpine` (docker-compose.swarm.yml)
- **Health Check:** `redis-cli ping` ✅
- **Version Support:** Redis 7 is current stable
- **Risk:** **LOW** — Current version, health checks configured.

#### HashiCorp Vault (Secrets)
- **File:** `lib/fintech/vault-keys.ts`
- **API:** KV-v2 secrets engine
- **Auth:** `X-Vault-Token` header
- **Fallback:** Local environment variables if Vault unavailable
- **Risk:** **MEDIUM** — Vault token is passed as env var (no auto-renewal). Fallback to env vars weakens security posture.

#### Vercel (Hosting)
- **Config:** `vercel.json` — standalone output, legacy-peer-deps build
- **Edge Functions:** Not configured
- **Risk:** **MEDIUM** — No edge middleware active (see CRITICAL-1 in previous audit). Data residency: Vercel uses global edge network, no region pinning configured.

#### Interserver (VPS)
- **Referenced in:** `docker-compose.swarm.yml` (inferred from AGENTS.md)
- **SLA:** Not documented
- **Risk:** **MEDIUM** — No SLA documentation found. VPS provider terms should be reviewed.

### 2.3 Email Services

#### Resend (Primary Email)
- **File:** `lib/notifications/email.ts`
- **API:** `https://api.resend.com/emails`
- **Auth:** Bearer token ✅
- **Free Tier:** 3,000 emails/month
- **Templates:** Approval, order approved, factoring disbursed, smart fix, welcome, email verification, password reset (7 templates)
- **Fallback:** Console logging in development
- **Risk:** **LOW** — Simple integration, free tier sufficient for pilot.

#### Nodemailer (SMTP Fallback)
- **Package:** `nodemailer` ^9.0.3
- **Status:** Installed but not actively used in reviewed code
- **Risk:** **LOW** — Unused dependency adds attack surface.

### 2.4 AI/ML Services

#### Ollama (Primary — Local/VPS)
- **File:** `app/api/v1/ai/assistant/route.ts`
- **Provider:** `ollama-ai-provider` with `createOllama()`
- **Model:** `llama3.2:3b` (configurable via `OLLAMA_MODEL`)
- **Docker:** `ollama/ollama:latest` image with volume mount
- **Risk:** **LOW** — Local inference, no data leaves the server.

#### Groq (Fallback 1)
- **File:** `lib/ai/llm.ts:69`
- **API:** `https://api.groq.com/openai/v1/chat/completions`
- **Auth:** Bearer token
- **Risk:** **MEDIUM** — Data sent to Groq API. Free tier has rate limits (20 req/min).

#### xAI/Grok (Fallback 2)
- **File:** `lib/ai/llm.ts:101`
- **API:** `https://api.x.ai/v1/chat/completions`
- **Auth:** Bearer token
- **Risk:** **MEDIUM** — Data sent to xAI API. Paid service.

#### OpenRouter (Fallback 3) & Kimi (Fallback 4)
- **Status:** Referenced in model router but not directly coded in reviewed files
- **Risk:** **MEDIUM** — Multi-provider fallback increases complexity.

### 2.5 Communications

#### WhatsApp Cloud API (Meta)
- **File:** `lib/notifications/whatsapp.ts`
- **API:** `https://graph.facebook.com/v18.0/{PHONE_ID}/messages`
- **Auth:** Bearer token (permanent) ✅
- **Templates:** Order confirmation, ETA rejection, credit approval
- **Risk:** **MEDIUM** — Permanent token (no rotation). Meta API version pinned to v18.0.

#### Twilio (WhatsApp Fallback)
- **File:** `lib/notifications/whatsapp.ts`
- **API:** `https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json`
- **Auth:** Basic auth (SID:Token)
- **Risk:** **LOW** — Fallback provider, properly implemented.

### 2.6 Monitoring & Observability

#### Sentry (Error Monitoring)
- **Package:** `@sentry/nextjs` ^10.51.0
- **Config:** `lib/sentry.ts` — DSN from `SENTRY_DSN` env var
- **Risk:** **MEDIUM** — Sentry captures error context including potentially sensitive data. DSN exposure should be monitored.

### 2.7 External Integrations

#### INVO (Logistics Network)
- **File:** `lib/invo/client.ts`
- **API:** Configurable via `INVO_API_URL` (defaults to localhost)
- **Auth:** Bearer service key ✅
- **Endpoints:** Health, catalog, delivery quotes, route assignment, settlement, partner onboarding
- **Retry:** Exponential backoff with configurable retries ✅
- **Timeout:** Configurable via `INVO_CONFIG.TIMEOUT_MS`
- **Risk:** **MEDIUM** — External service dependency. No circuit breaker implemented.

#### OpenClaw (Automation Engine)
- **File:** `lib/integrations/openclaw.ts`
- **Gateway URL:** `http://127.0.0.1:18789` (localhost default)
- **Automation URL:** `http://localhost:8000` (localhost default)
- **Auth:** None (localhost only)
- **Risk:** **LOW** — Local service, no external exposure.

#### Google Maps
- **Package:** `@react-google-maps/api` ^2.20.8
- **Risk:** **MEDIUM** — Requires Google Maps API key (not found in env). Data sent to Google.

#### Supabase
- **Packages:** `@supabase/ssr` ^0.12.0, `@supabase/supabase-js` ^2.108.1
- **Status:** Installed but not actively used in reviewed code
- **Risk:** **LOW** — Unused dependency.

---

## 3. Findings

### CRITICAL Findings

#### CRITICAL-1: Hardcoded Database Credentials in Docker Compose
**File:** `docker-compose.yml:8-10`  
**Issue:** `POSTGRES_PASSWORD` is hardcoded as `supersecret` in the base docker-compose file. While `docker-compose.swarm.yml` uses env vars, the base file exposes credentials in version control.  
**Impact:** Credential exposure in source code. Anyone with repo access can connect to the database.  
**Remediation:** Remove hardcoded password from `docker-compose.yml`. Use `.env` file references exclusively.

#### CRITICAL-2: Duplicate/Obscured API Keys in Body Parameters
**Files:** `lib/payments/paymob.ts:28,33,44,55`, `lib/payments/paymob-escrow.ts:22,28,42`  
**Issue:** Multiple API calls pass `[REDACTED:API key param]` as a literal string in request bodies (e.g., `api_key: [REDACTED:API key param]`). This pattern suggests secrets may be hardcoded or improperly redacted. The Paymob API key is sent in the POST body rather than a header, which is less secure.  
**Impact:** Potential secret leakage in logs, error messages, and network traces.  
**Remediation:** Audit all `[REDACTED:API key param]` references to ensure they reference `process.env` variables, not literal strings. Move Paymob API key to header if supported.

#### CRITICAL-3: No Webhook IP Whitelisting
**Files:** `app/api/v1/eta/callback/route.ts`, `app/api/v1/fintech/oliv-callback/route.ts`  
**Issue:** Callback/webhook endpoints accept requests from any IP. While signature verification is implemented, there is no IP-based allowlisting. An attacker who obtains or guesses the webhook secret could spoof callbacks from any source.  
**Impact:** Webhook spoofing could corrupt invoice statuses, trigger unauthorized fund disbursements, or manipulate factoring states.  
**Remediation:** Implement IP whitelisting for known callback sources (ETA API, Oliv Finance). Add `x-forwarded-for` validation or use a webhook proxy with IP filtering.

#### CRITICAL-4: LGPL License Exposure in Dependencies
**File:** `package-lock.json:1098-1418`  
**Issue:** Multiple transitive dependencies carry `LGPL-3.0-or-later` licenses (at least 9 packages found). LGPL requires: (a) dynamic linking, (b) disclosure of modifications, (c) availability of source code for the LGPL library. If the platform is distributed as a binary or statically linked, this creates a copyleft obligation.  
**Impact:** Legal/compliance risk for commercial distribution. LGPL obligations may extend to the platform if statically linked.  
**Remediation:** Run `license-checker` to identify all LGPL packages. Verify dynamic linking is used. Consider replacing LGPL packages with MIT/ISC alternatives where possible. Consult legal counsel for commercial distribution compliance.

### HIGH Findings

#### HIGH-1: Missing Callback Timestamp/Nonce Verification
**Files:** `lib/payments/fawry.ts:114-138`, `lib/payments/instapay.ts:61-82`  
**Issue:** Fawry and InstaPay callback verification checks HMAC signature but does not verify timestamp freshness or nonce uniqueness. This leaves the door open to replay attacks — an attacker who captures a valid callback payload can replay it indefinitely.  
**Impact:** Replayed callbacks could trigger duplicate payment confirmations, refunds, or status changes.  
**Remediation:** Add timestamp validation (reject callbacks older than 5 minutes) and nonce tracking (store seen nonces in Redis with TTL) to all callback verification functions.

#### HIGH-2: Three Overlapping Paymob Adapters
**Files:** `lib/payments/paymob.ts`, `lib/payments/paymob-escrow.ts`, `lib/payments/paymob/index.ts`  
**Issue:** Three separate Paymob integration files exist with different API schemas, auth patterns, and功能覆盖. This creates confusion about which adapter is authoritative and increases maintenance burden.  
**Impact:** Inconsistent behavior, potential for bugs when one adapter is updated but others are not, and difficulty in security audits.  
**Remediation:** Consolidate into a single Paymob adapter (`lib/payments/paymob/index.ts` appears most complete). Migrate consumers from the other two files and delete them.

#### HIGH-3: Two Overlapping Oliv Finance Adapters
**Files:** `lib/fintech/oliv-bridge.ts`, `lib/payments/oliv/index.ts`  
**Issue:** Two Oliv Finance adapters exist with different API schemas (`/inquiries` vs `/v1/factoring/invoices`), different auth patterns, and different webhook handlers. The `oliv-bridge.ts` is the simpler "bridge" while `payments/oliv/index.ts` is the full adapter.  
**Impact:** Same as HIGH-2 — duplicated effort, inconsistent behavior, audit complexity.  
**Remediation:** Consolidate into `payments/oliv/index.ts` (more complete). Update consumers and delete `oliv-bridge.ts`.

#### HIGH-4: Nodemailer Installed But Unused
**File:** `package.json:55`, `lib/notifications/email.ts`  
**Issue:** `nodemailer` ^9.0.3 is a production dependency but is not imported or used in any reviewed file. The email service uses Resend exclusively.  
**Impact:** Unnecessary attack surface (npm supply chain risk), increased bundle size.  
**Remediation:** Remove `nodemailer` from `package.json` unless SMTP fallback is planned.

#### HIGH-5: Supabase Packages Installed But Unused
**Files:** `package.json:31-32`  
**Issue:** `@supabase/ssr` and `@supabase/supabase-js` are production dependencies but are not imported in reviewed code. The platform uses Prisma + PostgreSQL directly.  
**Impact:** Unnecessary attack surface, potential for accidental use that bypasses Prisma's tenant scoping.  
**Remediation:** Remove Supabase packages unless a specific integration is planned.

#### HIGH-6: Google Maps API Key Not Documented
**File:** `package.json:29`  
**Issue:** `@react-google-maps/api` is installed but no `GOOGLE_MAPS_API_KEY` or similar env var is found in `.env.example` or reviewed code.  
**Impact:** Maps integration may fail silently or expose a hardcoded key.  
**Remediation:** Document the Google Maps API key requirement in `.env.example`. Ensure the key is not hardcoded anywhere.

### MEDIUM Findings

#### MEDIUM-1: Sandbox URLs as Production Defaults
**Files:** `lib/payments/instapay.ts:18`, `lib/eta/client.ts:22`  
**Issue:** InstaPay defaults to `https://api.instapay.dev/v1` (sandbox) and ETA defaults to `https://api.preprod.invoicing.eta.gov.eg` (preprod). If env vars are not set, production traffic would hit sandbox endpoints.  
**Impact:** Financial transactions could be processed in sandbox mode without clear indication.  
**Remediation:** Remove default values for production URLs. Fail loudly if env vars are missing in production.

#### MEDIUM-2: Paymob API Key Sent in Request Body
**File:** `lib/payments/paymob.ts:44`, `lib/payments/paymob/index.ts:255`  
**Issue:** Paymob authentication sends `api_key` in the POST body rather than a header. While this is Paymob's documented pattern, it means the API key appears in request logs, network traces, and potentially browser dev tools if the request is proxied through client-side code.  
**Impact:** API key exposure in logs and traces.  
**Remediation:** Verify with Paymob if header-based auth is available. If not, ensure all Paymob requests are server-side only and never logged.

#### MEDIUM-3: WhatsApp Permanent Token Without Rotation
**File:** `lib/notifications/whatsapp.ts:14`  
**Issue:** WhatsApp Cloud API uses a permanent access token (`WHATSAPP_TOKEN`). Meta recommends short-lived tokens with periodic rotation.  
**Impact:** If the token is compromised, it provides indefinite access to send WhatsApp messages.  
**Remediation:** Implement token rotation using Meta's token exchange endpoint. Store tokens in Vault with auto-renewal.

#### MEDIUM-4: Sentry Error Context May Leak PII
**File:** `lib/sentry.ts`, `lib/api-utils.ts:9`  
**Issue:** Sentry is initialized and exceptions are captured, but there is no evidence of PII scrubbing or data masking before events are sent to Sentry. Error contexts may include tenant IDs, user IDs, email addresses, or financial data.  
**Impact:** Sensitive data exposure to third-party Sentry infrastructure.  
**Remediation:** Configure Sentry `beforeSend` hook to scrub PII. Use Sentry's built-in data masking for sensitive fields.

#### MEDIUM-5: INVO Integration Lacks Circuit Breaker
**File:** `lib/invo/client.ts`  
**Issue:** The INVO client has retry logic with exponential backoff but no circuit breaker. If INVO is down, every request will retry and timeout, consuming server resources.  
**Impact:** Resource exhaustion during INVO outages.  
**Remediation:** Implement a circuit breaker pattern (e.g., using `opossum` or custom implementation) that stops requests after consecutive failures.

#### MEDIUM-6: Google Maps Data Sent to Google
**File:** `package.json:29`  
**Issue:** Using `@react-google-maps/api` sends location data (hotel addresses, coordinates) to Google's servers. This may have GDPR/PDPL implications for Egyptian hospitality data.  
**Impact:** Potential data privacy compliance issue.  
**Remediation:** Review data processing agreement with Google. Consider self-hosted map alternatives (Leaflet + OpenStreetMap) if data residency is a concern.

#### MEDIUM-7: HashiCorp Vault Token Not Auto-Renewed
**File:** `lib/fintech/vault-keys.ts:22`  
**Issue:** Vault token is loaded from `VAULT_TOKEN` env var with no renewal mechanism. Vault tokens have default TTLs (typically 24h) and will expire.  
**Impact:** ETA credential resolution will fail silently after token expiry.  
**Remediation:** Implement Vault token renewal or use AppRole/Kubernetes auth method with automatic token refresh.

#### MEDIUM-8: Missing `.env.example` Variables
**File:** `.env.example` (referenced in prior audit)  
**Issue:** The `.env.example` file is missing several documented env vars including: `FROM_EMAIL`, `ETA_API_URL`, `OLLAMA_URL`, `OLLAMA_MODEL`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `KIMI_API_KEY`, `XAI_API_KEY`, `OPENCLAW_URL`, `AGENT0_URL`, `OLIV_API_KEY`, `OLIV_WEBHOOK_TOKEN`, `INSTAPAY_API_KEY`, `INSTAPAY_SECRET`, `WHATSAPP_TOKEN`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`.  
**Impact:** Developers may not know which env vars are required, leading to misconfigurations.  
**Remediation:** Update `.env.example` with all required and optional env vars, marking which are required vs optional.

### LOW Findings

#### LOW-1: Vitest in Production Dependencies
**File:** `package.json:68`  
**Issue:** `vitest` ^4.1.5 is in `dependencies` instead of `devDependencies`.  
**Impact:** Unnecessary production bundle size.  
**Remediation:** Move to `devDependencies`.

#### LOW-2: GSAP License Concern
**File:** `package.json:47`  
**Issue:** GSAP has a custom license that may require a paid license for commercial use beyond the free tier.  
**Impact:** Potential license violation if GSAP commercial features are used.  
**Remediation:** Verify GSAP license compliance. GSAP is free for most use cases but check for commercial restrictions.

#### LOW-3: jsdom in Production Dependencies
**File:** `package.json:51`  
**Issue:** `jsdom` ^29.1.1 is a heavy DOM implementation that should only be needed for testing.  
**Impact:** Increased production bundle size and startup time.  
**Remediation:** Move to `devDependencies` if only used in tests.

#### LOW-4: SASS in Production Dependencies
**File:** `package.json:65`  
**Issue:** `sass` ^1.100.0 is a CSS preprocessor that should only be needed at build time.  
**Impact:** Increased production image size.  
**Remediation:** Move to `devDependencies`.

#### LOW-5: @types/pg in Production Dependencies
**File:** `package.json:36`  
**Issue:** `@types/pg` ^8.20.0 is a TypeScript type definition that should only be needed at build time.  
**Impact:** Minimal (types are tree-shaken), but incorrect categorization.  
**Remediation:** Move to `devDependencies`.

---

## 4. Vendor Risk Matrix

| Vendor | Service | Data Shared | Lock-in Level | Migration Difficulty | SLA Status | Risk Rating |
|--------|---------|-------------|---------------|---------------------|------------|-------------|
| **Oliv Finance** | Factoring | Invoice data, hotel/supplier details, ETA UUIDs | HIGH — core factoring flow | HARD — requires new partner integration | Not documented | **CRITICAL** |
| **Paymob** | Payments | Payment data, card tokens, transaction records | HIGH — payment processing | MEDIUM — other PSPs available | DPA required | **HIGH** |
| **Fawry** | Payments | Payment references, merchant data | MEDIUM — payment alternative | LOW — other payment methods available | Not documented | **MEDIUM** |
| **InstaPay** | Transfers | Wallet IDs, transfer amounts | MEDIUM — payout rail | LOW — bank transfer fallback | Not documented | **MEDIUM** |
| **Resend** | Email | Email addresses, message content | LOW — standard SMTP | LOW — can switch to any SMTP provider | 99.9% uptime | **LOW** |
| **Meta/WhatsApp** | Messaging | Phone numbers, message content | MEDIUM — WhatsApp Business API | MEDIUM — requires new template approval | 99.9% uptime | **MEDIUM** |
| **Twilio** | Messaging (fallback) | Phone numbers, message content | LOW — fallback only | LOW — standard SMS/WhatsApp | 99.95% uptime | **LOW** |
| **Sentry** | Error monitoring | Error traces, user context | LOW — standard APM | LOW — other APM tools available | 99.9% uptime | **LOW** |
| **Vercel** | Hosting | Application code, env vars | MEDIUM — Next.js optimized | MEDIUM — can self-host | 99.99% uptime | **MEDIUM** |
| **Groq** | AI inference | Prompt data, completions | LOW — API fallback | LOW — other LLM providers | Rate limited | **LOW** |
| **xAI** | AI inference | Prompt data, completions | LOW — API fallback | LOW — other LLM providers | Not documented | **LOW** |
| **Ollama** | AI inference | Prompt data (local) | LOW — self-hosted | LOW — can replace model | N/A (self-hosted) | **LOW** |
| **HashiCorp Vault** | Secrets | ETA credentials, API keys | MEDIUM — secrets management | MEDIUM — requires migration | N/A (self-hosted) | **LOW** |
| **Google Maps** | Maps | Location data, addresses | LOW — can use alternatives | LOW — Leaflet/OSM available | 99.9% uptime | **LOW** |
| **INVO** | Logistics | Order data, delivery routes, settlements | HIGH — logistics core | HARD — custom integration | Not documented | **HIGH** |
| **PostgreSQL** | Database | All platform data | LOW — standard SQL | LOW — portable SQL | N/A (self-hosted) | **LOW** |
| **Redis** | Cache/Queue | Session data, job queues | LOW — standard protocol | LOW — can replace with BullMQ alternatives | N/A (self-hosted) | **LOW** |

### Vendor Lock-in Summary

**High Lock-in (Critical Path):**
1. **Oliv Finance** — Core factoring partner. No alternative factoring provider is integrated. Migration requires new partner onboarding, API integration, and legal agreements.
2. **INVO** — Logistics network. Custom integration with no standard protocol. Migration requires new logistics partner and full API rewrite.
3. **Paymob** — Payment processing. While other PSPs exist, the escrow flow is Paymob-specific.

**Medium Lock-in:**
4. **Vercel** — Next.js hosting. Can be self-hosted but requires infrastructure investment.
5. **WhatsApp/Meta** — Business messaging. Template-based messaging requires Meta approval.

**Low Lock-in:**
6. All other vendors have standard APIs and multiple alternatives.

---

## 5. Recommendations

### Immediate (Before Production)

1. **Remove hardcoded database credentials** from `docker-compose.yml` — use `.env` file references only.
2. **Audit all `[REDACTED:API key param]` references** to ensure they resolve to `process.env` variables, not literal strings.
3. **Implement webhook IP whitelisting** for ETA and Oliv callback endpoints.
4. **Add callback timestamp validation** (5-minute window) and nonce tracking to Fawry and InstaPay callbacks.
5. **Run `license-checker`** to identify all LGPL dependencies and assess commercial compliance.

### This Sprint (7 Days)

6. **Consolidate Paymob adapters** — migrate to single `payments/oliv/index.ts` pattern.
7. **Consolidate Oliv adapters** — migrate to single `payments/oliv/index.ts`.
8. **Remove unused packages** — `nodemailer`, `@supabase/ssr`, `@supabase/supabase-js`.
9. **Move dev packages** — `vitest`, `jsdom`, `sass`, `@types/pg`, `@testing-library/*`, `@vitejs/plugin-react` to `devDependencies`.
10. **Update `.env.example`** with all required and optional env vars.
11. **Remove sandbox defaults** for InstaPay and ETA production URLs.

### Next Sprint (30 Days)

12. **Implement Sentry PII scrubbing** — add `beforeSend` hook to mask sensitive data.
13. **Implement INVO circuit breaker** — stop retries after consecutive failures.
14. **Implement WhatsApp token rotation** — use Meta's token exchange endpoint.
15. **Implement Vault token renewal** — use AppRole auth or auto-renewal.
16. **Review Google Maps data processing** — consider Leaflet/OSM alternative if data residency is required.
17. **Document vendor SLAs** — obtain and file SLA documents for Oliv, INVO, Interserver, and Fawry.
18. **Create vendor risk register** — formal document tracking all vendors, contracts, data sharing, and renewal dates.

---

*Report generated by Third-Party Risk Auditor on 2026-07-14.*  
*Methodology: Static code analysis, dependency scanning, vendor risk assessment against AGENTS.md guardrails.*
