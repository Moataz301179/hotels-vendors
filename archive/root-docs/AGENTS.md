<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — hotels-vendors Digital Procurement Hub

## Project Vision

This is a **Digital Procurement Hub for the B2B hotel sector**. It is not a simple landing page. The platform connects four core actor types:

1. **Hotels** — buyers procuring goods and services.
2. **Suppliers** — sellers listing fixed prices and available quantities (no bidding).
3. **Shipping / Logistics Providers** — fulfilling delivery and reducing overhead.
4. **Factoring Companies** — providing liquidity and credit facilitation.

### Core Business Logic

- **Fixed Pricing:** Suppliers list fixed prices and quantities. There is no bidding mechanism.
- **Negotiated Credit:** Credit terms are negotiated per-hotel, not global.
- **Factoring Integration:** Factoring companies inject liquidity into the transaction flow.
- **Shark-Breaker Model:** The platform empowers SME suppliers to compete with large distributors by reducing logistics overhead and enabling faster shipping.
- **Monetization:** Revenue is generated via a transactional fee percentage on completed orders.
- **Compliance:** Full integration with the **Egyptian Tax Authority (ETA) e-invoicing** system is mandatory.
- **Governance:** A strict **Authority Matrix** governs multi-level order approvals and data access controls.

## Technology Stack (Current)

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16.2.4 | App Router. **Read `node_modules/next/dist/docs/` before using any API.** |
| Runtime | React 18.3.1 |  |
| Language | TypeScript 5 | `strict: true` is enabled. |
| Styling | Tailwind CSS v4 | `postcss.config.mjs` uses `@tailwindcss/postcss`. Global styles live in `app/globals.css` using Tailwind v4 syntax. |
| UI Primitives | Radix UI, CVA, clsx, tailwind-merge, lucide-react | Installed but not yet utilized. |
| Deployment | Vercel | `output: 'standalone'` is configured. Build command overridden with `--legacy-peer-deps`. |
| Testing | None | No test framework is installed. Agents assigned to testing must add one. |
| Database | Prisma + SQLite (dev) → PostgreSQL (prod) | Schema migration to multi-tenant model is **IN PROGRESS**. See System Guardrails. |
| Auth / RBAC | Custom JWT + Middleware | Tenant-aware sessions with server-side RBAC. **NO client-side role switching.** |
| Swarm LLM | Ollama (local/VPS) | **PRIMARY** — zero-cost inference via Docker. Fallback chain: Groq → OpenRouter → Kimi/xAI. |
| Job Queue | BullMQ + Redis | 4 squad queues (growth, operations, intelligence, execution). |
| Agent Memory | Prisma + Redis | Hybrid: Prisma persistent + Redis hot cache with confidence scoring. |

## Swarm LLM Architecture (v3 — Ollama Primary)

### Provider Hierarchy

The swarm uses a cascading fallback system. **Ollama is the primary provider** — it runs locally on the VPS at zero API cost.

```
Ollama (local/VPS)     → PRIMARY    → zero cost, zero rate limits
  ↓ (down / slow)
Groq (free tier)       → FALLBACK 1 → 20 req/min, 1M tok/day, no CC required
  ↓ (rate limited / down)
OpenRouter             → FALLBACK 2 → $5-10 credits, 100+ models
  ↓ (no credits)
Kimi (Moonshot)        → FALLBACK 3 → pay-as-you-go, funded only
  ↓ (no credits)
xAI (Grok)             → FALLBACK 4 → pay-as-you-go, funded only
```

### Configuration

Set in `.env` or Docker Compose environment:

```bash
# REQUIRED — Ollama runs inside Docker, no API key needed
OLLAMA_URL=http://ollama:11434
OLLAMA_MODEL=llama3.2:3b       # CPU VPS: 3B params for speed
# OLLAMA_MODEL=llama3.1:8b     # GPU VPS: 8B+ params for quality

# OPTIONAL — Free fallback, highly recommended
GROQ_API_KEY=gsk_...             # Get free at https://console.groq.com

# OPTIONAL — Paid fallbacks
OPENROUTER_API_KEY=sk-or-v1-...
KIMI_API_KEY=sk-...
XAI_API_KEY=xai-...
```

### Ollama Model Selection Guide

