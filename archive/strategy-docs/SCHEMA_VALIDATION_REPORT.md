# API Schema Validation Report

**Platform:** Hotels Vendors — Digital Procurement Hub  
**Date:** 2026-07-15  
**Scope:** Auth, RBAC, Zod Schemas, Oliv/Factoring, ETA, Authority Matrix

---

## A. Auth Header Parsing

### Session Token Flow

| Property | Value |
|---|---|
| **Cookie name** | `hv_session` |
| **CSRF cookie** | `hv_csrf` |
| **Algorithm** | HS256 (jose library) |
| **Expiry** | 24 hours |
| **Clock tolerance** | 60 seconds |
| **Blacklist** | Redis `session:blacklist:{token}` (7-day TTL) + in-memory fallback |

### JWT Session Payload Shape

```typescript
// lib/session.ts — createSession()
{
  userId: string;       // CUID
  platformRole: string; // "ADMIN" | "HOTEL" | "SUPPLIER" | "FACTORING" | "SHIPPING" | "MARKETING"
  tenantId: string;     // CUID
}
// Protected header: { alg: "HS256" }
// Registered claims: iat, exp (24h)
```

### Headers Expected

| Source | Header | Purpose |
|---|---|---|
| **Browser** | `Cookie: hv_session=<jwt>` | Primary auth for page routes |
| **Edge middleware** | `x-user-id` | Injected after JWT verification |
| **Edge middleware** | `x-tenant-id` | Injected — **NEVER trust client-sent** |
| **Edge middleware** | `x-platform-role` | Injected |
| **Edge middleware** | `x-session-token` | Raw JWT passed to API routes |
| **API fallback** | `x-session-token` header | Fallback when cookie unavailable (mobile/SPA) |
| **Service-to-service** | `Authorization: Bearer <INVO_SERVICE_KEY>` | Internal API calls |

### Validation Logic (middleware.ts + session.ts)

```
1. Read hv_session cookie
2. jwtVerify(token, SECRET, { clockTolerance: 60 })
3. Extract userId, platformRole, tenantId from payload
4. Reject if any field is missing/falsy
5. Check Redis blacklist (isBlacklisted)
6. Inject x-user-id, x-tenant-id, x-platform-role, x-session-token headers
```

### Security Concerns

| # | Issue | Severity | Detail |
|---|---|---|---|
| **A1** | `x-session-token` header passed through to API handlers | MEDIUM | If an attacker can set response headers, they could replay this token. The header is set by middleware, not trusted from client — acceptable but fragile. |
| **A2** | Development fallback secret `dev-secret-do-not-use-in-production` | LOW | Only used when `SESSION_SECRET` is missing and `NODE_ENV !== "production"`. Logged as warning. Acceptable. |
| **A3** | No `iss` / `aud` claim validation | LOW | JWT is verified by signature + expiry only. No audience or issuer check. Acceptable for single-service architecture but limits future extensibility. |

---

## B. RBAC Permission Codes

### Engine: `lib/auth/rbac.ts`

**Core functions:**

```typescript
// Permission check — DB-driven, role → permission mapping
async function hasPermission(ctx: TenantContext, permissionCode: string): Promise<boolean>

// Throws PermissionDeniedError if missing
async function requirePermission(ctx: TenantContext, permissionCode: string): Promise<void>

// Check any-of
async function requireAnyPermission(ctx: TenantContext, permissionCodes: string[]): Promise<void>

// Get all permissions for UI rendering (server-side only)
async function getUserPermissions(ctx: TenantContext): Promise<string[]>
```

**Bypass:** Platform Admin (`ctx.platformRole === "ADMIN"`) returns `true` for all permissions.

**Data model:** `User → roleId → RolePermission → Permission { code }` (Prisma, database-driven).

### Permission Codes Found in Use

| Code | Used In | Purpose |
|---|---|---|
| `admin:read` | `app/api/accounting/route.ts` | Read accounting data |
| `admin:manage_platform` | `app/api/v1/admin/explorer/route.ts` | Cross-tenant admin explorer |
| `order:create` | `app/api/v1/checkout/route.ts` | Create orders via checkout |
| `invoice:submit_eta` | `app/api/v1/eta/submit/route.ts` | Submit invoice to ETA |
| `factoring:inquire` | `app/api/factoring/companies/*` | Inquire factoring eligibility |
| `factoring:fund` | `app/api/v1/factoring/fund/route.ts` | Submit factoring instruction |
| `factoring:manage` | `app/api/v1/factoring/credit-lines/route.ts`, `app/api/factoring/facilities/[id]/route.ts` | Manage credit facilities |
| `disputes:list` | `app/api/v1/disputes/route.ts` | List disputes |
| `disputes:create` | `app/api/v1/disputes/route.ts` | Create disputes |

