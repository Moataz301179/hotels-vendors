# Hotels Vendors Audit Report — 2026-05-10

## Executive Summary

| Metric | Count |
|--------|-------|
| **Total Checks** | 121 |
| **PASS** | 62 |
| **FAIL** | 10 |
| **PARTIAL** | 25 |
| **PENDING** | 24 |
| **BLOCKING Issues** | 5 |
| **CRITICAL Issues** | 3 |
| **HIGH Issues** | 8 |

**Overall Assessment:** The codebase shows strong architectural foundations — comprehensive Prisma schema, functioning Authority Matrix, BullMQ queues with retry logic, and a mature glassmorphism design system. However, **5 BLOCKING issues** must be resolved before any production deployment: a TypeScript compilation failure, an ETA UI route violating the invisibility guardrail, missing payment guarantee enforcement in the order worker, missing inventory webhook infrastructure, and 13 v1 API routes that skip RBAC enforcement.

---

## Category: Design / Frontend

### Visual Hierarchy

| Check ID | Status | File | Finding |
|---|---|---|---|
| DES-001 | **PARTIAL** | `app/globals.css` | Brand color inconsistent: globals.css defines `--brand-red: #022349` (dark blue) and `--crimson-base: #022349`, but marketing pages use inline `#e11d48` (rose/red). The design system and pages are out of sync. |
| DES-002 | **PARTIAL** | `app/(dashboard)/*` | Hotel and supplier dashboards use glassmorphism (`bg-white/[0.02]`, `border-white/[0.06]`), but admin dashboard uses solid `bg-[#0f0f0f]` without backdrop blur. |
| DES-003 | **PASS** | `app/globals.css` | No neon colors. Gradients are used only in decorative aurora/background effects, not as primary backgrounds. |
| DES-004 | **PENDING** | `app/*` | Cannot verify full heading hierarchy without runtime DOM inspection. Pages use semantic `<h1>`–`<h3>` in marketing sections. |
| DES-005 | **PASS** | `app/globals.css` | White text `#f0f0f0` on dark canvas `#050505` yields ~18.7:1 contrast ratio, well above WCAG 2.2 AA 4.5:1. |

### Responsive Design

| Check ID | Status | File | Finding |
|---|---|---|---|
| DES-006 | **PENDING** | `app/*` | Cannot verify mobile rendering without runtime browser testing. Code uses responsive Tailwind classes (`md:`, `lg:`). |
| DES-007 | **PENDING** | `app/*` | Cannot verify tablet rendering without runtime testing. |
| DES-008 | **PENDING** | `app/*` | Cannot verify horizontal scroll behavior without runtime testing. Dashboard tables use `overflow-x-auto` where needed. |

### Typography & Spacing

| Check ID | Status | File | Finding |
|---|---|---|---|
| DES-009 | **PARTIAL** | `app/globals.css` | Font scale exists (11px labels → 64px headlines) but is not enforced via CSS custom properties; pages use ad-hoc pixel values. |
| DES-010 | **PARTIAL** | `app/globals.css` | Spacing tokens exist in `@theme inline` but many components use arbitrary Tailwind values (`p-6`, `gap-4`) rather than a strict 4px grid system. |

### Animation

| Check ID | Status | File | Finding |
|---|---|---|---|
| DES-011 | **PENDING** | `app/*` | Cannot measure CLS without runtime Core Web Vitals testing. Framer Motion animations are present. |

---

## Category: Structure / Organization

### Directory Enforcement

| Check ID | Status | File | Finding |
|---|---|---|---|
| STR-001 | **PASS** | `app/*` | All pages live in `(marketing)`, `(auth)`, or `(dashboard)/[role]`. No violations found. |
| STR-002 | **PARTIAL** | `app/api/*` | v1 routes exist and are actively used, but **56 legacy flat routes** (`app/api/orders/*`, `app/api/invoices/*`, etc.) remain active and un-deprecated. They should be removed or migrated. |
| STR-003 | **PASS** | `app/(app)/`, `src/app/` | Neither directory exists. Clean. |
| STR-004 | **PASS** | `components/ui/*` | All UI primitives (button, card, input, modal, table, etc.) live in `components/ui/`. |
| STR-005 | **PASS** | `lib/*` | Business logic is properly organized in `lib/` subdirectories: `auth/`, `eta/`, `fintech/`, `orders/`, `queues/`, etc. |

### File Naming, Imports, Component Purity, Dead Code

