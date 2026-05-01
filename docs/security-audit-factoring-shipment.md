# Security Audit: Factoring-to-Shipment Workflow
## Hotels Vendors — Red Team Analysis
**Date:** 2026-05-01 | **Auditor:** System Integrity Agent | **Status:** CRITICAL FINDINGS IDENTIFIED

---

## 1. WORKFLOW MAP

```
ORDER CONFIRMED
    ↓
[1] Payment Guarantee Gate (authority-matrix.ts)
    ↓
[2] ETA Validation (eta/validator.ts)
    ↓
[3] Factoring Bridge Inquiry (fintech/factoring-bridge.ts)
    ↓
[4] Hub-Revenue Calculation (fintech/hub-revenue.ts)
    ↓
[5] Funding Request (fintech/factoring-bridge.ts)
    ↓
[6] Partner Disbursement (async)
    ↓
[7] Supplier Ships Goods
    ↓
[8] Delivery Confirmation + POD
    ↓
[9] Hotel Pays Invoice (90-day terms)
    ↓
[10] Partner Settlement
```

---

## 2. RACE CONDITIONS IDENTIFIED

### RACE-001: Double-Funding Risk
**Severity:** 🔴 CRITICAL

**Description:** Between step [4] and [5], if two requests arrive simultaneously for the same invoice, both could pass the idempotency check before either marks the key as processed.

**Attack Vector:**
```
Request A: Check idempotency key → VALID (not yet in store)
Request B: Check idempotency key → VALID (not yet in store)
Request A: Process funding
Request B: Process funding (DUPLICATE!)
```

**Mitigation Implemented:**
- `lib/security/idempotency.ts` uses atomic Map operations
- **STILL VULNERABLE:** Map is not atomic across processes. In a multi-instance deployment (Vercel Edge), two instances could process the same key.

**Required Fix:**
- Replace in-memory Map with Redis `SET key value NX EX 60` (atomic set-if-not-exists)
- Or use database-level uniqueness constraint on idempotency keys

**Status:** ⚠️ PARTIALLY MITIGATED — Redis required for production

---

### RACE-002: Status Update Conflicts
**Severity:** 🟡 HIGH

**Description:** Between step [5] and [6], if the partner webhook (step [6]) arrives before the funding response is processed, the invoice status could be overwritten.

**Scenario:**
```
T0: Funding request sent to EFG Hermes
T1: Webhook arrives (disbursement completed)
T2: Original HTTP response arrives (success)
T3: Both try to update Invoice.factoringStatus
```

**Mitigation:**
- Use database-level row locking (`SELECT FOR UPDATE`) when updating invoice status
- Implement state machine transitions (only valid transitions allowed)

**Status:** ⚠️ NOT YET IMPLEMENTED

---

### RACE-003: Concurrent Authority Matrix Evaluation
**Severity:** 🟡 HIGH

**Description:** Two approvers could simultaneously evaluate and approve the same order, bypassing dual-sign-off requirements.

**Scenario:**
```
Approver A: Evaluate → Requires dual auth
Approver B: Evaluate → Requires dual auth
Approver A: Approve → Status = APPROVED (with only 1 signature)
Approver B: Approve → Status = APPROVED (with only 1 signature)
```

**Mitigation:**
- Use `SELECT FOR UPDATE` on Order row during approval
- Check approval count atomically before updating status

**Status:** ⚠️ NOT YET IMPLEMENTED

---

## 3. SECURITY LOOPHOLES IDENTIFIED

### LOOP-001: ETA Validator Bypass
**Severity:** 🔴 CRITICAL

**Description:** The ETA validator (`lib/eta/validator.ts`) makes an API call to the ETA service. If the ETA service is down or returns a false positive, the factoring gate could be bypassed.

**Current Code:**
```typescript
const etaRecord = await etaClient.getInvoice(invoice.etaUuid!);
```

**Vulnerability:**
- If `etaClient.getInvoice` throws an exception, the function returns `ETA_API_ERROR`
- But if `etaClient.getInvoice` is mocked or compromised, it could return a fake valid response
- No certificate pinning or response signature verification

**Mitigation Required:**
1. Implement ETA API response signature verification
2. Use certificate pinning for ETA API
3. Cache ETA validation results with TTL
4. Manual override requires dual admin authorization + audit log

**Status:** 🔴 OPEN

---

### LOOP-002: Factoring Bridge Impersonation
**Severity:** 🔴 CRITICAL

**Description:** The factoring bridge adapters (`lib/fintech/factoring-bridge.ts`) are mock implementations. In production, if an attacker compromises the partner API credentials, they could:
- Return false "eligible" responses
- Redirect disbursement to attacker-controlled bank accounts
- Inflate discount rates

**Current Code:**
```typescript
class EfgHermesAdapter implements FactoringPartnerAdapter {
  // Mock implementation
}
```

**Mitigation Required:**
1. mTLS for all partner API connections
2. HMAC request/response signing
3. Disbursement bank account whitelist (supplier-registered accounts only)
4. Rate limiting on funding requests
5. Daily reconciliation reports

