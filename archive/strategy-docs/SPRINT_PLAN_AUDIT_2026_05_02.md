# Sprint Plan — Post-Audit 2026-05-02

> **Audit Date:** 2026-05-02  
> **Scope:** Hotels Vendors Digital Procurement Hub  
> **Status:** Zero TypeScript errors, deep business logic, critical security/structural gaps

---

## Executive Summary

The project compiles cleanly and has surprisingly robust fintech, ETA, and authority matrix engines. However, **6 critical gaps block production readiness**:

1. No `middleware.ts` — all routes are publicly accessible
2. Deprecated `role-context.tsx` still active — `localStorage` role switching vulnerability
3. No `Tenant` model or `tenantId` fields — zero isolation
4. No `Role`/`Permission` models — RBAC is hardcoded enums
5. `authenticate()` trusts client `x-tenant-id` header — tenant spoofing risk
6. `components/ui/` empty, dashboards hardcoded, path structure wrong

---

## Phase 1 — Security Lockdown (Week 1)

**Goal:** Close all critical security gaps before any data enters the system.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 1.1 | Delete `components/app/role-context.tsx` and all imports | `components/app/role-context.tsx`, `app/(app)/layout.tsx`, `components/app/header.tsx`, `components/app/sidebar.tsx` | Low |
| 1.2 | Create `middleware.ts` with JWT verification + role guards | `middleware.ts` | Medium |
| 1.3 | Fix `lib/api-utils.ts` — extract `tenantId` from JWT, not header | `lib/api-utils.ts` | Low |
| 1.4 | Fix `lib/session.ts` — `verifySession()` must return `tenantId` | `lib/session.ts` | Low |
| 1.5 | Lock legacy flat API routes (redirect to v1 or add auth wrapper) | `app/api/orders/*`, `app/api/invoices/*`, `app/api/products/*`, etc. | Medium |
| 1.6 | Fix dashboard path: `/(dashboard)/dashboard/[role]` → `/(dashboard)/[role]` | `app/(dashboard)/` tree | Low |
| 1.7 | Delete or stub `app/(app)/` deprecated directory | `app/(app)/` | Low |

**Acceptance Criteria:**
- Unauthenticated users are redirected to `/login` from all `/dashboard/*` routes
- `x-tenant-id` header is ignored; tenant comes from JWT session
- `role-context.tsx` is completely removed from codebase
- All legacy routes require authentication or redirect to v1

---

## Phase 2 — Tenant & RBAC Schema (Week 2)

**Goal:** Establish multi-tenant isolation and granular permissions at the data layer.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 2.1 | Add `Tenant` model to Prisma schema | `prisma/schema.prisma` | Low |
| 2.2 | Add `tenantId` to all tenant-scoped models | `prisma/schema.prisma` | Medium |
| 2.3 | Make `User.hotelId` nullable; add `supplierId`, `factoringCompanyId` | `prisma/schema.prisma` | Low |
| 2.4 | Create `Role` and `Permission` models + `RolePermission` join | `prisma/schema.prisma` | Medium |
| 2.5 | Align `AuthorityRule` schema with TS engine fields | `prisma/schema.prisma`, `lib/auth/authority-matrix.ts` | Medium |
| 2.6 | Add missing FKs (`Order.requesterId`, `TripStop.orderId`, etc.) | `prisma/schema.prisma` | Low |
| 2.7 | Add indexes on polymorphic and query-heavy columns | `prisma/schema.prisma` | Low |
| 2.8 | Generate and run migration | `prisma/migrations/` | Low |

**Acceptance Criteria:**
- `prisma generate` succeeds with zero errors
- `User` model supports hotel, supplier, factoring, and platform admin users
- `AuthorityRule` can store `requiresPaymentGuarantee`, `requiresEtaValidation`, `requiresDualSignOff`
- All tenant-scoped models have required `tenantId` field

---

## Phase 3 — API Hardening (Week 3)

**Goal:** Centralize RBAC and tenant scoping; fill missing CRUD; secure admin endpoints.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 3.1 | Create `lib/tenant/scope.ts` with `tenantWhereClause()` | `lib/tenant/scope.ts` | Low |
| 3.2 | Create `lib/auth/rbac.ts` with `requirePermission(ctx, code)` | `lib/auth/rbac.ts` | Medium |
| 3.3 | Retrofit all v1 routes with `requirePermission()` + tenant scoping | `app/api/v1/**/*.ts` | High |
| 3.4 | Build missing CRUD: `/v1/hotels`, `/v1/suppliers`, `/v1/products` | `app/api/v1/hotel/`, `app/api/v1/supplier/`, `app/api/v1/products/` | High |
| 3.5 | Build missing CRUD: `/v1/users`, `/v1/properties`, `/v1/outlets` | `app/api/v1/users/`, `app/api/v1/properties/`, `app/api/v1/outlets/` | High |
| 3.6 | Remove duplicate legacy routes (auth, orders, invoices) | `app/api/auth/`, `app/api/orders/`, `app/api/invoices/` | Low |
| 3.7 | Secure admin endpoints (`cron/*`, `pulse`) with auth + admin role | `app/api/v1/admin/**/*.ts` | Low |
| 3.8 | Add Zod validation to all v1 GET endpoints currently missing it | `app/api/v1/**/*.ts` | Medium |

**Acceptance Criteria:**
- Every v1 route calls `requirePermission()` before business logic
- No API route returns data outside the caller's tenant
- Legacy duplicate routes are deleted
- Admin endpoints are no longer publicly accessible

---

## Phase 4 — UI Foundation (Week 4)

