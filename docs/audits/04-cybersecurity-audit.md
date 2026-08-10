# Cybersecurity Audit Report — HotelsVendors Digital Procurement Hub

**Audit Date:** 2026-07-14  
**Auditor:** Cybersecurity Auditor (Automated)  
**Scope:** Full-stack application security — middleware, authentication, authorization, API, cryptography, infrastructure, dependencies  
**Codebase:** `/Users/Moataz/Documents/GitHub/hotels-vendors`  
**Framework:** Next.js 16.2.4, React 18, Prisma, PostgreSQL, Redis  

---

## Executive Summary

The HotelsVendors codebase demonstrates **above-average security awareness** for a pre-production B2B fintech platform. The team has implemented several foundational security controls: JWT-based session management with jose, RBAC with permission-based access control, tenant isolation helpers, tamper-proof audit logging with hash chaining, HMAC webhook verification, rate limiting, and Zod input validation.

However, **6 Critical, 8 High, and 9 Medium** vulnerabilities were identified. The most severe issues involve:

1. **Hardcoded fallback secrets** that would be active in production if env vars are missing
2. **ETA Soft-HSM signing using tenantId as HMAC key** — cryptographically weak and predictable
3. **In-memory rate limiting and idempotency** that degrades to zero protection when Redis is unavailable
4. **Authority Matrix tenant-scoping gap** — DB rules are fetched without tenant filter
5. **No refresh token rotation** — old tokens remain valid until expiry after refresh
6. **File upload path traversal potential** via unvalidated file extensions

**Overall Risk Rating: HIGH**

---

## Threat Matrix

| Threat Category | Likelihood | Impact | Risk Level |
|---|---|---|---|
| Credential Stuffing / Brute Force | Medium | High | **HIGH** |
| Session Hijacking | Low | Critical | **MEDIUM** |
| Privilege Escalation (RBAC bypass) | Medium | Critical | **HIGH** |
| Cross-Tenant Data Leakage | Medium | Critical | **HIGH** |
| ETA Invoice Forgery | High | Critical | **CRITICAL** |
| Supply Chain Attack (deps) | Low | High | **MEDIUM** |
| Data Exfiltration via Upload | Medium | High | **HIGH** |
| Financial Transaction Replay | Medium | Critical | **HIGH** |
| Insider Threat (Admin Override) | Low | Critical | **MEDIUM** |

---

## Findings

### CRITICAL — CVSS 9.0–10.0

---

#### C1: Hardcoded Fallback Secrets in Production Path

**CVSS: 9.1 (Critical)**  
**Files:**
- `middleware.ts:14-16` — `process.env.SESSION_SECRET || (production ? "" : "dev-secret-change-in-production")`
- `lib/session.ts:14-16` — `sessionSecret || "dev-secret-do-not-use-in-production"`
- `app/api/onboarding/upgrade-live/route.ts:46` — `process.env.ETA_ENCRYPTION_KEY || "default-key-32-chars-long!!!!!"`
- `lib/api-utils.ts:41` — `process.env[envName] || (production ? undefined : "dev-key-insecure")`
- `lib/invo/config.ts:10` — `process.env.INVO_SERVICE_KEY || "dev-key-insecure"`
- `app/api/v1/factoring/credit-lines/route.ts:96` — `process.env.INVO_SERVICE_KEY || "dev-key-insecure"`

**Issue:** Multiple critical secrets have hardcoded fallback values. In `middleware.ts`, if `SESSION_SECRET` is unset in production, the fallback is an empty string — meaning the JWT signing key is effectively zero-length. In `upgrade-live/route.ts`, the ETA encryption key falls back to `"default-key-32-chars-long!!!!!"` — a publicly visible default. Any attacker can decrypt all ETA client secrets stored with this key.

**Impact:** Complete session forgery, ETA credential decryption, and service-key impersonation.

