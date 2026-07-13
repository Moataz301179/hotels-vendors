# Cloud & SaaS Audit — HotelsVendors Digital Procurement Hub

**Audit Date:** 2026-07-14  
**Auditor:** Cloud & SaaS Auditor  
**Scope:** Cloud infrastructure, SaaS integrations, deployment architecture, security posture  
**Codebase Version:** 0.1.0

---

## Executive Summary

The HotelsVendors platform employs a **hybrid deployment architecture** combining Vercel (frontend/CDN) with a Hostinger VPS (backend/services). While the architecture demonstrates thoughtful design for cost optimization and LLM hosting, **critical security vulnerabilities** were identified that require immediate remediation before production deployment.

### Risk Rating: 🔴 HIGH

| Category | Score | Status |
|----------|-------|--------|
| Secrets Management | 2/10 | 🔴 CRITICAL |
| Database Security | 4/10 | 🟡 MEDIUM |
| Container Security | 5/10 | 🟡 MEDIUM |
| Network Security | 7/10 | 🟢 GOOD |
| SSL/TLS | 8/10 | 🟢 GOOD |
| Backup & Recovery | 3/10 | 🔴 HIGH |
| Scaling Strategy | 4/10 | 🟡 MEDIUM |
| Monitoring | 3/10 | 🔴 HIGH |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌─────────────────────┐         ┌─────────────────────┐
        │      Vercel         │         │   Hostinger VPS     │
        │  (Edge Network)     │         │  (Cairo/Egypt)      │
        │                     │         │                     │
        │  ┌───────────────┐  │         │  ┌───────────────┐  │
        │  │ Marketing     │  │         │  │ Next.js       │  │
        │  │ Pages (SSG)   │  │         │  │ (standalone)  │  │
        │  └───────────────┘  │         │  └───────────────┘  │
        │  ┌───────────────┐  │         │  ┌───────────────┐  │
        │  │ Auth Pages    │  │         │  │ PostgreSQL 16  │  │
        │  └───────────────┘  │         │  │ (containerized)│  │
        │  ┌───────────────┐  │         │  └───────────────┘  │
        │  │ Dashboard UI  │  │         │  ┌───────────────┐  │
        │  │ (static)      │  │         │  │ Redis 7       │  │
        │  └───────────────┘  │         │  │ (containerized)│  │
        └─────────────────────┘         │  └───────────────┘  │
                                        │  ┌───────────────┐  │
                                        │  │ Ollama LLM    │  │
                                        │  │ (local/VPS)   │  │
                                        │  └───────────────┘  │
                                        │  ┌───────────────┐  │
                                        │  │ Nginx         │  │
                                        │  │ (reverse proxy)│  │
                                        │  └───────────────┘  │
                                        │  ┌───────────────┐  │
                                        │  │ Swarm Workers │  │
                                        │  │ (background)  │  │
                                        │  └───────────────┘  │
                                        └─────────────────────┘
```

---

## Findings

### 🔴 CRITICAL FINDINGS

#### C1: Hardcoded Supabase Credentials in Source Code

**Files:**
- `lib/supabase/server.ts:4-6`
- `lib/supabase/client.ts:3-5`

**Issue:** The Supabase URL and service role key are hardcoded in the source code and committed to Git. This is a **critical security vulnerability** that exposes the entire database to anyone with repository access.

**Evidence:**
```typescript
// lib/supabase/server.ts
const SUPABASE_URL = "https://wnyeuaasktaknlvcoypo.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIs..."; // HARDCODED
```

**Impact:** 
- Complete database compromise if repository is leaked
- Service role key bypasses Row-Level Security
- Potential data exfiltration of all hotel, supplier, and financial data

**Remediation:** 
1. **Immediately** rotate the Supabase service key
2. Move all credentials to environment variables
3. Add `.env` to `.gitignore` (verify it exists)
4. Use GitHub Actions secrets or Vercel environment variables

---

#### C2: Redis Authentication Missing

**Files:**
- `docker-compose.yml:21-32`
- `docker-compose.swarm.yml:74-89`
- `lib/redis.ts:36`

**Issue:** Redis containers have no password authentication configured. The Redis instance is accessible to any container on the Docker network and, if port 6379 is exposed, to the public internet.

**Evidence:**
```yaml
# docker-compose.yml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"  # EXPOSED TO HOST
  # NO PASSWORD CONFIGURED
