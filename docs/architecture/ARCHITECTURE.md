# Hotels Vendors — Complete Architecture Document
**Version:** 2.0  
**Date:** 2026-06-19  
**Status:** Design Phase  

---

## 1. Platform Overview

HotelsVendors is a **dual-layer B2B procurement and fintech orchestration platform** for the Egyptian hospitality market. It connects hotels, suppliers, shipping companies, and financial institutions through a unified technology layer.

### Core Principle
> HotelsVendors is a **technical data orchestrator**, not a financial institution. It never holds or transfers cash. All financial services are operated by licensed third-party partners.

---

## 2. URL Structure & Route Architecture

```
hotelsvendors.com/                         → Landing page (public, marketing)
hotelsvendors.com/register                 → Registration (role selection)
hotelsvendors.com/sandbox                  → Demo/sandbox (public)
hotelsvendors.com/dashboard                → Hotel procurement dashboard (hotel auth)
hotelsvendors.com/invo                     → Supplier dashboard (supplier auth)
hotelsvendors.com/fintech                  → Funder/factoring dashboard (funder auth)
hotelsvendors.com/compliance               → Admin compliance panel (admin auth)
hotelsvendors.com/portal                   → Shared portal (any authenticated user)
hotelsvendors.com/api/v1/*                 → REST API
hotelsvendors.com/api/v1/webhooks/*        → Webhook endpoints (ETA, carriers, gateways)
```

### Next.js Route Groups
```
app/
  (marketing)/          → Public pages (landing, about, pricing, sandbox, register)
  (auth)/               → Login, register, forgot-password, verify-email
  (dashboard)/          → Hotel procurement dashboard
  (invo)/               → Supplier dashboard
  (fintech)/            → Funder/factoring dashboard
  (compliance)/         → Admin compliance panel
  (portal)/             → Shared portal (profile, settings, notifications)
  api/
    v1/
      hotels/           → Hotel API routes
      suppliers/        → Supplier API routes
      funders/          → Funder API routes
      compliance/       → Compliance engine routes
      webhooks/         → ETA webhooks, carrier webhooks, gateway webhooks
      integrations/     → ERP/PMS connector routes
      sandbox/          → Sandbox/demo routes
```

---

## 3. Three-Layer Architecture

### Layer 1: INVO (Invoice Aggregation & Supplier SaaS)
- **Subdomain:** `invo.hotelsvendors.com` or `/invo`
- **Users:** Suppliers
- **Function:** Product catalog management, order fulfillment, invoice submission, document processing
- **Revenue:** SaaS subscription fees from suppliers
- **Data isolation:** Suppliers see ONLY their own data. No hotel identities exposed.

### Layer 2: Compliance Engine
- **Subdomain:** `compliance.hotelsvendors.com` or `/compliance`
- **Users:** Platform admins, auditors
- **Function:** ETA invoice validation, cryptographic signing, three-way matching, FRA anti-fraud checks
- **Output:** Cryptographically signed validation certificates
- **Key property:** Validation results are tamper-proof. Even platform admins cannot override.

### Layer 3: Fintech Router
- **Subdomain:** `fintech.hotelsvendors.com` or `/fintech`
- **Users:** Factoring companies, banks, financial institutions
- **Function:** Receive validated invoice pools, bid on invoices, manage credit facilities
- **Key property:** Funders do their OWN due diligence on hotels. Platform does not guarantee payments.

---

## 4. User Roles & Registration Flows

### User Types

| Role | Dashboard | What They See | Approval |
|------|-----------|---------------|----------|
| Hotel Buyer | `/dashboard` | Marketplace, PO management, budgets, deliveries | Self-service or admin |
| Supplier | `/invo` | Products, orders, invoices, payments | Admin approval |
| Factoring Company | `/fintech` | Invoice pools, credit profiles, bidding | Admin approval |
| Shipping Company | `/portal` (carrier view) | Delivery jobs, routes, POD submission | Admin approval |
| Platform Admin | `/compliance` | Full platform oversight | Super-admin only |

### Registration Flow

