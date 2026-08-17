# IT General Controls (ITGC) Audit Report

**HotelsVendors Digital Procurement Hub**
**Audit Date:** 2026-07-14
**Auditor Role:** IT General Controls (ITGC) Auditor
**Scope:** IT environment, access controls, change management, logical security, data integrity, separation of duties, audit trail, system operations, problem management, physical security, asset management
**Codebase:** `/Users/Moataz/Documents/GitHub/hotels-vendors`

---

## Executive Summary

The HotelsVendors platform demonstrates a **moderately mature** ITGC posture with strong architectural intent but significant implementation gaps. The codebase has comprehensive security *design documents* and guardrail specifications (AGENTS.md, Fortress Protocol, Authority Matrix) but multiple critical controls are incomplete, stubbed out, or disabled. The platform is at a stage where governance *architecture* exists but *enforcement* is uneven.

**Overall Risk Rating: MEDIUM-HIGH**

| Category | Rating | Summary |
|---|---|---|
| Access Controls | **MEDIUM** | JWT sessions + RBAC implemented; MFA stubbed; no password policy enforcement |
| Change Management | **HIGH** | No CI/CD pipeline; no branch protection; no code review enforcement |
| Logical Security | **MEDIUM** | CSP + TLS configured; CSRF absent; CORS not configured; security headers dual-applied |
| Data Integrity | **MEDIUM** | Zod validation present but password minimum is 6 chars; Prisma schema well-designed |
| Separation of Duties | **LOW** | Authority Matrix with dual-authorization; self-approval not blocked at code level |
| Audit Trail | **LOW** | Tamper-proof hash chain logging; but fallback to console.error on failure |
| System Operations | **MEDIUM** | PM2 + nginx configured; no log rotation; no disk monitoring |
| Problem Management | **MEDIUM** | Sentry integrated; no alerting escalation; no runbooks |
| Physical Security | **MEDIUM** | UFW firewall; SSH key management documented but not enforced |
| Asset Management | **LOW** | No dependency audit tooling; no license scanning |

---

## 1. Access Controls

### Finding AC-01: JWT Session Secret Falls Back to Hardcoded Dev Secret
**Severity: CRITICAL**
**File:** `middleware.ts:14-16`

```typescript
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev-secret-change-in-production")
);
```

**Issue:** If `SESSION_SECRET` is unset in production, the middleware encodes an empty string as the JWT signing key. Any attacker could forge valid session tokens. The `lib/session.ts:8-13` correctly throws an error in production, but the middleware does NOT — it silently accepts an empty secret.

**Risk:** Complete session hijacking if `SESSION_SECRET` is missing from the production environment.

**Recommendation:** Align middleware behavior with `lib/session.ts` — throw or reject in production if `SESSION_SECRET` is not set.

---

### Finding AC-02: No Password Complexity Policy
**Severity: HIGH**
**File:** `lib/zod.ts:244, 253, 295`

```typescript
password: z.string().min(6, "Password must be at least 6 characters"),
password: z.string().min(6),
password: z.string().min(1, "Password is required"),
```

**Issue:** Registration schemas require only 6 characters. Login requires only 1 character (password check). No enforcement of uppercase, lowercase, digits, or special characters. No check against common breached passwords.

**Risk:** Weak passwords are trivially brute-forced, especially given the rate limiter is IP-based (shared IPs behind NAT/proxy bypass limits).

**Recommendation:** Enforce minimum 12 characters, require mixed case + digits, integrate `zxcvbn` or similar for breach-password checking.

---

### Finding AC-03: MFA is Fully Stubbed — Not Operational
**Severity: HIGH**
**File:** `lib/security/fortress.ts:567-594`

The `lib/security/mfa.ts` file provides TOTP generation and verification functions. However:
- No MFA enrollment endpoint exists in `app/api/v1/auth/`
- No MFA challenge is issued during login (`app/api/v1/auth/login/route.ts` does not check MFA)
- The `getStoredFingerprint` function in `lib/security/fortress.ts:568` returns `null` always
- The `invalidateAllSessions` function at line 576 only sets `lastActive` to epoch — does not actually invalidate tokens

