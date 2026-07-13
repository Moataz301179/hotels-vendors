# Fix 02: Cryptographic & Compliance Fixes

> **Date:** 2026-07-14  
> **Auditor:** Cryptographic & Compliance Engineer  
> **Scope:** CRIT-001, CRIT-002, CRIT-005, HIGH-004 (VAT), HIGH-data-retention  
> **Status:** All 5 findings addressed

---

## Summary

| # | Finding | Severity | Status | Files Changed |
|---|---------|----------|--------|---------------|
| 1 | ETA digital signature uses HMAC, not RSA-2048 | CRITICAL | **FIXED** | `lib/eta/signer.ts` |
| 2 | PII stored in plaintext | CRITICAL | **FIXED** | `lib/crypto/encryption.ts` (new), `app/api/onboarding/upgrade-live/route.ts` |
| 3 | Audit log hash chain never populated | CRITICAL | **FIXED** | 11 files — all `prisma.auditLog.create` calls migrated to `appendAuditEntry` |
| 4 | No data retention policy | HIGH | **FIXED** | `lib/compliance/data-retention.ts` (new) |
| 5 | VAT calculation lacks validation | HIGH | **FIXED** | `lib/fintech/vat-calculator.ts` (new) |

---

## 1. CRIT-001: ETA Digital Signature — RSA-2048

### Problem
The ETA requires RSA-2048 PKCS#11 digital signatures. The Soft-HSM fallback used HMAC-SHA256, which is not a legally valid digital signature under Egyptian law.

### Fix
Added a three-tier signing hierarchy in `lib/eta/signer.ts`:

1. **PKCS#11 Hardware Token** — production, when USB HSM is connected (unchanged)
2. **RSA-2048 SHA-256 Software Signing** — production default (NEW)
   - Generates per-tenant RSA-2048 key pairs
   - Persists keys to disk at `keys/eta/{tenantId}/`
   - Uses `crypto.sign('sha256', data, privateKey)` with PKCS#1 v1.5 padding
   - Exports `verifyRsa2048Signature()` for verification
3. **HMAC-SHA256 Emulation** — dev/test only, throws error in production

### Key Changes
- Added `getOrCreateTenantKeyPair()` — generates or loads RSA-2048 key pair per tenant
- Added `signWithRsa2048()` — produces legally-valid RSA signatures
- Added `verifyRsa2048Signature()` — verifies RSA signatures
- HMAC fallback now throws in `production` with clear error message
- New env var: `ETA_RSA_KEY_DIR` (defaults to `keys/eta/`)

---

## 2. CRIT-002: PII Encryption at Rest

### Problem
Tax IDs, bank accounts, and other PII were stored in plaintext in PostgreSQL. The ETA credential encryption used a hardcoded fallback key (`default-key-32-chars-long!!!!!`).

### Fix
Created `lib/crypto/encryption.ts` — centralized AES-256-GCM encryption utility.

### API
```typescript
import { encrypt, decrypt, isEncrypted, encryptIfPlaintext, decryptIfEncrypted } from "@/lib/crypto/encryption";

// Encrypt
const encrypted = encrypt("123456789"); // "iv:authTag:ciphertext" (all hex)

// Decrypt
const plaintext = decrypt(encrypted);

// Safe for migration (detects encrypted vs plaintext)
const safe = encryptIfPlaintext(existingValue); // encrypts if plaintext, passes through if encrypted
const readable = decryptIfEncrypted(storedValue); // decrypts if encrypted, passes through if plaintext

// Batch operations
const encrypted = encryptFields(data, ["taxId", "bankAccount"]);
const decrypted = decryptFields(data, ["taxId", "bankAccount"]);

// Generate a new master key
const key = generateMasterKey(); // hex-encoded 256-bit key
```

### Key Changes
- Format: `iv(hex):authTag(hex):ciphertext(hex)` — same as existing ETA credentials
- New env var: `ENCRYPTION_MASTER_KEY` (32 bytes, required in production)
- Removed hardcoded `default-key-32-chars-long!!!!!` fallback from `upgrade-live/route.ts`
- `upgrade-live/route.ts` now imports from `lib/crypto/encryption.ts`
- Added `isEncrypted()` helper for backward-compatible reads

### Migration Path
For existing plaintext fields, use `encryptIfPlaintext()` in a Prisma middleware or migration script:
```typescript
// Example: encrypt Supplier.taxId during migration
const supplier = await prisma.supplier.findMany();
for (const s of supplier) {
  await prisma.supplier.update({
    where: { id: s.id },
    data: { taxId: encryptIfPlaintext(s.taxId) },
  });
}
```