```

**Impact:**
- Session hijacking via Redis dump
- Rate limiting bypass
- Potential for ransomware (data encryption)

**Remediation:**
1. Add `requirepass` to Redis configuration
2. Update `REDIS_URL` to include password: `redis://:password@redis:6379`
3. Remove port mapping from production (use Docker network only)
4. Update `lib/redis.ts` to handle authentication

---

#### C3: No Vercel Build Configuration

**File:** `vercel.json`

**Issue:** The Vercel configuration is minimal and incorrect:
- Uses `npm run build && npm run start` (not serverless-compatible)
- Missing `buildCommand` override for `--legacy-peer-deps`
- Redirects to internal route group path (invalid)
- No function configuration for API routes
- No edge runtime configuration

**Evidence:**
```json
{
  "version": 2,
  "environments": {
    "production": {
      "Command": "npm run build && npm run start"  // WRONG for Vercel
    }
  },
  "redirects": [
    {
      "source": "/",
      "destination": "/(marketing)/page.tsx"  // INVALID PATH
    }
  ]
}
```

**Impact:**
- Build failures on Vercel
- Incorrect routing behavior
- No serverless function optimization

**Remediation:**
```json
{
  "buildCommand": "npm ci --legacy-peer-deps && npx prisma generate && npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"],
  "functions": {
    "app/api/**/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

---

### 🟠 HIGH FINDINGS

#### H1: No Automated Database Backups

**Files:**
- `deploy/hostinger-v2.sh` (no backup logic)
- `deploy/DEPLOY_CHECKLIST.md:359-362` (manual only)

**Issue:** Database backups are manual commands only. No automated backup schedule, no off-site backup storage, no backup verification.

**Evidence:**
```bash
# Manual backup command only
docker exec hv-postgres pg_dump -U hotels_vendors hotels_vendors > backup_$(date +%Y%m%d).sql
```

**Impact:**
- Data loss on disk failure
- No recovery point objective (RPO) compliance
- Manual recovery process during incidents

**Remediation:**
1. Implement automated daily backups via cron:
   ```bash
   0 3 * * * docker exec hv-postgres pg_dump -U hotels_vendors hotels_vendors | gzip > /var/backups/hotels-vendors-$(date +\%Y\%m\%d).sql.gz
   ```
2. Add off-site backup (S3, Backblaze, or rsync to secondary server)
3. Implement backup verification script
4. Document RPO (24h) and RTO (4h) targets

---

#### H2: No Redis Persistence Configuration

**Files:**
- `docker-compose.yml:21-32`
- `docker-compose.swarm.yml:74-89`

**Issue:** Redis has no persistence configuration. Data (sessions, rate limits, idempotency keys) is lost on container restart.

**Impact:**
- Session loss on Redis restart
- Rate limiting reset
- Idempotency key loss (potential duplicate transactions)

**Remediation:**
Add persistence configuration to Redis service:
```yaml
redis:
  image: redis:7-alpine
  command: redis-server --appendonly yes --save 900 1 --save 300 10
  volumes:
    - redis_data:/data
