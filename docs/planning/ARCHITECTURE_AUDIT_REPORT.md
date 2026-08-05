# Hotels Vendors Architecture Audit & Refactoring Report

**Prepared:** 2026-08-04  
**Scope:** Web repo (`hotels-vendors`) + Mobile repo (`hotels-vendors-mobile`)  
**Phase:** Phase 0 — Understand (planning only, no code changes)  
**Status:** DELIVERABLE A — Awaiting explicit approval before execution

---

## Executive Summary

This audit compares **two existing codebases** against the **business spec for a two-layer B2B hospitality ecosystem**:

| Layer | Current State | Target State |
|-------|---------------|--------------|
| **Web (Hotels Vendors)** | Next.js 16 App Router + Prisma/PostgreSQL + custom RBAC + Authority Matrix + Oliv integration. Multi-tenant migration IN PROGRESS (per ARCHITECTURE_OVERHAUL_PLAN.md). | Command center for Hotel Buyer, Supplier, Factoring, Shipping, Admin roles. Full governance, ETA compliance, factoring marketplace. |
| **Mobile (Invo)** | React Native 0.86 + Expo 57 + Zustand + Axios. **First draft screens** for auth, hotel catalog/cart/orders/invoices, supplier dashboard/orders/invoice-upload, credit-facility, Oliv-activation. | Operational layer ("Invo app") — scan-first, action-oriented, zero scroll walls. Deep-links to Oliv for KYC/credit. Shares API/types with web. |

**Key Finding:** Both repos have substantial foundations but **critical gaps** against the spec. The mobile app requires **significant redesign** (not just polish) to match the scan-first operational UX. The web repo's multi-tenant migration is ~60% complete per ARCHITECTURE_OVERHAUL_PLAN.md.

---

## 1. Gap Analysis

### 1.1 Web Repo Gaps (against Business Spec + ARCHITECTURE_OVERHAUL_PLAN.md)

| Area | Spec Requirement | Current State | Gap Severity | File References |
|------|------------------|---------------|--------------|-----------------|
| **Tenant Isolation** | Every query scoped to `tenantId` via `lib/tenant/scope.ts` | `lib/tenant/scope.ts` exists but is "very thin" (PROJECT_STATE.md) | 🔴 **Critical** | `lib/tenant/scope.ts`, `prisma/schema.prisma` (tenantId on all models) |
| **RBAC Enforcement** | `requirePermission(ctx, code)` at top of **every** API route | RBAC engine exists (`lib/auth/rbac.ts`) but enforcement spotty | 🔴 **Critical** | `lib/auth/rbac.ts`, `app/api/v1/**/route.ts` |
| **Permission Catalog** | 15+ permission codes (see ARCHITECTURE_OVERHAUL_PLAN.md §5) | `Permission` model exists; seed data missing | 🟠 **High** | `prisma/schema.prisma` (Permission model), no seed script |
| **Role Definitions** | Hotel: Staff/Manager/Procurement/Finance; Supplier: Sales/Delivery; Admin | `UserRole` enum has OWNER, GM, FINANCIAL_CONTROLLER, DEPARTMENT_HEAD, CLERK, RECEIVING_CLERK — missing PROCUREMENT, SUPPLIER_SALES, SUPPLIER_DELIVERY | 🟠 **High** | `prisma/schema.prisma` (UserRole enum) |
| **Authority Matrix** | DB-driven rules + Payment Guarantee Gate + ETA Validation Gate | Implemented in `lib/auth/authority-matrix.ts` with built-in rules; **missing**: tenant-specific rules UI, Admin override dual-auth audit alert | 🟡 **Medium** | `lib/auth/authority-matrix.ts`, `prisma/schema.prisma` (AuthorityRule) |
| **State Machine** | Valid transitions + gates (paymentGuarantee, etaValidation, authorityApproval) | Implemented in `lib/auth/state-machine.ts`; **missing**: gate for `IN_TRANSIT → DELIVERED` requires authorityApproval (only has IN_TRANSIT→DELIVERED) | 🟡 **Medium** | `lib/auth/state-machine.ts` (TRANSITION_GATES) |
| **Internal Requisition** | Housekeeping scan-to-request → Manager approval → Procurement converts to PO | **MISSING ENTIRELY** — no `InternalRequisition`, `RequisitionItem` models | 🔴 **Critical** | — |
| **PO ↔ Requisition Link** | Requisition → PO conversion with audit trail | **MISSING** — Order model exists but no requisition linkage | 🔴 **Critical** | — |
| **Invoice States** | DRAFT → ISSUED → SUBMITTED → VALIDATED → PAID/FACTORED | `InvoiceStatus` enum has DRAFT, ISSUED, SUBMITTED, VALIDATED, DISPUTED, CREDIT_NOTE — **missing**: PAID, FACTORED, OVERDUE | 🟠 **High** | `prisma/schema.prisma` (InvoiceStatus enum) |
| **Credit-Line Payment Redirect** | "Pay via Credit Line" → deep-link to Oliv app | Oliv checkout URL generation exists (`lib/payments/oliv-checkout.ts`); **missing**: mobile deep-link handler, redirect flow from web/mobile | 🟠 **High** | `lib/payments/oliv-checkout.ts`, `app/api/v1/fintech/oliv-callback/route.ts` |
| **Four-Eyes Governance** | Dual attestation on consolidated invoices | Implemented in `lib/auth/four-eyes.ts`; **missing**: integration with Invoice/ConsolidatedInvoice workflow | 🟡 **Medium** | `lib/auth/four-eyes.ts` |
| **Webhook Idempotency** | Replay protection for Oliv/ETA webhooks | Implemented in `lib/security/webhook-idempotency.ts` (referenced in oliv-callback) | ✅ **Done** | `app/api/v1/fintech/oliv-callback/route.ts` |
| **Multi-Tenant Auth** | Session → tenantId → roleId → permissions | `lib/auth/session.ts` exists; middleware.ts **not yet implemented** | 🔴 **Critical** | `middleware.ts` (missing), `lib/auth/middleware.ts` (planned) |
| **Route Groups** | `(marketing)`, `(auth)`, `(dashboard)/[role]` | Structure defined in AGENTS.md; **actual files** in `app/(dashboard)/` incomplete | 🟠 **High** | `app/(dashboard)/hotel/`, `app/(dashboard)/supplier/`, etc. |
| **AI Assistant** | Role-specific prompts per dashboard | `components/ai-assistant/` planned; **not implemented** | 🟡 **Medium** | — |