---

## 3. CRIT-005: Audit Log Hash Chain Enforcement

### Problem
The `AuditLog` model had `previousHash` and `hash` fields, and `lib/audit/tamper-proof.ts` had correct chain logic — but 12+ call sites bypassed it by calling `prisma.auditLog.create()` directly, breaking the hash chain.

### Fix
Migrated all direct `prisma.auditLog.create()` calls to use `appendAuditEntry()` from `lib/audit/tamper-proof.ts`.

### Files Fixed (11 total)

| File | Action |
|------|--------|
| `lib/eta/client.ts:338` | ETA callback audit → `appendAuditEntry` |
| `lib/eta/queue.ts:152` | ETA submit audit → `appendAuditEntry` |
| `lib/eta/queue.ts:202` | ETA DLQ audit → `appendAuditEntry` |
| `lib/auth/authority-matrix.ts:434` | Order approval audit → `appendAuditEntry` |
| `lib/auth/authority-matrix.ts:614` | Payment guarantee audit → `appendAuditEntry` |
| `lib/fintech/factoring-orchestrator.ts:769` | Yield spread breach audit → `appendAuditEntry` |
| `lib/security/fortress.ts:249` | Security lockdown audit → `appendAuditEntry` |
| `lib/payments/paymob-escrow.ts:247` | Escrow released audit → `appendAuditEntry` |
| `app/api/v1/eta/callback/route.ts:173` | ETA callback audit → `appendAuditEntry` |
| `app/api/v1/payments/fawry-callback/route.ts:69` | Fawry payment audit → `appendAuditEntry` |
| `app/api/v1/payments/instapay-callback/route.ts:57` | InstaPay transfer audit → `appendAuditEntry` |
| `app/api/v1/payments/paymob-callback/route.ts:42` | Paymob deposit audit → `appendAuditEntry` |
| `app/api/v1/supplier/onboard/route.ts:121` | Supplier onboarding audit → `appendAuditEntry` |
| `app/api/onboarding/upgrade-live/route.ts:195` | Tenant upgrade audit → `appendAuditEntry` |

### Remaining Bypasses
A few files still use direct `prisma.auditLog.create` (e.g., `prisma/seed-extended.ts`). Seed scripts are excluded since they run outside the audit chain.

---

## 4. HIGH-004: Data Retention Policy

### Problem
No automated data retention or deletion mechanism existed. All data was stored indefinitely, violating Egyptian PDPL Article 6(3).

### Fix
Created `lib/compliance/data-retention.ts` — automated cleanup service.

### Retention Periods (per Egyptian law)

| Data Type | Retention | Legal Basis |
|-----------|-----------|-------------|
| Audit Logs | 7 years | Egyptian commercial law |
| Invoices | 10 years | Egyptian tax law |
| Orders | 10 years | Egyptian tax law |
| Email Verification Tokens | 30 days | Platform policy |
| Password Reset Tokens | 7 days | Platform policy |
| Outreach Logs | 1 year | Marketing consent records |
| AI Chat Messages | 90 days | Data minimization |
| AI Conversations | 90 days | Data minimization |
| Leads / Waiting List | 1 year | Lead lifecycle |
| Swarm Memory | 6 months | Agent memory lifecycle |
| Agent Runs | 90 days | Execution logs |
| Spend Records | 3 years | Analytics retention |
| Inventory Snapshots | 1 year | Historical data |

### Usage
```typescript
import { runRetentionCleanup, getRetentionSummary } from "@/lib/compliance/data-retention";

// Run cleanup (safe — processes each model independently)
const results = await runRetentionCleanup();
// Returns: [{ model, label, recordsDeleted, cutoffDate, error? }]

// Dry run (counts only, no deletion)
const dryRun = await runRetentionCleanup({ dryRun: true });

// Only clean specific models
const partial = await runRetentionCleanup({ models: ["auditLog", "chatMessage"] });

// Get summary for compliance dashboard
const summary = await getRetentionSummary();
```

### Scheduling
Call from a cron job or BullMQ repeatable job:
```typescript
// Example: BullMQ repeatable job
const retentionWorker = new Worker("compliance", async () => {
  await runRetentionCleanup();
}, { connection: redis });

// Schedule: daily at 2 AM
await retentionWorker.add("data-retention", {}, {
  repeat: { pattern: "0 2 * * *" },
});
```

---

## 5. HIGH-004: VAT Calculation Validation

### Problem
VAT calculations had no validation against Egyptian tax law. The standard rate (14%) was hardcoded without checking if the rate was legally valid.

