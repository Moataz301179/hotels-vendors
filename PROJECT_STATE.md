# HotelsVendors — Project State (Single Source of Truth)

## ⚠️ READ THIS AT THE START OF EVERY SESSION

### Deployment
- **GitHub repo:** `Moataz301179/hotels-vendors` (default branch: `main`)
- **Deploy target:** Hostinger VPS under **PM2** (NO Vercel, NO Docker) — app `hotels-vendors`, dir `/var/www/hotelsvendors-v2`, port 3003, Nginx in front
- **Production domain:** `https://hotelsvendors.com`
- **Pipeline:** push to `main` → GitHub Actions `.github/workflows/deploy.yml` (job `deploy-hostinger`) → SSH → `npm ci --legacy-peer-deps` → `npx prisma generate` → `npm run build` → `pm2 reload ecosystem.config.js --env production` → health check `https://www.hotelsvendors.com/api/health` (expect 200)
- **PM2 config:** `ecosystem.config.js` (fork mode, max 1.5GB/worker, restart on crash)

### Workflow (MANDATORY — NEVER SKIP)
1. Work directly on `main`. Commit there — the old Vercel worktree sync flow is DEAD.
2. `git add -A && git commit -m "..." && git push origin main`
3. Push triggers auto-deploy via GitHub Actions. Watch the run (`gh run watch`) — both `ci` and `deploy-hostinger` jobs must be green.
4. Verify live: `curl -s -o /dev/null -w "%{http_code}" https://www.hotelsvendors.com/api/health` → `200`
5. **NEVER say "deployed" without the Actions run passing AND the health check returning 200.**

### Database
- **Stack:** Prisma 6 + `PrismaPg` adapter + `pg` Pool (in `lib/prisma.ts`)
- **Supabase:** Was discussed in earlier sessions. `lib/prisma.ts` is configured for PostgreSQL via connection string. Supabase client/auth/real-time NOT integrated.
- **`.env`:** Does NOT have a `DATABASE_URL` set. This needs to be configured for production.
- **Decision needed:** Use Supabase as full platform (auth + real-time + DB) or just as PostgreSQL provider, or use Hostinger VPS PostgreSQL?

### Known Incomplete Work
- `lib/tenant/scope.ts` — multi-tenant scoping logic started but very thin
- Supabase integration — half-configured, needs decision on scope
- Consumer-grade CTA cleanup on marketing pages (task #4)

### What Was Cleaned Up (2026-06-12)
- Deleted duplicate GitHub repo: `Moataz301179/hotelsvendors`
- Deleted duplicate Vercel projects: `hotelsvendors-7wx6`, `hotels-vendors-n6m1`, `project_1`, `hotelsvendors`
- Added sync-to-main.sh script
- Added CLAUDE.md verification checklist

### Marketing Positions (Locked — 2026-08-04)
- **Hero** = Product + Invo app-install QR card only. Never rebuild a hero Oliv carousel.
- **Oliv funding story** lives ONLY in: marketing posts (FB/WA/LI) + `/financing/oliv` landing page + in-app CTA in Invo mobile app (Phase 3).
- **Hero right-side** IS the Invo app-install QR card (hotel staff scan → install → scan items → replenishment cycle). Do not replace with generic imagery.
- **Terminology**: "vendor" everywhere in user-facing copy (not "supplier"). Internal/technical may stay `supplier`.
- **Catalog messaging**: RFQ + AI automation ("Request a quote. AI matches the right vendors and automates the cycle."). No "Fixed pricing, no bidding" claim.
- **Oliv CTA tracking**: Both `/financing/oliv` CTAs route through `/api/v1/oliv/click` → appends `ref=CHV000` → redirects to `https://oliv.finance/apply?ref=CHV000&source=hotelsvendors`.
- **Brand names stay in English**: never translate brand names (Hotels Vendors, Oliv, Invo) into Arabic transliterations — keep them in English inside Arabic copy too. Exception: legal documents only.
