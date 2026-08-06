# Deliverable 1 — Registration Matrix

> Read-only analysis. Every claim cites `file_path:line_number`.

## 1.1 Overview

HotelsVendors uses a **dual-channel registration model**: the web app (`app/(auth)/register/page.tsx`) handles only **FACTORING** signups with a full form; **HOTEL**, **SUPPLIER**, and **LOGISTICS** roles are redirected to the **INVO mobile app**, then back-paired to the web account. A parallel **marketing capture** path (`app/(marketing)/become-supplier/page.tsx`) feeds a SUPPLIER PENDING approval pipeline through `/api/v1/supplier/onboard`.

The single backend API `POST /api/v1/auth/register` (lib: `app/api/v1/auth/register/route.ts`) handles all authenticated registrations, branching by role type to create the appropriate tenant + entity (Hotel / Supplier / FactoringCompany / Shipping user).

---

## 1.2 Role-to-Channel Mapping

| Role (UI) | Role (DB `PlatformRole`) | Registration Channel | Auth API Endpoint | Entity Created | Initial Status |
|---|---|---|---|---|---|
| Hotel / Property | `HOTEL` | **Mobile app only** → pair to web | `POST /api/v1/auth/register` (mobile path) | `Hotel` | `ACTIVE` |
| Supplier / Vendor | `SUPPLIER` | **Mobile app only** → pair to web | `POST /api/v1/auth/register` (mobile path) | `Supplier` | `ACTIVE` |
| Factoring Company | `FACTORING` | **Web form** (full form with OTP) | `POST /api/v1/auth/register` (business path) | `FactoringCompany` | `ACTIVE` |
| Logistics Provider | `LOGISTICS` → remapped to `SHIPPING` | **Mobile app only** → pair to web | `POST /api/v1/auth/register` (mobile path) | `User` only (no entity) | N/A |
| Supplier (marketing lead) | N/A (no auth yet) | **Marketing form** | `POST /api/v1/supplier/onboard` | `Supplier` | `PENDING` |

**Key files:**
- Web register gate: `app/(auth)/register/page.tsx:35` — `StakeholderRole` enum defined as `"HOTEL" | "SUPPLIER" | "FACTORING" | "LOGISTICS"`
- Redirect logic: `app/(auth)/register/page.tsx:224-326` — **non-FACTORING roles see a "Download INVO App" page** with App Store / Google Play links and pairing instructions
- Role remapping: `app/(auth)/register/page.tsx:179` — `LOGISTICS` is sent as `"SHIPPING"` in the API call
- DB enum: `prisma/schema.prisma:2510-2517` — `PlatformRole` enum is `HOTEL | SUPPLIER | FACTORING | SHIPPING | ADMIN | MARKETING`
- API role branching: `app/api/v1/auth/register/route.ts:109` — `platformRole` derived from `type` param or `data.role`
- Hotel entity creation: `app/api/v1/auth/register/route.ts:159-174` — creates `prisma.hotel`
- Supplier entity creation: `app/api/v1/auth/register/route.ts:175-193` — creates `prisma.supplier` with `status: "ACTIVE"`, `tier: "CORE"`
- FactoringCompany creation: `app/api/v1/auth/register/route.ts:194-207` — creates `prisma.factoringCompany`
- Shipping user-only: `app/api/v1/auth/register/route.ts:208-213` — falls to else branch, creates `User` only

**Mobile app roles:**
- `mobile/app/(auth)/RegisterScreen.tsx:12` — role state is `'hotel' | 'supplier'` only (no factoring/logistics in mobile UI)
- `mobile/app/(auth)/RegisterScreen.tsx:24-33` — calls `/auth/register` (same backend API via `mobile/lib/api.ts`)
- `mobile/app/(auth)/RegisterScreen.tsx:23-24` — posts `{ name, email, password, phone, role, city, governorate, termsAccepted }` to `api.post('/auth/register', ...)`
- `mobile/lib/api.ts` (assumed) — base URL points to same `/api/v1` backend

**Marketing capture path (unauthenticated):**
- Form: `app/(marketing)/become-supplier/page.tsx:140-153` — submits to `/api/v1/supplier/onboard`
- Onboarding API: `app/api/v1/supplier/onboard/route.ts:16-167` — creates `Supplier` with `status: "PENDING"`
- `app/api/v1/supplier/onboard/route.ts:83-118` — atomic transaction: creates Supplier PENDING + seeds `HotelSupplier` shell records (`isShell: true`) for all active hotels in tenant
- Uses a "default" tenant: `app/api/v1/supplier/onboard/route.ts:63-78` — finds-or-creates tenant slug `"default"` with `type: "HOTEL_GROUP"`
- Returns status PENDING + "2-3 business days" review: `app/(marketing)/become-supplier/page.tsx:164-167`

---

## 1.3 Authentication Flow

### Web (FACTORING) Registration:
1. User selects "Factoring Company" role on `app/(auth)/register/page.tsx:42`
2. Full form appears (lines 348-524): OTP phone verification → name, email, password, terms
3. OTP flow: `app/(auth)/register/page.tsx:107-161` — sends to `/api/v1/auth/send-otp` (line 115), verifies at `/api/v1/auth/verify-otp` (line 144)
4. On submit: `app/(auth)/register/page.tsx:174-203` — POSTs to `/api/v1/auth/register` with `role: "FACTORING"`
5. API creates Tenant → Owner role → FactoringCompany entity → issues session pair: `app/api/v1/auth/register/route.ts:288-314`
6. Rate limit: 3/hr per IP: `app/api/v1/auth/register/route.ts:25`