```
1. User visits /register
2. Selects role: Hotel / Supplier / Factoring / Shipping
3. Fills organization details
4. For Hotels: I-Score check → Credit facility pre-approval → Account activated
5. For Suppliers: Document upload → AI catalog classification → Admin review → Account activated
6. For Funders: License verification → Admin approval → Account activated
7. For Carriers: Fleet verification → Insurance check → Admin approval → Account activated
```

---

## 5. Procurement Workflows

### 5A. Direct Catalog Ordering
For routine purchases with pre-negotiated prices.
```
Hotel browses marketplace → Adds to cart → Checkout → PO generated
→ Supplier notified → Supplier confirms → Ships → Delivers → OTP → Invoice → Payment
```

### 5B. RFQ / Bidding
For large or price-sensitive orders.
```
Hotel creates RFQ → System matches suppliers → RFQ broadcast
→ Suppliers bid (price, qty, delivery time, shipping)
→ System compares bids → Hotel selects supplier(s) → PO generated
→ [Same fulfillment flow as direct order]
```

### 5C. AI-Generated PO
For demand-driven procurement.
```
AI forecasts demand (14 days ahead) → Suggests PO → Buyer reviews
→ Authority matrix approval → RFQ or direct order → [Fulfillment flow]
```

---

## 6. Payment Scenarios

| Scenario | Who Initiates | Who Pays | Who Receives | When |
|----------|--------------|----------|-------------|------|
| 1. Reverse Factoring | Hotel | Funder → Supplier | Supplier | Day 2 |
| 2. Normal Payment (Net-60) | Hotel | Hotel → Supplier | Supplier | Day 60 |
| 3. Supplier Sells Invoice | Supplier | Funder → Supplier | Supplier | Day 7 |
| 4. Pre-Funded Escrow | Hotel (pre-funds) | Escrow → Supplier | Supplier | Day 0 |
| 5. Partial Factoring | Mixed | Mixed | Mixed | Mixed |

### Money Flow (Platform Never Holds Funds)
```
Funder ↔ Supplier: Direct bank transfer (funder pays supplier)
Hotel ↔ Funder: Direct bank transfer (hotel pays funder at net-60)
Hotel ↔ Carrier: Direct payment (hotel pays carrier for shipping)
Platform: Collects orchestration fees, SaaS fees, gateway fees ONLY
```

---

## 7. Shipping & Logistics

### Shark-Breaker Hub Model
```
Suppliers → Hub (Cairo/Hurghada/Sharm) → Consolidated Truck → Hotels

Hub Locations:
- Cairo Hub: Main consolidation (suppliers from Cairo/Delta)
- Hurghada Hub: Red Sea distribution
- Sharm Hub: Southern Red Sea distribution
```

### Carrier Model (Marketplace, Not Fleet)
```
Carriers register on platform → Get assigned delivery jobs
→ Bid on routes → Fulfill deliveries → Submit POD → Get paid

Carrier Payment: Hotel pays carrier (via platform escrow)
Platform Commission: 5-10% of shipping fee
```

### Cold Chain Requirements
```
Frozen (-18°C): Meat, seafood, ice cream
Chilled (2-8°C): Dairy, fresh produce, beverages
Ambient (15-25°C): Dry goods, canned, linens

All reefer trucks must have IoT temperature sensors
Real-time monitoring → Alert on deviation
```

---

## 8. Compliance & Legal

### ETA Integration
```
Invoice generated → Submitted to ETA API → UUID generated
→ Cryptographic signature (RSA 2048-bit) → Stored on platform
→ Three-way match: PO + GRN + Invoice → Validated
```

### FRA Compliance
```
Anti-fraud checks: Duplicate detection, price anomaly, phantom supplier
Three-way matching: PO quantity = GRN quantity = Invoice quantity
SHA-256 audit trail on every transaction
```

### Liability Disclaimer
> "Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults."

This holds because:
- Platform never holds money
- Funders do independent credit assessment
- Compliance engine output is cryptographically signed (tamper-proof)
- All financial services operated by licensed third parties

---

## 9. Fintech Enhancements