| VPS Type | Recommended Model | Params | Reason |
|---|---|---|---|
| CPU-only (2-4 vCPU, 8GB RAM) | `llama3.2:3b` or `phi3:3.8b` | 3-4B | Fast enough for swarm tasks (~5-10s) |
| CPU-only (4+ vCPU, 16GB RAM) | `llama3.1:8b` or `gemma4:8b` | 8B | Better quality, ~15-30s per call |
| GPU (NVIDIA T4/A10) | `llama3.1:8b`, `phi4:14.7b` | 8-15B | Near-instant, highest quality |

### Key Files

- `lib/swarm/model-router.ts` — Provider router with circuit breaker, timeout handling, health tracking
- `lib/swarm/director.ts` — Strategic orchestrator (The Winning Horse)
- `lib/swarm/scheduler.ts` — BullMQ job queue management
- `lib/swarm/memory.ts` — Hybrid persistent + cache memory layer
- `lib/swarm/agents/index.ts` — 15 agent definitions across 4 squads
- `docker-compose.swarm.yml` — Full Docker stack including Ollama service

## Project Structure

**CRITICAL:** The repository currently has **two App Router directories**. Next.js prioritizes the root `app/` directory and completely ignores `src/app/`.

```
app/
  (marketing)/          # PUBLIC: Landing, SEO, lead-gen pages
    layout.tsx
    page.tsx
    about/
    pricing/
    solutions/
    blog/
  (auth)/               # PUBLIC: Login, register, forgot-password
    layout.tsx
    login/
    register/
    forgot-password/
    verify-email/
  (dashboard)/          # PRIVATE: Role-specific dashboards (middleware-guarded)
    layout.tsx          # Dashboard shell (sidebar, header, tenant context)
    hotel/              # Hotel Buyer procurement portal
    supplier/           # Supplier Central inventory & orders
    factoring/          # Liquidity & credit risk dashboards
    shipping/           # Logistics & delivery optimization
    admin/              # Platform auditor & fee tracking
  api/
    v1/                 # VERSIONED API (all new routes here)
      auth/
      tenants/
      roles/
      users/
      hotel/
      supplier/
      factoring/
      shipping/
      eta/
      intelligence/
      admin/
    webhooks/           # External webhook receivers
  layout.tsx            # ROOT: Minimal, loads global providers
  globals.css           # ACTIVE: Tailwind v4 global stylesheet
components/
  ui/                   # shadcn/ui primitives (buttons, inputs, tables, dialogs)
  layout/               # Structural: dashboard-shell, sidebar, header
  auth/                 # Auth-specific forms and selectors
  dashboards/           # Role-specific dashboard modules
    hotel/
    supplier/
    factoring/
    shipping/
    admin/
  ai-assistant/         # Vercel AI SDK Smart Assistant components
  shared/               # Cross-cutting: data-table, stat-card, tenant-switcher
lib/
  prisma.ts             # Prisma singleton
  auth/                 # Password, session, RBAC engine, authority matrix, middleware
  tenant/               # Tenant context extraction, query scoping, switching
  eta/                  # ETA E-Invoicing Bridge (INVISIBLE to UI)
  inventory/            # Inventory sync engine (REST + Webhooks only)
  ai/                   # Vercel AI SDK config, role-specific prompts
  fintech/              # Fee calculator, credit gate, idempotency, ledger
  validators/           # Zod schemas for all API input
```

### Directory Evolution Rules

- **All new routes, layouts, and API endpoints MUST live under the root `app/` directory.** Do not use `src/app/`.
- **Route groups are MANDATORY:**
  - `app/(marketing)/` — Public landing pages only.
  - `app/(auth)/` — Authentication flows only.
  - `app/(dashboard)/` — Private dashboards, middleware-guarded.
  - `app/api/v1/` — All new API routes MUST be versioned. Legacy flat routes are deprecated.
- **Component organization:**
  - `components/ui/` — shadcn/ui primitives (buttons, inputs, tables, dialogs). Pure presentational only.
  - `components/layout/` — Structural components (dashboard-shell, sidebar, header).
  - `components/auth/` — Authentication forms and role-selection components.
  - `components/dashboards/[role]/` — Role-specific dashboard modules.
  - `components/ai-assistant/` — Vercel AI SDK Smart Assistant components.
  - `components/shared/` — Cross-cutting utilities (data-table, tenant-switcher, permission-gate).
- **Path alias `@/*` maps to `./src/*`.** Because `src/app/` is inactive, do not rely on `@/` for App Router files. Use relative imports inside `app/` or map a new alias (e.g., `~/*` → `./*`).
- **NO CODE in `app/(app)/` or `src/app/`** — these are DEPRECATED. Migrate existing pages to the new structure.