### Security Concerns

| # | Issue | Severity | Detail |
|---|---|---|---|
| **B1** | No centralized permission registry file | MEDIUM | Permission codes are scattered across route files. No single source of truth listing ALL valid codes. Risk of typos and undeclared permissions. |
| **B2** | Permission lookup is DB-query-per-request | LOW | Every `requirePermission` call does 2 DB queries (User + RolePermission). Could be cached in Redis for high-traffic routes. |

---

## C. Zod Validation Schemas

### Central Schema Registry: `lib/zod.ts`

#### Hotel Schemas

| Schema | Fields | Constraints |
|---|---|---|
| `HotelCreateSchema` | `name` | `min(2)` |
| | `legalName` | optional |
| | `taxId` | `min(3)` |
| | `commercialReg` | optional |
| | `address` | optional |
| | `city` | `min(1)` |
| | `governorate` | `min(1)` |
| | `phone` | optional |
| | `email` | `email()`, optional |
| | `starRating` | `int().min(1).max(7)`, optional |
| | `roomCount` | `int()`, optional |
| | `tier` | `nativeEnum(HotelTier)`, default `CORE` |
| | `creditLimit` | `number()`, optional |
| `HotelUpdateSchema` | All fields | `HotelCreateSchema.partial()` |

#### User Schemas

| Schema | Fields | Constraints |
|---|---|---|
| `UserCreateSchema` | `email` | `email()` |
| | `name` | `min(2)` |
| | `phone` | optional |
| | `role` | `nativeEnum(UserRole)`, default `DEPARTMENT_HEAD` |
| | `roleId` | `cuid()` |
| | `hotelId` | `cuid()`, optional |
| | `supplierId` | `cuid()`, optional |
| | `canOverride` | `boolean()`, default `false` |
| `UserUpdateSchema` | All fields | `UserCreateSchema.partial()` |

#### Supplier Schemas

| Schema | Fields | Constraints |
|---|---|---|
| `SupplierCreateSchema` | `name` | `min(2)` |
| | `legalName` | optional |
| | `taxId` | `min(3)` |
| | `commercialReg` | optional |
| | `address` | optional |
| | `city` | `min(1)` |
| | `governorate` | `min(1)` |
| | `phone` | optional |
| | `email` | `email()` |
| | `website` | `url()`, optional |
| | `description` | optional |
| | `certifications` | optional |
| | `bankAccount` | optional |
| | `bankName` | optional |
| `SupplierUpdateSchema` | All fields | `SupplierCreateSchema.partial()` |

#### Product Schemas

| Schema | Fields | Constraints |
|---|---|---|
| `ProductCreateSchema` | `sku` | `min(2)` |
| | `name` | `min(2)` |
| | `description` | optional |
| | `category` | `nativeEnum(ProductCategory)` |
| | `subcategory` | optional |
| | `unitPrice` | `positive()` |
| | `currency` | default `"EGP"` |
| | `stockQuantity` | `int().min(0)`, default `0` |
| | `minOrderQty` | `int().min(1)`, default `1` |
| | `leadTimeDays` | `int().min(1)`, default `1` |
| | `unitOfMeasure` | default `"piece"` |
| | `supplierId` | `cuid()` |
| `ProductUpdateSchema` | All fields | `ProductCreateSchema.partial()` |

#### Order Schemas

| Schema | Fields | Constraints |
|---|---|---|
| `OrderItemSchema` | `productId` | `cuid()` |
| | `quantity` | `int().positive()` |
| | `unitPrice` | `positive()` |
| | `notes` | optional |
| `OrderCreateSchema` | `orderNumber` | `min(1)` |
| | `hotelId` | `cuid()`, optional |
| | `propertyId` | `cuid()`, optional |
| | `outletId` | `cuid()`, optional |
| | `supplierId` | `cuid()` |
| | `requesterId` | `cuid()`, optional |
| | `items` | `array(OrderItemSchema).min(1)` |
| | `deliveryDate` | `datetime()`, optional |
| | `deliveryInstructions` | optional |

