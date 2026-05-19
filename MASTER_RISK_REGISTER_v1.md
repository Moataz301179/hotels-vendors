# 🛡️ MASTER RISK REGISTER - Hotels-Vendors Platform Audit

**Audit Date:** 2026-05-19  
**Auditor:** Agent Zero (Security & Compliance Specialist)  
**Scope:** Security, Fintech Compliance, Infrastructure  
**Status:** ⬛⬛⬛ **2 P0 CRITICAL - BLOCKS PRODUCTION**  

---

## Executive Summary

| Category | P0 Critical | P1 High | P2 Medium | Total |
|----------|-------------|---------|-----------|-------|
| **Security** | 2 | 1 | 1 | 4 |
| **Fintech** | 1* | 0 | 1 | 2 |
| **Infrastructure** | 0 | 0 | 1 | 1 |
| **TOTAL** | **2** | **1** | **3** | **7** |

*Note: Fintech P0 is the same as Security P0 CR-002 (shared finding)

**🚨 PRODUCTION STATUS: BLOCKED**

**DO NOT DEPLOY** until all P0 findings are remediated.

---

## ⬛⬛⬛ P0 CRITICAL - IMMEDIATE ACTION REQUIRED

### CR-001: Hardcoded JWT Signing Secret

| **Attribute** | **Value** |
|----------------|-----------|
| **Risk ID** | CR-001 |
| **Severity** | CRITICAL (P0) |
| **Category** | Authentication / Cryptographic Failure |
| **CVSS 4.0** | 9.8 (Critical) |
| **OWASP** | A02:2021 – Cryptographic Failures |
| **CWE** | CWE-798 (Hardcoded Credentials) |

#### Location
```
File: lib/auth/session.ts:3-5
```

#### Vulnerable Code
```typescript
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "production-secure-key-rotation-pending"
);
```

#### Impact Assessment
| Impact Area | Severity | Description |
|-------------|----------|-------------|
| Authentication Bypass | **CRITICAL** | Complete bypass of all authentication controls |
| Session Hijacking | **CRITICAL** | Attackers can forge valid session tokens |
| Privilege Escalation | **CRITICAL** | Any user can become ADMIN |
| Multi-Tenancy Breach | **CRITICAL** | Cross-tenant data access via forged tokens |
| Data Exfiltration | **HIGH** | Access to all platform data |
| Financial Fraud | **HIGH** | Access to payment/factoring features |

#### Attack Vector
```
1. Attacker clones repository (public on GitHub)
2. Attacker extracts hardcoded secret from source
3. Attacker crafts JWT payload: {"userId": "admin-id", "platformRole": "ADMIN", "tenantId": "*"}
4. Attacker signs token with known secret using jose library
5. Attacker includes forged token in session_token cookie
6. Attacker accesses /dashboard/admin with full privileges
7. Complete platform compromise achieved
```

#### Remediation
```diff
// lib/auth/session.ts
- const SECRET = new TextEncoder().encode(
-   process.env.SESSION_SECRET || "production-secure-key-rotation-pending"
- );

+ const sessionSecret = process.env.SESSION_SECRET;
+ if (!sessionSecret) {
+   throw new Error(
+     'FATAL: SESSION_SECRET environment variable is required. ' +
+     'Application cannot start without secure session configuration.'
+   );
+ }
+ const SECRET = new TextEncoder().encode(sessionSecret);
```

#### Verification Testing
```bash
# 1. Verify app fails without SESSION_SECRET
unset SESSION_SECRET
npm run build  # Should FAIL with error

# 2. Verify with secure secret
export SESSION_SECRET="$(openssl rand -base64 64)"
npm run build  # Should succeed

# 3. Token forgery attempt should fail
curl -H "Authorization: Bearer FORGED_TOKEN" \
  https://your-app.com/api/v1/admin  # Should return 401
```

---

### CR-002: Hardcoded Webhook Secret (Financial Transaction Forgery)

| **Attribute** | **Value** |
|----------------|-----------|
| **Risk ID** | CR-002 |
| **Severity** | CRITICAL (P0) |
| **Category** | Fintech / Webhook Security |
| **CVSS 4.0** | 8.6 (High, elevation to Critical due to financial impact) |
| **OWASP** | A05:2021 – Security Misconfiguration |
| **CWE** | CWE-798 (Hardcoded Credentials) |

#### Location
```
File: app/api/v1/webhooks/factor/route.ts:6
```

#### Vulnerable Code
```typescript
const WEBHOOK_SECRET = process.env.FACTOR_WEBHOOK_SECRET || "production-secure-key-rotation-pending";
```

