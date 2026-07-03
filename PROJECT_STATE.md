# HotelsVendors — Project State (Single Source of Truth)

## ⚠️ READ THIS AT THE START OF EVERY SESSION

### Deployment
- **GitHub repo:** `Moataz301179/hotels-vendors` (default branch: `main`)
- **Vercel project:** `hotels-vendors` → auto-deploys from `main`
- **Production domain:** `https://hotelsvendors.com`
- **Vercel dashboard:** https://vercel.com/moatazs-projects-592573bb/hotels-vendors

### Workflow (MANDATORY — NEVER SKIP)
1. All code is written in worktree: `/Users/Moataz/hotels-vendors/.claude/worktrees/hotels-vendors-main/`
2. After committing in worktree, sync to main:
   ```
   cd /Users/Moataz/hotels-vendors
   git checkout worktree-hotels-vendors-main -- <changed-files>
   git add -A && git commit -m "..." && git push origin main
   ```
3. Vercel auto-deploys. Verify at hotelsvendors.com — check for `readyState: "READY"`, NOT just "deployed"
4. **NEVER say "deployed" without verifying the live site actually works**

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