#### Invoice Schemas

| Schema | Fields | Constraints |
|---|---|---|
| `InvoiceCreateSchema` | `invoiceNumber` | `min(1)` |
| | `orderId` | `cuid()` |
| | `hotelId` | `cuid()` |
| | `supplierId` | `cuid()` |
| | `subtotal` | `positive()` |
| | `vatRate` | default `14` |
| | `vatAmount` | `positive()` |
| | `total` | `positive()` |
| | `issueDate` | `datetime()` |
| | `dueDate` | `datetime()`, optional |

#### Authority Matrix Schema

| Schema | Fields | Constraints |
|---|---|---|
| `AuthorityRuleSchema` | `role` | `nativeEnum(UserRole)` |
| | `minValue` | `min(0)` |
| | `maxValue` | `min(0)` |
| | `category` | `string()` |
| | `supplierTier` | `string()` |
| | `action` | `nativeEnum(AuthorityAction)` |
| | `routeToRole` | `nativeEnum(UserRole)`, optional |
| | `hotelId` | `cuid()`, optional |
| | `name` | optional |
| | `description` | optional |
| | `priority` | `int()`, default `0` |

#### Cart Schemas

| Schema | Fields | Constraints |
|---|---|---|
| `CartItemCreateSchema` | `productId` | `cuid()` |
| | `quantity` | `int().positive()` |
| | `notes` | optional |
| `CartCheckoutSchema` | `supplierId` | `cuid()` |
| | `deliveryDate` | `datetime()`, optional |
| | `deliveryInstructions` | optional |
| | `outletId` | `cuid()`, optional |

#### Auth Schemas

| Schema | Fields | Constraints |
|---|---|---|
| `RegisterSchema` | `name` | `min(2)` |
| | `email` | `email()` |
| | `password` | `min(8)`, uppercase, lowercase, digit regex |
| | `hotelId` | `cuid()`, optional |
| | `role` | `nativeEnum(UserRole)`, optional |
| `LoginSchema` | `email` | `email()` OR `"admin"` string |
| | `password` | `min(1)` |
| `BusinessRegisterSchema` | `type` | `enum(["hotel","supplier","factoring","shipping"])` |
| | `name` | `min(2)` |
| | `email` | `email()` |
| | `password` | `min(8)`, uppercase, lowercase, digit regex |
| | `termsAccepted` | `literal(true)` |
| | `accountType` | `enum(["individual","business"])`, default `"business"` |
| | + 10 optional fields | phone, city, governorate, taxId, etc. |
| | **superRefine** | Business accounts require `taxId`, `city`, `governorate` |

#### Factoring Schemas

| Schema | Fields | Constraints |
|---|---|---|
| `FactoringCompanySchema` | `name` | `min(2)` |
| | `taxId` | `min(3)` |
| | `contactEmail` | `email()`, optional |
| | `maxFacility` | optional |
| | `interestRate` | optional |
| | `rate` | optional |
| | `status` | `nativeEnum(FactoringCompanyStatus)` |
| `CreditFacilityCreateSchema` | `hotelId` | `cuid()` |
| | `factoringCompanyId` | `cuid()` |
| | `limit` | `positive()` |
| | `interestRate` | `min(0)` |

#### Logistics Schemas

| Schema | Fields | Constraints |
|---|---|---|
| `TripCreateSchema` | `hubId` | `cuid()` |
| | `driverName` | `min(1)` |
| | `driverPhone` | `min(1)` |
| | `vehiclePlate` | `min(1)` |
| | `scheduledDate` | `datetime()` |
| `TripStopCreateSchema` | `orderId` | `cuid()`, optional |
| | `stopNumber` | `int().min(1)` |
| | `eta` | `datetime()`, optional |

#### Supplier Audit Schema

| Schema | Fields | Constraints |
|---|---|---|
| `SupplierAuditCreateSchema` | `auditorName` | `min(1)` |
| | `auditDate` | `datetime()` |
| | `score` | `int().min(0).max(100)`, optional |
| | `status` | `nativeEnum(AuditStatus)` |
| | `coldChainCompliant` | `boolean()`, optional |
| | `haccpCertified` | `boolean()`, optional |

#### Pagination Schema