**Risk:** Admin accounts lack second-factor protection despite the security design requiring MFA for ADMIN and FINANCIAL_CONTROLLER roles.

**Recommendation:** Implement MFA enrollment + challenge flow. Add TOTP verification to login route. Store session fingerprints in Redis.

---

### Finding AC-04: Rate Limiting Falls Back to In-Memory (Non-Persistent)
**Severity: MEDIUM**
**Files:** `lib/redis.ts:60-70`, `lib/security/rate-limiter.ts:7-9`

Both rate limiters (`lib/redis.ts` and `lib/security/rate-limiter.ts`) fall back to in-memory storage when Redis is unavailable. In a multi-instance deployment (PM2 cluster mode with `instances: "max"`), each worker has its own memory space, allowing attackers to bypass rate limits by distributing requests across workers.

**Risk:** Brute-force and enumeration attacks are not effectively rate-limited in clustered production.

**Recommendation:** Use Redis-backed rate limiter exclusively in production. Fail-closed (reject) if Redis is unavailable.

---

### Finding AC-05: Session Cookie Missing Domain Restriction
**Severity: LOW**
**File:** `lib/session.ts:59-65`

```typescript
cookieStore.set(SESSION_COOKIE, token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24,
});
```

**Issue:** Cookie is set with `sameSite: "lax"` (correct for B2B). However, no `domain` attribute is set, meaning the cookie is scoped to the exact host. This is acceptable but should be explicitly set for the production domain.

**Recommendation:** Add `domain: ".hotelsvendors.com"` for shared session across subdomains (e.g., `invo.hotelsvendors.com`).

---

## 2. Change Management

### Finding CM-01: No CI/CD Pipeline Exists
**Severity: CRITICAL**
**Files:** `.github/workflows/` — **does not exist**

No GitHub Actions workflows, no automated testing, no lint checks, no type-checking, no build verification before deployment. The `.gitignore` at line 44 excludes `/app/generated/prisma` but there's no workflow to regenerate it.

**Risk:** Code with type errors, lint violations, broken builds, or missing Prisma client can be deployed directly to production.

**Recommendation:** Create `.github/workflows/ci.yml` with: `npm run lint`, `npm run typecheck`, `npx prisma generate`, `npm run build` on every PR.

---

### Finding CM-02: No Branch Protection Rules
**Severity: HIGH**
**Evidence:** No `.github/CODEOWNERS`, no `.github/pull_request_template.md`, no CODEOWNERS file.

**Issue:** Anyone with push access to `main` can deploy directly without code review. The deploy scripts (`deploy/hostinger-deploy.sh`, `deploy/deploy.sh`) pull from `main` directly.

**Risk:** Unreviewed or malicious code can reach production without any gate.

**Recommendation:** Enable branch protection on `main`: require PR reviews (minimum 1), require status checks (CI), require linear history.

---

### Finding CM-03: No Automated Tests in CI
**Severity: MEDIUM**
**File:** `tests/api/auth.test.ts` exists but no test runner configuration found in `package.json` scripts.

**Issue:** A test file exists for auth but there's no evidence it runs in any automated pipeline.

**Risk:** Regressions in authentication, authorization, or financial logic ship undetected.

**Recommendation:** Add test runner (Jest/Vitest) to `package.json`, integrate into CI pipeline.

---

## 3. Logical Security

### Finding LS-01: CSP Allows `unsafe-inline` and `unsafe-eval`
**Severity: MEDIUM**
**File:** `middleware.ts:146-156`

```typescript
"script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
```

**Issue:** CSP allows `unsafe-inline` and `unsafe-eval` for scripts, which significantly weakens XSS protection. While Next.js requires these for development, they should not be present in production CSP.

**Risk:** An attacker who finds any XSS vector bypasses CSP entirely.

**Recommendation:** Use nonce-based CSP for inline scripts. Remove `unsafe-eval` in production. Use Next.js `strict-dynamic` with nonces.

---

### Finding LS-02: No CORS Configuration
**Severity: MEDIUM**
**Evidence:** No CORS headers are set in `middleware.ts`, `vercel.json`, or `deploy/nginx.conf`. The `connect-src 'self'` in CSP provides some restriction, but no explicit CORS policy exists.