1. **Smart Credit Scoring:** Dynamic scoring based on I-Score, payment history, seasonality
2. **Dynamic Discounting:** "Pay in 10 days, save 2%" — auto-calculated
3. **Cash Flow Forecasting:** Predicts upcoming payment obligations
4. **Supplier Health Score:** A/B/C/D rating based on fulfillment, returns, quality
5. **Multi-Bank Payment Routing:** Auto-selects best bank for each payment
6. **Virtual Settlement Accounts:** Auto-reconcile payment → invoice → PO
7. **Fraud Detection:** Duplicate invoices, price anomalies, unusual patterns

---

## 10. Integration Layer

### Hotel System Connectors
```
Oracle Opera Cloud → REST API / Webhook → HotelsVendors
Generic ERP (SAP, Sun) → API / SFTP → HotelsVendors
Manual (Excel/CSV) → AI-powered column mapping → HotelsVendors
```

### Supplier System Connectors
```
API Integration → Supplier pushes catalog via REST API
MCP Server → Supplier installs MCP, system auto-imports
CSV Upload → AI classifies products, supplier reviews
Manual Entry → Supplier enters products manually
```

### Payment Gateway Integration
```
Paymob → Payment processing, payouts
Fawry → Bill payment, instapay
Tap Payments → Card processing
Bank APIs (CIB, QNB, Banque Misr) → Direct transfers
```

---

## 11. Database Schema

### Existing Models (36 models, keep as-is)
See `prisma/schema.prisma` — well-structured foundation.

### New Models to Add (see schema-extensions.prisma)
1. `RfqRequest` — RFQ creation
2. `RfqResponse` — Supplier bids
3. `Bid` — Individual bid line items
4. `OtpDelivery` — OTP generation and verification
5. `ReturnRequest` — Return initiation
6. `CreditNote` — Credit note for returns
7. `Notification` — In-app/email/SMS notifications
8. `Carrier` — Shipping company profiles
9. `CarrierRate` — Rate cards per route
10. `DeliveryJob` — Assigned delivery job
11. `Integration` — ERP/PMS connector config
12. `ConnectorLog` — Sync logs
13. `SupplierAutoAcceptRule` — Auto-accept configuration
14. `ApiKey` — API key management
15. `WebhookEndpoint` — Webhook subscriptions
16. `FraudRule` — Fraud detection rules
17. `FraudAlert` — Fraud alerts
18. `VirtualAccount` — Virtual settlement accounts
19. `DynamicDiscountOffer` — Dynamic discounting offers
20. `CashFlowForecast` — Cash flow predictions

### Models to Refactor
1. `Order` — Add RFQ fields, OTP reference, split order support
2. `Invoice` — Add credit note reference, dynamic discount fields
3. `Payment` — Add gateway reference, virtual account reference
4. `Product` — Add barcode, AI classification fields
5. `Supplier` — Add auto-accept settings, reliability score
6. `User` — Add notification preferences
7. `Hotel` — Add integration config reference

---

## 12. Revenue Model

| Source | From | Amount | Frequency |
|--------|------|--------|-----------|
| Orchestration Fee | Funder | 0.3-0.5% of invoice | Per transaction |
| Hotel SaaS | Hotel | EGP 2,000-10,000/month | Monthly |
| Supplier SaaS | Supplier | EGP 500-3,000/month | Monthly |
| Fintech SaaS | Funder | EGP 5,000-15,000/month | Monthly |
| Shipping Commission | Carrier | 5-10% of shipping fee | Per delivery |
| Document Processing | Supplier | EGP 5-15 per document | Per document |
| Payment Gateway | Transaction | 0.5-1% | Per transaction |

---

## 13. Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- Schema extensions (new models + refactors)
- Bidding/RFQ system
- OTP delivery confirmation
- Notification system
- Supplier auto-accept rules

### Phase 2: Fulfillment (Weeks 5-8)
- Return/credit note workflow
- Carrier management
- Payment gateway integration
- API key management

### Phase 3: Intelligence (Weeks 9-12)
- ERP/PMS integration layer
- Fraud detection
- Dynamic credit scoring
- Cash flow forecasting

### Phase 4: Scale (Weeks 13-16)
- Developer portal
- Webhook system
- Virtual accounts
- Advanced analytics
