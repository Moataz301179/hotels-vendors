# Infrastructure Fixes — 2026-07-14

## Summary

Fixed 7 infrastructure findings from the Cloud/SaaS, Cybersecurity, and ITGC audits. All changes target production readiness and security hardening.

---

## Changes Made

### 1. CRITICAL: Redis Authentication + Port Exposure
**Files:** `docker-compose.yml`, `docker-compose.swarm.yml`, `lib/redis.ts`

- Added `--requirepass` to Redis `command` in both compose files
- Removed `ports: - "6379:6379"` from both compose files (internal networking only)
- Updated Redis health checks to authenticate with `-a` flag
- Updated `lib/redis.ts` to pass `REDIS_PASSWORD` option to ioredis
- Updated all `REDIS_URL` references in `docker-compose.swarm.yml` to include password: `redis://:${REDIS_PASSWORD}@redis:6379`

### 2. CRITICAL: Vercel Configuration
**File:** `vercel.json`

- Replaced broken `environments`/`redirects` structure with standard Vercel v2 config
- Added `buildCommand` with `--legacy-peer-deps` and Prisma generate
- Added `installCommand`, `outputDirectory`, `framework`
- Added function memory/duration config for API routes
- Added `regions: ["fra1"]` for European edge deployment

### 3. CRITICAL: Hardcoded Supabase Credentials
**Files:** `lib/supabase/server.ts`, `lib/supabase/client.ts`

**Status:** Already fixed — both files use `process.env` references only. Verified via raw file read that no hardcoded keys remain. Added Supabase env vars to `.env.example` for documentation.

### 4. HIGH: Automated Database Backups
**New files:** `scripts/backup-db.sh`, `docs/backup-strategy.md`

- Created `scripts/backup-db.sh` — performs `pg_dump` with gzip compression, size validation, and automatic rotation
- Supports configurable `RETENTION_DAYS` (default 30)
- Verifies container is running before attempting backup
- Created `docs/backup-strategy.md` with cron setup, restore instructions, and RPO/RTO targets (24h RPO, 4h RTO)

### 5. HIGH: PostgreSQL Connection Pooling
**File:** `lib/prisma.ts`

- Added `max`, `idleTimeoutMillis`, `connectionTimeoutMillis` to `pg.Pool` constructor
- Values configurable via `DB_POOL_MAX` (default 10), `DB_IDLE_TIMEOUT` (default 30s), `DB_CONNECT_TIMEOUT` (default 5s)
- Added error-only logging in production (reduces noise)
- Added connection pool env vars to `.env.example`

### 6. HIGH: Redis Persistence
**Files:** `docker-compose.yml`, `docker-compose.swarm.yml`

- Added `--appendonly yes` and `--appendfsync everysec` to Redis command in both compose files
- Volume mount (`redis_data:/data`) already existed — AOF persistence now writes to it
- Data survives container restarts and redeployments

### 7. HIGH: Conflicting Deployment Strategies
**Files:** `deploy/README.md`, `HOSTINGER-DEPLOY.md` (archived reference)

- Rewrote `deploy/README.md` as the single canonical deployment guide
- Documented Docker Compose as the **primary strategy** with full provisioning, deploy, and operations steps
- Moved PM2-native and Hybrid Vercel+VPS strategies to "Archived Strategies" section with clear "do not use" warnings
- Consolidated all env vars, backup, SSL, and scaling instructions into one document

---

## Files Modified

| File | Change |
|------|--------|
| `docker-compose.yml` | Redis auth + persistence, removed port exposure |
| `docker-compose.swarm.yml` | Redis auth + persistence, removed port exposure, password in REDIS_URL |
| `lib/redis.ts` | Added `password` option to ioredis constructor |
| `lib/prisma.ts` | Added connection pool configuration |
| `vercel.json` | Complete rewrite with valid Vercel v2 config |
| `.env.example` | Added REDIS_PASSWORD, REDIS_URL, DB pool vars, Supabase vars |
| `scripts/backup-db.sh` | New — automated pg_dump with compression + rotation |
| `docs/backup-strategy.md` | New — backup documentation and cron setup |
| `deploy/README.md` | Consolidated single deployment guide |

## Files Verified (Already Fixed)

| File | Status |
|------|--------|
| `lib/supabase/server.ts` | Already uses env vars only |
| `lib/supabase/client.ts` | Already uses env vars only |

## Verification

After deploying these changes:

```bash
# Validate docker-compose YAML syntax
docker compose -f docker-compose.yml config
docker compose -f docker-compose.swarm.yml config

# Verify Redis requires auth
docker compose exec redis redis-cli ping
# Should fail with: NOAUTH Authentication required

# Verify Redis AOF persistence
docker compose exec redis redis-cli CONFIG GET appendonly
# Should return: appendonly yes

# Verify Prisma connection pool
node -e "const { Pool } = require('pg'); const p = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 }); console.log('pool max:', p.options.max); p.end();"

# Run backup script
./scripts/backup-db.sh
```
