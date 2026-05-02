# Testing Fintech Skill
## Hotels Vendors — Test Patterns for Monetary Logic

### Purpose
Reusable testing patterns for all agents writing fintech, security, or API logic.

### Non-Negotiable Rules
1. **Every monetary mutation MUST have a test.** Fee calculations, ledger entries, state transitions, and approval flows require tests.
2. **Use Vitest + React Testing Library.** Unit tests for logic, component tests for UI, Playwright for E2E.
3. **Mock external APIs.** ETA, Paymob, factoring partners, and email services MUST be mocked in tests.
4. **Test idempotency.** Verify that running the same operation twice with the same idempotency key produces the same result without side effects.
5. **Test tenant isolation.** Verify that User A cannot access User B's data.
6. **Test RBAC.** Verify that `requirePermission()` rejects unauthorized actions.
7. **Test state machines.** Verify all valid and invalid state transitions.
8. **Coverage threshold.** Minimum 80% coverage for `lib/fintech/`, `lib/auth/`, `lib/eta/`, and `app/api/v1/`.

### Tech Stack
- Vitest (test runner)
- @vitejs/plugin-react
- jsdom (DOM environment)
- @testing-library/react + @testing-library/jest-dom
- Playwright (E2E)

### Patterns
```typescript
// Fee calculation test
import { describe, it, expect } from "vitest";
import { calculatePlatformFee } from "@/lib/fintech/hub-revenue";

describe("calculatePlatformFee", () => {
  it("deducts platform fee before factoring fee", () => {
    const orderTotal = 100000; // 1000.00 EGP in cents
    const result = calculatePlatformFee(orderTotal, 0.025); // 2.5%
    expect(result.platformFeeCents).toBe(2500); // 25.00 EGP
    expect(result.factoringBaseCents).toBe(97500); // 975.00 EGP
  });

  it("uses integer math only", () => {
    const result = calculatePlatformFee(99999, 0.025);
    expect(result.platformFeeCents).toBe(Math.floor(99999 * 0.025));
  });
});

// RBAC test
import { describe, it, expect } from "vitest";
import { requirePermission } from "@/lib/auth/rbac";

describe("requirePermission", () => {
  it("rejects unauthorized users", async () => {
    const ctx = { userId: "user-1", tenantId: "tenant-1", permissions: ["order:read"] };
    await expect(requirePermission(ctx, "order:approve")).rejects.toThrow("Forbidden");
  });
});
```

### Files You Must Read Before Writing
- `vitest.config.ts`
- `tests/setup.ts`
- `tests/fintech/` (create tests here)
- `tests/security/` (create tests here)
