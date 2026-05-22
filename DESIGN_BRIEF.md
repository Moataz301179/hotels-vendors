# HOTELS VENDORS — Full Portal UI/UX Redesign Brief

## Project Context

Hotels Vendors is a B2B procurement & fintech platform for Egyptian hospitality. It connects hotels with suppliers, offers reverse factoring (supplier financing via NBFIs), and logistics coordination. Think: **Amazon Business + Stripe + Flexport**, but for Egyptian hotels.

**Tech Stack:** Next.js 16.2.4, React 18, Tailwind CSS v4 (postcss plugin, no tailwind.config.js — uses CSS custom properties), Framer Motion, Lucide React icons. No shadcn/ui — custom components only. Prisma + PostgreSQL. Standalone build deployed on VPS.

**Design System File:** `app/globals.css` — read it first. It defines a luxury dark design system with:
- Canvas: `#050505`, Surfaces: `#0a0a0a` → `#101010` → `#1a1a1a`
- Text: `#f0f0f0` primary, `#a0a0a0` secondary, `#707070` tertiary
- Brand: `#8B0000` (dark burgundy/crimson) — NOT blue. This is the only brand color.
- Borders: `rgba(255,255,255,0.06)` to `0.15`
- **NO pure white backgrounds anywhere. NO light themes in dashboards.** OLED dark only.

**Theme Provider:** `components/theme/theme-provider.tsx` — has 5 themes but dashboards must stay dark (`bg-canvas` / `bg-surface-1`).

---

## What Currently Exists (Broken / Unfinished)

The marketing landing page `(marketing)/page.tsx` was recently redesigned with a carousel and generic content. **All 5 portal dashboards are OLD code** — they work functionally but look amateur. Same card-table-modal pattern everywhere. No visual hierarchy. No personality per portal.

| Portal | File Path | Current State | What's Wrong |
|--------|-----------|--------------|-------------|
| **Hotel** | `app/(dashboard)/hotel/page.tsx` | Dark cards, stats row, orders table, inventory alerts | Generic. Looks like a template. No procurement workflow visualization. No ETA invoice status. |
| **Supplier** | `app/(dashboard)/supplier/page.tsx` | Dark cards, stats row, orders table, inventory | Generic. Same pattern as hotel. No EGS code sync status. No compliance score visualization. |
| **Factoring** | `app/(dashboard)/factoring/page.tsx` | **MARKETING LANDING PAGE** — benefits, eligibility, bank logos | **NOT A PORTAL.** This is for hotels to *learn* about factoring. Missing: NBFI dashboard to review credit applications, approve/reject credit lines, view risk scores, track funded invoices, manage partner banks. |
| **Shipping** | `app/(dashboard)/shipping/page.tsx` | Basic trip list with progress bars | **NOT A PORTAL.** This is for hotels to *track* deliveries. Missing: Logistics provider dashboard to create trips, assign drivers/vehicles, optimize routes, manage hubs, handle delays/damages. |
| **Admin** | `app/(dashboard)/admin/page.tsx` | Module grid + portal switcher + pulse stats | Boring grid of links. No real command center feel. No charts, no alerts feed, no actionable items. |

---

## What Needs to Be Designed

Design **5 distinct portal dashboards**, each with its own visual identity while sharing the dark design system. Each portal should feel like a professional SaaS product (Linear, Mercury, Stripe Dashboard, Notion — NOT Bootstrap admin templates).

---

### 1. HOTEL PORTAL — `app/(dashboard)/hotel/page.tsx`

**User:** Procurement manager at a hotel (e.g., Nile Grand Cairo)

**Must Show:**
- **Spend Overview:** Monthly spend vs budget, category breakdown (Food & Bev, Housekeeping, Maintenance, etc.), YoY trend
- **Live Orders Pipeline:** Visual Kanban-style pipeline (Draft → Pending Approval → Approved → Confirmed → In Transit → Delivered). Not a boring table.
- **ETA Compliance:** E-invoice submission status, deadlines, penalty risk
- **Catalog Quick Access:** Top suppliers, recent products, reorder suggestions
- **Factoring Eligibility:** Available credit line, used/unused, apply button
- **Action Items:** Orders needing approval, low stock alerts, ETA deadlines

**Design Direction:** Clean, organized, "control center" feel. Think: Mercury finance dashboard. Data density without clutter.

---

### 2. SUPPLIER PORTAL — `app/(dashboard)/supplier/page.tsx`

**User:** Operations manager at a supplier (e.g., Delta Food Supply)

**Must Show:**
- **Order Pipeline:** Incoming orders from hotels, fulfillment status, delivery commitments
- **Inventory Health:** Stock levels vs reorder points, expiring items, category distribution
- **Revenue & Payments:** Revenue this month, outstanding invoices, factoring status (which invoices are funded)
- **Compliance Score:** ETA e-invoicing compliance %, EGS code sync status, certificate expiry alerts
- **Top Customers:** Which hotels order most, order frequency, growth trend
- **Action Items:** Orders to confirm, low stock alerts, ETA submissions due

