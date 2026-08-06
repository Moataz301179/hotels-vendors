# Deliverable 5 — Friction Points & ROI Fixes

> Read-only analysis. Every claim cites `file_path:line_number`.

---

## 5.1 Critical Friction Points

### F1. Inconsistent Platform Fee Rates (Critical)

**Problem:** Three different platform fee rates exist in production code with no documented reason for the discrepancy.

| Location | Rate | Context |
|---|---|---|
| `lib/fintech/hub-revenue.ts:251` | 2.5% | `calculateHubRevenue()` — hub revenue calculator |
| `lib/fintech/fee-calculator.ts:43` | 2.5% (CORE tier) | `calculatePlatformFee()` — transaction fee per hotel tier |
| `app/api/v1/oliv/payout-callback/route.ts:181` | 2% | Extracted from Oliv disbursement webhook |

**Impact:** At scale, this creates revenue leakage. A 100K EGP invoice:
- Fee calculator says: 2,500 EGP (2.5%)
- Payout callback says: 2,000 EGP (2%)
- **Gap: 500 EGP per transaction**

If the platform processes 1,000 factored invoices/month at 100K EGP average:
- **Monthly revenue gap: ~500,000 EGP**
- **Annual revenue gap: ~6 million EGP**

**Root cause:** The 2% in payout callback is a hardcoded constant (`app/api/v1/oliv/payout-callback/route.ts:203` — `platformFeeRate: 0.02`), while the fee calculator uses tier-based rates. The hub-revenue function and payout callback don't share the same rate source.

**Fix:** Extract platform fee rate into a single source of truth — a `RateConfig` table in Prisma, looked up by `tenant.industryType + hotelTier`. All three locations should call `getPlatformFeeRate(hotelTier)` instead of hardcoding.

### F2. ETA Sandbox-Only UUIDs Block Factoring (Critical)

**Problem:** The ETA client targets a sandbox endpoint, and the queue worker generates fake UUIDs. The validator accepts these, but they're **not real compliance**. If a hotel CFO demands real ETA-compliant invoices, the system cannot provide them without a production ETA integration.

- `lib/eta/client.ts:5` — "This is a SIMULATED ETA integration. It targets the ETA preprod/sandbox endpoint"
- `lib/eta/client.ts:27` — `baseUrl: "https://api.preprod.invoicing.eta.gov.eg"` (preprod, not production)
- `lib/eta/queue.ts:5` — "This queue processes SIMULATED ETA submissions. UUIDs are fake."
- `lib/eta/queue.ts:148-152` — worker sets `etaStatus: "ACCEPTED"` and `etaUuid: result.uuid` from sandbox response
- G10 gate requires valid ETA UUID (`lib/eta/validator.ts:52-58`): "Invoice has no ETA UUID. Submit to ETA before factoring."

**Impact:** The entire factoring pipeline is blocked by a compliance gate that depends on a non-production ETA integration. This is a **go-live blocker**.

**Fix Priority:** HIGH — must be resolved before any production factoring. Steps:
1. Obtain production ETA credentials (client ID, secret, private key, registration number)
2. Switch `ETA_CONFIG.environment` from `"sandbox"` to `"production"` (`lib/eta/client.ts:35`)
3. Point `baseURL` to production endpoint (`lib/eta/client.ts:27`)
4. Remove sandbox-only mock UUID generation from `lib/eta/queue.ts:142`
5. Add real digital signature verification for production responses

### F3. Smart Fix High-Risk Factoring Partner Never Registered (High)

**Problem:** The risk engine generates a `HIGH_RISK_FACTORING` smart fix for HIGH-tier hotels, but the eligible partners list is hardcoded to empty:

- `lib/fintech/risk-engine.ts:305` — `eligiblePartners: []` with comment: "TODO: Register high-risk factoring partners in factoring-bridge before enabling"

**Impact:** Hotels rated HIGH risk (composite score 51-75) that are blocked by the payment guarantee gate cannot proceed through standard factoring. The smart fix is offered but has zero partners to route to. This means **HIGH-risk hotels are deadlocked** unless they accept the 20% deposit alternative.

