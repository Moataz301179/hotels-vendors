# INVO vs Hotels Vendors — Architectural Separation

> **Status:** APPROVED — CEO Decision  
> **Date:** June 2026  
> **Scope:** Codebase structure, domain strategy, user-facing separation

---

## The Core Decision

**INVO and Hotels Vendors are SEPARATE entities. Period.**

| | INVO | Hotels Vendors |
|---|---|---|
| **What it is** | Horizontal B2B infrastructure company | Vertical hospitality brand |
| **Serves** | ALL businesses (hotels, restaurants, retailers, pharmacies) | Hotels ONLY |
| **Customer sees** | APIs, dashboards, logistics tracking, payment settlement | Procurement portal, ETA compliance, AI forecasting |
| **Revenue model** | SaaS fees per transaction, logistics markup, API subscriptions | Transaction fees, supplier subscriptions, factoring spread |
| **Brand visibility** | **Visible to suppliers and logistics partners** | **Visible to hotels** |
| **Domain** | `invo.hotelsvendors.com` (for now) or separate domain later | `hotelsvendors.com` |

---

## What Users See (The Illusion)

### Hotel User Flow
```
Hotel GM opens hotelsvendors.com
        ↓
Sees: Hotels Vendors branding ONLY
        ↓
Browses catalog, places order, tracks delivery
        ↓
Delivery comes from "Hotels Vendors Logistics"
        ↓
Invoice says "Hotels Vendors" — ETA compliant
        ↓
Supplier paid via "Hotels Vendors Payments"
```

**The hotel NEVER sees INVO.** To them, Hotels Vendors is a full-stack platform that somehow has suppliers, trucks, and payments. They don't need to know INVO exists.

### Supplier User Flow
```
Supplier opens supplier dashboard
        ↓
Sees: "Hotels Vendors Supplier Central" branding
        ↓
But also sees: "Powered by INVO Infrastructure"
        ↓
Manages inventory via INVO API
        ↓
Gets paid via INVO payment rails
        ↓
Delivery assigned via INVO logistics
```

**The supplier sees BOTH brands.** They need to know INVO handles the infrastructure because they may also sell through other INVO-powered platforms.

### Logistics Partner Flow
```
Truck driver opens INVO driver app
        ↓
Sees: INVO branding ONLY
        ↓
Picks up orders from multiple sources
        ↓
Some orders labeled "HV-Hotel" 
Some orders labeled "INV-Restaurant"
Some orders labeled "INV-Pharmacy"
```

**The driver sees INVO only.** They're INVO employees/partners, not Hotels Vendors.

---

## Codebase Separation

### Option A: Same Repo, Separate Routes (CURRENT — What We Have)

```
hotels-vendors/                    ← Single repo
├── app/
│   ├── (marketing)/               ← Hotels Vendors public site
│   │   └── page.tsx               ← hotelsvendors.com/
│   ├── (auth)/                    ← HV auth pages
│   ├── (dashboard)/               ← HV dashboards (hotel, supplier, factoring)
│   ├── api/
│   │   ├── v1/                    ← HV-specific APIs
│   │   └── webhooks/              ← External webhooks
│   └── invo/                      ← INVO infrastructure layer
│       ├── page.tsx               ← invo.hotelsvendors.com/
│       ├── api/                   ← INVO APIs (supplier feed, logistics, payments)
│       └── dashboard/             ← INVO admin dashboards
├── components/
│   ├── dashboards/                ← HV role dashboards
│   └── invo/                      ← INVO-specific components
├── lib/
│   ├── inventory/                 ← INVO inventory sync
│   ├── logistics/                 ← INVO route optimization
│   ├── payments/                  ← INVO payment rails
│   └── eta/                       ← HV ETA compliance (invisible)
└── public/
    └── invo/                      ← INVO assets
```

**Pros:** Shared components, shared database, faster iteration  
**Cons:** Risk of coupling, harder to spin out INVO later

### Option B: Separate Repos (FUTURE — When INVO Spins Out)

```
hotels-vendors/                    ← HV repo
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/
│       └── v1/
│           └── invo/              ← HV calls INVO API
├── lib/
│   └── invo-client.ts             ← INVO API client

invo-infrastructure/               ← INVO repo (separate)
├── app/
│   ├── api/                       ← Supplier feed, logistics, payments APIs
│   └── dashboard/                 ← INVO admin
├── lib/
│   ├── supplier-feed/
│   ├── route-optimizer/
│   └── payment-rails/
```

**Pros:** Clean separation, INVO can raise independently, multiple verticals  
**Cons:** More ops overhead, API contract discipline required

**DECISION:** Start with Option A (same repo). Migrate to Option B when INVO signs its first non-HV customer.

---

## Domain Strategy

