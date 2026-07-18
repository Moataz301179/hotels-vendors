# Senior Engineer Architecture Review — `hotels-vendors`

> **Date:** 2026-07-18
> **Mode:** Read-only reverse-engineering. No functionality changed.
> **Scope:** ~550 source files (270 in `app/`, 151 in `components/`, 130 in `lib/`), 2,954-line Prisma schema with 75+ models, 142 API route files. Next.js 16 / Prisma / PostgreSQL B2B hospitality procurement platform.

## 1. Executive Summary

The platform has **strong documented intent** (AGENTS.md is excellent) but **drifted execution**. The single biggest structural problem is **parallel duplication at every layer**: two `next.config` files, two PostCSS configs, two app trees (`app/dashboard/` + `app/(dashboard)/`), a bolt-on second app (`app/invo/`), two RBAC enforcement points (edge middleware vs Node `authenticate`), two audit ledger models (`JournalEntry` vs `LedgerEntry`), two risk engines (0–100 vs 0–1000), six fee calculators (1.5% / 2% / 2.5% / 3% / placeholder-100k), three LLM routers (one of which is a Python sidecar nobody calls), and a "Swarm v3" architecture documented in AGENTS.md that **does not exist in code** (`director.ts`, `scheduler.ts`, `agents/index.ts`, "4 squad queues", "15 agents" are all fiction).

On top of structural duplication there are **three critical security/compliance holes** that must be fixed before any further feature work:

1. **`app/api/v1/admin/env/route.ts` & `app/api/v1/admin/credentials/route.ts`** — overwrite the `.env` file on disk, gated only by a hardcoded password (`"panda3011"`) read from a client header. No `authenticate`, no RBAC.
2. **`app/api/v1/orders/[id]/status/route.ts:72`** — mutates `Order.status` directly via `prisma.order.update`, **bypassing the Authority Matrix** (`evaluateAuthority` / `recordApproval`) and the transactional `atomicStatusUpdate` that already exists in `lib/auth/state-machine.ts`.
3. **`app/api/v1/financing/invoice-upload/route.ts:144-152`** — creates an Order with `status:"CONFIRMED"` and `paymentGuaranteed:false`, a hard violation of guardrail G10.

Plus two pervasive anti-patterns: **silent `catch {}` blocks** that hide auth/financial/audit failures (rate limiter fails *open* with a comment claiming "fail closed"), and **`typescript.ignoreBuildErrors: true`** in `next.config.mjs` combined with `@ts-nocheck` on the compliance-critical ETA routes — meaning the type system is off exactly where it matters most.

---

## 2. Clean Architecture Breakdown (as it actually exists)

### 2.1 Request lifecycle (the real data flow)

```
┌─────────────┐  JWT cookie   ┌──────────────────────────┐   x-user-id / x-tenant-id /   ┌──────────────────────┐
│  Browser    │ ────────────► │  middleware.ts (edge)    │ ─ x-platform-role headers ──► │  app/api/v1/* route  │
│  hv_session │               │  jwtVerify (jose)        │   (injected, NOT trusted)     │  ┌─────────────────┐ │
└─────────────┘               │  + CSRF + CSP + role     │                               │  │ apiRoute() wrap │ │
                              │   route guard            │                               │  │  authenticate() │ │
                              │  + invo. subdomain rewrite│                              │  │  verifySession  │ │
                              └──────────────────────────┘                               │  │  (JWT + Redis   │ │
                                       ⚠ NO blacklist check at edge                     │  │  blacklist)     │ │
                                       ⚠ Different dev-fallback secret than lib/session │  │  requirePermission│
                                                                                       │  │  validateBody   │ │
                                                                                       │  │  tenantWhere    │ │
                                                                                       │  │  prisma.X.*     │ │
                                                                                       │  └─────────────────┘ │
                                                                                       └──────────┬───────────┘
                                                                                                  │
                       ┌──────────────────────────────────────────────────────────────────────────┘
                       ▼
   ┌─────────────────────────────────┐    ┌──────────────────────────┐    ┌──────────────────────────┐
   │  lib/ (services)                │    │  Prisma → PostgreSQL     │    │  Redis (ioredis)         │
   │  • auth/  (rbac, authority-     │    │  (75+ models, no RLS)    │    │  • idempotency           │
   │    matrix, state-machine,       │    │  • Tenant-scoped ad-hoc  │    │  • rate limits           │
   │    four-eyes, server-auth)      │    │    via inline tenantId   │    │  • session cache         │
   │  • fintech/ (orchestrator,      │    │    (helper used in 4/147)│    │  • token blacklist       │
   │    risk-engine, ledger,         │    │  • JournalEntry +        │    │  • SSE event buffer      │
   │    anti-bypass, smart-fix)      │    │    LedgerEntry (dual)    │    │  ⚠ in-memory fallback     │
   │  • payments/ (paymob, oliv,     │    │    ⚠ vestigial           │    │    per-process (not shared)│
   │    fawry, instapay)             │    └──────────────────────────┘    └──────────────────────────┘
   │  • eta/ (client, queue,         │
   │    validator, signer†)          │    ┌──────────────────────────┐
   │  • ai/ (llm router — the one    │    │  BullMQ queues (5)       │
   │    that actually runs)          │    │  • factoring-disbursement│
   │  • swarm/ (3 stub shims)        │    │  • eta-submission + DLQ  │
   │  • agents/ (canned, no LLM)     │    │  • order-processing      │
   │  • intelligence/ (dead)         │    │  • email-notifications   │
   │  • invo/ (logistics HTTP bridge)│    │  ⚠ "4 squads" don't exist│
   └─────────────────────────────────┘    └──────────────────────────┘
```

