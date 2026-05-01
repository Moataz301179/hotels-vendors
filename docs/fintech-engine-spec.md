# Fintech & Risk Guarantee Layer Specification
## Hotels Vendors — Non-Recourse Factoring Engine
**Version:** 1.0 | **Date:** 2026-05-01 | **Status:** APPROVED FOR IMPLEMENTATION

---

## 1. EXECUTIVE SUMMARY

The Egyptian hospitality market operates on a **"Credit Sales" deadlock**: suppliers ship goods, wait 60–90 days for payment, and absorb all default risk. Hotels exploit this by demanding longer terms, while SME suppliers bleed working capital.

**Our solution:** A **Non-Recourse Factoring Engine** embedded in the procurement hub.
- Supplier ships → Platform guarantees payment via factoring partner
- Supplier receives 90% of invoice value within 24–48 hours
- Platform deducts its fee first (Hub-Revenue Calculator)
- Hotel pays factoring partner on due date
- **Supplier has zero recourse risk.** If hotel defaults, factoring partner absorbs loss (priced into their rate).

**Platform liability:** ZERO. We are a matching hub, not a balance-sheet lender.

---

## 2. CORE SERVICES ARCHITECTURE

```
lib/
├── fintech/
│   ├── factoring-engine.ts      # Non-recourse factoring orchestration
│   ├── factoring-bridge.ts      # Unified partner API (EFG Hermes, Contact, etc.)
│   ├── risk-engine.ts           # Credit scoring + Smart Fix suggestions
│   ├── hub-revenue.ts           # Platform fee + membership discount calculator
│   ├── idempotency.ts           # Idempotency key generation/validation
│   └── ledger.ts                # Double-entry journal generation
│
├── eta/
│   ├── client.ts                # ETA API HTTP client
│   ├── validator.ts             # ETA UUID validation (factoring gate)
│   ├── signer.ts                # Digital signature generation
│   ├── formatter.ts             # Order/Invoice → ETA JSON payload
│   ├── submitter.ts             # Submission orchestrator + retry
│   ├── queue.ts                 # Dead-letter queue for failures
│   └── types.ts                 # ETA API type definitions
│
└── auth/
    ├── authority-matrix.ts      # Order approval + Payment Guarantee gate
    └── rbac.ts                  # Permission enforcement
```

---

## 3. NON-RECOURSE FACTORING ENGINE

### 3.1 Factoring Lifecycle

```
ORDER CONFIRMED
       ↓
[Authority Matrix] → Payment Guaranteed? ──NO──→ [Smart Fix Engine]
       ↓ YES                                      ↓
[ETA Validator] → Valid ETA UUID? ──NO──→ Block shipment, flag compliance
       ↓ YES
[Factoring Bridge] → Inquiry: "Is hotel eligible for invoice amount?"
       ↓
Partner responds ELIGIBLE / CONDITIONAL / REJECTED
       ↓
[Hub-Revenue Calculator] → Compute net disbursement
       ↓
Partner disburses to Supplier (minus platform fee + factoring rate)
       ↓
Hotel pays Partner on due date
       ↓
If Hotel defaults → Partner absorbs loss (non-recourse)
```

### 3.2 FactoringRequest Model