**Recommendation:** 
- Remove all hardcoded fallbacks. Fail hard in production if secrets are missing.
- `lib/session.ts` already does this correctly — enforce the same pattern everywhere.
- Add a startup validation script that checks all required env vars.

---

#### C2: ETA Soft-HSM Signing Uses Predictable Key Material

**CVSS: 9.0 (Critical)**  
**File:** `lib/eta/signer.ts:145-156`

```typescript
const secureHmac = crypto.createHmac("sha256", tenantId)
  .update(hash)
  .digest("base64");
```

**Issue:** The Soft-HSM fallback uses `tenantId` as the HMAC key. TenantIds are CUIDs — predictable, enumerable, and not secret. An attacker who knows (or guesses) a tenantId can forge valid ETA signatures for that tenant's invoices. This completely undermines the ETA e-invoicing compliance guarantee.

**Impact:** Invoice forgery, ETA compliance violation, potential legal liability, and revenue loss.

**Recommendation:**
- Use a per-tenant cryptographically random signing key stored in a secure vault (e.g., AWS Secrets Manager, HashiCorp Vault).
- The Soft-HSM must generate and store a unique keypair per tenant at onboarding time.
- Consider using the hardware PKCS#11 path exclusively in production and failing closed if unavailable.

---

#### C3: Authority Matrix DB Rules Not Tenant-Scoped

**CVSS: 8.8 (Critical)**  
**File:** `lib/auth/authority-matrix.ts:243-250`

```typescript
const dbRules = await prisma.authorityRule.findMany({
  where: {
    isActive: true,
    minValue: { lte: order.total },
    maxValue: { gte: order.total },
  },
  orderBy: { priority: "desc" },
});
```

**Issue:** Authority rules are fetched without a `tenantId` filter. A tenant-specific rule created by Tenant A could apply to Tenant B's orders. This violates the G1 Guardrail (tenant isolation) and could allow a low-value order to bypass approval chains intended for a different tenant's governance.

**Impact:** Cross-tenant governance bypass, unauthorized order approvals.

**Recommendation:**
- Add `tenantId: ctx.tenantId` to the `where` clause (or use `OR: [{ tenantId: ctx.tenantId }, { tenantId: null }]` for global rules).
- Add integration tests that verify tenant A's rules never affect tenant B.

---

#### C4: No Refresh Token Rotation — Old Tokens Valid After Refresh

**CVSS: 8.5 (Critical)**  
**File:** `app/api/v1/auth/refresh/route.ts:6-38`

**Issue:** The refresh endpoint issues a new JWT but does **not** revoke the old one. The old token remains valid for its full 24-hour lifetime. If a token is stolen, refreshing it does not invalidate the compromised token. This defeats the purpose of token refresh.

**Impact:** Stolen tokens remain usable for up to 24 hours even after the user refreshes.

**Recommendation:**
- Implement refresh token rotation: revoke the old token on refresh.
- Use a refresh token table with `family` tracking to detect token reuse.
- Consider short-lived access tokens (15 min) + long-lived refresh tokens (7 days) with rotation.

---

#### C5: File Upload — Extension Spoofing & Missing Content-Type Verification

**CVSS: 8.2 (Critical)**  
**File:** `app/api/v1/upload/route.ts:60-68`

```typescript
const ext = file.name.split(".").pop() || "jpg";
const filename = `${uniqueId}.${ext}`;
await writeFile(join(UPLOAD_DIR, filename), buffer);
```

**Issue:** The file extension is derived directly from `file.name` without validating it matches the actual MIME type. An attacker can upload a file named `malicious.jpg` that is actually an HTML file (stored as `.jpg`), or use double extensions. More critically, if the server ever serves these files with a permissive Content-Type, XSS is possible. There's also no validation that the extension is in the allowed set (only MIME type is checked).

**Impact:** Stored XSS via uploaded files, server storage abuse, potential RCE if files are served unsafely.