**Goal:** Establish design system, extract components, fix navigation, wire live data.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 4.1 | Initialize `components/ui/` with shadcn/ui primitives | `components/ui/button.tsx`, `input.tsx`, `table.tsx`, `dialog.tsx`, `badge.tsx`, `card.tsx`, `select.tsx` | Medium |
| 4.2 | Extract dashboard pages into `components/dashboards/[role]/` | `components/dashboards/hotel/`, `supplier/`, `factoring/`, `shipping/`, `admin/` | High |
| 4.3 | Fix `PulseSidebar`: Next.js `<Link>`, `usePathname()` active state | `components/layout/pulse-sidebar.tsx` | Low |
| 4.4 | Create `app/(marketing)/` route group; move landing page | `app/(marketing)/page.tsx`, `layout.tsx` | Low |
| 4.5 | Create `app/(auth)/` route group; move login, register | `app/(auth)/login/`, `register/`, `layout.tsx` | Low |
| 4.6 | Build `forgot-password` and `verify-email` pages | `app/(auth)/forgot-password/`, `verify-email/` | Low |
| 4.7 | Wire dashboard data fetching to live v1 APIs | `app/(dashboard)/**/page.tsx` | Medium |
| 4.8 | Build missing sub-pages linked in sidebar | `hotel/catalog`, `hotel/orders`, `supplier/orders`, `admin/audit-log`, etc. | High |

**Acceptance Criteria:**
- All UI elements use `components/ui/` primitives
- No inline raw `<button>` or `<table>` elements in dashboard pages
- Sidebar active state syncs with URL
- Dashboards display live data from v1 APIs

---

## Phase 5 — Missing Service Modules (Week 5)

**Goal:** Implement the 5 missing `lib/` modules required by AGENTS.md guardrails.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 5.1 | `lib/inventory/sync.ts` — sync orchestrator | `lib/inventory/sync.ts` | Medium |
| 5.2 | Webhook receivers for inventory providers | `app/api/webhooks/inventory/[provider]/route.ts` | Medium |
| 5.3 | `lib/ai/` — Vercel AI SDK config + role-specific prompts | `lib/ai/config.ts`, `prompts/hotel-prompt.ts`, `supplier-prompt.ts`, etc. | Medium |
| 5.4 | `lib/fintech/ledger.ts` — double-entry bookkeeping | `lib/fintech/ledger.ts` | High |
| 5.5 | `lib/eta/queue.ts` — dead-letter queue with retry + manual resolution | `lib/eta/queue.ts` | Medium |
| 5.6 | `docs/eta-integration.md` — spec document | `docs/eta-integration.md` | Low |

**Acceptance Criteria:**
- Inventory webhooks receive and process provider payloads
- AI assistant can be initialized with role-specific system prompts
- Ledger records every monetary mutation as double-entry
- Failed ETA submissions land in queue with retry logic

---

## Phase 6 — Integration & Polish (Week 6)

**Goal:** End-to-end validation, seed data, performance, final build.

| # | Task | Files | Effort |
|---|------|-------|--------|
| 6.1 | End-to-end flow test: register → login → order → approval → invoice → ETA | Manual + script | Medium |
| 6.2 | Add query performance indexes | `prisma/schema.prisma` | Low |
| 6.3 | Create seed script for dev data | `prisma/seed.ts` | Medium |
| 6.4 | Final build verification (`npm run build`) | Project-wide | Low |
| 6.5 | Lint pass (`npm run lint`) | Project-wide | Low |
| 6.6 | Update `AGENTS.md` with new conventions and test commands | `AGENTS.md` | Low |

**Acceptance Criteria:**
- `npm run build` passes with zero errors
- `npm run lint` passes with zero warnings
- A complete procurement order can be created and approved end-to-end
- Seed script populates dev database with sample hotels, suppliers, and products

---

## Risk Register

| Risk | Mitigation |
|------|------------|
| SQLite → PostgreSQL migration complexity | Complete all schema changes in SQLite first; run parallel PostgreSQL test in Phase 6 |
| Legacy route consumers still hitting flat routes | Add 301 redirects from legacy to v1 before deletion |
| shadcn/ui init conflicts with Tailwind v4 | Use `npx shadcn@latest init` with `--yes` and Tailwind v4 compatible template |
| Middleware breaks static pages | Configure `matcher` in `middleware.ts` to exclude `_next/`, `static/`, `api/webhooks/` |

---

## Guardrail Compliance Tracker

| Guardrail | Phase | Target |
|-----------|-------|--------|
| G1 Tenant Isolation | Phase 2 + 3 | ✅ `tenantId` on all models, `lib/tenant/scope.ts` |
| G2 RBAC Server-Side | Phase 1 + 2 + 3 | ✅ `middleware.ts`, `Role`/`Permission` models, `requirePermission()` |
| G3 Authority Matrix | Phase 2 | ✅ Schema aligned, state snapshots in `AuditLog` |
| G4 ETA Bridge | Phase 5 | ✅ Dead-letter queue, `docs/eta-integration.md` |
| G5 Inventory Sync | Phase 5 | ✅ `lib/inventory/sync.ts`, webhook receivers |
| G6 AI Assistant | Phase 5 | ✅ `lib/ai/`, role-specific prompts |
| G7 UI Standard | Phase 4 | ✅ `components/ui/`, glassmorphism theme |
| G8 Directory Enforcement | Phase 1 + 4 | ✅ No code in `app/(app)/`, route groups correct |
| G9 API Versioning | Phase 3 | ✅ Legacy routes removed, all new code in `api/v1/` |
| G10 Fintech & Risk | Phase 5 | ✅ Double-entry ledger, platform fee priority |

---

*Plan generated by Kimi Code CLI Audit Agent — 2026-05-02*
