# Phase 3 Prep — UI Research + Auto-Redesign Tool (Invo Mobile)

> Goal: turn the current generic first-draft mobile screens into a high-quality,
> fast, functional procurement app — NOT a generic AI look. Driven by real
> top-rated fintech/procurement apps in the same arena, then auto-applied.

## The two-layer product (locked)
- **Invo (mobile)** — the operator's tool. Housekeeping staff scan items with the
  phone → request replenishment from stores → the whole procurement cycle runs
  (approval → supplier → delivery → invoice → factoring via Oliv CTA). Profound
  authentication (verified, role-based, tenant-scoped — see RBAC_PERMISSION_SEED).
- **HotelsVendors (web)** — onboarding + finance + the **app-install QR code** that
  hotel staff scan to get Invo. No duplicate onboarding between the two layers.

## Brand truth (non-negotiable)
- Canonical tokens: `docs/planning/UI_DESIGN_TOKENS_UNIFIED.md`. Read it FIRST.
  **Orange is retired in both apps.** Accent = `--accent-base` `#4F6BFF` (restrained),
  dark institutional grey/white `#0B0D12` surfaces, G7 glassmorphism.
- Mobile currently uses GREEN primary `#39FF7E` (src/theme/index.ts) — a split brand
  that makes Invo look like a generic fintech clone. **Invo must adopt the unified
  token map (delete green, use `--accent-base`).**
- HotelsVendors logo + wordmark everywhere; "Invo" is a text sub-brand only (no
  separate logo/color); Oliv logo appears ONLY on the web `/financing/oliv` page.
- NO neon, NO gradients-as-backgrounds, NO stock-photo dashboard heroes, NO purple.

---

## TOOL SPEC — `ui-benchmark` (Claude Code command, reusable)

Installs as `.claude/commands/ui-benchmark.md`. Usage: `/ui-benchmark` in the
mobile repo. Two stages, then a handoff prompt.

### Stage 1 — RESEARCH (crawl + extract, not opinions)
Use web_search/webfetch to study the same-arena leaders and extract VERIFIABLE
patterns (cite the source app for every claim):

**Arena A — B2B procurement/purchasing mobile:**
Coupa, Procurify, Taager (Egypt), MaxAB-Wasoko (Egypt, 450K merchants), Tradogram,
Zyda, Wasoko app UX, Jumia/Amazon Business mobile.

**Arena B — B2B fintech/factoring/payments mobile (same "fast money" audience):**
Pleo, Ramp, Brex, Payhawk, Qonto, Spendesk, Fawry, Vodafone Cash (Egypt), M-KOPA.

For EACH studied app capture:
1. IA & navigation (bottom tabs, primary action placement, 1-thumb reach).
2. **Scan flows** — how do they scan (barcode/QR/OCR), scan→action latency,
   confirmation patterns. (This is Invo's core: scan item → replenish.)
3. Auth/onboarding pattern (verification depth, KYC gating, OTP).
4. Color + typography tokens (extract hex families + type scale, cite screenshots).
5. Empty states, status pills, list density, CTAs.

OUTPUT: `docs/planning/UI_BENCHMARK_2026.md` with a **pattern matrix**:
row per app, columns = nav | scan | auth | tokens | density | what-to-keep.
Plus a "patterns to steal" section (each mapped to a concrete Invo screen).

### Stage 2 — AUTO-REDESIGN (transform, in the mobile repo)
Map benchmark → target design, then implement screen-by-screen:

1. **Token unification first** — rewrite `src/theme/index.ts` to the orange-accent
   family (mirror web: --accent-base #ff7e1a, dark bg #0c0c12, glass cards,
   spacing/radii/typography scales). Delete green. All screens restyle from tokens.
2. **Scan-to-replenish core flow** (the demo):
   - Home = 1-thumb scan button (bottom-center, large) + today's status.
   - Scan item → add qty → instant "replenishment request" → store approval →
     supplier → delivery → invoice. Full cycle visible in one timeline screen.
   - Replaces the generic CatalogScreen-first layout.
3. **Profound auth** — verified role login (hotel staff / supplier / finance),
   OTP + biometric option, tenant-scoped, no client-side role switching (G2/G8).
4. **Density & speed** — medium-high list density, status pills, skeleton loading,
   optimistic UI on scan-add. Everything ≤2 taps to start a scan.
5. Keep `OlivActivationScreen` as the Phase-1 referral CTA (contextual, not home).

OUTPUT per screen: rewritten file + a note of the benchmark source it follows.

## Handoff prompt (paste into Claude after Stage 2)
`Apply docs/planning/UI_REDESIGN_SPEC.md to the mobile repo screen-by-screen.
Reply "READ" first. Follow the token map in src/theme/index.ts exactly.`

## Dependency policy (justified, not gratuitous)
- ALLOWED new dep (scan flow needs it): `expo-camera` (or `expo-barcode-scanner`) —
  required for the housekeeping scan-to-replenish core flow. Nothing else new.
- Everything else must use the installed stack: react-navigation, zustand, axios,
  expo-secure-store, reanimated, gesture-handler. NO camera UI libraries, NO icon
  kits beyond what's installed, NO new state managers.

---

## DoD for the whole tool
1. BENCHMARK: `docs/planning/UI_BENCHMARK_2026.md` — ≥6 apps, pattern matrix, each
   pattern mapped to an Invo screen, sources cited (no invented screenshots).
2. TOKENS: mobile theme now orange-accent/dark-glass; zero `#39FF7E` or green hex
   left in `src/` (grep proof).
3. FLOW: home = scan-first; scan item → replenish request → timeline visible in code;
   ≤2 taps to scan.
4. AUTH: verified role login, no client-side role state.
5. BUILD: mobile app typechecks + builds (npx tsc --noEmit; expo export if configured).
6. COMMIT: one commit `feat(mobile): scan-first redesign from ui-benchmark`.
7. BLOCKERS: list any (deps added: only expo-camera/expo-barcode-scanner; everything else must be flagged).