**Issue:** API routes accept requests from any origin if the browser allows it. While `SameSite: lax` cookies provide some CSRF protection, explicit CORS headers would provide defense-in-depth.

**Risk:** Cross-origin API requests may succeed from attacker-controlled pages.

**Recommendation:** Add explicit CORS headers in middleware for `/api/*` routes restricting to trusted origins.

---

### Finding LS-03: Nginx Security Headers Incomplete
**Severity: LOW**
**File:** `deploy/nginx.conf:74-78`

Nginx sets `X-Frame-Options: SAMEORIGIN` but the middleware sets `X-Frame-Options: DENY` (middleware.ts:137). The middleware overwrites the nginx header, so the stricter value wins. However, nginx sets `X-XSS-Protection: 1; mode=block` which is deprecated and can be harmful in modern browsers.

**Recommendation:** Remove `X-XSS-Protection` from nginx (modern browsers ignore it; CSP is the replacement). Ensure `Permissions-Policy` is set in nginx as well.

---

### Finding LS-04: Webhook Routes Exempt from Authentication
**Severity: MEDIUM**
**File:** `middleware.ts:61`

```typescript
const PUBLIC_PREFIXES = [
  "/api/webhooks",
];
```

**Issue:** All webhook routes are completely public. Any caller can trigger webhook endpoints without authentication or HMAC verification. While webhooks from external services need to be callable, they should verify signatures (e.g., Stripe/Paymob webhook signatures).

**Risk:** An attacker can trigger webhook handlers with forged payloads.

**Recommendation:** Implement webhook signature verification for each provider (Paymob HMAC, etc.) in the webhook handler itself.

---

## 4. Data Integrity

### Finding DI-01: Zod Validation Coverage is Inconsistent
**Severity: MEDIUM**
**File:** `lib/zod.ts`

The schema file provides 305 lines of validation schemas. However:
- LoginSchema password requires only `z.string().min(1)` (line 295) — empty string check only
- RegisterSchema password requires `z.string().min(6)` — weak
- No email normalization (lowercase, trim)
- No SQL injection protection beyond parameterized Prisma queries

**Recommendation:** Normalize email to lowercase. Enforce strong password policy. Add `.trim()` to string fields.

---

### Finding DI-02: Prisma Schema Has Strong Referential Integrity
**Severity: LOW (Positive Finding)**
**File:** `prisma/schema.prisma`

The schema is well-designed:
- `Tenant` is the root of multi-tenant isolation with `onDelete: Cascade`
- `Role` → `RolePermission` → `Permission` many-to-many with cascade deletes
- `Order` → `OrderApproval` with proper foreign keys
- All monetary fields use `Float` (not ideal — `Decimal` would be more precise, but acceptable for MVP)
- Indexes on frequently queried fields (`@@index([entityType, entityId])`, `@@index([actorId])`, etc.)

**Recommendation:** Consider migrating `Float` monetary fields to `Decimal` for financial precision before production launch.

---

### Finding DI-03: ID Field Type is String (CUID) Not UUID
**Severity: LOW**
**File:** `prisma/schema.prisma:28`

All models use `String @id @default(cuid())`. CUIDs are sequential-ish and may leak creation order. UUIDs (v4) are more cryptographically secure for public-facing IDs.

**Recommendation:** Acceptable for MVP. Consider UUID for external-facing IDs in future.

---

## 5. Separation of Duties

### Finding SOD-01: Self-Approval Not Explicitly Blocked
**Severity: MEDIUM**
**File:** `lib/auth/authority-matrix.ts:400-440`

The `recordApproval` function records an approval action but does not check whether `approverId === requesterId`. The Authority Matrix routes orders to specific roles (GM, Financial Controller) based on rules, but a user with `canOverride: true` could theoretically approve their own order.

**Issue:** The `DUAL_SIGN_OFF` rule (line 127-138) requires two sign-offs, but the code does not verify the two signers are different people (the `adminOverride` function at line 478 does enforce `admin1.id === admin2.id` check).

**Risk:** A user with sufficient privileges could create and approve their own purchase order.