### Mobile (HOTEL/SUPPLIER/LOGISTICS) Registration:
1. Mobile app `RegisterScreen` collects: name, email, password, phone, role, city, governorate, terms
2. POSTs to `/api/v1/auth/register` — **detected as mobile path** when `body.phone && body.otpCode` present: `app/api/v1/auth/register/route.ts:33`
3. Mobile uses `MobileRegisterSchema`, web uses `BusinessRegisterSchema`: `app/api/v1/auth/register/route.ts:34-35`
4. OTP verification happens server-side: `app/api/v1/auth/register/route.ts:66-74`
5. Session issued automatically for mobile: `app/api/v1/auth/register/route.ts:288` — `createSessionPair`
6. Mobile lands logged-in immediately; web user must verify email first: `app/api/v1/auth/register/route.ts:243-274`

### Pairing Flow (Mobile → Web account linking):
1. Mobile user receives 3-digit pairing code (shown in INVO app)
2. Web user navigates to `app/(auth)/pairing/page.tsx:8-161`
3. UI generates 3 random numbers, one is correct: `app/(auth)/pairing/page.tsx:21-34`
4. POSTs selected number to `POST /api/v1/auth/pair`: `app/(auth)/pairing/page.tsx:42-47`
5. API validates code, checks expiry (5 min), marks as used: `app/api/v1/auth/pair/route.ts:15-49`

---

## 1.4 Onboarding Steps (Post-Registration)

| Role | Steps | API |
|---|---|---|
| HOTEL | profile_complete, phone_verified, kyc_level1, property_added, eta_setup, first_order | `app/api/v1/onboarding/progress/route.ts:7` |
| SUPPLIER | profile_complete, phone_verified, kyc_level1, product_listed, oliv_activated | `app/api/v1/onboarding/progress/route.ts:8` |
| SHIPPING | profile_complete, phone_verified, zones_selected, documents_uploaded | `app/api/v1/onboarding/progress/route.ts:9` |
| FACTORING | profile_complete, phone_verified, kyc_level2 | `app/api/v1/onboarding/progress/route.ts:10` |

**Onboarding API:** `app/api/v1/onboarding/progress/route.ts:6-12` — `STEPS_BY_ROLE` map defines role-specific step sequences.

---

## 1.5 Oliv KYC Pre-fill at Signup (Layer 3 Attribution)

- **Trigger:** Supplier completes web signup form, triggers Oliv KYC pre-fill
- **Flow:** `app/api/v1/oliv/onboard-supplier/route.ts:1-214` — receives full company/signatory/bank/financial data
- **Build payload:** `lib/fintech/anti-bypass/layer3-crm-attribution.ts:111-245` — `buildOlivKYCPrefill()` injects mandatory attribution fields (`partner_id`, `attribution_type = "permanent_origin_account"`)
- **Audit record:** `app/api/v1/oliv/onboard-supplier/route.ts:164-178` — creates `olivOnboardingAudit` with `commission_agreement_id`, `prefillDataHash`
- **Sync log:** `app/api/v1/oliv/onboard-supplier/route.ts:181-196` — outbound `olivSyncLog` with idempotency key
- **KYC timing:** Done **once at signup**, not per transaction — `lib/fintech/anti-bypass/layer3-crm-attribution.ts:12-14` and `app/api/v1/oliv/onboard-supplier/route.ts:7`

---

## 1.6 Rate Limits & Security

| Endpoint | Rate Limit | Source |
|---|---|---|
| Web/mobile register | 3/hr per IP | `app/api/v1/auth/register/route.ts:25` |
| Supplier onboarding (marketing) | 3/hr per IP | `app/api/v1/supplier/onboard/route.ts:22-26` |

- Email uniqueness check: `app/api/v1/auth/register/route.ts:78-85` — skips for `@hotelsvendors.local` placeholder emails
- Phone uniqueness check: `app/api/v1/auth/register/route.ts:88-95`
- Audit logging on registration: `app/api/v1/auth/register/route.ts:276-286`

---

## 1.7 Consolidated Registration Flow Diagram

```
WEB (app/(auth)/register/page.tsx)
  ├── FACTORING → Full web form with OTP → POST /api/v1/auth/register
  │     └── Creates Tenant + OwnerRole + FactoringCompany + session
  └── HOTEL / SUPPLIER / LOGISTICS → "Download INVO App" page
          └── App Store / Google Play links (app/(auth)/register/page.tsx:286-310)
          └── Pair via 3-digit code on app/(auth)/pairing/page.tsx
                  └── POST /api/v1/auth/pair

MOBILE (mobile/app/(auth)/RegisterScreen.tsx)
  ├── HOTEL or SUPPLIER → Full form → POST /auth/register (mobile path)
  │     └── Creates Tenant + OwnerRole + Hotel/Supplier entity + auto-login session
  └── OnboardingGatewayScreen.tsx → role selection ('hotel' | 'supplier' only)

MARKETING (app/(marketing)/become-supplier/page.tsx)
  ├── 5-step web form → POST /api/v1/supplier/onboard
          └── Creates Supplier PENDING + HotelSupplier shells + audit log