```

---

#### H3: Conflicting Deployment Strategies

**Files:**
- `HOSTINGER-DEPLOY.md` (PM2 + native)
- `deploy/hostinger-v2.sh` (Docker Compose)
- `docker-compose.swarm.yml` (Docker)

**Issue:** Three different deployment strategies documented:
1. PM2 + native PostgreSQL/Redis (`HOSTINGER-DEPLOY.md`)
2. Docker Compose with containerized services (`deploy/hostinger-v2.sh`)
3. Hybrid Vercel + VPS (`deploy/hybrid-config.md`)

**Impact:**
- Configuration drift between environments
- Unclear production architecture
- Deployment complexity and errors

**Remediation:**
1. Choose single deployment strategy (Docker Compose recommended)
2. Archive conflicting documentation
3. Update all deployment scripts to use consistent approach

---

#### H4: No Connection Pooling Configuration

**File:** `lib/prisma.ts:11`

**Issue:** PostgreSQL connection pool is not configured. Default pool size may cause connection exhaustion under load.

**Evidence:**
```typescript
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// No pool size, idle timeout, or connection timeout configured
```

**Impact:**
- Connection exhaustion under load
- Performance degradation
- Potential database crashes

**Remediation:**
```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
```

---

### 🟡 MEDIUM FINDINGS

#### M1: No Container Resource Limits (Dev)

**File:** `docker-compose.yml`

**Issue:** Development docker-compose has no resource limits. Ollama can consume all available memory.

**Impact:**
- OOM kills during development
- System instability

**Remediation:**
Add resource limits to dev compose:
```yaml
ollama:
  deploy:
    resources:
      limits:
        memory: 4G
```

---

#### M2: No Health Check Retries Configuration

**Files:**
- `docker-compose.yml:15-19`
- `docker-compose.swarm.yml:66-72`

**Issue:** Health checks have basic retry configuration but no start_period or graceful shutdown handling.

**Impact:**
- premature container restarts
- Service instability during startup

**Remediation:**
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U hotels_vendors"]
  interval: 5s
  timeout: 5s
  retries: 5
  start_period: 30s
```

---

#### M3: No CORS Configuration for VPS

**File:** `next.config.ts:36-58`

**Issue:** CORS is configured for AI endpoints but uses wildcard fallback when `VERCEL_URL` is not set.

**Evidence:**
```typescript
value: process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_APP_URL || "*",  // WILDCARD FALLBACK
```

**Impact:**
- Potential CSRF attacks
- Unauthorized API access

**Remediation:**
Remove wildcard fallback, require explicit CORS configuration:
```typescript
value: process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_APP_URL || "https://hotelsvendors.com"
```

---

#### M4: No Edge Runtime Configuration

**File:** `next.config.ts`

**Issue:** No edge runtime configuration for latency-sensitive routes.

**Impact:**
- Higher latency for geographically distributed users
- No edge caching for dynamic content

**Remediation:**
Add edge runtime for critical paths:
```typescript
export const config = {
  runtime: 'edge',
};
```

---

#### M5: No SSL Certificate Monitoring

**Files:**
- `docker-compose.swarm.yml:235-244`
- `deploy/nginx.conf:57-60`

**Issue:** Certbot auto-renewal is configured but no monitoring for certificate expiry.

**Impact:**
- SSL certificate expiry without notification
- Service disruption

**Remediation:**
1. Add certificate expiry monitoring (UptimeRobot, Cloudflare)
2. Add health check endpoint for certificate status
3. Configure email alerts for expiry warnings

---

### 🟢 LOW FINDINGS

#### L1: No Image Optimization Configuration

**File:** `next.config.ts:5-11`

**Issue:** Remote image patterns are configured but no image optimization settings (quality, format, size).

**Impact:**
- Larger image downloads
- Slower page loads