#### Impact Assessment
| Impact Area | Severity | Description |
|-------------|----------|-------------|
| Webhook Forgery | **CRITICAL** | Attackers can forge invoice factoring webhooks |
| Financial Fraud | **CRITICAL** | False payment confirmations |
| Ledger Corruption | **HIGH** | Tampering with financial records |
| False Credit Approvals | **HIGH** | Bypass credit checks |
| Regulatory Violation | **HIGH** | Non-compliance with financial controls |

#### Attack Vector
```
1. Attacker identifies hardcoded webhook secret
2. Attacker crafts fake factoring approval payload
3. Attacker POSTs to /api/v1/webhooks/factor with:
   - x-factor-signature: HMAC(payload, known_secret)
   - x-idempotency-key: unique-key
4. System validates signature (passes - uses same secret)
5. System marks invoice as DISBURSED
6. System creates audit log entry with false data
7. Supplier receives payment for non-existent factoring
```

#### Financial Impact
- **Potential Loss:** Unlimited (based on factoring limits)
- **Reputational Risk:** Severe (financial platform trust)
- **Regulatory Risk:** Banking license implications

#### Remediation
```diff
// app/api/v1/webhooks/factor/route.ts
- const WEBHOOK_SECRET = process.env.FACTOR_WEBHOOK_SECRET || "production-secure-key-rotation-pending";

+ const WEBHOOK_SECRET = process.env.FACTOR_WEBHOOK_SECRET;
+ if (!WEBHOOK_SECRET) {
+   console.error('[FATAL] FACTOR_WEBHOOK_SECRET not configured');
+   return NextResponse.json(
+     { error: 'SERVICE_UNAVAILABLE', message: 'Webhook not configured' },
+     { status: 503 }
+   );
+ }
```

---

## ⬛⬛ P1 HIGH - MUST FIX BEFORE LAUNCH

### HIGH-001: Missing Security Headers

| **Attribute** | **Value** |
|----------------|-----------|
| **Risk ID** | HIGH-001 |
| **Severity** | HIGH (P1) |
| **Category** | HTTP Security Headers |
| **CVSS 4.0** | 5.3 (Medium) |

#### Location
```
File: next.config.js (entire file)
```

#### Missing Headers
| Header | Risk | Required Value |
|--------|------|----------------|
| Content-Security-Policy | XSS injection | See remediation |
| Strict-Transport-Security | SSL stripping | max-age=63072000 |
| X-Frame-Options | Clickjacking | DENY |
| X-Content-Type-Options | MIME sniffing | nosniff |
| Referrer-Policy | Data leakage | strict-origin-when-cross-origin |
| Permissions-Policy | Feature abuse | camera=(), microphone=() |

#### Remediation
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self'; connect-src 'self' https://api.stripe.com https://*.vercel.app; frame-src https://js.stripe.com; frame-ancestors 'none';"
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
];

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  // ...existing config
};
```

---

## ⬛ P2 MEDIUM - FIX IN FIRST WEEK POST-LAUNCH

### MED-001: Rate Limiting Not Configured

| **Attribute** | **Value** |
|----------------|-----------|
| **Risk ID** | MED-001 |
| **Severity** | MEDIUM (P2) |
| **Category** | DoS / Brute Force Protection |

#### Vulnerable Endpoints
- `POST /api/v1/auth/login` - No rate limiting
- `POST /api/v1/auth/reset-password` - Enumeration attacks possible
- `POST /api/v1/auth/register` - Account creation flooding
- `POST /api/v1/webhooks/factor` - Webhook flooding

#### Remediation
```typescript
// lib/security/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

### MED-002: Vault Key Configuration Fallback

| **Attribute** | **Value** |
|----------------|-----------|
| **Risk ID** | MED-002 |
| **Severity** | MEDIUM (P2) |
| **Category** | Secrets Management |
| **File** | lib/fintech/key-vault.ts:51-53 |

#### Finding
Falls back to environment variables if HashiCorp Vault not configured:
```typescript
// Local fallback for developmental configurations only
const localEnvSecret = process.env[secretKey];
if (localEnvSecret) {
  return localEnvSecret;
}
```

**Risk:** Production may inadvertently use fallback instead of Vault.

#### Remediation
```typescript
// Add environment enforcement
if (process.env.NODE_ENV === 'production') {
  if (!vaultAddr || !vaultToken) {
    throw new Error('Production requires HashiCorp Vault - no fallback allowed');
  }
}
```

### MED-003: Allowed Dev Origins in Production Config

| **Attribute** | **Value** |
|----------------|-----------|
| **Risk ID** | MED-003 |
| **Severity** | MEDIUM (P2) |
| **Category** | Configuration Security |
| **File** | next.config.js:4 |

#### Finding
```javascript
allowedDevOrigins: ['187.77.181.3'],
```

This hardcoded IP may allow unauthorized access.

---

## ✅ POSITIVE SECURITY CONTROLS