### Current Setup (VPS)
```
hotelsvendors.com         → Port 3002 (Next.js — Hotels Vendors)
www.hotelsvendors.com     → Port 3002
invo.hotelsvendors.com    → Port 3001 (Next.js — INVO admin + APIs)
```

### Future Setup (Post-Migration)
```
hotelsvendors.com         → Vercel (HV marketing + dashboards)
app.hotelsvendors.com     → Vercel (HV app shell)
api.hotelsvendors.com     → Vercel Edge Functions (HV APIs)

invo.hotelsvendors.com    → Separate Vercel project or VPS
api.invo.hotelsvendors.com→ INVO API gateway
```

### Brand Strategy

**Phase 1 (Now):** INVO is a subdomain of hotelsvendors.com
- `invo.hotelsvendors.com` — INVO admin dashboards
- Hotels Vendors is the visible brand
- INVO is mentioned to suppliers as "powered by INVO"

**Phase 2 (When INVO signs non-HV customers):**
- INVO gets its own domain: `invo.live` or `invia.live` style
- Hotels Vendors becomes "a Hotels Vendors company, powered by INVO"
- INVO markets to restaurants, retailers, pharmacies independently

**Phase 3 (When both are mature):**
- INVO = Infrastructure company (like AWS for B2B logistics)
- Hotels Vendors = Vertical brand (like Amazon for hospitality)
- Other verticals emerge: Restaurants Vendors, Pharmacies Vendors, etc.

---

## API Contract (HV ↔ INVO)

Even in the same repo, HV and INVO communicate through a defined API contract. This makes future separation painless.

### INVO Exposes (Internal API Routes)
```
/invo/api/v1/supplier-feed       → Catalog of all suppliers + SKUs
/invo/api/v1/logistics/quote     → Get delivery quote for route
/invo/api/v1/logistics/assign    → Assign order to shared route
/invo/api/v1/logistics/track     → Track delivery in real-time
/invo/api/v1/payments/quote      → Get settlement options
/invo/api/v1/payments/settle     → Execute payment
/invo/api/v1/inventory/sync      → Real-time inventory levels
```

### HV Uses (Server Actions or API Calls)
```typescript
// HV calls INVO internally (same repo, but through API)
const quote = await fetch("http://localhost:3001/invo/api/v1/logistics/quote", {
  method: "POST",
  body: JSON.stringify({ origin, destination, weight, volume })
});

// Or direct function call (same repo shortcut)
import { getLogisticsQuote } from "@/lib/invo/logistics";
```

**Rule:** HV code NEVER touches INVO database tables directly. Always go through the API layer. This ensures clean separation even in the same repo.

---

## Database Separation

### Current (Shared Database)
```sql
-- INVO tables
invo_suppliers
invo_inventory
invo_routes
invo_deliveries
invo_payments

-- HV tables
hv_hotels
hv_orders
hv_authority_rules
hv_audit_logs
hv_eta_invoices

-- Shared tables (both read)
shared_users
shared_tenants
```

### Future (Separate Databases)
```sql
-- INVO database (invo_db)
suppliers
inventory
routes
deliveries
payments

-- HV database (hv_db)
hotels
orders
authority_rules
audit_logs
eta_invoices
```

**Migration path:** Add `invo_` prefix now. Remove prefix and move to separate DB when INVO spins out.

---

## What This Means for the Frontend

### Hotels Vendors Site (`hotelsvendors.com`)
- **Brand:** Hotels Vendors ONLY
- **Content:** Hospitality procurement, AI forecasting, ETA compliance
- **Audience:** Hotel GMs, procurement managers, hotel group owners
- **No mention of INVO** except maybe small "Powered by" footer

### INVO Site (`invo.hotelsvendors.com`)
- **Brand:** INVO
- **Content:** Supplier dashboards, logistics tracking, payment settlement
- **Audience:** Suppliers, logistics partners, warehouse operators
- **Mentions Hotels Vendors** as "one of our vertical platforms"

### Auth Strategy
- Hotels use `hotelsvendors.com/login`
- Suppliers use `hotelsvendors.com/login` (same portal, role-based redirect)
- INVO admins use `invo.hotelsvendors.com/login` (separate portal)

---

## Summary: What the AI Agent Must Know

1. **INVO and HV are separate business entities** — same repo for now, separate repos later
2. **Hotels see HV only** — INVO is invisible to hotel users
3. **Suppliers see both** — they know INVO powers the infrastructure
4. **Logistics see INVO only** — they're INVO partners, not HV
5. **Domain:** `hotelsvendors.com` for HV, `invo.hotelsvendors.com` for INVO
6. **API contract:** HV calls INVO through defined APIs, never direct DB access
7. **Brand strategy:** HV is the customer-facing brand. INVO is the infrastructure backbone. INVO becomes independently visible when it signs non-HV customers.

---

*This is architecture. Not colors. Not fonts. The foundation everything else sits on.*
