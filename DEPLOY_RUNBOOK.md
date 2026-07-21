# DEPLOY RUNBOOK — READ THIS FIRST

> **⚠️ MANDATORY FOR ALL AI AGENTS AND HUMANS:** Read this entire file before touching deployment. Do NOT guess. Do NOT use Docker. Do NOT use Vercel. Do NOT use `next export`. Do NOT invent a new deploy method. If something here is wrong, UPDATE THIS FILE — do not work around it.

---

## Single Source of Truth

| Field | Value |
|---|---|
| **Method** | Native Next.js (NO Docker, NO Vercel) |
| **Server** | `root@hotelsvendors.com` (hostname — no need to track IP changes) |
| **SSH Key** | `/Users/Moataz/hotels-vendors/.ssh/kimi_deploy` |
| **App Path** | `/var/www/hotelsvendors-v2` |
| **PM2 Process** | `hotels-vendors` (verified via `pm2 list` — note the hyphen) |
| **Port** | `3003` (NEVER use 3000 or 3002 — both are cursed/stale) |
| **Nginx** | `/etc/nginx/sites-enabled/hotelsvendors` proxies to `127.0.0.1:3003` |
| **Node** | v22 LTS |
| **Database** | PostgreSQL on the VPS (production `.env` has the working role) |
| **Build** | `NODE_OPTIONS="--max-old-space-size=1536" node node_modules/next/dist/bin/next build` |
| **Start** | `NODE_ENV=production PORT=3003 node node_modules/next/dist/bin/next start` (via PM2) |

---

## Why This File Exists

Every prior AI session guessed the deploy method wrong (Docker, then Vercel, then `next export`). Each guess wasted hours and silently failed. This file is the authoritative record — it is updated whenever a deploy succeeds or fails, with the exact commands that worked.

**If you are an AI agent and your plan involves anything other than the commands below, STOP. You are about to repeat a mistake that has already been made.**

---

## Pre-Deploy Verification (BEFORE pushing code)

```bash
# 1. Confirm you can SSH in
ssh -i /Users/Moataz/hotels-vendors/.ssh/kimi_deploy root@hotelsvendors.com "echo OK"

# 2. Check what's currently running
ssh -i /Users/Moataz/hotels-vendors/.ssh/kimi_deploy root@hotelsvendors.com "pm2 list"

# 3. Check current production commit
ssh -i /Users/Moataz/hotels-vendors/.ssh/kimi_deploy root@hotelsvendors.com \
  "cd /var/www/hotelsvendors-v2 && git log -1 --oneline"

# 4. Compare to origin/main — are they in sync?
git -C /Users/Moataz/hotels-vendors fetch origin
git -C /Users/Moataz/hotels-vendors log -1 --oneline origin/main
```

If production's commit ≠ `origin/main`, the autodeploy is NOT working (see "Autodeploy Status" below).

---

## Manual Deploy (the actual commands that work)

```bash
# Run from your local machine

# 1. Ensure main is up to date locally and pushed
cd /Users/Moataz/hotels-vendors
git checkout main
git pull origin main

# 2. SSH in and deploy
ssh -i .ssh/kimi_deploy root@hotelsvendors.com << 'DEPLOY_EOF'
set -e
cd /var/www/hotelsvendors-v2

echo "[1/6] Pulling latest code..."
git fetch origin main
git reset --hard origin/main

echo "[2/6] Installing dependencies..."
npm ci --legacy-peer-deps --include=dev

echo "[3/6] Generating Prisma client..."
npx prisma generate

echo "[4/6] Running migrations..."
npx prisma migrate deploy

echo "[5/6] Building..."
rm -rf .next
NODE_OPTIONS="--max-old-space-size=1536" node node_modules/next/dist/bin/next build

echo "[6/6] Restarting via PM2..."
pm2 reload hotels-vendors 2>/dev/null || pm2 start "node node_modules/next/dist/bin/next start" --name hotels-vendors --env production -- --port 3003
pm2 save

echo "DEPLOY COMPLETE"
DEPLOY_EOF

# 3. Verify (run from local)
curl -sI https://www.hotelsvendors.com/api/health | head -1
curl -s https://www.hotelsvendors.com/api/health | head -c 200
```

---

## If PM2 Process Is Missing

