# Security Hardening — Fixes Summary

**Date:** 2026-07-14  
**Auditor:** Cybersecurity Auditor (Automated)  
**Applied by:** Security Hardening Engineer  
**Scope:** 10 critical/high findings from `docs/audits/04-cybersecurity-audit.md`

---

## Fixes Applied

### 1. CRITICAL: Hardcoded fallback secrets in middleware.ts
**File:** `middleware.ts:14-16`  
**CVSS:** 9.1  
**Change:** Removed production fallback `"dev-secret-change-in-production"`. Added explicit throw at module load if `SESSION_SECRET` is missing in production — matching `lib/session.ts` behavior. Dev mode retains a distinct fallback with a clear warning string.

### 2. CRITICAL: Hardcoded Supabase credentials
**Files:** `lib/supabase/server.ts`, `lib/supabase/client.ts`  
**CVSS:** 9.0+  
**Change:** Removed all hardcoded Supabase URL, service key, and anon key. Both files now read from environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and throw at import time if missing. `.env` files must be configured before the app will start.

### 3. CRITICAL: Redis authentication missing
**File:** `docker-compose.yml`  
**CVSS:** 8.5  
**Status:** Already fixed. The current `docker-compose.yml` already has `--requirepass` on the Redis command and the host port `6379:6379` mapping was previously removed. No changes needed.

### 4. CRITICAL: ETA Soft-HSM uses tenantId as HMAC key
**File:** `lib/eta/signer.ts:145-156`  
**CVSS:** 9.0  
**Change:** The Soft-HSM fallback no longer uses `tenantId` directly as the HMAC key. Instead:
- Reads `ETA_HMAC_SECRET` from environment (required in production, throws if missing).
- Derives a per-tenant key via `HMAC-SHA256(ETA_HMAC_SECRET, tenantId)`.
- Signs the document hash with the derived per-tenant key.
- In dev mode without `ETA_HMAC_SECRET`, generates a random ephemeral key (non-persistent, acceptable for local dev).

### 5. HIGH: Authority Matrix DB rules not tenant-scoped
**File:** `lib/auth/authority-matrix.ts:243-250`  
**CVSS:** 8.8  
**Change:** Added `OR: [{ tenantId: ctx.tenantId }, { tenantId: null }]` to the `findMany` where clause. Rules are now scoped to either the current tenant or global rules (where `tenantId` is null). This prevents Tenant A's rules from applying to Tenant B's orders.

### 6. HIGH: No refresh token rotation
**File:** `app/api/v1/auth/refresh/route.ts`  
**CVSS:** 8.5  
**Change:** Added `revokeToken(token)` call before issuing a new session token. The old token is blacklisted (via `lib/session.ts` revocation) so it cannot be reused. This implements one-way refresh token rotation: each refresh invalidates the previous token.

### 7. HIGH: File upload extension spoofing
**File:** `app/api/v1/upload/route.ts`  
**CVSS:** 8.2  
**Change:**
- Added magic byte (file signature) validation for JPEG, PNG, WebP, and GIF.
- Extension is now derived from the declared MIME type (not from `file.name`) to prevent extension spoofing.
- Added explicit extension allowlist: `["jpg", "jpeg", "png", "webp", "gif"]`.
- Original filename is fully discarded — only UUID + validated extension is used.

### 8. HIGH: CSRF protection missing
**New file:** `lib/security/csrf.ts`  
**CVSS:** 7.0  
**Change:** Created a CSRF protection module implementing the double-submit cookie pattern:
- `generateCsrfToken()` — generates a signed token (HMAC-SHA256).
- `setCsrfCookie(response)` — sets the token in an httpOnly cookie.
- `validateCsrfToken(cookieToken, headerToken)` — validates with timing-safe comparison.
- `checkCsrf(request)` — middleware helper that returns 403 on state-changing requests without valid CSRF token.
- State-changing methods (POST, PUT, PATCH, DELETE) require `x-csrf-token` header matching the `csrf_token` cookie.
- GET/HEAD/OPTIONS are exempt (safe methods).

**Note:** Routes should call `checkCsrf(request)` at the top of POST/PUT/PATCH/DELETE handlers. The CSRF cookie should be set on initial page loads (GET routes rendering forms).

### 9. HIGH: Password minimum length only 6 chars
**File:** `lib/zod.ts`  
**CVSS:** 7.0  
**Status:** Already fixed. The codebase already has a `passwordStrength` schema with `.min(8, ...)` plus complexity requirements (uppercase, lowercase, number). Both `RegisterSchema` and `BusinessRegisterSchema` use it.

### 10. HIGH: In-memory rate limiting fails open
**File:** `lib/security/rate-limiter.ts`  
**CVSS:** 7.0  
**Change:** Replaced direct `RateLimiterMemory` instantiation with a `createLimiter()` factory:
- Attempts to create `RateLimiterRedis` when Redis is available (via `getRedis()`).
- Falls back to `RateLimiterMemory` only if Redis connection fails.
- Updated the `limiters` record type to accept both `RateLimiterMemory | RateLimiterRedis`.
- In production with Redis, rate limits are now shared across all instances.

---

## Build Verification

```
npx tsc --noEmit
```

- **Result:** Compiled with 4 pre-existing errors in `app/api/v1/supplier/onboard/route.ts` (syntax issue, unrelated to security changes).
- **New errors from fixes:** None.

---

## Files Changed

| File | Fix # | Change Type |
|---|---|---|
| `middleware.ts` | 1 | Modified — throw on missing secret |
| `lib/supabase/server.ts` | 2 | Modified — env vars only |
| `lib/supabase/client.ts` | 2 | Modified — env vars only |
| `docker-compose.yml` | 3 | Already fixed (no change) |
| `lib/eta/signer.ts` | 4 | Modified — per-tenant derived key |
| `lib/auth/authority-matrix.ts` | 5 | Modified — tenant-scoped queries |
| `app/api/v1/auth/refresh/route.ts` | 6 | Modified — token rotation |
| `app/api/v1/upload/route.ts` | 7 | Modified — magic bytes + extension allowlist |
| `lib/security/csrf.ts` | 8 | **New file** — CSRF protection module |
| `lib/zod.ts` | 9 | Already fixed (no change) |
| `lib/security/rate-limiter.ts` | 10 | Modified — Redis-backed limiters |

---

## Remaining Recommendations (from audit)

The following findings were not in scope for this hardening pass but should be addressed:

- **H1 (CSP unsafe-eval):** Replace `unsafe-eval` with nonce-based CSP.
- **H2 (x-session-token CORS):** Remove `x-session-token` from `Access-Control-Allow-Headers`.
- **H4 (Password reset token not transactional):** Wrap reset in Prisma transaction.
- **H6 (Admin override authorizerId):** Set `authorizerId` server-side from `auth.userId`.
- **M3 (CORS wildcard):** Fail closed if neither `VERCEL_URL` nor `NEXT_PUBLIC_APP_URL` is set.
- **M5 (Session revocation on password change):** Add `tokenVersion` to User model.
- **M6 (Password reset token plaintext):** Store SHA-256 hash of token, not the token itself.
- **L4 (Missing HSTS header):** Add `Strict-Transport-Security` to middleware.