| Schema | Fields | Constraints |
|---|---|---|
| `PaginationSchema` | `page` | `coerce.number().int().min(1)`, default `1` |
| | `limit` | `coerce.number().int().min(1).max(100)`, default `20` |
| | `search` | optional |
| | `sortBy` | optional |
| | `sortOrder` | `enum(["asc","desc"])`, default `"desc"` |

### Inline Zod Schemas (API Routes)

| Route | Schema Name | Fields |
|---|---|---|
| `api/v1/admin/authority-override` | `OverrideSchema` | `orderId: cuid()`, `reason: min(20)`, `waivePaymentGuarantee: boolean`, `coAuthorizerId: cuid()` |
| `api/v1/admin/explorer` | `ExplorerQuerySchema` | `entity: enum(8 values)`, `search: optional`, `page: coerce`, `limit: coerce.max(100)`, `sortBy: default`, `sortOrder: enum` |
| `api/v1/checkout` | `CheckoutSchema` | `items: array({productId, quantity.min(1), unitPrice, notes?})`, `address: {label?, address, city, governorate, lat?, lng?}`, `shippingMethod: enum(["express","standard","self"])`, `paymentMethod: string`, `poNumber?`, `costCenter?` |
| `api/v1/eta/submit` | `SubmitSchema` | `invoiceId: cuid()` |
| `api/v1/factoring/inquire` | `InquireSchema` | `invoiceId: cuid()` |
| `api/v1/factoring/fund` | `FundSchema` | `invoiceId: cuid()`, `partnerId: min(1)` |
| `api/v1/factoring/credit-lines` | `CreditLineApplicationSchema` | 3 nested objects: `hotelInfo` (7 fields), `financials` (10 fields), `collateral` (5 fields) + `creditScore: 0-100`, `recommendedLimit: min(0)` |
| `api/v1/disputes` | `CreateDisputeSchema` | `orderId: cuid()`, `reason: min(10)`, `evidenceUrls: array(url)`, `amountDisputed: positive()` |

### Validation Gaps

| # | Issue | Severity | Detail |
|---|---|---|---|
| **C1** | No `max` on `HotelCreateSchema.creditLimit` | LOW | Credit limit can be any positive number — no upper bound validation. |
| **C2** | `OrderCreateSchema.items` has no `max` array length | MEDIUM | An order with 10,000 items could be submitted. Add `.max(500)` or similar. |
| **C3** | `LoginSchema` accepts `"admin"` as email | LOW | Intentional backdoor for demo. Must be disabled in production or guarded by env flag. |
| **C4** | `ProductCreateSchema.unitPrice` has no max | LOW | No upper bound — could accept unrealistic prices. |
| **C5** | `CreditLineApplicationSchema` financials are all `string().optional()` | MEDIUM | Financial amounts are typed as strings, parsed with `parseFloat` after validation. Should be `z.number()` at schema level to prevent invalid numeric strings. |
| **C6** | No `z.email()` validation on `EtaTaxpayer.id` (tax ID) | LOW | Tax IDs are plain strings — no format validation for Egyptian tax ID patterns. |

---

## D. Oliv / Factoring Schemas

### Oliv Referral Payload

```typescript
// lib/payments/oliv/index.ts
interface OlivReferralPayload {
  orderId: string;
  invoiceId: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
  hotelName: string;
}

interface OlivHotelReferralPayload {
  hotelId: string;
  hotelName: string;
  hotelEmail: string;
  taxId: string;
  propertyType: string;
  numberOfProperties: string;
  financingType: "factoring" | "reverse_factoring";
  etaToken?: string;
}

interface OlivCheckoutPayload {
  hotelId: string;
  hotelName: string;
  orderId: string;
  amount: number;
  currency: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}
```

### Oliv Invoice Submission

```typescript
interface OlivInvoiceSubmission {
  invoiceId: string;
  invoiceNumber: string;
  supplierId: string;
  hotelId: string;
  amount: number;
  currency: "EGP";                    // Fixed enum
  issueDate: string;                   // ISO date
  dueDate: string;                     // ISO date
  vatAmount: number;
  netAmount: number;
  invoiceItems: OlivInvoiceItem[];
  hotelDetails: OlivHotelDetails;
  supplierDetails: OlivSupplierDetails;
}

interface OlivInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  vatRate: number;
}

interface OlivHotelDetails {
  legalName: string;
  taxId: string;
  commercialReg: string;
  address: string;
  city: string;
  governorate: string;
  email: string;
  phone: string;
}

interface OlivSupplierDetails {
  legalName: string;
  taxId: string;
  commercialReg: string;
  address: string;
  city: string;
  governorate: string;
  email: string;
  phone: string;
}
```