### 1.2 Mobile Repo Gaps (against Business Spec + Invo UX Blueprint)

| Area | Spec Requirement | Current State | Gap Severity | File References |
|------|------------------|---------------|--------------|-----------------|
| **Architecture** | Monorepo sharing API/types with web | Separate repo; **no shared types/package** | 🔴 **Critical** | — |
| **Authentication** | Role-selection onboarding → Oliv deep-link for suppliers | Basic login/register; role stored in Zustand; **no Oliv gateway screen for hotel users** | 🟠 **High** | `src/screens/auth/`, `src/store/auth.ts` |
| **Onboarding Gateway** | Hotel: direct to catalog; Supplier: Oliv KYC flow | Supplier has `OlivActivationScreen` (good); Hotel has no onboarding | 🟠 **High** | `src/screens/supplier/OlivActivationScreen.tsx` |
| **Scan-First UX** | Camera/barcode scan → auto-create requisition | **MISSING** — no camera, no barcode scanning, no requisition flow | 🔴 **Critical** | — |
| **Catalog** | Search, filter, real photos, add to cart | `CatalogScreen` exists but uses placeholder categories ("F&B", "Housekeeping" vs spec "F&B, Consumables, Guest Supplies, FF&E, Services"); no images | 🟡 **Medium** | `src/screens/hotel/CatalogScreen.tsx` |
| **Requisitions** | Submit → Manager approve → Procurement converts to PO | **MISSING ENTIRELY** | 🔴 **Critical** | — |
| **Approvals** | Manager sees queue, approve/reject with budget check | **MISSING** | 🔴 **Critical** | — |
| **Purchase Orders** | Procurement creates PO from approved requisitions | `OrdersScreen` shows orders but no PO creation flow | 🔴 **Critical** | `src/screens/hotel/OrdersScreen.tsx` |
| **Supplier PO Acceptance** | Accept/reject, generate invoice, mark shipped/delivered | `SupplierOrdersScreen` shows orders read-only; **no actions** | 🔴 **Critical** | `src/screens/supplier/SupplierOrdersScreen.tsx` |
| **Invoice Upload** | Supplier uploads digital invoice → ETA submission | `InvoiceUploadScreen` exists (not read); likely basic | 🟡 **Medium** | `src/screens/supplier/InvoiceUploadScreen.tsx` |
| **Credit Facility** | View limit/balance, request factoring, redirect to Oliv | `CreditFacilityScreen`, `FactoringHistoryScreen` exist (not read) | 🟡 **Medium** | `src/screens/supplier/CreditFacilityScreen.tsx` |
| **Push Notifications** | Real-time alerts for approvals, deliveries, payments | **MISSING** — no Expo push setup | 🟠 **High** | — |
| **Offline Support** | Queue scans/actions offline, sync when online | **MISSING** | 🟡 **Medium** | — |
| **Deep-Linking** | `invo://` scheme for Oliv redirect, email links | **MISSING** | 🟠 **High** | `app.json` (no scheme) |
| **Design System** | Deep blue, charcoal, matte gold, real photography | Dark mode glassmorphism (green primary); **not premium B2B aesthetic** | 🟡 **Medium** | `src/theme/index.ts` |
| **Type Safety** | Shared Zod schemas from web API contracts | Local `src/types/index.ts`; **drift risk** | 🟠 **High** | `src/types/index.ts` |
| **API Client** | Axios with interceptors, token refresh | Implemented well in `src/api/index.ts` | ✅ **Good** | `src/api/index.ts` |
| **State Management** | Zustand stores | Auth + Cart stores; **missing**: requisitions, approvals, notifications | 🟡 **Medium** | `src/store/auth.ts`, `src/store/cart.ts` |

### 1.3 Cross-Repo Inconsistencies

| Inconsistency | Web | Mobile | Impact |
|---------------|-----|--------|--------|
| **Role Names** | `UserRole` enum: OWNER, GM, FINANCIAL_CONTROLLER, DEPARTMENT_HEAD, CLERK, RECEIVING_CLERK | `UserRole` type: likely string-based, not synced | AuthZ mismatches |
| **Order Status** | `OrderStatus` enum: DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, CONFIRMED, IN_TRANSIT, PARTIALLY_DELIVERED, DELIVERED, DISPUTED, CANCELLED | `OrderStatus` type: subset, missing PENDING_APPROVAL, PARTIALLY_DELIVERED | State sync errors |
| **Product Categories** | `ProductCategory` enum: F_AND_B, CONSUMABLES, GUEST_SUPPLIES, FFE, SERVICES | Hardcoded `["All", "F&B", "Housekeeping", "Amenities", "Engineering", "Capital Equipment"]` | Catalog mismatch |
| **API Endpoints** | `/api/v1/hotel/catalog`, `/api/v1/supplier/orders`, etc. | `hotelAPI.catalog()`, `supplierAPI.orders()` — **paths don't match** v1 structure | 404s |
| **Oliv Integration** | Webhook callback, checkout URL, KYC status API | `olivAPI.onboardSupplier()`, `olivAPI.initiateFactoring()` — **different endpoints** | Integration broken |

---

## 2. RBAC Enforcement Plan

### 2.1 Permission Codes to Add (Prisma Seed)

