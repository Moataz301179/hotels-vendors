# Fintech Validation Audit — HotelsVendors

**Date:** 2026-06-13
**Scope:** Full codebase review — API routes, Prisma schema, Zod validation, marketing pages, fintech bridge, payments, RBAC, legal compliance
**Auditor:** OWL (automated audit)

---

## Executive Summary

HotelsVendors is a B2B hospitality procurement platform with embedded reverse factoring. The architecture is **legally structured as a technology orchestrator, not a financial intermediary** — this is the single most important design decision in the codebase, and it is **mostly correctly implemented**. However, there are several critical gaps and inconsistencies that need attention before production deployment.

**Overall Grade: B+**
- Legal architecture: **A** (correctly avoids cash custody)
- RBAC / Tenant isolation: **B+** (mostly solid, one deprecated function)
- Validation / Zod schemas: **A-** (comprehensive, minor gaps)
- Payment integration: **B** (functional but has a security concern)
- Marketing claims vs. reality: **B-** (some overstated claims)
- Schema design: **A** (well-normalized, good tenant isolation)

---

## 1. LEGAL COMPLIANCE — Critical Findings

### 1.1 ✅ CORRECT: No Cash Custody Architecture

The schema comment (line 5-12 of `schema.prisma`) is explicit:
> "This platform does NOT hold or transfer cash. The platform operator holds a DIGITAL MARKETLINE license only."

The `FactoringBridge` correctly states:
> "HotelsVendors never touches the cash. We are a workflow orchestrator + compliance layer."

**Verdict: PASS** — The architecture correctly routes all fund transfers through licensed partners.

### 1.2 ⚠️ ISSUE: `payments/deposit/route.ts` — Paymob Integration Touches Money

The deposit endpoint (`POST /api/v1/payments/deposit`) creates a Paymob payment link for a 20% order deposit. While Paymob is the actual payment processor, the platform is **initiating a financial transaction** on behalf of hotels.

**Risk:** If the deposit is considered a "financial service" by Egyptian regulators, this could require a payment license beyond the digital marketing license.

**Recommendation:** Add a clear legal disclaimer in the deposit flow stating that Paymob is the licensed payment processor and HotelsVendors only provides the orchestration layer. Ensure the Paymob merchant account is under the hotel's name, not HotelsVendors.

### 1.3 ⚠️ ISSUE: `payments/fawry-callback/route.ts` — No Authentication

The Fawry callback endpoint has **no authentication or tenant isolation**:
```typescript
export const POST = apiRoute(async (request: NextRequest) => {
  const payload = (await request.json()) as FawryCallbackPayload;
  // No auth check!
  // No tenant verification!
```

While it does verify the HMAC signature, it doesn't verify that the payment transaction belongs to the expected tenant. A malicious actor could potentially forge callbacks for transactions in other tenants.

**Recommendation:** Add tenant verification after finding the transaction:
```typescript
if (tx.tenantId !== expectedTenantId) {
  return error("Tenant mismatch", 403);
}
```

### 1.4 ✅ CORRECT: Liability Disclaimers Present

The marketing pages include appropriate disclaimers:
- "Data orchestration only · No liability for logistics or collection" (homepage form)
- "Zero liability for logistics or collection defaults" (homepage CTA)
- "Technology Layer — Not a Financial Intermediary" (factoring page)

**Verdict: PASS** — Legal disclaimers are present and appropriately worded.

---

## 2. RBAC & TENANT ISOLATION

### 2.1 ✅ CORRECT: Session-Based Tenant ID

The `authenticate()` function in `api-utils.ts` correctly extracts tenant ID from the JWT session, NOT from client-signed headers:
```typescript
// Tenant ID comes from the JWT session — NEVER trust client-sent headers
return { userId: session.userId, platformRole: session.platformRole, tenantId: session.tenantId };
```

### 2.2 ⚠️ ISSUE: Deprecated `getTenantId()` Function

The `getTenantId()` function reads from `x-tenant-id` header and is marked DEPRECATED but still exported:
```typescript
export function getTenantId(request: NextRequest): string | null {
  // DEPRECATED: Do not use. Tenant ID must come from the JWT session.
  return request.headers.get("x-tenant-id");
}
```