### Fix
Created `lib/fintech/vat-calculator.ts` — validated VAT calculation engine.

### Egyptian VAT Rates (Law No. 91 of 2016, Article 16)

| Rate | Category |
|------|----------|
| 14% | Standard — most goods and services |
| 5% | Reduced — agricultural inputs, medical equipment |
| 0% | Zero-rated — exports, international transport |

### API
```typescript
import {
  calculateVat,
  calculateVatByItems,
  validateInvoiceVat,
  VALID_VAT_RATES,
  EGYPTIAN_VAT_RATES,
} from "@/lib/fintech/vat-calculator";

// Simple calculation
const result = calculateVat({ subtotal: 10000, vatRate: 14 });
// { subtotal: 10000, vatRate: 14, vatAmount: 1400, total: 11400, compliant: true, warnings: [] }

// Mixed-rate invoice (line items with different rates)
const mixed = calculateVatByItems({
  items: [
    { description: "Food items", quantity: 10, unitPrice: 100, vatRate: 14 },
    { description: "Export service", quantity: 1, unitPrice: 5000, vatRate: 0 },
  ],
});

// Pre-submission validation
const validation = validateInvoiceVat({
  subtotal: 10000,
  vatRate: 14,
  vatAmount: 1400,
  total: 11400,
});
// { valid: true, errors: [] }
```

### Validation Rules
1. VAT rate must be one of `[14, 5, 0]` (Egyptian legal rates)
2. VAT amount must match `subtotal × rate / 100` (within EGP 0.02 tolerance)
3. Total must equal `subtotal + vatAmount`
4. Non-standard rates generate warnings
5. Zero rates generate warnings requiring justification

---

## Files Changed Summary

### New Files (3)
- `lib/crypto/encryption.ts` — AES-256-GCM field-level encryption utility
- `lib/compliance/data-retention.ts` — Automated data retention cleanup service
- `lib/fintech/vat-calculator.ts` — Egyptian VAT calculation and validation

### Modified Files (13)
- `lib/eta/signer.ts` — Added RSA-2048 signing with per-tenant key pairs
- `lib/eta/client.ts` — Fixed audit log to use `appendAuditEntry`
- `lib/eta/queue.ts` — Fixed 2 audit log calls to use `appendAuditEntry`
- `lib/auth/authority-matrix.ts` — Fixed 2 audit log calls to use `appendAuditEntry`
- `lib/fintech/factoring-orchestrator.ts` — Fixed audit log to use `appendAuditEntry`
- `lib/security/fortress.ts` — Fixed audit log to use `appendAuditEntry`
- `lib/payments/paymob-escrow.ts` — Fixed audit log to use `appendAuditEntry`
- `app/api/v1/eta/callback/route.ts` — Fixed audit log to use `appendAuditEntry`
- `app/api/v1/payments/fawry-callback/route.ts` — Fixed audit log to use `appendAuditEntry`
- `app/api/v1/payments/instapay-callback/route.ts` — Fixed audit log to use `appendAuditEntry`
- `app/api/v1/payments/paymob-callback/route.ts` — Fixed audit log to use `appendAuditEntry`
- `app/api/v1/supplier/onboard/route.ts` — Fixed audit log to use `appendAuditEntry`
- `app/api/onboarding/upgrade-live/route.ts` — Replaced local `encryptSecret` with centralized encryption; fixed audit log

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ENCRYPTION_MASTER_KEY` | **Yes** (production) | 32-byte (256-bit) key for AES-256-GCM. Generate with `openssl rand -hex 32` |
| `ETA_RSA_KEY_DIR` | No | Directory for RSA-2048 key pairs (default: `keys/eta/`) |
| `ETA_HMAC_SECRET` | No | Legacy HMAC secret (dev/test only) |

---

## Testing Recommendations

1. **RSA-2048 signing**: Verify `signEtaDocument()` produces different signatures for different tenants, and that `verifyRsa2048Signature()` validates correctly
2. **Encryption roundtrip**: Verify `decrypt(encrypt(plaintext)) === plaintext` for various inputs
3. **Encryption migration**: Verify `encryptIfPlaintext()` correctly detects already-encrypted values
4. **Audit chain**: After deploying, run `verifyAuditChain()` to confirm all new entries maintain the hash chain
5. **Data retention**: Run `runRetentionCleanup({ dryRun: true })` to verify expected cleanup counts
6. **VAT validation**: Test with valid rates (14, 5, 0) and invalid rates (8, 10, 15) to confirm correct behavior