## Agent Swarm Assignments

Before writing code for any of the domains below, the assigned agent must produce a design document (markdown in `/docs/` or as a GitHub discussion) and receive implicit sign-off via user confirmation.

### 1. Fintech Architect
**Scope:** Factoring flows, credit logic, pricing engines, transactional fee calculation.

- Design the data model for fixed-price supplier catalogs, per-hotel credit terms, and factoring liquidity injections.
- Propose the database schema (PostgreSQL, MySQL, or other) and ORM (Prisma, Drizzle, or other).
- Implement idempotency keys and double-entry safeguards for all monetary mutations.
- Define the fee-calculation service and ensure it is audit-logged.

### 2. Security Expert
**Scope:** Authority Matrix, RBAC, authentication, data privacy, transaction controls.

- Design and implement the **Authority Matrix**: multi-level approval chains for purchase orders based on value thresholds, hotel hierarchy, and supplier tiers.
- Choose and integrate an authentication provider (Auth.js, Clerk, or custom) that supports role-based access control.
- Enforce field-level and route-level authorization. No sensitive data may be returned without explicit permission checks.
- Define secrets management strategy (Vercel Environment Variables, HSM, or other).

### 3. Integration Lead
**Scope:** ETA e-invoicing bridges, external ERP connectors (Opera, etc.), shipping APIs.

- Research and document the **Egyptian Tax Authority (ETA) e-invoicing API** specifications.
- Build a resilient adapter pattern for ETA submission, validation, and callback handling.
- Design webhook and polling strategies for external ERP systems (Opera PMS, SAP, etc.).
- Ensure all integrations write to an immutable audit log.

### 4. Business Strategist
**Scope:** Revenue model optimization, marketplace dynamics, UX flow for the Shark-Breaker model.

- Model transactional fee tiers and simulate supplier / hotel adoption curves.
- Define KPIs and dashboard requirements for marketplace health.
- Write copy, user-flow diagrams, and A/B test specifications for onboarding SME suppliers.
- Validate that every feature shipped has a measurable impact on the fee-based revenue model.

### 5. SEO Strategist
**Scope:** Optimize the `app/` directory for B2B buyer intent and 2026 Core Web Vitals.

- Craft metadata, Open Graph, and structured data (JSON-LD) for all procurement-facing routes.
- Ensure semantic HTML, proper heading hierarchy, and accessible landmark regions.
- Target long-tail keywords around "hotel procurement," "hospitality suppliers Egypt," and "B2B hotel sourcing."
- Monitor LCP, INP, and CLS budgets; enforce image optimization and font-display strategies.
- Build a sitemap and robots.txt strategy aligned with the marketplace catalog structure.

### 6. UX Designer
**Scope:** Glassmorphism Tailwind theme, scannable dashboard content, and design-system governance.

- Generate a **Glassmorphism** Tailwind theme using the brand logo color palette (to be provided).
- Define color primitives, spacing scale, and typography tokens in `app/globals.css` or a dedicated theme file.
- Prioritize scannable content for the Procurement Hub dashboard: clear data tables, card hierarchies, and whitespace rhythm.
- Maintain a component inventory in `components/ui/` with Radix UI primitives styled via CVA.
- Ensure WCAG 2.2 AA contrast ratios and keyboard navigability across all interactive elements.

### 7. Data Harvester
**Scope:** Compile and maintain a master registry of Suppliers, Hotels, and Logistics entities.

- Scan all project files, external directories, and APIs to aggregate entity data.
- Design a canonical schema for the master registry (JSON, CSV, or database table).
- Normalize entity names, addresses, tax IDs, and contact information.
- Provide seeded data files under `/data/` for development and staging environments.
- Ensure PII is masked or encrypted when committed to version control.

### 8. The Auditor
**Scope:** Review all development cycles to ensure modules (Factoring, Shipping, ETA) stay synchronized and secure.

- Perform cross-module dependency audits before every merge or deployment.
- Verify that the **Authority Matrix** is enforced in all order mutation paths.
- Confirm that ETA e-invoicing callbacks are idempotent and write to the immutable audit log.
- Run static-analysis checks (TypeScript strictness, Zod validation coverage, secret scanning).
- Maintain a living `/docs/audit-log.md` recording findings, remediations, and sign-offs.

## Development Conventions

