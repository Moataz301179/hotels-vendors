# Claude Code Task: Phone + SMS OTP Authentication & Auth Contract Alignment

**Repo:** `/Users/Moatazi/hotels-vendors` (Next.js 16 App Router + Prisma + custom JWT session)
**Owner of this change:** Security Expert + Fintech Architect scope.
**Working mode:** You are NOT allowed to edit the mobile app. You implement the backend + web UI only.

---

## 0. READ BEFORE CODING (guardrails, non-negotiable)

1. Read `/docs/ARCHITECTURE_OVERHAUL_PLAN.md` first (G11 in AGENTS.md: mandatory before any auth change).
2. Follow `/Users/Moatazi/hotels-vendors/AGENTS.md` system guardrails:
   - **G1 tenant isolation**: user queries tenant-scoped; OTP routes are pre-auth (no tenant).
   - **G2 RBAC server-side only**.
   - **G9**: all new routes under `app/api/v1/`.
   - **Every API route**: Zod validation + rate limiting (`checkRateLimit` from `lib/redis`) + `audit` from `lib/api-utils`.
   - No client-side secrets; env vars only.
   - TypeScript strict; no `@ts-ignore` without justification.
   - Do NOT commit `.env` or `.env.local`.
3. Follow existing conventions: API routes in `app/api/v1/auth/` import via `@/lib/...` (mirror existing `login/route.ts`, `register/route.ts`). Web pages under `app/(auth)/`. shadcn/ui + Tailwind v4 for UI.

---

## 1. GOAL

Enable sign-up/sign-in with an **Egyptian mobile number + SMS OTP** (Twilio Verify), keep email+password working, and align the **auth API contract with the mobile app** (`hotels-vendors-mobile`), which is the source of truth for JSON shapes.

The mobile client (already built) calls:

| Call | Request body | Expects in `data` |
|---|---|---|
| `POST /api/v1/auth/send-otp` | `{ phone }` | `success: true` (mock provider returns `devCode` in dev) |
| `POST /api/v1/auth/verify-otp` | `{ phone, code }` | `success: true` |
| `POST /api/v1/auth/otp-login` | `{ phone, code }` | `{ accessToken, refreshToken, user }` |
| `POST /api/v1/auth/register` | `{ name, role, password, phone, otpCode, email? }` | `{ accessToken, refreshToken, user }` |
| `POST /api/v1/auth/login` | `{ identifier, password }` | `{ accessToken, refreshToken, user }` |
| `GET /api/v1/auth/me` | — | the user object directly incl. `tenantId`, `phone`, `phoneVerifiedAt`, `supplierId` |
| `POST /api/v1/auth/refresh` | `{ refreshToken }` | `{ accessToken, refreshToken }` |

`user` shape the mobile client uses:
```json
{ "id": "...", "email": "...", "name": "...", "role": "OWNER", "platformRole": "HOTEL|SUPPLIER|...", "tenantId": "...", "phone": "+2010...", "phoneVerifiedAt": "ISO|null", "supplierId": "...|null", "hotelId": "...|null" }
```

All responses must pass through `success()` / `error()` from `@/lib/api-utils` so they render as `{ success, data }` / `{ success: false, error }`.

---

## 2. PRISMA SCHEMA CHANGES (`prisma/schema.prisma`)

1. **User**:
   - `phone String? @unique` (field exists; add `@unique`).
   - `phoneVerifiedAt DateTime?`
   - `refreshTokenHash String?` (rotating refresh token for mobile sessions).
2. **New model `OtpVerification`**:
   - `id String @id @default(cuid())`
   - `phone String`
   - `purpose String` — `LOGIN` | `REGISTER`
   - `provider String` — `twilio` | `mock`
   - `codeHash String?` — mock only (sha256 of code); null for twilio
   - `expiresAt DateTime`
   - `attempts Int @default(0)`
   - `verifiedAt DateTime?`
   - `createdAt DateTime @default(now())`
   - `@@index([phone, purpose, createdAt])`
3. Run migration and apply: `npx prisma migrate dev --name add_phone_otp_auth` (SQLite dev DB). Do not hand-edit migrations.

Phone normalization + validation must be centralized, e.g. `lib/auth/phone.ts`:
```ts
export function normalizePhone(input: string): string;
export function isValidEgyptianPhone(phone: string): boolean; // /^\+20(10|11|12|15)\d{8}$/
export function phoneToIdentifier(phone: string): string;     // placeholder email when none provided
```
Handles `0101...` → `+20101...`, `101...` → `+20101...`, `00201...` → `+201...`, `+20101...` as-is. Store E.164 everywhere.

