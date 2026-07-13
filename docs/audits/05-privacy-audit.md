# Privacy Audit Report — HotelsVendors Digital Procurement Hub

> **Auditor:** Privacy Auditor (PDPL / Egyptian Data Protection Law Specialist)  
> **Date:** 2026-07-14  
> **Codebase Version:** Current HEAD  
> **Scope:** Full-stack Next.js 16 App Router + Prisma schema + Auth/ETA/Fintech layers  
> **Regulatory Framework:** Egyptian Law No. 151 of 2020 (PDPL), GDPR (reference), ISO 27001 principles

---

## Executive Summary

HotelsVendors collects extensive PII across hotel buyers, suppliers, factoring partners, and logistics providers — including names, emails, phone numbers, tax IDs, bank accounts, and financial records. The platform has made **significant progress** since the May 2026 audit: authentication, RBAC, tenant isolation, and tamper-proof audit logging are now implemented. However, **critical privacy gaps remain** that expose the platform to regulatory liability under Egypt's PDPL.

**Overall Privacy Risk: HIGH**

| Category | Status |
|---|---|
| PII Collection | Extensive — no data minimization review |
| Consent Mechanisms | **ABSENT** — no explicit consent for data collection |
| Data Minimization | Not enforced — excessive fields stored |
| Data Subject Rights | **NOT IMPLEMENTED** — no export, deletion, or rectification |
| Encryption at Rest | Partial — ETA credentials encrypted, most PII plaintext |
| Data Retention | **NO POLICY** — no automated retention/deletion |
| Third-Party Sharing | Uncontrolled — Oliv, Resend, ETA, analytics without DPA |
| Privacy by Design | Not embedded — no DPIA, no privacy controls in code |

---

## 1. PII Inventory & Data Map

### 1.1 Personal Data Collected

| PII Category | Fields | Model(s) | File Reference |
|---|---|---|---|
| **User Identity** | `email`, `name`, `phone`, `passwordHash` | `User` | `prisma/schema.prisma:243-302` |
| **Hotel Business** | `name`, `legalName`, `taxId`, `commercialReg`, `address`, `city`, `governorate`, `phone`, `email` | `Hotel` | `prisma/schema.prisma:145-188` |
| **Supplier Business** | `name`, `legalName`, `taxId`, `commercialReg`, `address`, `city`, `governorate`, `phone`, `email`, `website`, `bankAccount`, `bankName` | `Supplier` | `prisma/schema.prisma:349-399` |
| **Factoring Company** | `name`, `legalName`, `taxId`, `contactEmail`, `contactPhone` | `FactoringCompany` | `prisma/schema.prisma:865-886` |
| **Credit Application** | `hotelName`, `brand`, `gmName`, `gmPhone`, `gmEmail`, `cfoName`, `cfoPhone`, `crNumber`, `taxId`, `tourismLicense`, financial statements (revenue, profit, assets, liabilities, debt) | `CreditLineApplication` | `prisma/schema.prisma:2354-2406` |
| **User Addresses** | `address`, `city`, `governorate`, `lat`, `lng` | `UserAddress` | `prisma/schema.prisma:2069-2083` |
| **ETA Credentials** | `clientId`, `clientSecret` (AES-256-GCM encrypted), `taxId` | `EtaCredential` | `prisma/schema.prisma:715-727` |
| **Outreach/Marketing** | `recipientEmail`, `recipientPhone`, `ipAddress`, `unsubscribeToken`, `optInVerified` | `OutreachLog` | `prisma/schema.prisma:1927-1966` |
| **Lead Capture** | `companyName`, `email`, `sector`, `role`, `message`, `source` | `LeadCapture` | `prisma/schema.prisma:2491-2506` |
| **Waiting List** | `email`, `role`, `source`, `referrer`, `notes` | `WaitingListEntry` | `prisma/schema.prisma:2190-2215` |
| **Logistics** | `driverName`, `driverPhone`, `vehiclePlate` | `Trip` | `prisma/schema.prisma:1102-1125` |
| **Outlet Management** | `managerName`, `managerPhone` | `Outlet` | `prisma/schema.prisma:1181-1199` |
| **Audit Logs** | `actorId`, `actorRole`, `ipAddress`, `userAgent` | `AuditLog` | `prisma/schema.prisma:830-857` |
| **Session Data** | JWT with `userId`, `platformRole`, `tenantId`; session fingerprint (hashed IP, user-agent, screen, timezone) | `session.ts`, `session-fingerprint.ts` | `lib/session.ts`, `lib/security/session-fingerprint.ts` |
| **AI Conversations** | Chat messages, model used, tokens consumed | `Conversation`, `ChatMessage` | `prisma/schema.prisma:2089-2116` |
| **Product Reviews** | Rating, comment, images | `ProductReview` | `prisma/schema.prisma:2142-2158` |
| **Sample Requests** | `deliveryAddress`, `notes` | `SampleRequest` | `prisma/schema.prisma:2164-2184` |