**Fix:** Register at least one high-risk factoring partner adapter in `lib/fintech/factoring-bridge.ts:118-121`. The `OlivFinanceAdapter` already has a `highRiskAdvanceRate` and `highRiskDiscountRate` config (`lib/payments/oliv/index.ts:358-360`): 82% advance, 3.5% rate. The adapter just needs to be exposed with a `type: "HIGH_RISK"` flag.

### F4. Revenue Discrepancy Between Transparency and Actual Collection (Medium)

**Problem:** The `calculateHubRevenue()` function in `lib/fintech/hub-revenue.ts:241-268` uses a 2.5% platform fee rate (`lib/fintech/hub-revenue.ts:251`), but the payout callback records 2% (`app/api/v1/oliv/payout-callback/route.ts:203`). The transparency breakdown shown to suppliers (`calculateFactoringBreakdown` at `lib/fintech/hub-revenue.ts:53-91`) doesn't actually deduct the platform fee — it's purely informational.

- `lib/fintech/hub-revenue.ts:7` — "HotelsVendors does NOT collect fees from factoring disbursements"
- `lib/fintech/hub-revenue.ts:14` — "Factoring partner referral fees (invoiced to partners off-chain)"
- `lib/fintech/hub-revenue.ts:266` — `note: "Platform does not deduct from disbursement. Partner collects their own fee."`

**Impact:** The 0.5% referral fee from `fee-calculator.ts` (`lib/fintech/fee-calculator.ts:48`) is separate from the 2% collected from Oliv. The platform earns both, but they're tracked in different systems with no reconciliation.

**Fix:** Unify the fee calculation. The 0.5% factoring referral fee should be invoiced to Oliv as a separate line item, tracked in `FactoringTransaction.commissionStatus` (`prisma/schema.prisma:2072`). Add a monthly reconciliation report that cross-references:
- Fees calculated by `fee-calculator.ts` (0.5% referral)
- Fees collected by `payout-callback` (2% platform fee)
- Fee expected by `hub-revenue.ts` (2.5%)

### F5. Double Schema Conflict — Shadow Types vs. Prisma (Medium)

**Problem:** `types/database.ts` contains a Supabase-style schema (`types/database.ts:40-1411`) with fields that don't exist in the active Prisma schema:

| Field | In Shadow Types | In Prisma |
|---|---|---|
| `industry_type` (on `users`) | ✅ `types/database.ts:50` | ❌ Missing |
| `default_take_rate` (on `platform_config`) | ✅ `types/database.ts:1186` | ❌ Table doesn't exist |
| `tenant_type` (on `users`) | ✅ `types/database.ts:51` | ✅ Via enum `TenantType` |

**Impact:** Developers may write code against `types/database.ts` fields that don't exist in the database. Any code that references `industry_type` will compile but fail at runtime. This will **block multi-industry expansion** since the shadow types suggest industry support that doesn't exist.

**Fix:** Either:
1. **Migrate** the shadow types into Prisma schema (add `industryType` to `Tenant` model, create `PlatformConfig` model) and regenerate types
2. **Remove** `types/database.ts` and ensure all code uses Prisma-generated types via `prisma/schema.prisma`

---

## 5.2 Medium Friction Points

### F6. Mobile App Missing Factoring & Logistics Roles (Medium)

- `mobile/app/(auth)/RegisterScreen.tsx:12` — role type is `'hotel' | 'supplier'` only
- `mobile/app/(auth)/OnboardingGatewayScreen.tsx:21,29` — only two role cards
- FACTORING companies must use web registration (`app/(auth)/register/page.tsx:224-326`), adding friction for suppliers who want to become factoring partners

**ROI Impact:** Limits the funnel for new factoring partners. A supplier who discovers factoring through the mobile app must switch to web, breaking the user journey.

**Fix:** Add factoring and logistics role cards to `OnboardingGatewayScreen.tsx`, update `RegisterScreen.tsx` role type, and handle the new roles in the existing `/api/v1/auth/register` endpoint.

### F7. VAT Hardcoded at 14% (Medium)

