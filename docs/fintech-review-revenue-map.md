# Deliverable 3 — Commission / Revenue Map

> Read-only analysis. Every claim cites `file_path:line_number`.

---

## 3.1 Revenue Streams Overview

HotelsVendors operates a **multi-layered revenue model** with three primary monetization channels. Critically, **the platform does NOT hold or transfer cash** — it orchestrates workflows and invoices fees separately. As stated in `lib/fintech/factoring-bridge.ts:5-6`: "HotelsVendors does NOT hold or transfer cash. The platform ONLY orchestrates the invoice-to-payment workflow."

### Revenue Stream Summary

| # | Revenue Stream | Rate | Collected From | Timing | Source |
|---|---|---|---|---|---|
| 1 | **Transaction Fee** | 2.5% (CORE) / 2.0% (PREMIER) / 1.5% (COASTAL) | Hotels (buyers) | Per completed order | `lib/fintech/fee-calculator.ts:42-46` |
| 2 | **Factoring Referral Fee** | 0.5% flat | Suppliers | Per factored invoice (invoiced to partner off-chain) | `lib/fintech/fee-calculator.ts:48`; `lib/fintech/hub-revenue.ts:14` |
| 3 | **Document Processing Fee** | EGP 5 per ETA-compliant document | Suppliers | Per ETA-submitted invoice | `lib/fintech/fee-calculator.ts:49`; AGENTS.md COO roadmap: "Document processing fees (per ETA invoice submitted)" |
| 4 | **SaaS Subscriptions** | Tier-based (STARTER/GROWTH/PROFESSIONAL) | Suppliers | Monthly | `lib/fintech/hub-revenue.ts:12-14`; `prisma/schema.prisma:2683-2695` (`InvoPlan` enum) |

---

## 3.2 Transaction Fee (Primary Revenue)

**Source:** `lib/fintech/fee-calculator.ts:6-12`

### Tier-Based Rate Table (lib/fintech/fee-calculator.ts:42-46)

| Hotel Tier | Transaction Fee Rate | Enum Source |
|---|---|---|
| CORE | 2.5% | `prisma/schema.prisma:2479-2483` (`HotelTier.CORE`) |
| PREMIER | 2.0% | `prisma/schema.prisma:2480` (`HotelTier.PREMIER`) |
| COASTAL | 1.5% | `prisma/schema.prisma:2481` (`HotelTier.COASTAL`) |

### Calculation Logic:
```
fee = round(invoiceTotal × rate × 100) / 100
```
(`lib/fintech/fee-calculator.ts:73`, `lib/fintech/fee-calculator.ts:135-136`)

### Application:
- Idempotent application via `applyPlatformFees()`: `lib/fintech/fee-calculator.ts:157-215`
- Checks if `invoice.platformFee > 0` first → returns `alreadyApplied: true` (`lib/fintech/fee-calculator.ts:178-200`)
- If not applied: calculates full breakdown + persists to `invoice.platformFee` and `invoice.platformFeeRate` fields: `lib/fintech/fee-calculator.ts:204-212`
- Invoice schema fields: `prisma/schema.prisma:578-579` — `platformFee Decimal @default(0)`, `platformFeeRate Decimal @default(0)`

### Full Fee Breakdown (calculateFullFeeBreakdown):
`lib/fintech/fee-calculator.ts:115-144`

| Component | Calculation | Example (100K EGP invoice, CORE tier) |
|---|---|---|
| Transaction Fee | `invoiceTotal × 0.025` | 2,500 EGP |
| Factoring Referral Fee | `invoiceTotal × 0.005` | 500 EGP |
| Document Processing Fee | `5 × documentCount` | 5 EGP (1 doc) |
| **Total Platform Fees** | Sum of above | **3,005 EGP** |

---

## 3.3 Factoring Referral Fee (Revenue from Partner)

**Source:** `lib/fintech/fee-calculator.ts:48` (`FACTORING_REFERRAL_RATE = 0.005` = 0.5% flat)

### Key Characteristics:
- **0.5% flat** on invoice value — does NOT vary by hotel tier
- **Not deducted from supplier disbursement** — the factoring partner pays the supplier first, then the platform invoices the partner separately for the referral fee
- **Invoiced off-chain**: `lib/fintech/hub-revenue.ts:14` — "Factoring partner referral fees (invoiced to partners off-chain)"

### Where It's Recorded:
When Oliv pays out via webhook (`app/api/v1/oliv/payout-callback/route.ts`):
- `app/api/v1/oliv/payout-callback/route.ts:203` — hardcoded `platformFeeRate: 0.02` (2%)
- `app/api/v1/oliv/payout-callback/route.ts:181-182` — calculates `platformFee = disbursedAmount × 0.02`
- `app/api/v1/oliv/payout-callback/route.ts:208` — hardcoded `commissionRate: 0.02`
- `app/api/v1/oliv/payout-callback/route.ts:209` — `commissionAmount: platformFee` (same value, different field)
- Creates `LedgerEntry` debiting from revenue: `app/api/v1/oliv/payout-callback/route.ts:242-258` — `entryType: "PLATFORM_FEE"`, `account: "REVENUE"`, `amount: platformFee`

