# 03 — Privacy & Data Protection Fixes

> **Date:** 2026-07-14  
> **Auditor:** Privacy & Data Protection Engineer  
> **Scope:** Findings C1, C2, C3, H2, H3, H4 from `docs/audits/05-privacy-audit.md`

---

## Changes Summary

### 1. CRITICAL: Consent Mechanisms (C1)

**Files changed:**
- `prisma/schema.prisma` — Added `marketingConsent`, `termsAcceptedAt`, `privacyPolicyVersion` fields to `User` model
- `lib/zod.ts` — Added `marketingConsent` (boolean) and `termsAccepted` (literal `true`) to `BusinessRegisterSchema`
- `app/api/v1/auth/register/route.ts` — Stores consent fields on user creation
- `app/(auth)/register/page.tsx` — Added Terms/Privacy Policy checkbox (required) and marketing consent checkbox (optional)

**PDPL Articles addressed:** Art. 5, 6, 13

### 2. CRITICAL: Data Subject Rights Endpoints (C2)

**Files created:**
- `app/api/v1/user/data-export/route.ts` — GET endpoint returns all user PII as JSON (PDPL Art. 14)
- `app/api/v1/user/data-deletion/route.ts` — POST endpoint soft-deletes user, anonymizes PII (PDPL Art. 15)
- `app/api/v1/user/data-rectification/route.ts` — PUT endpoint allows updating name, phone, company, marketing consent (PDPL Art. 16)
- `app/api/v1/user/consent/route.ts` — POST endpoint logs cookie consent server-side

**All endpoints enforce:**
- Authentication via `authenticate()` (JWT session)
- Tenant scoping via `tenantWhereClause`
- Audit logging with before/after state snapshots
- Zod validation on all inputs

### 3. CRITICAL: Data Retention Policy (C3)

**File created:**
- `lib/compliance/data-retention.ts` — Configurable retention periods and `cleanupExpiredData()` function

**Retention periods:**
| Category | Period | Rationale |
|---|---|---|
| AuditLog | 7 years | Financial compliance |
| Sessions | 30 days | Security best practice |
| Analytics / AI Conversations | 90 days | Data minimization |
| Soft-deleted users | 30 days then purge | PDPL Art. 15 |
| Email verification tokens | 24 hours | Transient |
| Password reset tokens | 24 hours | Transient |
| Outreach logs | 2 years | Marketing compliance |
| Swarm jobs / Agent runs | 90 days | Operational |

**Usage:** Call `cleanupExpiredData()` via cron job or BullMQ scheduled job.

### 4. HIGH: Cookie Consent Banner (H2)

**Files created:**
- `components/shared/cookie-consent.tsx` — Full cookie consent banner with categories (Necessary, Analytics, Marketing)
  - Stores consent in localStorage + sends to server
  - `hasAnalyticsConsent()` and `hasMarketingConsent()` helper functions for conditional script loading
  - Version-tracked — re-prompts if policy version changes
  - Reject All / Accept Selected / Accept All options

### 5. HIGH: Seed Data Anonymization (H3)

**Files changed:**
- `prisma/seed.ts` — All realistic Egyptian names replaced with obviously fake test data:
  - `Nile Grand Hotel` → `Hotel Test Alpha`
  - `Omar El-Sayed` → `Hotel Test User`
  - `hotel.owner@nilegrand.com` → `hotel-test@test.hotelsvendors.com`
  - All tax IDs use `TEST-xxx-xxx` prefix
  - Added `⚠️ DEVELOPMENT ONLY` header comment
- `lib/seed.ts` — All demo organization and user names replaced with test-only identifiers:
  - `Nile Ritz Collection` → `Hotel Test Alpha (Dev)`
  - `Layla Hassan` → `Hotel Test User`
  - `hotel@hotelsvendors.demo` → `hotel-test@test.hotelsvendors.demo`

### 6. HIGH: Audit Log IP Pseudonymization (H4)

**File changed:**
- `lib/api-utils.ts` — Added `hashIpAddress()` function that:
  - Masks IPv4 last octet: `192.168.1.xxx`
  - Hashes IPv6 with daily-rotating salt: `hashed:abc123...`
  - Applied automatically in the `audit()` function before writing to database

---

## Files Modified (8)

| File | Change |
|---|---|
| `prisma/schema.prisma` | +3 fields on User model |
| `lib/zod.ts` | +2 fields on BusinessRegisterSchema |
| `app/api/v1/auth/register/route.ts` | Store consent on registration |
| `app/(auth)/register/page.tsx` | +2 consent checkboxes |
| `lib/api-utils.ts` | IP hashing in audit function |
| `prisma/seed.ts` | All realistic names → test data |
| `lib/seed.ts` | All realistic names → test data |

## Files Created (5)

| File | Purpose |
|---|---|
| `app/api/v1/user/data-export/route.ts` | PDPL Art. 14 — Right of access |
| `app/api/v1/user/data-deletion/route.ts` | PDPL Art. 15 — Right to erasure |
| `app/api/v1/user/data-rectification/route.ts` | PDPL Art. 16 — Right to rectification |
| `app/api/v1/user/consent/route.ts` | Server-side consent logging |
| `lib/compliance/data-retention.ts` | Data retention policy + cleanup |
| `components/shared/cookie-consent.tsx` | Cookie consent banner component |

## Follow-Up Items (Not in scope)

- [ ] Wire `CookieConsentBanner` into the root layout
- [ ] Add BullMQ cron job for `cleanupExpiredData()`
- [ ] Create `/privacy` and `/terms` pages
- [ ] Execute DPAs with Resend, Sentry, Supabase
- [ ] Encrypt `Supplier.bankAccount` and `CreditLineApplication` fields at rest
- [ ] Increase password minimum to 12 characters with complexity