**Risk:** If any route accidentally uses this function, it would allow tenant spoofing.

**Recommendation:** Remove the function entirely or add a runtime warning:
```typescript
export function getTenantId(request: NextRequest): string | null {
  console.warn("SECURITY: Deprecated getTenantId() called — use authenticate() instead");
  return null;
}
```

### 2.3 ✅ CORRECT: Factoring Fund Endpoint Has Tenant Isolation

The `/api/v1/factoring/fund/route.ts` correctly verifies:
```typescript
if (auth.platformRole === "HOTEL" && invoice.hotelId !== user?.hotelId) {
  return error("Forbidden", 403);
}
if (auth.platformRole === "SUPPLIER" && invoice.supplierId !== user?.supplierId) {
  return error("Forbidden", 403);
}
```

### 2.4 ⚠️ ISSUE: Lead Capture Endpoint Has No Rate Limiting

The `POST /api/v1/leads/capture` endpoint is public and has **no rate limiting**:
```typescript
export async function POST(request: NextRequest) {
  // No rate limit check!
  const body = await request.json();
```

**Risk:** Could be abused for spam or email harvesting.

**Recommendation:** Add rate limiting (the supplier onboard endpoint already has it):
```typescript
const rateLimit = await checkRateLimit(`lead_capture:${clientIp}`, 3600, 10);
if (!rateLimit.allowed) {
  return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
}
```

---

## 3. VALIDATION & ZOD SCHEMAS

### 3.1 ✅ CORRECT: Comprehensive Schema Coverage

All major entities have Zod schemas: Hotel, User, Supplier, Product, Order, Invoice, AuthorityRule, Cart, ETA, FactoringCompany, CreditFacility, Outlet, Trip, SupplierAudit, Auth.

### 3.2 ✅ CORRECT: SupplierCreateSchema Matches Prisma

The `SupplierCreateSchema` in `lib/zod.ts` correctly validates all required fields:
- `name: z.string().min(2)`
- `taxId: z.string().min(3)`
- `city: z.string().min(1)`
- `governorate: z.string().min(1)`
- `email: z.string().email()`

### 3.3 ⚠️ ISSUE: Lead Capture Uses Custom Validation, Not Zod

The lead capture endpoint uses a custom `validateLeadPayload()` function instead of a Zod schema. This is inconsistent with the rest of the codebase and misses Zod's type inference benefits.

**Recommendation:** Create a `LeadCaptureSchema` in `lib/zod.ts`:
```typescript
export const LeadCaptureSchema = z.object({
  companyName: z.string().min(2),
  email: z.string().email(),
  sector: z.enum(["HOTEL", "SUPPLIER", "LOGISTICS", "FINANCE"]).optional(),
});
```

### 3.4 ✅ CORRECT: Credit Limit Validation

The factoring fund endpoint correctly validates credit limits before submitting:
```typescript
const availableCredit = facility.limit - facility.utilized;
if (availableCredit < invoice.total) {
  return error(`Insufficient credit line...`, 422);
}
```

And has a post-increment guard:
```typescript
if (updatedFacility.utilized > updatedFacility.limit) {
  throw new Error(`Credit facility limit exceeded after increment...`);
}
```

---

## 4. FINANCIAL CALCULATIONS

### 4.1 ✅ CORRECT: Atomic Transaction for Credit Facility

The factoring fund endpoint uses `prisma.$transaction` to atomically:
1. Update invoice status
2. Increment credit facility utilized amount
3. Create factoring request record

If any step fails, the entire transaction rolls back.

### 4.2 ⚠️ ISSUE: Floating-Point Arithmetic for Money

The codebase uses `Float` type in Prisma for monetary amounts (`subtotal`, `vatAmount`, `total`, `creditLimit`, etc.). This is a known source of rounding errors in financial calculations.

**Example from `Invoice` model:**
```prisma
subtotal  Float
vatRate   Float  @default(14.00)
vatAmount Float
total     Float
```

**Recommendation:** Use `Decimal` type instead of `Float` for all monetary fields. Prisma supports `Decimal` natively:
```prisma
subtotal  Decimal @default(0)
vatRate   Decimal @default(14.00)
vatAmount Decimal @default(0)
total     Decimal @default(0)
```

