# Decision Record — Terminology + Catalog Pivot (2026-08-04)

Status: APPROVED by user. Feed into all upcoming prompts (Marketing Refocus,
web token migration, catalog build, Phase 3 mobile).

## D1. Terminology: "vendor", not "supplier"
- All user-facing copy across marketing pages, catalog, dashboards, and mobile
  uses **vendor**. "Supplier" is internal/technical only (DB field names, code
  identifiers, API contracts may stay `supplier` until a dedicated rename phase).
- Current state: ~347 `supplier` refs in UI/copy vs ~69 `vendor` refs. Marketing
  pages to fix first: `app/(marketing)/page.client.tsx` (hero stats "suppliers",
  "Browse supplier catalogs"), `app/(marketing)/marketplace/marketplace-client.tsx`
  (page copy, "Why Suppliers Choose", "Get paid in 24 hours" sections),
  `app/(marketing)/suppliers/`, `app/(marketing)/hotels/`, `app/(marketing)/about/`.
- Hero stat label: "suppliers" → "vendors".

## D2. Catalog concept: fixed-price listings → RFQ (request-for-quotation) with AI automation
- The catalog is NO LONGER a fixed-price price list. It becomes **RFQ-driven**:
  a hotel/vendor states a need, qualified vendors quote, AI automates the matching,
  scoring, and (per Authority Matrix) selection.
- This supersedes the older 80/20 "fixed pricing + 20% sealed RFQ" framing in
  `docs/ai-bidding-strategic-refinement.md` (June 2026). That doc's AI layers
  (Predictive Demand, Price Intelligence, Vendor Lifecycle/Trust Score, Predictive
  Factoring, Conversational Procurement) remain the automation target — but the
  catalog mechanic is now RFQ-primary, not fixed-price-primary.
- CONFLICT TO RESOLVE: `AGENTS.md` line 14 + 20 state "Fixed Pricing... no bidding."
  Must be updated in the same pass that touches marketing copy. This is a core-model
  change, so it also affects: prisma schema (Quote/RFQ models, price fields become
  optional/quote-based), API contracts (API_CONTRACTS_SPEC.ts), vendor dashboard
  (submit quotes), hotel catalog UI (request quote, no add-to-cart at fixed price),
  mobile Invo (scan-to-replenish → RFQ flow), and RBAC seed copy.
- Do NOT rewrite the whole model today. This decision must be threaded into the
  NEXT focused prompt (catalog + marketing content), with a scope boundary so we
  don't explode Phase 0.5's commit.

## D3. Design (already agreed — reference only)
- Palettes approved: Invo mobile = Variant A grey/black dark; HotelsVendors web =
  Variant B grey/white light. Single accent `#4F6BFF` ≤5%. See
  `docs/planning/UI_DESIGN_TOKENS_UNIFIED.md`.

## Execution intent
- "vendor" terminology + RFQ messaging go into: EXECUTION_PROMPT_MARKETING_REFOCUS.md
  (add a copy section), the catalog page build prompt, and Phase 3 mobile.
- Marketing refocus prompt must be amended BEFORE being pasted, or run as a follow-up
  so the hero/catalog copy matches the new model. Recommend: amend the refocus prompt
  with D1+D2 copy requirements.