```bash
ssh -i .ssh/kimi_deploy root@hotelsvendors.com << 'EOF'
cd /var/www/hotelsvendors-v2
pm2 start "node node_modules/next/dist/bin/next start" \
  --name hotels-vendors \
  --env production \
  -- --port 3003
pm2 save
pm2 startup  # follow the instructions it prints
EOF
```

---

## If Ports 3000 or 3002 Are "Cursed" (stale processes)

```bash
ssh -i .ssh/kimi_deploy root@hotelsvendors.com << 'EOF'
# Kill ALL next-server and next-start processes
pkill -9 -f "next-server" 2>/dev/null || true
pkill -9 -f "next start" 2>/dev/null || true
pkill -9 -f "node.*server.js" 2>/dev/null || true
sleep 2

# Verify ports are free
ss -tlnp | grep -E "3000|3002|3003" || echo "All ports free"

# Ensure nginx points at 3003
sed -i 's/127.0.0.1:300[0-2]/127.0.0.1:3003/g' /etc/nginx/sites-enabled/*
nginx -t && nginx -s reload
EOF
```

---

## Environment Variables (VPS `.env`)

The production `.env` lives at `/var/www/hotelsvendors-v2/.env` (NOT `shared/.env` — the handoff doc says shared but actual path is root, 754 bytes as of 2026-07-21).

**Required vars on VPS (verify each is set):**
- `DATABASE_URL` — Postgres connection (use whatever role OWNS the production DB, not the dev `hotels_vendors` role)
- `JWT_SECRET` / `SESSION_SECRET` — must match the value used to sign session tokens
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT` — Hostinger SMTP for email verification
- `NEXT_PUBLIC_APP_URL=https://www.hotelsvendors.com`
- `OLIV_WEBHOOK_TOKEN` — from Oliv partnership (for oliv-callback route to accept webhooks)
- `OLIV_WEBHOOK_SECRET` — HMAC secret for prefill payload signing
- `OLIV_APPLY_URL` — Oliv onboarding URL (defaults to https://oliv.finance/apply)
- `REDIS_URL` — currently NOT set (production uses memory fallback — OK for now, but rate limiting won't persist across restarts)

**To inspect current VPS env (values only, secrets masked):**
```bash
ssh -i .ssh/kimi_deploy root@hotelsvendors.com \
  "cat /var/www/hotelsvendors-v2/.env | sed -E 's/=.*/=***/' | sort"
```

---

## Autodeploy Status (as of 2026-07-21)

**Workflow rewritten this session.** `.github/workflows/deploy-hostinger.yml` previously used Docker Compose against a PM2 server — every run "succeeded" in 10-16s but zero code deployed. Rewritten to use SSH + PM2 with the exact commands from the manual deploy section above. Triggers on `push to main` and `workflow_dispatch`.

**Verification:** After first push to main with the new workflow, check the Actions tab. The run should take 3-6 minutes (real build) and the final step prints the production commit — it must match `github.sha`.

---

## Deploy History (append after every deploy)

| Date | Commit | Deployed By | Method | Result | Notes |
|---|---|---|---|---|---|
| 2026-07-21 | 89dc4dc | n/a | n/a | STALE | Production at 5c8cbe86a (old); main at 3e99f85; fix branch at 89dc4dc with 5 critical fixes (RBAC, pino-pretty, DB role, CSRF, OlivReferral model) NOT yet deployed. Manual deploy needed. |

---

## Common Mistakes To NEVER Repeat

1. ❌ Using Docker Compose — there is no Docker on this VPS.
2. ❌ Using Vercel — the domain points to the Hostinger VPS, not Vercel.
3. ❌ Using `next export` / static export — this is a dynamic app with API routes.
4. ❌ Using port 3000 or 3002 — both have stale processes that conflict.
5. ❌ Editing `.env.local` and expecting production to change — `.env.local` is gitignored and dev-only.
6. ❌ Trusting the green checkmark on GitHub Actions — verify production commit matches main HEAD.
7. ❌ Guessing the PM2 process name — run `pm2 list` and read it. Current name: `hotels-vendors`.
8. ❌ Asking the user for facts that are already in this file.
9. ❌ Trusting `docs/HANDOFF_DEPLOY.md` or `HOSTINGER-DEPLOY.md` over this file — they conflict with reality and each other. This runbook was verified against the live VPS on 2026-07-21.