1. **TypeScript Strictness:** Do not disable `strict` or suppress type errors with `// @ts-ignore` unless accompanied by a justification comment and a `TODO` ticket reference.
2. **API Route Safety:** All server-side code in `app/api/` must validate input with Zod (or equivalent) before touching the database or external APIs. **Every API route must also enforce RBAC before executing business logic.**
3. **No Client-Side Secrets:** Never import server-only modules or environment variables into client components. Use the `"use server"` directive or API routes.
4. **Component Purity:** Presentational components in `components/ui/` must be pure and accept data via props. Business logic belongs in server actions, API routes, or dedicated service modules.
5. **File Naming:** Use kebab-case for files (`purchase-order-form.tsx`) and PascalCase for exported React components (`PurchaseOrderForm`).
6. **CSS:** The active app tree loads `app/globals.css` from `app/layout.tsx`. Use Tailwind v4 syntax. Do not rely on `src/app/globals.css`.
7. **NO CLIENT-SIDE ROLE STATE:** Role, tenant, and permissions are server-side only. The existing `components/app/role-context.tsx` (localStorage-based) is **DEPRECATED and must be removed**. Agents must not create client-side role switchers.

## Build, Test & Deploy

```bash
# Install dependencies (the --legacy-peer-deps flag is required)
npm ci --legacy-peer-deps

# Development server
npm run dev          # http://localhost:3000

# Production build
npm run build

# Start production server (standalone output)
npm run start

# Linting
npm run lint
```

- The build command on Vercel is overridden in `vercel.json` to include `--legacy-peer-deps`.
- **Testing is currently nonexistent.** Any agent adding a test framework must update this file with the new commands and conventions.
- Standalone output (`output: 'standalone'`) is enabled. The resulting `.next/standalone` directory is suitable for containerized deployment if needed.

## Security & Compliance

### Authority Matrix (Governance)

- Every order mutation must pass through an approval chain defined by the Authority Matrix.
- Matrix dimensions include: `hotel_id`, `user_role`, `order_value_threshold`, `supplier_tier`.
- Rejections must be logged with `actor_id`, `timestamp`, `reason_code`, and `order_snapshot`.
- Admin overrides are allowed but require dual-authorization and generate an escalated alert.

### ETA E-Invoicing

- All invoices issued through the platform must be submitted to the Egyptian Tax Authority API in real time or near-real time.
- Invoice payloads must be digitally signed and include the ETA-required UUID and serial number.
- Failed submissions must land in a dead-letter queue with automatic retry and manual resolution paths.

### Data Handling

- Do not commit `.env` files. All secrets must be injected via Vercel Environment Variables or a secure vault.
- PII (personally identifiable information) must be encrypted at rest and transmitted over TLS.
- Implement Row-Level Security (RLS) or equivalent at the database layer once the schema is defined.

## Current State & Known Issues

1. **Git Repository State:** The repository may be in an interactive rebase. Run `git status` before committing to confirm you are not mid-rebase.

## COO Strategic Roadmap

> **Source:** `/docs/coo-strategic-roadmap.md` + `/docs/platform-blueprint.md` (maintained by Business Strategist + The Auditor)  
> **Last Updated:** 2026-05-01  
> **Framework:** "The Amazon of Egyptian Hospitality" — a four-sided marketplace.

This section summarizes the market intelligence and strategic priorities approved by the COO. All feature development must align with these priorities.

### What We Are Building
Think of Amazon: buyers discover products, sellers list inventory, logistics fulfills delivery, payments/financing grease the wheels, and compliance keeps everyone legal. **Hotels Vendors does exactly this**, but every feature is purpose-built for Egyptian hospitality.

**The four-sided marketplace:**
1. **Hotels** (Buyers) → Procurement Portal + Financial Dashboard
2. **Suppliers** (Sellers) → Supplier Central + Marketing Tools
3. **Logistics Providers** → Shared-Route Fulfillment Network
4. **Factoring Companies** → Embedded Liquidity + Credit Marketplace

Plus two platform infrastructure layers:
5. **ETA E-Invoicing Engine** — compliance backbone
6. **Authority Matrix Engine** — governance backbone