**Recommendation:**
- Validate the extension against an explicit allowlist: `["jpg", "jpeg", "png", "webp", "gif"]`.
- Strip the original filename entirely — use only the generated UUID + validated extension.
- Consider serving uploads from a separate domain/CDN with strict Content-Type headers.
- Add magic-byte (file signature) validation to confirm actual file type.

---

#### C6: In-Memory Rate Limiting Fails Open Under Load

**CVSS: 8.0 (Critical)**  
**File:** `lib/security/rate-limiter.ts:76-84`

```typescript
} catch (rlRejected) {
  if (rlRejected instanceof RateLimiterRes) {
    return { allowed: false, retryAfter: ... };
  }
  // Unknown error — fail closed (allow)
  return { allowed: true };
}
```

**Issue:** The `RateLimiterMemory` instance is per-process. In a multi-instance deployment (Vercel, Kubernetes), each instance has its own counter — an attacker can distribute requests across instances to bypass limits entirely. When Redis is unavailable, the `lib/redis.ts` fallback is also in-memory, which means all rate limiting degrades to per-process counters.

**Impact:** Brute force attacks, credential stuffing, API abuse.

**Recommendation:**
- Use Redis-backed rate limiting in production (`RateLimiterRedis`).
- Consider Vercel Edge rate limiting or a CDN-level rate limiter for the edge layer.
- Add monitoring alerts when Redis is unavailable.

---

### HIGH — CVSS 7.0–8.9

---

#### H1: CSP Allows `unsafe-inline` and `unsafe-eval` for Scripts

**CVSS: 7.5 (High)**  
**File:** `middleware.ts:148`

```typescript
"script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
```

**Issue:** `unsafe-inline` and `unsafe-eval` in the script-src directive significantly weaken CSP. While Next.js requires `unsafe-inline` for styles, `unsafe-eval` for scripts enables XSS via `eval()`. This effectively renders CSP non-protective against XSS.

**Impact:** Cross-site scripting attacks bypass CSP.

**Recommendation:**
- Use nonce-based CSP: generate a per-request nonce and include it in the CSP header and script tags.
- Remove `unsafe-eval` by configuring Next.js to not use eval in production builds.
- Use `next/script` with `strategy="afterInteractive"` to avoid inline scripts.

---

#### H2: Session Token Passed in `x-session-token` Header

**CVSS: 7.3 (High)**  
**Files:**
- `middleware.ts:207,245`
- `next.config.ts:51` (CORS allows `x-session-token`)

**Issue:** The session JWT is forwarded to downstream handlers via the `x-session-token` request header. This header is also explicitly allowed in the CORS configuration. If any downstream service logs request headers (e.g., load balancer, CDN, API gateway), the token is exposed. Additionally, allowing `x-session-token` in CORS means JavaScript on any page can read it.

**Impact:** Session token leakage through logs, intermediary services, or CORS-enabled pages.

**Recommendation:**
- Pass the session internally via `request.headers.set()` only (already done) but do NOT expose it in CORS headers.
- Remove `x-session-token` from `Access-Control-Allow-Headers` in `next.config.ts`.
- Consider using encrypted httpOnly cookies exclusively (already the primary mechanism) and not forwarding the token in headers at all.

---

#### H3: JWT Secret Not Validated at Startup in Middleware

**CVSS: 7.2 (High)**  
**File:** `middleware.ts:14-16`

```typescript
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev-secret-change-in-production")
);
```

**Issue:** In production, if `SESSION_SECRET` is missing, the secret becomes an empty string. The middleware module is loaded once at server start — the empty-string secret is cached. All JWTs signed/verified by the middleware use this weak key. Unlike `lib/session.ts` which throws, the middleware silently degrades.

**Impact:** Complete session forgery if env var is missing in production.

**Recommendation:**
- Throw at module load time if `SESSION_SECRET` is not set in production (matching `lib/session.ts` behavior).
- Add a startup validation script.

---