```prisma
// Required permission codes per ARCHITECTURE_OVERHAUL_PLAN.md §5 + Business Spec
const PERMISSIONS = [
  // Hotel Buyer
  { code: "hotel:catalog:read", name: "View Product Catalog", description: "Browse supplier catalog" },
  { code: "hotel:requisition:create", name: "Create Internal Requisition", description: "Scan-to-request items" },
  { code: "hotel:requisition:read", name: "View Requisitions", description: "See own/team requisitions" },
  { code: "hotel:requisition:approve", name: "Approve Requisitions", description: "Manager approval up to budget" },
  { code: "hotel:po:create", name: "Create Purchase Order", description: "Procurement converts requisition to PO" },
  { code: "hotel:po:read", name: "View Purchase Orders", description: "Track PO status" },
  { code: "hotel:po:approve", name: "Approve PO Payment", description: "Finance approves final payment" },
  { code: "hotel:invoice:read", name: "View Invoices", description: "Finance reviews invoices" },
  { code: "hotel:invoice:submit_eta", name: "Submit Invoice to ETA", description: "ETA compliance submission" },
  { code: "hotel:credit:redirect", name: "Redirect to Oliv for Payment", description: "Pay via credit line" },
  { code: "hotel:spend:read", name: "View Spend Analytics", description: "Procurement analytics" },
  
  // Supplier
  { code: "supplier:catalog:manage", name: "Manage Product Catalog", description: "CRUD products, inventory" },
  { code: "supplier:po:read", name: "View Incoming POs", description: "See orders from hotels" },
  { code: "supplier:po:accept", name: "Accept/Reject PO", description: "Confirm availability" },
  { code: "supplier:invoice:create", name: "Generate Digital Invoice", description: "Create invoice from accepted PO" },
  { code: "supplier:invoice:upload", name: "Upload Invoice Document", description: "PDF/ETA submission" },
  { code: "supplier:delivery:update", name: "Update Delivery Status", description: "Mark shipped/delivered" },
  { code: "supplier:credit:view", name: "View Credit Facility", description: "See Oliv credit line" },
  { code: "supplier:factoring:request", name: "Request Factoring", description: "Initiate early payment" },
  
  // Factoring Company
  { code: "factoring:facility:manage", name: "Manage Credit Facilities", description: "Approve/suspend lines" },
  { code: "factoring:invoice:review", name: "Review Factorable Invoices", description: "Pipeline of invoices" },
  { code: "factoring:risk:assess", name: "Assess Credit Risk", description: "Scoring & monitoring" },
  
  // Shipping/Logistics (Future Phase)
  { code: "shipping:trip:manage", name: "Manage Trips", description: "Create/optimize routes" },
  { code: "shipping:delivery:confirm", name: "Confirm Delivery", description: "POD capture" },
  
  // Platform Admin
  { code: "admin:tenants:manage", name: "Manage Tenants", description: "CRUD tenant records" },
  { code: "admin:roles:manage", name: "Manage Roles", description: "Role/permission assignment" },
  { code: "admin:authority:configure", name: "Configure Authority Matrix", description: "Global rules" },
  { code: "admin:audit:read", name: "View Audit Log", description: "Immutable audit trail" },
  { code: "admin:fees:track", name: "Track Transaction Fees", description: "Revenue monitoring" },
  { code: "admin:oliv:manage", name: "Manage Oliv Integration", description: "Partner configuration" },
];
```

### 2.2 Role → Permission Mapping (Seed)

| Role | Permissions |
|------|-------------|
| **HOTEL_STAFF** (Dept Staff) | `hotel:catalog:read`, `hotel:requisition:create`, `hotel:requisition:read` |
| **HOTEL_MANAGER** (Dept Manager) | HOTEL_STAFF + `hotel:requisition:approve`, `hotel:po:read` |
| **HOTEL_PROCUREMENT** | HOTEL_MANAGER + `hotel:po:create`, `hotel:catalog:read`, `hotel:spend:read` |
| **HOTEL_FINANCE** | HOTEL_PROCUREMENT + `hotel:po:approve`, `hotel:invoice:read`, `hotel:invoice:submit_eta`, `hotel:credit:redirect` |
| **SUPPLIER_SALES** | `supplier:catalog:manage`, `supplier:po:read`, `supplier:po:accept`, `supplier:invoice:create`, `supplier:invoice:upload`, `supplier:delivery:update` |
| **SUPPLIER_DELIVERY** | `supplier:po:read`, `supplier:delivery:update` |
| **FACTORING_ANALYST** | `factoring:facility:manage`, `factoring:invoice:review`, `factoring:risk:assess` |
| **PLATFORM_ADMIN** | All permissions (global) |

### 2.3 API Routes Requiring `requirePermission()` Insertion

| Route | Required Permission(s) |
|-------|------------------------|
| `POST /api/v1/hotel/requisitions` | `hotel:requisition:create` |
| `GET /api/v1/hotel/requisitions` | `hotel:requisition:read` |
| `POST /api/v1/hotel/requisitions/:id/approve` | `hotel:requisition:approve` |
| `POST /api/v1/hotel/purchase-orders` | `hotel:po:create` |
| `GET /api/v1/hotel/purchase-orders` | `hotel:po:read` |
| `POST /api/v1/hotel/purchase-orders/:id/approve-payment` | `hotel:po:approve` |
| `GET /api/v1/hotel/invoices` | `hotel:invoice:read` |
| `POST /api/v1/hotel/invoices/:id/submit-eta` | `hotel:invoice:submit_eta` |
| `POST /api/v1/hotel/credit/redirect` | `hotel:credit:redirect` |
| `GET /api/v1/supplier/orders` | `supplier:po:read` |
| `POST /api/v1/supplier/orders/:id/accept` | `supplier:po:accept` |
| `POST /api/v1/supplier/invoices` | `supplier:invoice:create` |
| `POST /api/v1/supplier/invoices/:id/upload` | `supplier:invoice:upload` |
| `POST /api/v1/supplier/deliveries/:id/update` | `supplier:delivery:update` |
| `GET /api/v1/supplier/credit-facility` | `supplier:credit:view` |
| `POST /api/v1/supplier/factoring/request` | `supplier:factoring:request` |
| `GET /api/v1/factoring/facilities` | `factoring:facility:manage` |
| `GET /api/v1/factoring/invoices` | `factoring:invoice:review` |
| `GET /api/v1/admin/tenants` | `admin:tenants:manage` |
| `GET /api/v1/admin/authority-rules` | `admin:authority:configure` |

**Implementation Pattern:**
```typescript
// Every API route handler:
export const POST = apiRoute(async (request) => {
  const auth = await authenticate(request);
  if (!auth) return error("Unauthorized", 401);
  
  await requirePermission(auth, "hotel:po:create"); // ← ADD THIS
  
  // ... business logic
});
```

---

## 3. Data Model Changes

### 3.1 New Models (Prisma)