`†` `lib/eta/signer.ts` + `lib/eta/canonicalizer.ts` are **dead code — never called.** No ETA submission signs the invoice, so `Invoice.digitalSignature` is always null, so `validateForFactoring` will reject every invoice for factoring. End-to-end ETA signing is broken.

### 2.2 Module map (liveness-ranked)

| Layer | Module | Status | Notes |
|---|---|---|---|
| Infra | `lib/prisma.ts`, `lib/redis.ts`, `lib/session.ts` | ✅ Live | Solid; Redis has graceful memory fallback. |
| Infra | `lib/api-utils.ts` | ✅ Live | The canonical API wrapper. Used by ~86% of routes. |
| Auth | `lib/auth/rbac.ts`, `authority-matrix.ts`, `state-machine.ts`, `four-eyes.ts` | ✅ Live | Well-designed; **bypassed by `orders/[id]/status` route**. |
| Auth | `lib/tenant/scope.ts` | ✅ Live but **underused** (4/147 routes). |
| Security | `lib/security/{csrf,rate-limiter,security-logger,api-guard}` | ⚠ Live with bugs | Two rate-limiter impls; limiter fails open. |
| Audit | `lib/audit/tamper-proof.ts` | ⚠ Live, non-atomic | Hash chain can fork under concurrent appends; `exportAuditLog` not tenant-scoped; `verifyAuditChain` loads whole table. |
| Fintech | `lib/fintech/factoring-orchestrator.ts` | ✅ Live (the good path) | Enforces ETA gate, four-eyes, yield guard, double-factoring lock. |
| Fintech | `lib/factoring/queue.ts` | ⚠ Live (the bad path) | **Duplicates orchestrator**, bypasses four-eyes/lock, writes different 2-line journal. |
| Fintech | `lib/fintech/hub-revenue.ts:242` | ⚠ Stub in prod | `calculateHubRevenue` hardcodes `grossAmount = 100_000`. |
| Fintech | `lib/fintech/scoring/hotel-score-engine.ts` | ⚠ Parallel | 0–1000 score, never reconciled with `risk-engine.ts` 0–100. |
| Payments | `lib/payments/{paymob,oliv,fawry,instapay}` | ✅ Live | Paymob adapter is a monolith (~870 lines) that reaches into factoring domain. |
| ETA | `lib/eta/{client,queue,validator}` | ✅ Live | DLQ real; **no re-drive endpoint**. |
| ETA | `lib/eta/{signer,canonicalizer}` | ❌ Dead | Signing never invoked. |
| AI | `lib/ai/llm.ts` | ✅ Live | The real router. Ollama→OpenRouter→Groq. |
| AI | `components/ai-assistant/prompts/` | ✅ Live | De-facto prompt source of truth. |
| AI | `lib/agents/` | ⚠ Live but **fake AI** | Returns hardcoded strings; `systemPrompt` never sent to LLM. |
| AI | `lib/intelligence/{hybrid-engine,memory-layer,sse-pulse}` | ❌ Dead | Zero importers. Memory "embeddings" padded with `Math.random()`. |
| AI | `lib/swarm/{model-router,memory,monitoring}` | ❌ Stub shims | Re-export `lib/ai/llm` + no-ops. AGENTS.md's `director.ts`/`scheduler.ts`/`agents/index.ts` don't exist. |
| AI | `services/agent0/` (Python) | ❌ Uncalled | Containerized, `AGENT0_URL` plumbed but no TS caller. Opposite fallback order (xAI→Groq→Kimi). |
| AI | `services/kimi-bridge/` (Python) | ❌ Orphan | Not in docker-compose, no importers. |
| UI | `app/(dashboard)/`, `components/ui/`, `components/dashboards/shared/` | ✅ Live | Glassmorphism implemented in `globals.css` (457 lines). |
| UI | `app/dashboard/` (4 files) | ❌ Stale | Jul 8, not wired to sidebar. |
| UI | `components/app/` (8 files) | ❌ Orphan | `role-context.tsx` removed but siblings linger. |
| UI | `app/invo/` + `components/invo/` | ⚠ Bolt-on | Stripe-palette inline, bypasses design system. Only reachable via `invo.` subdomain. |
| UI | `app/(dashboard)/admin/swarm/page.tsx` | ❌ Dead | Fetches `/api/v1/swarm/*` routes that don't exist — 404 on every action. |
| UI | `backup_frontend/` | ❌ Cruft | Only `.DS_Store` files. |
| Config | `next.config.mjs` vs `next.config.ts` | ⚠ Conflict | Next picks one by extension precedence — one is silently ignored. |
| Config | `postcss.config.js` vs `postcss.config.mjs` | ⚠ Conflict | Same. |
| Config | `next.config.mjs` has `typescript.ignoreBuildErrors: true` | ⚠ Hazard | If `.mjs` wins, type errors are silently swallowed at build. |