```prisma
model FactoringRequest {
  id              String              @id @default(cuid())
  invoiceId       String              @unique
  invoice         Invoice             @relation(fields: [invoiceId], references: [id])

  // Request
  requestedAmount Float
  requestedAt     DateTime            @default(now())

  // Partner
  factoringCompanyId String
  factoringCompany   FactoringCompany @relation(fields: [factoringCompanyId], references: [id])

  // Underwriting
  status          FactoringRequestStatus @default(PENDING)
  riskScore       Int?                   @default(50) // 0-100
  riskTier        RiskTier               @default(MEDIUM)

  // Terms
  advanceRate     Float                  @default(0.90) // 90%
  discountRate    Float                  @default(0.02) // 2% factoring fee
  platformFeeRate Float                  @default(0.015) // 1.5% platform fee
  membershipDiscount Float               @default(0) // e.g., 0.50 for Prime 50% off

  // Disbursement
  grossAmount     Float? // Invoice total
  platformFee     Float? // Deducted first
  netPlatformFee  Float? // platformFee * (1 - membershipDiscount)
  factoringFee    Float? // grossAmount * discountRate
  disbursedAmount Float? // grossAmount * advanceRate - netPlatformFee - factoringFee

  // Settlement
  disbursedAt     DateTime?
  settledAt       DateTime?
  hotelPaidAt     DateTime?

  // Non-recourse flag
  isNonRecourse   Boolean @default(true)

  // Partner response log
  partnerResponse String? // JSON

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum FactoringRequestStatus {
  PENDING
  UNDER_REVIEW
  APPROVED
  REJECTED
  DISBURSED
  SETTLED
  DEFAULTED
}

enum RiskTier {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

### 3.3 Key Invariant

> **No invoice may enter the factoring pipeline without a valid ETA UUID.**
> The ETA Validator acts as the compliance gate. Without ETA validation, the factoring bridge returns `REJECTED` automatically.

---

## 4. RISK ENGINE — SMART FIX SYSTEM

### 4.1 Credit Scoring

The Risk Engine computes a composite `riskScore` (0–100) for every hotel:

| Factor | Weight | Source |
|--------|--------|--------|
| Payment history (on-time %) | 30% | Invoice payment records |
| Credit utilization | 20% | CreditFacility.utilized / limit |
| Order dispute rate | 15% | Disputed orders / total orders |
| ETA compliance score | 15% | ETA submission timeliness |
| Property count / scale | 10% | Number of properties, room count |
| Market reputation | 10% | External data + platform reviews |

**Risk Tiers:**
- `LOW` (0–25): Standard terms, best factoring rates
- `MEDIUM` (26–50): Standard terms
- `HIGH` (51–75): Conditional — Smart Fix required
- `CRITICAL` (76–100): Blocked — requires deposit or split payment

### 4.2 Smart Fix Engine

When a hotel has `riskScore > 50` or insufficient credit, the engine autonomously suggests fixes:

#### Fix A: Digital Deposit (Paymob Integration)
```typescript
if (riskScore > 75 || creditAvailable < orderTotal * 0.5) {
  return {
    fix: "DEPOSIT_20",
    description: "Require 20% digital deposit via Paymob before order release",
    action: "HOLD_ORDER",
    depositAmount: orderTotal * 0.20,
    gateway: "PAYMOB",
    releaseCondition: "DEPOSIT_RECEIVED",
    meta: { paymobOrderId: null, paymentLink: null }
  };
}
```

#### Fix B: High-Risk Factoring Partner
```typescript
if (riskScore > 60 && riskScore <= 85) {
  return {
    fix: "HIGH_RISK_FACTORING",
    description: "Route through specialized high-risk factoring partner at adjusted rate",
    action: "ROUTE_PARTNER",
    partnerTier: "HIGH_RISK",
    adjustedRate: baseRate * 1.5, // e.g., 3% instead of 2%
    advanceRate: 0.85, // Lower advance for high risk
    eligiblePartners: ["contact_high_risk", "efg_sme_desk"]
  };
}
```

#### Fix C: Split-Payment Model
```typescript
if (riskScore > 50 && hotelPrefersSplit) {
  return {
    fix: "SPLIT_50_50",
    description: "50% on delivery (via Paymob), 50% on standard credit terms",
    action: "SPLIT_PAYMENT",
    deliveryPayment: orderTotal * 0.50,
    creditPayment: orderTotal * 0.50,
    creditTermsDays: 30,
    factoringEligible: false // Only the credit portion can be factored later
  };
}
```

#### Fix D: Credit Limit Extension (Conditional)
```typescript
if (hotel.riskScore < 60 && creditAvailable < orderTotal && hotel.paymentHistory > 0.95) {
  return {
    fix: "AUTO_LIMIT_EXTENSION",
    description: "Automatic 10% credit limit extension based on flawless payment history",
    action: "EXTEND_LIMIT",
    extensionAmount: currentLimit * 0.10,
    requiresApproval: false
  };
}
```

### 4.3 Smart Fix Resolution Flow

```
Order Created
    ↓
Risk Engine scores hotel + checks credit
    ↓
Can order proceed? ──YES──→ Normal flow
    ↓ NO
Smart Fix Engine generates Fix A/B/C/D
    ↓
Fix presented to hotel buyer (UI notification + email)
    ↓
Hotel accepts fix? ──NO──→ Order CANCELLED
    ↓ YES
Fix applied (deposit received / partner routed / split configured)
    ↓
Order proceeds to Authority Matrix
    ↓
Payment Guaranteed flag set
```

---

## 5. FACTORING API BRIDGE

### 5.1 Unified Interface

The bridge abstracts all factoring partners behind a single interface:

```typescript
interface FactoringPartner {
  id: string;
  name: string;
  type: "STANDARD" | "HIGH_RISK";
  
  // Inquiry
  inquire(eligibility: EligibilityRequest): Promise<InquiryResponse>;
  
  // Funding
  fund(request: FundingRequest): Promise<FundingResponse>;
  
