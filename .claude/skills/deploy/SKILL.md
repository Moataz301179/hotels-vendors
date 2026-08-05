---
name: deploy
description: Trigger, monitor, and verify a production deployment of hotels-vendors. Use whenever the user asks to deploy, ship, push to production, check deploy status, or verify that a change is live. Deployment is PM2 on a Hostinger VPS via GitHub Actions — NOT Vercel, NOT Docker.
---

# Deployment — Hotels Vendors

## Deployment Model (CRITICAL)

- **NO Vercel. NO Docker.** Production runs as a Next.js standalone app under **PM2** on a Hostinger VPS.
- **VPS:** `/var/www/hotelsvendors-v2` | **PM2 app:** `hotels-vendors` | **Port:** 3003 (Nginx in front) | **Domain:** `https://www.hotelsvendors.com`
- **PM2 config:** `ecosystem.config.js` (fork mode, 1 instance, 1.5GB memory cap, autorestart)
- **Auto-deploy trigger:** push to `main` runs `.github/workflows/deploy.yml`:
  1. `ci` job — `npm ci --legacy-peer-deps`, lint (non-blocking), `tsc --noEmit`, `prisma generate`, `npm run build`
  2. `deploy-hostinger` job (needs `ci`) — SSH to VPS → `git fetch/reset --hard origin/main` → `npm ci` → `prisma generate` → `npm run build` → `pm2 reload ecosystem.config.js --env production` → `pm2 save`
  3. Health check — `https://www.hotelsvendors.com/api/health` must return `200`

## Triggering a Deploy

1. **Normal path:** commit and push to `main` (`git add -A && git commit -m "..." && git push origin main`). Deploy fires automatically. Do NOT run a separate deploy command.
2. **Manual path:** if the user asks to force a deploy without a new commit, dispatch the workflow:
   ```bash
   gh workflow run deploy.yml --ref main
   ```

## Monitoring a Deploy

```bash
# Watch the run for the current ref (Ctrl+C to stop watching)
gh run watch

# List recent runs / status of all workflows
gh run list --limit 5

# Get status of the specific deploy job
gh run list --workflow=deploy.yml --limit 3
```

Wait for **both** the `ci` and `deploy-hostinger` jobs to be green before declaring success.

## Verifying a Deploy (MANDATORY)

**Never say "deployed" until these pass:**
```bash
# 1. GitHub Actions run is green
gh run list --limit 3

# 2. Health endpoint returns 200
curl -s -o /dev/null -w "%{http_code}\n" https://www.hotelsvendors.com/api/health
```

Expected: `200`. Anything else (000 = unreachable, 502/504 = app not responding) means the deploy failed or the app crashed — investigate.

## Troubleshooting / Rollback

If the health check fails after a deploy:

1. Check PM2 process state on the VPS:
   ```bash
   ssh <HOSTINGER_USER>@<HOSTINGER_IP> "cd /var/www/hotelsvendors-v2 && pm2 status && pm2 logs hotels-vendors --lines 80"
   ```
2. If the process is `errored`/`stopped`, restart it:
   ```bash
   ssh <HOSTINGER_USER>@<HOSTINGER_IP> "cd /var/www/hotelsvendors-v2 && pm2 reload ecosystem.config.js --env production && pm2 save"
   ```
3. **Rollback** to the last known-good commit:
   ```bash
   git log --oneline -5 origin/main
   git revert --no-edit <bad-sha> && git push origin main
   ```
   (Reverting pushes a new commit → auto-deploy runs again. Do NOT reset main.)

## PM2 Quick Reference (run on the VPS via SSH)

| Command | Purpose |
|---|---|
| `pm2 status` | Process state (online/stopped/errored) |
| `pm2 logs hotels-vendors --lines 100` | Tail logs |
| `pm2 reload hotels-vendors` | Zero-downtime reload |
| `pm2 restart hotels-vendors` | Full restart |
| `pm2 monit` | CPU/memory dashboard |
| `pm2 save` | Persist process list across reboots |

## Rules

- Never reference Vercel or Docker for deployment — they are not part of the production pipeline.
- Never `git reset` or force-push `main` to fix a bad deploy. Use `git revert`.
- Always verify with the health check before reporting success.