---

## 3. Critical Problem Areas (ranked by blast radius)

### 🔴 P0 — Security / Compliance (fix before any feature work)

| # | Issue | Location | Impact |
|---|---|---|---|
| S1 | `.env` file overwrite gated by hardcoded `"panda3011"` header password, no auth/RBAC | `app/api/v1/admin/env/route.ts`, `app/api/v1/admin/credentials/route.ts` | Full secrets compromise; arbitrary env injection. |
| S2 | Order status mutation bypasses Authority Matrix + non-transactional | `app/api/v1/orders/[id]/status/route.ts:72` | Supplier/hotel can drive order to `DELIVERED` with no approval record; G10 ETA re-validation skipped. |
| S3 | Order created `CONFIRMED` + `paymentGuaranteed:false` | `app/api/v1/financing/invoice-upload/route.ts:144-152` | Hard G10 violation. |
| S4 | `userId`/`tenantId` read from client headers with `\|\| "default"` fallback, no auth | `app/api/v1/admin/ai-assistant/route.ts:11-12`, `app/api/v1/admin/subscription/route.ts:8,37` | Tenant impersonation; AI-credit drain; subscription billing fraud. |
| S5 | `demo-bypass` route mutates tenant status, seeds orders + 5M EGP credit facility, no RBAC, no idempotency, not wrapped in `apiRoute` | `app/api/onboarding/demo-bypass/route.ts:86-226` | Any authenticated user in tenant triggers destructive demo seeding. |
| S6 | Cross-tenant `prisma.X.count()` with **no auth at all** | `app/api/v1/admin/analytics/route.ts:14-19` | Platform-wide counts of users/orders/suppliers/hotels exposed unauthenticated. |
| S7 | Inventory webhook: IP-allowlist only, **no signature verification**, no idempotency | `app/api/webhooks/inventory/generic/route.ts` | Spoofed payload from whitelisted IP overwrites `stockQuantity`/`unitPrice`. |
| S8 | Oliv webhook: signature verification **commented out** ("Phase 2") | `app/api/webhooks/payments/oliv/route.ts:27-31` | Live unauthenticated endpoint writes audit entries. |
| S9 | Rate limiter fails **open** on Redis error (comment lies "fail closed") | `lib/security/rate-limiter.ts:107-116` | Redis outage → no rate limiting anywhere. |
| S10 | Edge middleware `verifySession` skips the Redis token blacklist | `middleware.ts:131-144` vs `lib/session.ts:30-41` | Revoked tokens still pass the edge until JWT exp. |
| S11 | Two dev-fallback JWT secrets (`"dev-secret-change-in-production"` vs `"dev-secret-do-not-use-in-production"`) | `middleware.ts:28` vs `lib/session.ts:22` | In dev, edge can verify tokens Node signed with a different secret. |
| S12 | ETA signing never invoked → `validateForFactoring` rejects every invoice | `lib/eta/signer.ts`, `canonicalizer.ts` (dead) | Factoring gate is either deadlocked or being bypassed. |
| S13 | `audit()` swallows `appendAuditEntry` failures (`console.error` only) | `lib/api-utils.ts:192-196` | Compliance-critical writes can fail silently; mutation still succeeds. |
| S14 | Hash-chain append is non-atomic (read prev → insert "pending" → update hash) | `lib/audit/tamper-proof.ts:87-132` | Concurrent appends fork the chain. |
| S15 | `exportAuditLog` has no `tenantId` filter | `lib/audit/tamper-proof.ts:222-225` | Cross-tenant audit export. |

### 🟠 P1 — Architectural / Correctness