#### H4: Password Reset Token Not Immediately Invalidated After Use

**CVSS: 7.1 (High)**  
**File:** `app/api/v1/auth/reset-password/route.ts:20-48`

**Issue:** The reset token is looked up, then the password is updated, then the token is deleted — but not in a transaction. If the process crashes between update and delete, the token remains valid. Additionally, there's no rate limiting on the reset-password endpoint itself (only on forgot-password).

**Impact:** Password reset token reuse, account takeover.

**Recommendation:**
- Wrap the password update + token deletion in a Prisma transaction.
- Add rate limiting to the reset-password endpoint (e.g., 5 attempts/hour per token).
- Invalidate all existing sessions for the user on password change.

---

#### H5: In-Memory Idempotency Store — Duplicate Transactions Under Concurrency

**CVSS: 7.0 (High)**  
**Files:**
- `lib/security/idempotency.ts:12` — `const idempotencyStore = new Map<>()`
- `lib/redis.ts:80-101` — `memoryIdempotency` fallback

**Issue:** The idempotency store degrades to in-memory `Map` when Redis is unavailable. In a multi-instance deployment, each instance has its own map — duplicate financial transactions can occur. Even with Redis, the `lib/redis.ts` fallback uses in-memory stores that are per-process.

**Impact:** Duplicate financial transactions, double-charging, accounting discrepancies.

**Recommendation:**
- Make Redis mandatory for financial operations — do not fall back to in-memory.
- Add a database-backed idempotency table as a final safety net.
- Monitor for duplicate transaction alerts.

---

#### H6: Admin Override Allows Cross-Tenant `authorizerId` and `coAuthorizerId`

**CVSS: 7.0 (High)**  
**File:** `app/api/v1/admin/authority-override/route.ts:10-11`

```typescript
authorizerId: z.string().cuid(),
coAuthorizerId: z.string().cuid(),
```

**Issue:** The `authorizerId` and `coAuthorizerId` are client-provided CUIDs. The route only checks `requirePermission(auth, "admin:override_authority")` on the authenticated user — it does NOT verify that `authorizerId === auth.userId`. An admin could pass any user ID as the authorizer, potentially impersonating another admin.

**Impact:** Admin impersonation, dual-authorization bypass.

**Recommendation:**
- Set `authorizerId` to `auth.userId` server-side, never from the request body.
- Verify `coAuthorizerId` belongs to the same tenant and has admin privileges.

---

#### H7: No CSRF Protection on State-Changing API Routes

**CVSS: 7.0 (High)**  
**Files:** All `app/api/v1/**/route.ts` files

**Issue:** The application uses `sameSite: "lax"` cookies, which provides partial CSRF protection. However, all POST routes accept JSON bodies, and there is no CSRF token mechanism. The `sameSite: "lax"` setting allows GET requests to carry cookies — and if any state-changing operation is exposed via GET, CSRF is possible. Additionally, the `x-session-token` header in CORS allows cross-origin JavaScript to authenticate.

**Impact:** Cross-site request forgery for state-changing operations.

**Recommendation:**
- Implement CSRF tokens for all state-changing operations.
- Consider `sameSite: "strict"` for session cookies.
- Ensure no state-changing operations accept GET requests.

---

#### H8: Password Minimum Length Only 6 Characters

**CVSS: 7.0 (High)**  
**File:** `lib/zod.ts:244,253,295`

```typescript
password: z.string().min(6, "Password must be at least 6 characters"),
```

**Issue:** A minimum password length of 6 characters is below OWASP 2024 recommendations (minimum 8, recommended 12+). Combined with bcrypt's 12 rounds, this is partially mitigated, but weak passwords are still vulnerable to offline brute force if the bcrypt hash is ever leaked.

**Impact:** Account takeover via brute force of weak passwords.

**Recommendation:**
- Increase minimum password length to 8 characters (12 recommended).
- Add password complexity requirements (uppercase, lowercase, number, symbol).
- Consider integrating a password breach database (Have I Been Pwned API).