### Oliv Webhook Payload

```typescript
interface OlivWebhookPayload {
  event: "FACTORING_STATUS_UPDATE";
  timestamp: string;
  data: OlivStatusUpdate;
  signature: string;                   // HMAC-SHA256
}

interface OlivStatusUpdate {
  factoringRequestId: string;
  invoiceId: string;
  previousStatus: OlivFactoringStatus;
  newStatus: OlivFactoringStatus;
  updatedAt: string;
  metadata?: {
    disbursedAmount?: number;
    disbursedAt?: string;
    maturityDate?: string;
    rejectionReason?: string;
    approvedAdvanceRate?: number;
    approvedDiscountRate?: number;
  };
}
```

### Factoring Partner Adapter Interface

```typescript
// lib/fintech/factoring-bridge.ts
interface FactoringPartnerAdapter {
  id: string;
  name: string;
  type: "STANDARD" | "HIGH_RISK" | "PAYMENT_RAIL";

  checkEligibility(invoice: InvoiceDataForPartner): Promise<PartnerOffer>;

  submitInstruction(invoice: InvoiceDataForPartner): Promise<{
    success: boolean;
    instructionId: string;
    partnerFundingId: string;
    estimatedDisbursementDate: string;
  }>;

  trackInstruction(instructionId: string): Promise<{
    status: "PENDING" | "DISBURSED" | "SETTLED" | "DEFAULTED" | "DISPUTED";
    disbursedAt?: Date;
    settledAt?: Date;
  }>;

  handleWebhook(payload: unknown): Promise<WebhookResult>;
}

interface InvoiceDataForPartner {
  invoiceId: string;
  invoiceNumber: string;
  etaUuid: string;
  grossAmount: number;
  currency: string;
  supplier: { name: string; taxId: string; bankAccount: string; bankName: string };
  hotel: { name: string; taxId: string };
  orderId: string;
  deliveryConfirmedAt: string;
}

interface PartnerOffer {
  partnerId: string;
  partnerName: string;
  eligible: boolean;
  maxAdvanceRate: number;
  discountRate: number;
  responseId: string;
  rejectionReason?: string;
  estimatedDisbursement?: number;
}
```

### Status Flow State Machine (OLIV_STATUS_FLOW)

```
INITIALIZED ──→ UNDER_REVIEW ──→ APPROVED ──→ DISBURSED ──→ MATURED
    │                │              │              │
    └→ REJECTED      └→ REJECTED    └→ CANCELLED   └→ DEFAULTED
    └→ CANCELLED     └→ CANCELLED

Terminal states: MATURED, REJECTED, DEFAULTED, CANCELLED
```

```typescript
const OLIV_STATUS_FLOW: Record<OlivFactoringStatus, OlivFactoringStatus[]> = {
  INITIALIZED:    ["UNDER_REVIEW", "REJECTED", "CANCELLED"],
  UNDER_REVIEW:   ["APPROVED", "REJECTED", "CANCELLED"],
  APPROVED:       ["DISBURSED", "CANCELLED"],
  DISBURSED:      ["MATURED", "DEFAULTED"],
  MATURED:        [],
  REJECTED:       [],
  DEFAULTED:      [],
  CANCELLED:      [],
};
```

### Oliv Finance Config

```typescript
const OLIV_CONFIG = {
  standardAdvanceRate: 0.88,        // 88% of invoice
  standardDiscountRate: 0.025,      // 2.5% partner fee
  highRiskAdvanceRate: 0.82,        // 82% for high-risk
  highRiskDiscountRate: 0.035,      // 3.5% for high-risk
  minInvoiceAmount: 5000,           // EGP 5,000 minimum
  maxInvoiceAmount: 5_000_000,      // EGP 5M maximum
  standardSettlementDays: 90,
  highRiskSettlementDays: 60,
};
```

### Security Concerns