### 1.2 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    COLLECTION POINTS                      │
├─────────────────────────────────────────────────────────┤
│ Registration (app/api/v1/auth/register)                  │
│   → email, name, password, phone, taxId, address         │
│   → Creates: Tenant + User + Hotel/Supplier/FactoringCo   │
│                                                          │
│ Credit Application (app/(dashboard)/factoring/)          │
│   → gmName, gmPhone, gmEmail, cfoName, cfoPhone,        │
│     financial statements, collateral docs                 │
│                                                          │
│ Lead Capture (app/api/waitlist, become-supplier)         │
│   → companyName, email, sector, role                     │
│                                                          │
│ Delegate Invite (app/api/onboarding/delegate-invite)     │
│   → email or WhatsApp number                             │
│                                                          │
│ ETA Onboarding (components/onboarding/EtaOnboardingModal)│
│   → clientId, clientSecret (encrypted at rest)           │
│                                                          │
│ Product Reviews / Sample Requests                        │
│   → Rating, comment, delivery address                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    STORAGE LAYER                          │
├─────────────────────────────────────────────────────────┤
│ PostgreSQL (via Prisma)                                  │
│   • User, Hotel, Supplier, FactoringCompany — PII fields │
│   • Order, Invoice, Payment — transactional PII          │
│   • AuditLog — immutable with IP + User-Agent            │
│   • CreditLineApplication — full financial profile       │
│   • OutreachLog — recipient PII + opt-in state           │
│                                                          │
│ AES-256-GCM (ETA credentials only):                      │
│   • lib/api/onboarding/upgrade-live/route.ts:45-52       │
│   • EtaCredential.clientSecret                           │
│                                                          │
│ Redis (ephemeral):                                       │
│   • Session blacklists, rate limits, idempotency keys    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 THIRD-PARTY SHARING                       │
├─────────────────────────────────────────────────────────┤
│ ETA (Egyptian Tax Authority) — invoice data + tax IDs    │
│   → lib/eta/client.ts                                    │
│                                                          │
│ Oliv Finance — hotel tax ID, name, invoice amount, ETA   │
│   → lib/fintech/oliv-bridge.ts:51-56                     │
│                                                          │
│ Resend — email addresses for transactional emails        │
│   → lib/notifications/email.ts                           │
│                                                          │
│ Supabase — referenced in lib/supabase/server.ts          │
│   → Cookie-based auth adapter                            │
│                                                          │
│ Sentry — error tracking (may capture PII in errors)      │
│   → lib/sentry.ts                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Findings

### CRITICAL

#### C1. No Explicit Consent for Data Collection (PDPL Art. 5, 6, 13)

**Finding:** The registration flow (`app/api/v1/auth/register/route.ts`) collects email, name, phone, tax ID, address, commercial registration, and bank details without any explicit consent mechanism. There is no consent checkbox, no purpose statement at collection time, and no consent record in the database.

**PDPL Requirement:** Article 5 requires explicit, informed, specific consent before processing personal data. Article 13 requires documenting consent.

**Impact:** Non-compliance with Egyptian PDPL. Regulatory fines up to EGP 5M (Art. 28). Data collected without consent may be inadmissible in legal proceedings.