---

### MEDIUM — CVSS 4.0–6.9

---

#### M1: `dangerouslySetInnerHTML` in Root Layout

**CVSS: 6.5 (Medium)**  
**File:** `app/layout.tsx:144-169`

**Issue:** The root layout uses `dangerouslySetInnerHTML` for theme detection and service worker registration. While the content is static (no user input), this pattern is inherently risky — if any user-controlled data ever reaches this code path, XSS is guaranteed.

**Impact:** Potential XSS if content becomes dynamic.

**Recommendation:**
- Keep the inline script static and add ESLint rules to flag `dangerouslySetInnerHTML` usage.
- Consider moving to a Next.js middleware-based theme detection approach.

---

#### M2: `dangerouslySetInnerHTML` for JSON-LD in Marketing Layout

**CVSS: 6.0 (Medium)**  
**File:** `app/(marketing)/layout.tsx:107`

```typescript
dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
```

**Issue:** JSON-LD is serialized via `JSON.stringify`. If `JSON_LD` contains user-controlled data (e.g., from a CMS), this could allow XSS via script injection in structured data.

**Impact:** XSS via JSON-LD injection.

**Recommendation:**
- Ensure `JSON_LD` is always static or sanitized before serialization.
- Use a JSON-LD library that escapes output properly.

---

#### M3: CORS Wildcard Fallback

**CVSS: 6.0 (Medium)**  
**File:** `next.config.ts:43`

```typescript
value: process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_APP_URL || "*",
```

**Issue:** If neither `VERCEL_URL` nor `NEXT_PUBLIC_APP_URL` is set, the CORS origin defaults to `*` — allowing any website to make authenticated requests to the AI streaming endpoints.

**Impact:** Cross-origin data theft, AI assistant abuse.

**Recommendation:**
- Never use `*` as a CORS origin for authenticated endpoints.
- Fail closed — return an error if neither env var is set.

---

#### M4: `dev-key-insecure` Service Key Active in Non-Production

**CVSS: 5.5 (Medium)**  
**Files:**
- `lib/api-utils.ts:41`
- `lib/invo/config.ts:10`
- `app/api/v1/factoring/credit-lines/route.ts:96`

**Issue:** The service key falls back to `"dev-key-insecure"` in non-production environments. If a developer accidentally deploys to staging with this fallback, the INVO API is completely unprotected.

**Impact:** Unauthorized access to INVO service in staging/dev environments.

**Recommendation:**
- Require explicit service key configuration even in dev (use a `.env` file).
- Add a startup warning when using the insecure fallback.

---

#### M5: No Session Revocation on Password Change

**CVSS: 5.5 (Medium)**  
**File:** `app/api/v1/auth/reset-password/route.ts:41-65`

**Issue:** After a password reset, the old session is not invalidated. The user gets a new session token, but any existing session (potentially belonging to an attacker) remains valid.

**Impact:** Attacker maintains access after password reset.

**Recommendation:**
- Blacklist all tokens for the `userId` on password change.
- Add a `tokenVersion` field to the User model and include it in the JWT.

---

#### M6: Password Reset Token Not Tokenized (Stored in DB as Plaintext)

**CVSS: 5.0 (Medium)**  
**File:** `app/api/v1/auth/forgot-password/route.ts:40-46`

**Issue:** The password reset token is stored directly in the database. If the database is compromised, all active reset tokens are exposed. Best practice is to store only a hash of the token.

**Impact:** Account takeover if database is compromised.

**Recommendation:**
- Store only `sha256(token)` in the database.
- Compare by hashing the incoming token and looking up the hash.

---

#### M7: In-Memory Fallback Stores Are Process-Local

**CVSS: 5.0 (Medium)**  
**File:** `lib/redis.ts:16-19`