### ⚠️ Inconsistency Alert:
- `fee-calculator.ts` defines referral rate as **0.5%** (`lib/fintech/fee-calculator.ts:48`)
- `payout-callback/route.ts` hardcodes platform fee rate as **2%** (`app/api/v1/oliv/payout-callback/route.ts:181` and line 203)
- `hub-revenue.ts` `calculateHubRevenue()` uses **2.5%** as `platformFeeRate` (`lib/fintech/hub-revenue.ts:251`)
- These three rates (0.5%, 2%, 2.5%) appear to measure different things but are not clearly delineated in code.

---

## 3.4 Platform Fee Priority (G10)

**Rule:** The Hub-Revenue Calculator deducts the platform fee BEFORE the factoring partner fee. The hub is always paid first.

### Source:
- `lib/fintech/hub-revenue.ts:10-11` — module docstring: "HotelsVendors' actual revenue comes from... Factoring partner referral fees (invoiced to partners off-chain)"
- `lib/fintech/hub-revenue.ts:18` / line 31 — `hubRevenue.netPlatformFee` calculated BEFORE `factoringFee` is subtracted
- `lib/fintech/hub-revenue.ts:253-255`:
  ```typescript
  const factoringFee = grossAmount * partnerDiscountRate;
  const netPlatformFee = grossAmount * platformFeeRate;
  const disbursementToSupplier = grossAmount * advanceRate - factoringFee;
  ```
- The `note` field at `lib/fintech/hub-revenue.ts:266`: "Platform does not deduct from disbursement. Partner collects their own fee."

### This means:
1. Platform fee (2.5%) is calculated on gross invoice amount → invoiced to partner
2. Factoring partner's fee (discountRate, e.g. 2.5%) is deducted from disbursed amount → goes to partner
3. Supplier receives: `grossAmount × advanceRate - partner_factoring_fee`
4. Platform never touches the cash — it just records the fee obligation

---

## 3.5 Commission Reconciliation Flow

### Step 1: Factoring Initiation
- Supplier clicks "Factor via Oliv" → `app/api/v1/oliv/initiate-factoring/route.ts`
- System generates referral token with attribution: `app/api/v1/oliv/initiate-factoring/route.ts:54`
- Partner ID embedded: `app/api/v1/oliv/initiate-factoring/route.ts:74` — `"HOTELSVENDORS_GLOBAL_001"`

### Step 2: Oliv Disburses to Supplier
- `lib/payments/oliv/index.ts:427` — `submitInstruction()` POSTs to `/factoring-instructions`
- Oliv sends funds directly to supplier's bank account (supplier bank details from `lib/fintech/anti-bypass/layer3-crm-attribution.ts:63-70`)
- `lib/payments/oliv/index.ts:356-365` — Oliv config: 88% advance rate, 2.5% discount rate, min 5K EGP

### Step 3: Oliv Pings Back (Webhook)
- `app/api/v1/oliv/payout-callback/route.ts:69-273` — receives payout status
- Layer 0 (HMAC) + Layer 1 (referral token) + ETA UUID binding verification
- Calculates platform fee at 2%: `app/api/v1/oliv/payout-callback/route.ts:181`
- Creates `FactoringTransaction` record: `app/api/v1/oliv/payout-callback/route.ts:184-212`

### Step 4: Commission Status Tracking
- `prisma/schema.prisma:2072` — `FactoringTransaction.commissionStatus String? @default("PENDING")`
- Commission starts as `PENDING` → will transition to `PAID` when partner pays referral fee
- Indexed at `prisma/schema.prisma:2073` (no explicit index for commissionStatus, but model is queryable)

### Step 5: Ledger Entry
- `app/api/v1/oliv/payout-callback/route.ts:242-258` — creates `LedgerEntry`:
  - `entityType: "PLATFORM_FEE"`
  - `account: "REVENUE"`
  - `amount: platformFee` (2% of disbursed amount)
  - `reference: "OLIV-{olivTransactionId}"`

---

## 3.6 SaaS Subscription Model

### Plans (prisma/schema.prisma:2683-2687):
| Plan | Features |
|---|---|
| STARTER | Basic listing |
| GROWTH | Enhanced visibility |
| PROFESSIONAL | Premium placement + analytics |

### Supplier Onboarding Includes Subscription Tier:
- `app/api/v1/oliv/onboard-supplier/route.ts:148-153` — `subscriptionTier: "BASIC"` in platformRef
- `lib/fintech/anti-bypass/layer3-crm-attribution.ts:91` — `subscription_tier` field in `reference` block

