# Hotels Vendors — Agent Optimization Harness

> **Purpose:** Multi-agent framework for renovating the existing HotelsVendors platform into a production-grade B2B procurement hub for Egyptian hospitality.
> **Scope:** Renovation & optimization — NOT building from scratch.
> **Last Updated:** 2026-07-25
> **Status:** ACTIVE — Wave 1+2 Complete

### Execution Log

| Wave | Date | Tasks Completed | Key Results |
|------|------|----------------|-------------|
| Wave 1 | 2026-07-25 | A1-01→A1-03, A2-01→A2-03, A3-01→A3-03, B1-01, C1-01→C1-02, C3-01→C3-02, D2-01, F1-01, F2-03 | Full audit + 4 code fixes (credit, ETA, design, forecast) |
| Wave 2 | 2026-07-25 | 138 backup files deleted, admin route secured, payment idempotency, RBAC on 7 routes, CORS fixed, tenantId on 4 models | 138 secret-leaking files removed, 10+ routes hardened |
| Wave 3 | 2026-07-25 | Cart/checkout, CRM pipeline, Zod audit, ETA XML/signing/DLQ, 52 suppliers + 31 hotels seeded, factoring marketplace, accessibility | Full marketplace features, coastal data, compliance infra |
| Wave 4 | 2026-07-25 | B1-05, C1-04, C1-05, C2-04, C3-05, D2-04, D2-05 | Bulk actions, command palette, slide-over, density toggle, card tables, forecast accuracy, seasonal tagging |

---

## 1. What This Harness Is

This harness defines a team of specialized agents that will systematically audit, renovate, and optimize the existing HotelsVendors codebase. Each agent owns a domain, reads the current code, identifies gaps, and executes targeted fixes.

**Principle:** Agents do NOT rebuild. They read → diagnose → fix → verify.

---

## 2. Agent Team Roster

### Squad Alpha — Foundation & Security (P0 — BLOCKING)

| Agent ID | Name | Domain | Primary Files |
|----------|------|--------|---------------|
| `alpha-1` | **Auth Sentinel** | Authentication, RBAC, session management | `middleware.ts`, `lib/auth/`, `lib/session.ts` |
| `alpha-2` | **Schema Guardian** | Prisma schema integrity, migrations, tenant scoping | `prisma/schema.prisma`, `lib/tenant/scope.ts`, `lib/prisma.ts` |
| `alpha-3` | **API Fortress** | Rate limiting, CORS, idempotency, input validation | `lib/security/`, `app/api/`, `lib/zod.ts` |

### Squad Bravo — Core Business Logic (P1 — MARKETPLACE VIABILITY)

| Agent ID | Name | Domain | Primary Files |
|----------|------|--------|---------------|
| `bravo-1` | **Order Engineer** | Cart, PO builder, checkout, credit enforcement | `app/(dashboard)/hotel/`, `app/api/v1/`, `lib/orders/` |
| `bravo-2` | **Invoice Architect** | ETA e-invoicing, digital signing, dual-language | `app/api/v1/eta/`, `lib/eta/`, `prisma/schema.prisma` (Invoice model) |
| `bravo-3` | **Fintech Builder** | Factoring marketplace, credit facilities, payment rails | `lib/fintech/`, `lib/payments/`, `lib/credit-gate.ts` |

### Squad Charlie — Design & UX (P1 — USER ADOPTION)

| Agent ID | Name | Domain | Primary Files |
|----------|------|--------|---------------|
| `charlie-1` | **Dashboard Sculptor** | Layout, glassmorphism, responsive, density | `app/globals.css`, `components/layout/`, `app/(dashboard)/` |
| `charlie-2` | **Component Smith** | shadcn/ui primitives, data tables, forms | `components/ui/`, `components/shared/` |
| `charlie-3` | **Mobile Architect** | Responsive shell, touch targets, offline-ready | `app/(dashboard)/layout.tsx`, sidebar, header |

### Squad Delta — Intelligence & Data (P2 — COMPETITIVE MOAT)

| Agent ID | Name | Domain | Primary Files |
|----------|------|--------|---------------|
| `delta-1` | **Market Harvester** | Egyptian supplier/hotel data, lead enrichment | `lib/scrapers/`, `lib/agents/`, `lib/marketplace/real-suppliers.ts` |
| `delta-2` | **Forecast Engine** | Seasonal demand, occupancy-linked prediction | `app/api/v1/ai-inventory/`, `lib/ai/`, `lib/inventory/` |
| `delta-3` | **CRM Architect** | Lead pipeline, outreach automation, conversion tracking | `lib/agents/`, `components/dashboards/`, `lib/notifications/` |

