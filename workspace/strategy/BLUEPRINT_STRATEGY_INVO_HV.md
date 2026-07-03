# INVO × Hotels Vendors — Unified Blueprint Strategy

> **Version:** 1.0  
> **Date:** June 2026  
> **Classification:** Strategic — COO & Board Use Only  
> **Status:** DRAFT for CIB / Oliv Presentation

---

## Executive Summary

This blueprint defines the unified operating model for **INVO** (horizontal B2B infrastructure) and **Hotels Vendors** (vertical hospitality procurement). The two entities are not competitors — they are **complementary layers of the same Egyptian B2B stack**.

| Layer | Entity | Role | Revenue Model |
|---|---|---|---|
| **Infrastructure** | INVO | Supplier aggregation, logistics APIs, payment rails, warehouse network | SaaS fees per transaction, logistics markup |
| **Vertical Brand** | Hotels Vendors | Hospitality-native UX, ETA compliance, Authority Matrix governance, factoring marketplace | Transaction fees (1.5–2.5%), supplier subscriptions, sponsored listings, data insights |
| **Capital Layer** | CIB / Oliv / Other Banks | Embedded financing, factoring liquidity, working capital lines | Interest spread, factoring discount, arrangement fees |

**Thesis:** INVO proved Egyptian banks will partner with fintech. HV proves vertical depth commands higher fees, better data, and stickier relationships. Together, they form the only **ETA-native, bank-integrated, hospitality-vertical B2B platform** in Egypt.

---

## 1. The Four-Sided Marketplace Architecture

### 1.1 Actor Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         HOTELS VENDORS (Vertical Brand)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   HOTELS    │  │  SUPPLIERS  │  │  LOGISTICS  │  │  FACTORING  │   │
│  │   (Buyers)  │  │  (Sellers)  │  │  (Delivery) │  │  (Capital)  │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
│         │                │                │                │           │
│         └────────────────┴────────────────┴────────────────┘           │
│                              │                                         │
│                    ┌─────────┴─────────┐                               │
│                    │  Authority Matrix   │  ← Non-replicable moat      │
│                    │  ETA E-Invoicing    │  ← Compliance backbone      │
│                    │  AI Forecasting     │  ← Demand intelligence      │
│                    └─────────┬─────────┘                               │
│                              │                                         │
└──────────────────────────────┼─────────────────────────────────────────┘
                               │
┌──────────────────────────────┼─────────────────────────────────────────┐
│                         INVO (Infrastructure Layer)                     │
│  ┌───────────────────────────┴─────────────────────────────────────┐   │
│  │  Supplier Feed API  │  Logistics Network  │  Payment Rails      │   │
│  │  • 6th of Oct hub   │  • Shared routes    │  • InstaPay IPN     │   │
│  │  • 10th of Ramadan  │  • Coastal clusters │  • Fawry            │   │
│  │  • Master registry  │  • Last-mile pool   │  • Paymob           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  WAREHOUSE NETWORK  │  INVENTORY SYNC  │  DEMAND SIGNALS        │   │
│  │  • Consolidation    │  • REST + Webhook│  • POS integration     │   │
│  │  • Cross-docking    │  • Real-time qty │  • Occupancy feeds     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │    CAPITAL LAYER     │
                    │  CIB / Oliv / Others │
                    │  • Factoring lines   │
                    │  • Credit scoring    │
                    │  • Treasury APIs     │
                    └──────────────────────┘