**Evidence:**
- `app/api/v1/auth/register/route.ts:23-24` — Body parsed, no consent field
- `lib/zod.ts:249-287` — `BusinessRegisterSchema` has no `consentGiven` field
- `prisma/schema.prisma:243-302` — `User` model has no `consentAt` or `consentVersion` field

**Recommendation:**
1. Add `consentGiven: z.boolean().refine(v => v === true)` to `BusinessRegisterSchema`
2. Add `consentAt DateTime?` and `consentVersion String?` to `User` model
3. Record consent timestamp and version at registration
4. Store consent records in a separate `ConsentRecord` model for audit

---

#### C2. No Data Subject Rights Implementation (PDPL Art. 14, 15, 16, 17)

**Finding:** There is **no API endpoint** for users to:
- Export their personal data (Art. 14 — right of access)
- Delete their account and data (Art. 15 — right to erasure)
- Rectify inaccurate data (Art. 16 — right to rectification)
- Restrict processing (Art. 17 — right to restrict processing)

**Evidence:**
- `app/api/v1/auth/` — Only login, register, forgot-password, reset-password, verify-email
- No `/api/v1/user/export`, `/api/v1/user/delete`, or `/api/v1/user/rectify` endpoints
- Grep for `delete.*user|export.*data|account.*delet|right.*forget` returned zero relevant results

**PDPL Requirement:** Articles 14-17 grant data subjects explicit rights to access, correct, delete, and port their data.

**Impact:** Non-compliance with PDPL. Users cannot exercise their legal rights. Regulatory liability.

**Recommendation:**
1. Create `app/api/v1/user/export/route.ts` — Returns all PII in JSON/CSV format
2. Create `app/api/v1/user/delete/route.ts` — Anonymizes or deletes user data (with audit trail)
3. Create `app/api/v1/user/rectify/route.ts` — Allows updating personal information
4. Add UI components in dashboard settings for data export/deletion requests

---

#### C3. No Data Retention Policy (PDPL Art. 6(3))

**Finding:** There is no automated data retention or deletion mechanism. All data is stored indefinitely. The admin settings page references "7-year audit log retention" (`app/(dashboard)/admin/settings/page.tsx:132`) but this is a UI toggle with no backing implementation.

**Evidence:**
- No `retentionPolicy` fields on any model
- No cron jobs or scheduled deletion tasks
- No TTL indices on any PII-containing collections
- `EmailVerificationToken` and `PasswordResetToken` have `expiresAt` but no cleanup job
- `OutreachLog` stores `recipientEmail`, `recipientPhone` indefinitely

**PDPL Requirement:** Article 6(3) requires data retention periods to be defined and enforced.

**Impact:** Indefinite retention of PII violates data minimization principle. Increases breach exposure surface.

**Recommendation:**
1. Define retention periods per data category (e.g., user data: account lifetime + 2 years, audit logs: 7 years, lead data: 1 year)
2. Implement a `lib/data-retention.ts` service with scheduled cleanup
3. Add `retentionPolicy` and `retentionExpiresAt` fields to key models
4. Automate cleanup via cron or BullMQ scheduled jobs

---

### HIGH

#### H1. Most PII Stored in Plaintext — No Encryption at Rest (PDPL Art. 7(3))

**Finding:** While ETA credentials are encrypted with AES-256-GCM (`app/api/onboarding/upgrade-live/route.ts:45-52`), the following sensitive fields are stored in plaintext:

| Field | Model | Sensitivity |
|---|---|---|
| `Supplier.bankAccount` | `Supplier` | **CRITICAL** — bank account number |
| `Supplier.bankName` | `Supplier` | HIGH |
| `Hotel.taxId` | `Hotel` | HIGH — Egyptian Tax Registration Number |
| `Supplier.taxId` | `Supplier` | HIGH |
| `Tenant.taxId` | `Tenant` | HIGH |
| `CreditLineApplication` (all fields) | `CreditLineApplication` | **CRITICAL** — full financial profile including GM/CFO PII, revenue, debt |
| `Trip.driverPhone`, `Trip.vehiclePlate` | `Trip` | MEDIUM — driver PII |
| `Outlet.managerPhone` | `Outlet` | MEDIUM |

