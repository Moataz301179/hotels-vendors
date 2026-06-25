export const meta = {
  name: 'hv-fanout',
  description: 'Fix design parity + build marketplace/RFQ/checkout-ETA in hotels-vendors',
  phases: [
    { title: 'Theme parity', detail: 'Wire theme toggle + LanguageSwitcher to 8 marketing sub-pages' },
    { title: 'Marketplace UI', detail: 'Real product cards on /marketplace' },
    { title: 'Checkout + ETA', detail: 'Trigger ETA submission on order confirm' },
    { title: 'RFQ flow', detail: 'API routes + UI for request-for-quote' },
  ],
}

const UNIT = '/Users/Moataz/hotels-vendors'

phase('Theme parity')
const theme = await agent(
  `Fix THEME PARITY in the Next.js app at ${UNIT}.

Goal: Make 8 marketing sub-pages (/hotels, /compliance, /pricing, /logistics-service, /become-supplier, /platform, /solutions, /about) work under BOTH light and dark themes. Surface the LanguageSwitcher.

Verified state:
- CSS var system in app/globals.css (light default + [data-theme="wimbledon"] dark alias)
- components/theme/theme-toggle.tsx exists, works on landing page
- LanguageSwitcher component exists, only wired into dashboard
- Sub-pages hardcode text-white / rgba(255,...) which breaks under light theme
- Components problem-solution-split, cta-glow, step-connector exist but are never imported

Tasks:
1. Read each marketing sub-page under app/(marketing) and components/layout/marketing-nav.tsx
2. Replace hardcoded dark colors with CSS vars (var(--bg-canvas), var(--text-primary), var(--surface), var(--accent-base))
3. Add ThemeToggle + LanguageSwitcher to components/layout/marketing-nav.tsx ONCE (not per-page)
4. Import problem-solution-split / cta-glow / step-connector where semantically appropriate
5. Do NOT modify lib/ (backend), prisma/schema.prisma, middleware.ts, or API routes
6. Do NOT push, commit, or touch .env

REPORT: at the end of your final message, output a JSON block:
{ "filesChanged": ["path1","path2"], "skipped": ["reason"], "tscResult": "clean OR N errors", "notes": "anything important" }`,
  { label: 'theme-parity', phase: 'Theme parity' }
)

phase('Marketplace UI')
const marketplace = await agent(
  `Build the MARKETING MARKETPLACE PAGE in the Next.js app at ${UNIT}.

Goal: Replace the waitlist-only /marketplace page with a real product-listing reusing existing dashboard marketplace components.

Verified state:
- app/(marketing)/marketplace/page.tsx = hero + email waitlist + static VENDOR_PREVIEW array of 40 hard-coded supplier cards
- Dashboard marketplace is real: app/(dashboard)/hotel/catalog/ is Prisma-backed via /api/v1/products
- Reusable components: components/marketplace/{search-bar,category-nav,compare-drawer,product-detail-client,marketplace-client}.tsx
- Prisma Product model + Supplier relation exist
- app/api/v1/products/route.ts filters by category/search/status/supplierId

Tasks:
1. Read app/(marketing)/marketplace/page.tsx and components/marketplace/marketplace-client.tsx
2. Rewrite /marketplace to fetch real products and render real product cards (image placeholder, name, supplier, price, "View details" -> /marketplace/[id])
3. Wire existing SearchBar + CategoryNav
4. Create app/(marketing)/marketplace/[id]/page.tsx for product detail
5. Add "Add to Compare" button wired to existing compare-context.tsx
6. Keep the waitlist form below the fold
7. Do NOT modify lib/eta/, middleware.ts, auth, or prisma/schema.prisma
8. Do NOT push, commit, or touch .env

REPORT: at the end of your final message, output a JSON block:
{ "filesChanged": ["path1","path2"], "skipped": ["reason"], "tscResult": "clean OR N errors", "notes": "anything important" }`,
  { label: 'marketplace-ui', phase: 'Marketplace UI' }
)

phase('Checkout + ETA')
const checkoutEta = await agent(
  `Wire ETA SUBMISSION into checkout flow in the Next.js app at ${UNIT}.

Goal: When /api/v1/checkout confirms an order, auto-create an Invoice record AND submit to ETA via the existing lib/eta client (fire-and-forget — ETA failure never blocks the order).

Verified state:
- app/api/v1/checkout/route.ts (224 lines) creates Order + OrderItems, clears cart in a transaction — zero Invoice.create or etaClient calls
- lib/eta/client.ts: submitInvoice(payload), getInvoice(uuid), cancelInvoice(uuid, reason)
- lib/eta/types.ts: EtaInvoicePayload (issuer, receiver, lines, amounts)
- app/api/v1/invoices/[id]/eta-submit/route.ts exists for manual submit
- Prisma Invoice model exists

Tasks:
1. Read app/api/v1/checkout/route.ts and app/api/v1/invoices/[id]/eta-submit/route.ts
2. After order is created:
   - Create Invoice record (status: 'pending') linked to Order
   - Build EtaInvoicePayload from Order (issuer = platform, receiver = supplier, lines from OrderItems)
   - Call submitInvoice(etaPayload) wrapped in try/catch
   - On success: Invoice.status = 'submitted', store uuid
   - On failure: Invoice.status = 'failed', store error — do NOT throw, do not fail checkout
3. Do NOT modify lib/eta/
4. Do NOT push, commit, or touch .env

REPORT: at the end of your final message, output a JSON block:
{ "filesChanged": ["path1","path2"], "skipped": ["reason"], "tscResult": "clean OR N errors", "notes": "anything important" }`,
  { label: 'checkout-eta', phase: 'Checkout + ETA' }
)

phase('RFQ flow')
const rfq = await agent(
  `Build the RFQ (Request for Quote) flow in the Next.js app at ${UNIT}.

Goal: Wire existing Prisma RfqRequest/RfqItem/RfqResponse models to API routes + minimal UI.

Verified state:
- Prisma has RfqRequest, RfqItem, RfqResponse, RfqItemResponse with relations
- Zero API routes under app/api/v1/rfq/
- Zero UI pages under app/(dashboard)/.../rfq/
- components/marketing/rfq-engine.tsx is a marketing mockup (not the real flow)

Tasks:
1. Read prisma/schema.prisma to confirm exact RFQ model fields
2. Create app/api/v1/rfq/route.ts — POST (create RfqRequest + RfqItems), GET (list my RFQs)
3. Create app/api/v1/rfq/[id]/route.ts — GET one RFQ with items + responses
4. Create app/api/v1/rfq/[id]/respond/route.ts — POST supplier response (RfqResponse + RfqItemResponse)
5. Create app/(dashboard)/hotel/rfq/page.tsx (list RFQs)
6. Create app/(dashboard)/hotel/rfq/new/page.tsx (create RFQ)
7. Create app/(dashboard)/hotel/rfq/[id]/page.tsx (view RFQ + responses)
8. Do NOT modify lib/eta/, middleware.ts, or auth
9. Do NOT push, commit, or touch .env

REPORT: at the end of your final message, output a JSON block:
{ "filesChanged": ["path1","path2"], "skipped": ["reason"], "tscResult": "clean OR N errors", "notes": "anything important" }`,
  { label: 'rfq-flow', phase: 'RFQ flow' }
)

return { theme, marketplace, checkoutEta, rfq }