| # | Issue | Severity | Detail |
|---|---|---|---|
| **D1** | `OlivReferralPayload` has no Zod validation | MEDIUM | Referral payloads are constructed from user data without schema validation. Injection of arbitrary URL params is possible. |
| **D2** | `handleOlivWebhook` accepts `Record<string, unknown>` without type narrowing | LOW | Phase 1 webhook path (`!("event" in rawPayload)`) accepts any object shape. |
| **D3** | `OlivWebhookPayload` signature is HMAC-SHA256 with `timingSafeEqual` — good | INFO | Correctly uses timing-safe comparison. No vulnerability here. |

---

## E. ETA Schema

### Invoice Submission Payload

```typescript
// lib/eta/types.ts
interface EtaInvoicePayload {
  issuer: EtaTaxpayer;
  receiver: EtaTaxpayer;
  documentType: "I" | "C" | "D";         // Invoice, Credit Note, Debit Note
  documentTypeVersion: "1.0";
  dateIssued: string;                      // ISO 8601
  internalId: string;                      // Platform invoice number
  purchaseOrderReference?: string;
  proformaInvoiceNumber?: string;
  payment: EtaPayment;
  delivery: EtaDelivery;
  invoiceLines: EtaInvoiceLine[];
  totalDiscountAmount?: number;
  totalSalesAmount: number;
  netAmount: number;
  taxTotals: EtaTaxTotal[];
  totalAmount: number;
  extraDiscountAmount?: number;
  totalItemsDiscountAmount?: number;
}

interface EtaTaxpayer {
  type: "B" | "P" | "F";                  // Business, Person, Foreign
  id: string;                              // Tax Registration Number
  name: string;
  address: EtaAddress;
}

interface EtaAddress {
  branchId?: string;
  country: string;                         // "EG"
  governate: string;
  regionCity: string;
  street: string;
  buildingNumber: string;
  postalCode?: string;
  floor?: string;
  room?: string;
  landmark?: string;
  additionalInformation?: string;
}

interface EtaPayment {
  bankName?: string;
  bankAddress?: string;
  bankAccountNo?: string;
  bankAccountIBAN?: string;
  swiftCode?: string;
  terms: string;
}

interface EtaDelivery {
  approach: string;
  packaging?: string;
  dateValidity?: string;
  exportPort?: string;
  countryOfOrigin?: string;
  grossWeight?: number;
  netWeight?: number;
  terms: string;
}

interface EtaInvoiceLine {
  description: string;
  descriptionAr?: string;                  // Arabic — ETA V2 bilingual requirement
  itemType: "GS1" | "EGS";
  itemCode: string;
  codeName?: string;
  codeNameAr?: string;
  unitType: string;
  quantity: number;
  internalCode?: string;
  salesTotal: number;
  total: number;
  valueDifference: number;
  totalTaxableFees: number;
  netTotal: number;
  itemsDiscount: number;
  discount: EtaDiscount;
  taxableItems: EtaTaxableItem[];
}

interface EtaTaxableItem {
  taxType: "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "T8" | "T9" | "T10" | "T11" | "T12";
  amount: number;
  subType: string;
  rate: number;
}
```

### Callback Payload

```typescript
interface EtaCallbackPayload {
  uuid: string;
  status: EtaDocumentStatus;               // "Submitted" | "Valid" | "Invalid" | "Rejected" | "Cancelled"
  dateTimeValidated?: string;
  rejectionReasons?: { error: string; errorCode: string }[];
}
```

### ETA Status Mapping (Callback → Internal)

```typescript
const etaStatusMap: Record<string, EtaStatus> = {
  Submitted: "SUBMITTING",
  Valid:      "ACCEPTED",
  Invalid:    "REJECTED",
  Rejected:   "REJECTED",
  Cancelled:  "MANUAL_RESOLUTION",
};
// Unknown → "RETRYING"
```

### ETA Config

```typescript
interface EtaConfig {
  baseUrl: string;       // https://api.preprod.invoicing.eta.gov.eg
  apiVersion: string;    // "api/v1"
  clientId: string;
  clientSecret: string;
  timeoutMs: number;     // 30000
  maxRetries: number;    // 3
  retryDelayMs: number;  // 2000
}
```

### Validation Codes

```typescript
type EtaValidationCode =
  | "ETA_VALID"
  | "ETA_UUID_MISSING"
  | "ETA_STATUS_INVALID"
  | "ETA_SIGNATURE_MISSING"
  | "ETA_AMOUNT_MISMATCH"
  | "ETA_TAX_ID_MISMATCH"
  | "ETA_NOT_FOUND"
  | "ETA_API_ERROR"
  | "ETA_NETWORK_ERROR";
```