**Evidence:**
- `lib/security/sanitize.ts` — Input sanitization exists but no encryption at rest
- `prisma/schema.prisma:376-377` — `bankAccount String?` and `bankName String?` — no encryption
- `prisma/schema.prisma:2354-2406` — `CreditLineApplication` stores `gmName`, `gmPhone`, `gmEmail`, `cfoName`, `cfoPhone`, `annualRevenue`, `netProfit`, etc. in plaintext

**PDPL Requirement:** Article 7(3) requires appropriate security measures including encryption for sensitive data.

**Impact:** Database breach exposes bank accounts, tax IDs, and full financial profiles of hotel decision-makers.

**Recommendation:**
1. Encrypt `Supplier.bankAccount` using AES-256-GCM (same pattern as ETA credentials)
2. Encrypt `CreditLineApplication` sensitive fields (`gmPhone`, `cfoPhone`, `annualRevenue`, etc.)
3. Consider application-level encryption for `taxId` fields with searchable encryption or hashed indexes
4. Implement a `lib/encryption.ts` service with key rotation support

---

#### H2. No Cookie Consent Banner (PDPL Art. 6, ePrivacy)

**Finding:** The marketing footer (`components/layout/marketing-footer.tsx:102`) has a cookie preference button with an empty click handler:

```tsx
onClick={() => { /* cookie preference trigger — opens cookie settings modal */ }}
```

There is no actual cookie consent mechanism, no cookie preference modal, and no cookie categories. The session cookie (`hv_session`) is set automatically on login without consent.

**Evidence:**
- `components/layout/marketing-footer.tsx:102` — Empty onClick handler
- `lib/session.ts:59-65` — Session cookie set without consent check
- No cookie consent component exists in `components/`

**Impact:** Non-compliance with cookie consent requirements. Session cookie is "strictly necessary" but future analytics/marketing cookies will need consent.

**Recommendation:**
1. Implement a cookie consent banner component
2. Categorize cookies: Strictly Necessary (no consent), Analytics (opt-in), Marketing (opt-in)
3. Store consent preferences in a `cookie_consent` cookie
4. Only load non-essential cookies after consent

---

#### H3. Seed Data Contains Real-Looking PII (PDPL Art. 7(1))

**Finding:** The seed files contain realistic-looking personal data that could be mistaken for real individuals:

**`prisma/seed.ts`:**
- `hotel.owner@nilegrand.com` / `Omar El-Sayed` (line 194)
- `supplier.owner@deltafood.com` / `Amir Khalil` (line 253)
- `factoring.owner@cairocapital.com` / `Hassan Ibrahim` (line 310)
- `admin@hotelsvendors.com` / `System Administrator` (line 431)
- All use password: `change-me-immediately` (line 188)

**`lib/seed.ts`:**
- `hotel@hotelsvendors.demo` / `Layla Hassan` (line 71)
- `supplier@hotelsvendors.demo` / `Omar Farid` (line 72)
- `funder@hotelsvendors.demo` / `Nour El-Din` (line 73)
- `carrier@hotelsvendors.demo` / `Karim Adel` (line 74)

**Evidence:**
- `prisma/seed.ts:190-204` — Realistic Egyptian names and email addresses
- `lib/seed.ts:70-75` — Demo users with plausible names
- Default passwords are weak and documented in console output

**Impact:** If seed data leaks or is exposed in non-production environments, it could be mistaken for real PII or used for social engineering.

**Recommendation:**
1. Use clearly fake names (e.g., "Hotel Test User 1", "Supplier Demo Account")
2. Use `@test.hotelsvendors.com` domain for all test emails
3. Never print passwords to console in production
4. Add a `seed.ts` guard that refuses to run in production mode

---

#### H4. Audit Logs Store IP Addresses and User-Agents Without Retention Limits

**Finding:** The `AuditLog` model stores `ipAddress` and `userAgent` indefinitely. These are personal data under PDPL (they can identify a natural person).