### Market Position
- **Addressable Market:** Egyptian hospitality = $21.54B (2026), 7.12% CAGR. Chain hotels = 51.2% share and climbing.
- **Closest Competitor:** MaxAB-Wasoko ($251M revenue, 450K+ merchants). They are **horizontal FMCG**, not hospitality-vertical.
- **Global Threat:** FutureLog is a strong hospitality P2P platform but has **zero Egyptian presence**, no ETA integration, and no local supplier network.
- **Key Gaps We Fill:**
  1. **No ETA-native hospitality platform** exists in Egypt.
  2. **No multi-property procurement governance** — hotel groups use WhatsApp + Excel.
  3. **No coastal-cluster logistics optimization** — seasonal supply chaos.
  4. **No embedded factoring for hotel cash-flow cycles** — generic BNPL ignores seasonality.
  5. **No hospitality-specific SKU search** — Amazon Business shows industrial shampoo next to consumer shampoo.

### Profitability Priorities
1. **Vertical depth over horizontal breadth.** Do not compete with MaxAB on grocery volume. Own the hospitality SKU taxonomy (F&B, Housekeeping, Engineering, Amenities, Capital Equipment).
2. **Storage-to-Revenue model.** Daily ordering via shared logistics frees 60% of hotel storage. A 15-property chain gains ~**$780K/year** in "Found Money."
3. **SME acquisition sequencing:** 6th of October City (1,853 factories) → 10th of Ramadan (3,000+ factories) → Coastal clusters. Target 1,000+ suppliers in 24 months.
4. **Revenue streams:** Transaction fees (1.5–2.5%) + Supplier subscriptions + Sponsored listings + Logistics markup + Factoring spread + ETA compliance SaaS + Data insights.
5. **Break-even:** 150 properties × EGP 750K monthly GMV → ~30% net margin.

### Agent Responsibilities in the Amazon Framework

| Agent | Amazon Equivalent | Hotels Vendors Scope |
|---|---|---|
| **UX Designer** | Amazon.com UI | Hotel Procurement Portal + Supplier Central design system |
| **Fintech Architect** | Amazon Pay + AWS | Fee engine, factoring marketplace, payment ledger, idempotency |
| **Security Expert** | AWS IAM + Amazon GuardDuty | Authority Matrix, RBAC, auth provider, secrets management |
| **Integration Lead** | AWS Tax Engine + ERP Connectors | ETA e-invoicing API, Opera/SAP ERP webhooks, logistics APIs |
| **Business Strategist** | Amazon Business Strategy | Revenue model, pilot hotel acquisition, supplier onboarding |
| **Data Harvester** | Amazon Product Catalog | Master registry of Hotels, Suppliers, Logistics entities |
| **SEO Strategist** | Amazon SEO / A9 | B2B buyer-intent optimization, Core Web Vitals, sitemap |
| **The Auditor** | AWS Audit + Compliance | Cross-module sync, security audits, static analysis gating |

### 90-Day Execution Priorities
**Phase 1 — Foundation (Days 1–30):**
1. **Fintech Architect:** PostgreSQL + Prisma schema for Hotels, Suppliers, Orders, Invoices.
2. **Security Expert:** Authority Matrix v1 design; Auth.js vs. Clerk decision.
3. **Integration Lead:** ETA API sandbox integration; UUID + digital signing flow.
4. **UX Designer:** Design system v1 — grey/red/white palette, glassmorphism, bento grids.
5. **Data Harvester:** Master registry of 200+ 6th of October suppliers.

**Phase 2 — Pilot (Days 31–60):**
6. **Business Strategist:** Sign 5 pilot hotel groups (20+ properties) for closed-beta.
7. **SEO Strategist:** Launch landing pages targeting "hotel procurement Egypt."
8. **UX Designer:** Build Hotel Procurement Portal MVP (catalog browse, PO builder, order tracking).
9. **Fintech Architect:** Fee-calculation service with idempotency keys.

**Phase 3 — Compliance & Scale (Days 61–90):**
10. **Integration Lead:** Production ETA submission pipeline with dead-letter queue.
11. **Security Expert:** Route-level authorization; field-level permission checks.
12. **The Auditor:** Cross-module dependency audit; Zod validation required on all API routes.
13. **Business Strategist:** Close first factoring company term sheet + supplier exclusivity agreements.

---

## Decision Log

