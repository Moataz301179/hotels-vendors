# Hotels Vendors — Platform Context for Agents

## ⚠️ FIRST ACTION IN EVERY SESSION
**Read `PROJECT_STATE.md` before doing anything else.** It contains the current deployment state, known incomplete work, and critical rules. Not reading it causes repeated mistakes, wasted sessions, and broken deployments.

## ⚠️ CRITICAL: Single Source of Truth
- **ONE repo:** `Moataz301179/hotels-vendors` on GitHub, branch `main`
- **ONE local path:** `/Users/Moataz/hotels-vendors/`
- **NEVER create worktrees, duplicate repos, or scattered project folders**
- **NEVER create directories like `HOTELSVENDORS2026` or any other duplicate**
- You work directly on `main` in `/Users/Moataz/hotels-vendors/`
- Push to `main` → Vercel auto-deploys to `hotelsvendors.com`

## ⚠️ Strict Environment Constraints (Workspace Lock)
- **CRITICAL:** Do NOT create git worktrees (`git worktree add`) under any circumstances.
- **CRITICAL:** Do NOT clone duplicate repositories, initialize new sub-repositories, or spin up external project folders.
- All development, refactoring, and testing MUST happen strictly within the active primary directory (`/Users/Moataz/hotels-vendors/`) and on the current active git branch.
- If a file structure needs modification or parallel tasks are requested, execute them sequentially within this single workspace. Do not attempt parallel background branch isolation.
- Do NOT spawn parallel background subagents, do NOT create git worktrees, and do NOT isolate files outside our primary directory structure.

## ⚠️ Strict Verification Checklist (BEFORE declaring any task complete)

- **RBAC Isolation:** Whenever editing backend routes, always ensure role-based access control (RBAC) isolates Hotel scopes from Supplier configurations. No cross-tenant data leakage.
- **Liability Disclaimer:** Every transaction failure pathway must log and output the mandatory disclaimer: *"Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults."*
- **Test Before Complete:** Before declaring a task complete, run `npx vitest run` to ensure zero regressions. For financial/decimal calculations, verify zero arithmetic errors with explicit tolerance checks.
- **No Duplicate Repos/Projects:** Never create duplicate GitHub repos or Vercel projects. Use only `Moataz301179/hotels-vendors` (GitHub) and `hotels-vendors` (Vercel).

## ⚠️ CRITICAL: Deployment Rules (MUST FOLLOW)

**Vercel is connected to GitHub repo `Moataz301179/hotels-vendors` (default branch: `main`).**
**Every push to `main` triggers an automatic production deployment.**

After EVERY code change session:
1. Commit changes directly in `/Users/Moataz/hotels-vendors/` on `main`
2. Push to main: `git add -A && git commit -m "..." && git push origin main`
3. Vercel auto-deploys — verify at https://hotelsvendors.com

**NEVER commit only to a worktree. `main` is the only branch that matters.**

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