### Revenue Attribution:
- `lib/fintech/anti-bypass/layer3-crm-attribution.ts:22-26` — Layer 3 mandatory attribution ensures all future factoring deals trace back to HotelsVendors origin
- `prisma/schema.prisma:2103-2104` — `partnerId` and `attributionType` defaults ensure commission pool tracking

---

## 3.7 Revenue Placement in Order Lifecycle

| Order State | Revenue Event | Who Pays | Amount | Code Location |
|---|---|---|---|---|
| Order CREATED (checkout) | Transaction fee calculated (not yet collected) | Hotel | 1.5-2.5% of order total | `lib/fintech/fee-calculator.ts:115` (calculateFullFeeBreakdown) |
| Order CREATED | Fee persisted to invoice record | Hotel | Idempotent: `invoice.platformFee` | `lib/fintech/fee-calculator.ts:206-212` (applyPlatformFees) |
| Order DELIVERED | Invoice created with DRAFT status + platformFee field | Hotel | Same as above | `app/api/v1/orders/[id]/status/route.ts:82-98` |
| Invoice FACTORED | Factoring referral fee obligation calculated | Partner (off-chain) | 0.5% of invoice value | `lib/fintech/hub-revenue.ts:252` |
| Factoring DISBURSED (webhook) | Platform fee extracted from disbursement | Partner (off-chain) | 2% of disbursed amount | `app/api/v1/oliv/payout-callback/route.ts:181` |
| Factoring DISBURSED (webhook) | LedgerEntry created | Platform revenue | 2% of disbursed | `app/api/v1/oliv/payout-callback/route.ts:242-258` |
| KYC ONBOARDING | Subscription tier recorded | Supplier (future) | Plan-based | `app/api/v1/oliv/onboard-supplier/route.ts:148` |

---

## 3.8 Data Model — Revenue Fields

### Invoice Model (prisma/schema.prisma:550-614):
| Field | Type | Default | Purpose |
|---|---|---|---|
| `platformFee` | `Decimal @default(0)` | 0 | Transaction fee amount |
| `platformFeeRate` | `Decimal @default(0)` | 0 | Rate applied (0.025, 0.020, 0.015) |
| `hotelAdminFeeRate` | `Decimal @default(0)` | 0 | Reserved for hotel-level admin fees |
| `hotelAdminFeeAmount` | `Decimal @default(0)` | 0 | Reserved |
| `factoringStatus` | `FactoringStatus @default(NOT_FACTORABLE)` | NOT_FACTORABLE | Tracks factoring eligibility |
| `factoringCompanyId` | `String?` | null | FK to factoring partner |

### FactoringTransaction Model (prisma/schema.prisma:2054-2095):
| Field | Type | Purpose |
|---|---|---|
| `disbursedAmount` | `Decimal?` | Gross amount Oliv sent to supplier |
| `factoringFee` | `Decimal?` | Partner's fee (discount rate × invoice) |
| `advanceRate` | `Decimal?` | e.g. 0.88 |
| `platformFeeRate` | `Decimal?` | Platform's take rate from partner (hardcoded 0.02) |
| `platformFeeAmount` | `Decimal?` | Actual platform fee collected from disbursement |
| `netDisbursement` | `Decimal?` | Amount supplier receives after partner fee |
| `commissionRate` | `Decimal?` | Same as platformFeeRate (redundant field, both 0.02) |
| `commissionAmount` | `Decimal?` | Same as platformFeeAmount |
| `commissionStatus` | `String? @default("PENDING")` | Tracks referral fee payment from partner |

---

## 3.9 G10 Compliance — Hub Revenue Priority

**Rule:** Platform fee is deducted BEFORE factoring partner fee. The hub is always paid first.

### Enforcement Points:
1. **Authority Matrix G10 override:** `lib/auth/authority-matrix.ts:267-274` — forces `requiresPaymentGuarantee` and `requiresEtaValidation` to `true` regardless of DB rules. This ensures the platform controls the payment gate.
2. **Hub Revenue calculation order:** `lib/fintech/hub-revenue.ts:252-255` — `netPlatformFee` is calculated independently (not deducted from anything), the platform fee is invoiced to the partner separately, not subtracted from the supplier's disbursement.
3. **Payout callback fee extraction:** `app/api/v1/oliv/payout-callback/route.ts:181-182` — `platformFee = disbursedAmount × 0.02` is extracted as revenue, not from the supplier's payout but from the partner's obligation.

### Key Principle:
The platform operates on a **revenue-sharing model where fees flow through independent channels**:
- Transaction fees: Hotels pay the platform directly (on order completion)
- Factoring referral fees: Partners owe the platform (invoiced off-chain, reconciled via webhook)
- Document processing fees: Suppliers pay the platform (per ETA submission)
- The platform **never intermediates** the supplier–partner fund transfer<tool_call>write<arg_key>content</arg_key><arg_value># Deliverable 3 — Commission / Revenue Map [CONTINUED]