- `app/api/v1/checkout/route.ts:122` — `const vatAmount = subtotal * 0.14`
- `lib/eta/queue.ts:132` and `lib/eta/queue.ts:137` — same 0.14 hardcoded in ETA payload
- `app/api/v1/orders/[id]/status/route.ts:92-93` — `vatRate: 0.14` hardcoded in invoice creation

**Impact:** Cannot expand to other countries with different VAT rates. Cannot handle VAT-exempt or zero-rated transactions. Cannot handle mixed-rate line items (some products taxed, some not).

**Fix:** Add `vatRate` field to `Tenant` model (defaulting to 0.14 for Egypt). Use `tenant.vatRate` in all calculations instead of hardcoding `0.14`.

### F8. Credit Release Never Automated (Medium)

- `lib/credit-gate.ts:68-91` — `releaseCredit()` exists but is only called manually
- The risk engine tracks `totalExposure` but credit is never released when invoices are paid
- `lib/fintech/risk-engine.ts:462-552` — `getLiquidityMonitorData()` calculates platform revenue YTD using `inv.total * 0.015` hardcoded (`lib/fintech/risk-engine.ts:529`), not the actual `platformFeeRate` from the invoice

**Impact:** Hotel credit limits are consumed but never replenished automatically, leading to unnecessary credit limit exhaustion and blocked orders.

**Fix:** Trigger `releaseCredit()` when `invoice.paymentStatus` transitions to `PAID` or `FACTORED`. Use `invoice.platformFeeRate` instead of hardcoded 0.015.

### F9. No Automated Factoring Request Tracking (Medium)

- `lib/fintech/risk-engine.ts:492-508` — "Active requests: invoices with OFFERED or ACCEPTED factoring status"
- But there's no background job that polls `olivFinanceAdapter.trackInstruction()` for status updates
- `lib/payments/oliv/index.ts:230-245` — `pollFactoringStatus()` exists but is never called by any queue worker
- The factoring status only updates via webhook at `app/api/v1/oliv/payout-callback/route.ts`

**Impact:** If Oliv doesn't send a webhook, the factoring status stays at `ACCEPTED` indefinitely, and the supplier dashboard shows the wrong state.

**Fix:** Create a `factoring-monitor` BullMQ queue worker that periodically calls `trackFactoringInstruction()` for all `ACCEPTED` factoring requests that haven't had status updates in >24 hours.

---

## 5.3 Low Friction Points

### F10. Duplicate Field Names (Low)
- `lib/fintech/hub-revenue.ts:232-237` — `HubRevenueResult` has both `platformFee` and `netPlatformFee` with identical values (`lib/fintech/hub-revenue.ts:259-260`):
  ```typescript
  platformFee: netPlatformFee,  // Same value
  netPlatformFee,
  ```
- `prisma/schema.prisma:2078-2084` — `FactoringTransaction` has both `platformFeeAmount` AND `commissionAmount` (same value: `app/api/v1/oliv/payout-callback/route.ts:209` where `commissionAmount: platformFee`)

**Fix:** Consolidate duplicate fields. Use `platformFee` consistently. Remove `netPlatformFee` alias and `commissionAmount` (or make it a computed view, not a stored column).

### F11. Referral Token Expiration Too Long (Low)
- `lib/fintech/anti-bypass/layer1-referral-token.ts:59` — `expiresAt` set to **365 days** from generation
- `lib/fintech/anti-bypass/layer1-referral-token.ts:103-104` — verification checks `if (new Date(token.expiresAt) < new Date())`

**Impact:** A leaked referral token remains valid for a full year. While the HMAC signature prevents forgery, a stolen token could be replayed within its 365-day validity window.

**Fix:** Reduce to 7 days (`new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)`). Factoring workflows complete within 48-72 hours, so 7 days is more than sufficient.