  // Settlement tracking
  track(factoringRequestId: string): Promise<SettlementStatus>;
  
  // Webhook handler
  handleWebhook(payload: unknown): Promise<WebhookResult>;
}
```

### 5.2 Eligibility Inquiry

```typescript
interface EligibilityRequest {
  hotelTaxId: string;
  hotelName: string;
  invoiceAmount: number;
  invoiceCurrency: string;
  invoiceDueDate: Date;
  etaUuid: string; // Mandatory
  hotelRiskScore: number;
  hotelRiskTier: RiskTier;
}

interface InquiryResponse {
  eligible: boolean;
  maxAdvanceRate: number; // e.g., 0.90
  discountRate: number; // e.g., 0.02
  conditionalTerms?: string;
  rejectionReason?: string;
  responseId: string; // Partner reference
}
```

### 5.3 Funding Request

```typescript
interface FundingRequest {
  eligibilityResponseId: string;
  invoiceId: string;
  etaUuid: string;
  
  // Disbursement split (Hub-Revenue Calculator result)
  grossAmount: number;
  platformFee: number; // Deducted FIRST
  netDisbursement: number; // To supplier
  
  // Beneficiary
  supplierBankAccount: string;
  supplierBankName: string;
  supplierTaxId: string;
}

interface FundingResponse {
  success: boolean;
  factoringRequestId: string;
  disbursedAmount: number;
  disbursedAt: Date;
  transactionReference: string;
  expectedSettlementDate: Date;
}
```

### 5.4 Partner Adapters

```
lib/fintech/partners/
├── efg-hermes.ts       # EFG Hermes factoring API adapter
├── contact.ts          # Contact Financial factoring adapter
├── default-adapter.ts  # Generic REST adapter template
└── types.ts            # Shared partner types
```

---

## 6. HUB-REVENUE CALCULATOR

### 6.1 Fee Structure

```typescript
interface HubRevenueConfig {
  basePlatformFeeRate: number;      // 2.5% for CORE tier
  primeDiscount: number;            // 50% off for PREMIER tier
  coastalSurcharge: number;         // +0.5% for coastal logistics
  etaComplianceFee: number;         // +0.3% for ETA handling
  highRiskSurcharge: number;        // +0.5% for HIGH risk tier
  criticalRiskSurcharge: number;    // +1.0% for CRITICAL risk tier
}
```

### 6.2 Calculation Logic

```
grossInvoiceAmount = invoice.total
baseFee = grossInvoiceAmount * basePlatformFeeRate

// Membership discount
if (hotel.tier === PREMIER) {
  membershipDiscount = baseFee * primeDiscount // 50%
} else {
  membershipDiscount = 0
}

// Risk surcharge
if (hotel.riskTier === HIGH) {
  riskSurcharge = grossInvoiceAmount * highRiskSurcharge
} else if (hotel.riskTier === CRITICAL) {
  riskSurcharge = grossInvoiceAmount * criticalRiskSurcharge
} else {
  riskSurcharge = 0
}

// Logistics surcharge (coastal orders)
if (order.deliveryZone === "COASTAL") {
  logisticsSurcharge = grossInvoiceAmount * coastalSurcharge
} else {
  logisticsSurcharge = 0
}

// ETA compliance fee
etaFee = grossInvoiceAmount * etaComplianceFee

netPlatformFee = baseFee - membershipDiscount + riskSurcharge + logisticsSurcharge + etaFee

// Factoring partner fee (their revenue, not ours)
factoringFee = grossInvoiceAmount * partnerDiscountRate

// Supplier receives:
supplierDisbursement = (grossInvoiceAmount * advanceRate) - netPlatformFee - factoringFee

// Platform revenue:
platformRevenue = netPlatformFee
```

### 6.3 Payment Priority (Deducted First)

> **Platform fee is ALWAYS deducted before factoring partner fee.**
> This ensures the hub is paid first, even if the partner's advance rate is tight.

```
Invoice Total: 100,000 EGP
  → Platform Fee (1.25% net):     -1,250 EGP  [DEDUCTED FIRST]
  → Factoring Partner Fee (2%):   -2,000 EGP
  → Net to Supplier (90% advance): 90,000 - 1,250 - 2,000 = 86,750 EGP