Note: Some fields in the schema already use `Decimal` (e.g., `acceleratedCashRate`, `supplierDiscountRate` in `Invoice`), which is inconsistent with the `Float` used for the main financial fields.

### 4.3 ✅ CORRECT: Deposit Calculation Uses Integer Cents

The deposit endpoint correctly converts to cents before sending to Paymob:
```typescript
const depositAmount = Math.round(order.total * 0.2 * 100); // 20% in cents
```

---

## 5. PAYMENT INTEGRATION

### 5.1 ✅ CORRECT: Paymob HMAC Verification

The `verifyPaymobCallback()` function correctly implements HMAC-SHA512 verification:
```typescript
const crypto = require("crypto");
const calculated = crypto
  .createHmac("sha512", PAYMOB_HMAC_SECRET)
  .update(hmacString)
  .digest("hex");
return calculated === receivedHmac;
```

### 5.2 ⚠️ ISSUE: HMAC Verification Bypassed in Sandbox

```typescript
export function verifyPaymobCallback(payload: Record<string, unknown>): boolean {
  if (!PAYMOB_HMAC_SECRET) return true; // In sandbox, skip verification
```

**Risk:** If `PAYMOB_HMAC_SECRET` is accidentally not set in production, all callbacks would be accepted without verification.

**Recommendation:** Make this fail-closed:
```typescript
if (!PAYMOB_HMAC_SECRET) {
  throw new Error("PAYMOB_HMAC_SECRET not configured — cannot verify callbacks");
}
```

### 5.3 ⚠️ ISSUE: Fawry Callback Maps to Wrong Method

```typescript
observedMethod: "PAYMOB_B2B", // closest mapped enum value
```

This is a Fawry callback being labeled as "PAYMOB_B2B". This is confusing and could cause issues with reconciliation.

**Recommendation:** Add a "FAWRY" value to the `PaymentMethod` enum or use a more generic value.

---

## 6. MARKETING PAGES — CLAIMS vs REALITY

### 6.1 ⚠️ ISSUE: "24-Hour Settlement" Claim

Multiple pages claim "Suppliers paid in 24 hours" as a platform feature. However, the actual settlement depends on:
1. The factoring partner's processing time
2. Bank transfer processing time
3. The `estimatedDisbursementDate` returned by the partner

**Recommendation:** Add qualifying language: "Suppliers paid within 24 hours of invoice clearance, subject to partner processing times."

### 6.2 ⚠️ ISSUE: "450+ Hotel Buyers" Claim

The supplier benefits page claims "Direct Access to 450+ Hotel Buyers" and the factoring page claims "450+ Verified hotel properties generating invoice flow."

**Reality check:** The about page shows "— Properties — Coming Soon" for property count. The 450+ number appears to be aspirational, not actual.

**Recommendation:** Either remove the specific number or clearly label it as "target" or "projected."

### 6.3 ✅ CORRECT: Honest "Dashboard Preview" Label

The homepage correctly labels the dashboard mockup as "Dashboard preview — illustrative interface" rather than claiming it's live data.

### 6.4 ✅ CORRECT: No Fake Social Proof

The homepage honestly states "Built for Egypt's hospitality sector" without claiming specific numbers of users or properties.

---

## 7. SCHEMA DESIGN

### 7.1 ✅ CORRECT: Multi-Tenant Isolation

Every model includes `tenantId` with proper `onDelete: Cascade` relations. This is essential for a SaaS platform.

### 7.2 ✅ CORRECT: Audit Log Design

The `AuditLog` model includes:
- `entityType`, `entityId`, `action` — what changed
- `actorId`, `actorRole` — who changed it
- `beforeState`, `afterState` — what it was before/after
- `previousHash`, `hash` — for tamper-proof chain
- `ipAddress`, `userAgent` — for forensic tracking

### 7.3 ✅ CORRECT: Soft Deletes via Status Fields