**Status:** 🔴 OPEN (Mock adapters in use)

---

### LOOP-003: Hub-Revenue Calculator Manipulation
**Severity:** 🟡 HIGH

**Description:** The Hub-Revenue Calculator (`lib/fintech/hub-revenue.ts`) calculates platform fees. If an attacker can manipulate the input parameters (hotelTier, riskTier, isCoastal), they could reduce the platform fee.

**Attack Vector:**
```typescript
// Attacker crafts request with:
hotelTier: "PREMIER"  // Gets 50% discount
riskTier: "LOW"       // No surcharge
isCoastal: false      // No surcharge
```

**Mitigation:**
- `hotelTier` and `riskTier` MUST be read from the database, not from user input
- `isCoastal` MUST be computed from delivery address, not user input
- All inputs MUST be validated against database state before calculation

**Status:** 🟡 PARTIALLY MITIGATED (inputs are passed as params, not validated)

---

### LOOP-004: Session Fingerprint Evasion
**Severity:** 🟡 MEDIUM

**Description:** The session fingerprint (`lib/security/session-fingerprint.ts`) uses simple hashing. A determined attacker could:
1. Obtain a valid session token
2. Use the same User-Agent string
3. Use a VPN in the same timezone
4. Match screen resolution

**Current Matching:**
```typescript
if (matchScore < CONFIG.fingerprintTolerance) {
  // Possible hijacking
}
```

**Mitigation Required:**
1. Add behavioral biometrics (typing speed, mouse movement patterns)
2. Use IP geolocation mismatch detection
3. Require re-auth for high-value actions regardless of fingerprint match
4. Track impossible travel (login from Cairo, then Alexandria 5 minutes later)

**Status:** 🟡 PARTIALLY MITIGATED

---

### LOOP-005: AI Hallucination in Smart Fixes
**Severity:** 🟡 MEDIUM

**Description:** The Smart Fix Engine (`lib/fintech/risk-engine.ts`) generates autonomous fixes. While the fixes are rule-based (not LLM-generated), the risk scoring uses weighted factors that could be manipulated if the underlying data is poisoned.

**Vulnerability:**
- If a hotel creates fake "on-time" payments (paying immediately on small invoices), their risk score improves artificially
- Over time, this could lead to higher credit limits and larger fraudulent orders

**Mitigation Required:**
1. Weight order value in risk scoring (large on-time payments > small on-time payments)
2. Require minimum order history (e.g., 10+ orders) before high credit limits
3. Use anomaly detection to flag suspiciously perfect payment history
4. Manual review for any credit limit > 500K EGP

**Status:** 🟡 MITIGATED (minimum history required in some paths)

---

### LOOP-006: Admin Override Audit Gap
**Severity:** 🔴 CRITICAL

**Description:** The admin override function (`lib/auth/authority-matrix.ts`) writes to the audit log AFTER the order is updated. If the audit log write fails, the override is invisible.

**Current Code:**
```typescript
await prisma.order.update({...});  // Step 1
await prisma.auditLog.create({...}); // Step 2 (could fail)
```

**Mitigation Required:**
1. Use database transactions (`$transaction`) to ensure both updates succeed or both fail
2. If audit log fails, ROLLBACK the order update
3. Send alert if audit log write fails (this is a system integrity issue)

**Status:** 🔴 OPEN

---

## 4. RECOMMENDED REMEDIATION PRIORITY

| Priority | Issue | Fix | Effort |
|----------|-------|-----|--------|
| P0 | RACE-001 Double-Funding | Redis atomic idempotency | 2 hours |
| P0 | LOOP-001 ETA Validator Bypass | Response signature verification | 4 hours |
| P0 | LOOP-006 Admin Override Audit Gap | Database transactions | 1 hour |
| P0 | LOOP-002 Factoring Bridge Impersonation | mTLS + HMAC + bank whitelist | 8 hours |
| P1 | RACE-002 Status Update Conflicts | SELECT FOR UPDATE + state machine | 3 hours |
| P1 | RACE-003 Concurrent Authority Matrix | Row locking + atomic approval count | 3 hours |
| P1 | LOOP-003 Hub-Revenue Manipulation | Input validation from DB | 2 hours |
| P2 | LOOP-004 Session Fingerprint Evasion | Behavioral biometrics | 1 day |
| P2 | LOOP-005 AI Data Poisoning | Weighted scoring + minimum history | 4 hours |

---

## 5. SYSTEM INTEGRITY SCORE

| Category | Score | Max |
|----------|-------|-----|
| Financial Controls | 7/10 | 10 |
| Data Integrity | 8/10 | 10 |
| Identity Security | 6/10 | 10 |
| API Security | 5/10 | 10 |
| Race Condition Safety | 4/10 | 10 |
| Audit Immutability | 7/10 | 10 |
| **OVERALL** | **6.2/10** | **10** |

**Target Score:** 9.0/10

---

**End of Audit**
