# Phase "Marketing Refocus" — Isolated Task Prompt

> Paste into Claude Code in a NEW session after the Phase 0.5 cleanup commit is done.
> Single-writer rule: this session touches ONLY the files listed below. Do not touch
> anything else. One commit at the end.
> ALSO READ: `docs/planning/DECISION_RECORD_2026-08-04.md` — terminology "vendor" (not
> supplier) + catalog is RFQ-with-AI (not fixed-price listings) are APPROVED pivots that
> MUST be reflected in all copy touched here.

## Context (why this task exists)

Oliv is our paperless-factoring funding partner. Contract is phased:
- Phase 1 (now): manual onboarding via referral code CHV000 → user completes KYC in Oliv's
  own mobile app (mobile-only, location-aware). No API keys yet.
- Phase 2 (later): embedded payments + API keys, after proven business volume.

The hero currently embeds an OlivAdCarousel that pitches the funding story like a consumer ad.
That is wrong on two counts:
1. It puts a partner ad before the product at the front door (the message is finance, not the
   agentic procurement solution).
2. It asks a landing visitor to onboard to Oliv before they've seen the product — duplicate
   friction, and Oliv KYC is mobile-only anyway.

**Corrected model (already agreed with the user — do not re-litigate):**
- Hero (web) = the product + the Invo mobile app-install QR card (hotel staff scan → install →
  scan housekeeping items → replenishment cycle). Remove the Oliv carousel from the hero.
- Marketing posts (Facebook / WhatsApp / LinkedIn) carry the Oliv funding story with the two
  tangible hooks: **same-day credit-line assessment** and **invoices/checks paid in 48 hours**.
  These ads link to the existing landing page `/financing/oliv`.
- `/financing/oliv` = deep conversion point. Its CTA must go through the tracking route so the
  referral is appended and clicks are measurable.
- Invo mobile app (separate repo, Phase 3) = a contextual CTA at the moment of need (first PO,
  invoice due). NOT part of this task — but record the requirement below.

## The exact changes

### 1. Remove the Oliv carousel from the hero; replace with the app-install QR card
File: `app/(marketing)/page.client.tsx`
- Remove the `<OlivAdCarousel />` block and its import (currently lines ~7 and ~187-191).
- The hero right-side becomes an **Invo mobile app-install QR card** (NOT Oliv, NOT a generic
  image). It shows:
  - The local QR code that installs the Invo mobile app (existing asset style: local SVG in
    `/public`, like `oliv-qr.svg` pattern — do NOT hotlink a QR service; generate the QR
    encoding the store/install URL, or use the existing local-QR approach).
  - Label: "Scan to install Invo" (EN) + Arabic RTL.
  - One line of hook copy under it: "Hotel staff scan items → request replenishment → the
    procurement cycle runs itself." (EN + AR)
  - Keep it inside the hero's existing dark-glassmorphism card language using tokens only.
- Keep the existing `HotelSuppliesCarousel` below the hero (product content — correct as-is).
- Do NOT add any Oliv imagery, QR, referral line, or finance copy anywhere in the hero.

### 2. Route the Oliv landing-page CTA through the tracking click route
File: `app/(marketing)/financing/oliv/page.tsx`
- Both primary CTA anchors (currently `https://oliv.finance/#register` at ~line 134 and ~line 245)
  must become `<a href="/api/v1/oliv/click">` — the existing route appends `ref=CHV000` and
  redirects to `https://oliv.finance/apply?ref=CHV000&source=hotelsvendors`, and it also fires the
  click-tracking POST first. Keep styling identical. Keep the secondary `/register` link as-is.

### 3. Write the social ad copy (the real home of the Oliv story)
Create: `docs/marketing/oliv-social-ads.md`
- 3 post variants (Facebook, WhatsApp broadcast, LinkedIn) with the SAME structure:
  - Hook line built on the two tangible hooks: same-day credit-line assessment; invoices/checks
    paid in 48 hours; paperless factoring; for hotels & suppliers on Hotels Vendors.
  - Body: 3-4 sentences, B2B tone, "see or hold" a concrete number (48h, same-day), not hype.
  - CTA: link to `https://<domain>/financing/oliv` (use the production domain already used in the
    app; if none hardcoded, write `https://hotelsvendors.com/financing/oliv`).
  - All copy in English + Arabic (RTL) side by side.