Most models use status fields (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING`) rather than hard deletes, which is appropriate for financial records.

### 7.4 ⚠️ ISSUE: `LeadCapture` Model Not Used

The `LeadCapture` model exists in the schema but the lead capture API route creates a `User` record instead. This is inconsistent.

**Recommendation:** Either:
1. Use the `LeadCapture` model for landing page leads, OR
2. Remove the `LeadCapture` model if not needed

---

## 8. API ROUTE SECURITY

### 8.1 ✅ CORRECT: Rate Limiting on Financial Endpoints

The factoring fund endpoint uses `{ rateLimit: "financial" }` and the supplier onboard endpoint has manual rate limiting.

### 8.2 ✅ CORRECT: Idempotency on Monetary Mutations

The factoring fund endpoint requires `x-idempotency-key` header:
```typescript
const idempotencyKey = await requireIdempotencyKey(request, {
  userId: auth.userId,
  action: "FACTORING_INSTRUCTION",
  amount: invoice.total,
});
```

### 8.3 ⚠️ ISSUE: Lead Capture Error Handling

The lead catch endpoint returns 500 for all errors, including validation errors:
```typescript
} catch (error) {
  console.error("[Lead Capture] Error:", error);
  return NextResponse.json(
    { success: false, error: error instanceof Error ? error.message : "Failed to capture lead" },
    { status: 500 }
  );
}
```

Validation errors should return 400, not 500.

---

## 9. ENVIRONMENT & DEPLOYMENT

### 9.1 ⚠️ ISSUE: No Production DATABASE_URL

Per PROJECT_STATE.md: "`.env:` Does NOT have a production `DATABASE_URL` set."

**Critical:** The platform cannot function in production without this.

### 9.2 ✅ CORRECT: Prisma Configured for PostgreSQL

The `lib/prisma.ts` correctly uses `PrismaPg` adapter with `pg` Pool for PostgreSQL in production.

---

## 10. RECOMMENDATIONS SUMMARY

### Critical (Fix Before Production)
1. **Add rate limiting to lead capture endpoint**
2. **Fix Fawry callback tenant isolation**
3. **Make HMAC verification fail-closed**
4. **Set production DATABASE_URL**
5. **Resolve Float vs Decimal inconsistency for monetary fields**

### Important (Fix Soon)
1. **Remove or deprecate `getTenantId()` function**
2. **Add qualifying language to "24-hour settlement" claims**
3. **Remove or use `LeadCapture` model consistently**
4. **Fix lead capture error status codes**
5. **Add legal disclaimer to deposit flow**

### Nice to Have
1. **Create Zod schema for lead capture**
2. **Add FAWRY to PaymentMethod enum**
3. **Standardize all monetary fields to Decimal**

---

## Appendix: File Inventory

| File | Status | Notes |
|------|--------|-------|
| `prisma/schema.prisma` | ✅ Good | 2505 lines, comprehensive, well-commented |
| `lib/zod.ts` | ✅ Good | All major entities validated |
| `lib/api-utils.ts` | ⚠️ Minor issues | Deprecated `getTenantId()` |
| `lib/prisma.ts` | ✅ Good | Correctly configured for PostgreSQL |
| `lib/redis.ts` | ✅ Good | Graceful fallback to memory |
| `lib/fintech/factoring-bridge.ts` | ✅ Good | Correctly orchestrates, doesn't hold cash |
| `lib/payments/paymob.ts` | ⚠️ Security concern | HMAC bypass in sandbox |
| `app/api/v1/leads/capture/route.ts` | ⚠️ Missing rate limit | Public endpoint needs protection |
| `app/api/v1/supplier/onboard/route.ts` | ✅ Good | Rate limited, validated |
| `app/api/v1/factoring/fund/route.ts` | ✅ Good | Atomic, idempotent, tenant-isolated |
| `app/api/v1/payments/deposit/route.ts` | ⚠️ Legal review needed | Initiates financial transaction |
| `app/api/v1/payments/fawry-callback/route.ts` | ⚠️ Missing tenant check | HMAC verified but no tenant isolation |
| `app/(marketing)/page.tsx` | ✅ Good | Honest labeling, appropriate disclaimers |
| `app/(marketing)/factoring-service/page.tsx` | ⚠️ Overstated claims | 450+ number aspirational |
| `app/(marketing)/pricing/page.tsx` | ✅ Good | Transparent pricing, no hidden fees |
| `app/(marketing)/sandbox/page.tsx` | ✅ Good | Clearly labeled as illustrative |
| `components/auth/role-benefits.tsx` | ✅ Good | Consistent messaging |

---

*End of audit. Last updated: 2026-06-13*
