# MASTER EXECUTION PROMPT — No Timelines, Just Output

> **Status:** EXECUTE NOW  
> **Quality Standard:** Production-ready, no shortcuts, no mock data  
> **Rule:** If it's not done correctly, don't mark it done.

---

## DELIVERABLE 1: INVO Admin Dashboard (Backend + Frontend)

**What:** The infrastructure control panel that runs logistics, payments, and supplier management.

**Files to create:**

```
app/invo/page.tsx                              → Redirect to /invo/dashboard
app/invo/dashboard/page.tsx                    → Main dashboard shell
app/invo/dashboard/layout.tsx                  → INVO admin layout (sidebar + header)
app/invo/dashboard/route-optimizer/page.tsx    → Truck routes, assignments, tracking
app/invo/dashboard/payments/page.tsx           → Settlement monitor, pending payouts
app/invo/dashboard/suppliers/page.tsx          → Supplier approvals, catalog management

app/invo/api/v1/logistics/quote/route.ts       → POST: delivery cost + time
app/invo/api/v1/logistics/assign/route.ts      → POST: assign order to truck
app/invo/api/v1/logistics/track/route.ts       → GET: track delivery by orderId
app/invo/api/v1/payments/settle/route.ts       → POST: execute settlement
app/invo/api/v1/payments/status/route.ts       → GET: check payment status
app/invo/api/v1/supplier-feed/route.ts         → GET: supplier catalog
app/invo/api/v1/supplier-feed/[id]/route.ts    → GET: single supplier detail
app/invo/api/v1/supplier-approve/route.ts      → POST: approve/reject supplier

lib/invo/client.ts                             → Bridge client (HV calls INVO)
lib/invo/types.ts                              → Shared types
```

**Requirements:**
- All API routes MUST validate input with Zod
- All API routes MUST check authentication (INVO admin roles only)
- All API routes MUST return typed JSON responses
- Dashboard MUST use real data from database (Prisma), not mock arrays
- Bridge client MUST handle retries, timeouts, and error states

**Database tables needed (add to schema.prisma):**
```prisma
model InvoRoute {
  id          String   @id @default(uuid())
  origin      String
  destination String
  vehicleId   String
  driverId    String
  status      String   // PENDING, IN_TRANSIT, DELIVERED
  orders      String[] // order IDs
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model InvoSettlement {
  id          String   @id @default(uuid())
  invoiceId   String
  supplierId  String
  amount      Float
  method      String   // INSTAPAY, FAWRY, PAYMOB
  status      String   // PENDING, SETTLED, FAILED
  settledAt   DateTime?
  createdAt   DateTime @default(now())
}

model InvoSupplier {
  id          String   @id @default(uuid())
  name        String
  category    String   // F&B, HSK, ENG, AMN, CAP
  status      String   // PENDING, APPROVED, REJECTED
  warehouse   String
  contact     String
  createdAt   DateTime @default(now())
}
```

---

## DELIVERABLE 2: Hotels Vendors Hotel Dashboard

**What:** The customer-facing app where hotels browse catalogs, place orders, and track deliveries.

**Files to create:**

```
app/(dashboard)/hotel/page.tsx                 → Hotel dashboard home
app/(dashboard)/hotel/catalog/page.tsx         → Browse supplier catalog
app/(dashboard)/hotel/catalog/[id]/page.tsx    → Product detail
app/(dashboard)/hotel/orders/page.tsx          → Order history + status
app/(dashboard)/hotel/orders/new/page.tsx      → Create purchase order
app/(dashboard)/hotel/orders/[id]/page.tsx     → Order detail + tracking
app/(dashboard)/hotel/invoices/page.tsx        → ETA invoice submissions
app/(dashboard)/hotel/analytics/page.tsx       → Spend dashboard

app/api/v1/hotel/catalog/route.ts              → GET: catalog (calls INVO feed)
app/api/v1/hotel/orders/route.ts               → POST: create order
app/api/v1/hotel/orders/[id]/route.ts          → GET: order detail
app/api/v1/hotel/orders/[id]/track/route.ts    → GET: tracking (calls INVO logistics)
app/api/v1/hotel/invoices/route.ts             → POST: generate ETA invoice
```

**Requirements:**
- Catalog data comes from INVO supplier-feed API (via bridge client)
- Order creation triggers Authority Matrix evaluation
- Approved orders call INVO logistics/assign API
- ETA invoices call Egyptian Tax Authority API (background queue)
- All routes tenant-scoped (hotel can only see their own data)

---

## DELIVERABLE 3: Automated Onboarding

**What:** Suppliers and hotels can sign up without human intervention.

**Files to create:**