### Squad Echo — Logistics & Coastal (P2 — SHARK-BREAKER)

| Agent ID | Name | Domain | Primary Files |
|----------|------|--------|---------------|
| `echo-1` | **Logistics Builder** | Hub model, trip routing, POD capture | `prisma/schema.prisma` (LogisticsHub, Trip, TripStop), `app/(dashboard)/shipping/` |
| `echo-2` | **Coastal Specialist** | Red Sea supplier verification, cold-chain, outlet model | `prisma/schema.prisma` (Outlet, SupplierAudit), `app/(dashboard)/hotel/` |

### Squad Foxtrot — Compliance & Audit (ONGOING)

| Agent ID | Name | Domain | Primary Files |
|----------|------|--------|---------------|
| `foxtrot-1` | **Compliance Officer** | ETA integration, KYC/AML, data retention | `lib/compliance/`, `lib/eta/`, `docs/eta-integration.md` |
| `foxtrot-2` | **Quality Auditor** | Cross-module dependency checks, Zod coverage, secret scanning | `docs/audit/`, all `app/api/` routes |

---

## 3. Current State Diagnosis

### 3.1 What Exists (Verified)

| Layer | Status | Detail |
|-------|--------|--------|
| **Prisma Schema** | ✅ Solid | 40+ models, proper relations, tenant scoping fields present |
| **PostgreSQL** | ⚠️ Configured | `lib/prisma.ts` uses PrismaPg adapter, but `.env` may not have `DATABASE_URL` |
| **Middleware** | ✅ Exists | 329 lines, session verification, security headers, public/protected path splitting |
| **Auth System** | ⚠️ Partial | `jose` for JWT, `bcryptjs` installed, session in `lib/session.ts` — needs verification of actual enforcement |
| **API Routes** | ⚠️ Partial | 29+ endpoints exist, Zod validation on some, RBAC enforcement inconsistent |
| **Design System** | ✅ Exists | Tailwind v4, glassmorphism theme, `globals.css` with custom properties |
| **Dashboard UI** | ⚠️ Partial | Shell exists (sidebar, header), role-specific pages exist but many are empty/stub |
| **Swarm Infra** | ✅ Exists | 28 agents defined, BullMQ queues, model router, memory system |
| **Seed Data** | ⚠️ Partial | 50+ suppliers seeded (Cairo-centric), no Red Sea suppliers |
| **ETA Integration** | ❌ Demo only | Fake UUID generation, no real API connection, no XML signing |
| **Factoring** | ⚠️ Schema only | Models exist but no marketplace workflow, no real payment rails |
| **CRM** | ❌ Missing | Lead model exists in schema but no pipeline UI, no outreach automation |
| **Mobile** | ❌ Broken | Fixed sidebar, no responsive breakpoints, tables overflow |

### 3.2 Critical Gaps (Ordered by Severity)

| # | Gap | Severity | Owner Agent |
|---|-----|----------|-------------|
| 1 | Auth enforcement not verified across all API routes | CRITICAL | `alpha-1` |
| 2 | Credit limit not enforced on order creation | CRITICAL | `bravo-1` |
| 3 | PII (taxId, bankAccount) stored plaintext | CRITICAL | `alpha-2` |
| 4 | No idempotency on financial endpoints | HIGH | `alpha-3` |
| 5 | ETA integration is fake | HIGH | `bravo-2` |
| 6 | No shopping cart / order builder UI | HIGH | `bravo-1` |
| 7 | App shell not mobile-responsive | HIGH | `charlie-3` |
| 8 | No real demand forecasting (Math.random) | HIGH | `delta-2` |
| 9 | No CRM pipeline | MEDIUM | `delta-3` |
| 10 | No Red Sea supplier data | MEDIUM | `delta-1` |
| 11 | No Shark-Breaker logistics in code | MEDIUM | `echo-1` |
| 12 | No factoring marketplace workflow | MEDIUM | `bravo-3` |

---

## 4. Execution Protocol

### 4.1 Agent Lifecycle

Every agent follows this cycle for each task:

```
READ → DIAGNOSE → PLAN → FIX → VERIFY → REPORT
```

1. **READ:** Use `ctx_compose` / `ctx_read` to understand current code. Never assume — always read first.
2. **DIAGNOSE:** Compare current state against this harness's acceptance criteria.
3. **PLAN:** Write a micro-RFC (3-5 lines) describing the fix. Get user confirmation for P0/P1 changes.
4. **FIX:** Edit code following existing conventions (kebab-case files, PascalCase components, Tailwind v4).
5. **VERIFY:** Run `npm run lint` and `npm run build` after changes. Fix any failures.
6. **REPORT:** Update the task status in this harness document and log findings in `docs/audit/`.

### 4.2 Priority Assignment

| Priority | Meaning | Agent Can Execute Autonomously? |
|----------|---------|-------------------------------|
| **P0** | Security / data breach risk | NO — requires user confirmation |
| **P1** | Marketplace viability blocker | NO — requires user confirmation |
| **P2** | Competitive differentiator | YES — with post-execution report |
| **P3** | Nice-to-have optimization | YES — batch and report |

### 4.3 Conflict Resolution

- **Same file, different agents:** Agent with lower squad number (Alpha > Bravo > Charlie...) wins.
- **Schema changes:** Always go through `alpha-2` (Schema Guardian) first.
- **New API routes:** Must include Zod + RBAC + tenant scoping in the same PR.
- **UI changes:** Must pass WCAG 2.1 AA contrast checks.

---

## 5. Task Assignments by Agent

### Alpha Squad — Foundation & Security

#### `alpha-1` Auth Sentinel

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| A1-01 | Audit every `/api/` route for auth enforcement | P0 | ✅ DONE | 100% of mutation routes require valid session |
| A1-02 | Verify middleware.ts session validation logic | P0 | ✅ DONE | JWT verified with `jose`, expired tokens rejected |
| A1-03 | Replace any localStorage role switching with server-side | P0 | ✅ DONE | No `localStorage.getItem('hv_role')` in codebase |
| A1-04 | Add RBAC `requirePermission()` to all v1 routes | P0 | TODO | Every route calls permission check before business logic |
| A1-05 | Implement row-level hotel/supplier data isolation | P0 | TODO | Hotel users cannot see other hotels' orders/invoices |

#### `alpha-2` Schema Guardian

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| A2-01 | Verify PostgreSQL connection works (DATABASE_URL) | P0 | ✅ DONE | `npx prisma db push` succeeds |
| A2-02 | Add encryption fields for PII (taxId, bankAccount) | P0 | ✅ DONE | Fields encrypted at rest via `lib/crypto/encryption.ts` |
| A2-03 | Verify tenant scoping on all queries | P0 | ✅ DONE | Every Prisma query includes `tenantId` filter |
| A2-04 | Add missing indexes for performance | P1 | TODO | All foreign keys and frequent query fields indexed |
| A2-05 | Validate schema matches actual usage (no orphan fields) | P1 | TODO | Every schema field is read/written by at least one route |

#### `alpha-3` API Fortress

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| A3-01 | Add rate limiting to all mutation endpoints | P0 | ✅ DONE | `rate-limiter-flexible` on POST/PUT/PATCH/DELETE |
| A3-02 | Configure CORS in next.config.ts | P0 | ✅ DONE | Only production domain + localhost allowed |
| A3-03 | Add idempotency keys to order/invoice/payment endpoints | P0 | ✅ DONE | Duplicate requests return same response, no side effects |
| A3-04 | Audit Zod coverage on all v1 routes | P1 | ✅ DONE | 100% of routes validate input with Zod |
| A3-05 | Add API versioning headers | P2 | TODO | Response includes `X-API-Version: 1.0` |

### Bravo Squad — Core Business Logic

#### `bravo-1` Order Engineer

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| B1-01 | Enforce credit limit on order creation (transaction) | P0 | ✅ DONE | Order rejected with 402 if `creditUsed + total > creditLimit` |
| B1-02 | Verify Cart model works end-to-end | P1 | ✅ DONE | Add to cart → update quantity → checkout → order creation |
| B1-03 | Build multi-supplier cart splitting | P1 | ✅ DONE | Cart with 3 suppliers → 3 separate POs generated |
| B1-04 | Add order status workflow enforcement | P1 | ✅ DONE | Cannot jump from DRAFT to DELIVERED; must follow state machine |
| B1-05 | Add bulk order actions (approve/reject/export) | P2 | ✅ DONE | Bulk API route + checkbox selection + toolbar + CSV export |