| Area | Status | Evidence |
|------|--------|----------|
| **RBAC Enforcement** | ✅ GOOD | middleware.ts:44-72 - role-based access control |
| **Session Token Validation** | ✅ GOOD | Uses `jose` JWT library with signature verification |
| **Audit Logging** | ✅ GOOD | Async audit dispatch on auth failures |
| **Tenant Isolation** | ✅ GOOD | Headers passed downstream: x-tenant-id, x-user-id |
| **Idempotency** | ✅ GOOD | Redis SET NX atomic pattern |
| **HMAC Verification** | ✅ GOOD | timingSafeEqual for signature comparison |
| **Atomic Transactions** | ✅ GOOD | Prisma $transaction for consistency |
| **Ledger Immutability** | ✅ GOOD | Append-only design, no UPDATE/DELETE |

---

## 🛣️ REMEDIATION ROADMAP

### Phase 1: CRITICAL Fixes (Days 1-2)

```diff
Day 1: Emergency P0 Fixes
├── CR-001: Fix hardcoded SESSION_SECRET
├── CR-002: Fix hardcoded FACTOR_WEBHOOK_SECRET  
├── Commit: "security: P0 critical - remove hardcoded secrets"
├── Generate new secrets: openssl rand -base64 64
└── Deploy to staging

Day 2: Verification
├── Run security regression tests
├── Verify app fails without secrets
├── Penetration test: attempt token forgery
└── Deploy to production (after approval)
```

### Phase 2: HIGH Fixes (Days 3-4)

```diff
Day 3: Security Headers
├── HIGH-001: Add security headers to next.config.js
├── Content-Security-Policy configuration
└── HSTS preload configuration

Day 4: Infrastructure
├── Rate limiting implementation (MED-001)
├── Vault production enforcement (MED-002)
└── Dev origins cleanup (MED-003)
```

### Phase 3: Monitoring (Day 5)

```diff
Day 5: Security Monitoring
├── Configure Sentry security alerts
├── Set up failed auth attempt monitoring
├── Enable webhook signature failure alerts
└── Schedule recurring security scans
```

---

## 📋 ACCEPTANCE CRITERIA CHECKLIST

### Pre-Production Gate

- [ ] **CR-001 FIXED:** No hardcoded JWT secret fallback
- [ ] **CR-002 FIXED:** No hardcoded webhook secret fallback
- [ ] **CR VERIFIED:** App fails to start without secrets
- [ ] **HIGH-001 FIXED:** Security headers present in all responses
- [ ] **MED-001 ADDRESSED:** Rate limiting configured
- [ ] **TEST:** Token forgery attempts return 401
- [ ] **TEST:** Webhook with invalid signature rejected
- [ ] **TEST:** Security headers present (curl -I check)
- [ ] **REVIEW:** Security audit sign-off by CTO

### Deployment Verification

```bash
# Run these before production deploy
echo "=== Security Verification ==="

# 1. Check headers
curl -I https://staging.hotelsvendors.com/ | grep -E "X-Frame|X-Content|Strict-Transport"

# 2. Attempt token forgery (should fail)
curl -H "Authorization: Bearer invalid.token.here" \
  https://staging.hotelsvendors.com/api/v1/admin

# 3. Check webhook rejection (should fail)
curl -X POST https://staging.hotelsvendors.com/api/v1/webhooks/factor \
  -H "x-factor-signature: invalid" \
  -d '{"action":"test"}'

# 4. Verify secrets not in source
grep -r "production-secure-key-rotation-pending" . --include="*.ts" --include="*.js" && echo "FAIL: HARDCODED SECRET FOUND" || echo "PASS: No hardcoded secrets"
```

---

## 📞 ESCALATION RULES

| Condition | Action | Timeframe |
|-----------|--------|-----------|
| P0 found during audit | Immediate Slack/Email to CTO + PM | Immediate |
| Production deployment without P0 fix | BLOCK deployment | Immediate |
| Security test fails after fix | Escalate to security team | 1 hour |
| Unauthorized access detected | Incident response protocol | Immediate |

---

## 📅 COMMUNICATION PLAN

| Stakeholder | Communication | Frequency |
|-------------|---------------|-----------|
| **CTO** | Risk register + remediation plan | Immediate |
| **PM** | Weekly security status | Weekly |
| **Dev Team** | Remediation tickets | As needed |
| **Board** | Executive summary | After fixes |

---

## 🔗 RELATED DOCUMENTS

- SECURITY_AUDIT_RISK_REGISTER_P0.md (Detailed findings)
- VERCEL_DEPLOYMENT_GUIDE.md (Deployment instructions)
- E2E_TEST_REPORT.md (Testing coverage)

---

**Audit Completed:** 2026-05-19 11:12:33  
**Next Review:** After P0 remediation  
**Authorized By:** Agent Zero Security Audit System