**Evidence:**
- `prisma/schema.prisma:830-857` — `ipAddress String?` and `userAgent String?` on `AuditLog`
- `lib/audit/tamper-proof.ts:61-135` — Audit entries created with IP and User-Agent
- `lib/api-utils.ts:156-177` — `audit()` helper captures IP and User-Agent
- `app/api/v1/auth/register/route.ts:198-199` — Registration logs IP and User-Agent

**PDPL Requirement:** IP addresses and user-agents are personal data. Retention must be justified and limited.

**Impact:** Indefinite retention of tracking data without justification.

**Recommendation:**
1. Add retention policy to `AuditLog` (e.g., 7 years for financial audits, 2 years for auth events)
2. Pseudonymize IP addresses after retention period (hash with daily rotating salt)
3. Consider storing IP hashes only (like `session-fingerprint.ts` does)

---

#### H5. Third-Party Data Sharing Without Data Processing Agreements

**Finding:** Personal data is shared with multiple third parties without documented Data Processing Agreements (DPAs):

| Third Party | Data Shared | Evidence |
|---|---|---|
| **Oliv Finance** | `hotel_tax_id`, `hotel_name`, `invoice_amount`, `eta_uuid` | `lib/fintech/oliv-bridge.ts:51-56` |
| **Resend** | Email addresses for transactional emails | `lib/notifications/email.ts:19-38` |
| **ETA (Egyptian Tax Authority)** | Full invoice data, tax IDs, business names | `lib/eta/client.ts:129-172` |
| **Sentry** | Error data (may contain PII in error messages) | `lib/api-utils.ts:250-255` |

**PDPL Requirement:** Article 19 requires data controllers to ensure third-party processors provide adequate protection.

**Impact:** Liability for data breaches at third-party processors. Regulatory exposure.

**Recommendation:**
1. Execute DPAs with all third-party processors
2. Document data flows in a Record of Processing Activities (ROPA)
3. Ensure Resend, Sentry, and Supabase DPAs are signed
4. Minimize data sent to Oliv Finance to only what's necessary

---

### MEDIUM

#### M1. Password Minimum Length Too Short (OWASP)

**Finding:** The registration and password reset schemas enforce a minimum password length of 6 characters.

**Evidence:**
- `lib/zod.ts:253` — `password: z.string().min(6)`
- `app/api/v1/auth/reset-password/route.ts:16` — `password.length < 6`

**OWASP Recommendation:** Minimum 8 characters, ideally 12+ with complexity requirements.

**Impact:** Weak passwords increase account takeover risk.

**Recommendation:**
1. Increase minimum to 12 characters
2. Add complexity requirements (uppercase, lowercase, number, special char)
3. Check against Have I Been Pwned password database

---

#### M2. JWT Secret Fallback in Non-Production

**Finding:** The JWT signing secret falls back to a hardcoded string in non-production:

**Evidence:**
- `lib/session.ts:15-16` — `sessionSecret || "dev-secret-do-not-use-in-production"`
- `middleware.ts:15` — `process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev-secret-change-in-production")`

**Impact:** If `NODE_ENV` is misconfigured in production, all sessions can be forged.

**Recommendation:**
1. Throw an error if `SESSION_SECRET` is missing (already done in `lib/session.ts:8-12`)
2. Remove the fallback in `middleware.ts` — fail closed
3. Add a startup check that validates `SESSION_SECRET` length >= 32 characters

---

#### M3. No Purpose Limitation Enforcement

**Finding:** Data collected for one purpose (e.g., procurement) may be used for secondary purposes (marketing, AI training, analytics) without restriction.

**Evidence:**
- `OutreachLog` model (`prisma/schema.prisma:1927-1966`) stores `recipientEmail`, `recipientPhone` for marketing outreach — no purpose limitation field
- `Conversation` and `ChatMessage` models store AI chat data — no indication of whether this data is used for model training
- `LeadCapture` and `WaitingListEntry` store email addresses — no purpose field

**PDPL Requirement:** Article 5 requires data processing to be compatible with the stated purpose.

**Impact:** Potential misuse of data beyond original collection purpose.

**Recommendation:**
1. Add `purpose` field to all data collection points
2. Document allowed purposes per data category
3. Implement purpose-based access controls in service layer
4. Add `allowedPurposes` array to User model