```

### 1.2 Value Flow

| Direction | Value | Mechanism |
|---|---|---|
| **INVO → HV** | Supplier catalog, logistics capacity, payment settlement | REST APIs + Webhooks |
| **HV → INVO** | High-value hospitality orders, demand signals, coastal routing data | Order stream + forecast exports |
| **CIB → HV** | Factoring liquidity, credit lines, escrow | Embedded finance APIs |
| **HV → CIB** | Transaction history, hotel credit profiles, supplier performance data | Real-time data pipeline |
| **Hotels → Suppliers** | Purchase orders, ETA-compliant invoices | HV platform |
| **Suppliers → Hotels** | F&B, housekeeping, engineering, amenities, capital equipment | INVO fulfillment network |

---

## 2. Business Model — Revenue Streams

### 2.1 Hotels Vendors Revenue

| Stream | Rate | Trigger | Annual Potential (at scale) |
|---|---|---|---|
| **Transaction Fee** | 1.5–2.5% of GMV | Order confirmed & paid | EGP 100M+ at EGP 4B GMV |
| **Supplier Subscription** | EGP 2,500–15,000/mo | Supplier tier (Bronze/Silver/Gold) | EGP 18M at 1,000 suppliers |
| **Sponsored Listings** | CPC / CPM / fixed placement | Supplier pays for visibility | EGP 5M |
| **Logistics Markup** | 5–12% on delivery cost | Shared-route fulfillment | EGP 12M |
| **Factoring Spread** | 1.5–3% discount | Factoring company pays HV | EGP 8M |
| **ETA Compliance SaaS** | Per-invoice fee | Hotels without internal ETA system | EGP 3M |
| **Data Insights** | Monthly report subscription | Hotel groups, suppliers, banks | EGP 4M |

### 2.2 INVO Revenue

| Stream | Rate | Trigger |
|---|---|---|
| **SaaS Fee** | 0.3–0.5% of transaction value | Every order processed through INVO rails |
| **Logistics Fee** | Per-km + per-kg | Delivery execution |
| **Payment Processing** | 1.5–2.0% | InstaPay/Fawry settlement |
| **Warehouse Storage** | Per-pallet per day | Consolidation hub usage |
| **API Access** | Tiered monthly fee | External platforms using INVO feed |

### 2.3 Combined Unit Economics

**Per Order Example: EGP 50,000 hotel F&B order**

| Party | Revenue | Mechanism |
|---|---|---|
| Hotels Vendors | EGP 1,000–1,250 | 2.0–2.5% transaction fee |
| INVO | EGP 150–250 | 0.3–0.5% SaaS + logistics markup |
| Factoring Partner | EGP 750–1,500 | 1.5–3% discount (supplier paid in 24h) |
| **Total Platform Take** | **EGP 1,900–3,000** | **3.8–6.0% of order value** |

---

## 3. Organizational Structure

### 3.1 Unified Entity Map

```
┌────────────────────────────────────────────────────────────┐
│                 HOLDING / STRATEGIC ALLIANCE               │
│                  (Shared board seat: CIB)                  │
└────────────────────────────────────────────────────────────┘
         │                              │
    ┌────┴────┐                    ┌────┴────┐
    │  INVO   │                    │   HV    │
    │ (Infra) │                    │(Vertical)│
    └────┬────┘                    └────┬────┘
         │                              │
    ┌────┴────┐                    ┌────┴────┐
    │Product  │                    │Product  │
    │• API    │                    │• Portal │
    │• Logistics│                  │• AI Asst│
    │• Payments│                   │• Compliance│
    └────┬────┘                    └────┬────┘
    ┌────┴────┐                    ┌────┴────┐
    │Operations│                   │Operations│
    │• Warehouse│                  │• Supplier Onboarding│
    │• Fleet   │                    │• Hotel Success│
    │• Support │                   │• ETA Submissions│
    └────┬────┘                    └────┴────┘
         │                              │
    ┌────┴──────────────────────────────┴────┐
    │         SHARED FUNCTIONS               │
    │  • Engineering (platform + mobile)     │
    │  • Data Science (forecasting, pricing) │
    │  • Finance (factoring operations)      │
    │  • Legal (ETA, bank partnerships)      │
    └────────────────────────────────────────┘