| Check ID | Status | File | Finding |
|---|---|---|---|
| STR-006 | **PARTIAL** | `*` | Most files use kebab-case (e.g., `authority-matrix.ts`) and components use PascalCase. Some inconsistencies exist (e.g., `lib/seed-egyptian-market.ts` uses camelCase in filename). |
| STR-007 | **PASS** | `*` | No deeply nested relative imports above 2 levels observed in reviewed files. Aliases (`@/`) are used consistently. |
| STR-008 | **PASS** | `components/ui/*` | Button, Card, Input, Modal, Table are pure presentational — accept data via props, no business logic. Modal has internal DOM side effects but is still presentational. |
| STR-009 | **PARTIAL** | `*` | `npm run lint` reports 254 warnings including many unused variables (e.g., `ProductStatus`, `OrderStatus` in `app/(dashboard)/hotel/page.tsx`). Not blocking but indicates cleanup needed. |
| STR-010 | **PARTIAL** | `lib/*`, `app/api/*` | `console.log` / `console.error` found in seed scripts and `lib/api-utils.ts` (line 152, audit failure fallback). `lib/notifications/email.ts` (line 46) logs email fallback. Queue workers lack structured logging. |

---

## Category: Completeness

### Marketing Pages

| Check ID | Status | File | Finding |
|---|---|---|---|
| CMP-001 | **PASS** | `app/(marketing)/page.tsx` | Homepage has hero, stats bar, trusted-by, capabilities grid, 4-step process, and CTA footer. |
| CMP-002 | **PASS** | `app/(marketing)/about/page.tsx` | About page has mission hero, stats, timeline/milestones, team section, values, partners, and CTA. |
| CMP-003 | **PASS** | `app/(marketing)/pricing/page.tsx` | Pricing page has 3 tiers (Starter/Growth/Enterprise), feature comparison table, and FAQ accordion. |
| CMP-004 | **PASS** | `app/(marketing)/solutions/page.tsx` | Solutions page has 4 solution cards, 4-step flow, 2 case studies, capability highlights, and dual CTAs. |

### Auth Pages

| Check ID | Status | File | Finding |
|---|---|---|---|
| CMP-005 | **PASS** | `app/(auth)/login/page.tsx` | Login has email, password, show/hide toggle, remember me, forgot-password link, and demo credential buttons. |
| CMP-006 | **PASS** | `app/(auth)/register/page.tsx` | Register has 4-step wizard: account credentials, profile/role selector, business details (company, taxId, city, governorate), and review/confirm with terms text. |

### Dashboard Pages

| Check ID | Status | File | Finding |
|---|---|---|---|
| CMP-007 | **PASS** | `app/(dashboard)/hotel/*` | Hotel dashboard exists with catalog, orders, invoices, accounting, and properties sub-routes. Main page shows spend stats, recent orders, inventory alerts, and quick actions. |
| CMP-008 | **PASS** | `app/(dashboard)/supplier/*` | Supplier dashboard exists with products, orders, and analytics sub-routes. Main page shows revenue, pending orders, catalog, and pipeline. |
| CMP-009 | **PASS** | `app/(dashboard)/admin/*` | Admin dashboard exists with CMS editor, swarm health, settings, and supplier review sub-routes. Main page shows quick stats and module links. |

### API Coverage

| Check ID | Status | File | Finding |
|---|---|---|---|
| CMP-010 | **PARTIAL** | `app/api/*` | Most frontend features have corresponding API routes in v1, but some legacy flat routes duplicate v1 functionality. Coverage gaps: no dedicated `accounting/journal` API in v1. |

---

## Category: Operation / DevOps

### Health Checks

| Check ID | Status | File | Finding |
|---|---|---|---|
| OPS-001 | **PASS** | `docker-compose.swarm.yml:46-51` | App container healthcheck hits `http://localhost:3000/api/health`. Correct. |
| OPS-002 | **PASS** | `docker-compose.swarm.yml:66-70` | Postgres healthcheck uses `pg_isready`. Correct. |
| OPS-003 | **PASS** | `docker-compose.swarm.yml:83-87` | Redis healthcheck uses `redis-cli ping`. Correct. |

### Database & Background Jobs

| Check ID | Status | File | Finding |
|---|---|---|---|
| OPS-004 | **PENDING** | `.github/workflows/deploy-hostinger.yml` | CI/CD runs `docker compose ... npx prisma migrate deploy`. Cannot verify runtime success without deployment. |
| OPS-005 | **PASS** | `prisma/migrations/` | 8 migrations present with lock file. No unapplied status visible in code. |
| OPS-006 | **PARTIAL** | `lib/*/queue.ts` | All 4 queues (`etaQueue`, `orderQueue`, `factoringQueue`, `emailQueue`) are exported with `create*Worker()` factory functions, but **workers are never instantiated/started** in the codebase. No `worker.run()` or equivalent bootstrap found. |
| OPS-007 | **PARTIAL** | `lib/queues/dead-letter.ts` | `moveToDeadLetter()` persists failed jobs to Prisma (`swarmJob` model), but it is **never called** by any queue worker on failure. DLQ is defined but not wired. |
| OPS-008 | **PASS** | `lib/eta/queue.ts:42` | ETA queue uses `backoff: { type: "exponential", delay: 10000 }`. Correct. |

### Logging

