# Credential & Secrets Security Audit

**Date:** 2026-07-14
**Scope:** Full codebase scan for hardcoded/embedded credentials
**Auditor:** Automated scan (opencode)
**Excluded:** node_modules/, .next/, docs/, prisma/migrations/, tsconfig.tsbuildinfo

---

## Executive Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0 | — |
| HIGH | 1 | tools.yaml has hardcoded Postgres password |
| MEDIUM | 4 | Dev defaults, placeholder connection strings |
| LOW | 5 | Test files with non-real credentials |
| INFO | 3 | Proper patterns, env var usage confirmed |

**No live API keys, Stripe tokens, GitHub tokens, Slack tokens, or real JWT secrets were found in the codebase.**

---

## CRITICAL Findings

*None.*

---

## HIGH Findings

### H1. `tools.yaml` — Hardcoded Postgres Password

- **File:** `tools.yaml:7`
- **Credential:** `password: hotels_vendors_dev`
- **Details:** Postgres password for `root` user on `localhost:5433` is hardcoded in plain text. This file is tracked by git and was committed. While this appears to be a local dev credential, it is a real connection string (not a placeholder) and is committed to version control.
- **Recommendation:** Replace with `${POSTGRES_PASSWORD}` or remove the file from tracking. Add `tools.yaml` to `.gitignore` if it contains local dev config.

---

## MEDIUM Findings

### M1. `scripts/db/setup-postgres.sh` — Default DB Password

- **File:** `scripts/db/setup-postgres.sh:12`
- **Credential:** `DB_PASS="${HV_DB_PASS:-hvpass123}"`
- **Details:** Default fallback password `hvpass123` is hardcoded. If the env var `HV_DB_PASS` is not set, this password is used to create the DB user and is printed to stdout as part of the connection URL (line 37).
- **Recommendation:** Remove the default. Require env var or prompt for password interactively. Never print connection URL with password.

### M2. `deploy/hostinger-v2.sh` — Placeholder Connection String

- **File:** `deploy/hostinger-v2.sh:62`
- **Credential:** `DATABASE_URL=postgresql://hotels_vendors:CHANGE_ME@postgres:5433/hotels_vendors`
- **Details:** Deployment script writes a `.env` file with `CHANGE_ME` as the database password. If the operator forgets to replace it, the app runs with a known password.
- **Recommendation:** Generate a random password in the deploy script (like `hostinger-deploy.sh` does with `openssl rand`) and fail if no password is provided.

### M3. `docker-compose.yml` — Dev Passwords Hardcoded

- **File:** `docker-compose.yml:9`
- **Credential:** `POSTGRES_PASSWORD: hotels_vendors_dev`
- **Details:** Dev-only Postgres password is committed. While this is intended for local development, if the same compose file is reused in staging, it becomes a risk.
- **File:** `docker-compose.yml:24`
- **Credential:** `redis-server --requirepass ${REDIS_PASSWORD:-changeme}`
- **Details:** Redis defaults to `changeme` if `REDIS_PASSWORD` is unset.
- **Recommendation:** For dev-only compose files, this is acceptable but add a comment `# DEV ONLY — do not use in production`. Ensure production uses `docker-compose.swarm.yml` which properly references env vars.

### M4. `scripts/e2e-smoke-test.ts` — Default Admin Password Fallback

- **File:** `scripts/e2e-smoke-test.ts:136,275,369`
- **Credential:** `process.env.ADMIN_PASSWORD || "change-me-immediately"`
- **Details:** E2E test script falls back to `change-me-immediately` if `ADMIN_PASSWORD` env var is not set. This password is also the same as the seed default, meaning a running dev instance with default seed can be logged into with this known value.
- **Recommendation:** Remove the fallback. Require env var to be set or skip the test.

---

## LOW Findings

### L1. `tests/setup.ts` — Test-Only Secrets