```prisma
// Internal Requisition — Housekeeping scan-to-request
model InternalRequisition {
  id              String    @id @default(cuid())
  requisitionNumber String  @unique
  status          RequisitionStatus @default(DRAFT)
  outletId        String
  propertyId      String
  hotelId         String
  tenantId        String
  requesterId     String    // Dept Staff who scanned
  approverId      String?   // Dept Manager who approved
  approvedAt      DateTime?
  rejectedAt      DateTime?
  rejectionReason String?
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime?
  
  // Link to PO when converted
  purchaseOrderId String?   @unique
  purchaseOrder   PurchaseOrder? @relation(fields: [purchaseOrderId], references: [id])
  
  items           RequisitionItem[]
  outlet          Outlet    @relation(fields: [outletId], references: [id])
  property        Property  @relation(fields: [propertyId], references: [id])
  hotel           Hotel     @relation(fields: [hotelId], references: [id])
  tenant          Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  requester       User      @relation(fields: [requesterId], references: [id])
  approver        User?     @relation(fields: [approverId], references: [id])
  
  @@index([tenantId, status])
  @@index([outletId, createdAt])
  @@index([hotelId, createdAt])
  @@index([purchaseOrderId])
}

enum RequisitionStatus {
  DRAFT
  SUBMITTED
  APPROVED
  REJECTED
  CONVERTED_TO_PO
  CANCELLED
}

model RequisitionItem {
  id                 String   @id @default(cuid())
  requisitionId      String
  productId          String
  quantity           Int
  unitOfMeasure      String
  notes              String?
  estimatedUnitPrice Decimal? @db.Decimal(12, 2)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  deletedAt          DateTime?
  
  requisition        InternalRequisition @relation(fields: [requisitionId], references: [id], onDelete: Cascade)
  product            Product             @relation(fields: [productId], references: [id])
  
  @@index([requisitionId])
  @@index([productId])
}

// Purchase Order — Enhanced with requisition link
model PurchaseOrder {
  id                   String        @id @default(cuid())
  poNumber             String        @unique
  status               POStatus      @default(DRAFT)
  requisitionId        String?       @unique  // Link back to originating requisition
  requisition          InternalRequisition? @relation(fields: [requisitionId], references: [id])
  
  hotelId              String
  supplierId           String
  propertyId           String?
  outletId             String?
  tenantId             String
  requesterId          String        // Procurement user who created PO
  approverId           String?       // Finance who approved payment
  
  deliveryDate         DateTime?
  deliveryInstructions String?
  paymentTerms         String?       // Net-30, Net-60, etc.
  subtotal             Decimal?      @db.Decimal(12, 2)
  vatAmount            Decimal?      @db.Decimal(12, 2)
  total                Decimal?      @db.Decimal(12, 2)
  
  // Authority Matrix snapshot at approval
  authoritySnapshot    Json?
  
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt
  deletedAt            DateTime?
  
  hotel                Hotel         @relation(fields: [hotelId], references: [id])
  supplier             Supplier      @relation(fields: [supplierId], references: [id])
  property             Property?     @relation(fields: [propertyId], references: [id])
  outlet               Outlet?       @relation(fields: [outletId], references: [id])
  tenant               Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  requester            User          @relation(fields: [requesterId], references: [id])
  approver             User?         @relation(fields: [approverId], references: [id])
  items                PurchaseOrderItem[]
  invoices             Invoice[]
  
  @@index([tenantId, status])
  @@index([hotelId, createdAt])
  @@index([supplierId, createdAt])
  @@index([requisitionId])
}

enum POStatus {
  DRAFT
  SENT_TO_SUPPLIER
  ACCEPTED
  REJECTED
  PARTIALLY_DELIVERED
  DELIVERED
  INVOICED
  PAYMENT_APPROVED
  PAID
  CANCELLED
}

model PurchaseOrderItem {
  id                String   @id @default(cuid())
  purchaseOrderId   String
  productId         String
  quantity          Int
  unitPrice         Decimal  @db.Decimal(12, 2)
  total             Decimal  @db.Decimal(12, 2)
  receivedQuantity  Int      @default(0)
  notes             String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  deletedAt         DateTime?
  
  purchaseOrder     PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
  product           Product       @relation(fields: [productId], references: [id])
  
  @@index([purchaseOrderId])
  @@index([productId])
}

// Enhanced Invoice — Add missing states + credit-line payment link
model Invoice {
  // ... existing fields ...
  
  // ADD:
  purchaseOrderId     String?       @unique
  purchaseOrder       PurchaseOrder? @relation(fields: [purchaseOrderId], references: [id])
  
  // Credit-line payment tracking
  creditLinePaymentId String?       // Oliv checkout reference
  creditLineStatus    CreditLinePaymentStatus @default(NOT_INITIATED)
  creditLinePaidAt    DateTime?
  
  // ETA compliance
  etaSubmissionId     String?       @unique
  etaValidatedAt      DateTime?
  
  @@index([purchaseOrderId])
  @@index([creditLinePaymentId])
}

enum CreditLinePaymentStatus {
  NOT_INITIATED
  REDIRECTED_TO_OLIV
  PAYMENT_PENDING
  PAID
  FAILED
  EXPIRED
}

// Notification — For push/real-time alerts
model Notification {
  id          String             @id @default(cuid())
  tenantId    String
  userId      String
  type        NotificationType
  title       String
  body        String
  data        Json?              // Deep-link params, entity IDs
  readAt      DateTime?
  sentAt      DateTime           @default(now())
  createdAt   DateTime           @default(now())
  
  user        User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  tenant      Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@index([tenantId, userId, readAt])
  @@index([userId, createdAt])
}

enum NotificationType {
  REQUISITION_SUBMITTED
  REQUISITION_APPROVED
  REQUISITION_REJECTED
  PO_CREATED
  PO_ACCEPTED
  PO_REJECTED
  INVOICE_RECEIVED
  INVOICE_APPROVED
  DELIVERY_SCHEDULED
  DELIVERY_COMPLETED
  PAYMENT_DUE
  PAYMENT_RECEIVED
  CREDIT_LINE_AVAILABLE
  SYSTEM_ALERT
}
```

### 3.2 Modified Models

| Model | Changes |
|-------|---------|
| `User` | Add `outletId` (for dept staff), `propertyId`; ensure `roleId` FK to `Role` (not enum) |
| `Role` | Add `Hotel_STAFF`, `HOTEL_MANAGER`, `HOTEL_PROCUREMENT`, `HOTEL_FINANCE`, `SUPPLIER_SALES`, `SUPPLIER_DELIVERY`, `FACTORING_ANALYST` as tenant-scoped roles |
| `Permission` | Seed with 29 codes above |
| `Order` | **Deprecate** in favor of `PurchaseOrder` + `InternalRequisition`; keep for backward compat with migration script |
| `Invoice` | Add `purchaseOrderId`, `creditLinePaymentId`, `creditLineStatus`, `etaSubmissionId` |
| `ProductCategory` | Enum matches spec: `F_AND_B`, `CONSUMABLES`, `GUEST_SUPPLIES`, `FFE`, `SERVICES` (mobile must align) |

---

## 4. Mobile Architecture Decision

### 4.1 Evaluation: React Native 0.86 + Expo 57 (Current) vs Alternatives