```

### 3.2 Key Roles (Phase 1 — First 12 Months)

| Role | Entity | Responsibility |
|---|---|---|
| **CEO — Hotels Vendors** | HV | Vertical strategy, hotel relationships, investor relations |
| **CEO — INVO** | INVO | Infrastructure scale, logistics network, supplier aggregation |
| **CTO — Platform** | Shared | Next.js architecture, AI/ML pipeline, security, ETA bridge |
| **COO — Operations** | Shared | Warehouse network, delivery SLAs, customer success |
| **Chief Fintech Officer** | HV | Bank partnerships (CIB, Oliv), factoring marketplace, credit scoring |
| **Head of ETA Compliance** | HV | Egyptian Tax Authority integration, audit readiness, legal |
| **Head of Supplier Growth** | INVO | 6th of October → 10th of Ramadan → Coastal sequencing |
| **Head of Hotel Sales** | HV | Pilot hotel group acquisition, GMV growth, retention |

### 3.3 Governance — Authority Matrix (The Moat)

The Authority Matrix is **not software**. It is 18 months of relationship-building with Egyptian family business owners to understand why their procurement approval rules exist. The Matrix encodes:

- **Order value thresholds** by hotel tier (3-star vs 5-star vs resort)
- **Role hierarchies** (Procurement Manager → GM → Regional Director → Family Patriarch)
- **Supplier tiers** (approved vs probationary vs blacklisted)
- **Seasonal exceptions** (Ramadan, New Year, summer coastal surge)
- **Emergency overrides** (dual-signature required, 20+ character reason, escalated alert)

**This is why MaxAB cannot compete.** They have horizontal volume but zero vertical governance. A hotel GM in Sharm El-Sheikh will not trust a platform that doesn't understand why his uncle must approve EGP 100K+ orders in person.

---

## 4. Operational Strategy — 90-Day Execution

### 4.1 Phase 1: Foundation (Days 1–30)

| Week | INVO Action | HV Action | Joint Milestone |
|---|---|---|---|
| 1 | Lock 6th of October warehouse lease | Close CIB term sheet draft | Signed LOI with CIB |
| 2 | Onboard 50 pilot suppliers to API | Deploy ETA sandbox integration | First test invoice submitted to ETA |
| 3 | Integrate InstaPay IPN for sub-10s settlement | Build Authority Matrix v1 engine | First PO with dual-authorization |
| 4 | Launch shared-route pilot (Cairo → Alexandria) | Sign 3 pilot hotel groups (5+ properties each) | EGP 500K pilot GMV target |

### 4.2 Phase 2: Pilot (Days 31–60)

| Week | INVO Action | HV Action | Joint Milestone |
|---|---|---|---|
| 5 | Open 10th of Ramadan hub | Launch Supplier Central v1 (inventory, orders, payments) | 200 suppliers active |
| 6 | Deploy coastal cluster routing (Hurghada, Sharm, Marsa Alam) | Activate AI demand forecasting for F&B | 15% forecast accuracy on pilot hotels |
| 7 | Integrate Oliv Finance API (credit scoring) | Launch non-recourse factoring with CIB | First factored invoice (supplier paid in <24h) |
| 8 | Roll out shared logistics to all pilot hotels | Deploy TCP (Total Cost of Procurement) reports | 20% cost reduction documented vs. baseline |

### 4.3 Phase 3: Compliance & Scale (Days 61–90)

| Week | INVO Action | HV Action | Joint Milestone |
|---|---|---|---|
| 9 | Achieve 48hr coastal delivery SLA | ETA production pipeline with dead-letter queue | 100% ETA compliance on all invoices |
| 10 | Expand warehouse to Alexandria | Authority Matrix enforced on ALL order mutations | Zero unauthorized EGP 50K+ orders |
| 11 | Launch API marketplace (external PMS/ERP connectors) | Close second bank partnership (Oliv or competitor) | Two live factoring partners |
| 12 | 1,000+ suppliers in master registry | 150+ properties on platform | **Break-even: EGP 750K monthly GMV × 150 properties** |

---

## 5. Technology Architecture

### 5.1 Stack Alignment

| Layer | INVO | HV | Integration |
|---|---|---|---|
| **Frontend** | React admin dashboard | Next.js 16 + App Router | Shared component library |
| **Backend** | Node.js microservices | Next.js API routes + server actions | REST + Webhook APIs |
| **Database** | PostgreSQL (supplier catalog, logistics) | PostgreSQL (orders, invoices, audit) | Cross-read replicas |
| **Cache** | Redis (inventory sync) | Redis (sessions, hot cache) | Shared Redis cluster |
| **Queue** | BullMQ (delivery routing) | BullMQ (ETA submissions, factoring) | Shared Redis-backed queues |
| **AI/ML** | Demand signal aggregation | Forecasting engine, pricing optimization | Shared model training pipeline |
| **Payments** | InstaPay, Fawry, Paymob | Embedded via INVO rails + factoring overlay | Unified ledger |

### 5.2 Data Flow — Order Lifecycle

```
1. HOTEL creates PO via HV portal
        ↓
2. Authority Matrix evaluates approval chain
        ↓
3. APPROVED → Order published to INVO supplier feed
        ↓
4. SUPPLIER confirms availability + delivery slot
        ↓
5. INVO logistics assigns shared-route vehicle
        ↓
6. DELIVERY executed → Proof of delivery uploaded
        ↓
7. INVOICE auto-generated → ETA UUID assigned
        ↓
8. ETA submission to Egyptian Tax Authority
        ↓
