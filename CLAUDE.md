# Hotels Vendors — Platform Context for Agents

## ⚠️ FIRST ACTION IN EVERY SESSION
**Read `PROJECT_STATE.md` before doing anything else.** It contains the current deployment state, known incomplete work, and critical rules. Not reading it causes repeated mistakes, wasted sessions, and broken deployments.

## Business Model
- **Fixed-price catalogs** (no bidding/auctions)
- **Per-hotel negotiated credit limits** (Net-30, Net-60 terms)
- **Embedded invoice factoring** (suppliers get paid early, platform takes a spread)
- **Shark-Breaker shared coastal logistics** (consolidated delivery to Red Sea resorts)
- **ETA e-invoicing compliance mandatory** (Egyptian Tax Authority digital invoice integration)

## Target Market (CRITICAL)
- **Primary**: Coastal hotels in **Sharm El-Sheikh** and **Hurghada** (Red Sea)
- **Secondary**: Cairo, Alexandria, North Coast
- **Customer type**: Local branded hotel chains (Stella Di Mare, Sunrise, Jaz, Baron, etc.) — NOT just international 5-star brands
- **Properties**: Resorts with 100-500 rooms, multiple F&B outlets, pools, spas, water sports

## Geography Implications
- Supply chain is **coastal-centric**: seafood, pool chemicals, beach equipment, diving gear, linen turnover
- **Seasonality**: High season Oct-Apr, low season May-Sep (affects inventory forecasting)
- **Logistics**: Long distance from Cairo suppliers → Shark-Breaker hub model essential
- **Payment cycles**: Coastal hotels often have cash-flow seasonality → factoring is critical

## Product Categories (5 max)
1. **F&B** — food, beverages, kitchen equipment
2. **Consumables** — housekeeping chemicals, linens, toiletries, cleaning supplies
3. **Guest Supplies** — amenities, room accessories, guest room FF&E
4. **FF&E** — furniture, fixtures, equipment (capital purchases)
5. **Services** — maintenance, pest control, laundry, security, consulting

## User Roles
- **Hotel Buyer** — procurement teams at individual properties
- **Supplier** — food suppliers, linen vendors, chemical manufacturers, equipment dealers
- **Factoring Company** — financial institutions buying receivables
- **Shipping/Logistics** — Shark-Breaker coastal delivery partners
- **Admin** — platform operators

## Competitive Context
- Amazon Business (generic, not hospitality-focused)
- Local wholesalers (Al-Gomhouria, etc.) — manual, no digital
- Hotel ERP systems (Opera, etc.) — procurement modules are weak
- **Gap**: No Egypt-focused, hospitality-specific B2B marketplace with ETA compliance

## Technical Stack
- Next.js 16 App Router + Turbopack
- React 18 + TypeScript strict
- Tailwind CSS v4
- Prisma 7 + SQLite (dev) → PostgreSQL (prod)
- No external UI libraries (no shadcn, no MUI)

## ⚠️ CRITICAL: Deployment Rules (MUST FOLLOW)

**Deployment is NOT Vercel and NOT Docker. Production runs on a Hostinger VPS under PM2.**
**Pipeline: every push to `main` → GitHub Actions `.github/workflows/deploy.yml` → SSH to VPS → `npm ci` → `prisma generate` → `npm run build` → `pm2 reload` → health check.**

Repo: `Moataz301179/hotels-vendors` (default branch: `main`). VPS: `/var/www/hotelsvendors-v2`, app name `hotels-vendors` (PM2), port 3003, Nginx in front, domain https://www.hotelsvendors.com.

After EVERY code change session:
1. Commit on `main` (work directly on `main`; there is no Vercel worktree sync anymore)
2. Push: `git add -A && git commit -m "..." && git push origin main`
3. GitHub Actions runs `ci` then `deploy-hostinger`. Verify the workflow run passes:
   - `gh run watch` (or GitHub Actions tab) — both `ci` and `deploy-hostinger` jobs must be green
   - Health check: `curl -s -o /dev/null -w "%{http_code}" https://www.hotelsvendors.com/api/health` → expect `200`
4. **NEVER say "deployed" without the GitHub Actions `deploy-hostinger` job succeeding AND the health check returning 200.**

Common PM2 commands on the VPS (via SSH): `pm2 status`, `pm2 logs hotels-vendors`, `pm2 reload hotels-vendors`, `pm2 monit`. PM2 config lives in `ecosystem.config.js`.

**Manual deploy (if needed):** use GitHub Actions "Deploy to Production" workflow_dispatch, or from the VPS run `cd /var/www/hotelsvendors-v2 && git pull && npm ci --legacy-peer-deps && npx prisma generate && npm run build && pm2 reload ecosystem.config.js --env production`.

## ⚠️ Strict Verification Checklist (BEFORE declaring any task complete)

- **RBAC Isolation:** Whenever editing backend routes, always ensure role-based access control (RBAC) isolates Hotel scopes from Supplier configurations. No cross-tenant data leakage.
- **Liability Disclaimer:** Every transaction failure pathway must log and output the mandatory disclaimer: *"Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults."*
- **Test Before Complete:** Before declaring a task complete, run `npx vitest run` to ensure zero regressions. For financial/decimal calculations, verify zero arithmetic errors with explicit tolerance checks.
- **No Duplicate Repos/Projects:** Never create duplicate GitHub repos or Vercel projects. Use only `Moataz301179/hotels-vendors` (GitHub) and `hotels-vendors` (Vercel).