| Criterion | RN + Expo (Current) | Flutter | Native (Swift/Kotlin) | Recommendation |
|-----------|---------------------|---------|----------------------|----------------|
| **Code Sharing with Web** | ✅ TypeScript, shared types possible | ❌ Dart | ❌ Separate codebases | **Keep RN** |
| **Expo SDK 57** | ✅ Latest, EAS builds, OTA updates | N/A | N/A | **Keep** |
| **Camera/Barcode** | ✅ `expo-camera`, `expo-barcode-scanner` | ✅ | ✅ | **Keep** |
| **Push Notifications** | ✅ Expo Push Service (FCM/APNs) | ✅ | ✅ | **Keep** |
| **Deep Linking** | ✅ `expo-linking`, custom scheme | ✅ | ✅ | **Keep** |
| **Offline Queue** | ✅ `expo-sqlite` + sync logic | ✅ | ✅ | **Keep** |
| **Performance** | ✅ RN 0.86 (Fabric, TurboModules) | ✅ Better for heavy animation | ✅ Best | **Acceptable** |
| **Team Skills** | ✅ Existing codebase | ❌ New language | ❌ New languages | **Keep** |
| **Monorepo Potential** | ✅ `expo-yarn-workspaces`, shared `packages/` | ⚠️ Possible but complex | ❌ | **Keep** |

**Verdict: KEEP React Native 0.86 + Expo 57.** The stack is modern, supports all required features, and the existing codebase is a reasonable foundation. **Rewrite per-screen** to match spec, don't migrate framework.

### 4.2 Monorepo Layout (Recommended)

```
hotels-vendors-monorepo/
├── apps/
│   ├── web/                    # Current hotels-vendors (Next.js)
│   └── mobile/                 # Current hotels-vendors-mobile (Expo)
├── packages/
│   ├── api-contracts/          # Shared Zod schemas, TypeScript types
│   │   ├── src/
│   │   │   ├── hotel/          # Hotel buyer API types
│   │   │   ├── supplier/       # Supplier API types
│   │   │   ├── factoring/      # Factoring API types
│   │   │   ├── common/         # Shared enums, pagination, errors
│   │   │   └── index.ts
│   │   └── package.json
│   ├── ui-primitives/          # Shared design tokens (colors, spacing, typography)
│   │   ├── src/
│   │   │   ├── tokens.ts       # Platform-agnostic tokens
│   │   │   ├── web/            # Tailwind config extension
│   │   │   └── mobile/         # StyleSheet.create() helpers
│   │   └── package.json
│   ├── auth/                   # Shared auth utilities (JWT decode, token refresh)
│   └── utils/                  # Shared helpers (date, currency, validation)
├── turbo.json                  # Turborepo config
├── package.json                # Root workspace
└── pnpm-workspace.yaml         # pnpm workspaces (recommended over npm/yarn)
```

**Migration Path:**
1. Create `packages/api-contracts` from web `app/api/v1/**/route.ts` Zod schemas + mobile `src/types/index.ts`
2. Update web API routes to import from `@hotels-vendors/api-contracts`
3. Update mobile `src/api/index.ts` to use shared types
4. Configure `expo-yarn-workspaces` or `pnpm` for mobile app
5. Add `@hotels-vendors/ui-primitives` for design token parity

### 4.3 Deep-Link / URI Scheme for Oliv Redirect

```json
// mobile/app.json
{
  "expo": {
    "scheme": "invo",
    "ios": { "bundleIdentifier": "com.hotelsvendors.invo" },
    "android": { "package": "com.hotelsvendors.invo" }
  }
}
```

**Oliv Redirect Flow:**
```
1. Mobile: User taps "Pay via Credit Line" on InvoiceDetailScreen
2. Mobile: Calls POST /api/v1/fintech/oliv-checkout { invoiceId, amount }
3. Web API: Returns { checkoutUrl: "https://sandbox.oliv.finance/checkout/...", reference }
4. Mobile: Opens checkoutUrl in SafariViewController / Chrome Custom Tab (expo-web-browser)
5. Oliv: User completes KYC/approval in Oliv app/web
6. Oliv: Redirects to `invo://payment-return?reference=oliv_...&status=success`
6. Mobile: Handles deep link → polls /api/v1/fintech/oliv-status?reference=... → shows result
```

**Web Equivalent:** `https://www.hotelsvendors.com/payment/oliv-return?reference=...` (server-side handles callback, redirects to dashboard)

---

## 5. UX Blueprint for Invo (Mobile Operational Layer)

### 5.1 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Scan-First** | Camera/barcode scanner is the **primary action** on Home tab (bottom-center FAB) |
| **Action-Oriented** | Every screen has one primary CTA; no "settings" walls |
| **Zero Scroll Walls** | Critical info above fold; progressive disclosure |
| **Premium B2B Aesthetic** | Deep navy `#0B1426`, charcoal `#1A1F2E`, matte gold `#C9A84C` accents; real product photography |
| **Role-Contextual** | Hotel users see requisitions/approvals; Suppliers see PO actions; no cross-role noise |
| **Offline-First** | Scan queues locally; sync indicator in header |

### 5.2 Color System (Mobile)

```typescript
// packages/ui-primitives/src/tokens.ts
export const colors = {
  // Brand
  primary: "#C9A84C",        // Matte gold
  primaryDark: "#A68A3D",
  primaryLight: "#E8D5A0",
  primaryMuted: "rgba(201,168,76,0.12)",
  
  // Surfaces
  bg: "#0B1426",             // Deep navy
  bgElevated: "#1A1F2E",     // Charcoal card
  bgCard: "rgba(255,255,255,0.04)",
  bgInput: "rgba(255,255,255,0.06)",
  bgModal: "rgba(11,20,38,0.95)",
  
  // Borders
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.12)",
  borderFocus: "#C9A84C",
  
  // Text
  text: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.7)",
  textMuted: "rgba(255,255,255,0.45)",
  textInverse: "#0B1426",
  
  // Status (semantic)
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  
  // Workflow states
  requisitionDraft: "#6B7280",
  requisitionSubmitted: "#3B82F6",
  requisitionApproved: "#22C55E",
  requisitionRejected: "#EF4444",
  poSent: "#3B82F6",
  poAccepted: "#8B5CF6",
  poDelivered: "#22C55E",
  invoicePending: "#F59E0B",
  invoiceValidated: "#3B82F6",
  invoicePaid: "#22C55E",
  invoiceFactored: "#8B5CF6",
  
  // Category accents
  categoryFb: "#EF4444",
  categoryConsumables: "#22C55E",
  categoryGuestSupplies: "#3B82F6",
  categoryFfe: "#8B5CF6",
  categoryServices: "#F59E0B",
};
```