---

## 3. OTP SERVICE (provider switch, like the existing mock pattern)

Create `lib/auth/otp.ts` with a provider interface:

```ts
type OtpProvider = "mock" | "twilio";
interface OtpSendResult { provider: OtpProvider; devCode?: string }
async function sendOtp(phone: string, purpose: string): Promise<OtpSendResult>;
async function verifyOtp(phone: string, code: string, purpose: string): Promise<boolean>;
```

- `OTP_PROVIDER=mock|twilio` env (default `mock` in dev, `twilio` in prod).
- **twilio**: `@twilio/verify` — `verifications.create({ to: phone, channel: "sms" })` for send; `verificationChecks.create({ to: phone, code })` for verify. Never store the code.
- **mock**: generate 6-digit code, store `sha256(code)` + `expiresAt` (5 min) in `OtpVerification`; **only when `NODE_ENV !== "production"`** return `devCode` in the send response (log it to the console too). In production the mock provider must never reveal a code.
- Cooldown: 60s between sends to same `phone+purpose` (`409`/429 with `"Please wait 60 seconds before requesting a new code"`).
- Attempts: cap at 5 per code; after that invalidate.
- Rate limit sends per IP: `checkRateLimit(\`otp:send:${ip}\`, 3600, 10)` and per phone `checkRateLimit(\`otp:phone:${phone}\`, 3600, 5)`.
- Install dep: `npm i twilio --legacy-peer-deps`.

---

## 4. NEW ENDPOINTS (all under `app/api/v1/auth/`)

### `POST /api/v1/auth/send-otp`
- Zod `SendOtpSchema`: `{ phone }` validated via `isValidEgyptianPhone(normalizePhone(...))`.
- Cooldown + rate limits above → `error(..., 429)`.
- Persist `OtpVerification` row (twilio: codeHash null), call provider, audit `action: "OTP_SEND"`.
- Return `success({ message: "Code sent" , devCode })` (devCode only in non-prod mock).

### `POST /api/v1/auth/verify-otp`
- Zod `VerifyOtpSchema`: `{ phone, code }`.
- Provider verify (5-attempt cap, expiry). On success mark `verifiedAt`.
- Return `success({ message: "Verified" })`.

### `POST /api/v1/auth/otp-login`
- Verify OTP with `purpose: "LOGIN"` (auto-attach: if the phone belongs to an existing user, treat as LOGIN).
- If no user for the phone → `error("No account found for this number. Please register.", 404)`.
- Issue session pair (see §5), audit `LOGIN` (loginAlias = phone).
- Return `success({ accessToken, refreshToken, user })`.

---

## 5. SESSION PAIR — modify `lib/session.ts`

Keep cookie behavior for web. Add (do NOT remove existing functions):

- `createSessionPair(userId, platformRole, tenantId): Promise<{ accessToken, refreshToken }>`
  - `accessToken`: existing 24h JWT (reuse `createSession` internals without cookie side-effect — refactor the JWT signing into a private `signToken(userId, platformRole, tenantId, ttl, type)` helper).
  - `refreshToken`: JWT `type: "refresh"`, 30d expiry; store `sha256(refreshToken)` on `User.refreshTokenHash` (rotate: overwrite).
- `verifyRefreshToken(token)` → userId/platformRole/tenantId; rejects if `sha256(token)` ≠ stored hash or blacklisted.
- `rotateSessionPair(refreshToken)` → verify, then issue new pair, update hash.

### `POST /api/v1/auth/refresh`
- Existing route exists — rewrite to: validate `{ refreshToken }` (Zod), `rotateSessionPair`, return `success({ accessToken, refreshToken })`. On failure → `error("Unauthorized", 401)` (mobile then wipes tokens).

---

## 6. MODIFY `POST /api/v1/auth/register`

- New schema `RegisterSchema` (keep exporting old `BusinessRegisterSchema` for back-compat):
  - `type` optional (`hotel|supplier|factoring|shipping`) — legacy web.
  - `role` optional (`HOTEL|SUPPLIER|FACTORING|SHIPPING`) — mobile. One of `type`/`role` required.
  - `name`, `password` (existing strength), `phone` **required**, `otpCode` **required**, `email` **optional** (mobile sends none), keep `city`/`governorate`/`address`/`taxId`/`commercialReg`/`marketingConsent`/`termsAccepted`/`accountType`.
