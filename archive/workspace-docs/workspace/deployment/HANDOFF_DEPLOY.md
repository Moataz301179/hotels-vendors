# Hotels Vendors — Complete Handoff Document

> **Version:** 1.1  
> **Date:** 2026-06-03  
> **Prepared for:** Next deployment agent  
> **Scope:** Deployment, design verification, business context, pending work

---

## Table of Contents

1. [Deployment Instructions](#1-deployment-instructions)
2. [Design System & Content Spec](#2-design-system--content-spec)
3. [The Moat — Why We Win](#3-the-moat--why-we-win)
4. [Platform Workflow](#4-platform-workflow)
5. [INVO vs Hotels Vendors — Two-Entity Architecture](#5-invo-vs-hotels-vendors--two-entity-architecture)
6. [Broad Vision](#6-broad-vision)
7. [Know-How & Technical Decisions](#7-know-how--technical-decisions)
8. [Roadmap & Phases](#8-roadmap--phases)
9. [Pending Tasks](#9-pending-tasks)
10. [File Inventory](#10-file-inventory)

---

## 1. Deployment Instructions

### Server Access
```
SSH Key: /Users/Moataz/hotels-vendors/.ssh/kimi_deploy (private)
Server: root@187.77.181.3
App Directory: /var/www/hotelsvendors-v2
Nginx Config: /etc/nginx/sites-enabled/hotelsvendors
```

### Pre-Deployment Cleanup
**CRITICAL:** Do these first or the deployment will fail.

```bash
# 1. Stop the respawn daemon
systemctl stop hv-health-monitor
systemctl disable hv-health-monitor

# 2. Delete all PM2 apps (leave 'invo' alone on port 3001)
pm2 delete hotelsvendors 2>/dev/null || true

# 3. Kill ALL next-server and next-start processes
pkill -9 -f "next-server"
pkill -9 -f "next start"
pkill -9 -f "node.*server.js"
sleep 2
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 3002/tcp 2>/dev/null || true
sleep 1

# 4. Verify ports are free
ss -tlnp | grep -E "3000|3002" || echo "Ports free"
```

### Build & Start
```bash
cd /var/www/hotelsvendors-v2
rm -rf .next
NODE_OPTIONS="--max-old-space-size=1536" node node_modules/next/dist/bin/next build
```

**If build succeeds:**
```bash
# Update nginx to use port 3003 (NOT 3000 or 3002 — both are cursed)
sed -i 's/127.0.0.1:300[0-2]/127.0.0.1:3003/g' /etc/nginx/sites-enabled/*
nginx -t && nginx -s reload

# Start server using tmux (avoids SSH disconnect)
tmux new-session -d -s hv "cd /var/www/hotelsvendors-v2 && NODE_ENV=production PORT=3003 node node_modules/next/dist/bin/next start"
```

### Verification
```bash
# Content check
curl -s http://127.0.0.1:3003 | grep -c "Stop Leaking Money"   # MUST return 1
curl -s http://127.0.0.1:3003 | grep -c "2,400+ Hotels"         # MUST return 1
curl -s http://127.0.0.1:3003 | grep -c "Before It Controls"    # MUST return 1
curl -s http://127.0.0.1:3003 | grep -c "AI Demand Forecasting" # MUST return 1

# Service worker check
curl -s http://127.0.0.1:3003/sw.js | grep -c "hv-static-v2"   # MUST return 1

# Title check
curl -s http://127.0.0.1:3003 | grep "<title>"
# Expected: <title>HotelsVendors — B2B Procurement for Egyptian Hospitality | HotelsVendors</title>
```

### Common Failures
| Symptom | Cause | Fix |
|---|---|---|
| `EADDRINUSE: port 3000` | Zombie process holding port | Kill with `fuser -k 3000/tcp` |
| SSH disconnects on start | `nohup` causes shell issues | Use `tmux` instead |
| `standalone/server.js` not found | `output: "standalone"` is broken | Use `next start` |
| Old content still showing | Service worker cache v1 | Ensure `public/sw.js` has `hv-static-v2` |
| Build hangs | OOM | Use `NODE_OPTIONS="--max-old-space-size=1536"` |

---

## 2. Design System & Content Spec

### Color Palette
| Role | Hex | Notes |
|---|---|---|
| Background | `#0B0F1A` | Deep navy-black |
| Surface | `#121212` | Card backgrounds |
| Accent Orange | `#F97316` | Primary (default) |
| Accent Lime | `#84CC16` | Secondary (toggleable) |
| Text Primary | `#ffffff` | Headlines |
| Text Secondary | `#A1A1AA` | Body copy |
| Text Muted | `#71717A` | Captions |
| Border | `rgba(255,255,255,0.06-0.12)` | Subtle dividers |

**PURGE:** `#8B0000` crimson — this is the OLD color. Must not appear anywhere.

### Theme Toggle
- Two circular buttons side by side in nav (desktop + mobile)
- Left: lime green dot/circle
- Right: orange dot/circle
- Active state: filled with color + glow shadow
- Inactive state: transparent border + colored dot
- Must be visible before "Sign In" button

### Marketing Page Sections (MUST be present)

#### 2.1 Hero
- Badge: "B2B PROCUREMENT EGYPT"
- Headline: "Control Your Hotel's Supply Chain Before It Controls You."
- Subhead: "From F&B to capital equipment: track every dirham, automate every order, and get AI demand forecasting that prevents waste before it happens."
- CTAs: "Start Free — No Credit Card" (primary) + "Watch How It Works" (ghost)
- Trust row: "5-STAR" | "BOUTIQUE" | "RESORT" | "BUSINESS"

#### 2.2 Stats Bar
| Value | Label |
|---|---|
| 10–20 | Daily supplier deliveries per hotel |
| 60% | Kitchen food waste before guest sees meal |
| ~20% | F&B inventory lost to spoilage |
| EGP 100K | ETA penalty exposure per hotel |

#### 2.3 How It Works (3 steps)
| # | Title | Description |
|---|---|---|
| 01 | Connect Your Suppliers | Onboard existing suppliers. Free dashboard for orders, invoices, payments. |
| 02 | AI Forecasts Your Needs | Engine analyzes occupancy, seasonality, consumption, events. |
| 03 | Order, Track & Pay Compliant | POs with pre-order cost estimates. Real-time delivery tracking. ETA e-invoicing auto. |

#### 2.4 Platform Categories (5 cards)
| Icon | Title | Accent |
|---|---|---|
| F&B | F&B Procurement | lime |
| HSK | Housekeeping | orange |
| ENG | Engineering | orange |
| AMN | Amenities | lime |
| CAP | Capital Equipment | orange |

#### 2.5 Features Grid (6 cards, lime/orange alternating)
- AI Demand Forecasting (lime)
- Authority Matrix (orange)
- Native ETA Compliance (lime)
- Supplier Factoring (orange)
- Shared Logistics (lime)
- Supply Chain Finance (orange)

#### 2.6 For Hotels
- AI Demand Forecasting
- Cost Estimation Pre-Order
- Reorder Alerts
- Spend Analytics Dashboard

#### 2.7 For Suppliers
- Instant InstaPay Settlement (<10 seconds)
- Non-Recourse Factoring (paid in 24h, zero risk)
- Purchase Order Visibility

#### 2.8 CTA Section
- Headline: "Stop Leaking Money Into Your Supply Chain."
- Subhead: "Join 2,400+ Egyptian hotels that have turned procurement from a cost center into a competitive advantage."
- CTA: "Get Started Free"

#### 2.9 Footer
- HotelsVendors logo + brand
- Platform links: Features, Pricing, Solutions
- Company links: About, Careers, Contact
- Legal links: Privacy, Terms, ETA Compliance
- Copyright 2026

---

## 3. The Moat — Why We Win

The Hotels Vendors platform has a **non-replicable competitive moat** that no horizontal competitor can copy:

### 3.1 The Authority Matrix
This is NOT software. It is 18 months of relationship-building with Egyptian family business owners to understand why their procurement approval rules exist:

- Order value thresholds by hotel tier (3-star vs 5-star vs resort)
- Role hierarchies: Procurement Manager → GM → Regional Director → Family Patriarch
- Supplier tiers: approved vs probationary vs blacklisted
- Seasonal exceptions: Ramadan, New Year, summer coastal surge
- Emergency overrides: dual-signature required, 20+ character reason, escalated alert

**Why MaxAB can't compete:** They have horizontal volume but zero vertical governance. A hotel GM in Sharm El-Sheikh will not trust a platform that doesn't understand why his uncle must approve EGP 100K+ orders in person.

### 3.2 ETA Native Integration
- Full Egyptian Tax Authority e-invoicing compliance
- Invoice payloads digitally signed with ETA-required UUID and serial number
- Failed submissions go to dead-letter queue with automatic retry
- **No competitor** has hospitality-native ETA integration

### 3.3 Four-Wheel Orchestration
AI connects four real-time data streams:
1. **Demand** (Hotel occupancy, events, seasonality)
2. **Supply** (Supplier inventory, pricing, capacity)
3. **Logistics** (Shared routes, coastal clusters, delivery SLAs)
4. **Capital** (Factoring liquidity, credit lines, InstaPay settlement)

Price is an **emergent property** of network state — not an auction.

### 3.4 Relationship Moat
- 2,400+ hotels onboarded across Egypt
- 680+ verified suppliers
- EGP 4.2B annual GMV processed
- 36-hour average delivery time
- 28% average cost reduction

---

## 4. Platform Workflow

### 4.1 Order Lifecycle (End-to-End)

```
1. HOTEL creates Purchase Order via HV portal
        ↓
2. AUTHORITY MATRIX evaluates approval chain
   (value threshold × hotel hierarchy × supplier tier × season)
        ↓
3. APPROVED → Order published to INVO supplier feed API
        ↓
4. SUPPLIER confirms availability + delivery slot via dashboard
        ↓
5. INVO logistics assigns shared-route vehicle
   (coastal cluster optimization, last-mile consolidation)
        ↓
6. DELIVERY executed → Proof of delivery uploaded
        ↓
7. INVOICE auto-generated → ETA UUID assigned
        ↓
8. ETA SUBMISSION to Egyptian Tax Authority API
   (digitally signed, UUID + serial number)
        ↓
9. PAYMENT SETTLEMENT via INVO rails
   - Supplier paid in <10s via InstaPay IPN
   - OR non-recourse factoring (supplier paid in 24h, factoring partner takes risk)
        ↓
10. HV FEE deducted (1.5–2.5% of order value)
        ↓
11. AUDIT LOG written with beforeState + afterState snapshots
```

### 4.2 Four-Sided Marketplace

| Side | Role | Revenue Stream |
|---|---|---|
| **Hotels** | Buyers — procurement portal + financial dashboard | Pay transaction fees |
| **Suppliers** | Sellers — inventory, orders, payments | Pay subscription + transaction fees |
| **Logistics** | Delivery — shared-route fulfillment network | Per-km + per-kg fees |
| **Factoring** | Capital — embedded liquidity + credit marketplace | Interest spread + discount |

### 4.3 Compliance Backbone
- Every invoice must pass ETA validation before payment
- Authority Matrix governs ALL order mutations
- Admin overrides require dual-authorization + 20+ character reason + escalated alert
- Immutable audit log with cryptographic snapshots

---

## 5. INVO vs Hotels Vendors — Two-Entity Architecture

### INVO (Infrastructure Company)
**Serves ALL businesses in Egypt** — not just hotels.

| What INVO Runs | How It Makes Money |
|---|---|
| Shipping/Logistics | Per-km delivery fees + per-kg fees |
| Warehouse Network | Per-pallet storage fees |
| Supplier Feed API | SaaS fee per transaction (0.3–0.5%) |
| Payment Rails | Processing fees (1.5–2%) |
| Inventory Sync | API subscription tiers |

**INVO's customers:** Hotels, restaurants, retailers, manufacturers, pharmacies — anyone who needs logistics and payments.

### Hotels Vendors (Vertical Brand)
**Serves ONLY hotels** — the hospitality layer on top of INVO.

| What HV Does | How It Makes Money |
|---|---|
| Procurement Portal | Transaction fees (1.5–2.5%) |
| ETA Compliance | Per-invoice submission fees |
| Authority Matrix | Governance SaaS for hotel groups |
| Factoring Marketplace | Spread from factoring partners |
| AI Forecasting | Data insights subscriptions |

**HV's customers:** Hotel groups, individual hotels, resort chains.

### How Shipping Works Between Them

```
HOTEL creates PO on Hotels Vendors portal
        ↓
HV sends order to INVO Logistics API
        ↓
INVO assigns shared-route vehicle
(INVO optimizes across ALL its customers —
 hotels, restaurants, retailers, etc.)
        ↓
INVO delivers to hotel
        ↓
INVO sends proof-of-delivery back to HV
        ↓
HV shows "Delivered" to hotel + triggers payment
```

**Why this works:**
- INVO fills trucks with orders from hotels + restaurants + retailers = cheaper per delivery
- Hotels Vendors doesn't own trucks — it just calls INVO's API
- INVO makes money on delivery fees. HV makes money on the procurement transaction.

**Real example:**
- HV sends EGP 50K F&B order to INVO
- INVO puts it on a truck that's also carrying a restaurant order and a pharmacy order
- Delivery cost: EGP 500 (shared across 3 customers = EGP 167 each)
- INVO charges HV EGP 500 delivery fee
- HV bills hotel EGP 50,500 (order + delivery markup)

**Bottom line:** INVO is FedEx. Hotels Vendors is Amazon. FedEx delivers for everyone. Amazon is just one of FedEx's biggest customers.

---

## 6. Broad Vision

### 6.1 "The Amazon of Egyptian Hospitality"

| Amazon Layer | Hotels Vendors Equivalent | Status |
|---|---|---|
| Buyers (customers) | Hotels — procurement portal | ✅ MVP Live |
| Sellers (merchants) | Suppliers — Supplier Central | ✅ MVP Live |
| Fulfilment (FBA) | INVO shared logistics | 🟡 Pilot (Week 4) |
| Payments (Amazon Pay) | Embedded InstaPay + factoring | 🟡 CIB term sheet pending |
| Prime (loyalty) | Hotel group subscriptions | 🔴 Q3 Roadmap |
| AWS (infrastructure) | INVO API marketplace | 🔴 Q4 Roadmap |
| Alexa (AI assistant) | HV Smart Assistant (role-specific) | ✅ Live |

### 6.2 Market Position
- **Addressable Market:** Egyptian hospitality = $21.54B (2026), 7.12% CAGR
- **Chain hotels:** 51.2% share and climbing
- **Closest competitor:** MaxAB-Wasoko ($251M revenue, 450K+ merchants) — horizontal FMCG, NOT hospitality-vertical
- **Global threat:** FutureLog — strong hospitality P2P but zero Egyptian presence, no ETA integration

### 6.3 Key Gaps We Fill
1. No ETA-native hospitality platform exists in Egypt
2. No multi-property procurement governance (hotel groups use WhatsApp + Excel)
3. No coastal-cluster logistics optimization (seasonal supply chaos)
4. No embedded factoring for hotel cash-flow cycles (generic BNPL ignores seasonality)
5. No hospitality-specific SKU search

### 6.4 Profitability Targets
- **Break-even:** 150 properties × EGP 750K monthly GMV → ~30% net margin
- **Revenue streams:** Transaction fees (1.5–2.5%) + Supplier subscriptions + Sponsored listings + Logistics markup + Factoring spread + ETA compliance SaaS + Data insights
- **Storage-to-Revenue model:** Daily ordering via shared logistics frees 60% of hotel storage. A 15-property chain gains ~$780K/year in "Found Money."

---

## 7. Know-How & Technical Decisions

### 7.1 Architecture Decisions
| Decision | Why | Status |
|---|---|---|
| Next.js 16 + App Router | Server components, streaming, Turbopack | ✅ Live |
| Tailwind CSS v4 | Utility-first, v4 syntax in `app/globals.css` | ✅ Live |
| Prisma + PostgreSQL | Type-safe ORM, multi-tenant schema | 🟡 Migrating from SQLite |
| Custom JWT + Middleware | Tenant-aware sessions, server-side RBAC | ✅ Live |
| BullMQ + Redis | 4 squad queues (growth, ops, intel, execution) | ✅ Live |
| Ollama Primary LLM | Zero-cost inference on VPS | ✅ Live |
| `output: "standalone"` | For containerized deployment | ❌ BROKEN on VPS — use `next start` |

### 7.2 System Guardrails (Non-Negotiable)
1. **Tenant Isolation:** Every query must be tenant-scoped
2. **RBAC Server-Side Only:** No client-side role switching
3. **Authority Matrix:** All order mutations pass evaluation
4. **ETA Bridge Invisible:** Zero UI routes, background-only
5. **Inventory Sync:** REST + Webhooks only (no WebSockets)
6. **AI Assistant:** Role-specific prompts, no cross-tenant data
7. **Dark Mode Glassmorphism:** Professional greys, brand accent, high contrast
8. **API Versioning:** All new routes under `api/v1/`
9. **Fintech Gates:** Payment guarantee + ETA validation + non-recourse factoring

### 7.3 Known Issues
| Issue | Severity | Fix |
|---|---|---|
| Redis `ECONNREFUSED` during build | Low (non-blocking) | Make Redis connection lazy |
| Middleware deprecation warning | Low (informational) | Migrate to proxy convention |
| Prisma multi-tenant migration | Medium | Simplify to single-tenant + org hierarchy |
| Oliv Finance API credentials | **BLOCKING** | Pending unblocking in `data/build/blockers.json` |
| Admin AI pages deleted | Medium | May need replacement dashboards |

### 7.4 File Structure Rules
- New pages: `app/(marketing)/`, `app/(auth)/`, `app/(dashboard)/[role]/`
- New APIs: `app/api/v1/`
- UI primitives: `components/ui/`
- Business logic: `lib/`
- **DEPRECATED:** `app/(app)/`, `src/app/` — do NOT use

---

## 8. Roadmap & Phases

### Phase 1 — Foundation (Days 1–30)
| # | Task | Owner | Deliverable |
|---|---|---|---|
| 1 | PostgreSQL + Prisma schema | Fintech Architect | Hotels, Suppliers, Orders, Invoices schema |
| 2 | Authority Matrix v1 design | Security Expert | Database-driven rule engine |
| 3 | ETA sandbox integration | Integration Lead | First test invoice submitted |
| 4 | Design system v1 | UX Designer | Grey/red/white palette, glassmorphism, bento grids |
| 5 | Master registry 200+ suppliers | Data Harvester | JSON/CSV seeded data |
| 6 | CIB term sheet draft | Business Strategist | Signed LOI |

### Phase 2 — Pilot (Days 31–60)
| # | Task | Owner | Deliverable |
|---|---|---|---|
| 7 | 5 pilot hotel groups (20+ properties) | Business Strategist | Closed-beta agreements |
| 8 | Landing pages for SEO | SEO Strategist | "hotel procurement Egypt" ranking |
| 9 | Hotel Procurement Portal MVP | UX Designer | Catalog browse, PO builder, order tracking |
| 10 | Fee-calculation service | Fintech Architect | Idempotency keys, double-entry ledger |
| 11 | Shared logistics pilot | Integration Lead | Cairo → Alexandria route live |
| 12 | Supplier Central v1 | UX Designer | Inventory, orders, payments dashboard |

### Phase 3 — Compliance & Scale (Days 61–90)
| # | Task | Owner | Deliverable |
|---|---|---|---|
| 13 | ETA production pipeline | Integration Lead | Dead-letter queue, auto-retry |
| 14 | Route-level authorization | Security Expert | Field-level permission checks |
| 15 | Cross-module dependency audit | The Auditor | Zod validation on all API routes |
| 16 | First factoring company term sheet | Business Strategist | CIB or Oliv execution |
| 17 | Supplier exclusivity agreements | Business Strategist | 6th of October cluster locked |

### Phase 4 — Growth (Days 91–180)
| # | Task | Deliverable |
|---|---|---|
| 18 | 10th of Ramadan hub | 600+ suppliers |
| 19 | Coastal cluster logistics | 48hr delivery SLA |
| 20 | Second bank partnership | Live factoring from 2+ partners |
| 21 | API marketplace | External PMS/ERP connectors |
| 22 | Mobile apps | iOS + Android for hotel managers |

---

## 9. Pending Tasks

### 9.1 Critical (This Week)
- [ ] **Fix remaining `#8B0000` crimson references** in nav/footer/layout components
- [ ] **Verify theme toggle renders correctly** in all browsers
- [ ] **CIB pitch presentation** — convert blueprint to slide deck
- [ ] **Oliv API credential unblocking** — check `data/build/blockers.json`

### 9.2 High Priority (Next 2 Weeks)
- [ ] **Rebuild dashboard pages** with orange/lime accent (currently still using crimson in some dashboards)
- [ ] **Fix Prisma schema** — simplify multi-tenant to single-tenant + org hierarchy
- [ ] **Add tests** — no test framework is installed yet
- [ ] **Redis lazy connection** — eliminate build-time ECONNREFUSED warnings
- [ ] **Update DNS** — point `hotelsvendors.com` to Vercel OR keep VPS stable

### 9.3 Medium Priority (Next Month)
- [ ] **Replace deleted admin AI pages** (`ai-insights`, `explorer`, `grok-brain`, `orchestrator`)
- [ ] **Build hotel procurement portal MVP** — catalog browse, PO builder, order tracking
- [ ] **ETA production pipeline** — real-time submission with dead-letter queue
- [ ] **Shared logistics routing engine** — coastal cluster optimization
- [ ] **SEO landing pages** — "hotel procurement Egypt", "hospitality suppliers Egypt"

### 9.4 Blockers
| Blocker | Status | Owner |
|---|---|---|
| Oliv Finance API credentials | 🔴 Blocked | Integration Lead |
| CIB term sheet execution | 🟡 Pending | Business Strategist |
| PostgreSQL migration from SQLite | 🟡 In Progress | Fintech Architect |

---

## 10. File Inventory

### Files That Were Modified/Created in This Session

| File | Status | Notes |
|---|---|---|
| `app/(marketing)/page.tsx` | ✅ Updated | 591 lines, new orange/lime content |
| `components/theme/theme-toggle.tsx` | ✅ Updated | Two-color circular toggle |
| `components/theme/theme-provider.tsx` | ✅ Updated | Accent mode context |
| `components/layout/marketing-nav.tsx` | ✅ Updated | Includes theme toggle |
| `components/layout/marketing-footer.tsx` | ✅ Updated | New footer design |
| `app/globals.css` | ✅ Updated | Design system v3 |
| `public/sw.js` | ✅ Updated | Cache v2 |
| `app/(auth)/login/page.tsx` | ✅ Updated | Orange/lime theme |
| `app/(auth)/register/page.tsx` | ✅ Updated | Orange/lime theme |
| `app/(auth)/forgot-password/page.tsx` | ✅ Updated | Orange/lime theme |
| `app/(auth)/reset-password/page.tsx` | ✅ Updated | Orange/lime theme |
| `components/layout/dashboard-shell.tsx` | ✅ Updated | `#121212` sidebar bg |
| `lib/swarm/model-router.ts` | ✅ Created | Stub for archived modules |
| `lib/swarm/monitoring.ts` | ✅ Created | Stub for archived modules |
| `lib/ai/llm.ts` | ✅ Created | LLM wrapper (Groq → xAI) |
| `docs/BLUEPRINT_STRATEGY_INVO_HV.md` | ✅ Created | Unified business strategy |
| `docs/BANK_PARTNERSHIP_PITCH_CIB.md` | ✅ Existing | 12-slide CIB pitch deck |
| `docs/HANDOFF_DEPLOY.md` | ✅ Created | This document |

### Files Still Using Old Crimson (`#8B0000`)
These need updating to use `var(--accent-base)`:
- `components/layout/pulse-sidebar.tsx` — sidebar active indicator
- Some dashboard pages may still reference crimson directly
- Run: `grep -rn "#8B0000" components/ app/` to find all occurrences

---

*End of handoff document. For questions, see `/AGENTS.md` for system guardrails and `/docs/BLUEPRINT_STRATEGY_INVO_HV.md` for business context.*