---

#### M4. No Cross-Border Transfer Safeguards

**Finding:** The platform uses international services (Resend, Sentry, Vercel) that may transfer data outside Egypt.

**Evidence:**
- Resend (US-based email service) — `lib/notifications/email.ts:19`
- Sentry (US-based error tracking) — `lib/sentry.ts`
- Vercel (deployment platform) — `vercel.json`
- Supabase (US-based database) — `lib/supabase/server.ts`

**PDPL Requirement:** Article 22 requires adequate safeguards for cross-border data transfers.

**Impact:** Non-compliance with cross-border transfer requirements.

**Recommendation:**
1. Document all cross-border data flows
2. Ensure adequacy decisions or Standard Contractual Clauses (SCCs) are in place
3. Prefer regional alternatives where possible (e.g., Egyptian cloud providers)
4. Add a `dataProcessingLocation` field to third-party processor records

---

#### M5. AI Chat Messages Stored Without Retention Limits

**Finding:** `Conversation` and `ChatMessage` models store all AI interactions indefinitely. These messages may contain sensitive business information.

**Evidence:**
- `prisma/schema.prisma:2089-2116` — `Conversation` and `ChatMessage` with no retention
- `ChatMessage` stores `content` (full message text), `model`, `tokensUsed`
- No TTL or cleanup mechanism

**Impact:** Indefinite retention of potentially sensitive business conversations.

**Recommendation:**
1. Add `expiresAt` to `Conversation` model
2. Implement automated cleanup of old conversations
3. Consider summarization instead of full message retention
4. Allow users to delete their conversation history

---

### LOW

#### L1. No Privacy Policy Page

**Finding:** The marketing footer mentions a "Data Controller at privacy@hotelsvendors.com" but there is no actual privacy policy page, terms of service, or data processing agreement accessible from the application.

**Evidence:**
- `components/layout/marketing-footer.tsx:96` — References privacy email but no link
- No `/privacy`, `/terms`, or `/data-processing` routes exist

**Recommendation:**
1. Create a comprehensive privacy policy page at `/privacy`
2. Include: data controller identity, purposes, legal basis, retention periods, data subject rights, third-party sharing, cross-border transfers, contact information
3. Link from registration page, login page, and footer

---

#### L2. Login Schema Accepts "admin" as Email (Security Risk)

**Finding:** The login Zod schema accepts the literal string "admin" as a valid email:

**Evidence:**
- `lib/zod.ts:289-296`:
```typescript
email: z.string().email("Valid email is required").or(
  z.string().min(1).refine(val => val.toLowerCase() === "admin", {
    message: "Valid email or 'admin' is required"
  })
)
```

**Impact:** Bypasses email format validation. Could be exploited for brute-force attacks on admin account.

**Recommendation:** Remove the "admin" shortcut. Use email-based authentication exclusively.

---

#### L3. Session Fingerprint Data Collection

**Finding:** The session fingerprinting system (`lib/security/session-fingerprint.ts`) collects screen resolution, color depth, and timezone — which are device characteristics that could be used for tracking.

**Evidence:**
- `lib/security/session-fingerprint.ts:15-22` — `SessionFingerprint` interface includes `screenHash`, `timezone`
- Hashed (privacy-preserving) but still collected

**Impact:** Minor — data is hashed and used for security, not tracking. But should be documented.

**Recommendation:**
1. Document fingerprinting in privacy policy
2. Consider making screen/timezone optional (they already are)
3. Ensure fingerprints are not used for analytics or tracking

---

#### L4. Delegate Invite Creates Placeholder Emails

**Finding:** The delegate invite system creates placeholder email addresses for WhatsApp-only invitees:

**Evidence:**
- `app/api/onboarding/delegate-invite/route.ts:255`:
```typescript
const placeholderEmail = `delegate-${hash.slice(0, 8)}@invite.hotelsvendors.com`;
```

**Impact:** Creates email-like strings that could be confused with real addresses. Minor PII concern.

**Recommendation:** Document this pattern. Ensure placeholder emails are never used for unsolicited communications.

---