### 5.3 Core Screen Flows

#### 5.3.1 Onboarding Gateway (First Launch)

```
┌─────────────────────────────────────┐
│           INVO                      │
│    "Operational Layer for           │
│     Hotels Vendors"                 │
├─────────────────────────────────────┤
│  [Hotel Buyer]    [Supplier]        │
│  (I procure)      (I supply)        │
└─────────────────────────────────────┘
        │
        ▼
Hotel Buyer → Direct to Home (catalog + scan FAB)
Supplier   → OlivActivationScreen (KYC) → Home (dashboard)
```

#### 5.3.2 Home Tab — Hotel Buyer (Scan-First)

```
┌─────────────────────────────────────┐
│  INVO                    🔔  👤     │  ← Header: notifications, profile
├─────────────────────────────────────┤
│                                     │
│   ┌─────────────────────────────┐   │
│   │  "Running low on toiletries?│   │  ← Smart Assistant insight card
│   │   Scan barcode to request"  │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────┬─────────────┐     │
│   │  📦 My      │  ⏳ Pending │     │  ← Quick stat cards
│   │  Requisitions│  Approvals │     │
│   │     3       │     2       │     │
│   └─────────────┴─────────────┘     │
│                                     │
│        ┌─────────────────┐          │
│        │   [ SCAN ]      │  ← Large center FAB (camera)
│        │  (Barcode/QR)   │
│        └─────────────────┘          │
│                                     │
│   Recent Activity                   │
│   ─────────────────                 │
│   📋 Req #REQ-0042  Submitted 2h    │
│   ✅ Req #REQ-0041  Approved 1d     │
│   🚚 PO #PO-1023    Delivered 3d    │
└─────────────────────────────────────┘
[Home] [Catalog] [Approvals] [Invoices] [More]  ← Bottom tabs
```

#### 5.3.3 Scan Flow → Requisition

```
Scan Screen                    Review & Submit              Success
┌─────────────────┐           ┌─────────────────┐         ┌─────────────────┐
│   ▄▄▄▄▄▄▄▄▄▄▄    │           │  Product Found  │         │   ✅ Submitted  │
│  █ ▄▄▄ ▄▄▄ █    │   ──▶     │  ─────────────  │   ──▶   │  Requisition    │
│  █ ███ ███ █    │           │  🧴 Toilet Paper│         │  #REQ-0043      │
│  █ ▄▄▄ ▄▄▄ █    │           │  SKU: TP-001    │         │  Sent to        │
│  █ ███ ███ █    │           │  Supplier: Nile │         │  Housekeeping   │
│  ▀▀▀▀▀▀▀▀▀▀▀    │           │  Price: EGP 45  │         │  Manager        │
│                 │           │  ─────────────  │         │                 │
│  [Flash] [Flip] │           │  Qty: [ 12 ] ±  │         │  [View Queue]   │
└─────────────────┘           │  Outlet: [Kitchen▼]│        └─────────────────┘
                              │  Note: [_______] │
                              │  ─────────────  │
                              │  [Submit]       │
                              └─────────────────┘
```

#### 5.3.4 Approvals Tab — Manager View

```
┌─────────────────────────────────────┐
│  Approvals              🔍 Filter   │
├─────────────────────────────────────┤
│  📊 Budget: EGP 45,000 / 120,000   │  ← Budget bar
├─────────────────────────────────────┤
│  ⏳ PENDING (2)                     │
│  ┌─────────────────────────────┐   │
│  │ REQ-0043  Kitchen           │   │
│  │ 12× Toilet Paper  EGP 540   │   │
│  │ Requested by: Ahmed (Staff) │   │
│  │ [Approve]  [Reject]         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ REQ-0042  Pool Bar          │   │
│  │ 24× Beer Bottles  EGP 1,200 │   │
│  │ Requested by: Sara (Staff)  │   │
│  │ ⚠️ Over outlet budget       │   │
│  │ [Approve]  [Reject]         │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  ✅ APPROVED THIS WEEK (5)          │
│  ┌─────────────────────────────┐   │
│  │ REQ-0041  Housekeeping      │   │
│  │ Approved 2h ago → PO created│   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### 5.3.5 Catalog Tab — Visual, Searchable

```
┌─────────────────────────────────────┐
│  Catalog                  🔍 Search │
├─────────────────────────────────────┤
│  [F&B] [Consumables] [Guest Sup.]  │  ← Category chips
│   [FF&E] [Services]                │
├─────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐   │
│  │  🍅         │ │  🧴         │   │  ← Real product photos
│  │  Tomatoes   │ │  Shampoo    │   │
│  │  EGP 25/kg  │ │  EGP 18/ea  │   │
│  │  Nile Farm  │ │  Nile Chem  │   │
│  │  [+ Add]    │ │  [+ Add]    │   │
│  └─────────────┘ └─────────────┘   │
│  ┌─────────────┐ ┌─────────────┐   │
│  │  🛏️         │ │  🪑         │   │
│  │  Linens     │ │  Lounge     │   │
│  │  EGP 120/set│ │  EGP 4,500  │   │
│  │  Cairo Tex  │ │  Cairo FF&E │   │
│  │  [+ Add]    │ │  [Request]  │   │
│  └─────────────┘ └─────────────┘   │
└─────────────────────────────────────┘
```

#### 5.3.6 Supplier Dashboard — PO Actions

```
┌─────────────────────────────────────┐
│  Supplier Central        📊 🔔      │
├─────────────────────────────────────┤
│  📥 INCOMING POs (3)                │
│  ┌─────────────────────────────┐   │
│  │ PO-1025  Stella Di Mare     │   │
│  │ 45 items  EGP 125,000       │   │
│  │ Due: 2026-08-07  10:00      │   │
│  │ [Accept]  [Reject]  [View]  │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  🚚 TO DELIVER (2)                  │
│  ┌─────────────────────────────┐   │
│  │ PO-1023  Jaz Resort         │   │
│  │ Delivered 2h ago            │   │
│  │ [Upload Invoice] [POD]      │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  💰 Credit Facility: EGP 2.5M       │
│  Available: EGP 1.8M  [Request]    │
└─────────────────────────────────────┘
[Dashboard] [Orders] [Finance] [Invoices]  ← Bottom tabs
```

#### 5.3.7 Credit-Line Payment Redirect (Hotel Finance)

```
Invoice Detail (Finance View)          Oliv Web/App                Return
┌─────────────────────────────┐       ┌─────────────────────┐    ┌─────────────────────────────┐
│  INV-2026-001234            │       │  OLIV FINANCE       │    │  ✅ Payment Authorized    │
│  PO-1025  EGP 125,000       │  ──▶  │  Credit Line        │    │  Invoice INV-2026-001234  │
│  Supplier: Nile Trading     │       │  Limit: EGP 5M      │    │  Paid via Credit Line     │
│  Status: VALIDATED (ETA)    │       │  Available: EGP 3.2M│    │  Ref: oliv_abc123       │
│  ─────────────────────────  │       │  ─────────────────  │    │  [View Receipt]           │
│  [Pay via Credit Line] ─────┼──▶    │  [Authorize Pay]    │    └─────────────────────────────┘
│  [Pay via Bank Transfer]    │       │  [Cancel]           │
└─────────────────────────────┘       └─────────────────────┘
```

---

## 6. API / Integration Contract Sketch

### 6.1 Invo (Mobile) ↔ Hotels Vendors (Web) Sync Strategy

| Mechanism | Use Case | Implementation |
|-----------|----------|----------------|
| **REST (Primary)** | All CRUD, queries, mutations | `api/v1/` endpoints; mobile uses Axios with interceptors |
| **Server-Sent Events (SSE)** | Real-time updates: approval status, delivery tracking, payment confirmation | `/api/v1/events/stream` — lightweight, works over HTTP/2, no WebSocket complexity |
| **Push Notifications** | Background alerts (approval needed, delivery arrived, payment received) | Expo Push → FCM/APNs; webhook from web → Expo Push API |

**Why SSE over WebSockets?**
- Simpler on VPS (no `ws` proxy config in Nginx)
- Automatic reconnection, works through corporate proxies
- Mobile can background SSE with `expo-background-fetch`
- Aligns with "NO WEBSOCKETS" guardrail (G5) for inventory

### 6.2 API Contract (Shared Types via `@hotels-vendors/api-contracts`)

```typescript
// packages/api-contracts/src/hotel/index.ts