- **File:** `tests/setup.ts:5-6`
- **Credential:** `SESSION_SECRET = "test-secret-64-characters-long-string-here-1234567890"`, `DATABASE_URL = "postgresql://test:test@localhost:5433/test"`
- **Details:** Test setup file with clearly fake/test values. Never used in production. Acceptable for unit tests.
- **Risk:** Minimal — these are mock values for a test harness.

### L2. `tests/api/auth.test.ts` — Test Passwords

- **File:** `tests/api/auth.test.ts:27,37,73,79,95,112`
- **Credential:** `"SecurePass123!"`, `"password123"`
- **Details:** Test passwords used for password hashing/validation unit tests. These are input values being tested, not credentials.
- **Risk:** None — purely test fixtures.

### L3. `lib/seed.ts` — Seed Password Default

- **File:** `lib/seed.ts:33`
- **Credential:** `process.env.SEED_PASSWORD || "change-me-immediately"`
- **Details:** Dev seed script default. File header explicitly warns `DEVELOPMENT ONLY`.
- **Risk:** Low — dev seed data only.

### L4. `prisma/seed.ts` — Seed Password Default

- **File:** `prisma/seed.ts:191`
- **Credential:** `process.env.SEED_PASSWORD || "change-me-immediately"`
- **File:** `prisma/seed.ts:445`
- **Credential:** Console log prints: `admin-test@test.hotelsvendors.com / ${defaultPassword}`
- **Details:** Prisma seed script with same dev default. Explicitly warns `DEVELOPMENT ONLY`.
- **Risk:** Low — dev seed data only.

### L5. `docker-compose.swarm.yml` — Fallback Defaults

- **File:** `docker-compose.swarm.yml:21-22,80,84,136-137,168-169`
- **Credential:** `${REDIS_PASSWORD:-changeme}` (appears 6 times)
- **Details:** Swarm compose properly references env vars but falls back to `changeme` for Redis. Production deployment should always set `REDIS_PASSWORD`.
- **Risk:** Low — only matters if deployed without env vars.

---

## INFO — Positive Findings

### I1. `.env` Is Not Tracked

- `.env` was committed historically (commit `48075a9`) but was removed in commit `d57f764` with message `chore: stop tracking .env, add .env.example (use secrets)`.
- `.gitignore` includes `.env*` pattern (line 34).
- `.env.example` contains only placeholders (`""`, `"changeme"`, `"replace-with-random-secret"`).

### I2. No Live Third-Party Keys Found

- No `sk_live_` or `pk_live_` (Stripe live keys)
- No `ghp_` or `gho_` (GitHub tokens)
- No `xoxb-` or `xoxp-` (Slack tokens)
- No `Bearer <real-token>` patterns
- No hardcoded JWT tokens (`eyJ...`)

### I3. Deploy Scripts Use Env Var References

- `deploy/hostinger-deploy.sh` references `${ETA_CLIENT_SECRET}`, `${PAYMOB_API_KEY}` via env vars (lines 116-118).
- `hostinger-deploy.sh` generates `SESSION_SECRET` dynamically: `$(openssl rand -base64 64)` (line 114).
- `hostinger-deploy.sh` retrieves DB password from PostgreSQL at runtime rather than hardcoding it (line 112).

---

## Recommendations

1. **Immediate:** Address H1 (`tools.yaml`) — either gitignore it or replace the hardcoded password with an env var reference.
2. **Before production:** Ensure M1-M4 are resolved — no deployment script should default to a known password.
3. **Add to CI:** Run a secrets scanner (e.g., `gitleaks`, `trufflehog`, or `git-secrets`) as a pre-commit hook and in CI pipeline to prevent future regressions.
4. **Rotate:** If `hotels_vendors_dev` or `hvpass123` have been used on any accessible system, rotate them.
5. **Document:** Add a `SECRETS.md` or expand `AGENTS.md` with rules: "Never hardcode credentials. Always use env vars. Never print connection strings with passwords."

---

*End of audit. No live production credentials were found compromised.*
