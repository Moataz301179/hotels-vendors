# Execution Phases — Acceptance Criteria & Verification

Each phase must pass all verification gates before proceeding.

---

## Phase 0.5: Deep Cleanup (Dead Code, Deprecated Trees, Worktrees) — Days 1–2

> **Purpose:** Clear ALL old/dead/conflicting code BEFORE building on top of it. Nothing new lands until the repo is clean. This satisfies the user's explicit requirement to keep the codebase clean with no stale worktrees.

### Scope
- [ ] **Remove deprecated app trees** (per AGENTS.md G8): delete `src/app/` (stale boilerplate) and `app/(app)/` (deprecated) after confirming no imports reference them.
- [ ] **Remove client-side role/tenant state:** delete `components/app/role-context.tsx` (localStorage role switching — security vulnerability per G2). Grep for any remaining usage and remove.
- [ ] **Audit legacy flat API routes** (`app/api/auth/*`, `app/api/orders/*`, etc. per G9): enumerate, confirm consumers migrated to `api/v1/`, then delete.
- [ ] **Dead code sweep:** run `npx tsc --noEmit` + `npm run lint` and grep for unused exports/files. Remove orphaned services, unused components, dead `docs/` drafts (keep only living docs listed in CLAUDE.md/PROJECT_STATE.md).
- [ ] **Stale worktrees & branches:** run `git worktree list` — remove any orphaned worktrees from the dead Vercel sync flow (PROJECT_STATE.md: "the old Vercel worktree sync flow is DEAD"). Delete stale local branches not on `origin` (after confirming). Keep `main` as the single working branch.
- [ ] **Verify no `src/app` vs root `app/` duplication** — confirm Next.js is loading only root `app/` (AGENTS.md CRITICAL note).
- [ ] **Check actual state before deleting:** re-verify `middleware.ts` existence, current multi-tenant progress, and whether `app/(dashboard)/[role]/` files exist — the audit assumed these were missing; confirm against the live tree so nothing working is deleted.

### Verification Gates
```bash
# 1. Confirm no references to deleted trees
rg -l "src/app|app/(app)|role-context" --glob '!node_modules' || echo "CLEAN"

# 2. Build passes after deletions
npm run build

# 3. Lint passes
npm run lint

# 4. TypeScript strict
npx tsc --noEmit

# 5. Clean worktree state
git worktree list   # expect: single entry (main checkout)

# 6. Health of deleted-code inventory
#    Produce docs/planning/CLEANUP_REPORT.md listing every removed path + reason
```

### Acceptance Criteria
- [ ] `src/app/` and `app/(app)/` fully removed (or confirmed already absent)
- [ ] `role-context.tsx` removed with zero references
- [ ] Legacy flat API routes removed after consumer migration
- [ ] `git worktree list` shows exactly one entry on `main`
- [ ] Build + lint + tsc all green post-cleanup
- [ ] `docs/planning/CLEANUP_REPORT.md` written (path + reason for every deletion)
- [ ] `git status` clean, single commit "chore: deep cleanup (dead code, deprecated trees)"

---

## Phase 0.7: Product Manager Governance Layer (Days 2–3)

> **Purpose:** Install the Product Manager as an enforced authority over spec, scope, UI/UX, and quality BEFORE any feature work. The user is delegating their Product Manager role to the system. From this phase forward, **no agent may independently choose colors, fonts, logo sizing, spacing, or "improve" the design.** Every UI decision maps to locked tokens. Every claimed "done" passes automated gates.
>
> **CRITICAL BUG (fix FIRST, it's the user's recurring registration error):** `app/(auth)/register/page.tsx` sends `type: form.role.toLowerCase()` where `LOGISTICS` → `"logistics"`, but `BusinessRegisterSchema` in `lib/zod.ts` (line 283) only allows `["hotel","supplier","factoring","shipping"]`. Result: registering as Logistics fails validation every time. Fix by aligning the enum end-to-end (recommend: normalize `LOGISTICS` → `shipping` in the page, or add `"logistics"` to the schema + map platformRole). Verify all 4 roles register successfully (see QA gate below).

### Scope — 4 artifacts under `.claude/` (safe alongside active cleanup)

1. **`.claude/PM.md` — Product Manager charter** (auto-loaded every session).
   - PM owns spec, scope, and quality. Agents propose; PM approves. No agent overrides.
   - Explicit bans: no agent-picked colors/fonts/logo sizing; no dark-on-dark; no "generic AI" gradients; no raw hex outside the token map; no client-side role state.
   - Every change maps to a goal (G1-G4 from the Hermes directive) or is rejected.