| Check ID | Status | File | Finding |
|---|---|---|---|
| OPS-009 | **PARTIAL** | `app/api/*` | Pino logger is configured in `lib/logger.ts` and used in `app/api/health/route.ts`, but most v1 API routes do not use it — they rely on the `apiRoute` wrapper which does not inject logging. |
| OPS-010 | **FAIL** | `lib/logger.ts` | Error responses from `handleApiError()` do **not** include `tenantId`, `userId`, or `timestamp` in the JSON body. The `createRequestLogger` helper exists but is unused in API routes. |

---

## Category: Feasibility / Fintech & ETA Compliance

### Payment Gateway

| Check ID | Status | File | Finding |
|---|---|---|---|
| FSB-001 | **PARTIAL** | `app/api/invoices/pay/route.ts` | File exists in legacy flat routes but was not reviewed in depth. The `lib/fintech/hub-revenue.ts` calculates fees but does not auto-create `JournalEntry` records. No evidence of double-entry auto-posting on all payments. |
| FSB-002 | **FAIL** | `lib/orders/queue.ts:89-97` | `CONFIRM_ORDER` action checks `order.status !== "APPROVED"` but **does not verify `order.paymentGuaranteed === true`** before transitioning to `CONFIRMED`. Violates AGENTS.md G10 absolute rule. |

### Factoring

| Check ID | Status | File | Finding |
|---|---|---|---|
| FSB-003 | **PASS** | `lib/eta/validator.ts:33-142` | `validateForFactoring()` enforces ETA UUID presence, format, status (`ACCEPTED`/`VALIDATED`), digital signature, amount match, and tax ID match before allowing factoring. |
| FSB-004 | **PASS** | `lib/factoring/queue.ts:163-194` | `FUND` action creates `CreditTransaction` records for `FACTORING_ADVANCE`, `FACTORING_COLLECTION`, and `ADJUSTMENT`. |
| FSB-005 | **PASS** | `lib/fintech/hub-revenue.ts:155-156` | `calculateHubRevenue()` deducts `netPlatformFee` before `factoringFee`: `grossDisbursementBeforeFees - netPlatformFee - factoringFee`. Hub is paid first. |

### ETA Compliance

| Check ID | Status | File | Finding |
|---|---|---|---|
| FSB-006 | **PARTIAL** | `lib/eta/*` | ETA submission API exists (`etaClient.submitInvoice`), but there is **no actual digital signing implementation** — the client builds and POSTs a JSON payload. The `digitalSignature` field on `Invoice` is never populated by the submission flow. |
| FSB-007 | **FAIL** | `lib/eta/queue.ts` | Failed ETA jobs are configured with `removeOnFail: { count: 50 }`, which deletes them after 50 attempts. They are **not moved to the dead-letter queue** (`etaDeadLetterQueue` is created but never used as a destination). |
| FSB-008 | **FAIL** | `app/eta-demo/page.tsx` | **UI route explicitly references ETA internals**: simulates digital signing, generates fake ETA UUIDs, displays "Submitting to Egyptian Tax Authority", and shows ETA API response logs. Direct violation of AGENTS.md G4 (ETA Bridge is invisible — ZERO UI routes). |

---

## Category: Existence / Schema & API Routes

### Prisma Models

| Check ID | Status | File | Finding |
|---|---|---|---|
| EXS-001 | **PASS** | `prisma/schema.prisma:18-58` | `Tenant` model exists with `id`, `name`, `slug`, `type`, `status`, `taxId`, and full relation graph. |
| EXS-002 | **PASS** | `prisma/schema.prisma:211-257` | `User` model exists with `roleId`, `tenantId`, `platformRole`, `passwordHash`, and hotel/supplier/factoring relations. |
| EXS-003 | **PASS** | `prisma/schema.prisma:441-498` | `Order` model exists with full state machine (`DRAFT` → `DELIVERED`), `paymentGuaranteed`, `paymentGuaranteeMethod`, and approval relations. |
| EXS-004 | **PASS** | `prisma/schema.prisma:561-612` | `Invoice` model exists with `etaUuid`, `etaStatus`, `digitalSignature`, `factoringStatus`, and `factoringCompanyId`. |
| EXS-005 | **PASS** | `prisma/schema.prisma:1417-1440`, `1096-1120`, `977-1008` | `Payment`, `CreditTransaction`, and `JournalEntry` models all exist with required fields. |
| EXS-006 | **PASS** | `prisma/schema.prisma:653-693`, `731-762` | `AuthorityRule` and `AuditLog` models exist. AuditLog includes `beforeState`, `afterState`, `previousHash`, and `hash` for tamper-proofing. |
| EXS-007 | **PASS** | `prisma/schema.prisma:1517-1570`, `1587-1619` | `SwarmJob` and `SwarmMemory` models exist with full fields. |

### API Routes