| # | Issue | Location |
|---|---|---|
| A1 | Six fee calculators with divergent rates (1.5/2/2.5/3% + 100k placeholder) | `lib/fintech/{hub-revenue,factoring-orchestrator}.ts`, `lib/factoring/queue.ts:123`, `lib/economics.ts`, `app/api/v1/financing/invoice-upload/route.ts:199`, `lib/fintech/anti-bypass/layer2-webhook-listener.ts:233` |
| A2 | Two risk engines (0–100 vs 0–1000), never reconciled | `lib/fintech/risk-engine.ts:118` vs `lib/fintech/scoring/hotel-score-engine.ts:83` |
| A3 | `lib/factoring/queue.ts` duplicates `lib/fintech/factoring-orchestrator.ts`, bypasses four-eyes/lock/yield-guard | — |
| A4 | Two ledger models (`JournalEntry` vs `LedgerEntry`); `recordSettlementDisbursalJournal` & `recordCompensatingJournal` have **zero callers**; single-invoice orchestrator writes no journal | `lib/fintech/accounting-ledger.ts`, `lib/factoring/queue.ts:205`, `lib/fintech/anti-bypass/layer2-webhook-listener.ts:265` |
| A5 | "Platform holds no cash" contradicted by Paymob escrow module, ledger accounts 1010/1020, `ESCROW_CUSTODY` fallback, layer-2 fee deduction | `lib/payments/paymob/index.ts:588-796`, `lib/fintech/accounting-ledger.ts:83,206,212`, `lib/fintech/factoring-orchestrator.ts:893` |
| A6 | Three LLM routers with different cascade orders; `preferredModel:"xai"` silently ignored | `lib/ai/llm.ts:236`, `services/agent0/main.py:127`, `app/api/v1/ai/assistant/route.ts:182` |
| A7 | AGENTS.md "Swarm v3" describes files/queues/agents that don't exist | AGENTS.md §"Key Files" vs `lib/swarm/` (3 stubs) |
| A8 | `admin/swarm` dashboard fetches `/api/v1/swarm/*` — no such routes | `app/(dashboard)/admin/swarm/page.tsx:67-150` |
| A9 | `npm run swarm` & `scripts/test-ollama.ts` broken (import non-existent modules/exports) | `scripts/swarm-dev.ts:16`, `scripts/test-ollama.ts:7` |
| A10 | Duplicate `next.config` + duplicate `postcss.config` (extension-precedence ambiguity) + `typescript.ignoreBuildErrors:true` | root |
| A11 | `app/dashboard/` (4 stale files), `components/app/` (8 orphans), `components/ui.tsx`, `components/theme-provider.tsx`, `components/theme-toggle.tsx`, `backup_frontend/`, `src/scripts/` all dead | various |
| A12 | `app/invo/` is a parallel app with inline Stripe palette, bypassing design system (G7) | `app/invo/layout.tsx`, `components/invo/kpi-card.tsx` |
| A13 | `@ts-nocheck` on ETA/compliance routes + `ignoreBuildErrors` — type safety off where it matters most | `app/api/v1/eta/**`, `app/api/v1/compliance/**`, `app/api/webhooks/**` |
| A14 | AGENTS.md claims `@/* → ./src/*`; actual tsconfig is `@/* → ./*`. `src/app/` doesn't exist. | `tsconfig.json:24`, AGENTS.md §179 |
| A15 | 286 raw `prisma.X.*` calls in routes; canonical `tenantWhereClause` used in only 4. Admin routes intentionally cross-tenant but rely solely on `requirePermission`. | `lib/tenant/scope.ts` + audit |

### 🟡 P2 — Performance / Scalability

| # | Issue | Location |
|---|---|---|
| P1 | `verifyAuditChain` loads entire `AuditLog` table into memory, no pagination | `lib/audit/tamper-proof.ts:154` |
| P2 | `hasPermission` does a Prisma round-trip per request, no per-request cache (unlike `getCurrentUser` which is `cache()`d) | `lib/auth/rbac.ts:30-33` |
| P3 | `rbac.ts` user lookup has no `tenantId` filter | `lib/auth/rbac.ts:30-33` |
| P4 | Memory rate-limit fallback is per-process (each Next.js worker has its own counter) | `lib/security/api-guard.ts`, `lib/redis.ts` |
| P5 | Prisma `Pool` max=10 default — fine for dev, will bottleneck under load on Vercel serverless (each function instance = own pool) | `lib/prisma.ts:13` |
| P6 | Three near-equivalent stat primitives (`StatCard`/`MetricTile`/`KPICard`) each with hardcoded colors → no token reuse, larger CSS footprint | `components/shared/stat-card.tsx`, `components/dashboards/shared/metric-tile.tsx`, `components/invo/kpi-card.tsx` |
| P7 | `app/(marketing)/page.client.tsx` — heavy client bundle (GSAP, framer-motion, recharts, react-google-maps) on the marketing landing | `package.json` deps |