```
app/api/v1/onboarding/supplier/route.ts        → POST: supplier self-registration
app/api/v1/onboarding/supplier/verify/route.ts → POST: upload docs, KYC check
app/api/v1/onboarding/hotel/route.ts           → POST: hotel self-registration
app/api/v1/onboarding/hotel/verify/route.ts    → POST: property verification

lib/onboarding/supplier-pipeline.ts            → Status: PENDING → DOCS_UPLOADED → KYC_REVIEW → APPROVED
lib/onboarding/hotel-pipeline.ts               → Status: PENDING → PROPERTY_VERIFIED → ACTIVATED
```

**Requirements:**
- Supplier uploads: trade license, tax ID, bank account proof
- Hotel uploads: property registration, manager ID, bank details
- Auto-email on status changes (use Resend or similar)
- Rejected applications get reason + chance to resubmit
- Approved suppliers immediately appear in INVO supplier feed

**Email templates needed:**
- Welcome (registration received)
- Docs needed (missing documents)
- Approved (ready to trade)
- Rejected (with reason)

---

## DELIVERABLE 4: Partnership Contract System

**What:** Generate, send, and track partnership contracts with banks and logistics providers.

**Files to create:**

```
app/(dashboard)/admin/contracts/page.tsx       → Contract management UI
app/api/v1/admin/contracts/route.ts            → CRUD contracts
app/api/v1/admin/contracts/[id]/send/route.ts  → POST: email contract
app/api/v1/admin/contracts/[id]/sign/route.ts  → POST: record signature

lib/contracts/generator.ts                     → PDF generation from template
lib/contracts/templates/cib-partnership.ts     → CIB-specific terms
lib/contracts/templates/oliv-integration.ts    → Oliv API terms
lib/contracts/templates/logistics-provider.ts  → Trucking partner terms
```

**Contract templates must include:**
- Revenue split (exact percentages)
- Term length (12 months default)
- Exclusivity clauses (if any)
- Termination conditions
- Liability caps
- Governing law (Egypt)

**Requirements:**
- Generate PDF from template + variables
- Send via email with e-signature link (DocuSign or simple click-to-accept)
- Track status: DRAFT → SENT → VIEWED → SIGNED → ACTIVE
- Store signed copies in database

---

## DELIVERABLE 5: API Acquisition + Integration

**What:** Connect to external APIs for payments, logistics, and compliance.

### 5A: InstaPay Integration
```
lib/payments/instapay.ts
```
- API endpoints for IPN (Instant Payment Network)
- Request/response types
- Error handling
- Test with sandbox first

### 5B: Fawry Integration
```
lib/payments/fawry.ts
```
- Payment initiation
- Callback handling
- Refund processing

### 5C: ETA E-Invoicing Integration
```
lib/eta/bridge.ts
lib/eta/submitter.ts
lib/eta/validator.ts
```
- Sandbox API connection
- Invoice format conversion (HV format → ETA format)
- Digital signature
- UUID generation
- Submission queue with retry logic
- Dead-letter queue for failures

### 5D: Oliv Finance Integration (when unblocked)
```
lib/fintech/oliv-client.ts
```
- Credit scoring API
- Dynamic limit API
- Real-time settlement API
- Risk alert API

**Requirements for ALL integrations:**
- Environment variables in `.env.local` (never hardcode keys)
- Zod validation on all inputs/outputs
- Circuit breaker pattern (fail gracefully if API is down)
- Request/response logging
- Idempotency keys on all mutating operations

---

## QUALITY GATES (Non-Negotiable)

Before any file is marked DONE:

1. **TypeScript strict mode passes** — zero `any` types, zero `@ts-ignore`
2. **Zod validation** — every API route validates input before touching DB
3. **RBAC enforcement** — every API route checks permissions
4. **Tenant scoping** — every DB query includes `tenantId` filter
5. **No secrets in code** — all keys in `.env`
6. **No mock data in production** — Prisma queries only
7. **Error handling** — every async call has try/catch, every error is logged
8. **Build passes** — `npm run build` completes with zero errors

---

## WHAT NOT TO DO

- ❌ No logos, no image generation, no branding exercises
- ❌ No marketing copy, no blog posts, no SEO content
- ❌ No timelines, no Gantt charts, no project management
- ❌ No "what-if" scenarios, no strategic planning
- ❌ No mock data, no placeholder text, no "coming soon"

---

## OUTPUT FORMAT

For every deliverable, provide:
1. **File path** — exact location in the project
2. **File content** — complete, copy-paste ready
3. **Database changes** — Prisma schema additions
4. **Environment variables** — what to add to `.env.local`
5. **Test command** — how to verify it works

**Do NOT provide partial code.** Every file must be complete and runnable.

---

*Execute. No discussion. No planning. Just files.*