// Requisition
export const CreateRequisitionSchema = z.object({
  outletId: z.string().cuid(),
  propertyId: z.string().cuid(),
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().positive(),
    unitOfMeasure: z.string(),
    estimatedUnitPrice: z.number().optional(),
    notes: z.string().optional(),
  })).min(1),
  notes: z.string().optional(),
});

export type CreateRequisitionInput = z.infer<typeof CreateRequisitionSchema>;

export const RequisitionSchema = z.object({
  id: z.string().cuid(),
  requisitionNumber: z.string(),
  status: z.enum(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "CONVERTED_TO_PO", "CANCELLED"]),
  outlet: z.object({ id: z.string(), name: z.string() }),
  property: z.object({ id: z.string(), name: z.string() }),
  requester: z.object({ id: z.string(), name: z.string() }),
  approver: z.object({ id: z.string(), name: z.string() }).nullable(),
  items: z.array(z.object({
    id: z.string(),
    product: z.object({ id: z.string(), name: z.string(), sku: z.string() }),
    quantity: z.number(),
    unitOfMeasure: z.string(),
    estimatedUnitPrice: z.number().nullable(),
  })),
  createdAt: z.string().datetime(),
  approvedAt: z.string().datetime().nullable(),
  purchaseOrderId: z.string().nullable(),
});

export type Requisition = z.infer<typeof RequisitionSchema>;

// Purchase Order
export const CreatePOSchema = z.object({
  requisitionId: z.string().cuid(),
  supplierId: z.string().cuid(),
  deliveryDate: z.string().datetime().optional(),
  deliveryInstructions: z.string().optional(),
  paymentTerms: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().positive(),
    unitPrice: z.number(),
  })).min(1),
});

export const POSchema = z.object({
  id: z.string().cuid(),
  poNumber: z.string(),
  status: z.enum(["DRAFT", "SENT_TO_SUPPLIER", "ACCEPTED", "REJECTED", "PARTIALLY_DELIVERED", "DELIVERED", "INVOICED", "PAYMENT_APPROVED", "PAID", "CANCELLED"]),
  hotel: z.object({ id: z.string(), name: z.string() }),
  supplier: z.object({ id: z.string(), name: z.string() }),
  property: z.object({ id: z.string(), name: z.string() }).nullable(),
  outlet: z.object({ id: z.string(), name: z.string() }).nullable(),
  items: z.array(z.object({
    id: z.string(),
    product: z.object({ id: z.string(), name: z.string(), sku: z.string() }),
    quantity: z.number(),
    unitPrice: z.number(),
    total: z.number(),
    receivedQuantity: z.number(),
  })),
  subtotal: z.number(),
  vatAmount: z.number(),
  total: z.number(),
  createdAt: z.string().datetime(),
  deliveryDate: z.string().datetime().nullable(),
});

// Invoice
export const InvoiceSchema = z.object({
  id: z.string().cuid(),
  invoiceNumber: z.string(),
  status: z.enum(["DRAFT", "ISSUED", "SUBMITTED", "VALIDATED", "PAID", "FACTORED", "OVERDUE", "DISPUTED", "CREDIT_NOTE"]),
  paymentStatus: z.enum(["UNPAID", "PARTIALLY_PAID", "PAID", "FACTORED", "OVERDUE"]),
  purchaseOrder: z.object({ id: z.string(), poNumber: z.string() }).nullable(),
  supplier: z.object({ id: z.string(), name: z.string() }),
  hotel: z.object({ id: z.string(), name: z.string() }),
  subtotal: z.number(),
  vatAmount: z.number(),
  total: z.number(),
  etaUuid: z.string().nullable(),
  etaStatus: z.enum(["PENDING", "SUBMITTING", "ACCEPTED", "REJECTED", "RETRYING", "MANUAL_RESOLUTION"]),
  creditLinePaymentId: z.string().nullable(),
  creditLineStatus: z.enum(["NOT_INITIATED", "REDIRECTED_TO_OLIV", "PAYMENT_PENDING", "PAID", "FAILED", "EXPIRED"]),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime().nullable(),
  paidDate: z.string().datetime().nullable(),
});

// Oliv Checkout
export const OlivCheckoutRequestSchema = z.object({
  invoiceId: z.string().cuid(),
  amount: z.number().positive(),
  currency: z.string().default("EGP"),
  returnUrl: z.string().url().optional(),
});

