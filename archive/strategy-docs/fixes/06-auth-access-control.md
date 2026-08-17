# Fix 06 — Authentication & Access Control

**Date:** 2026-07-14  
**Scope:** 7 critical/high findings from cybersecurity audit  
**Files Modified:** 9 files  

---

## Changes Summary

### 1. CRITICAL: JWT Secret Not Validated at Startup
**File:** `middleware.ts:8-20`

Added explicit startup logging for `SESSION_SECRET` status. The existing throw-on-missing in production was preserved, and a warning log was added for dev fallback usage. Console output now shows `[Auth] Startup validation: SESSION_SECRET loaded` or `using FALLBACK (dev only)` on every cold start.

### 2. HIGH: Refresh Token Rotation
**Files:** `app/api/v1/auth/refresh/route.ts` (rewritten), `prisma/schema.prisma`

- Added `RefreshToken` model with `family` tracking, `replacedBy` chain, and `revokedAt` timestamp.
- On each refresh: old token is revoked, new token issued in the same family.
- **Reuse detection:** if a revoked token is presented, the entire family is invalidated and an audit event is logged.
- Refresh tokens are SHA-256 hashed before storage (never plaintext).
- 7-day expiry with httpOnly/secure cookie support ready.

### 3. HIGH: Password Minimum Length + Strength
**File:** `lib/zod.ts`

- Created `passwordStrength` schema: `min(8)` + requires 1 uppercase, 1 lowercase, 1 number.
- Applied to `RegisterSchema`, `BusinessRegisterSchema`, and all auth schemas.
- Updated `reset-password/route.ts` to enforce `min(8)` inline.

### 4. HIGH: Password Reset Token in Transaction + Hashed
**Files:** `app/api/v1/auth/forgot-password/route.ts`, `app/api/v1/auth/reset-password/route.ts`

- `forgot-password`: Token is now SHA-256 hashed before DB storage. `deleteMany` + `create` wrapped in `prisma.$transaction`.
- `reset-password`: Lookup uses hashed token. Password update + token deletion wrapped in `prisma.$transaction`. Existing sessions revoked on password change via `revokeToken("user:{id}:all")`.

### 5. HIGH: Admin Override — Server-Side Authorizer ID
**File:** `app/api/v1/admin/authority-override/route.ts`

Removed `authorizerId` from `OverrideSchema`. The route now always uses `auth.userId` (the authenticated session) as the primary authorizer. The client can still provide `coAuthorizerId` for dual-authorization, but the primary authorizer is never trusted from the request body.

### 6. HIGH: Session Token Exposed in CORS Headers
**File:** `next.config.ts`

Removed `x-session-token` from `Access-Control-Allow-Headers`. Only `Content-Type` and `Authorization` are now allowed for AI streaming CORS endpoints.

### 7. HIGH: CSRF Protection
**Files:** `lib/security/csrf.ts` (new), `middleware.ts`

- Created `lib/security/csrf.ts` with double-submit cookie pattern:
  - `generateCsrfToken()` — HMAC-signed random token.
  - `validateCsrfToken()` — timing-safe comparison.
  - `csrfMiddleware()` — sets cookie on GET, validates on POST/PUT/DELETE/PATCH.
- Integrated into `middleware.ts`:
  - CSRF cookie (`hv_csrf`) set on all non-API page routes.
  - CSRF header validation enforced on state-changing API routes.
  - Auth endpoints (`/api/v1/auth/*`) and webhooks are exempt (they handle their own auth).

---

## Migration Required

```bash
npx prisma migrate dev --name add-refresh-tokens
```

This creates the `RefreshToken` table. No data migration needed.

## Backward Compatibility

- Existing sessions (access tokens) continue to work — no changes to JWT structure.
- Refresh token rotation is additive — first refresh creates a new family.
- Password strength change is enforced on new registrations and password resets only.
- CSRF exemption for auth routes prevents login/register breakage.
