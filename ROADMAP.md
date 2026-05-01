# Hotels Vendors — Platform Architecture & Gap Analysis

## What Exists Now (MVP Skeleton)

### Backend ✅
- 29 API endpoints (hotels, suppliers, products, orders, invoices, users, authority, ETA, analytics, intelligence)
- Prisma schema with 15+ models
- SQLite database with seed data
- Auto-posting accounting journal entries
- Role-based module filtering (Hotel / Supplier / Factoring / Shipping / Admin)

### Frontend ✅
- Landing page (marketplace hero with live product grid)
- App shell (sidebar, header, role switcher)
- Dashboard, Catalog, Supplier Central, Orders, Invoices, Accounting, AI Inventory, Hotels, Intelligence
- Knight logo applied (transparent PNG)
- 5 product categories: F&B, Consumables, Guest Supplies, FF&E, Services

## What Is Missing (The "Platform Magic")

### P0 — Critical for MVP Launch
| Feature | Why It Matters | Status |
|---------|---------------|--------|
| **Authentication (JWT/Session)** | Hotels and suppliers cannot use the platform without login | ❌ Not started |
| **Shopping Cart / Bulk Order Builder** | B2B is about bulk orders, not single clicks | ❌ Not started |
| **Product Detail Page** | Full specs, volume pricing, MOQ, lead time, certifications | ❌ Not started |
| **RFQ (Request for Quote)** | Core B2B marketplace feature — buyers request custom pricing | ❌ Not started |
| **Supplier Onboarding Flow** | Registration → Verification → Catalog Upload → Go Live | ❌ Not started |
| **Hotel Onboarding Flow** | Registration → Property Setup → Credit Approval | ❌ Not started |
| **File Upload (Docs, Certs, Invoices)** | ETA compliance requires document attachments | ❌ Not started |
| **Real-time Notifications** | Order status changes, approval requests, delivery updates | ❌ Not started |

### P1 — Required for Competitive Parity
| Feature | Why It Matters | Status |
|---------|---------------|--------|
| **Search Engine (not client-side filter)** | Elasticsearch/Meilisearch for 10K+ products | ❌ Not started |
| **Analytics Dashboard with Charts** | Recharts visualizations for spend, trends, forecasts | ❌ Not started |
| **Mobile Responsive Tables** | Current tables break below 1024px | ❌ Not started |
| **Payment / Factoring Workflow** | Embedded credit, invoice factoring, Net-30 terms | ❌ Not started |
| **Multi-Property Support** | Hotel chains need separate orders per property | ❌ Partial (schema has Property model) |
| **Review / Rating System** | Hotels rate suppliers, products | ❌ Not started |

### P2 — Differentiators (The "Smart" Layer)
| Feature | Why It Matters | Status |
|---------|---------------|--------|
| **Smart Deals (real price comparison)** | Currently simulated — needs actual cross-supplier price engine | ❌ Simulated only |
| **AI Purchasing Officer** | Currently simulated — needs rules engine + ML | ❌ Simulated only |
| **Demand Forecasting** | Currently simulated — needs time-series model | ❌ Simulated only |
| **ERP Integration APIs** | SAP, Oracle, QuickBooks sync | ❌ Not started |

## Recommended Path Forward

### Option A: Stop at Functional Skeleton
Use what exists now to pitch/demo to investors. The backend API and database are solid. The frontend proves the concept. Move to hiring a dedicated frontend team.

### Option B: Complete P0 (4-6 sessions)
Build auth, cart, product detail, RFQ, onboarding flows, file upload, notifications. This makes it a usable platform.

### Option C: Full Competitive Platform (10+ sessions)
Everything above plus search engine, analytics, payments, mobile, reviews. This competes with Amazon Business / Faire.

---
*Generated: 2026-05-01*