- **OTP gate**: `verifyOtp(phone, otpCode, "REGISTER")` first; fail `400` "Invalid or expired code" otherwise.
- Duplicate checks: existing email check; add `phone` unique check → `409` "An account with this mobile number already exists."
- `email` optional → if missing, set `userBase.email = phoneToIdentifier(phone)` (deterministic placeholder, unique).
- Set `phone` and `phoneVerifiedAt` on the User (all branches: hotel/supplier/factoring/shipping/user-only). Keep persisting `phone` onto `Supplier.phone` / `FactoringCompany.contactPhone` as today.
- Map mobile `role` → the existing `type` branches (`HOTEL`→hotel, `SUPPLIER`→supplier, etc.); default `city`/`governorate` to "Cairo" when missing (existing behavior).
- Keep email verification token/welcome email flow but **skip emails when the account email is the phone placeholder** (no real address).
- After creation, issue session pair (mobile users must land logged-in) → return `success({ accessToken, refreshToken, user, message }, 201)`. Keep `hotel/supplier/factoringCompany/tenantId` fields for web back-compat.
- Audit `REGISTER` (include phone).

---

## 7. MODIFY `POST /api/v1/auth/login`

- `LoginSchema`: accept `identifier` (email OR phone OR "admin") AND keep `email` field working (mobile sends `identifier`; web sends `email`).
- Resolve user: if identifier looks like a phone (starts `+2`/`01`/`10`/`11`/`12`/`15`), find by `phone` (normalized); else find by `email`; keep `admin` alias.
- Password verify as today.
- Email-verification gate: **skip** the `emailVerifiedAt` block when `user.phoneVerifiedAt` is set (phone-verified accounts don't need email verify).
- Return `success({ accessToken, refreshToken, token, user })` (`token` kept for back-compat).

## 8. MODIFY `GET /api/v1/auth/me`

Return the user object **directly** (as today) but add: `tenantId`, `phone`, `phoneVerifiedAt`, `supplierId`, keep `hotelId`, `platformRole`, `role`, `canOverride`, `permissions`, `hotel`. (Mobile `loadUser` stores this object.)

---

## 9. WEB UI (Tailwind v4 + shadcn/ui, `app/(auth)/`)

### `app/(auth)/register/page.tsx` + the auth form component
- Add **Mobile Number** field (E.164, `+20` prefix, phone-pad).
- Add OTP step: "Send Code" → 60s cooldown timer → 6-digit code input → "Verify". The verified number is shown inline. Email becomes optional (label "(optional)").
- Submit sends `{ type, name, email?, password, phone, otpCode, ... }`. On success redirect to the dashboard (already logged in via session cookie).
- Keep the existing role/type selector and T&C checkbox.

### `app/(auth)/login/page.tsx`
- Identifier field relabeled **"Email or Mobile Number"** (accepts `+20...`).
- Add a secondary "Sign in with mobile & OTP" toggle: phone input → "Send Code" → OTP input → calls `/api/v1/auth/otp-login`.
- Password login unchanged otherwise.

---

## 10. ENV (`vercel env` + `.env.local` for dev — never commit)

```
OTP_PROVIDER=mock
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SERVICE_SID=...
```

---

## 11. VERIFICATION BEFORE YOU FINISH

1. `npm run lint` and `npm run build` must pass (Next.js 16 — check `node_modules/next/dist/docs/` for any API you touch; heed deprecations).
2. `npx prisma migrate dev --name add_phone_otp_auth` applied cleanly.
3. With `OTP_PROVIDER=mock`, curl smoke tests (dev server on :3000):
   - send-otp for `+201012345678` → returns `devCode`.
   - verify-otp with that code → success; wrong code → failure; 6th attempt → locked.
   - register `{ role: "SUPPLIER", name, phone, otpCode, password }` → returns `accessToken/refreshToken/user` with `phone` + `phoneVerifiedAt`.
   - login `{ identifier: "+201012345678", password }` → succeeds (email gate skipped).
   - otp-login → returns pair.
   - me with `Bearer accessToken` → includes `tenantId`, `phone`.
   - refresh with refreshToken → new pair.
4. Duplicate phone register → 409. send-otp within 60s → 429.

## 12. EXACTLY WHAT NOT TO DO

- Do NOT touch the mobile repo.
- Do NOT modify the Oliv onboarding endpoints or referral logic.
- Do NOT remove `LoginSchema`/`BusinessRegisterSchema` exports (other routes import them).
- Do NOT remove cookie-based session behavior for the web app.
- Do NOT log OTP codes in production, and do not return `devCode` when `NODE_ENV === "production"`.
- Do NOT create client-side role/tenant state.