```

---

## 7. ETA VALIDATOR — FACTORING GATE

### 7.1 Validation Rules

Every factoring request MUST pass these checks:

1. **UUID Presence:** `invoice.etaUuid` must exist and be non-empty.
2. **UUID Format:** Must match ETA UUID specification (UUID v4 or ETA-specific).
3. **ETA Status:** Must be `ACCEPTED` or `VALIDATED`. `PENDING`, `REJECTED`, or `RETRYING` blocks factoring.
4. **Digital Signature:** Invoice must have a valid digital signature on file.
5. **Tax ID Match:** `invoice.hotel.taxId` must match the ETA-registered tax ID.
6. **Amount Match:** Invoice total must match the ETA-submitted amount (±0.01 EGP tolerance).

### 7.2 Validation Flow

```typescript
async function validateForFactoring(invoiceId: string): Promise<EtaValidationResult> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { hotel: true, order: true }
  });

  // 1. UUID check
  if (!invoice.etaUuid) {
    return { valid: false, code: "ETA_UUID_MISSING", message: "Invoice has no ETA UUID" };
  }

  // 2. Status check
  if (invoice.etaStatus !== "ACCEPTED" && invoice.etaStatus !== "VALIDATED") {
    return { valid: false, code: "ETA_STATUS_INVALID", message: `ETA status: ${invoice.etaStatus}` };
  }

  // 3. Digital signature check
  if (!invoice.digitalSignature) {
    return { valid: false, code: "ETA_SIGNATURE_MISSING", message: "Digital signature required" };
  }

  // 4. Amount match (call ETA API to verify)
  const etaRecord = await etaClient.getInvoice(invoice.etaUuid);
  if (Math.abs(etaRecord.totalAmount - invoice.total) > 0.01) {
    return { valid: false, code: "ETA_AMOUNT_MISMATCH", message: "Invoice amount does not match ETA record" };
  }

  return { valid: true, code: "ETA_VALID", message: "Invoice is ETA-compliant" };
}
```

---

## 8. AUTHORITY MATRIX — PAYMENT GUARANTEE ENFORCEMENT

### 8.1 The Golden Rule

> **No order may transition to `CONFIRMED` or `IN_TRANSIT` without a `PaymentGuaranteed` flag.**

The Authority Matrix now has a **fintech dimension**:

| Dimension | Values |
|-----------|--------|
| `orderValue` | Order total |
| `hotelRiskTier` | LOW, MEDIUM, HIGH, CRITICAL |
| `paymentMethod` | FACTORING, DEPOSIT, SPLIT, DIRECT |
| `etaStatus` | PENDING, ACCEPTED, REJECTED |
| `factoringStatus` | NOT_FACTORABLE, AVAILABLE, APPROVED |

### 8.2 Authority Actions (Fintech-Aware)

| Action | Description |
|--------|-------------|
| `AUTO_APPROVE` | Order value < threshold + LOW risk + ETA valid + Factoring approved |
| `REQUIRE_PAYMENT_GUARANTEE` | Block until PaymentGuaranteed = true |
| `SMART_FIX_REQUIRED` | Route to Smart Fix engine before approval |
| `DUAL_SIGN_OFF` | High value + MEDIUM+ risk requires two approvers |
| `ROUTE_TO_GM` | High value orders require GM approval |
| `REJECT` | CRITICAL risk + no acceptable fix |

### 8.3 Payment Guarantee Flag

```typescript
interface PaymentGuarantee {
  orderId: string;
  guaranteed: boolean;
  method: "FACTORING" | "DEPOSIT" | "SPLIT" | "DIRECT";
  
  // Factoring
  factoringRequestId?: string;
  factoringCompanyId?: string;
  advanceRate?: number;
  
  // Deposit
  depositAmount?: number;
  depositReceived?: boolean;
  paymobOrderId?: string;
  
  // Split
  splitDeliveryAmount?: number;
  splitCreditAmount?: number;
  
  // Direct
  directCreditApproved?: boolean;
  
  // Validation
  etaValidated: boolean;
  etaUuid: string;
  