### 🟢 P3 — Maintainability

| # | Issue |
|---|---|
| M1 | 10 root-level markdown docs (AUDIT_REPORT, CLAUDE, COO_STRATEGY, GEMINI, GOOGLE_AI_STUDIO_PROMPT, HOSTINGER-DEPLOY, PROJECT_STATE, ROADMAP, ZOHO_EMAIL_SETUP, AGENTS) — fragmented source of truth. |
| M2 | `.claude/`, `.kimi/`, `.zcode/` AI-tool configs committed alongside each other. |
| M3 | Root-level `schema-v6-*.sql` files (14 files) outside Prisma migrations — drift risk vs `prisma/migrations/`. |
| M4 | `extracted_roadmap/`, `front-end/`, `workspace/`, `tmp/`, `graphify-out/`, `research/`, `templates/` — clutter in repo root. |
| M5 | 4 separate prompt locations, no single source of truth. |
| M6 | INVO naming collision: `lib/invo/` is logistics, `lib/fintech/anti-bypass/index.ts:FactoringRequest` collides with Prisma `FactoringRequest` model. |

---

## 4. Refactoring Strategies

The platform is too large to refactor in one pass. Sequence by blast radius.

### Phase 0 — Stop the bleeding (1–2 days, no behavior change)
1. **Pick one config.** Delete `next.config.mjs`, keep `next.config.ts`. Delete `postcss.config.mjs`, keep `postcss.config.js` (has autoprefixer). **Remove `typescript.ignoreBuildErrors: true`** and fix the resulting errors (or scope `@ts-nocheck` removal to ETA routes only).
2. **Fix S1**: replace the `"panda3011"` header password in `admin/env` + `admin/credentials` with `authenticate` + `requirePermission("admin:manage_platform")`. (Or delete the routes — `.env` should not be writable over HTTP at all.)
3. **Fix S4**: `admin/ai-assistant` + `admin/subscription` — replace `request.headers.get("x-tenant-id") || "default"` with `authenticate(request)`. One-line each.
4. **Fix S6**: wrap `admin/analytics` in `apiRoute` + `authenticate` + `requirePermission("admin:manage_platform")`.
5. **Fix S9**: change `rate-limiter.ts:114` to fail **closed** (`allowed: false`) on unknown errors, fix the comment.
6. **Fix S10/S11**: have `middleware.ts` import `getJwtSecret()` from `lib/session.ts` (extract to a shared edge-safe module) and add a blacklist check (Redis from edge, or short-TTL revocation JWT claim).
7. **Fix S13**: make `audit()` throw on `appendAuditEntry` failure for mutations (wrap mutation + audit in a transaction; see code below).

