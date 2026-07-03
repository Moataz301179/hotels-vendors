# INVO + Hotels Vendors — Scope Definition

## Architecture

```
hotelsvendors.com          →  HV Marketing + Auth + Dashboards
├── /                      →  Marketing landing (orange theme)
├── /login                 →  Auth (orange theme)
├── /register              →  Auth (orange theme)
├── /dashboard/*           →  Role dashboards (orange theme)
└── /api/v1/*              →  All API routes (shared)

invo.hotelsvendors.com     →  INVO Infrastructure (lime theme)
├── /                      →  INVO landing page
├── /docs                  →  API documentation
├── /partner               →  Partner onboarding
└── /api/v1/invo/*         →  INVO-specific API routes
```

---

## HV Scope (Hotels Vendors)

**Identity:** The hospitality brand hotels trust. Warm, professional, conversion-focused.
**Audience:** Hotel procurement managers, GMs, CFOs in Egypt.
**Theme:** Orange `#F97316` accent on `#0B0F1A` dark canvas.
**Font:** Light weights only (300, 400, 500). NO bold (700+).

### Pages
1. **Marketing Home** (`app/(marketing)/page.tsx`)
   - Hero: Pain-forward headline ("Stop Leaking Money...")
   - Feature grid: 6 capabilities, icon + title + description
   - How It Works: 4 steps
   - Testimonials: 3 hotel quotes
   - Pricing: 3 tiers
   - CTA banner
   - Footer

2. **Auth** (`app/(auth)/`)
   - Login, Register, Forgot Password, Verify Email

3. **Dashboards** (`app/(dashboard)/`)
   - Hotel buyer portal
   - Supplier central
   - Admin panel
   - Factoring dashboard
   - Shipping/logistics

---

## INVO Scope (Infrastructure)

**Identity:** The API and logistics layer. Technical, reliable, developer-friendly.
**Audience:** Suppliers, logistics providers, developers, bank partners.
**Theme:** Lime `#84CC16` accent on `#0B0F1A` dark canvas.
**Font:** Light weights only (300, 400, 500). NO bold.

### Pages
1. **Landing** (`app/invo/page.tsx`)
   - Hero: "One API. Every Hotel. Zero Integration."
   - Integration cards: Catalog Sync, Route Engine, Payment Rails, ETA Bridge
   - Partner types: Suppliers, Logistics, Banks
   - Code preview: curl example
   - CTA: "Connect Your Inventory"

2. **Docs** (`app/invo/docs/`)
   - API reference
   - Authentication guide
   - Webhook specs

3. **Partner Portal** (`app/invo/partner/`)
   - Onboarding form
   - Status tracking

### API Routes (`app/api/v1/invo/`)
1. `GET  /health` — Service health check
2. `GET|POST /catalog` — Catalog CRUD
3. `POST /delivery/quote` — Delivery pricing
4. `POST /delivery/route` — Route assignment
5. `POST /settlement` — Payment execution
6. `POST /partners/onboard` — Partner registration
7. `GET  /partners/status/[id]` — Onboarding status
8. `GET  /docs` — API documentation JSON

---

## AI Automation Workflows

### 1. Demand Forecasting Engine
- **Input:** Historical orders, occupancy data, seasonality, local events
- **Process:** Time-series model predicts 14-day consumption
- **Output:** Auto-generated purchase orders with suggested quantities
- **Trigger:** Daily at 6 AM or on-demand

### 2. Auto-Reorder System
- **Input:** Par levels set per SKU per hotel, current stock, forecast
- **Process:** When projected stock < par level, generate PO
- **Output:** Draft PO → Authority Matrix approval → Supplier notification
- **Trigger:** Real-time (webhook on inventory update) + daily batch

### 3. Route Optimization
- **Input:** Active orders, supplier locations, hotel locations, vehicle capacity
- **Process:** TSP solver + clustering for coastal consolidation
- **Output:** Optimized delivery routes with ETA
- **Trigger:** Order batch cutoff (daily at 4 PM)

### 4. Smart Settlement
- **Input:** Delivered orders, supplier terms, factoring eligibility
- **Process:** Calculate platform fee → deduct → route to factoring if eligible → execute payment
- **Output:** Settlement record + receipt
- **Trigger:** Order status = DELIVERED

### 5. Risk Engine (Smart Fix)
- **Input:** Hotel credit limit, outstanding balance, order value
- **Process:** If blocked, generate fix: Deposit | High-Risk Factoring | Split Payment | Auto Limit Extension
- **Output:** Fix proposal auto-executed or presented to hotel
- **Trigger:** Order validation

---

## Design Rules (Both Brands)

1. **NO bold fonts.** Use weight 300 (light), 400 (regular), 500 (medium) only.
2. **Thin header border:** `border-b border-white/5` between nav and content.
3. **NO generic stat cards.** No "Up to 20%" with progress bars. Use:
   - Icon + metric + label (clean, minimal)
   - Animated number counters
   - Horizontal stat bars (subtle)
4. **Premium effects:**
   - Subtle gradient glows (not neon)
   - Micro-interactions on hover (lift + border brighten)
   - Staggered entrance animations
   - Noise texture overlay on hero
5. **Card style:** Solid dark (`#111827`), rounded-2xl, border `white/5`, hover `white/10`.
6. **Icons:** All white fill. Only small labels/accent text uses brand color.