**Recommendation:** Add a check in `recordApproval` that `approverId !== order.requesterId`. For `DUAL_SIGN_OFF`, require two distinct approvers who are not the requester.

---

### Finding SOD-02: Admin Override Dual-Authorization is Well-Implemented
**Severity: LOW (Positive Finding)**
**File:** `lib/auth/authority-matrix.ts:460-565`

The `adminOverride` function correctly:
- Requires two distinct admin signatures (line 478-479)
- Validates minimum 20-character reason (line 464)
- Uses `SELECT FOR UPDATE` row locking (line 493-498)
- Writes before/after state to audit log (line 504-552)
- Uses a single database transaction for atomicity

This is a strong control.

---

## 6. Audit Trail

### Finding AT-01: Tamper-Proof Audit Log with Hash Chaining
**Severity: LOW (Positive Finding)**
**File:** `lib/audit/tamper-proof.ts`

The audit system implements SHA-256 hash chaining:
- Each entry includes `previousHash` (line 92)
- `verifyAuditChain()` validates the full chain (line 153-196)
- `exportAuditLog()` produces a Merkle-like root hash (line 228-231)

**Issue:** The `appendAuditEntry` function does a `findFirst` + `create` + `update` — three separate DB operations, not a single transaction. A crash between create and update leaves a "pending" hash entry.

**Recommendation:** Wrap the create + hash computation + update in a single `prisma.$transaction`.

---

### Finding AT-02: Audit Failure Swallowed Silently
**Severity: MEDIUM**
**File:** `lib/api-utils.ts:137-139`

```typescript
} catch {
  // Audit failure should not break the request, but log it somewhere
  console.error("Audit log failed:", params);
}
```

**Issue:** If the audit log write fails (DB down, connection error), the error is logged to console and the request continues. This means critical financial mutations can complete without an audit trail.

**Risk:** Undetected financial fraud or unauthorized changes with no record.

**Recommendation:** Write failed audit entries to a persistent dead-letter queue (Redis/DB) for manual review. Consider failing the request for monetary mutations.

---

### Finding AT-03: Security Logger Writes to stdout Only
**Severity: MEDIUM**
**File:** `lib/security/security-logger.ts:70-83`

```typescript
if (event.severity === "critical") {
  console.error(`[SECURITY-CRITICAL] ${logLine}`);
}
```

**Issue:** All security events are logged to stdout/stderr. In a containerized environment, this depends on the runtime collecting logs. No integration with a SIEM, no webhook alerting for critical events, no persistent storage.

**Risk:** Critical security events (tenant breaches, admin overrides) may be lost.

**Recommendation:** Add structured log output to a persistent store. For critical events, trigger webhook alerts (Slack/PagerDuty).

---

## 7. System Operations

### Finding SO-01: PM2 Configuration Has No Log Rotation
**Severity: MEDIUM**
**File:** `deploy/pm2-config.json`

```json
"error_file": "/var/log/hotelsvendors/error.log",
"out_file": "/var/log/hotelsvendors/out.log",
```

**Issue:** PM2 logs to files without rotation. Over time, these files grow unbounded, consuming disk space and making log analysis difficult.

**Recommendation:** Add `logrotate` configuration or use `pm2-logrotate` module. Set max size + compression.

---

### Finding SO-02: PM2 Memory Limit Set but No Disk Monitoring
**Severity: LOW**
**File:** `deploy/pm2-config.json:18`

```json
"max_memory_restart": "512M",
```

**Issue:** PM2 will restart the process at 512MB, which is reasonable. However, there's no disk space monitoring, no database connection pool monitoring, and no Redis health monitoring.

**Recommendation:** Add a health check endpoint (`/api/health`) that checks DB + Redis + disk. Add external monitoring (UptimeRobot, Datadog).

---

### Finding SO-03: Nginx Has No Client Body Size Limit
**Severity: LOW**
**File:** `deploy/nginx.conf`

**Issue:** No `client_max_body_size` directive in nginx. Default is 1MB, which is acceptable, but should be explicitly set to prevent large payload attacks.

**Recommendation:** Add `client_max_body_size 10m;` (or appropriate for file uploads).

---

## 8. Problem Management

