# Compliance & Authority Matrix Skill
## Hotels Vendors — Persistent Security Guardrails

### Purpose
Reusable compliance rules for all agents working on the Hotels Vendors platform. This skill enforces the Authority Matrix, Payment Guarantee Gate, and ETA Validation rules across all code changes.

### Rules (Read-Only)
1. **Payment Guarantee Gate:** No order ships without `order.paymentGuaranteed = true`
2. **ETA Factoring Gate:** No factoring without valid ETA UUID
3. **Platform Fee Priority:** Hub fee deducted BEFORE partner fee
4. **Non-Recourse Only:** Supplier zero default risk
5. **Admin Override Dual Auth:** Two admins + 20-char reason + escalated alert
6. **Idempotency:** All monetary mutations require idempotency key
7. **ACID + Immutable Audit:** Hash-chained audit logs

### Usage
Any agent modifying order, invoice, factoring, or payment logic MUST import and validate against these rules.

### Files
- `lib/auth/authority-matrix.ts` — Rule evaluation engine
- `lib/audit/tamper-proof.ts` — Hash-chained audit log
- `lib/security/fortress.ts` — Master security orchestrator
- `lib/security/idempotency.ts` — Duplicate prevention