### Security Concerns

| # | Issue | Severity | Detail |
|---|---|---|---|
| **E1** | `processCallback` does tenant verification — good | INFO | Validates `invoice.tenant.status === "ACTIVE"` before mutation. Defense-in-depth. |
| **E2** | `processCallback` has idempotency check via `submissionLog.lastCallback` | INFO | Prevents duplicate processing of same callback. Correct. |
| **E3** | No HMAC verification on ETA callbacks in `eta/client.ts` | HIGH | The callback handler trusts the payload without verifying an HMAC signature. The HTTP route (`app/api/webhooks/eta/`) should handle this, but the client function does not enforce it. |
| **E4** | `getAccessToken` caches token in module-level variable | LOW | Token caching is fine but the `cachedToken` variable is not thread-safe in edge runtime. Acceptable for Node.js runtime. |

---

## F. Authority Matrix Rules

### Rule Dimensions

```typescript
interface AuthorityRule {
  id: string;
  name: string;
  priority: number;                     // Higher = evaluated first
  minValue: number;                     // Order value lower bound (EGP)
  maxValue: number;                     // Order value upper bound (EGP)
  hotelRiskTier?: RiskTier | null;      // "LOW" | "HIGH" | "CRITICAL"
  hotelTier?: HotelTier | null;         // From Prisma enum
  supplierTier?: SupplierTier | null;   // From Prisma enum
  requesterRole?: UserRole | null;      // Role of the user who created the order
  requiresPaymentGuarantee: boolean;    // G10: ABSOLUTE gate
  requiresEtaValidation: boolean;       // G10: ABSOLUTE gate for factoring
  requiresDualSignOff: boolean;         // Two admins required
  action: AuthorityAction;              // What happens when rule matches
  routeToRole?: UserRole | null;        // Who to route to
  tenantId?: string | null;             // null = global rule
  isActive: boolean;
}
```

### Authority Actions

```typescript
type AuthorityAction =
  | "AUTO_APPROVE"
  | "APPROVE"
  | "ROUTE_TO_GM"
  | "ROUTE_TO_FINANCIAL_CONTROLLER"
  | "REQUIRE_OWNER"
  | "DUAL_SIGN_OFF"
  | "REJECT"
  | "REQUIRE_PAYMENT_GUARANTEE"
  | "SMART_FIX_REQUIRED";
```

### Built-in Global Rules (Priority Order)

| Priority | ID | Condition | Action | Payment Gate | ETA Gate |
|---|---|---|---|---|---|
| 1000 | `rule_critical_block` | Risk = CRITICAL | REJECT | Yes | Yes |
| 950 | `rule_eta_invalid` | (any) | REJECT | Yes | Yes |
| 900 | `rule_payment_guarantee_gate` | (any) | REQUIRE_PAYMENT_GUARANTEE | Yes | No |
| 850 | `rule_smart_fix` | Risk = HIGH | SMART_FIX_REQUIRED | Yes | No |
| 800 | `rule_high_value_dual` | Value ≥ 500K, Hotel = CORE | DUAL_SIGN_OFF | Yes | Yes |
| 750 | `rule_gm_route` | Value ≥ 100K, Role = CLERK | ROUTE_TO_GM → GM | Yes | No |
| 700 | `rule_auto_approve` | Value ≤ 50K, Risk = LOW | AUTO_APPROVE | Yes | Yes |
| 650 | `rule_fc_route` | Value ≥ 50K, Role = DEPARTMENT_HEAD | ROUTE_TO_FINANCIAL_CONTROLLER → FC | Yes | No |
| 600 | `rule_owner_route` | Value ≥ 1M | REQUIRE_OWNER | Yes | Yes |
| 500 | `rule_default` | (any) | APPROVE | No | No |

### Evaluation Flow