2. **`.claude/skills/design-system/SKILL.md` — the Design Bible (locked tokens).**
   - Two locked palettes: **Web = existing brand** (orange `--accent-base` #ff7e1a family, dark glassmorphism tokens in `app/globals.css`); **Mobile Invo = new premium B2B spec** (deep blue, charcoal, matte gold per `INVO_UX_SCREENS.md` §5.2).
   - Hard rules, machine-checkable:
     - All colors MUST come from token map (CSS variables). Zero raw hex in components.
     - Text/background contrast ≥ 4.5:1 (WCAG AA). No dark-on-dark, no light-on-light.
     - Logo: min 28px / max 40px display height; must sit on its brand-approved background; never recolored by agents.
     - Type scale: exactly the tokens (12/13/14/16/20/24/28). No arbitrary font sizes.
     - Spacing: token scale only. Radius: 12/16/24 rounded, 999 pill.
     - Premium B2B aesthetic: real product photography, not generic lucide-only iconography; matte (not glossy) surfaces; no neon gradients.

3. **`.claude/commands/qa-gate.md` — Registration + flow test harness.**
   - Runs before anything is called "done": starts dev server, POSTs `/api/v1/auth/register` for ALL 4 roles, asserts 201 + valid response shape; tests login round-trip; tests verify-email; asserts Zod rejects malformed bodies with correct messages.
   - Fail = loud report with exact file:line, NOT "it probably works".
   - Reusable for new flows (requisition → PO → invoice → Oliv) in later phases.

4. **`.claude/commands/ui-audit.md` — anti-generic-AI checker.**
   - Greps `app/`, `components/` for: raw hex/oklch not in token map, `style={{color`/`fontSize`/`backgroundColor` deviations, `className` with arbitrary text-\[.*\] sizes, logo element sizes outside 28-40px, contrast flags.
   - Output: violation list with file:line + the exact token to use instead.

### Verification Gates
```bash
# 1. Registration bug fixed — all 4 roles return 201
#    (run .claude/commands/qa-gate.md logic manually if needed)
curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"type":"shipping","name":"T","email":"t@x.com","password":"StrongP1ss","city":"Cairo","governorate":"Cairo","termsAccepted":true}'

# 2. Design system tokens locked
rg -n "#[0-9a-fA-F]{3,8}|oklch\(" app components --glob '*.tsx' --glob '*.ts' --glob '*.css' \
  | rg -v "globals.css" || echo "NO RAW COLORS OUTSIDE globals.css"

# 3. ui-audit reports zero violations
# 4. PM.md + both skills load (they are auto-injected by Claude Code)
```

### Acceptance Criteria
- [ ] Logistics registration returns 201 (bug fixed, all 4 roles verified)
- [ ] `PM.md` exists and Claude confirms it governs the session
- [ ] `design-system` skill exists with locked tokens + machine-checkable rules
- [ ] `qa-gate` command exists and passes on all 4 roles
- [ ] `ui-audit` command exists and reports zero violations
- [ ] Any future UI change maps to tokens or fails the audit

---

## Phase 1: Prisma Schema + Seed (Days 4–6)

### Scope
- New models: `InternalRequisition`, `RequisitionItem`, `PurchaseOrder`, `PurchaseOrderItem`, `Notification`
- Modified models: `Invoice` (add PO link, credit-line fields, ETA fields), `User` (add `outletId`)
- Enums: `RequisitionStatus`, `POStatus`, `CreditLinePaymentStatus`, `NotificationType`
- Seed script: 29 permissions + 8 roles with mappings

### Files to Create/Modify
| File | Action |
|------|--------|
| `prisma/schema.prisma` | Add new models + modify existing |
| `prisma/seed.ts` | Add RBAC seed (from `RBAC_PERMISSION_SEED.ts`) |
| `docs/planning/PRISMA_SCHEMA_CHANGES.prisma` | Reference for exact changes |

### Verification Gates
```bash
# 1. Migration generates cleanly
npx prisma migrate dev --name "add_requisition_po_invoice_flow"

# 2. Seed runs without errors
npx prisma db seed

# 3. Build passes
npm run build

# 4. Lint passes
npm run lint

# 5. TypeScript strict check
npx tsc --noEmit
```

### Acceptance Criteria
- [ ] `npx prisma studio` shows all new models
- [ ] Permissions table has 29 rows
- [ ] Roles table has 8 tenant-scoped roles + PLATFORM_ADMIN global
- [ ] RolePermission table has correct mappings
- [ ] No migration warnings/errors
- [ ] `Invoice` model has `purchaseOrderId`, `creditLinePaymentId`, `creditLineStatus`, `etaSubmissionId`

---

## Phase 2: Backend Routes + RBAC Enforcement (Days 4–10)

### Scope
All `api/v1/` routes with Zod validation + `requirePermission()` + tenant scoping.

### Routes to Implement
| Route | Method | Permission | Description |
|-------|--------|------------|-------------|
| `/api/v1/hotel/requisitions` | GET | `hotel:requisition:read` | List requisitions |
| `/api/v1/hotel/requisitions` | POST | `hotel:requisition:create` | Create requisition |
| `/api/v1/hotel/requisitions/:id` | GET | `hotel:requisition:read` | Get requisition |
| `/api/v1/hotel/requisitions/:id/approve` | POST | `hotel:requisition:approve` | Manager approve |
| `/api/v1/hotel/requisitions/:id/reject` | POST | `hotel:requisition:approve` | Manager reject |
| `/api/v1/hotel/requisitions/:id/convert` | POST | `hotel:po:create` | Convert to PO |
| `/api/v1/hotel/purchase-orders` | GET | `hotel:po:read` | List POs |
| `/api/v1/hotel/purchase-orders` | POST | `hotel:po:create` | Create PO |
| `/api/v1/hotel/purchase-orders/:id` | GET | `hotel:po:read` | Get PO |
| `/api/v1/hotel/purchase-orders/:id/approve-payment` | POST | `hotel:po:approve` | Finance approve payment |
| `/api/v1/supplier/purchase-orders` | GET | `supplier:po:read` | List incoming POs |
| `/api/v1/supplier/purchase-orders/:id/accept` | POST | `supplier:po:accept` | Accept PO |
| `/api/v1/supplier/purchase-orders/:id/reject` | POST | `supplier:po:accept` | Reject PO |
| `/api/v1/supplier/invoices` | POST | `supplier:invoice:create` | Create invoice |
| `/api/v1/supplier/invoices/:id/upload` | POST | `supplier:invoice:upload` | Upload PDF |
| `/api/v1/supplier/deliveries/:id/update` | POST | `supplier:delivery:update` | Update delivery status |
| `/api/v1/fintech/oliv-checkout` | POST | `hotel:credit:redirect` | Generate Oliv checkout URL |
| `/api/v1/fintech/oliv-status` | GET | `hotel:credit:redirect` | Poll Oliv status |
| `/api/v1/events/stream` | GET | (auth only) | SSE for real-time updates |

### Files to Create
```
app/api/v1/hotel/requisitions/route.ts
app/api/v1/hotel/requisitions/[id]/route.ts
app/api/v1/hotel/requisitions/[id]/approve/route.ts
app/api/v1/hotel/requisitions/[id]/reject/route.ts
app/api/v1/hotel/requisitions/[id]/convert/route.ts
app/api/v1/hotel/purchase-orders/route.ts
app/api/v1/hotel/purchase-orders/[id]/route.ts
app/api/v1/hotel/purchase-orders/[id]/approve-payment/route.ts
app/api/v1/supplier/purchase-orders/route.ts
app/api/v1/supplier/purchase-orders/[id]/accept/route.ts
app/api/v1/supplier/purchase-orders/[id]/reject/route.ts
app/api/v1/supplier/invoices/route.ts
app/api/v1/supplier/invoices/[id]/upload/route.ts
app/api/v1/supplier/deliveries/[id]/update/route.ts
app/api/v1/fintech/oliv-checkout/route.ts
app/api/v1/fintech/oliv-status/route.ts
app/api/v1/events/stream/route.ts
lib/validators/requisition.ts
lib/validators/purchase-order.ts
lib/validators/invoice.ts
lib/services/requisition.ts
lib/services/purchase-order.ts
lib/services/oliv-checkout.ts
lib/services/sse.ts
middleware.ts  # Tenant injection + route protection
```

### Verification Gates
```bash
# 1. Build passes
npm run build

# 2. Lint passes
npm run lint

# 3. Unit tests (create test files)
npm run test

# 4. Manual API test (curl each endpoint with valid/invalid tokens)
#    - 401 without auth
#    - 403 without permission
#    - 200 with correct permission
#    - 400 with invalid body (Zod)
#    - Tenant isolation: user from tenant A cannot see tenant B data
```

### Acceptance Criteria
- [ ] All routes have Zod validation on request body/query/params
- [ ] All routes call `requirePermission(ctx, "code:action")` before business logic
- [ ] All routes use `tenantWhereClause(ctx)` for Prisma queries
- [ ] `middleware.ts` extracts tenant from session, injects into headers
- [ ] SSE endpoint streams events for: requisition.approved, po.accepted, invoice.paid
- [ ] Oliv checkout returns valid sandbox URL with reference
- [ ] No cross-tenant data leakage in any route

---

## Phase 3: Mobile Redesign (Days 11–20)

### Scope
Complete rewrite of mobile screens per `INVO_UX_SCREENS.md`. Monorepo setup.

### Milestones

#### 3A: Monorepo + Shared Packages (Days 11–13)
- [ ] Create `hotels-vendors-monorepo/` structure
- [ ] Extract `@hotels-vendors/api-contracts` from web Zod schemas
- [ ] Extract `@hotels-vendors/ui-primitives` from web/mobile themes
- [ ] Extract `@hotels-vendors/auth` (JWT, tokens)
- [ ] Configure pnpm workspaces + Turborepo
- [ ] Update mobile `package.json` with new dependencies

#### 3B: Auth + Onboarding Gateway (Days 14–15)
- [ ] `LoginScreen` / `RegisterScreen` (polish existing)
- [ ] `OnboardingGatewayScreen` — Role selection cards
- [ ] Supplier path → `OlivActivationScreen` (enhance existing)
- [ ] Hotel path → Direct to Home tabs
- [ ] Deep link scheme `invo://` configured

#### 3C: Hotel Home + Scan Flow (Days 16–17)
- [ ] `HotelHomeScreen` — Scan FAB, stats cards, insight card, activity feed
- [ ] `ScanScreen` — Camera + barcode scanner (`expo-camera`, `expo-barcode-scanner`)
- [ ] `RequisitionReviewScreen` — Post-scan confirmation
- [ ] Offline queue for scans (local AsyncStorage + sync indicator)

#### 3D: Requisitions + Approvals + Catalog (Days 18–19)
- [ ] `RequisitionsScreen` — List with status badges, pull-to-refresh
- [ ] `RequisitionDetailScreen` — Full view with actions
- [ ] `ApprovalsScreen` (Manager) — Budget bar, pending/approved lists, approve/reject modals
- [ ] `CatalogScreen` — Visual cards, real photos, category chips, search

#### 3E: Invoices + Credit Redirect + Notifications (Day 20)
- [ ] `InvoicesScreen` — List with status, ETA badge, payment options
- [ ] `InvoiceDetailScreen` — Finance view with "Pay via Credit Line" button
- [ ] Oliv redirect via `expo-web-browser.openAuthSessionAsync`
- [ ] Deep link handler for `invo://payment-return`
- [ ] `NotificationsScreen` — Grouped by date, mark-as-read

### New Dependencies
```json
{
  "expo-camera": "~15.0.0",
  "expo-barcode-scanner": "~13.0.0",
  "expo-web-browser": "~13.0.0",
  "expo-linking": "~7.0.0",
  "expo-notifications": "~0.28.0",
  "expo-background-fetch": "~12.0.0",
  "expo-task-manager": "~12.0.0",
  "@hotels-vendors/api-contracts": "*",
  "@hotels-vendors/ui-primitives": "*",
  "@hotels-vendors/auth": "*"
}
```

### Verification Gates
```bash
# 1. TypeScript strict check
cd apps/mobile && npx tsc --noEmit

# 2. Expo doctor
npx expo doctor

# 3. Build for simulator/device
eas build --profile development --platform ios
eas build --profile development --platform android

# 4. Manual QA on physical device
#    - Scan real barcode → creates requisition
#    - Manager approves → real-time update on staff device
#    - Finance pays via credit line → Oliv sandbox → returns to app
#    - Push notification received for approval/delivery
#    - Offline scan queues → syncs when online
```

### Acceptance Criteria
- [ ] App launches → Onboarding Gateway → Role selection works
- [ ] Hotel user: Home shows Scan FAB, stats, activity
- [ ] Scan: Camera opens, barcode detected, product lookup works
- [ ] Requisition: Submits → appears in Manager's Approvals
- [ ] Manager: Approves with budget check → converts to PO
- [ ] Supplier: Sees PO → Accepts → Uploads invoice → ETA submission
- [ ] Finance: Sees invoice → "Pay via Credit Line" → Oliv sandbox → returns success
- [ ] Push notifications work for: approval, delivery, payment
- [ ] Design matches `INVO_UX_SCREENS.md` (colors, spacing, typography)
- [ ] No TypeScript errors, no Expo warnings

---

## Phase 4: Approval + PO + Supplier Flows + Push (Days 21–28)

### Scope
End-to-end integration, real-time sync, push notifications.

### Key Integrations
| Flow | Web API | Mobile | Real-time |
|------|---------|--------|-----------|
| Staff → Manager | `POST /requisitions` | Scan → Submit | SSE: `requisition.submitted` |
| Manager → Procurement | `POST /requisitions/:id/approve` | Approve button | SSE: `requisition.approved` |
| Procurement → Supplier | `POST /purchase-orders` | Auto from requisition | SSE: `po.created` |
| Supplier → Hotel | `POST /purchase-orders/:id/accept` | Accept button | SSE: `po.accepted` |
| Supplier → Hotel | `POST /invoices` + upload | Upload Invoice | SSE: `invoice.received` |
| Finance → Payment | `POST /oliv-checkout` | Credit Line button | SSE: `invoice.paid` |

### Push Notification Setup
- [ ] Expo Push credentials (FCM/APNs) configured
- [ ] Webhook: `POST /api/v1/webhooks/push` receives events → calls Expo Push API
- [ ] Mobile: `expo-notifications` handles foreground/background
- [ ] Deep links from push: `invo://requisition/REQ-0042`, `invo://po/PO-1025`

### Verification Gates
```bash
# 1. Staging deploy (web + mobile)
# 2. E2E test with 3 users: Staff, Manager, Supplier
# 3. Verify real-time updates across devices
# 4. Verify push notifications arrive on locked device
# 5. Load test: 100 concurrent requisitions
```

### Acceptance Criteria
- [ ] Staff scan → Manager sees in <2s (SSE)
- [ ] Manager approve → Procurement sees in <2s
- [ ] PO created → Supplier sees in <2s
- [ ] Supplier accept → Hotel sees in <2s
- [ ] Invoice uploaded → ETA submission triggered → Finance sees
- [ ] Push notifications delivered for all events
- [ ] Deep links from push open correct screen
- [ ] No duplicate events, no missed events

---

## Phase 5: Finance + Oliv Redirect (Days 29–35)

### Scope
Complete credit-line payment flow, Oliv sandbox → production readiness.

### Key Features
- [ ] `POST /api/v1/fintech/oliv-checkout` generates checkout URL
- [ ] Mobile: `expo-web-browser.openAuthSessionAsync` for Oliv
- [ ] Web: `window.location.href` for Oliv
- [ ] Oliv callback handler updates `Invoice.creditLineStatus`
- [ ] Mobile deep link `invo://payment-return` → polls status
- [ ] Web return route `/payment/oliv-return` → server handles callback
- [ ] Receipt generation (PDF) for successful payments
- [ ] Error handling: expired, cancelled, failed, network error

### Oliv Sandbox Testing
```bash
# Test credentials (sandbox)
OLIV_BASE_URL=https://sandbox.oliv.finance
OLIV_API_KEY=<sandbox_key>
OLIV_WEBHOOK_TOKEN=<sandbox_webhook_token>
```

### Verification Gates
```bash
# 1. Sandbox end-to-end test
#    - Create invoice → Finance pays via credit line
#    - Oliv sandbox: complete KYC/approval
#    - Return to app/web → status = PAID
#    - Invoice.creditLineStatus = PAID, creditLinePaidAt set

# 2. Error scenarios
#    - User cancels in Oliv → status = FAILED
#    - Session expires → status = EXPIRED
#    - Network error → retry logic

# 3. Audit log entries for all payment events
```

### Acceptance Criteria
- [ ] Sandbox payment completes successfully
- [ ] Mobile returns to app with success screen
- [ ] Web redirects to invoice list with success toast
- [ ] Invoice shows `PAID` status with `creditLinePaidAt`
- [ ] Audit log has `OLIV_PAYMENT_COMPLETED` entry
- [ ] Receipt PDF generated and downloadable
- [ ] Production credentials swap documented

---

## Phase 6: Web Dashboard Read-Views (Days 36–42)

### Scope
Server-rendered dashboard pages for all roles in `app/(dashboard)/[role]/`.

### Pages to Build
| Role | Pages |
|------|-------|
| **Hotel** | `/dashboard/hotel` (Procurement Command Center), `/dashboard/hotel/requisitions`, `/dashboard/hotel/approvals`, `/dashboard/hotel/purchase-orders`, `/dashboard/hotel/invoices`, `/dashboard/hotel/spend-analytics` |
| **Supplier** | `/dashboard/supplier` (Inventory & Order Center), `/dashboard/supplier/purchase-orders`, `/dashboard/supplier/invoices`, `/dashboard/supplier/credit-facility`, `/dashboard/supplier/factoring-history` |
| **Factoring** | `/dashboard/factoring` (Liquidity Dashboard), `/dashboard/factoring/facilities`, `/dashboard/factoring/invoices`, `/dashboard/factoring/risk` |
| **Admin** | `/dashboard/admin` (System Overview), `/dashboard/admin/tenants`, `/dashboard/admin/authority-matrix`, `/dashboard/admin/audit-log`, `/dashboard/admin/fees` |

### Components (Reuse from `components/dashboards/[role]/`)
- `ProcurementPanel`, `ApprovalQueue`, `SpendChart`, `CatalogBrowser`
- `InventoryTable`, `OrderInbox`, `AIUploadDropzone`, `SyncStatusPanel`
- `FacilityCard`, `InvoicePipeline`, `RiskGauge`
- `TenantTable`, `AuditLogViewer`, `AuthorityRuleEditor`, `FeeMetricCards`

### Verification Gates
```bash
# 1. Build passes
npm run build

# 2. Visual regression (chromatic/percy)
# 3. Accessibility audit (axe-core)
# 4. Performance: LCP < 2.5s, INP < 200ms, CLS < 0.1
# 5. Role-based access: each role sees only their pages
```

### Acceptance Criteria
- [ ] All pages render without client-side data fetching (SSR)
- [ ] RBAC enforced: Hotel user cannot access `/dashboard/supplier/*`
- [ ] Data matches mobile real-time (same API)
- [ ] AI Assistant slot present on each dashboard
- [ ] Tenant switcher works for multi-tenant users
- [ ] Dark mode glassmorphism matches design system

---

## Overall Definition of Done

| Criteria | Status |
|----------|--------|
| Phase 0.5 cleanup complete (no `src/app`, `app/(app)`, `role-context.tsx`, legacy flat routes, orphaned worktrees) | ☐ |
| Phase 0.7 PM governance active (PM.md + design-system skill + qa-gate + ui-audit; registration all 4 roles → 201) | ☐ |
| All 6 phases complete with passing verification gates | ☐ |
| Zero TypeScript errors (`npx tsc --noEmit`) | ☐ |
| Zero ESLint errors (`npm run lint`) | ☐ |
| All unit tests pass (`npm run test`) | ☐ |
| E2E test suite passes (web + mobile) | ☐ |
| Staging deploy healthy (GitHub Actions green) | ☐ |
| Production deploy verified (health check 200) | ☐ |
| Documentation updated (`docs/`) | ☐ |
| Mobile app builds for iOS/Android (EAS) | ☐ |
| No cross-tenant data leakage (audit) | ☐ |
| All API routes have Zod + RBAC + tenant scope | ☐ |

---

## Rollback Triggers

If any phase fails verification **3 times**, escalate:
1. **Phase 1-2**: Schema/route issue → Revert migration, redesign
2. **Phase 3**: Mobile UX not matching spec → Pause, redesign screens
3. **Phase 4**: Real-time sync unreliable → Investigate SSE vs polling
4. **Phase 5**: Oliv integration blocked → Use fallback (bank transfer only)
5. **Phase 6**: Dashboard performance → Optimize queries, add caching

---

## Timeline Summary

| Phase | Duration | Cumulative |
|-------|----------|------------|
| 0.5. Deep Cleanup | 2 days | 2 days |
| 0.7. PM Governance | 2 days | 4 days |
| 1. Prisma + Seed | 3 days | 7 days |
| 2. Backend Routes + RBAC | 7 days | 14 days |
| 3. Mobile Redesign | 10 days | 24 days |
| 4. Flows + Push | 8 days | 32 days |
| 5. Finance + Oliv | 7 days | 39 days |
| 6. Web Dashboards | 7 days | 46 days |
| **Total** | **46 days (8 weeks)** | |

**Buffer**: +2 weeks for integration issues, Oliv credential delays, design iterations.
**Target**: Production ready in **8-10 weeks** from approval.