| Check ID | Status | File | Finding |
|---|---|---|---|
| EXS-008 | **PASS** | `app/api/v1/auth/*` | Login, register, logout, me, refresh, verify routes all exist. |
| EXS-009 | **PASS** | `app/api/v1/orders/*` | Order CRUD + evaluate, approve, confirm-guarantee, smart-fix routes exist. |
| EXS-010 | **PASS** | `app/api/v1/invoices/*` | Invoice CRUD + eta-submit, factor routes exist. |
| EXS-011 | **PASS** | `app/api/v1/eta/*` | Submit, callback, and status routes exist. |
| EXS-012 | **PASS** | `app/api/v1/factoring/*` | Inquire, fund, requests, and invoices routes exist. |
| EXS-013 | **PASS** | `app/api/v1/admin/*` | Audit-log, authority-override, fees, pulse, risk/heatmap, liquidity, and cron routes exist. |

### Queue Workers

| Check ID | Status | File | Finding |
|---|---|---|---|
| EXS-014 | **PASS** | `lib/eta/queue.ts` | `etaQueue`, `etaDeadLetterQueue`, `createEtaWorker()`, and `createEtaDeadLetterWorker()` are exported. |
| EXS-015 | **PASS** | `lib/orders/queue.ts` | `orderQueue` and `createOrderWorker()` exported. |
| EXS-016 | **PASS** | `lib/factoring/queue.ts` | `factoringQueue` and `createFactoringWorker()` exported. |
| EXS-017 | **PASS** | `lib/queues/dead-letter.ts` | `getDeadLetterQueue()`, `moveToDeadLetter()`, `retryFromDeadLetter()`, `listDeadLetterJobs()`, and `createDlqWorker()` exported. |

---

## Category: Reliability

### Error Handling

| Check ID | Status | File | Finding |
|---|---|---|---|
| RLB-001 | **PARTIAL** | `app/api/*` | All v1 routes use the `apiRoute()` wrapper with `try/catch` and structured `{ success, error }` responses. Legacy flat routes (56 files) were not individually reviewed and may lack this pattern. |
| RLB-002 | **PARTIAL** | `lib/*/queue.ts` | Queue worker processors have `try/catch` via BullMQ, but there are **no explicit `worker.on('failed', ...)` handlers** to log or alert on uncaught rejections. |
| RLB-003 | **PARTIAL** | `app/api/*` | All reviewed v1 routes validate input with Zod (via `validateBody()` or `.parse()`). However, **13 v1 routes** lack `requirePermission()` and therefore may also lack validation discipline. Legacy routes are inconsistent. |

### Rate Limiting & Session Management

| Check ID | Status | File | Finding |
|---|---|---|---|
| RLB-004 | **PASS** | `app/api/v1/auth/login/route.ts:12` | Rate limit: 5 attempts per 60 seconds per IP via `checkRateLimit(\`login:${clientIp}\`, 60, 5)`. |
| RLB-005 | **PASS** | `app/api/v1/auth/register/route.ts:12` | Rate limit: 3 attempts per 3600 seconds per IP via `checkRateLimit(\`register:${clientIp}\`, 3600, 3)`. |
| RLB-006 | **FAIL** | `lib/session.ts:47` | JWT expiry is **"7d"** (7 days), not 24 hours as specified. `maxAge` cookie is also 7 days. |
| RLB-007 | **PASS** | `lib/session.ts:13-36` | Blacklist implemented via Redis (`session:blacklist:${token}` with 7-day TTL) with in-memory fallback. |
| RLB-008 | **PASS** | `lib/session.ts:71-73` | `jwtVerify()` uses `clockTolerance: 60`; expired tokens are automatically rejected. |

### Data Integrity & Tenant Isolation

| Check ID | Status | File | Finding |
|---|---|---|---|
| RLB-009 | **PARTIAL** | `lib/fintech/*`, `app/api/*` | Idempotency keys are required on order creation, invoice creation, and payment guarantee confirmation. Not enforced on all monetary mutations (e.g., factoring fund route does not require idempotency key). |
| RLB-010 | **PARTIAL** | `app/api/invoices/pay/route.ts` | No evidence that `JournalEntry` records are auto-created for all payments. `lib/factoring/queue.ts` writes `CreditTransaction` but not `JournalEntry`. |
| RLB-011 | **PARTIAL** | `app/api/*`, `lib/*` | Most v1 queries include `tenantId` filter (e.g., `where: { tenantId: auth.tenantId }`). However, `lib/auth/authority-matrix.ts:219-227` loads orders **without tenant scoping** — only `orderId` is used. `lib/fintech/risk-engine.ts:117-126` also loads hotels without tenant filter. |
| RLB-012 | **PARTIAL** | `app/api/*`, `lib/*` | `verifyTenantOwnership()` and `enforceTenantOwnership()` helpers exist but are **not used in most API routes**. Cross-tenant access is prevented primarily by `tenantId` in `where` clauses, but not uniformly. |

---

## Category: Expiration & Dependencies

