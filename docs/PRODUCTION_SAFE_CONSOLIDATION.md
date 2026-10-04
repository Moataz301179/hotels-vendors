# HotelsVendors — Production-Safe Consolidation

## Purpose

This branch is the controlled rebuild workspace for the HotelsVendors platform.

The live production site is the **production baseline**. It is not to be replaced, reset, or used as a disposable test environment.

## Operating rules

1. **Production is protected.** No automatic deployment is allowed while consolidation is in progress.
2. **No copy-and-replace rebuilds.** Existing production capabilities are preserved unless a replacement has been verified feature-for-feature.
3. **No destructive database action.** No database is deleted, emptied, migrated destructively, or disconnected until its data and dependencies have been audited.
4. **One primary application repository.** `Moataz301179/hotels-vendors` is the working repository for the production application. Other repositories are treated as sources to audit, not as deployment targets.
5. **One primary transaction model.** The target business spine is:
   Hotel → Requirement → Product/SKU → Supplier → Quote → Deal → PO → Logistics → Delivery/GRN → Invoice → Payment → Outcome.
6. **Database consolidation is evidence-driven.** Neon, Supabase, and any VPS PostgreSQL instance must be compared before deciding what survives.
7. **Legacy code is retired only after dependency tracing.** A module is removed only when its routes, imports, database tables, jobs, and integrations have been accounted for.
8. **Release only when ready.** A production release must pass CI, type checking, build, migration validation, database connectivity, application health, and live smoke tests.

## Target platform direction

HotelsVendors is being developed as an aggregation-led B2B procurement and transaction network.

The important moat is not simply a marketplace catalogue. It is the evidence and transaction graph that allows HotelsVendors to aggregate hotel demand, normalize requirements, negotiate supplier volume, surface executable deals, and then orchestrate fulfilment and settlement.

### Priority order

- **P0 — Transaction/evidence graph:** orders, requirements, products/SKUs, suppliers, quotes, deals, fulfilment, invoices, payments, outcomes.
- **P0 — Deal intelligence:** normalized pricing, supplier performance, volume opportunities, savings evidence.
- **P1 — Aggregated demand:** cross-property demand aggregation within permitted tenant/network boundaries and supplier volume deals.
- **P1 — Fulfilment orchestration:** logistics, ETA/GRN evidence, exceptions and delivery performance.
- **P2 — Financing readiness:** clean invoice/order evidence and eligibility signals for financing partners; do not build unnecessary lending infrastructure into the core.

## Current production protection

The production deployment job is gated by:

`PRODUCTION_RELEASE_READY=true`

Until that gate is deliberately enabled after the consolidation is verified, pushes may run CI but must not replace the live production application.

## Release gate

Before production is unlocked, verify:

- [ ] Primary application architecture reconciled
- [ ] All database providers inventoried
- [ ] Neon/Supabase/VPS data ownership compared
- [ ] Primary database selected from evidence
- [ ] Supabase dependencies either migrated, retained deliberately, or retired
- [ ] Prisma schema and migrations reconciled
- [ ] Legacy routes and duplicate implementations mapped
- [ ] Required modules present
- [ ] No missing imports/modules
- [ ] CI passes
- [ ] Type check passes
- [ ] Production build passes
- [ ] Database connection reaches the selected production database
- [ ] Prisma migrations apply safely
- [ ] Signup/login/onboarding verified
- [ ] Core procurement flow verified
- [ ] Demand aggregation verified
- [ ] INVO/factoring paths verified or deliberately migrated
- [ ] Health endpoint verified
- [ ] Live smoke tests verified
- [ ] Only then enable the production release gate

## Terminology

Use **production**, **primary**, **legacy**, **retire**, and **archive** for project decisions.

The word **canonical** should remain only where it is a genuine technical term, such as SEO canonical URLs or XML canonicalization. It should not be used to describe the project's chosen repository, database, or deployment.