**Design Direction:** Action-oriented, logistics feel. Slight industrial aesthetic. Think: Flexport dashboard.

---

### 3. FACTORING COMPANY PORTAL — `app/(dashboard)/factoring/page.tsx` (complete rebuild)

**User:** Credit officer at an NBFI (e.g., Fawry, QNB, CIB)

**THIS DOES NOT EXIST TODAY.** The current page is a hotel-facing marketing page. Build a real working dashboard.

**Must Show:**
- **Credit Pipeline:** Applications pending review → Approved → Funded. With risk scores.
- **Portfolio Overview:** Total exposure, active credit lines, default rate, avg invoice size
- **Application Review Cards:** Hotel name, tax ID, monthly procurement volume, credit requested, risk score, documents attached, approve/reject buttons
- **Funded Invoices:** Which invoices were paid out, repayment status, remaining tenor
- **Partner Hotels:** List of hotels with credit lines, utilization %, payment history
- **Alerts:** Overdue repayments, applications needing review, compliance flags

**Design Direction:** Financial, serious, trustworthy. Think: Stripe Dashboard or Brex. Numbers-first. Subtle green for positive, red for risk (not the brand burgundy).

---

### 4. LOGISTICS / SHIPPING PORTAL — `app/(dashboard)/shipping/page.tsx` (complete rebuild)

**User:** Fleet manager at a logistics company

**THIS DOES NOT EXIST TODAY.** The current page is a hotel-facing tracking view. Build a real working dashboard.

**Must Show:**
- **Live Fleet Map:** Active trips, vehicle locations (even if static/mock), route visualization
- **Trip Schedule:** Today's deliveries, tomorrow's plan, unassigned orders
- **Fleet Status:** Available vehicles, drivers on duty, maintenance alerts
- **Performance Metrics:** On-time delivery %, avg delivery time, damage/complaint rate, cost per km
- **Trip Detail Cards:** Trip number, driver, vehicle, stops (hotels), status, ETA per stop, cargo list
- **Action Items:** Trips needing assignment, delayed shipments, damage reports to resolve

**Design Direction:** Map-first, operational. Think: Uber Freight, Onfleet, or Deliveroo logistics dashboard. Route lines, pins, vehicle cards.

---

### 5. ADMIN COMMAND CENTER — `app/(dashboard)/admin/page.tsx`

**User:** Platform operator / super admin

**Must Show:**
- **Platform Health:** Active users, GMV today, orders this hour, system status
- **Alert Feed:** Real-time actionable items (new supplier applications, disputes, failed ETA submissions, credit line requests, delayed shipments)
- **User & Entity Map:** Hotels count, suppliers count, factoring partners count, logistics partners count. Growth trends.
- **Revenue & Fees:** Platform fee revenue, factoring commission, projected monthly revenue
- **Compliance Overview:** ETA submission rate, EGS code coverage, supplier audit scores
- **Quick Actions:** Approve supplier, review credit application, resolve dispute, send broadcast

**Design Direction:** Power user, dense, scannable. Think: Vercel analytics + Linear issues list. Dark, data-rich, no wasted space.

---

## Design Rules (Non-Negotiable)

1. **NO light backgrounds in dashboards.** Canvas `#050505`, surfaces `#0a0a0a`→`#101010`→`#1a1a1a`.
2. **Brand color is `#8B0000` ONLY.** Use it sparingly for primary CTAs, active states, and key highlights. NEVER for errors (use `#ef4444`).
3. **NO generic admin templates.** No Bootstrap card grids. Every portal must have a distinct layout and information architecture.
4. **Motion with purpose.** Framer Motion for page transitions, staggered card entrances, number counting animations. No bouncing, no confetti.
5. **Data first.** Real data shapes the layout. Don't design for "lorem ipsum" — the APIs return real objects (see below).
6. **Status colors:**
   - Success: `#10b981` (emerald)
   - Warning: `#f59e0b` (amber)
   - Error: `#ef4444` (red)
   - Info: `#3b82f6` (blue)
   - Active/Processing: `#8B0000` (brand burgundy)
7. **Typography:** Use the existing CSS custom properties. `text-primary` for headlines, `text-secondary` for body, `text-tertiary` for metadata.
8. **Spacing:** Generous padding inside cards (`p-5` to `p-6`), tight gaps between related items (`gap-2` to `gap-3`), breathing room between sections (`gap-6` to `gap-8`).

---

## Available Data (Read Existing Hooks)

The project uses a custom hook `useApi` at `lib/hooks/use-api.ts`. It handles auth, loading, error states. Use it.