## 3. PII Data Map Summary

| Data Category | Collected | Encrypted at Rest | Retention Period | Third-Party Shared | Consent Recorded |
|---|---|---|---|---|---|
| User identity (name, email) | ✅ | ❌ | Indefinite | Resend, ETA | ❌ |
| User password | ✅ | ✅ (bcrypt) | Indefinite | None | ❌ |
| User phone | ✅ | ❌ | Indefinite | None | ❌ |
| Hotel tax ID | ✅ | ❌ | Indefinite | ETA, Oliv | ❌ |
| Hotel address | ✅ | ❌ | Indefinite | None | ❌ |
| Supplier bank account | ✅ | ❌ | Indefinite | None | ❌ |
| Supplier tax ID | ✅ | ❌ | Indefinite | ETA, Oliv | ❌ |
| ETA credentials | ✅ | ✅ (AES-256-GCM) | Indefinite | ETA | ❌ |
| Credit application financials | ✅ | ❌ | Indefinite | Oliv (partial) | ❌ |
| Driver PII (name, phone) | ✅ | ❌ | Indefinite | None | ❌ |
| IP addresses (audit logs) | ✅ | ❌ | Indefinite | None | ❌ |
| AI conversations | ✅ | ❌ | Indefinite | None | ❌ |
| Lead capture emails | ✅ | ❌ | Indefinite | None | ❌ |
| Waiting list emails | ✅ | ❌ | Indefinite | None | ❌ |

---

## 4. Risk Matrix

| # | Finding | Severity | Likelihood | Impact | PDPL Article | Priority |
|---|---|---|---|---|---|---|
| C1 | No consent mechanisms | CRITICAL | Certain | Regulatory fine | Art. 5, 6, 13 | **P0** |
| C2 | No data subject rights | CRITICAL | Certain | Regulatory fine | Art. 14-17 | **P0** |
| C3 | No data retention policy | CRITICAL | Certain | Indefinite liability | Art. 6(3) | **P0** |
| H1 | No encryption at rest (most PII) | HIGH | High | Data breach exposure | Art. 7(3) | **P1** |
| H2 | No cookie consent | HIGH | High | Regulatory fine | Art. 6 | **P1** |
| H3 | Realistic seed PII | HIGH | Medium | Misidentification | Art. 7(1) | **P1** |
| H4 | Audit log IP retention | HIGH | Medium | Tracking liability | Art. 6(3) | **P1** |
| H5 | No DPAs with third parties | HIGH | High | Liability transfer | Art. 19 | **P1** |
| M1 | Weak password requirements | MEDIUM | High | Account takeover | Security best practice | **P2** |
| M2 | JWT secret fallback | MEDIUM | Low | Session forgery | Security best practice | **P2** |
| M3 | No purpose limitation | MEDIUM | Medium | Data misuse | Art. 5 | **P2** |
| M4 | Cross-border transfers | MEDIUM | Medium | Regulatory violation | Art. 22 | **P2** |
| M5 | AI chat retention | MEDIUM | Medium | Data accumulation | Art. 6(3) | **P2** |
| L1 | No privacy policy page | LOW | Certain | Transparency gap | Art. 13 | **P3** |
| L2 | "admin" login bypass | LOW | Low | Security risk | Security best practice | **P3** |
| L3 | Session fingerprint data | LOW | Low | Minor tracking | Art. 5 | **P3** |
| L4 | Placeholder emails | LOW | Low | Minor confusion | Art. 5 | **P3** |

---

## 5. Recommendations Summary

### Immediate (P0 — Before Launch)

1. **Implement consent collection** — Add consent checkbox to registration, store consent records
2. **Build data subject rights endpoints** — Export, delete, rectify user data
3. **Define and enforce data retention** — Automated cleanup for PII based on legal requirements
4. **Create privacy policy page** — Comprehensive, PDPL-compliant, linked from all touchpoints

### Short-Term (P1 — Within 30 Days)