9. INVO payment rails settle supplier (minus factoring discount if applicable)
        ↓
10. HV fee deducted → Remainder to supplier
        ↓
11. AUDIT LOG immutable entry (beforeState + afterState snapshots)
```

### 5.3 API Contract (INVO ↔ HV)

```typescript
// INVO exposes to HV
interface INVOSupplierFeed {
  supplierId: string;
  sku: string;
  name: string;
  category: "F&B" | "HSK" | "ENG" | "AMN" | "CAP";
  price: number;
  currency: "EGP";
  availableQty: number;
  warehouseLocation: string;
  minOrderValue: number;
  leadTimeHours: number;
  updatedAt: string;
}

interface INVOLogisticsQuote {
  routeId: string;
  origin: string;
  destination: string;
  estimatedHours: number;
  cost: number;
  vehicleType: "van" | "truck" | "refrigerated";
  sharedRoute: boolean;
}

interface INVOPaymentStatus {
  transactionId: string;
  invoiceId: string;
  amount: number;
  status: "PENDING" | "SETTLED" | "FAILED";
  settlementMethod: "INSTAPAY" | "FAWRY" | "PAYMOB";
  settledAt?: string;
}

// HV exposes to INVO
interface HVOrder {
  orderId: string;
  hotelId: string;
  tenantId: string;
  items: Array<{ sku: string; qty: number; maxPrice: number }>;
  deliveryWindow: { start: string; end: string };
  authorityMatrixSnapshot: object;
  paymentGuaranteed: boolean;
  etaStatus: "PENDING" | "SUBMITTED" | "ACCEPTED";
}
```

---

## 6. Bank Partnership Model

### 6.1 CIB Partnership Structure

**What CIB gets:**
- Exclusive factoring partnership for hospitality vertical (12-month term)
- Real-time transaction data on 150+ hotel properties
- Embedded credit scoring via Oliv Finance API
- First right of refusal on hotel working capital lines

**What HV/INVO gets:**
- Factoring liquidity at 12–15% discount rate (vs. market 18–22%)
- CIB brand credibility for hotel sales
- Co-branded marketing ("CIB-powered supply chain finance")
- Treasury API access for real-time settlement

**Revenue split:**
- Factoring discount: 70% CIB, 20% HV, 10% INVO
- Working capital lines: 80% CIB, 15% HV, 5% INVO
- Data insights sold to CIB risk team: 50/50 HV/INVO

### 6.2 Oliv Finance Integration

| Feature | Oliv API | HV Implementation |
|---|---|---|
| Credit scoring | `/credit-score` | Supplier onboarding gate |
| Dynamic limits | `/credit-limit` | Per-hotel, per-supplier lines |
| Real-time settlement | `/settle` | InstaPay IPN trigger |
| Risk monitoring | `/risk-alerts` | Dashboard + push notifications |

**Blocker resolution:** Oliv API credentials are pending. Once unblocked, integration is 3–5 days (REST API, Zod validation, webhook receiver already scaffolded).

---

## 7. Competitive Positioning

### 7.1 Why We Win

| Competitor | Their Strength | Their Weakness | Our Counter |
|---|---|---|---|
| **MaxAB-Wasoko** | 450K+ merchants, $251M revenue, horizontal FMCG | Zero hospitality vertical, no ETA integration, no governance | Vertical depth, compliance native, Authority Matrix |
| **FutureLog** | Strong hospitality P2P globally | Zero Egyptian presence, no local supplier network, no ETA | Local network, ETA-native, coastal logistics |
| **Cartona** | Supplier aggregation, last-mile | Generic B2B, no hotel-specific SKUs, no financing | SKU taxonomy, embedded factoring, demand forecasting |
| **INVIA** | CIB partnership, AI financial OS | Horizontal SME focus, no logistics, no hospitality data | Vertical hospitality, logistics integration, hotel governance |

### 7.2 The "Amazon of Egyptian Hospitality" Framework

| Amazon Layer | HV/INVO Equivalent | Status |
|---|---|---|
| **Buyers (Amazon customers)** | Hotels — procurement portal | MVP live |
| **Sellers (Amazon merchants)** | Suppliers — Supplier Central | MVP live |
| **Fulfilment (FBA)** | INVO shared logistics | Pilot week 4 |
| **Payments (Amazon Pay)** | Embedded InstaPay + factoring | CIB term sheet pending |
| **Prime (loyalty)** | Hotel group subscriptions | Q3 roadmap |
| **AWS (infrastructure)** | INVO API marketplace | Q4 roadmap |
| **Alexa (AI assistant)** | HV Smart Assistant (role-specific) | Live — hotel/supplier/factoring prompts |

---

## 8. Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| CIB partnership delays | Medium | High | Parallel discussions with 2 other banks; Oliv as fallback |
| ETA API changes/breakage | Low | Critical | Sandbox testing; dead-letter queue; manual resolution path |
| Supplier onboarding slower than target | Medium | High | Start with 6th of October (1,853 factories); offer free onboarding + first 3 months zero commission |
| Hotel adoption resistance | Medium | High | Lead with "Storage-to-Revenue" model ($780K/year savings for 15-property chain); free pilot |
| INVO-HV integration friction | Low | Medium | Shared engineering team; weekly integration standup; shared Redis + PostgreSQL |
| Regulatory change (ETA enforcement) | Low | High | Legal advisory retainer; flexible schema; real-time compliance monitoring |
| Competitor response (MaxAB vertical pivot) | Low | Medium | Speed to market; 90-day execution; relationship moat (Authority Matrix) |

---

## 9. Metrics & Dashboard

### 9.1 North Star Metrics

| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|---|---|---|---|
| Monthly GMV | EGP 10M | EGP 50M | EGP 200M |
| Active Hotels | 20 | 75 | 250 |
| Active Suppliers | 200 | 600 | 1,200 |
| ETA Compliance Rate | 100% | 100% | 100% |
| Avg. Delivery Time | 48hr (coastal) | 36hr | 24hr |
| Factoring Penetration | 30% of invoices | 50% | 70% |
| Platform Net Margin | 15% | 22% | 28% |
| Customer NPS | N/A | 40+ | 50+ |

### 9.2 Weekly Review Cadence

- **Monday 09:00** — Engineering sync (shared team)
- **Monday 14:00** — Hotel sales pipeline review
- **Wednesday 10:00** — Supplier onboarding standup
- **Thursday 11:00** — CIB/Oliv partnership update
- **Friday 16:00** — COO strategic review (metrics, blockers, 90-day plan)

---

## 10. Appendices

### A. Document References
- `/docs/BANK_PARTNERSHIP_PITCH_CIB.md` — 12-slide CIB pitch deck
- `/docs/ARCHITECTURE_OVERHAUL_PLAN.md` — Multi-tenant schema migration
- `/docs/authority-matrix-spec.md` — Authority Matrix engine specification
- `/docs/fintech-engine-spec.md` — Fee calculator, credit gate, ledger
- `/docs/eta-integration.md` — ETA bridge specification (Integration Lead owned)
- `/AGENTS.md` — Development conventions, system guardrails

### B. Decision Log

| Date | Decision | Owner | Status |
|---|---|---|---|
| 2026-05-01 | Vertical hospitality focus vs. horizontal B2B | COO / Business Strategist | Approved |
| 2026-05-01 | 6th of October → 10th of Ramadan → Coastal sequencing | COO / Data Harvester | Approved |
| 2026-05-01 | Transaction fee tier structure (2.5% → 1.5%) | COO / Fintech Architect | Approved |
| 2026-06-03 | INVO-HV unified blueprint (this document) | COO / Business Strategist | Draft for Board |
| TBD | CIB partnership term sheet execution | COO / Chief Fintech Officer | Pending |
| TBD | Oliv Finance API credential unblocking | Integration Lead | Blocked |

### C. Glossary

| Term | Definition |
|---|---|
| **Authority Matrix** | Multi-level approval engine for purchase orders based on value thresholds, hotel hierarchy, and supplier tiers |
| **ETA** | Egyptian Tax Authority e-invoicing system — mandatory for all B2B invoices since 2022 |
| **Factoring** | Non-recourse purchase of receivables — supplier gets paid immediately, factoring partner takes credit risk |
| **GMV** | Gross Merchandise Value — total value of orders processed through the platform |
| **Shark-Breaker** | Model enabling SME suppliers to compete with large distributors via shared logistics and faster delivery |
| **Storage-to-Revenue** | Sales narrative: daily ordering via shared logistics frees 60% of hotel storage space, creating "found money" |
| **TCP** | Total Cost of Procurement — comprehensive cost report countering the "cheaper offline" objection |

---

*This document is a living strategy. Updates require COO sign-off and Audit review per System Guardrail G11.*