> Read-only analysis. Every claim cites `file_path:line_number`.

---

## 3.10 Revenue Flow Diagram

```
                    HOTELS
                      │
              ┌───────┴───────┐
              │               │
       Direct Payment    On Credit Terms
              │               │
              ▼               ▼
         Platform          Credit Used
         (1.5-2.5%         (Reserve)
          Transaction Fee)  (lib/credit-gate.ts)
              │               │
              ├───────────────┤
              ▼               ▼
            ORDER COMPLETED → SUPPLIER DELIVERS
                              │
                              ▼
                        Invoice Auto-Created
                 (status: DRAFT, paymentStatus: UNPAID)
                        app/api/v1/orders/[id]/status/route.ts:73-102
                              │
                              ▼
                        ETA Submission
                    app/api/v1/invoices/[id]/eta-submit/route.ts
                              │
                              ▼
                       Supplier Factors Invoice
                     app/api/v1/invoices/[id]/factor/route.ts
                              │
                   ┌──────────┴──────────┐
                   │                     │
              Hub Revenue Calc     Partner Eligibility
     lib/fintech/hub-revenue.ts    lib/fintech/factoring-bridge.ts:139
                   │                     │
                   ▼                     ▼
            Platform Fee         Best Offer Selected
         (2.5% of invoice)      (advance rate, discount rate)
                   │                     │
                   └─────────┬──────────┘
                             ▼
              FactoringRequest Record Created
    app/api/v1/invoices/[id]/factor/route.ts:62-78
                             │
                             ▼
                    Background Job Queues
                     lib/factoring/queue.ts (assumed)
                             │
                             ▼
                Oliv Finance Adapter
         lib/payments/oliv/index.ts:398-427
                             │
                             ▼
                    ┌─────────────────┐
                    │   O L I V       │ ← Pays supplier directly
                    │   Partner       │   (disbursedAmount × advanceRate - factoringFee)
                    └─────────────────┘
                             │
                             ▼
         Webhook: POST /api/v1/oliv/payout-callback
           app/api/v1/oliv/payout-callback/route.ts
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   Platform Fee        FactoringTransaction   LedgerEntry
   (2% of             Record (commissionStatus  (account: REVENUE,
   disbursedAmount)   = PENDING)                entryType: PLATFORM_FEE)
   app/api/v1/                             app/api/v1/oliv/
   oliv/payout-callback/                     payout-callback/
   route.ts:181-212                        route.ts:242-258

                    HotelsVendors RECEIVES:
                    - Transaction Fees (from Hotel, monthly/quarterly)
                    - Referral Fees (from Oliv, off-chain invoicing)
                    - Document Processing Fees (from Supplier, per ETA invoice)
                    - SaaS Subscriptions (from Supplier, monthly)
```

---

## 3.11 Summary of Revenue Placement

| Revenue Stream | Where It's Collected | Where It's Recorded | Frequency |
|---|---|---|---|
| **Transaction Fee** (1.5-2.5%) | Invoiced to Hotel post-order | `Invoice.platformFee` (`prisma/schema.prisma:578`) | Per order |
| **Factoring Referral** (0.5%) | Invoiced to Partner (off-chain) | `FactoringTransaction.commissionAmount` (`prisma/schema.prisma:2084`) | Per factoring deal |
| **Document Processing** (EGP 5) | Charged per ETA submission | (Future: `DocumentProcessing` model, not yet wired in factor route) | Per invoice |
| **Platform Fee from Factoring** (2%) | Extracted from Oliv payout | `FactoringTransaction.platformFeeAmount` (`prisma/schema.prisma:2081`) | Per payout webhook |
| **SaaS Subscriptions** | Monthly billing (future) | `OlivOnboardingAudit` records tier (`prisma/schema.prisma:2112`) | Monthly per supplier |

### Revenue Priority Enforced by G10:
> `lib/fintech/hub-revenue.ts:10-11`: "HotelsVendors' actual revenue comes from: 1. INVO SaaS subscriptions, 2. Document processing fees, 3. Marketplace commission, 4. Factoring partner referral fees"

The platform fee (2% from payout callback at `app/api/v1/oliv/payout-callback/route.ts:181`) is **never deducted from the supplier's disbursement** — the `netDisbursement` field at `prisma/schema.prisma:2082` represents what the supplier receives after the *partner's* fee, not after the platform's fee. The platform's fee is a **separate obligation** tracked in `LedgerEntry` at `app/api/v1/oliv/payout-callback/route.ts:242-258`.

---

*End of Part 3. Next: Part 4 (Scalability Assessment), Part 5 (Friction Points & ROI Fixes).*