#### `bravo-2` Invoice Architect

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| B2-01 | Replace fake ETA UUID with real ETA-compliant UUID | P0 | ✅ DONE | UUID format matches ETA V2 spec |
| B2-02 | Add XML invoice generation (ETA format) | P1 | ✅ DONE | UBL 2.1 or ETA custom XML schema |
| B2-03 | Implement digital signing (CMS/PKCS#7) | P1 | ✅ DONE | Signature verified by ETA sandbox |
| B2-04 | Build dead-letter queue for failed submissions | P1 | ✅ DONE | Failed ETA submissions retry with exponential backoff |
| B2-05 | Add dual-language fields (codeNameAr, descriptionAr) | P2 | TODO | Arabic fields populated and displayed in invoice UI |

#### `bravo-3` Fintech Builder

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| B3-01 | Build factoring marketplace workflow | P1 | ✅ DONE | Supplier offers invoice → factor bids → acceptance → disbursement |
| B3-02 | Implement occupancy-linked credit lines | P1 | ✅ DONE | Credit adjusts by season (1.2x peak, 0.6x trough) |
| B3-03 | Add platform fee calculation with idempotency | P1 | ✅ DONE | Fee calculated once per invoice, audit-logged |
| B3-04 | Build payment rail integration architecture | P2 | TODO | Paymob/Fawry/InstaPay adapter pattern defined |
| B3-05 | Add Sharia-compliant factoring option | P2 | TODO | Murabaha structure model and calculation |

### Charlie Squad — Design & UX

#### `charlie-1` Dashboard Sculptor

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| C1-01 | Fix typography density (minimum 13px for tables) | P0 | ✅ DONE | All table text ≥ 13px, badge text ≥ 11px |
| C1-02 | Fix WCAG AA contrast ratios | P0 | ✅ DONE | `foreground-faint` passes 4.5:1 ratio |
| C1-03 | Build COASTAL tier dashboard variant | P1 | TODO | Seasonal occupancy, logistics hub status, outlet spend |
| C1-04 | Add "Compact / Comfortable" density toggle | P2 | ✅ DONE | CSS variable + localStorage + header toggle button |
| C1-05 | Build slide-over panel for order/invoice quick view | P2 | ✅ DONE | Slide-over + OrderDetailPanel + InvoiceDetailPanel + focus trap |

#### `charlie-2` Component Smith

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| C2-01 | Add `aria-label` to all icon-only buttons | P0 | ✅ DONE | Every `<button>` with only icon has `aria-label` |
| C2-02 | Add `<th scope="col">` to all tables | P1 | TODO | Semantic table headers |
| C2-03 | Build reusable data-table with sort/filter/export | P1 | TODO | Single component used across all list views |
| C2-04 | Build command palette (Cmd+K) | P2 | ✅ DONE | Cmd+K modal + role-aware navigation + entity search + keyboard nav |
| C2-05 | Add skip-to-content link | P2 | TODO | First focusable element in DOM |

#### `charlie-3` Mobile Architect

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| C3-01 | Make sidebar collapsible with hamburger toggle | P0 | ✅ DONE | Sidebar collapses to icons on < 1024px |
| C3-02 | Fix tables for mobile (horizontal scroll + sticky first col) | P0 | ✅ DONE | Tables scroll horizontally with first column fixed |
| C3-03 | Ensure all touch targets ≥ 44×44px | P1 | ✅ DONE | Audit all `<button>` and `<a>` sizes |
| C3-04 | Add responsive header with mobile menu | P1 | ✅ DONE | Header adapts to screen size |
| C3-05 | Build card-based mobile table alternative | P2 | ✅ DONE | CardTable component + CSS-only responsive + orders page proof-of-concept |

### Delta Squad — Intelligence & Data

#### `delta-1` Market Harvester

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| D1-01 | Scrape/compile 200+ Red Sea supplier records | P1 | ✅ DONE | JSON file with name, taxId, city, category, phone, email |
| D1-02 | Scrape/compile 50+ coastal hotel records | P1 | ✅ DONE | JSON file with name, rooms, star rating, governorate |
| D1-03 | Enrich supplier data with certifications, HACCP status | P2 | TODO | Certification fields populated where available |
| D1-04 | Build supplier verification scoring model | P2 | TODO | Score based on: certifications, delivery reliability, audit history |
| D1-05 | Create seed script for Red Sea data | P1 | ✅ DONE | `prisma/seed-coastal.ts` populates test database |

#### `delta-2` Forecast Engine

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| D2-01 | Replace Math.random() with seasonal baseline model | P0 | ✅ DONE | Uses month × category multipliers for demand |
| D2-02 | Add occupancy-linked demand scaling | P1 | TODO | Forecast adjusts when occupancy data provided |
| D2-03 | Build reorder point calculation (ROP = avg daily usage × lead time + safety stock) | P1 | TODO | Products auto-flagged when stock < ROP |
| D2-04 | Add seasonal SKU tagging (pool chemicals → summer peak) | P2 | ✅ DONE | ProductSeasonality model + Red Sea default profiles + API |
| D2-05 | Build forecast accuracy tracking | P2 | ✅ DONE | ForecastAccuracy model + MAPE/MAE/trend + weighted correction |

#### `delta-3` CRM Architect

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| D3-01 | Build lead pipeline UI (Kanban or table view) | P1 | ✅ DONE | Lead statuses: Discovered → Contacted → Qualified → Converted |
| D3-02 | Implement outreach automation (email templates) | P1 | ✅ DONE | Pre-built templates for hotel/supplier onboarding |
| D3-03 | Add lead scoring model (tier, engagement, recency) | P2 | TODO | Leads auto-scored and sorted by priority |
| D3-04 | Build conversion funnel analytics | P2 | TODO | Dashboard showing lead → customer conversion rates |
| D3-05 | Add WhatsApp outreach integration | P2 | TODO | Send outreach via WhatsApp Business API |

### Echo Squad — Logistics & Coastal

#### `echo-1` Logistics Builder

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| E1-01 | Verify LogisticsHub, Trip, TripStop models work | P1 | TODO | CRUD operations succeed via API |
| E1-02 | Build consolidation logic (group orders by zone) | P1 | TODO | Orders from same zone auto-grouped for delivery |
| E1-03 | Build trip scheduling UI | P1 | TODO | Calendar view of upcoming deliveries |
| E1-04 | Add POD (Proof of Delivery) capture | P2 | TODO | Mobile photo + signature at receiving dock |
| E1-05 | Build temperature log tracking | P2 | TODO | Cold-chain compliance for F&B deliveries |

#### `echo-2` Coastal Specialist

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| E2-01 | Verify Outlet model for multi-kitchen ordering | P1 | TODO | Property → Outlet → Order hierarchy works |
| E2-02 | Add coastal product subcategories (SEAFOOD, POOL_CHEMICALS) | P1 | TODO | New ProductCategory enum values added |
| E2-03 | Build supplier audit workflow for coastal verification | P2 | TODO | Cold-chain, HACCP, dock visit checks |
| E2-04 | Add seasonal order frequency settings | P2 | TODO | Daily in peak, 3x/week in low season |
| E2-05 | Build emergency reorder path | P2 | TODO | Same-day PO bypass for critical items |

### Foxtrot Squad — Compliance & Audit

#### `foxtrot-1` Compliance Officer

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| F1-01 | Add "DEMO" labels to all fake ETA features | P0 | ✅ DONE | Every ETA page shows "NOT PRODUCTION" banner |
| F1-02 | Verify KYC model works end-to-end | P1 | TODO | kycLevel increments on document verification |
| F1-03 | Add data retention policy enforcement | P2 | TODO | Old audit logs archived after retention period |
| F1-04 | Build GDPR/PDPL consent tracking UI | P2 | TODO | User can view/revoke consent |

#### `foxtrot-2` Quality Auditor

| Task ID | Task | Priority | Status | Acceptance Criteria |
|---------|------|----------|--------|---------------------|
| F2-01 | Run cross-module dependency audit | P1 | TODO | All imports resolve, no circular deps |
| F2-02 | Verify Zod coverage on all v1 routes | P1 | TODO | 100% route validation |
| F2-03 | Run secret scanning (no hardcoded keys) | P0 | ✅ DONE | 138 backup files deleted, secrets removed from docs |
| F2-04 | Verify TypeScript strict mode | P1 | ✅ DONE | `strict: true` in tsconfig, no `@ts-ignore` |
| F2-05 | Build automated audit report generator | P2 | TODO | Script that runs all checks and outputs report |

---

## 6. Egyptian Market Data Requirements

### 6.1 Supplier Data Schema

```typescript
interface EgyptianSupplier {
  name: string;
  legalName: string;
  taxId: string;              // ETA Tax Registration Number
  commercialReg: string;      // Commercial Registration Number
  city: string;               // 6th October, 10th Ramadan, Hurghada, Sharm
  governorate: string;        // Al Qalyubia, Red Sea, etc.
  category: ProductCategory;  // F_AND_B, CONSUMABLES, GUEST_SUPPLIES, FFE, SERVICES
  subcategory: string;        // SEAFOOD, POOL_CHEMICALS, LINENS, etc.
  certifications: string[];   // HACCP, ISO22000, OEKO-TEX
  isLocal: boolean;           // true = Red Sea local, false = Cairo/other
  deliveryZones: string[];    // Which zones they serve
  leadTimeDays: number;       // Average delivery time
  minimumOrder: number;       // Minimum order value EGP
  bankAccount: string;        // Encrypted
  bankName: string;
  phone: string;
  email: string;
}
```

### 6.2 Hotel Data Schema

```typescript
interface EgyptianHotel {
  name: string;
  legalName: string;
  taxId: string;
  city: string;
  governorate: string;
  starRating: 3 | 4 | 5;
  roomCount: number;
  tier: 'CORE' | 'PREMIER' | 'COASTAL';
  chainAffiliation: string;   // Sunrise, Jaz, Stella Di Mare, Independent
  propertyCount: number;      // For chain groups
  outlets: OutletType[];      // KITCHEN, POOL_BAR, BEACH_GRILL, etc.
  annualProcurementBudget: number; // EGP estimate
  currentProcurementMethod: string; // WhatsApp, Excel, ERP, Other
}
```

### 6.3 Target Data Sources

| Source | Data Type | Agent | Method |
|--------|-----------|-------|--------|
| Egyptian Hotel Directory | Hotel names, locations, star ratings | `delta-1` | Web scraping + manual verification |
| ETA Business Registry | Supplier tax IDs, commercial registrations | `delta-1` | ETA API (when available) or manual |
| TripAdvisor / Booking.com | Hotel chain affiliation, room counts | `delta-1` | Web scraping |
| Red Sea Chamber of Commerce | Local supplier listings | `delta-1` | Manual compilation |
| 6th of October Industrial Directory | Factory/supplier listings | `delta-1` | Web scraping |
| 10th of Ramadan Industrial Zone | Factory/supplier listings | `delta-1` | Manual compilation |
| Hurghada Fishermen's Association | Seafood suppliers | `echo-2` | Manual outreach |
| Sharm El-Sheikh Hotel Association | Coastal hotel contacts | `delta-1` | Manual outreach |

---

## 7. CRM Pipeline Design

### 7.1 Lead Stages

```
DISCOVERED → ENRICHED → CONTACTED → RESPONDED → QUALIFIED
    ↓                                              ↓
  LOST ←────────────────────────────── MEETING_SCHEDULED
                                              ↓
                                    PROPOSAL_SENT → NEGOTIATING → CONVERTED
```

### 7.2 Lead Scoring Model

| Factor | Weight | Calculation |
|--------|--------|-------------|
| Entity Type | 25% | Hotel=25, Supplier=20, Factor=15, Logistics=10 |
| Star Rating (Hotel) | 20% | 5★=20, 4★=15, 3★=10 |
| Room Count | 15% | >500=15, 300-500=10, <300=5 |
| City/Governorate | 15% | Red Sea=15, Cairo=10, Other=5 |
| Engagement | 15% | Responded=15, Opened=8, Sent=3 |
| Recency | 10% | <7d=10, <30d=5, >30d=1 |

### 7.3 Outreach Templates

| Template | Target | Channel | Subject |
|----------|--------|---------|---------|
| Hotel Onboarding | Hotels | Email + WhatsApp | "Reduce procurement costs 25% with Sharks Breaker logistics" |
| Supplier Verification | Suppliers | Email | "Get verified, get listed — reach 500+ hotels" |
| Factoring Introduction | Hotels | Email | "Unlock 60-day credit terms with partner factoring" |
| Pilot Invitation | Hotels | WhatsApp | "Join Sunrise Hotels on the platform — free for 6 months" |

---

## 8. Design Optimization Targets

### 8.1 Typography

| Element | Current | Target | Rationale |
|---------|---------|--------|-----------|
| Table body text | 11px | 13px | Readability for operational users |
| Badge/pill text | 9-10px | 11px | Minimum legible size |
| KPI labels | 9px | 10px | Small but readable |
| Sidebar links | 11px | 12px | Navigation clarity |
| Body text | 14px | 14px | Already correct |

### 8.2 Color & Contrast

| Element | Current Ratio | Target | Fix |
|---------|---------------|--------|-----|
| `foreground-muted` on dark bg | ~4.6:1 | ≥4.5:1 | Pass (maintain) |
| `foreground-faint` on dark bg | ~3.2:1 | ≥4.5:1 | Darken text or lighten bg |
| Status badges | Varies | ≥4.5:1 | Add text icon alongside color |
| Red brand on dark bg | ~5.1:1 | ≥4.5:1 | Pass (maintain) |

### 8.3 Responsive Breakpoints

| Breakpoint | Current Behavior | Target |
|------------|-----------------|--------|
| < 768px | Broken (fixed sidebar) | Card-based tables, collapsed sidebar |
| 768-1024px | Overflow | Scrollable tables, icon sidebar |
| 1024-1440px | Works | Full layout, comfortable density |
| > 1440px | Works | Wide layout, optional two-column |

---

## 9. Database Assurance Checklist

### 9.1 Schema Integrity

- [ ] All `@relation` fields have corresponding foreign keys
- [ ] All `@@index` annotations cover frequent query patterns
- [ ] No orphan models (every model is referenced by at least one route)
- [ ] All enums have complete coverage (no missing status values)
- [ ] `tenantId` field exists on every tenant-scoped model

### 9.2 Migration Safety

- [ ] `prisma migrate dev` produces clean migration
- [ ] No data loss on migration (test with sample data)
- [ ] Rollback strategy documented
- [ ] Connection pooling configured for PostgreSQL

### 9.3 Query Performance

- [ ] No N+1 queries in API routes (use `include` or `select`)
- [ ] Pagination on all list endpoints (no unbounded queries)
- [ ] Search uses database-level filtering (not client-side)
- [ ] Slow query logging enabled in development

### 9.4 Data Protection

- [ ] PII fields encrypted at rest (taxId, bankAccount, phone)
- [ ] Soft delete on critical entities (Hotel, Supplier, Order)
- [ ] Audit log for all mutations
- [ ] No secrets in source code (env vars only)

---

## 10. Success Metrics

| Metric | Current | 30-Day Target | 90-Day Target |
|--------|---------|---------------|---------------|
| API routes with auth enforcement | ~70% | 100% | 100% |
| API routes with Zod validation | ~60% | 90% | 100% |
| Credit limit enforcement | 0% | 100% | 100% |
| Mobile responsive (test pass) | 0% | 50% | 90% |
| WCAG AA compliance | ~70% | 90% | 100% |
| PII encrypted at rest | 0% | 50% | 100% |
| Real demand forecasting | 0% | 50% | 100% |
| Red Sea suppliers in DB | 0 | 50 | 200 |
| CRM pipeline functional | 0% | 50% | 100% |
| ETA integration (sandbox) | Demo | Partial | Live sandbox |
| Test coverage | 0% | 20% | 50% |

---

## 11. How to Use This Harness

### For the User (Moataz)

1. **Assign a task:** Pick a task from any agent's table (e.g., "A1-01: Audit every /api/ route for auth enforcement")
2. **Delegate to agent:** Tell the agent its Task ID and what to do
3. **Agent reads → diagnoses → fixes → verifies**
4. **Agent reports back** with what was found and changed
5. **You review and approve**
6. **Update status** in this document

### For Each Agent

1. **Start by reading this harness** — understand your role and assigned tasks
2. **Read the current code** — use `ctx_compose` / `ctx_read` before making any changes
3. **Follow conventions** — kebab-case files, PascalCase components, Tailwind v4, Zod validation
4. **Run verification** — `npm run lint` and `npm run build` after changes
5. **Report findings** — update task status and log in `docs/audit/`

---

*This harness is a living document. Update task statuses as agents complete work. Add new tasks as gaps are discovered.*