export const OlivCheckoutResponseSchema = z.object({
  checkoutUrl: z.string().url(),
  reference: z.string(),
});
```

### 6.3 Reserved Seams for Future Phases

| Future Integration | Reserved Endpoint Pattern | Notes |
|--------------------|---------------------------|-------|
| **Oliv KYC/Webhooks** | `POST /api/v1/oliv/webhook` | Already implemented in `app/api/v1/fintech/oliv-callback/route.ts` |
| **Oliv Deep-Link Return** | `GET /api/v1/fintech/oliv/return?reference=` | Web handler; mobile uses `invo://payment-return` |
| **Shipping Provider API** | `POST /api/v1/shipping/quote`, `POST /api/v1/shipping/assign`, `GET /api/v1/shipping/track/:id` | Stub routes in `app/api/v1/shipping/` returning 501 |
| **Shipping Webhooks** | `POST /api/v1/webhooks/shipping/[provider]` | Generic handler in `app/api/v1/webhooks/shipping/[provider]/route.ts` |
| **ERP Connectors (Opera, SAP)** | `POST /api/v1/erp/[system]/push`, `GET /api/v1/erp/[system]/pull` | Future phase; auth via API keys |
| **ETA Webhook** | `POST /api/v1/eta/callback` | Implemented in `app/api/v1/eta/callback/route.ts` |

### 6.4 Mobile → Web API Mapping (Current vs Target)

| Mobile Call | Current Endpoint | Target Endpoint | Status |
|-------------|------------------|-----------------|--------|
| `hotelAPI.catalog()` | `/hotel/catalog` | `/api/v1/hotel/catalog` | 🔴 Mismatch |
| `hotelAPI.orders()` | `/hotel/orders` | `/api/v1/hotel/purchase-orders` | 🔴 Mismatch |
| `supplierAPI.orders()` | `/supplier/orders` | `/api/v1/supplier/purchase-orders` | 🔴 Mismatch |
| `orderAPI.create()` | `/orders` | `/api/v1/hotel/purchase-orders` | 🔴 Mismatch |
| `olivAPI.onboardSupplier()` | `/oliv/onboard-supplier` | `/api/v1/supplier/oliv/onboard` | 🔴 Mismatch |
| `fintechAPI.getCreditFacility()` | `/fintech/oliv-facility` | `/api/v1/supplier/credit-facility` | 🔴 Mismatch |

**Action:** Update mobile `src/api/index.ts` to use `/api/v1/*` paths once web routes exist.

---

## 7. Execution Phases (Post-Approval)

| Phase | Scope | Key Deliverables | Verification |
|-------|-------|------------------|--------------|
| **1. Prisma + Seed** | New models (InternalRequisition, PurchaseOrder, RequisitionItem, enhanced Invoice, Notification), Permission seed, Role seed | Migration file, seed script, `npm run build` passes | `npx prisma migrate dev`, `npx prisma db seed` |
| **2. Backend Routes + RBAC** | `api/v1/hotel/requisitions`, `api/v1/hotel/purchase-orders`, `api/v1/hotel/approvals`, `api/v1/supplier/purchase-orders`, `api/v1/supplier/invoices`, `api/v1/fintech/oliv-checkout`, `api/v1/events/stream` | All routes with Zod + `requirePermission()` + tenant scoping | `npm run build`, `npm run lint`, unit tests |
| **3. Mobile Redesign** | Auth → Onboarding Gateway → Home (scan FAB) → Catalog → Requisition Flow → Approvals → PO Detail → Invoices → Credit Redirect | New screens, shared types from `@hotels-vendors/api-contracts`, Expo Push setup, deep-linking | `expo start`, manual QA on device |
| **4. Approval + PO + Supplier Flows** | Manager approval UI, Procurement PO creation, Supplier accept/reject/invoice/upload/delivery, Push notifications | End-to-end requisition → PO → invoice → delivery | Integration tests, staging deploy |
| **5. Finance + Oliv Redirect** | Finance invoice review, "Pay via Credit Line" button, Oliv checkout URL, deep-link return handler, status polling | Payment flow working sandbox + production | Sandbox test with Oliv credentials |
| **6. Web Dashboard Read-Views** | Hotel: requisition queue, approval history, PO tracking, spend analytics; Supplier: PO dashboard, invoice pipeline, credit facility; Admin: authority rules, audit log, fee tracking | Server-rendered pages in `app/(dashboard)/[role]/` | Visual regression, accessibility audit |

---

## 8. Files Created (Deliverable A)

```
docs/planning/
├── ARCHITECTURE_AUDIT_REPORT.md      ← THIS FILE (Gap analysis, RBAC, Data Model, Mobile Decision, UX Blueprint, API Contract)
├── RBAC_PERMISSION_SEED.ts           ← Prisma seed script for permissions + role mapping
├── PRISMA_SCHEMA_CHANGES.prisma      ← New/changed model definitions
├── MOBILE_MONOREPO_STRUCTURE.md      ← Monorepo layout + migration steps
├── INVO_UX_SCREENS.md                ← Detailed screen specs + user flows (supplement to §5)
├── API_CONTRACTS_SPEC.ts             ← Shared Zod schemas for @hotels-vendors/api-contracts
└── EXECUTION_PHASES.md               ← Phase breakdown with acceptance criteria
```

---

## 9. Summary & Recommendations

### Top 5 Critical Gaps (Must Fix First)
1. **No Internal Requisition model** — Core workflow missing (Web + Mobile)
2. **No mobile scan/barcode capability** — Primary UX differentiator missing
3. **RBAC not enforced on API routes** — Security vulnerability (Web)
4. **Tenant isolation incomplete** — Multi-tenant data leakage risk (Web)
5. **API contract drift** — Web v1 routes vs mobile calls mismatched (Cross-repo)

### Mobile Stack Recommendation
**KEEP React Native 0.86 + Expo 57.** Rewrite per-screen to match scan-first UX blueprint. Migrate to monorepo with shared `api-contracts` and `ui-primitives` packages.

### Immediate Next Steps (Upon Approval)
1. Create `packages/api-contracts` from web Zod schemas
2. Run Prisma migration for new models + seed permissions
3. Implement `middleware.ts` with tenant injection + RBAC
4. Build `api/v1/hotel/requisitions` + `api/v1/hotel/purchase-orders` with full RBAC
5. Mobile: Add `expo-camera`, `expo-barcode-scanner`, `expo-web-browser`, `expo-linking`
6. Mobile: Implement Onboarding Gateway + Scan FAB + Requisition Flow

---

**No source code was modified during this audit.** All analysis is read-only. Awaiting explicit approval to begin Phase 1 execution.