### F12. Self-Approval Guard Not Applied at Checkout (Low)
- `app/api/v1/orders/[id]/approve/route.ts:31-33` — Self-approval is blocked: "You cannot approve or reject your own order"
- But `app/api/v1/checkout/route.ts:261-268` — Authority Matrix evaluation runs **immediately at checkout** with `userRole: "DEPARTMENT_HEAD"` or `"OWNER"`, and `rule_auto_approve` (`lib/auth/authority-matrix.ts:162-173`) can auto-approve orders < 50K EGP from LOW-risk hotels
- This means the order *requester* can create an order AND have it auto-approved by the same authority evaluation

**Impact:** The self-approval guard is bypassed for low-value, low-risk orders through the auto-approve path.

**Fix:** Pass the requesting user's ID to `evaluateAuthority()` and skip `AUTO_APPROVE` when the requester matches the evaluator. Alternatively, require explicit approval even for auto-approve-eligible orders if the requester is the same person.

### F13. Hardcoded Payment Terms at ETA Queue (Low)
- `lib/eta/queue.ts:115` — `payment: { terms: "Net 30" }` hardcoded in ETA payload
- The invoice's actual payment terms (set per-hotel during negotiation) are ignored

**Fix:** Read `invoice.paymentTermsDays` (if added to schema) and use it in the ETA payload instead of hardcoding `"Net 30"`.

---

## 5.4 ROI Priority Matrix

| Friction # | Description | Severity | ROI Impact | Effort | Priority |
|---|---|---|---|---|---|
| F1 | Fee rate inconsistency (0.5%/2%/2.5%) | Critical | 6M EGP/year revenue gap | Medium | **P0** |
| F2 | ETA sandbox-only blocking factoring | Critical | Complete go-live blocker | High | **P0** |
| F3 | High-risk factoring partner not registered | High | Deadlocks HIGH-risk hotel orders | Low | **P1** |
| F4 | Revenue discrepancy: transparency vs. collection | Medium | Unreconciled revenue streams | Medium | **P1** |
| F5 | Shadow schema vs. Prisma conflict | Medium | Blocks multi-industry expansion | High | **P1** |
| F6 | Mobile app missing factoring/logistics roles | Medium | Limits factoring partner funnel | Low | **P2** |
| F7 | VAT hardcoded at 14% | Medium | Blocks geo expansion | Medium | **P2** |
| F8 | Credit release never automated | Medium | Unnecessary credit exhaustion | Medium | **P2** |
| F9 | No automated factoring tracking | Medium | Stale supplier dashboard | Medium | **P2** |
| F10 | Duplicate field names | Low | Code confusion | Low | **P3** |
| F11 | Referral token 365-day expiry | Low | Security hygiene | Trivial | **P3** |
| F12 | Auto-approve bypasses self-approval guard | Low | Governance gap | Low | **P3** |
| F13 | Hardcoded Net 30 payment terms | Low | Inaccurate ETA submissions | Trivial | **P3** |

---

## 5.5 Recommended Fix Sequence

### Immediate (P0 — Fix Before Go-Live)
1. **Resolve ETA sandbox issue** (F2): Switch to production ETA credentials, remove mock UUIDs from queue
2. **Fix fee rate inconsistency** (F1): Unify on a single rate source — the `fee-calculator.ts` tier-based rates

### Short-Term (P1 — Next Sprint)
3. **Register high-risk factoring partner** (F3): Expose Oliv's high-risk config in the adapter registry
4. **Reconcile shadow schema** (F5): Choose Prisma as source of truth, migrate or delete `types/database.ts`
5. **Fix revenue tracking** (F4): Add monthly reconciliation report linking fee-calculator + payout-callback + hub-revenue

### Medium-Term (P2 — Next Quarter)
6. **Add VAT per-tenant config** (F7): Move 0.14 to `Tenant.vatRate` field
7. **Automate credit release** (F8): Trigger `releaseCredit()` on invoice paymentStatus = PAID
8. **Add factoring status polling** (F9): Background worker for `trackFactoringInstruction()`
9. **Mobile app role expansion** (F6): Add factoring/logistics to mobile registration

### Housekeeping (P3 — Tech Debt)
10. **Consolidate duplicate fields** (F10), reduce token expiry (F11), fix self-approval bypass (F12), parameterize payment terms (F13)

---

*End of Deliverable 5 — full analysis complete.*