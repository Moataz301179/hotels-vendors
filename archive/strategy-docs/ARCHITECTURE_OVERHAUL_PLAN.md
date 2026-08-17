# Multi-Tenant SaaS Architecture Overhaul Plan
## Hotels Vendors — Digital Procurement Hub
**Version:** 2.0 | **Date:** 2026-05-01 | **Status:** APPROVED FOR IMPLEMENTATION

---

## 1. EXECUTIVE SUMMARY

This document defines the complete file-tree and architectural migration from a flat, client-side-role application to a **Multi-Tenant Hub** with server-side RBAC, tenant isolation, and institutional-grade governance.

**Non-negotiable principles:**
1. **Tenant ID is the root of all queries.** No database read/write without `tenantId` scoping.
2. **RBAC is server-side only.** Client receives rendered UI; permissions are evaluated at the API/middleware boundary.
3. **Authority Matrix is database-driven and enforced in every order mutation path.**
4. **ETA Bridge is invisible.** No UI routes, no client references. It is a background service.
5. **No WebSockets.** Inventory sync uses REST + Webhooks only.

---

## 2. SCHEMA MIGRATION (Prisma)

### 2.1 New Models

```prisma
// ── TENANT (Root Isolation) ──
model Tenant {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique // URL-friendly identifier
  type        TenantType // HOTEL_GROUP, SUPPLIER, FACTORING_COMPANY, SHIPPING_PROVIDER, PLATFORM
  status      TenantStatus @default(ACTIVE)
  taxId       String     @unique
  
  // Branding / White-label (future)
  logoUrl     String?
  primaryColor String?
  
  // Relations
  users       User[]
  orders      Order[]
  invoices    Invoice[]
  auditLogs   AuditLog[]
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TenantType {
  HOTEL_GROUP
  SUPPLIER
  FACTORING_COMPANY
  SHIPPING_PROVIDER
  PLATFORM
}

enum TenantStatus {
  ACTIVE
  SUSPENDED
  PENDING_VERIFICATION
  CLOSED
}

// ── ROLE (Permission Collections) ──
model Role {
  id          String   @id @default(cuid())
  name        String   // "Hotel Procurement Manager", "Supplier Inventory Clerk"
  tenantId    String?
  tenant      Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // If null, it's a global platform role (ADMIN, SYSTEM)
  isGlobal    Boolean  @default(false)
  
  permissions Permission[] // Relation through RolePermission
  
  users       User[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ── PERMISSION (Atomic Actions) ──
model Permission {
  id          String @id @default(cuid())
  code        String @unique // "order:create", "order:approve", "invoice:submit_eta", "supplier:sync_inventory"
  name        String
  description String?
  
  roles       Role[]
  createdAt   DateTime @default(now())
}

model RolePermission {
  roleId       String
  permissionId String
  assignedAt   DateTime @default(now())
  
  @@id([roleId, permissionId])
}

// ── USER (Tenant-Bound Actor) ──
// MODIFY EXISTING: Add tenantId, roleId (replaces platformRole string)
// REMOVE: platformRole enum from User (keep enum for reference)
```

### 2.2 Modified Models

