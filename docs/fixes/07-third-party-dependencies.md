# 07 — Third-Party Dependencies Fixes

**Date:** 2026-07-14  
**Scope:** Critical and High findings from Third-Party/Vendor Risk Audit (06-third-party-audit.md)

---

## Changes Summary

### CRITICAL-1: Duplicate Oliv Adapter Consolidated

**Problem:** Two separate Oliv Finance adapters existed:
- `lib/fintech/oliv-bridge.ts` — FactoringPartnerAdapter implementation (eligibility, instruction submission, tracking)
- `lib/payments/oliv/index.ts` — Invoice factoring with HMAC webhook verification, types, mocks
- `lib/payments/oliv.ts` — Referral URL generators (Phase 1)

**Fix:**
- Consolidated ALL Oliv functionality into `lib/payments/oliv/index.ts` (canonical adapter)
- Added `OlivFinanceAdapter` class implementing `FactoringPartnerAdapter` interface
- Added referral URL generators (`generateOlivCheckoutUrl`, `generateOlivReferralUrl`, etc.)
- `lib/fintech/oliv-bridge.ts` → re-exports from canonical for backward compatibility
- Deleted `lib/payments/oliv.ts` (was causing circular imports)
- All consumers now resolve to single source of truth

**Files modified:**
- `lib/payments/oliv/index.ts` — canonical adapter (consolidated)
- `lib/fintech/oliv-bridge.ts` — re-export shim
- `lib/payments/oliv.ts` — deleted

---

### CRITICAL-2: Duplicate Paymob Adapter Consolidated

**Problem:** Three overlapping Paymob adapters:
- `lib/payments/paymob.ts` — Simple deposit payment (HMAC verification)
- `lib/payments/paymob-escrow.ts` — Marketplace escrow with dual-approver release
- `lib/payments/paymob/index.ts` — Full payment gateway integration

**Fix:**
- Consolidated ALL Paymob functionality into `lib/payments/paymob/index.ts` (canonical adapter)
- Added escrow functions: `createEscrowDeposit`, `releaseEscrowToken`, `getEscrowStatus`
- Added deposit function: `createDepositPayment`
- Added backward-compatible aliases: `getAuthToken`, `generatePaymentKey`, `verifyPaymobCallback`
- `lib/payments/paymob.ts` → re-exports from canonical
- `lib/payments/paymob-escrow.ts` → re-exports from canonical

**Files modified:**
- `lib/payments/paymob/index.ts` — canonical adapter (consolidated)
- `lib/payments/paymob.ts` — re-export shim
- `lib/payments/paymob-escrow.ts` — re-export shim

---

### HIGH: 7 Production Dependencies Moved to devDependencies

**Problem:** Test/build tools were in `dependencies` instead of `devDependencies`, increasing production bundle size and attack surface.

**Packages moved:**
| Package | Reason |
|---------|--------|
| `vitest` | Test runner — dev only |
| `jsdom` | DOM implementation for tests — dev only |
| `@testing-library/jest-dom` | Test matchers — dev only |
| `@testing-library/react` | React testing utilities — dev only |
| `@types/pg` | TypeScript types — build only |
| `@vitejs/plugin-react` | Vite build plugin — dev only |
| `sass` | CSS preprocessor — build only |

**File modified:** `package.json`

---

### HIGH: Unused Packages Assessment

**nodemailer:** KEPT — imported by `lib/email.ts` which is used by `app/api/contact/route.ts`. Not unused.

**Supabase (`@supabase/ssr`, `@supabase/supabase-js`):** KEPT — actively imported by 8 files in `app/api/v1/invo/` and `app/invo/` routes.

---

### HIGH: LGPL License Exposure — Documented Acceptance

**Finding:** 13 LGPL-3.0-or-later packages found in `package-lock.json`, all `@img/sharp-libvips-*` packages.

**Assessment:** These are optional platform-specific native bindings for `sharp` (image processing, Apache-2.0 licensed). They:
- Are marked `optional: true` in the lockfile
- Are dynamically linked shared libraries (not statically linked)
- Are platform-specific (only the matching platform is installed)
- Do NOT create copyleft obligations for the platform

**Decision:** Acceptable risk. LGPL dynamic linking requirement is satisfied. No action needed.

---

### HIGH-6: Webhook IP Whitelisting Implemented

**Problem:** Callback/webhook endpoints accepted requests from any IP.

**Fix:**
- Created `lib/security/webhook-whitelist.ts` with CIDR-based IP validation
- Configured IP ranges for: Paymob, Fawry, Oliv, InstaPay, ETA, Generic
- Applied IP whitelisting to all webhook routes:
  - `app/api/v1/payments/paymob-callback/route.ts`
  - `app/api/v1/fintech/oliv-callback/route.ts`
  - `app/api/webhooks/payments/oliv/route.ts`
  - `app/api/webhooks/inventory/generic/route.ts`
- Development mode (`NODE_ENV !== "production"`) allows all IPs for local testing
- Production mode enforces strict IP validation

**Files created:**
- `lib/security/webhook-whitelist.ts`

**Files modified:**
- `app/api/v1/payments/paymob-callback/route.ts`
- `app/api/v1/fintech/oliv-callback/route.ts`
- `app/api/webhooks/payments/oliv/route.ts`
- `app/api/webhooks/inventory/generic/route.ts`

---

### HIGH-7: Callback Replay Protection Implemented

**Problem:** Webhook callbacks lacked idempotency checks, leaving the door open to replay attacks.

**Fix:**
- Created `lib/security/webhook-idempotency.ts` with provider-specific event ID generators
- Uses existing Redis idempotency infrastructure (`lib/redis.ts`) with 72-hour TTL
- Applied replay protection to:
  - Paymob callback: generates event ID from `transactionId_created_at`
  - Oliv callback: generates event ID from `factoringRequestId_timestamp`
- Duplicate webhooks return `success({ duplicate: true })` without reprocessing

**Files created:**
- `lib/security/webhook-idempotency.ts`

**Files modified:**
- `app/api/v1/payments/paymob-callback/route.ts`
- `app/api/v1/fintech/oliv-callback/route.ts`

---

## Files Changed Summary

| File | Action |
|------|--------|
| `lib/payments/oliv/index.ts` | Consolidated canonical Oliv adapter |
| `lib/payments/oliv.ts` | Deleted (circular import source) |
| `lib/fintech/oliv-bridge.ts` | Re-export shim |
| `lib/payments/paymob/index.ts` | Consolidated canonical Paymob adapter |
| `lib/payments/paymob.ts` | Re-export shim |
| `lib/payments/paymob-escrow.ts` | Re-export shim |
| `lib/security/webhook-whitelist.ts` | NEW — IP whitelisting |
| `lib/security/webhook-idempotency.ts` | NEW — Replay protection |
| `package.json` | Moved 7 packages to devDependencies |
| `app/api/v1/payments/paymob-callback/route.ts` | Added IP whitelist + replay protection |
| `app/api/v1/fintech/oliv-callback/route.ts` | Added IP whitelist + replay protection |
| `app/api/webhooks/payments/oliv/route.ts` | Added IP whitelist + tenantId fix |
| `app/api/webhooks/inventory/generic/route.ts` | Added IP whitelist |

## Verification

- TypeScript compilation: PASS (no new errors beyond pre-existing Next.js type issues)
- All import paths verified: `@/lib/payments/oliv`, `@/lib/payments/paymob`, `@/lib/fintech/oliv-bridge` resolve correctly
- No circular imports detected
