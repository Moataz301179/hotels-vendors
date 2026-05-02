# Fintech Engine Skill
## Hotels Vendors — Monetary Mutation Guardrails

### Purpose
Reusable fintech rules for all agents handling money, fees, credit, factoring, or ledger entries.

### Non-Negotiable Rules
1. **NEVER use JavaScript floating-point for money.** Always use integer cents (e.g., `12500` for EGP 125.00) or `decimal.js` for calculations.
2. **Idempotency is mandatory.** Every monetary mutation MUST include an idempotency key. Check `lib/security/idempotency.ts` before writing.
3. **Platform Fee Priority.** The hub fee is ALWAYS deducted BEFORE the factoring partner fee. The hub gets paid first.
4. **Non-Recourse Only.** All factoring through the platform is non-recourse. The supplier has zero default risk.
5. **Payment Guarantee Gate.** No order may transition to `CONFIRMED`, `IN_TRANSIT`, or `DELIVERED` without `order.paymentGuaranteed = true`.
6. **ETA Factoring Gate.** No factoring request proceeds without a valid ETA UUID (`etaStatus = ACCEPTED` or `VALIDATED`).
7. **Double-Entry Ledger.** Every monetary mutation writes TWO journal entries (debit + credit). See `lib/fintech/ledger.ts`.
8. **Smart Fix Autonomy.** When a hotel is blocked by credit/risk, the risk engine (`lib/fintech/risk-engine.ts`) generates fixes autonomously. No manual intervention required.
9. **TCP Report.** The "Total Cost of Procurement" report must be available for any order.
10. **Tests Required.** Every fee calculation, ledger entry, and state transition MUST have a Vitest test before merging.

### Tech Stack
- BullMQ for async settlement jobs
- Pino for structured logging of all monetary events
- Prisma 7.x with PostgreSQL
- Vitest for testing

### Patterns
```typescript
// CORRECT — integer cents
const platformFeeCents = Math.floor(orderTotalCents * platformFeeRate);

// FORBIDDEN — floating point
const platformFee = orderTotal * platformFeeRate; // 0.1 + 0.2 !== 0.3

// CORRECT — idempotency check
const existing = await prisma.journalEntry.findUnique({
  where: { idempotencyKey }
});
if (existing) return existing;
```

### Files You Must Read Before Writing
- `lib/fintech/hub-revenue.ts`
- `lib/fintech/risk-engine.ts`
- `lib/fintech/ledger.ts` (create if missing)
- `docs/fintech-engine-spec.md`