| Model | Changes |
|-------|---------|
| `User` | Add `tenantId` (required), `roleId` (required, FK to Role). Remove `platformRole` string field. `hotelId` becomes nullable (suppliers/factoring don't have hotels). |
| `Order` | Add `tenantId` (required). All queries filtered by `tenantId`. |
| `Invoice` | Add `tenantId` (required). |
| `Product` | Add `tenantId` (required). Supplier products scoped to supplier tenant. |
| `Hotel` | Add `tenantId` (required). HotelGroup tenant owns hotels. |
| `Supplier` | Add `tenantId` (required). Supplier tenant owns supplier profile. |
| `AuditLog` | Add `tenantId` (required). |
| `AuthorityRule` | Add `tenantId` (nullable; null = platform global rule). |

---

## 3. DIRECTORY STRUCTURE (Target State)

```
/Users/Moataz/hotels-vendors/
│
├── app/
│   ├── (marketing)/                    # PUBLIC: Landing, SEO, Lead Gen
│   │   ├── layout.tsx                  # Marketing root layout (light/dark neutral)
│   │   ├── page.tsx                    # Hero / Value prop (FutureLog-inspired)
│   │   ├── about/
│   │   ├── pricing/
│   │   ├── contact/
│   │   ├── solutions/
│   │   │   ├── hotel-procurement/
│   │   │   ├── supplier-central/
│   │   │   ├── factoring/
│   │   │   └── logistics/
│   │   └── blog/
│   │
│   ├── (auth)/                         # PUBLIC: Authentication flows
│   │   ├── layout.tsx                  # Minimal auth layout (centered card)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   ├── page.tsx                # Role-selection stepper
│   │   │   └── _components/
│   │   │       ├── role-selector.tsx   # Hotel | Supplier | Factoring | Shipping
│   │   │       └── tenant-form.tsx     # Dynamic form per role type
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── verify-email/
│   │
│   ├── (dashboard)/                    # PRIVATE: All role dashboards
│   │   ├── layout.tsx                  # Dashboard shell (sidebar, header, tenant context)
│   │   ├── page.tsx                    # Redirect to role-specific home
│   │   │
│   │   ├── hotel/                      # ROLE: Hotel Buyer
│   │   │   ├── layout.tsx              # Hotel-specific nav + AI Assistant slot
│   │   │   ├── page.tsx                # Procurement Command Center
│   │   │   ├── catalog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   ├── approvals/              # AUTHORITY MATRIX UI
│   │   │   │   ├── page.tsx            # Pending approvals queue
│   │   │   │   └── history/
│   │   │   ├── invoices/
│   │   │   │   └── page.tsx
│   │   │   ├── outlets/
│   │   │   ├── properties/
│   │   │   ├── spend-analytics/
│   │   │   └── intelligence/
│   │   │       └── page.tsx            # AI market insights
│   │   │
│   │   ├── supplier/                   # ROLE: Supplier
│   │   │   ├── layout.tsx              # Supplier-specific nav + AI Assistant slot
│   │   │   ├── page.tsx                # Inventory & Order Command Center
│   │   │   ├── inventory/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── sync/               # REST API + Webhook config
│   │   │   │   └── upload/             # AI Magic Upload
│   │   │   │       └── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx            # Incoming POs
│   │   │   ├── catalog/
│   │   │   │   └── page.tsx            # Product management
│   │   │   ├── audits/
│   │   │   └── performance/
│   │   │
│   │   ├── factoring/                  # ROLE: Factoring Company
│   │   │   ├── layout.tsx              # Factoring nav + AI Assistant slot
│   │   │   ├── page.tsx                # Liquidity Dashboard
│   │   │   ├── facilities/
│   │   │   │   ├── page.tsx            # Active credit facilities
│   │   │   │   └── [id]/
│   │   │   ├── invoices/
│   │   │   │   └── page.tsx            # Factorable invoices pipeline
│   │   │   ├── risk/
│   │   │   │   └── page.tsx            # Credit risk scoring
│   │   │   └── yield/
│   │   │       └── page.tsx            # Portfolio yield tracking
│   │   │
│   │   ├── shipping/                   # ROLE: Logistics Provider
│   │   │   ├── layout.tsx              # Shipping nav + AI Assistant slot
│   │   │   ├── page.tsx                # Daily Delivery Optimization
│   │   │   ├── trips/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   ├── hubs/
│   │   │   ├── route-optimization/
│   │   │   │   └── page.tsx            # AI route suggestions
│   │   │   ├── fleet/
│   │   │   └── proof-of-delivery/
│   │   │
│   │   └── admin/                      # ROLE: Platform Auditor
│   │       ├── layout.tsx              # Admin nav + System Health slot
│   │       ├── page.tsx                # System Overview
│   │       ├── tenants/
│   │       │   ├── page.tsx            # Tenant registry
│   │       │   └── [id]/
│   │       ├── users/
│   │       │   └── page.tsx            # Cross-tenant user management
│   │       ├── authority-matrix/
│   │       │   └── page.tsx            # Global rule configuration
│   │       ├── audit-log/
│   │       │   └── page.tsx            # Immutable audit viewer
│   │       ├── fee-tracking/
│   │       │   └── page.tsx            # Transaction fee % tracking
│   │       ├── risk/                   # CREDIT HEATMAP
│   │       │   └── page.tsx            # Geographic risk visualization
│   │       ├── liquidity/              # LIQUIDITY MONITOR
│   │       │   └── page.tsx            # Partner capital deployment tracker
│   │       └── system-health/
│   │
│   ├── api/                            # INTERNAL: All API routes
│   │   ├── v1/                         # VERSIONED API (all new routes here)
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── me/route.ts
│   │   │   │   ├── refresh/route.ts
│   │   │   │   └── mfa/
│   │   │   ├── tenants/
│   │   │   │   ├── route.ts            # CRUD (admin only)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── users/route.ts
│   │   │   │       └── switch/route.ts # Switch active tenant context
│   │   │   ├── roles/
│   │   │   │   ├── route.ts            # List roles for tenant
│   │   │   │   └── [id]/
│   │   │   │           └── permissions/route.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts            # Tenant-scoped user management
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── deactivate/route.ts
│   │   │   ├── permissions/
│   │   │   │   └── route.ts            # Global permission catalog
│   │   │   ├── hotel/
│   │   │   │   ├── catalog/route.ts
│   │   │   │   ├── orders/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── route.ts
│   │   │   │   │       ├── approve/route.ts    # Authority Matrix gate
│   │   │   │   │       └── reject/route.ts
│   │   │   │   ├── approvals/
│   │   │   │   │   ├── pending/route.ts
│   │   │   │   │   └── history/route.ts
│   │   │   │   ├── invoices/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   └── spend/
│   │   │   │       └── route.ts
│   │   │   ├── supplier/
│   │   │   │   ├── inventory/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── sync/route.ts   # Trigger REST sync
│   │   │   │   │   └── webhook/route.ts # Receive webhook
│   │   │   │   ├── products/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   ├── orders/
│   │   │   │   │   └── route.ts        # Incoming POs
│   │   │   │   └── ai-upload/
│   │   │   │       └── route.ts        # AI Magic Upload endpoint
│   │   │   ├── factoring/
│   │   │   │   ├── facilities/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   ├── invoices/
│   │   │   │   │   └── route.ts        # Factorable pipeline
│   │   │   │   └── risk/
│   │   │   │       └── route.ts
│   │   │   ├── shipping/
│   │   │   │   ├── trips/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   ├── routes/
│   │   │   │   │   └── optimize/route.ts # AI route optimization
│   │   │   │   └── stops/
│   │   │   │       └── [id]/
│   │   │   │           └── deliver/route.ts
│   │   │   ├── eta/
│   │   │   │   ├── submit/route.ts     # Submit to ETA (background)
│   │   │   │   ├── status/
│   │   │   │   │   └── [uuid]/route.ts
│   │   │   │   └── callback/route.ts   # ETA webhook receiver
│   │   │   ├── intelligence/
│   │   │   │   ├── insights/route.ts
│   │   │   │   └── competitors/route.ts
│   │   │   └── admin/
│   │   │       ├── audit-log/route.ts
│   │   │       ├── authority-rules/route.ts
│   │   │       └── fees/
│   │   │           └── route.ts
│   │   │
│   │   └── webhooks/                   # EXTERNAL: Webhook receivers
│   │       ├── inventory/
│   │       │   └── [provider]/route.ts # Generic webhook handler
│   │       └── eta/
│   │           └── callback/route.ts
│   │
│   ├── layout.tsx                      # ROOT: Minimal, loads global providers
│   └── globals.css                     # Tailwind v4 + Glassmorphism tokens
│
├── components/
│   ├── ui/                             # shadcn/ui primitives (buttons, inputs, dialogs)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── sheet.tsx
│   │   ├── toast.tsx
│   │   └── skeleton.tsx
│   │
│   ├── layout/                         # Structural components
│   │   ├── marketing-navbar.tsx
│   │   ├── marketing-footer.tsx
│   │   ├── dashboard-shell.tsx         # Sidebar + Header + Main content area
│   │   ├── dashboard-sidebar.tsx       # Role-aware navigation
│   │   ├── dashboard-header.tsx        # Tenant switcher + notifications + user
│   │   └── auth-layout.tsx
│   │
│   ├── auth/                           # Auth-specific components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── role-selector.tsx           # Visual role cards
│   │   └── tenant-onboarding-form.tsx  # Dynamic per-role
│   │
│   ├── dashboards/                     # Role-specific dashboard modules
│   │   ├── hotel/
│   │   │   ├── procurement-panel.tsx
│   │   │   ├── approval-queue.tsx
│   │   │   ├── spend-chart.tsx
│   │   │   └── catalog-browser.tsx
│   │   ├── supplier/
│   │   │   ├── inventory-table.tsx
│   │   │   ├── order-inbox.tsx
│   │   │   ├── ai-upload-dropzone.tsx
│   │   │   └── sync-status-panel.tsx
│   │   ├── factoring/
│   │   │   ├── facility-card.tsx
│   │   │   ├── invoice-pipeline.tsx
│   │   │   └── risk-gauge.tsx
│   │   ├── shipping/
│   │   │   ├── trip-map.tsx
│   │   │   ├── route-timeline.tsx
│   │   │   └── delivery-optimization-panel.tsx
│   │   └── admin/
│   │       ├── tenant-table.tsx
│   │       ├── audit-log-viewer.tsx
│   │       ├── authority-rule-editor.tsx
│   │       └── fee-metric-cards.tsx
│   │
│   ├── ai-assistant/                   # Vercel AI SDK Smart Assistant
│   │   ├── assistant-shell.tsx         # Floating/docked panel
│   │   ├── assistant-input.tsx
│   │   ├── assistant-message.tsx
│   │   ├── use-role-assistant.ts       # Role-specific system prompts
│   │   └── prompts/
│   │       ├── hotel-prompt.ts         # "Suggest local SME alternatives..."
│   │       ├── supplier-prompt.ts      # "Forecast demand for SKU..."
│   │       ├── factoring-prompt.ts     # "Assess risk for Hotel X..."
│   │       ├── shipping-prompt.ts      # "Optimize route for Zone Y..."
│   │       └── admin-prompt.ts         # "Flag anomalous transactions..."
│   │
│   └── shared/                         # Cross-cutting presentational
│       ├── data-table.tsx              # Generic sortable/filterable table
│       ├── stat-card.tsx
│       ├── status-badge.tsx
│       ├── entity-avatar.tsx
│       ├── tenant-switcher.tsx         # Dropdown for multi-tenant users
│       └── permission-gate.tsx         # Client-side UI gating (render/hide only)
│
├── lib/
│   ├── prisma.ts                       # Prisma singleton (existing)
│   │
│   ├── auth/                           # AUTHENTICATION & SESSION
│   │   ├── password.ts                 # bcrypt helpers (from auth.ts)
│   │   ├── session.ts                  # JWT create/verify/clear (existing)
│   │   ├── rbac.ts                     # RBAC engine: hasPermission(), requirePermission()
│   │   ├── authority-matrix.ts         # Rule evaluation engine + PaymentGuarantee gate
│   │   └── middleware.ts               # Edge middleware auth checks
│   │
│   ├── tenant/                         # TENANT ISOLATION
│   │   ├── context.ts                  # getTenantContext() — extracts tenant from session
│   │   ├── scope.ts                    # tenantWhereClause() — Prisma query scoping
│   │   └── switch.ts                   # Multi-tenant user tenant switching logic
│   │
│   ├── eta/                            # ETA E-INVOICING BRIDGE (INVISIBLE)
│   │   ├── client.ts                   # HTTP client for ETA API
│   │   ├── signer.ts                   # Digital signature generation
│   │   ├── validator.ts                # Payload validation + FACTORING GATE
│   │   ├── formatter.ts                # Order/Invoice → ETA JSON payload
│   │   ├── submitter.ts                # Submission orchestrator (retry logic)
│   │   ├── queue.ts                    # Dead-letter queue interface
│   │   └── types.ts                    # ETA API type definitions
│   │
│   ├── inventory/                      # INVENTORY SYNC (REST + Webhooks)
│   │   ├── sync.ts                     # REST sync orchestrator
│   │   ├── webhook-handler.ts          # Generic webhook processor
│   │   ├── adapter.ts                  # Supplier-specific format adapters
│   │   ├── transformer.ts              # Normalize to Product schema
│   │   └── types.ts
│   │
│   ├── ai/                             # AI / INTELLIGENCE
│   │   ├── sdk.ts                      # Vercel AI SDK configuration
│   │   ├── prompts.ts                  # Base prompt templates
│   │   ├── hotel-insights.ts           # Hotel-specific insight generators
│   │   ├── supplier-insights.ts        # Supplier-specific generators
│   │   └── route-optimizer.ts          # Logistics optimization
│   │
│   ├── fintech/                        # FINTECH ENGINE
│   │   ├── factoring-engine.ts         # Non-recourse factoring orchestration
│   │   ├── factoring-bridge.ts         # Unified partner API (EFG Hermes, Contact)
│   │   ├── risk-engine.ts              # Credit scoring + Smart Fix suggestions
│   │   ├── hub-revenue.ts              # Platform fee + membership discount + TCP report
│   │   ├── fee-calculator.ts           # Transaction fee % engine
│   │   ├── credit-gate.ts              # Existing credit check logic
│   │   ├── idempotency.ts              # Idempotency key generation/validation
│   │   └── ledger.ts                   # Double-entry journal generation
│   │
│   ├── validators/                     # INPUT VALIDATION
│   │   ├── auth.ts
│   │   ├── tenant.ts
│   │   ├── order.ts
│   │   ├── invoice.ts
│   │   └── common.ts
│   │
│   └── utils.ts                        # Shared utilities
│
├── hooks/                              # REACT HOOKS
│   ├── use-auth.ts
│   ├── use-tenant.ts                   # Current tenant context
│   ├── use-permissions.ts              # Fetch user permissions
│   ├── use-role-assistant.ts           # AI assistant hook per role
│   └── use-dashboard-data.ts           # SWR data fetching patterns
│
├── middleware.ts                       # NEXT.JS EDGE MIDDLEWARE
│                                       # Route protection, tenant injection, RBAC enforcement
│
├── types/
│   ├── auth.ts
│   ├── tenant.ts
│   ├── rbac.ts
│   ├── api.ts
│   └── eta.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── scripts/
│   ├── migrate-v2.sh                   # One-shot migration script
│   └── seed-tenants.ts                 # Seed platform tenant + roles
│
├── docs/
│   ├── ARCHITECTURE_OVERHAUL_PLAN.md   # THIS FILE
│   ├── rbac-spec.md                    # Permission catalog + role definitions
│   ├── authority-matrix-spec.md        # Rule engine logic
│   ├── eta-integration.md              # ETA API bridge spec
│   └── audit-log.md                    # (existing)
│
├── data/                               # Seeded data (existing)
│
├── public/
│   └── uploads/
│
├── next.config.ts
├── tailwind.config.ts                  # Dark mode glassmorphism theme
├── tsconfig.json
└── package.json
```

---

## 4. MIDDLEWARE STRATEGY (`middleware.ts`)

```typescript
// Route group mapping
const PUBLIC_ROUTES = ['/', '/about', '/pricing', '/contact', '/solutions', '/blog'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/verify-email'];
const ROLE_ROUTES = {
  '/hotel': ['HOTEL_GROUP'],
  '/supplier': ['SUPPLIER'],
  '/factoring': ['FACTORING_COMPANY'],
  '/shipping': ['SHIPPING_PROVIDER'],
  '/admin': ['PLATFORM'],
};

// Execution flow:
// 1. Verify JWT session
// 2. Enforce tenant isolation (inject tenantId into headers)
// 3. Check role-route alignment
// 4. Check permission for API routes (Permission-Required header)
// 5. Redirect unauthorized to /login or /unauthorized
```

---

## 5. RBAC PERMISSION CATALOG (First Pass)

| Code | Name | Scope |
|------|------|-------|
| `order:create` | Create Purchase Order | Tenant |
| `order:read` | View Orders | Tenant |
| `order:approve` | Approve Orders | Tenant |
| `order:cancel` | Cancel Orders | Tenant |
| `invoice:read` | View Invoices | Tenant |
| `invoice:submit_eta` | Submit to ETA | Tenant |
| `supplier:sync_inventory` | Sync Inventory | Tenant |
| `supplier:manage_catalog` | Manage Products | Tenant |
| `factoring:offer` | Create Factoring Offer | Tenant |
| `factoring:read` | View Facilities | Tenant |
| `shipping:manage_trips` | Manage Trips | Tenant |
| `shipping:optimize` | Optimize Routes | Tenant |
| `admin:manage_tenants` | Manage All Tenants | Global |
| `admin:view_audit_log` | View Audit Log | Global |
| `admin:configure_authority` | Configure Authority Matrix | Global |
| `admin:track_fees` | Track Transaction Fees | Global |

---

## 6. MIGRATION PATH

### Phase 1: Schema + Foundation (Days 1–5)
1. Add `Tenant`, `Role`, `Permission`, `RolePermission` models
2. Add `tenantId` to all tenant-scoped models
3. Create migration script `scripts/migrate-v2.sh`
4. Seed: Platform tenant, global roles (Admin), default permissions
5. Update `lib/auth/rbac.ts`, `lib/tenant/scope.ts`

### Phase 2: Middleware + Auth Restructure (Days 6–10)
1. Implement `middleware.ts` with tenant injection
2. Move auth to `app/(auth)/` with role-selection registration
3. Replace `RoleContext` (localStorage) with server-side session
4. Update `app/api/v1/auth/*` routes with tenant-aware sessions
5. Deprecate old `app/api/auth/*` routes (keep for backward compat during transition)

### Phase 3: Dashboard Restructure (Days 11–18)
1. Create `app/(dashboard)/` route groups
2. Build `dashboard-shell.tsx` with role-aware sidebar
3. Migrate existing pages from `app/(app)/` to appropriate role folder
4. Implement `TenantSwitcher` for multi-tenant users
5. Add `components/ai-assistant/` with Vercel AI SDK

### Phase 4: Backend Services (Days 19–25)
1. Implement `/lib/eta/` bridge (client, signer, validator, submitter, queue)
2. Implement `/lib/inventory/` sync engine (REST + Webhooks)
3. Implement `/lib/ai/` role-specific prompt system
4. Wire ETA submission into invoice lifecycle (background, invisible)

### Phase 5: Authority Matrix Enforcement (Days 26–30)
1. Database-driven rules in `AuthorityRule`
2. Evaluation engine in `lib/auth/authority-matrix.ts`
3. Gate all order approval APIs
4. Admin UI for rule configuration

### Phase 6: Cleanup (Days 31–35)
1. Remove `app/(app)/` (after verification)
2. Remove `src/app/` stale boilerplate
3. Remove `components/app/role-context.tsx`
4. Update `AGENTS.md` with finalized guardrails
5. Full regression test

---

## 7. RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data migration breaks existing dev.db | High | Backup before migration; script is idempotent |
| Old API routes left active | Medium | Explicit deprecation list; remove in Phase 6 |
| RoleContext removal breaks UI | Medium | Replace with server-side props; no client-side role state |
| ETA bridge complexity | High | Start with sandbox; dead-letter queue for failures |
| Tenant scoping missed in queries | Critical | `tenantWhereClause()` wrapper mandatory; linter rule |

---

## 8. DECISIONS LOCKED

| Decision | Rationale |
|----------|-----------|
| **No client-side role switching** | Security. Role is bound to session + tenant. |
| **No WebSockets for inventory** | Simplicity + scalability. REST polling + Webhooks suffice. |
| **ETA bridge has zero UI** | Compliance service, not user feature. |
| **Prisma kept (not Drizzle)** | Existing schema is large; migration cost exceeds benefit. |
| **SQLite → PostgreSQL later** | SQLite acceptable for Phase 1; PostgreSQL migration scripted. |
| **shadcn/ui + Tailwind v4** | Existing stack; glassmorphism via CSS custom properties. |

---

**End of Plan**