```typescript
const memoryIdempotency = new Map<...>();
const memoryRateLimits = new Map<...>();
const memorySessions = new Map<...>();
const memoryEvents = new Map<...>();
```

**Issue:** All fallback stores are per-process. In a multi-instance deployment (Vercel serverless, Kubernetes pods), these stores are not shared — rate limiting, idempotency, and session caching are ineffective.

**Impact:** Rate limiting bypass, duplicate transactions, session inconsistency.

**Recommendation:**
- Treat Redis as a required dependency for production.
- Add health checks that fail the deployment if Redis is unreachable.
- Use database-backed fallbacks for critical operations (idempotency).

---

#### M8: Token Blacklist Stored in Memory as Fallback

**CVSS: 5.0 (Medium)**  
**File:** `lib/session.ts:19`

```typescript
const memoryBlacklist = new Set<string>();
```

**Issue:** When Redis is unavailable, token revocation falls back to an in-memory `Set`. This means: (1) revoked tokens work on other instances, (2) tokens are "un-revoked" on process restart.

**Impact:** Revoked sessions remain usable.

**Recommendation:**
- Use a database-backed token blacklist as fallback.
- Add monitoring for Redis unavailability.

---

#### M9: `$queryRaw` Usage in Production Code

**CVSS: 4.5 (Medium)**  
**Files:**
- `lib/auth/authority-matrix.ts:493-498`
- `lib/fintech/factoring-orchestrator.ts:588`
- `app/api/v1/suppliers/[id]/shared.ts:24`

**Issue:** Raw SQL queries are used for `FOR UPDATE` row locking. While these specific instances use Prisma template literals (which parameterize), the pattern is risky — any future modification that interpolates user input into raw queries would create SQL injection.

**Impact:** Potential SQL injection if template literal usage changes.

**Recommendation:**
- Add ESLint rules to flag `$queryRaw` usage.
- Document that all `$queryRaw` calls must use Prisma template literals.
- Consider using Prisma's `$transaction` with `maxWait`/`timeout` instead of raw locking.

---

### LOW — CVSS 0.1–3.9

---

#### L1: HS256 Algorithm Used for JWT Signing

**CVSS: 3.0 (Low)**  
**File:** `lib/session.ts:53`

```typescript
.setProtectedHeader({ alg: "HS256" })
```

**Issue:** HS256 (symmetric) requires the same secret for signing and verification. RS256 (asymmetric) is generally preferred for B2B fintech because the signing key can be kept secret while the verification key is public.

**Impact:** If the signing secret is leaked, anyone can forge tokens.

**Recommendation:**
- Consider migrating to RS256 or ES256 for asymmetric signing.
- At minimum, ensure the session secret is rotated periodically.

---

#### L2: Cookie `maxAge` Not Aligned with Token Expiry

**CVSS: 2.5 (Low)**  
**File:** `lib/session.ts:55,64`

```typescript
.setExpirationTime("24h")  // JWT expiry
maxAge: 60 * 60 * 24,      // Cookie maxAge = 24 hours
```

**Issue:** Both are 24 hours, which is fine — but the `maxAge` should be slightly shorter than the JWT expiry to avoid the cookie persisting after the JWT is expired.

**Impact:** Minor UX issue — expired JWT cookie still present.

**Recommendation:**
- Set `maxAge` to 23 hours (slightly less than the 24h JWT expiry).

---

#### L3: `x-forwarded-for` Header Used Without Validation

**CVSS: 2.5 (Low)**  
**Files:**
- `app/api/v1/auth/login/route.ts:11`
- `lib/security/rate-limiter.ts:46-48`

**Issue:** `x-forwarded-for` is a client-spoofable header. If the application is not behind a trusted proxy that strips/overwrites this header, attackers can spoof their IP to bypass rate limiting.

**Impact:** Rate limiting bypass via IP spoofing.

**Recommendation:**
- Configure nginx/cloudflare to overwrite `x-forwarded-for` with the actual client IP.
- Use the rightmost untrusted IP in the chain.