### Key API endpoints per portal:

**Hotel:**
- `GET /api/v1/hotel/orders?page=1&limit=10` → `{ orders: Order[], pagination: { total } }`
- `GET /api/v1/hotel/catalog` → products
- `GET /api/v1/hotel/spend` → spend analytics
- `GET /api/v1/invoices` → invoices with ETA status

**Supplier:**
- `GET /api/v1/supplier/orders` → orders
- `GET /api/v1/supplier/inventory` → products with stock
- `GET /api/v1/supplier/profile` → supplier data

**Factoring (NBFI):**
- `GET /api/v1/factoring/credit-lines` → all credit lines
- `GET /api/v1/factoring/applications` → applications
- `GET /api/v1/factoring/invoices` → funded invoices
- `POST /api/v1/factoring/credit-lines/[id]/approve` → approve
- `POST /api/v1/factoring/credit-lines/[id]/reject` → reject

**Shipping:**
- `GET /api/v1/shipping/trips` → trips
- `GET /api/v1/logistics/hubs` → hubs
- `GET /api/v1/shipping/routes/optimize` → route optimization

**Admin:**
- `GET /api/v1/admin/pulse` → platform stats
- `GET /api/v1/admin/activity` → activity feed
- `GET /api/v1/admin/users` → users
- `GET /api/v1/admin/orders` → all orders

**Read the existing page files to see the exact TypeScript interfaces** for `Order`, `Product`, `Trip`, `CreditLine`, etc.

---

## Shared Components to Use / Extend

Existing reusable components in `components/dashboards/shared/`:
- `stat-card.tsx` — stat with label, value, trend arrow
- `section-card.tsx` — card container with header
- `loading-card.tsx` / `loading-table.tsx` — skeleton loaders
- `empty-state.tsx` — empty state illustration + message

Existing UI in `components/ui/`:
- `modal.tsx` — full-screen modal
- `button-enterprise.tsx` — primary button
- `card-enterprise.tsx` — card container

**DO NOT** create new shared components unless absolutely necessary. Extend existing ones or build portal-specific components inline.

---

## Files to Modify

1. `app/(dashboard)/hotel/page.tsx` — redesign
2. `app/(dashboard)/supplier/page.tsx` — redesign
3. `app/(dashboard)/factoring/page.tsx` — **complete rebuild** (NBFI portal)
4. `app/(dashboard)/shipping/page.tsx` — **complete rebuild** (logistics portal)
5. `app/(dashboard)/admin/page.tsx` — redesign

Optional but recommended:
6. `app/(dashboard)/hotel/catalog/page.tsx` — hotel catalog browsing
7. `app/(dashboard)/hotel/invoices/page.tsx` — invoice management
8. `app/(dashboard)/supplier/products/page.tsx` — product management
9. `app/(dashboard)/supplier/orders/page.tsx` — order management
10. `app/(dashboard)/factoring/credit-lines/page.tsx` — credit line list
11. `app/(dashboard)/factoring/status/page.tsx` — application status

---

## Logo

The logo file is at `public/logo-icon-white.png`. It must appear on:
- Marketing nav (`components/layout/marketing-nav.tsx`)
- Dashboard sidebar (if you add one)
- Auth pages (`app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`)

Current marketing nav uses `BrandLogo` component from `components/layout/marketing-nav.tsx`. Check that it renders correctly.

---

## Deliverable Format

For each portal, deliver:
1. **The complete page.tsx file** — working, typed, using `useApi` for data
2. **Any new sub-components** — co-located in the same file or in `components/dashboards/[portal-name]/`
3. **A screenshot description** — what the layout looks like (for the user to verify)

Test every page by running `npm run build` locally. It must compile with zero TypeScript errors (or use `// @ts-ignore` sparingly).

---

## Reference Designs

Study these for layout inspiration:
- **Linear.app** — issue lists, command palette, dark surfaces
- **Mercury.com** — finance dashboard, card layouts, transaction feeds
- **Stripe Dashboard** — metrics, clean tables, action buttons
- **Vercel Analytics** — charts, time-series data, clean typography
- **Flexport** — logistics, maps, shipment tracking
- **Onfleet** — driver management, route visualization

**DO NOT** copy their code. Copy their *information architecture* — how they group data, how they use whitespace, how they handle empty states, how they make actions discoverable.

---

## Build & Deploy Notes

```bash
cd /var/www/hotelsvendors-v2
npm run build:prod    # runs next build + fixes standalone static chunks
pm2 restart hotels-vendors-v2
```

**Critical:** After every `next build`, static JS/CSS chunks must be copied from `.next/static/` to `.next/standalone/hotelsvendors-v2/.next/static/chunks/`. The `build:prod` script handles this automatically.

---

*End of brief.*
