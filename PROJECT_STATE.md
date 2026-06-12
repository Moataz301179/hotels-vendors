# HotelsVendors — Project State (Single Source of Truth)

## ⚠️ READ THIS AT THE START OF EVERY SESSION

### Deployment
- **GitHub repo:** `Moataz301179/hotels-vendors` (default branch: `main`)
- **Vercel project:** `hotels-vendors` → auto-deploys from `main`
- **Production domain:** `https://hotelsvendors.com`
- **Vercel dashboard:** https://vercel.com/moatazs-projects-592573bb/hotels-vendors

### Workflow (MANDATORY — NEVER SKIP)
1. ALL code is written directly in `/Users/Moataz/hotels-vendors/` on `main` branch
2. NEVER create worktrees, duplicate repos, or external project folders
3. Commit + push to main: `git add -A && git commit -m "..." && git push origin main`
4. Vercel auto-deploys. Verify at hotelsvendors.com — check for `readyState: "READY"`
5. **NEVER say "deployed" without verifying the live site actually works**

### Database
- **Stack:** Prisma 6 + `PrismaPg` adapter + `pg` Pool (in `lib/prisma.ts`)
- **Supabase:** Was discussed in earlier sessions. `lib/prisma.ts` is configured for PostgreSQL via connection string. Supabase client/auth/real-time NOT integrated.
- **`.env`:** Does NOT have a production `DATABASE_URL` set. This needs to be configured.
- **Decision needed:** Use Supabase as full platform (auth + real-time + DB) or just as PostgreSQL provider, or use Hostinger VPS PostgreSQL?

### Known Incomplete Work
- `lib/tenant/scope.ts` — multi-tenant scoping logic started but very thin
- Supabase integration — half-configured, needs decision on scope
- Consumer-grade CTA cleanup on marketing pages (task #4)

### What Was Cleaned Up (2026-06-12)
- Deleted duplicate GitHub repo: `Moataz301179/hotelsvendors`
- Deleted duplicate Vercel projects: `hotelsvendors-7wx6`, `hotels-vendors-n6m1`, `project_1`, `hotelsvendors`
- Removed all git worktrees — working directly on `main`
- Added workspace lock rules to CLAUDE.md
- Added verification checklist to CLAUDE.md