---

#### L4: No HSTS Header Set

**CVSS: 2.0 (Low)**  
**File:** `middleware.ts:136-157`

**Issue:** The security headers include `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and CSP — but `Strict-Transport-Security` (HSTS) is missing.

**Impact:** Potential downgrade attacks from HTTPS to HTTP.

**Recommendation:**
- Add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` in the middleware.

---

#### L5: No `X-Permitted-Cross-Domain-Policies` Header

**CVSS: 1.5 (Low)**  
**File:** `middleware.ts:136-157`

**Issue:** Missing Flash/PDF cross-domain policy header. While less relevant in modern browsers, it's a defense-in-depth measure.

**Impact:** Legacy cross-domain data leakage.

**Recommendation:**
- Add `X-Permitted-Cross-Domain-Policies: none`.

---

#### L6: Bcrypt Salt Rounds Reduced in Test Environment

**CVSS: 1.0 (Low)**  
**File:** `lib/auth.ts:3`

```typescript
const SALT_ROUNDS = process.env.NODE_ENV === "test" ? 4 : 12;
```

**Issue:** Test environments use 4 salt rounds instead of 12. If test databases are ever exposed or shared, password hashes are weak.

**Impact:** Weak password hashes in test environments.

**Recommendation:**
- Use 12 rounds universally, even in tests. The performance difference is negligible for test workloads.

---

#### L7: `execSync` Used in Setup Scripts

**CVSS: 1.0 (Low)**  
**File:** `scripts/setup-remote-db.ts:31-38`

```typescript
execSync("npx prisma db push --accept-data-loss", { ... });
```

**Issue:** `execSync` with string commands is vulnerable to command injection if any user-controlled input reaches the command. Currently safe (no user input), but the pattern is risky for future modifications.

**Impact:** Command injection if user input is ever interpolated.

**Recommendation:**
- Use `execFileSync` with argument arrays instead of string interpolation.
- Add input validation before any `execSync` call.

---

#### L8: `lib/auth/index.ts` Missing — Exported Functions Used

**CVSS: 0.5 (Low)**  
**Files:**
- `app/api/v1/auth/login/route.ts:3` — `import { verifyPassword } from "@/lib/auth"`
- `app/api/v1/auth/register/route.ts:3` — `import { hashPassword } from "@/lib/auth"`

**Issue:** The `lib/auth/index.ts` barrel file does not exist. These imports resolve to `lib/auth.ts` (the file at the root). While this works, it means the `lib/auth/` directory and `lib/auth.ts` coexist — a confusing structure that could lead to import errors.

**Impact:** Developer confusion, potential import resolution issues.

**Recommendation:**
- Consolidate `lib/auth.ts` into `lib/auth/index.ts` or move it to a clear location.

---

#### L9: `bcryptjs` v3.0.3 — Verify Library Version

**CVSS: 0.5 (Low)**  
**File:** `package.json:39`

```json
"bcryptjs": "^3.0.3"
```

**Issue:** `bcryptjs` v3.x is a pure-JS implementation. While functionally correct, it's slower than native `bcrypt` bindings. For a high-traffic login endpoint, this could be a performance concern.

**Impact:** Slightly slower password hashing.

**Recommendation:**
- Monitor login latency. If needed, switch to `bcrypt` (native bindings) or `argon2`.

---

## Summary of Recommendations (Priority Order)

### Immediate (Critical — Fix Before Production)

1. **Remove all hardcoded secret fallbacks** — fail hard if env vars are missing.
2. **Replace ETA Soft-HSM tenantId-based signing** with per-tenant cryptographic keys.
3. **Add tenant scoping to Authority Matrix DB rule queries.**
4. **Implement refresh token rotation** with old token revocation.
5. **Validate file extensions** against an allowlist; strip original filenames.
6. **Make Redis mandatory** for financial operations (idempotency, rate limiting).