| Check ID | Status | File | Finding |
|---|---|---|---|
| EXP-001 | **PENDING** | `package.json` | `npm audit` was not run during this audit. Cannot verify CVE status without runtime check. |
| EXP-002 | **PASS** | `package.json:63` | Prisma pinned to `^6.6.0` — compatible with 6.x major. |
| EXP-003 | **PASS** | `package.json:42` | Next.js `16.2.4` matches documented stack in AGENTS.md. |
| EXP-004 | **PENDING** | `deploy/ssl/*` | SSL certificate validity cannot be verified without runtime check against live domain. |
| EXP-005 | **PARTIAL** | `.env.example` | File documents DATABASE_URL, REDIS_URL, SESSION_SECRET, ETA, Paymob, Resend, Sentry, R2, and Meilisearch vars. Missing: `FROM_EMAIL`, `ETA_API_URL`, `OLLAMA_URL`, `OLLAMA_MODEL`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `KIMI_API_KEY`, `XAI_API_KEY`, `OPENCLAW_URL`, `AGENT0_URL`. |
| EXP-006 | **PASS** | `*` | No hardcoded secrets detected in source code. API keys are read from `process.env`. |

---

## Category: Content Excellence

### SEO

| Check ID | Status | File | Finding |
|---|---|---|---|
| CNT-001 | **PASS** | `app/layout.tsx`, `app/(marketing)/*` | Meta title/description present on root layout (with template) and generated per marketing page via `getCmsPage()`. |
| CNT-002 | **PASS** | `app/layout.tsx:52-76` | Open Graph tags present (type, locale, url, siteName, title, description, images). |
| CNT-003 | **PASS** | `app/layout.tsx:152-179` | JSON-LD structured data (`Organization` schema) embedded on homepage via root layout. |
| CNT-004 | **FAIL** | `public/*` | **Missing** `robots.txt` and `sitemap.xml` in `public/`. |
| CNT-005 | **PENDING** | `app/*` | Core Web Vitals (LCP, INP, CLS) cannot be measured without runtime testing. |

### CMS & Copy

| Check ID | Status | File | Finding |
|---|---|---|---|
| CNT-006 | **PASS** | `data/cms-content.json` | CMS JSON exists with complete data for home, about, pricing, solutions, and contact pages. |
| CNT-007 | **PASS** | `app/(dashboard)/admin/cms/page.tsx` | CMS editor page exists with form and JSON editing modes, page selector, and save functionality. |
| CNT-008 | **PASS** | `app/(marketing)/*` | All marketing pages call `getCmsPage()` and fall back to hardcoded defaults if CMS data is missing. |
| CNT-009 | **PASS** | `app/*` | No "Lorem ipsum" placeholder text found. All copy is production-ready. |
| CNT-010 | **PASS** | `app/*` | CTAs have clear action text ("Get Started Free", "Book a Demo", "Browse Catalog", etc.). |
| CNT-011 | **PENDING** | `app/*` | Cannot verify alt text on all images without exhaustive DOM inspection. HeroCarousel component not reviewed. |
| CNT-012 | **PENDING** | `app/*` | Cannot verify image links without runtime HTTP testing. |

---

## Category: Integration

### ETA Bridge

| Check ID | Status | File | Finding |
|---|---|---|---|
| INT-001 | **FAIL** | `docs/eta-integration.md` | **File does not exist.** AGENTS.md G4 requires the Integration Lead to own this spec. |
| INT-002 | **PARTIAL** | `app/api/v1/eta/callback/route.ts` | Callback route validates body with Zod and calls `etaClient.processCallback()`, which updates invoice status. However, there is **no idempotency check** — replaying the same callback UUID will create duplicate `AuditLog` entries and re-update the invoice. |
| INT-003 | **PARTIAL** | `lib/eta/*` | UUID generation and validation are implemented, but **digital signing flow is not implemented** — `lib/eta/client.ts` POSTs raw JSON without cryptographic signing. The `digitalSignature` field on `Invoice` is never populated by the submission pipeline. |

### ERP Connectors & Inventory

| Check ID | Status | File | Finding |
|---|---|---|---|
| INT-004 | **FAIL** | `app/api/webhooks/*` | **No webhook receiver pattern for Opera/SAP exists.** The `app/api/webhooks/` directory does not exist. |
| INT-005 | **FAIL** | `lib/inventory/*` | **No inventory sync orchestrator.** `lib/inventory/sync.ts` does not exist. `app/api/webhooks/inventory/[provider]/` does not exist. Violates AGENTS.md G5. |

### Email & LLM Swarm

| Check ID | Status | File | Finding |
|---|---|---|---|
| INT-006 | **PASS** | `lib/notifications/email.ts` | Resend email service configured with HTML templates (approval, order approved, factoring disbursed, smart fix). |
| INT-007 | **PASS** | `lib/notifications/queue.ts` | `emailQueue` + `createEmailWorker()` implemented with BullMQ for async delivery. |
| INT-008 | **PASS** | `docker-compose.swarm.yml:194-216` | Ollama service defined with `ollama/ollama:latest` image, volume mount, and resource limits. |
| INT-009 | **PARTIAL** | `lib/swarm/model-router.ts` | Fallback chain exists (xAI → Ollama → Groq → OpenRouter → Kimi), but **primary provider is xAI (Grok), not Ollama** — contradicts AGENTS.md which mandates Ollama as PRIMARY. Circuit breaker and health tracking are present. |
| INT-010 | **PASS** | `docker-compose.swarm.yml:159-191` | `swarm-worker` service defined with 2 replicas, healthcheck, and memory limits. |