**Remediation:**
```typescript
images: {
  remotePatterns: [...],
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

---

#### L2: No Static Asset Cache Headers

**File:** `next.config.ts:15-25`

**Issue:** Cache headers are set but static assets could have longer cache duration.

**Impact:**
- Unnecessary revalidation
- Higher bandwidth usage

**Remediation:**
Already partially addressed in nginx.conf (365d for `_next/static/`).

---

#### L3: No DNS Configuration Documentation

**Files:**
- `deploy/DEPLOY_CHECKLIST.md`
- No DNS configuration files

**Issue:** DNS configuration (SPF, DKIM, DMARC) not documented.

**Impact:**
- Email deliverability issues
- Potential spoofing

**Remediation:**
Document DNS configuration:
```
TXT   @              "v=spf1 include:_spf.google.com ~all"
TXT   _dmarc         "v=DMARC1; p=quarantine; rua=mailto:dmarc@hotelsvendors.com"
TXT   sendgrid._domainkey  "p=MIGfMA0GCSqGSIb3DQEBA..."
```

---

## Recommendations

### Immediate Actions (0-7 days)

1. **🔴 Rotate Supabase credentials** and move to environment variables
2. **🔴 Add Redis authentication** and remove port exposure
3. **🔴 Fix Vercel configuration** for proper serverless deployment
4. **🟡 Implement automated backups** with off-site storage

### Short-term Actions (7-30 days)

1. **Configure PostgreSQL connection pooling** (max, idle timeout)
2. **Add Redis persistence** (AOF + RDB)
3. **Consolidate deployment documentation** to single strategy
4. **Add container resource limits** to all environments
5. **Implement certificate expiry monitoring**

### Medium-term Actions (30-90 days)

1. **Set up monitoring** (Prometheus + Grafana or Vercel Analytics)
2. **Implement edge runtime** for latency-sensitive routes
3. **Add CSP headers** to nginx configuration
4. **Document DNS configuration** for email deliverability
5. **Create disaster recovery runbook** with RPO/RTO targets

---

## Risk Matrix

| Finding | Severity | Likelihood | Impact | Priority |
|---------|----------|------------|--------|----------|
| C1: Hardcoded Supabase credentials | 🔴 CRITICAL | High | Critical | P0 |
| C2: Redis authentication missing | 🔴 CRITICAL | High | High | P0 |
| C3: Vercel config broken | 🔴 CRITICAL | High | High | P0 |
| H1: No automated backups | 🟠 HIGH | Medium | High | P1 |
| H2: No Redis persistence | 🟠 HIGH | Medium | Medium | P1 |
| H3: Conflicting deploy strategies | 🟠 HIGH | Medium | Medium | P1 |
| H4: No connection pooling | 🟠 HIGH | Medium | Medium | P1 |
| M1: No container limits | 🟡 MEDIUM | Low | Low | P2 |
| M2: Health check config | 🟡 MEDIUM | Low | Low | P2 |
| M3: CORS wildcard | 🟡 MEDIUM | Medium | Medium | P2 |
| M4: No edge runtime | 🟡 MEDIUM | Low | Low | P3 |
| M5: No SSL monitoring | 🟡 MEDIUM | Low | Medium | P2 |
| L1: Image optimization | 🟢 LOW | Low | Low | P3 |
| L2: Cache headers | 🟢 LOW | Low | Low | P3 |
| L3: DNS documentation | 🟢 LOW | Low | Low | P3 |

---

## Compliance Notes

### ETA E-Invoicing
- Credentials should be encrypted at rest (AES-256-GCM)
- Webhook endpoints need HMAC verification
- Audit logging required for all submissions

### Data Protection
- PII encryption at rest required
- TLS 1.2+ for all transit (✅ configured)
- Session management needs HTTP-only cookies (✅ configured)

### Financial Data
- No cash custody (✅ per legal constraints)
- Idempotency keys for transactions (✅ implemented)
- Audit trail for all mutations (✅ schema exists)

---

## Appendix: File Inventory

### Infrastructure Files
- `vercel.json` — Vercel deployment configuration
- `docker-compose.yml` — Development environment
- `docker-compose.swarm.yml` — Production environment
- `Dockerfile` — Application container
- `Dockerfile.worker` — Swarm worker container
- `deploy/nginx.conf` — Reverse proxy configuration
- `deploy/hostinger-v2.sh` — Deployment script
- `deploy/ufw-setup.sh` — Firewall configuration
- `deploy/pm2-config.json` — PM2 configuration (alternative)
- `.env.example` — Environment template

### Security Files
- `lib/supabase/server.ts` — ⚠️ Contains hardcoded credentials
- `lib/supabase/client.ts` — ⚠️ Contains hardcoded credentials
- `lib/redis.ts` — Redis connection (no auth)
- `lib/prisma.ts` — Database connection (no pooling)

### Documentation
- `deploy/DEPLOY_CHECKLIST.md` — Deployment guide
- `deploy/hybrid-config.md` — Hybrid architecture
- `HOSTINGER-DEPLOY.md` — Alternative deployment

---

**Audit Completed:** 2026-07-14  
**Next Audit Recommended:** 2026-10-14 (90 days)  
**Auditor Signature:** Cloud & SaaS Auditor