### Finding PM-01: Sentry Integration Exists but Alerting is Not Configured
**Severity: MEDIUM**
**File:** `lib/sentry.ts`

Sentry is initialized and captures exceptions in `lib/api-utils.ts:151-154`. However:
- No `tracesSampleRate` tuning for production (currently 0.1 = 10%)
- No alert rules configured in code
- No integration with incident management

**Recommendation:** Configure Sentry alert rules for critical errors. Add performance monitoring. Set up on-call escalation.

---

### Finding PM-02: No Health Check Endpoint
**Severity: MEDIUM**
**Evidence:** `PUBLIC_PATHS` in `middleware.ts` includes `/api/health` but no route file exists at `app/api/health/route.ts`.

**Issue:** The health check endpoint is whitelisted but does not exist. Load balancers and monitoring tools have no way to verify the application is healthy.

**Recommendation:** Create `app/api/health/route.ts` that verifies database connectivity, Redis availability, and returns status.

---

## 9. Physical Security

### Finding PS-01: UFW Firewall Configuration is Sound
**Severity: LOW (Positive Finding)**
**File:** `deploy/ufw-setup.sh`

The UFW setup correctly:
- Denies all incoming by default (line 15)
- Allows only SSH (22), HTTP (80), HTTPS (443)
- Does NOT expose Ollama port 11434
- Allows Docker internal networks

---

### Finding PS-02: SSH Key Management Not Enforced
**Severity: MEDIUM**
**Evidence:** `.gitignore:44` excludes `.ssh/` directory. Deploy scripts (`deploy/hostinger-deploy.sh`) reference SSH keys but no documentation on key rotation, no key auditing, no SSH certificate authority.

**Recommendation:** Document SSH key rotation policy. Use SSH certificates or a secrets manager. Disable password authentication on the VPS.

---

## 10. Asset Management

### Finding AM-01: No Dependency Audit Tooling
**Severity: MEDIUM**
**Evidence:** No `npm audit` in CI, no Dependabot/Renovate config, no `.github/dependabot.yml`.

**Issue:** Dependencies are not automatically scanned for known vulnerabilities. The `package.json` uses `--legacy-peer-deps` which may mask dependency conflicts.

**Recommendation:** Enable Dependabot alerts. Add `npm audit --audit-level=high` to CI pipeline.

---

### Finding AM-02: License Compliance Not Tracked
**Severity: LOW**
**Evidence:** No `license-checker` or `license-report` in the project.

**Recommendation:** Add license scanning to CI to prevent copyleft license contamination.

---

## Risk Matrix

| ID | Finding | Severity | Likelihood | Impact | Risk Score |
|---|---|---|---|---|---|
| AC-01 | JWT secret fallback to empty string | CRITICAL | High | Critical | **Critical** |
| AC-02 | No password complexity policy | HIGH | High | High | **High** |
| AC-03 | MFA fully stubbed | HIGH | Medium | High | **High** |
| CM-01 | No CI/CD pipeline | CRITICAL | High | High | **Critical** |
| CM-02 | No branch protection | HIGH | High | Medium | **High** |
| LS-01 | CSP allows unsafe-inline/eval | MEDIUM | Medium | Medium | **Medium** |
| LS-04 | Webhook routes public | MEDIUM | Medium | Medium | **Medium** |
| AT-02 | Audit failure swallowed | MEDIUM | Low | High | **Medium** |
| SOD-01 | Self-approval not blocked | MEDIUM | Low | High | **Medium** |
| SO-01 | No log rotation | MEDIUM | High | Low | **Medium** |
| PM-02 | Health check missing | MEDIUM | Medium | Medium | **Medium** |
| AC-04 | Rate limiter in-memory fallback | MEDIUM | Medium | Medium | **Medium** |

---

## Recommendations (Priority Order)

### P0 — Immediate (Before Production Launch)
1. **Fix JWT secret fallback** in `middleware.ts` — reject empty secret in production
2. **Implement CI/CD pipeline** — lint, typecheck, build on every PR
3. **Enable branch protection** on `main`
4. **Enforce password policy** — minimum 12 chars, complexity requirements