---

## Category: Error-Free Testing

| Check ID | Status | File | Finding |
|---|---|---|---|
| TST-001 | **PASS** | `tests/api/auth.test.ts` | Auth tests exist and cover password hashing, session create/verify/clear, and Zod validation. |
| TST-002 | **PASS** | `tests/fintech/risk-engine.test.ts` | Risk engine tests exist and cover `assessRisk()` composite score and tier output. |
| TST-003 | **PASS** | `tests/api/orders.test.ts` | Order state machine tests exist and cover valid/invalid status transitions. |
| TST-004 | **PARTIAL** | `tests/*` | Tests exist for auth, orders, and risk engine. **No tests for ETA queue, factoring queue, dead-letter queue, email queue, or tenant isolation.** |
| TST-005 | **FAIL** | `*` | `tsc --noEmit` fails: `.next/types/validator.ts(512,39): error TS2307: Cannot find module '../../app/page.js'`. This is a **BLOCKING build error**. |
| TST-006 | **PENDING** | `*` | `npm run build` not executed in full due to TypeScript failure. Build would likely fail. |
| TST-007 | **FAIL** | `*` | `npm run lint` reports **53 errors, 254 warnings**. Errors include `@typescript-eslint/no-explicit-any` and `no-require-imports` in `scripts/sync-openclaw.ts`. |
| TST-008 | **PENDING** | `*` | E2E happy path cannot be verified without runtime manual testing. |
| TST-009 | **PENDING** | `*` | Authority Matrix >25K approval flow cannot be verified without runtime testing. |
| TST-010 | **PENDING** | `*` | ETA end-to-end flow cannot be verified without runtime testing. |
| TST-011 | **PENDING** | `*` | Factoring end-to-end flow cannot be verified without runtime testing. |
| TST-012 | **PASS** | `app/api/*` | All database access uses Prisma with parameterized queries. No raw SQL injection vectors found. |
| TST-013 | **PARTIAL** | `app/api/*` | Cache-Control headers are set globally in `next.config.ts`, but API routes do not explicitly set `Content-Type: application/json` with XSS protection headers. |
| TST-014 | **PENDING** | `app/api/*` | No explicit CSRF token mechanism visible. SameSite=lax cookies and JWT headers provide some protection, but no dedicated CSRF middleware. |
| TST-015 | **PARTIAL** | `app/api/*` | **108** total `requirePermission()` calls across API routes. However, **13 v1 routes** lack `requirePermission()`, and **56 legacy flat routes** lack it. RBAC is not universal. |

---

## Critical Findings (BLOCKING + CRITICAL)

### BLOCKING-1: TypeScript Compilation Failure (TST-005)
**File:** `.next/types/validator.ts` (generated)  
**Issue:** `tsc --noEmit` fails with `Cannot find module '../../app/page.js'`. This appears to be caused by stale Next.js generated types referencing a root `app/page.tsx` that was recently removed (per git log: "fix: remove stale root app/page.tsx so marketing/CMS page serves homepage"). The `.next/` cache contains stale type references.  
**Recommended Fix:**
1. Delete `.next/` directory and rebuild.
2. If the error persists, check `next.config.ts` for `pageExtensions` or type generation issues.
3. Add `skipLibCheck: true` to `tsconfig.json` only as a temporary workaround — the root cause is stale generated types.

### BLOCKING-2: ETA UI Route Violates Invisibility Guardrail (FSB-008)
**File:** `app/eta-demo/page.tsx` (entire file, 442 lines)  
**Issue:** AGENTS.md G4 states: *"The ETA e-invoicing service has ZERO UI routes. No page, component, or client code may reference ETA API keys, endpoints, or payloads."* This page is a fully interactive client component that simulates ETA digital signing, generates fake UUIDs, displays "Submitting to Egyptian Tax Authority", and references ETA API response statuses.  
**Recommended Fix:** Remove `app/eta-demo/page.tsx` entirely, or relocate its educational content to a private admin documentation page outside the public app tree.

### BLOCKING-3: Order Confirmation Skips Payment Guarantee Check (FSB-002)
**File:** `lib/orders/queue.ts:89-97`  
**Issue:** The `CONFIRM_ORDER` worker action transitions an order to `CONFIRMED` if `order.status === "APPROVED"`, but it never checks `order.paymentGuaranteed`. AGENTS.md G10 states this is an *ABSOLUTE rule*: *"No order may transition to CONFIRMED, IN_TRANSIT, or DELIVERED without order.paymentGuaranteed = true."*  
**Recommended Fix:** Add an explicit guard before line 94:
```typescript
if (!order.paymentGuaranteed) {
  throw new Error("Payment guarantee required before confirmation");
}
```