### Phase 1 — Close the G10 / Authority-Matrix holes (3–5 days)
1. **Fix S2/S3**: route `orders/[id]/status` PATCH through `atomicStatusUpdate` (already exists in `lib/auth/state-machine.ts`) and add an `evaluateAuthority` re-check; delete the hand-rolled gate. Fix `invoice-upload` to create orders as `DRAFT` (never `CONFIRMED`).
2. **Consolidate factoring**: delete `lib/factoring/queue.ts`'s FUND/SETTLE logic; route everything through `lib/fintech/factoring-orchestrator.ts`. Keep the queue as a thin BullMQ producer that calls `orchestrateFactoring`.
3. **One fee calculator**: pick `lib/fintech/hub-revenue.ts` as SoT, delete the inline calcs in `factoring-orchestrator.ts:781-883`, `queue.ts:123`, `invoice-upload:199`, `layer2:233`, and `lib/economics.ts` (or fold `computePgo` into hub-revenue if PGO is a real distinct model). Fix the `grossAmount = 100_000` placeholder.
4. **One risk engine**: pick `assessRisk` (0–100, used by orchestrator). Either delete `HotelScoreEngine` or make it a thin wrapper that normalizes 0–1000 → 0–100 and delegates.
5. **One ledger**: delete `LedgerEntry` model usage; route all monetary writes through `accounting-ledger.ts`. Implement `recordSettlementDisbursalJournal` / `recordCompensatingJournal` at their call sites or delete them. Add a symmetric debit/credit assertion test.
6. **Wire ETA signing**: call `signEtaDocument` in `lib/eta/queue.ts` worker before `submitInvoice`; populate `Invoice.digitalSignature`. Delete the duplicate `canonicalizer.ts` (keep `signer.ts`'s canonicalization) — or vice versa, but pick one.

### Phase 2 — Kill the parallel AI systems (2–3 days)
1. Delete `lib/intelligence/*` (zero importers). Delete `services/kimi-bridge/` (orphan). Either delete `services/agent0/` or wire `AGENT0_URL` to a TS client — currently it's plumbed but uncalled.
2. Either restore `app/api/v1/swarm/*` routes or delete `app/(dashboard)/admin/swarm/` + `components/swarm/*`. The dashboard 404s on every action today.
3. Delete `scripts/swarm-dev.ts` + `scripts/test-ollama.ts` (broken) or fix them.
4. **Rewrite AGENTS.md §"Swarm LLM Architecture"** to match reality: the router is `lib/ai/llm.ts`, fallback is Ollama→OpenRouter→Groq, Kimi/xAI are not implemented, `preferredModel` is ignored. Either implement `preferredModel` or remove it from callers.
5. Consolidate prompts: `components/ai-assistant/prompts/` is the SoT — delete `lib/ai/system-prompt.ts` (orphaned `BASE_SYSTEM_PROMPT`), move the inline prompts in `admin/ai-assistant` and `credit-lines/[id]/analyze` into the prompts dir.
6. Decide if `lib/agents/` is real: if its canned outputs are intentional (demo tooling), label it clearly; if not, wire it to `executeLLM` or delete.

### Phase 3 — Delete dead UI / unify design system (2–3 days)
1. Delete `app/dashboard/` (4 files), `components/app/` (8 orphans), `components/ui.tsx`, `components/theme-provider.tsx`, `components/theme-toggle.tsx`, `backup_frontend/`, `src/scripts/`. Repoint the two `onboarding/*` redirects and `components/app/topbar.tsx:12` (but topbar is in the dir being deleted).
2. Decide INVO's fate: either (a) formally declare it a separate design surface and document why, or (b) route `app/invo/layout.tsx` + `components/invo/*` through `globals.css` tokens. The current state — INVO layout is light Stripe, INVO KPI cards are dark — is internally inconsistent.
3. Consolidate the three stat primitives into one `components/ui/stat-card.tsx` with variants. Fix `components/ui/index.ts` to actually export `StatusPill` (latent build hazard).
4. Fix `tsconfig`/AGENTS.md mismatch: document `@/* → ./*` (root), not `./src/*`.

### Phase 4 — Tenant scoping + RBAC hygiene (ongoing)
1. Add a **lint rule / codemod** that flags `prisma.X.findMany({ where: {` without a `tenantId` key (except in `lib/admin/*`).
2. Migrate the 286 inline `{ tenantId: auth.tenantId }` calls to `tenantWhereClause(ctx, …)`. Centralizes future changes (e.g. adding RLS session vars).
3. Add `requirePermission` to the ~22 routes missing RBAC (mostly `ai/*`, `consent/*`, `fintech/*`, `shipping/*`, `user/*`).
4. Add `requireIdempotencyKey` to every monetary mutation: `payments/{create-intent,deposit,escrow,fawry-charge}`, `factoring/credit-lines`, `invo/{orders,invoices,factoring,settlement}`, `vat/issue`.
5. Migrate the 23 legacy `app/api/*` routes (outside `v1/`) to `v1/` equivalents or delete. They're live attack surface today.

### Phase 5 — Repo hygiene (1 day)
1. Move root markdown into `docs/` (keep AGENTS.md, README.md at root).
2. Delete `schema-v6-*.sql` (14 files) — they're either already migrated or stale; either way they don't belong at repo root.
3. `.gitignore` `backup_frontend/`, `tmp/`, `graphify-out/`, `extracted_roadmap/`, `workspace/`, `test-results/`.
4. Add a test framework (AGENTS.md says none exists; `vitest` is actually in devDeps + `vitest.config.ts` exists — update AGENTS.md).

---

## 5. Improved Production-Grade Code (drop-in patterns)

These illustrate the target patterns. Each is small, behavior-preserving, and addresses a P0/P1 finding.

### 5.1 Edge-safe shared JWT secret (fixes S10, S11)

```ts
// lib/auth/jwt-secret.ts — single source of truth, edge-safe (no `cookies`/`next/headers`)
const FALLBACK = "dev-secret-do-not-use-in-production";

export function getJwtSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "FATAL: SESSION_SECRET is required in production. " +
        "Generate with: openssl rand -ex 32"
      );
    }
    console.warn("[Auth] Using dev fallback for SESSION_SECRET — do NOT deploy.");
  }
  return new TextEncoder().encode(secret || FALLBACK);
}
```

Then `lib/session.ts` and `middleware.ts` both `import { getJwtSecret } from "@/lib/auth/jwt-secret"`. Delete the inline copies.

### 5.2 Transactional, audit-coupled mutation (fixes S2, S13, A4)

```ts
// lib/orders/mutate-status.ts
import { prisma } from "@/lib/prisma";
import { atomicStatusUpdate, validateStatusTransition } from "@/lib/auth/state-machine";
import { evaluateAuthority } from "@/lib/auth/authority-matrix";
import type { AuthContext } from "@/lib/api-utils";
import { ApiError } from "@/lib/api-utils";
import { appendAuditEntry } from "@/lib/audit/tamper-proof";

interface TransitionInput {
  ctx: AuthContext;
  orderId: string;
  nextStatus: OrderStatus;
  reason?: string;
}

export async function transitionOrderStatus({
  ctx, orderId, nextStatus, reason,
}: TransitionInput): Promise<{ order: Order; approval: OrderApproval }> {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { items: true, hotel: true, supplier: true },
    });

    if (order.tenantId !== ctx.tenantId) {
      throw new ApiError("Not found", 404); // never leak cross-tenant existence
    }

    validateStatusTransition(order.status, nextStatus);

    // Re-evaluate authority on every gate-crossing transition.
    const decision = await evaluateAuthority(order.id, ctx, { tx });
    if (decision.action === "REJECT") {
      throw new ApiError(`Authority Matrix rejected: ${decision.reason}`, 403);
    }

    // G10: payment guarantee is enforced inside atomicStatusUpdate.
    const updated = await atomicStatusUpdate(tx, order.id, nextStatus, ctx.userId);

    // Audit MUST succeed for the mutation to commit.
    await appendAuditEntry({
      entityType: "Order",
      entityId: order.id,
      action: `STATUS_${nextStatus}`,
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      beforeState: { status: order.status, paymentGuaranteed: order.paymentGuaranteed },
      afterState:  { status: updated.status, paymentGuaranteed: updated.paymentGuaranteed },
      reason: reason ?? null,
    }, tx); // pass tx so audit is in the SAME transaction

    return { order: updated, approval: decision.approval };
  }, { isolationLevel: "Serializable" });
}
```

Key properties: (1) tenant check throws 404 (no existence leak), (2) Authority Matrix re-evaluated, (3) `atomicStatusUpdate` does the `SELECT … FOR UPDATE`-style update, (4) audit is **in the same transaction** — if the chain append fails, the whole mutation rolls back.

### 5.3 Atomic hash-chain append (fixes S14)

```ts
// lib/audit/tamper-proof.ts (revised append)
export async function appendAuditEntry(
  input: AuditEntryInput,
  tx: Prisma.TransactionClient = prisma
): Promise<AuditEntry> {
  return tx.$executeRaw`
    WITH prev AS (
      SELECT hash AS prev_hash FROM "AuditLog"
      WHERE "tenantId" = ${input.tenantId}
      ORDER BY "createdAt" DESC, id DESC
      LIMIT 1
      FOR UPDATE
    )
    INSERT INTO "AuditLog" (id, "entityType", "entityId", action, "actorId",
                             "actorRole", "beforeState", "afterState",
                             "ipAddress", "userAgent", "tenantId",
                             "previousHash", hash, "createdAt")
    SELECT
      gen_random_uuid(),
      ${input.entityType}, ${input.entityId}, ${input.action},
      ${input.actorId ?? null}, ${input.actorRole ?? null},
      ${input.beforeState ?? null}::jsonb,
      ${input.afterState ?? null}::jsonb,
      ${input.ipAddress ?? null}, ${input.userAgent ?? null},
      ${input.tenantId},
      COALESCE((SELECT prev_hash FROM prev), 'genesis'),
      'pending',
      NOW()
    RETURNING id
  `.then(({ rows }) => rows[0].id)
    .then((id) => computeAndSetHash(tx, id));
}
```

The `FOR UPDATE` on the previous-row CTE serializes concurrent appends per tenant, preventing chain forks.

### 5.4 Fail-closed rate limiter (fixes S9)

```ts
// lib/security/rate-limiter.ts
} catch (err) {
  // Fail CLOSED on unknown errors — a Redis outage must not disable rate limiting.
  if (err instanceof RateLimiterRes) throw err;
  logSecurityEvent("rate_limiter_error", { error: String(err) });
  return { allowed: false, remaining: 0, resetAt: Math.floor(Date.now() / 1000) + windowSeconds };
}
```

### 5.5 One canonical fee calculator (fixes A1)

```ts
// lib/fintech/pricing.ts — single source of truth
export const PLATFORM_FEE_BPS: Record<FeeTier, number> = {
  TIER_1: 250, // 2.5% — small suppliers
  TIER_2: 200, // 2.0%
  TIER_3: 150, // 1.5% — strategic suppliers
};

export interface FeeBreakdown {
  grossAmount: number;          // piastres
  platformFee: number;          // hub revenue, paid FIRST
  partnerFee: number;           // factoring partner discount
  netDisbursement: number;      // supplier receives this
  hubPaidFirst: true;           // compile-time invariant marker
}

export function calculateFees(
  grossAmount: number,
  tier: FeeTier,
  partnerDiscountBps: number
): FeeBreakdown {
  if (grossAmount <= 0) throw new Error("grossAmount must be positive");
  const platformFee = Math.round(grossAmount * PLATFORM_FEE_BPS[tier] / 10_000);
  const partnerFee  = Math.round(grossAmount * partnerDiscountBps / 10_000);
  const netDisbursement = grossAmount - platformFee - partnerFee;
  if (netDisbursement <= 0) {
    throw new Error(`Fees exceed gross — platformFee=${platformFee} partnerFee=${partnerFee}`);
  }
  return { grossAmount, platformFee, partnerFee, netDisbursement, hubPaidFirst: true };
}
```

Every other fee calc site imports `calculateFees`. Delete the inline copies.

### 5.6 One LLM router entry point (fixes A6)

```ts
// lib/ai/llm.ts — already exists; enforce as the only entry point
export type Provider = "ollama" | "openrouter" | "groq";

export async function executeLLM(
  prompt: string,
  opts: RouterOptions = {}
): Promise<{ text: string; provider: Provider; creditsCost: number }> {
  // Ollama → OpenRouter → Groq. Each catch logs + increments a circuit breaker.
  for (const fn of [callOllama, callOpenRouter, callGroq]) {
    try {
      return await fn(prompt, opts);
    } catch (err) {
      logLLMFailure(fn.name, err);
    }
  }
  throw new ApiError("AI service unavailable (all providers failed)", 503);
}
```

Key change: **throw** instead of returning `"AI service temporarily unavailable."` as a string.

### 5.7 Centralized monetary route wrapper (fixes idempotency gaps)

```ts
// lib/api-utils.ts — add a monetary variant of apiRoute
export function monetaryRoute(
  handler: (req: NextRequest, ctx: AuthContext, idemKey: string) => Promise<NextResponse>,
  opts: { permission: string; action: string }
) {
  return apiRoute(async (req, routeCtx) => {
    const auth = await authenticate(req);
    await requirePermission(auth, opts.permission);
    const idemKey = await requireIdempotencyKey(req, {
      userId: auth.userId,
      action: opts.action,
      amount: 0,
    });
    try {
      const res = await handler(req, auth, idemKey);
      completeIdempotency(idemKey, JSON.stringify({ ok: true, status: res.status }));
      return res;
    } catch (err) {
      await releaseIdempotencyKey(idemKey);
      throw err;
    }
  }, { rateLimit: "financial" });
}
```

Then `payments/deposit`, `payments/escrow`, `payments/fawry-charge`, `payments/create-intent`, `factoring/credit-lines`, `invo/{orders,invoices,factoring,settlement}`, `vat/issue` all become one-liners that can't forget idempotency.

---

## 6. What I Would NOT Change

- **The Prisma schema (75+ models)** is large but coherent given the four-sided marketplace scope. Don't split it prematurely; the duplication is in *code*, not the schema.
- **`lib/api-utils.ts`** is well-designed — extend it, don't rewrite it.
- **The edge middleware** is mostly right; just fix the secret + blacklist gaps.
- **`components/ui/` + `globals.css`** Glassmorphism implementation — keep, just consolidate the stat primitives and fix the `StatusPill` barrel export.
- **The role-prompt library** in `components/ai-assistant/prompts/` — keep as SoT, delete the others.

---

## 7. Suggested Sequencing for Actual Implementation

| Sprint | Scope | Effort | Risk |
|---|---|---|---|
| 0 | Config dedup + S1/S4/S6/S9/S10/S11 security fixes | 2 days | Low — surgical |
| 1 | S2/S3 + factoring consolidation (A3) + fee calculator (A1) | 5 days | Medium — touches money paths |
| 2 | ETA signing (S12) + audit atomicity (S13/S14) + ledger consolidation (A4) | 4 days | Medium — compliance-critical, needs tests |
| 3 | AI cleanup (delete `lib/intelligence`, `services/kimi-bridge`, `admin/swarm`; rewrite AGENTS.md) | 2 days | Low — dead code |
| 4 | Dead UI deletion + design-system consolidation | 2 days | Low |
| 5 | Tenant-scope codemod + RBAC/idempotency gap-fill | Ongoing | Low per-change, high volume |

---

**Bottom line:** The codebase has good bones (solid Prisma schema, well-designed `api-utils` wrapper, real Authority Matrix engine, real ETA DLQ, real hash-chain audit) buried under **six layers of duplication** (configs, app trees, RBAC checks, fee calculators, risk engines, AI systems) and **fifteen silent-failure patterns** that hide security/compliance breaches. The P0 security fixes (§5.1, §5.4) are surgical and can ship in a day; the P1 architectural consolidation (§5.3, §5.5, §5.6, §5.7) is a 2–3 week effort that pays for itself in maintainability and audit-readiness.
