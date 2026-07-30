# Fix Broken Logos & Scattered Nav Bar

## Root Causes (confirmed)
1. **Scattered nav:** `/marketplace` and product-detail pages render `<MarketingNav />` from the DEAD `components/layout/marketing-nav.tsx` (an unstyled, non-canonical nav). The live, polished nav is `SiteNav` (`components/marketing/site-nav.tsx`), used everywhere else. The two different navs side-by-side = the "scattered header tabs."
2. **Broken logos in dead paths:** `components/logo.tsx` (`Logo`/`LogoFull`) uses `next/image fill` inside an unsized `<span>` → collapses to a broken/blank logo. This dead file is what the marketplace nav chain pulls in.
3. **Leftover artifacts** violating AGENTS.md G8: `components/layout/marketing-nav.tsx.bak` (commit 071e723 claimed to delete it, but it's still present), `components/layout/marketing-nav.tsx` (dead), `components/logo.tsx` (dead duplicate), `components/shared/header.tsx` (placeholder, no importers).
4. **Latent logo bug:** `brand-logo.tsx:28` hardcodes both variants to `#ffffff` → wordmark invisible on light backgrounds (nav uses `showText={false}`, so not currently visible, but worth fixing for correctness).

## Plan

### Step 1 — Unify the marketing nav (fixes scattered tabs)
- Edit `components/marketplace/marketplace-client.tsx` and `components/marketplace/product-detail-client.tsx` to import and render `<SiteNav />` (the live nav) instead of `<MarketingNav />`.
- This makes `/marketplace` and product pages share the exact same navbar as the homepage.

### Step 2 — Remove dead nav + logo artifacts (fixes broken logos, satisfies G8)
- Delete `components/layout/marketing-nav.tsx.bak` (leftover from commit 071e723).
- Delete `components/layout/marketing-nav.tsx` (dead; only the marketplace files referenced it, now re-pointed to SiteNav).
- Delete `components/logo.tsx` (dead duplicate of `brand-logo.tsx`; fragile `fill` Image that produces broken logos).
- Delete `components/shared/header.tsx` (placeholder, no importers) — and remove its re-export from `components/shared/index.ts` if present.

### Step 3 — Fix latent logo bug in `brand-logo.tsx`
- Change `textColor` so `variant="light"` uses a dark color (e.g. `#1a1a1a`) and `variant="dark"` stays `#ffffff`. This prevents white-on-white wordmarks on light surfaces. (Nav currently uses `showText={false}` so low risk, but it's a correctness fix.)

### Step 4 — Verify
- `npm run build` (with `--legacy-peer-deps`) to confirm no broken imports after deletions and no type errors.
- Grep to confirm zero remaining references to `MarketingNav`, `marketing-nav`, or `components/logo`.

## Files Changed
- `components/marketplace/marketplace-client.tsx` — swap to `SiteNav`
- `components/marketplace/product-detail-client.tsx` — swap to `SiteNav`
- `components/layout/brand-logo.tsx` — fix variant text color
- DELETE: `components/layout/marketing-nav.tsx`, `components/layout/marketing-nav.tsx.bak`, `components/logo.tsx`, `components/shared/header.tsx`
- (edit) `components/shared/index.ts` — drop dead re-export if present

## Notes
- A single canonical `SiteNav` (`components/marketing/site-nav.tsx`) is the source of truth; `BrandLogo` is the single logo component. No new nav/logo components will be introduced (per G8).
- I will NOT touch dashboard nav/header (`dashboard-header.tsx`, `pulse-sidebar.tsx`) — those are separate and reportedly fine.
- `public/assets/logo.svg` already exists and is valid, so the logo itself renders once the dead `components/logo.tsx` is removed from the render path.