- Explicitly mark: these posts are the ONLY place the funding story lives.

### 4. Lock the intent so it is never rebuilt
- Append a short "Marketing positions (locked)" section to `PROJECT_STATE.md` and `CLAUDE.md`
  stating: hero = product + Invo install QR only; the Oliv funding story lives ONLY in marketing
  posts + `/financing/oliv` + an in-app CTA in the mobile app (Invo). Never rebuild a hero Oliv
  carousel.
- Note the Invo CTA requirement for Phase 3: contextual financing CTA after first PO / invoice due,
  deep-linking to Oliv with referral + prefill (no duplicate onboarding).
- Note the hero right-side IS the Invo app-install QR card (hotel staff scan → install → scan
  items → replenishment cycle). Do not replace it with generic imagery.

### 5. Terminology + RFQ copy (approved pivots — D1/D2 in the decision record)
- Use **"vendor"** everywhere in user-facing copy; replace visible "supplier" words in:
  hero stats (`t("hero.stats.suppliers")` label → "vendors"), "Browse supplier catalogs"
  (line ~1032), and any hero/carousel/CTA strings in this file. Do NOT rename code
  identifiers, DB fields, API contracts, or internals — copy only, this pass.
- Catalog messaging reflects **RFQ + AI automation**, NOT "fixed-price listings":
  in the hero and any catalog copy touched here, drop the "Fixed pricing, no bidding"
  claim (see `app/(marketing)/marketplace/marketplace-client.tsx` line ~93) and reframe
  to: "Request a quote. AI matches the right vendors and automates the cycle." Keep
  changes scoped to the marketing files in THIS task (hero/client + marketplace copy);
  the schema/API/catalog-engine rewrite is a separate phase.
- Do NOT update AGENTS.md here (conflict resolution is a separate scoped task).

## Constraints
- Use existing design tokens/globals.css only (G7 dark glassmorphism). No raw hex in components,
  no new deps. No landing-page marketing UI inside dashboards.
- BRAND: orange `--accent-base`/`--purple-base` are being RETIRED (see
  `docs/planning/UI_DESIGN_TOKENS_UNIFIED.md`). Do not add NEW orange/purple usage; keep existing
  hero styling until the web token migration phase, but the Invo install QR card must not introduce
  new orange-only styling — use neutral glass + `--text-*` hierarchy.
- HotelsVendors logo everywhere; Oliv logo allowed only on `/financing/oliv`; "Invo" = text only.
- Do not touch: `app/api/*`, `lib/zod.ts`, registration flow, `.github/*`, mobile repo.
- If `docs/marketing/` does not exist, create it.

## DoD (reply with this exact structure)
1. HERO: diff shows OlivAdCarousel removed + import removed; hero right-side is the Invo install
   QR card (local QR asset, EN+AR label, scan-flow hook line), no leftover Oliv UI.
2. LANDING: both CTAs now `/api/v1/oliv/click`; run the dev server and confirm the anchor href + a
   302 redirect with `ref=CHV000` in the Location header (curl -I).
3. ADS: `docs/marketing/oliv-social-ads.md` exists with 3 posts x (EN + AR), each containing the
   48h + same-day hooks.
4. COPY: visible "supplier" gone from the touched files (replaced with "vendor"), and no
   "Fixed pricing, no bidding" claim remains in the touched marketing copy — show grep proof.
5. LOCK: both CLAUDE.md and PROJECT_STATE.md contain the locked marketing positions note.
6. COMMIT: single commit `chore(marketing): refocus oliv to landing page + ads, invo-install-qr hero`.
7. BLOCKERS: none, or list them.