| Date | Decision | Owner | Status |
|---|---|---|---|
| TBD | Database & ORM selection | Fintech Architect | Pending |
| TBD | Auth provider & Authority Matrix design | Security Expert | Pending |
| TBD | ETA e-invoicing API adapter spec | Integration Lead | Pending |
| 2026-05-01 | Vertical hospitality focus vs. horizontal B2B | COO / Business Strategist | **Approved** |
| 2026-05-01 | 6th of October → 10th of Ramadan → Coastal zone sequencing | COO / Data Harvester | **Approved** |
| 2026-05-01 | Transaction fee tier structure (2.5% → 1.5%) | COO / Fintech Architect | **Approved** |
| 2026-05-01 | Storage-to-Revenue model as primary sales narrative | COO / Business Strategist | **Approved** |
| 2026-05-01 | ETA native integration as compliance differentiator | COO / Integration Lead | **Approved** |
| TBD | B2B SEO strategy & Core Web Vitals budget | SEO Strategist | Pending |
| 2026-05-01 | Glassmorphism theme skeleton & root layout | UX Designer | In Progress |
| TBD | Master registry schema & data pipeline | Data Harvester | Pending |
| 2026-05-01 | Tailwind v4 alignment & build pipeline | The Auditor | Resolved |

---

## System Guardrails (Multi-Tenant Architecture)

> **Enacted:** 2026-05-01 | **Scope:** All agents, all code changes | **Severity:** BLOCKING

These guardrails override any conflicting instructions above. They are functional requirements, not marketing copy.

### G1. TENANT ISOLATION IS NON-NEGOTIABLE

- **Every user belongs to exactly one `TenantId`.** There is no "global" user except the Platform Admin.
- **Every database query must be tenant-scoped.** Use `lib/tenant/scope.ts` to inject `tenantId` filters. Example:
  ```typescript
  // CORRECT
  const orders = await prisma.order.findMany({
    where: { ...tenantWhereClause(ctx), status: "PENDING" }
  });
  
  // FORBIDDEN — missing tenant scope
  const orders = await prisma.order.findMany({ where: { status: "PENDING" } });
  ```
- **Cross-tenant data access is a security incident.** The only exception is Platform Admin with explicit `admin:manage_tenants` permission.
- **API routes must extract tenant from the authenticated session**, never from client-sent headers or query params.

### G2. RBAC IS SERVER-SIDE ONLY

- **Permissions are assigned to Roles, not individuals.** Roles are tenant-scoped (or global for platform roles).
- **The client NEVER decides what it can access.** The server renders UI based on permissions; the client only receives HTML/data.
- **Every API route must call `requirePermission(ctx, "code")` before executing.** No exceptions.
- **The existing `components/app/role-context.tsx` is DEPRECATED.** It uses `localStorage` for role switching. This is a security vulnerability. Remove it. Do not recreate it.
- **Role-based route access is enforced in `middleware.ts`** at the edge, not in client-side route guards.

### G3. AUTHORITY MATRIX GOVERNS ALL ORDER MUTATIONS

- **No order may change status without passing the Authority Matrix evaluation.**
- **Rules are database-driven** (`AuthorityRule` model), not hardcoded.
- **Evaluation engine lives in `lib/auth/authority-matrix.ts`.**
- **All approval/rejection actions write to `AuditLog` with `beforeState` and `afterState` snapshots.**
- **Admin overrides require dual-authorization** and generate an escalated alert.

### G4. ETA BRIDGE IS INVISIBLE

- **The ETA e-invoicing service (`lib/eta/`) has ZERO UI routes.** It is a background compliance engine.
- **No page, component, or client code may reference ETA API keys, endpoints, or payloads.**
- **ETA submission is triggered by invoice lifecycle events** (e.g., `invoice.status = ISSUED`) via background queue.
- **Failed submissions go to a dead-letter queue** (`lib/eta/queue.ts`) with automatic retry and manual resolution.
- **The Integration Lead owns the ETA bridge spec.** No agent may modify ETA logic without updating `/docs/eta-integration.md`.

### G5. INVENTORY SYNC: REST + WEBHOOKS ONLY

- **NO WEBSOCKETS for inventory.** Use REST APIs and inbound Webhooks.
- **Webhook receivers live in `app/api/webhooks/inventory/[provider]/`.**
- **Sync orchestrator lives in `lib/inventory/sync.ts`.**
- **All inventory mutations are tenant-scoped and audit-logged.**

### G6. AI ASSISTANT: ROLE-SPECIFIC, NOT GENERIC