### BLOCKING-4: Missing Inventory Sync Infrastructure (INT-005)
**File:** N/A (missing)  
**Issue:** AGENTS.md G5 requires *"NO WEBSOCKETS for inventory. Use REST APIs and inbound Webhooks."* The required files do not exist:
- `lib/inventory/sync.ts`
- `app/api/webhooks/inventory/[provider]/`
**Recommended Fix:** Create the inventory sync orchestrator and at least one webhook receiver template (e.g., for a generic ERP or Opera PMS) to satisfy the guardrail.

### BLOCKING-5: RBAC Gaps in v1 API Routes (TST-015)
**Files:** 13 v1 routes without `requirePermission()`  
**Issue:** The following v1 routes were identified as lacking `requirePermission()` calls:
- `app/api/v1/payments/paymob-callback/route.ts`
- `app/api/v1/suppliers/[id]/reject/route.ts`
- `app/api/v1/suppliers/[id]/approve/route.ts`
- `app/api/v1/auth/refresh/route.ts`
- `app/api/v1/auth/logout/route.ts`
- `app/api/v1/auth/register/route.ts`
- `app/api/v1/auth/me/route.ts`
- `app/api/v1/auth/login/route.ts`
- `app/api/v1/cms/content/route.ts`
- `app/api/v1/supplier/onboard/route.ts`
- `app/api/v1/ai/assistant/route.ts`
- `app/api/v1/eta/status/[uuid]/route.ts`
- `app/api/v1/eta/callback/route.ts`

While auth/login/register are public by design, routes like `paymob-callback`, `eta/callback`, and `cms/content` (PUT) should enforce permissions. Additionally, **56 legacy flat routes** lack RBAC entirely.

**Recommended Fix:**
1. Audit every v1 route and add `requirePermission()` where missing.
2. Accelerate deprecation of legacy flat routes or add RBAC wrappers to them.
3. Add a CI lint rule that fails if a `route.ts` file in `app/api/v1/` does not import `requirePermission`.

### CRITICAL-1: No Next.js Middleware File (Edge RBAC Missing)
**File:** `middleware.ts` — **does not exist**  
**Issue:** `proxy.ts` contains middleware logic but is **not wired into Next.js**. Next.js 16 expects `middleware.ts` (or `.js`) in the project root or `src/` to run at the edge. Without it, **no edge-level authentication, tenant injection, or role-based route guards are active**. The `PUBLIC_PATHS`, `ROLE_ROUTES`, and `verifySession()` logic in `proxy.ts` are dead code from a middleware perspective.

**Recommended Fix:** Rename `proxy.ts` → `middleware.ts` and ensure it exports the `middleware` function with the `config.matcher` pattern. Verify that `x-tenant-id`, `x-user-id`, and `x-platform-role` headers are injected before requests reach API routes.

### CRITICAL-2: JWT Session Expiry is 7 Days (Not 24 Hours)
**File:** `lib/session.ts:47`  
**Issue:** `createSession()` sets `.setExpirationTime("7d")` and cookie `maxAge` to `60 * 60 * 24 * 7`. The checklist RLB-006 mandates 24-hour expiry for JWT sessions.

**Recommended Fix:** Change to `.setExpirationTime("24h")` and cookie `maxAge: 60 * 60 * 24`.

### CRITICAL-3: ETA Dead-Letter Queue Is Not Wired
**File:** `lib/eta/queue.ts`  
**Issue:** `etaDeadLetterQueue` is instantiated (line 21) but **never used**. Failed ETA jobs are deleted after `removeOnFail: { count: 50 }` instead of being moved to DLQ for manual resolution. The `createEtaWorker()` has no `on("failed")` handler.

**Recommended Fix:** Add a `worker.on("failed", ...)` handler that calls `moveToDeadLetter("eta-submission", job, err.message)` from `lib/queues/dead-letter.ts`.

---

## High Priority Findings

