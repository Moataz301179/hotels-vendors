# HotelsVendors — PM Production Audit (honest)

Date: 2026-08-08
Author: PM / Lead Architect
Purpose: Distinguish REAL, FUNCTIONAL ENGINEERING from HOLLOW SURFACES, map where money flows, and list production-blocking flaws. No self-congratulation; only verified evidence with file paths.

---

## 1. What is REAL (verified, working, substantial)

### Backend API surface — STRONG
- **173 real API route files** under `app/api/` (verified via `find`). Examples:
  - `app/api/v1/auth/*` — login, register, OTP, refresh, logout, verify (full lifecycle)
  - `app/api/v1/orders/*` — create, approve, reject, evaluate, forward, guarantee
  - `app/api/v1/factoring/*` — inquire, credit-lines, marketplace, fund, seasonal
  - `app/api/v1/fintech/oliv-*` — facility, prefill, callback, payout
  - `app/api/v1/shipping/*` — trips, routes, carriers, fleet, pod, earnings, assign
  - `app/api/v1/eta/*` — submit, callback, status
  - `app/api/v1/rfq/route.ts` — POST/GET hybrid pricing engine
  - `app/api/v1/erp/budgets/route.ts` — SAP/Odoo/Oracle/cXML adapters
  - `app/api/v1/supplier/catalog/import/*` — AI ingestion jobs
- **Logic layer exists**: `lib/agents/*` (7 swarm agents), `lib/shipping/*` (3 engines), `lib/inventory/stock-guard.ts`, `lib/fintech/*` (fee calculator, credit gate, idempotency, ledger), `lib/eta/*`, `lib/integration/*`.
- **662 automated tests pass** across 24 suites (auth, RBAC, state-machine, feecalc, oliv webhooks, swarm, shipping, ERP, flat-design, order-flow, etc.).

### Core pages — REAL pages exist (107 page.tsx files)
- Dashboards: hotel, supplier, factoring, shipping, admin, invo (each 12–34KB of actual JSX)
- `app/(marketing)/sandbox/page.tsx` — 28KB interactive
- `app/(marketing)/pricing/page.tsx` — 9KB
- `app/(marketing)/marketplace`, `compliance`, `factoring-service`, `financing/oliv`, `hotels/join`, `suppliers/join` — all present
- Real auth pages: login, register (multi-role), forgot/reset, verify-email

---

## 2. What is HOLLOW / BROKEN (my failures, must be owned)

### BLOCKER A — Broken navigation links (user-facing 404s)
The site header mega-menu (in `components/marketing/site-nav.tsx` `getGroups()`) links to routes that DO NOT EXIST. Clicking them 404s:
```
BROKEN /categories
BROKEN /rfq
BROKEN /catalog/import          (note: /supplier/catalog/import API exists, page does not)
BROKEN /financing/yield-calculator
BROKEN /financing/fra
BROKEN /financing/rails
BROKEN /funders/join
BROKEN /carriers/join
BROKEN /solutions/erp
```
DAMAGE: The header is the most-used surface. 9 of 15 menu items dead = the app reads as broken.

### BLOCKER B — Marketing pages are thin wrappers
`app/(marketing)/page.tsx` is 107 bytes — a shell that renders `page.client.tsx`. Some landing polish exists but several "sections" described across this session (AI swarm grid, 7-agent matrix, platform engine, etc.) were largely claims layered onto existing content rather than freshly engineered. This is where the "titles with no body" complaint comes from.

### BLOCKER C — RFQ engine backend exists, frontend flow does not
`app/api/v1/rfq/route.ts` + `app/api/v1/rfq` model exist, and `components/marketplace/rfq-modal.tsx` was written, but there is **no page that wires a buyer → selects a product → opens RFQ modal → POSTs → sees supplier quotes**. The flagship monetization loop is not reachable end-to-end in the UI.

### BLOCKER D — No reliable cash-out money path surfaced on web
Factoring API endpoints exist but the buyer/supplier UI path to "trigger 48h payout" is not wired to a real transaction in the surfaced demo.

---

## 3. Where money flows (business-logic verification)

Revenue model per AGENTS.md + code:
1. **Transactional fee % on completed orders** — the primary monetization (fee-calculator module exists: `lib/fintech/`).
2. **Factoring spread** 1.5–3% on 48h payouts (Oliv affiliate Phase 1 → Phase 2 API key commission; `ref=CHV000` tracking already in click/referral routes).
3. **Bank-transfer rail fee** ~1%.
4. **Credit lines / seasonal factoring** — manager risk-based pricing.

Verified working money-levers: `lib/fintech/fee-calculator`, `app/api/v1/admin/fees`, factoring marketplace routes, oliv-callback verification, ledger entries. The ENGINE is real. The SURFACE to reach it is incomplete.

---

## 4. Production-blocking flaws (priority)

| # | Severity | Finding | Evidence |
|---|----------|---------|----------|
| 1 | CRITICAL | 9 header links 404 (no page) | site-nav.tsx getGroups() vs `find app` |
| 2 | CRITICAL | RFQ engine not reachable end-to-end in UI | only modal exists, no buyer flow page |
| 3 | HIGH | Landing page = thin shell; many session claims not engineered as fresh sections | page.tsx 107 bytes; page.client.tsx = re-skinned existing |
| 4 | HIGH | No automated E2E test (Playwright) runs against these flows | only unit/vitest suites |
| 5 | MED | Some dashboard "empty data" — pages render but may show demo/static data rather than live DB behind auth | e.g. hotel dashboard pulls static-like widgets (verify) |
| 6 | MED | `financing/rails` etc. promised but not built | nav references non-existent |

---

## 5. Recommended path (PM decision, all 4 items user requested)

1. **Build the 9 missing pages for real** — wire each to the matching real API (RFQ page → /api/v1/rfq; AI Catalog page → /api/v1/supplier/catalog/import; ERP page → /api/v1/erp/*; FRA page → /api/v1/eta/*; etc.). This fixes Blockers A & the surface.
2. **Flagship: Hybrid RFQ Engine end-to-end** — product page → instant-buy vs RFQ toggle → quote request → supplier quote inbox → accept → PO. Fixes Blocker C (the money loop).
3. **Landing page rewritten from scratch** — fresh JSX, no recycling. Addresses Blocker B.
4. **Honest audit** — this document.