### P1 — Short-Term (Within 30 Days)
5. **Implement MFA enrollment + challenge flow** for admin/financial roles
6. **Create health check endpoint** at `/api/health`
7. **Add CORS policy** for API routes
8. **Wrap audit log writes in transactions** for atomicity
9. **Block self-approval** in Authority Matrix
10. **Enable Dependabot** for dependency vulnerability scanning

### P2 — Medium-Term (Within 90 Days)
11. **Replace in-memory rate limiter** with Redis-only in production
12. **Add webhook signature verification** for Paymob and other providers
13. **Implement log rotation** for PM2 and nginx
14. **Add Sentry alerting** with escalation rules
15. **Remove `unsafe-eval` from production CSP** using nonces
16. **Add SIEM integration** for security event persistence

---

## Appendices

### Appendix A: Files Reviewed

| File | Lines | Purpose |
|---|---|---|
| `middleware.ts` | 289 | Edge auth, tenant injection, RBAC, security headers |
| `lib/auth.ts` | 14 | Password hashing (bcryptjs, 12 rounds) |
| `lib/auth/rbac.ts` | 98 | Permission checking engine |
| `lib/auth/authority-matrix.ts` | 625 | Order approval governance |
| `lib/auth/server-auth.ts` | 95 | Server-side auth helpers |
| `lib/auth/state-machine.ts` | 165 | Order status transition validation |
| `lib/session.ts` | 104 | JWT session creation/verification/blacklist |
| `lib/api-utils.ts` | 214 | API route wrapper, tenant isolation, audit |
| `lib/tenant/scope.ts` | 79 | Tenant-scoped query helpers |
| `lib/prisma.ts` | 18 | Prisma singleton |
| `lib/redis.ts` | 251 | Redis layer with memory fallback |
| `lib/zod.ts` | 305 | Input validation schemas |
| `lib/security/fortress.ts` | ~600 | Security orchestrator (largely stubbed) |
| `lib/security/mfa.ts` | 130 | TOTP implementation (not wired) |
| `lib/security/session-fingerprint.ts` | 100 | Device fingerprinting |
| `lib/security/api-guard.ts` | 130 | HMAC request signing |
| `lib/security/rate-limiter.ts` | 113 | Rate limiting (memory-based) |
| `lib/security/security-logger.ts` | 160 | Security event logging |
| `lib/audit/tamper-proof.ts` | 245 | Hash-chained audit log |
| `lib/sentry.ts` | 22 | Error tracking |
| `prisma/schema.prisma` | 2506 | Full database schema |
| `vercel.json` | 19 | Deployment config |
| `.env.example` | 32 | Environment template |
| `.gitignore` | 68 | Git exclusions |
| `deploy/nginx.conf` | 157 | Reverse proxy + TLS |
| `deploy/pm2-config.json` | 27 | Process management |
| `deploy/ufw-setup.sh` | 40 | Firewall setup |
| `app/api/v1/auth/login/route.ts` | 51 | Login endpoint |
| `app/api/v1/auth/register/route.ts` | 210 | Registration endpoint |

### Appendix B: Testing Performed

- Manual code review of all authentication flows
- Analysis of JWT session lifecycle (create, verify, revoke, blacklist)
- Review of RBAC permission checking logic
- Analysis of Authority Matrix evaluation and approval flows
- Audit of tamper-proof logging implementation
- Review of infrastructure configuration (nginx, PM2, UFW)
- Dependency and environment variable analysis

### Appendix C: Compliance Mapping

| Control | OWASP A01 | OWASP A02 | OWASP A04 | OWASP A05 | OWASP A07 | OWASP A09 |
|---|---|---|---|---|---|---|
| AC-01 (JWT secret) | ✗ | ✗ | | | | |
| AC-02 (Password) | ✗ | ✗ | | | | |
| AC-03 (MFA) | ✗ | ✗ | | | | |
| CM-01 (CI/CD) | | | ✗ | ✗ | | |
| LS-01 (CSP) | ✗ | ✗ | | | | |
| AT-02 (Audit) | | | | | | ✗ |

---

*Report generated by ITGC Auditor Agent — HotelsVendors Swarm*
*Next review: Upon P0 remediation completion*