```
1. Load order by ID (scoped to tenant)
2. Fresh risk assessment via assessRisk()
3. Load DB rules (tenant-specific + global where tenantId=null)
   WHERE isActive=true AND minValue <= order.total <= maxValue
4. Merge with built-in rules (DB overrides built-in at same priority)
5. Sort all rules by priority DESC
6. For each rule:
   a. Check value range (minValue/maxValue)
   b. Check hotelRiskTier (if set)
   c. Check hotelTier (if set)
   d. Check supplierTier (if set)
   e. Check requesterRole (if set)
   f. If ALL match → execute gate checks:
      - If requiresPaymentGuarantee && !order.paymentGuaranteed →
        → If HIGH/CRITICAL risk: SMART_FIX_REQUIRED (generate fixes)
        → Else: REQUIRE_PAYMENT_GUARANTEE
      - If requiresEtaValidation →
        → validateForFactoring(invoice.id) → if invalid: REJECT
   g. Return matched action
7. If no rule matched → APPROVE (default fallback)
```

### Admin Override (Dual Authorization)

```typescript
interface AdminOverrideRequest {
  orderId: string;
  action: "ADMIN_OVERRIDE";
  reason: string;                  // Min 20 characters
  waivePaymentGuarantee: boolean;
  authorizerId: string;            // First admin
  coAuthorizerId: string;          // Second admin (must be different person)
  tenantId: string;
}
```

**Enforcement:**
- Reason must be ≥ 20 characters
- Both authorizers must exist and be distinct users
- Both must have `platformRole === "ADMIN"` or `canOverride === true`
- Entire override runs in a single Prisma transaction with `FOR UPDATE` row lock
- Audit log records `beforeState` and `afterState` snapshots

### Security Concerns

| # | Issue | Severity | Detail |
|---|---|---|---|
| **F1** | DB rules loaded with `requiresPaymentGuarantee: false` forced in merge | HIGH | When merging DB rules into built-in rules, the code forces `requiresPaymentGuarantee: false`, `requiresEtaValidation: false`, `requiresDualSignOff: false` on all DB rules. This means **database-configured payment/ETA gates are silently ignored**. Only built-in rules enforce these gates. |
| **F2** | `checkRuleMatch` uses `userRole` parameter but `requesterRole` from order | LOW | The `requesterRole` check uses `ctx.userRole` (the current user) rather than the order's original requester role. If a GM reviews a clerk's order, the `requesterRole: "CLERK"` rule would match the GM's session role, not the original clerk. |
| **F3** | No concurrency protection on rule evaluation | MEDIUM | Two simultaneous evaluations of the same order could race. The `adminOverride` function has `FOR UPDATE` locking, but `evaluateAuthority` does not. |
| **F4** | `rule_default` has `requiresPaymentGuarantee: false` | INFO | Intentional — default approval does not require payment guarantee. All higher-priority rules that need it set the flag explicitly. |

---

## Summary of All Validation Gaps & Security Concerns

| ID | Module | Severity | Issue |
|---|---|---|---|
| **A1** | Auth | MEDIUM | `x-session-token` header forwarded to API handlers |
| **A3** | Auth | LOW | No `iss`/`aud` JWT claim validation |
| **B1** | RBAC | MEDIUM | No centralized permission code registry |
| **B2** | RBAC | LOW | Permission check does 2 DB queries per request |
| **C2** | Zod | MEDIUM | `OrderCreateSchema.items` has no max array length |
| **C3** | Zod | LOW | `LoginSchema` accepts literal `"admin"` as email |
| **C5** | Zod | MEDIUM | `CreditLineApplicationSchema` financials typed as strings |
| **D1** | Oliv | MEDIUM | `OlivReferralPayload` has no Zod validation |
| **D2** | Oliv | LOW | `handleOlivWebhook` Phase 1 accepts any object |
| **E3** | ETA | **HIGH** | No HMAC verification on ETA callbacks in client |
| **E4** | ETA | LOW | Token caching not thread-safe in edge runtime |
| **F1** | Authority | **HIGH** | DB rules' payment/ETA gates silently overridden in merge |
| **F2** | Authority | LOW | `requesterRole` check uses current user role, not original requester |
| **F3** | Authority | MEDIUM | No concurrency protection on rule evaluation |

---

*Report generated from source analysis of `lib/auth.ts`, `lib/session.ts`, `lib/auth/rbac.ts`, `lib/auth/authority-matrix.ts`, `lib/api-utils.ts`, `middleware.ts`, `lib/payments/oliv/index.ts`, `lib/fintech/factoring-bridge.ts`, `lib/eta/client.ts`, `lib/eta/types.ts`, `lib/zod.ts`, and 10 inline Zod schemas across API routes.*
