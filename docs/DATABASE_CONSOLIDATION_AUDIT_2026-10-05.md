# Database & Module Consolidation Audit — 2026-10-05

## Decision status

This is an **audit decision record**, not permission to delete production data.

### Working decisions

| Area | Direction | Reason |
|---|---|---|
| Live application | Production baseline | Preserve the working system while rebuilding |
| Application repository | `Moataz301179/hotels-vendors` | It contains the production application plus the Prisma transaction graph |
| Primary application data model | Prisma/PostgreSQL | 122 Prisma models already cover the core transaction, procurement, invoice, payment, factoring, logistics and intelligence domains |
| Neon | Primary DB candidate | Existing project migration plan explicitly targets Neon; Prisma is already designed around `DATABASE_URL` |
| Supabase | Legacy data/service layer to consolidate | Current INVO screens/API still read/write Supabase tables/views, but the repository has no `supabase/` migration directory and Prisma already contains overlapping business models |
| Hostinger/VPS PostgreSQL | Deployment legacy / fallback only | Old deployment docs/scripts reference local PostgreSQL and caused the current `localhost:5432` production deployment failure |
| Other application repositories | Audit sources only | Do not deploy them wholesale or use them to overwrite production |

## Evidence from the current repository

The Prisma schema contains 122 models, including:

- Tenant, Hotel, Property, Supplier
- Product, Order, OrderItem, OrderApproval
- Invoice, Payment, PaymentTransaction
- FactoringCompany, FactoringRequest, FactoringTransaction
- LogisticsHub, Trip, TripStop, Shipment, CarrierProfile
- GoodsReceiptNote and GRN line items
- RFQ/RFQ response models
- EvidenceRecord, IntelligenceEdge, NeedFinding, OpportunityPackage
- SavingsLedger, NetworkInsight and other intelligence models

This is enough to make the Prisma transaction graph the architectural center rather than adding another parallel business database.

## Supabase dependency that must be migrated

Current application code still uses Supabase for:

- `v_procurement_status`
- `v_invoice_pipeline`
- `v_risk_dashboard`
- `factoring_requests`
- `agent_audit_log`
- `alerts`

The repository's generated Supabase type contract also contains many overlapping entities including users, hotels, suppliers, orders, invoices, factoring requests, factoring bids, GRN records, procurement transitions, compliance checks and notifications.

Therefore:

**Do not delete Supabase yet.**

Instead, map each Supabase table/view/function to its Prisma equivalent or to a deliberately retained integration. Migrate unique data before retiring the dependency.

## What gets removed

The following are **not** being deleted yet:

- Neon
- Supabase
- VPS PostgreSQL
- secondary repositories
- legacy modules

They move into an evidence-based retirement queue.

A component is removed only after:

1. no production route depends on it;
2. no API/job depends on it;
3. its data has been migrated or proven disposable;
4. replacement behavior passes tests;
5. production smoke tests pass.

## Target business spine

The platform should converge on:

Hotel → Requirement → Product/SKU → Supplier → Quote → Deal → PO → Logistics → Delivery/GRN → Invoice → Payment → Outcome

The aggregation layer sits on top of this graph and turns repeated hotel demand into:

Requirement → normalized demand → volume opportunity → supplier deal → executable procurement

Financing remains downstream of verified transaction evidence rather than becoming a second competing core.

## Current production problem

The deployment workflow previously attempted Prisma migrations against:

`localhost:5432`

That is a deployment-environment/configuration failure, not a reason to change the application architecture.

The correct fix is to identify and validate the actual production database connection, then make the deployment target use it deliberately.

## Release rule

No production deployment until the database decision, application reconciliation, CI/build, migration validation and end-to-end smoke tests are complete.