  // Audit
  verifiedAt: Date;
  verifiedBy: string; // User ID or "SYSTEM"
}
```

---

## 9. ADMIN "GOD-MODE" DASHBOARD

### 9.1 Credit Heatmap

**Data source:** `lib/fintech/risk-engine.ts` aggregates risk scores across all hotel tenants.

**Visual:** Geographic heatmap of Egypt showing hotel chains by risk tier.
- Green: LOW risk
- Yellow: MEDIUM risk
- Orange: HIGH risk
- Red: CRITICAL risk

**Metrics:**
- Total exposed credit
- Average risk score by governorate
- Hotels approaching credit limits
- Smart Fix acceptance rates by fix type

### 9.2 Liquidity Monitor

**Data source:** `lib/fintech/factoring-bridge.ts` tracks partner deployment.

**Metrics:**
- Total capital deployed today / this week / this month
- Active factoring requests by partner
- Disbursement velocity (EGP/hour)
- Default rate (non-recourse claims)
- Platform revenue YTD

**Alerts:**
- Partner approaching max facility limit
- Spike in HIGH/CRITICAL risk orders
- ETA submission failure rate > 5%

---

## 10. BUSINESS BARRIER SOLUTIONS

### 10.1 "Cheaper Offline Deals"

**The objection:** Hotels will say they get "cheaper" prices offline.

**The reality:** Offline deals are only cheaper on paper. The true cost includes:
1. **Cost of Capital:** 60–90 days payment delay = 15–25% annualized cost for supplier
2. **ETA Compliance Fines:** Non-compliant invoices face 2–5% penalties from Egyptian Tax Authority
3. **Logistics overhead:** Multiple supplier relationships = fragmented delivery costs
4. **Storage costs:** Bulk ordering to minimize transactions = 20–30% of hotel space wasted
5. **Dispute resolution:** No audit trail = 5–10% of orders disputed with no resolution

**The AI response:** The Smart Assistant generates a **"Total Cost of Procurement" (TCP) Report** for any hesitant hotel CFO:
```
Offline "Price":          100,000 EGP
+ Cost of Capital (90d):   +3,750 EGP
+ ETA Penalty Risk:        +2,500 EGP
+ Logistics Fragmentation: +4,200 EGP
+ Storage Waste:           +8,000 EGP
+ Dispute Losses:          +1,800 EGP
─────────────────────────────────────
TRUE Offline Cost:         120,250 EGP

Platform Price:            102,500 EGP
(includes 2.5% fee + factoring)
─────────────────────────────────────
SAVINGS:                    17,750 EGP (14.8%)
```

### 10.2 "Acquiring Big Names"

**The objection:** Major hotel chains (Marriott, Hilton, Four Seasons) won't join a new platform.

**The strategy:** "Founding Partner" status for the first 3 major chains.

**Offer:**
- 0% transaction fees for 6 months
- Dedicated onboarding team
- Custom ERP integration (Opera PMS, SAP)
- White-label procurement portal
- Executive dashboard with AI insights

**The ask in return:**
- Historical procurement data (last 24 months)
- Commitment to pilot the platform for 6 months
- Case study participation (public anonymized data)

**Why this works:**
1. The historical data is the **"gold"** that trains our AI agents
2. With big-name data, our recommendation engine becomes smarter than any human procurement team
3. Network effect: SME suppliers will flock to the platform to access these chains
4. After 6 months, the chains are locked in by habit + AI optimization + supplier network

---

## 11. IMPLEMENTATION CHECKLIST

### Phase 1 — Schema & Core Engine (Days 1–5)
- [ ] Add `FactoringRequest` model to Prisma schema
- [ ] Add `riskScore`, `riskTier` fields to `Hotel` model
- [ ] Add `paymentGuaranteed`, `paymentGuaranteeMethod` fields to `Order` model
- [ ] Implement `lib/fintech/factoring-engine.ts`
- [ ] Implement `lib/fintech/risk-engine.ts`
- [ ] Implement `lib/fintech/hub-revenue.ts`

### Phase 2 — Bridges & Validators (Days 6–10)
- [ ] Implement `lib/fintech/factoring-bridge.ts` with partner interface
- [ ] Implement `lib/fintech/partners/efg-hermes.ts` (mock adapter)
- [ ] Implement `lib/fintech/partners/contact.ts` (mock adapter)
- [ ] Implement `lib/eta/validator.ts` with factoring gate
- [ ] Implement `lib/eta/client.ts` with sandbox integration

### Phase 3 — Authority Matrix Integration (Days 11–15)
- [ ] Update `lib/auth/authority-matrix.ts` with PaymentGuarantee gate
- [ ] Integrate Smart Fix engine into order flow
- [ ] Add `PaymentGuaranteed` flag to order status transitions
- [ ] Implement admin Authority Matrix configuration UI

### Phase 4 — Admin Dashboard (Days 16–20)
- [ ] Build Credit Heatmap API (`app/api/v1/admin/risk/heatmap/`)
- [ ] Build Liquidity Monitor API (`app/api/v1/admin/liquidity/`)
- [ ] Build Risk Dashboard UI (`app/(dashboard)/admin/risk/`)
- [ ] Build Liquidity Monitor UI (`app/(dashboard)/admin/liquidity/`)

### Phase 5 — Business Logic Polish (Days 21–25)
- [ ] TCP Report generator (`lib/ai/hotel-insights.ts`)
- [ ] Founding Partner onboarding flow
- [ ] Smart Fix notification system (email + in-app)
- [ ] End-to-end testing of factoring lifecycle

---

**End of Specification**