### Short-Term (High — Fix Within 2 Weeks)

7. **Remove `unsafe-eval` from CSP** — use nonce-based CSP.
8. **Remove `x-session-token` from CORS Allow-Headers.**
9. **Add rate limiting to password reset endpoint.**
10. **Wrap password reset in a transaction** with immediate token deletion.
11. **Set `authorizerId` server-side** in admin override route.
12. **Increase password minimum length** to 8 characters.

### Medium-Term (Medium — Fix Within 1 Month)

13. **Add HSTS header** to all responses.
14. **Implement CSRF tokens** for state-changing operations.
15. **Hash password reset tokens** before storing in DB.
16. **Add database-backed token blacklist** as Redis fallback.
17. **Validate `x-forwarded-for`** at the proxy layer.

### Long-Term (Low — Backlog)

18. Migrate from HS256 to RS256 for JWT signing.
19. Add a startup validation script for all required env vars.
20. Integrate Have I Been Pwned API for password breach checking.

---

## Positive Observations

The codebase demonstrates strong security fundamentals:

| Control | Status | Quality |
|---|---|---|
| JWT Session Management | Implemented | Good (jose library) |
| Password Hashing (bcrypt) | Implemented | Good (12 rounds) |
| RBAC with Permission Codes | Implemented | Excellent |
| Tenant Isolation Helpers | Implemented | Good |
| Tamper-Proof Audit Log (Hash Chain) | Implemented | Excellent |
| HMAC Webhook Verification (ETA) | Implemented | Excellent (timing-safe) |
| Rate Limiting | Implemented | Partial (in-memory fallback) |
| Zod Input Validation | Implemented | Good |
| Security Event Logger | Implemented | Good |
| Admin Override Dual Authorization | Implemented | Good |
| Authority Matrix with DB Rules | Implemented | Good (needs tenant scoping) |
| Idempotency for Financial Mutations | Implemented | Good (Redis fallback needed) |

---

## Appendix: Files Audited

| File | Category |
|---|---|
| `middleware.ts` | Authentication, CSP, Route Guards |
| `lib/session.ts` | JWT, Session Management |
| `lib/auth.ts` | Password Hashing |
| `lib/auth/rbac.ts` | Authorization |
| `lib/auth/server-auth.ts` | Server-Side Auth |
| `lib/auth/authority-matrix.ts` | Governance |
| `lib/tenant/scope.ts` | Tenant Isolation |
| `lib/api-utils.ts` | API Framework |
| `lib/redis.ts` | Rate Limiting, Idempotency |
| `lib/security/rate-limiter.ts` | Rate Limiting |
| `lib/security/idempotency.ts` | Idempotency |
| `lib/security/security-logger.ts` | Security Logging |
| `lib/eta/signer.ts` | Cryptographic Signing |
| `lib/eta/client.ts` | ETA API Client |
| `lib/fintech/risk-engine.ts` | Risk Assessment |
| `lib/fintech/factoring-orchestrator.ts` | Financial Operations |
| `lib/audit/tamper-proof.ts` | Audit Trail |
| `app/api/v1/auth/login/route.ts` | Authentication |
| `app/api/v1/auth/register/route.ts` | User Registration |
| `app/api/v1/auth/refresh/route.ts` | Token Refresh |
| `app/api/v1/auth/forgot-password/route.ts` | Password Reset |
| `app/api/v1/auth/reset-password/route.ts` | Password Reset |
| `app/api/v1/admin/authority-override/route.ts` | Admin Override |
| `app/api/v1/eta/callback/route.ts` | ETA Webhook |
| `app/api/v1/upload/route.ts` | File Upload |
| `app/api/onboarding/upgrade-live/route.ts` | Tenant Upgrade |
| `next.config.ts` | CORS, Headers |
| `middleware.ts` | Security Headers |
| `package.json` | Dependencies |
| `Dockerfile` | Container Security |

---

*End of Cybersecurity Audit Report*
