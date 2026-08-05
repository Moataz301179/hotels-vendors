# Plan Architecture

Runs the Hotels Vendors architecture audit + refactoring directive: analyzes BOTH the web repo and the existing mobile app, produces a grounded gap-analysis report, and prepares for phased execution. Planning-only by default — no source changes until approved.

## Setup (do this first)

Clone the private mobile repo into a sibling directory so both codebases can be audited:

```bash
git clone https://github.com/Moataz301179/hotels-vendors-mobile.git ../hotels-vendors-mobile
```

If it already exists, run `git -C ../hotels-vendors-mobile pull`.

## Mission

You are a Senior Software Architect for "Hotels Vendors," a B2B hospitality ecosystem (two-layer: web command center + mobile operational layer). Audit the EXISTING code in BOTH repos against the business spec, then produce a grounded refactoring report. Do NOT write application code, alter schemas, or run migrations in this phase.

### Two codebases to analyze

1. **Web (this repo, `~/hotels-vendors`):** Next.js App Router + Prisma/Postgres + Supabase auth + custom RBAC + BullMQ/Redis.
2. **Mobile (`../hotels-vendors-mobile`):** React Native 0.86 + Expo SDK 57 + Zustand + Axios. Existing screens (auth, hotel catalog/cart/orders/invoices, supplier dashboard/orders/invoice-upload, credit-facility, oliv-activation) are a FIRST DRAFT and are expected to be REDESIGNED/REPLACED to match the spec. Your report must state what to keep, what to rewrite, and what to add.

## Phase 0 — Understand (mandatory before writing anything)

Read these ground-truth files:

Web repo:
1. `CLAUDE.md`, `AGENTS.md`, `PROJECT_STATE.md`
2. `lib/auth/rbac.ts`, `lib/auth/authority-matrix.ts`, `lib/auth/four-eyes.ts`, `lib/auth/state-machine.ts`
3. `lib/fintech/oliv-bridge.ts`, `lib/payments/oliv-checkout.ts`, `app/api/v1/oliv/kyc-status/route.ts`, `app/api/v1/fintech/oliv-callback/route.ts`
4. `app/invo/**` (existing web Invo), `prisma/schema.prisma` — focus on models: `Role`, `Permission`, `RolePermission`, `Order`, `OrderApproval`, `Invoice`, `OlivCreditFacility`, `Notification`, `InventorySnapshot`, `CreditFacility`
5. `docs/ARCHITECTURE_INVO_HV_SEPARATION.md`, `docs/BLUEPRINT_STRATEGY_INVO_HV.md`, `docs/ARCHITECTURE_OVERHAUL_PLAN.md`

Mobile repo:
6. `package.json` (RN 0.86 / Expo 57), `App.tsx`, `src/navigation/**`, `src/screens/**`, `src/api/index.ts`, `src/store/**`, `src/theme/index.ts`

Next.js version note: this repo runs a Next.js version with breaking changes — read `node_modules/next/dist/docs/` before any code work (per AGENTS.md).

Then STOP. Produce **Deliverable A** in `docs/planning/` (markdown + mermaid). Do NOT modify source code or schema. Wait for explicit approval before any execution.

## Business Spec

TWO-LAYER ecosystem: the mobile "Invo" app is the operational layer of the existing web platform, NOT a standalone app. We do NOT build Olive — Olive is a separate fintech partner that handles KYC + credit-line approval in its own app; Invo only deep-links/redirects to it. Shipping partners are a FUTURE phase — architecture must allow them without coupling.

Workflow to enforce: Internal Requisition (housekeeping scan-to-request) → Manager approval → Procurement converts to PO → Supplier accepts/rejects → Digital Invoice → Finance approves payment → "Pay via Credit Line" redirects to Olive app.

### RBAC Matrix (mandatory)

| Role | Access | Actions | Approval Limits |
|---|---|---|---|
| Hotel Dept. Staff | Mobile | scan QR/barcode → submit requisition; view status | N/A (submit only) |
| Hotel Dept. Manager | Mobile/Web | approve/reject internal requisitions | up to budget |
| Hotel Procurement | Mobile/Web | convert req→PO, send to suppliers, catalog view | standard PO |
| Hotel Finance | Web primary / Mobile secondary | review PO vs budget, approve final payment (redirect to Olive), manage deferred checks (web only) | high/unlimited |
| Supplier Sales/Delivery | Mobile | receive PO, accept/reject, generate invoice, mark shipped/delivered | N/A |
| Platform Admin | Web full access | full oversight & reporting, manage partners (Olive, shippers) | super user |

## Deliverable A — Architecture Report (`docs/planning/`)

1. **Gap analysis:** Compare existing `lib/auth/rbac.ts`, `state-machine.ts`, `oliv-bridge.ts`, `app/invo/**`, and the mobile app's screens/stores/api layer against the spec. List EXACT file paths for every gap: missing permission codes, missing `requirePermission()` enforcement points, uncovered state transitions, mobile-vs-web inconsistencies, security risks, performance bottlenecks (mobile first).
2. **RBAC enforcement plan:** which permission codes to add to `prisma/schema.prisma` + seed, and exactly where `requirePermission()` must be inserted in API routes.
3. **Data model changes:** precise new/changed Prisma models + fields for InternalRequisition, RequisitionItem, requisition→PO linkage, invoice states, credit-line payment redirects. No unnecessary models.
4. **Mobile architecture decision:** evaluate current React Native 0.86 + Expo 57 stack vs alternatives; recommend keep/rewrite per-screen. Design the monorepo layout for web + mobile sharing an API/types layer. Specify the deeplink/URI scheme for redirecting to Olive.
5. **UX blueprint for Invo:** scan-first, action-oriented, zero scroll walls, premium B2B aesthetic (deep blue, charcoal, matte gold), real product photography. Cover core screens: onboarding gateway (Olive), catalog, scan-to-request, approvals, PO, invoices, credit-line payment redirect.
6. **API/integration contract sketch:** how Invo syncs near-real-time with the web backend (REST/WebSocket choice), plus reserved seams for future Olive + shipping APIs.

## Execution (ONLY after explicit approval)

Apply changes phase-by-phase, verifying each before moving on:

1. Prisma schema + migration + seed (new roles/permissions/requisition models)
2. Backend: requisition/PO/invoice routes with RBAC enforced at every mutation
3. Mobile app redesign per approved blueprint (auth → onboarding gateway → catalog → scan-to-request)
4. Approval + PO + supplier flows + push notifications
5. Finance + credit-line redirect-to-Olive flow
6. Web dashboard read-views for all mobile-created data

Each phase: implement, then run `npm run build`, `npm run lint`, and relevant tests — fix failures before proceeding. No spec changes without asking the user.

## Output

- Path to the report: `docs/planning/` (list files created)
- Summary of top gaps found in both repos
- Explicit recommendation on mobile stack (keep RN/Expo vs migrate)
- Clear statement that no code was changed (unless user approved execution)