5. **Encrypt sensitive PII at rest** — Bank accounts, credit application financials, phone numbers
6. **Implement cookie consent** — Banner with categories, preference storage
7. **Clean up seed data** — Replace realistic names with clearly fake test data
8. **Set audit log retention** — IP addresses and user-agents: hash after retention period
9. **Execute DPAs** — With Resend, Sentry, Supabase, Vercel, Oliv Finance

### Medium-Term (P2 — Within 90 Days)

10. **Strengthen password policy** — Minimum 12 characters, complexity requirements
11. **Remove JWT fallback** — Fail closed if SESSION_SECRET is missing
12. **Document purpose limitation** — Add purpose field to data collection, implement purpose-based access
13. **Document cross-border transfers** — ROPA, SCCs, or regional alternatives
14. **Implement AI chat retention** — TTL on conversations, user-deletable history

### Long-Term (P3 — Within 6 Months)

15. **Conduct DPIA** — Data Protection Impact Assessment for high-risk processing
16. **Implement searchable encryption** — For tax IDs and other queryable sensitive fields
17. **Add consent management UI** — Users can view, modify, withdraw consent
18. **Automate compliance checks** — Pre-commit hooks for PII handling patterns

---

## 6. Positive Findings

The platform has made significant progress on several privacy-adjacent controls:

| Control | Status | Evidence |
|---|---|---|
| **Password hashing** | ✅ bcrypt with 12 salt rounds | `lib/auth.ts:3` |
| **Session security** | ✅ HttpOnly, Secure, SameSite cookies | `lib/session.ts:59-65` |
| **JWT with expiry** | ✅ 24-hour token lifetime | `lib/session.ts:55` |
| **Token blacklisting** | ✅ Redis-based revocation | `lib/session.ts:21-45` |
| **Tenant isolation** | ✅ Server-side, JWT-enforced | `lib/tenant/scope.ts`, `middleware.ts` |
| **RBAC** | ✅ Server-side permission checks | `lib/auth/rbac.ts` |
| **Input sanitization** | ✅ DOMPurify for XSS prevention | `lib/security/sanitize.ts` |
| **ETA credential encryption** | ✅ AES-256-GCM | `app/api/onboarding/upgrade-live/route.ts:45-52` |
| **Tamper-proof audit logs** | ✅ Cryptographic hash chaining | `lib/audit/tamper-proof.ts` |
| **Session fingerprinting** | ✅ Privacy-preserving (hashed) | `lib/security/session-fingerprint.ts` |
| **Rate limiting** | ✅ On auth endpoints | `app/api/v1/auth/login/route.ts:12` |
| **Email enumeration prevention** | ✅ Generic responses | `app/api/v1/auth/forgot-password/route.ts:32` |
| **Security headers** | ✅ CSP, X-Frame-Options, etc. | `middleware.ts:136-158` |
| **Zod validation** | ✅ All API inputs validated | `lib/zod.ts` |

---

## 7. Regulatory Reference: Egyptian PDPL (Law No. 151 of 2020)

| Article | Requirement | Platform Status |
|---|---|---|
| Art. 5 | Lawful basis for processing (consent, contract, legal obligation) | ❌ No consent mechanism |
| Art. 6 | Consent must be explicit, informed, specific | ❌ Not implemented |
| Art. 7(1) | Process only for stated purposes | ❌ No purpose limitation |
| Art. 7(3) | Appropriate security measures (encryption) | ⚠️ Partial (ETA only) |
| Art. 12 | Data minimization | ❌ Excessive collection |
| Art. 13 | Document consent records | ❌ Not implemented |
| Art. 14 | Right of access | ❌ Not implemented |
| Art. 15 | Right to erasure | ❌ Not implemented |
| Art. 16 | Right to rectification | ❌ Not implemented |
| Art. 17 | Right to restrict processing | ❌ Not implemented |
| Art. 18 | Right to data portability | ❌ Not implemented |
| Art. 19 | Third-party processor obligations | ❌ No DPAs |
| Art. 22 | Cross-border transfer safeguards | ❌ Not documented |
| Art. 28 | Penalties (up to EGP 5M) | N/A — compliance needed |

---

*Report generated: 2026-07-14*  
*Next review: Before production launch*  
*Distribution: COO, Fintech Architect, Security Expert, Integration Lead*