- **Each dashboard includes a "Smart Assistant" component** (`components/ai-assistant/`) using the Vercel AI SDK.
- **System prompts are role-specific** and live in `components/ai-assistant/prompts/[role]-prompt.ts`.
- **The AI assistant must not expose cross-tenant data.** Its context is scoped to the user's tenant.
- **Allowed prompt domains:**
  - **Hotel:** Suggest local SME suppliers, optimize procurement spend, flag reorder alerts.
  - **Supplier:** Forecast demand, suggest pricing adjustments, flag inventory risks.
  - **Factoring:** Assess credit risk, portfolio yield insights, anomaly detection.
  - **Shipping:** Route optimization, delivery consolidation, fuel cost predictions.
  - **Admin:** System health, fee tracking anomalies, cross-tenant audit flags.

### G7. UI STANDARD: DARK MODE GLASSMORPHISM

- **Theme:** Dark Mode Glassmorphism — translucent layers, high whitespace, institutional-grade financial interface.
- **Tech stack:** shadcn/ui + Tailwind CSS v4 only.
- **Color palette:** Professional greys, brand accent (derive from logo), high-contrast white text. No neon, no gradients as primary backgrounds.
- **Visual goal:** This is a B2B fintech dashboard, not a consumer app. Density is medium-high. Data tables are primary. Cards use subtle glass borders (`backdrop-blur`, `bg-white/5`, `border-white/10`).
- **DO NOT build landing-page marketing UI inside dashboards.** The marketing site lives in `app/(marketing)/`. Dashboards are functional tools.

### G8. DIRECTORY ENFORCEMENT

| Rule | Penalty for Violation |
|------|----------------------|
| All new pages go in `(marketing)`, `(auth)`, or `(dashboard)/[role]` | Reject PR |
| All new API routes go in `api/v1/` | Reject PR |
| All UI primitives go in `components/ui/` | Reject PR |
| All business logic services go in `lib/` subdirectories | Reject PR |
| No code in `app/(app)/` — deprecated | Reject PR |
| No code in `src/app/` — stale boilerplate | Reject PR |
| No client-side role/tenant state | Reject PR |

### G9. API VERSIONING

- **All new API routes MUST be under `app/api/v1/`.**
- **Legacy flat routes (`app/api/auth/*`, `app/api/orders/*`, etc.) are DEPRECATED.** They will be removed in Phase 6 of the migration.
- **Do not add new endpoints to legacy flat routes.** Migrate existing consumers to `/api/v1/` equivalents.

### G10. FINTECH & RISK LAYER (Non-Negotiable)

- **Payment Guarantee Gate:** No order may transition to `CONFIRMED`, `IN_TRANSIT`, or `DELIVERED` without `order.paymentGuaranteed = true`. This is an ABSOLUTE rule.
- **ETA Factoring Gate:** No factoring request may proceed without a valid ETA UUID (`etaStatus = ACCEPTED` or `VALIDATED`). The `lib/eta/validator.ts` enforces this.
- **Platform Fee Priority:** The Hub-Revenue Calculator deducts the platform fee BEFORE the factoring partner fee. The hub is always paid first.
- **Non-Recourse Only:** All factoring through the platform is non-recourse. The supplier has zero default risk. Factoring partners price risk into their discount rate.
- **Smart Fix Autonomy:** When a hotel is blocked by credit/risk, the `lib/fintech/risk-engine.ts` autonomously generates fixes (Deposit, High-Risk Factoring, Split Payment, Auto Limit Extension). No manual intervention required.
- **Admin Override Dual Authorization:** Any admin override of the Authority Matrix requires TWO admin signatures, a 20+ character reason, and generates an escalated alert.
- **TCP Report:** The "Total Cost of Procurement" report must be available for any order to counter the "cheaper offline" objection.

### G11. BEFORE YOU WRITE CODE

- If your change touches **auth, RBAC, tenant isolation, or the Authority Matrix**, you MUST read `/docs/ARCHITECTURE_OVERHAUL_PLAN.md` first.
- If your change touches **ETA integration**, you MUST read `/docs/eta-integration.md` and confirm with the Integration Lead.
- If your change touches **factoring, risk scoring, or payment guarantees**, you MUST read `/docs/fintech-engine-spec.md` and `/docs/authority-matrix-spec.md`.
- If your change creates a **new API route**, you MUST provide Zod validation + RBAC enforcement + tenant scoping in the same PR.
- If you are unsure, write an RFC in `/docs/` and ask for user direction.

---

**Rule for all agents:** If you are unsure which domain a change belongs to, default to writing a brief RFC in a markdown file under `/docs/` and ask for user direction before touching production code.