| # | Check ID | Finding | File | Recommendation |
|---|----------|---------|------|----------------|
| H-1 | OPS-006 | Queue workers are defined but **never bootstrapped**. | `lib/*/queue.ts` | Add a `workers/index.ts` that instantiates all workers at app startup (or in a dedicated worker Docker service). |
| H-2 | OPS-010 | API errors do not include `tenantId`/`userId`/`timestamp`. | `lib/api-utils.ts:164-166` | Extend `error()` helper to accept context and log structured errors via Pino before returning JSON. |
| H-3 | RLB-006 | Session expiry 7 days vs required 24h. | `lib/session.ts:47` | Change to 24h. |
| H-4 | RLB-011 | Authority Matrix and Risk Engine load orders/hotels **without tenant scoping**. | `lib/auth/authority-matrix.ts:219`, `lib/fintech/risk-engine.ts:117` | Add `tenantId` filter to all Prisma queries in governance engines. |
| H-5 | FSB-006 | Digital signing is not implemented in ETA client. | `lib/eta/client.ts` | Implement actual cryptographic signing (e.g., using `crypto.sign()` with the supplier's ETA-registered certificate) before submission. |
| H-6 | CNT-004 | Missing `robots.txt` and `sitemap.xml`. | `public/*` | Generate `public/robots.txt` and `public/sitemap.xml` (or a dynamic sitemap route). |
| H-7 | INT-001 | Missing `/docs/eta-integration.md`. | `docs/*` | Create the ETA integration spec document as required by AGENTS.md G4. |
| H-8 | TST-007 | 53 lint errors and 254 warnings. | `*` | Fix the 53 errors (focus on `sync-openclaw.ts` and any `any` types). Establish a pre-commit lint gate. |

---

## Medium/Low Findings

| Check ID | Severity | Finding | File |
|----------|----------|---------|------|
| DES-001 | MEDIUM | Brand color palette inconsistent between CSS (#022349) and marketing pages (#e11d48). | `app/globals.css`, `app/(marketing)/*` |
| DES-002 | MEDIUM | Admin dashboard uses solid backgrounds instead of glassmorphism. | `app/(dashboard)/admin/page.tsx` |
| STR-002 | MEDIUM | 56 legacy flat API routes still active; should be deprecated/removed. | `app/api/*` |
| STR-009 | LOW | Unused variable warnings from lint (254 total). | `*` |
| STR-010 | LOW | `console.log` in seed scripts and email fallback. | `prisma/seed*.ts`, `lib/notifications/email.ts` |
| OPS-009 | MEDIUM | Pino logger underutilized in API routes. | `app/api/v1/*` |
| RLB-001 | MEDIUM | Legacy API routes may lack structured error handling. | `app/api/*` |
| RLB-002 | MEDIUM | Queue workers lack explicit failure event handlers. | `lib/*/queue.ts` |
| RLB-003 | MEDIUM | 13 v1 routes and 56 legacy routes lack Zod validation discipline. | `app/api/*` |
| RLB-009 | MEDIUM | Idempotency keys not enforced on all monetary mutations. | `app/api/v1/factoring/*` |
| RLB-010 | MEDIUM | Double-entry journal not auto-posted for payments. | `lib/fintech/*`, `app/api/*` |
| RLB-012 | MEDIUM | `enforceTenantOwnership()` exists but is rarely called. | `lib/tenant/scope.ts` |
| EXP-005 | LOW | `.env.example` missing several optional but documented env vars. | `.env.example` |
| INT-002 | MEDIUM | ETA callback route is not idempotent against replays. | `app/api/v1/eta/callback/route.ts` |
| INT-004 | MEDIUM | No Opera/SAP webhook receiver exists. | `app/api/webhooks/*` |
| INT-009 | MEDIUM | Model router primary is xAI, not Ollama (contradicts AGENTS.md). | `lib/swarm/model-router.ts` |
| TST-004 | MEDIUM | Test coverage gaps for queues, ETA, and email. | `tests/*` |
| TST-013 | LOW | API routes lack explicit XSS protection headers. | `app/api/*` |

---

## Recommendations (Prioritized Action Items)

### Immediate (Before Next Deploy)
1. **Fix TypeScript compilation** — delete `.next/` and resolve the `validator.ts` module error.
2. **Remove `app/eta-demo/page.tsx`** — violates ETA invisibility guardrail.
3. **Add payment guarantee check** to `lib/orders/queue.ts` `CONFIRM_ORDER` action.
4. **Create `middleware.ts`** from `proxy.ts` logic to enable edge RBAC.
5. **Fix JWT expiry** to 24 hours in `lib/session.ts`.
6. **Wire ETA DLQ** — add `worker.on("failed", ...)` handler to move failed jobs to `etaDeadLetterQueue`.

### This Sprint (7 Days)
7. **Add `requirePermission()` to all 13 missing v1 routes** and audit legacy routes.
8. **Add tenant scoping** to `evaluateAuthority()` and `assessRisk()` Prisma queries.
9. **Create `lib/inventory/sync.ts`** and at least one inventory webhook receiver.
10. **Create `/docs/eta-integration.md`** as required by G4.
11. **Generate `public/robots.txt` and `public/sitemap.xml`**.
12. **Bootstrap all queue workers** in a central `workers/index.ts` or Docker entrypoint.

### Next Sprint (30 Days)
13. **Implement actual digital signing** in `lib/eta/client.ts` before ETA submission.
14. **Add idempotency keys** to all factoring and payment routes.
15. **Auto-create `JournalEntry`** records for every payment and factoring disbursement.
16. **Fix 53 lint errors** and establish a CI gate (`npm run lint` must pass).
17. **Write tests** for ETA queue, factoring queue, dead-letter queue, and email queue.
18. **Deprecate legacy flat API routes** — migrate consumers to `/api/v1/` equivalents and delete old routes.

---

*Report generated by The Auditor agent on 2026-05-10.*
*Methodology: Static code analysis against `docs/audit/benchmark-checklist.csv`, `AGENTS.md` guardrails, and spot runtime verification.*
