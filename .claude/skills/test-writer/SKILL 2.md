# Test Writer Skill — hotels-vendors

## Purpose

Guide agents through writing correct, well-structured tests for this codebase. This skill covers Vitest unit/API tests and Playwright E2E tests.

---

## Tech Stack

| Tool | Config | Purpose |
|------|--------|---------|
| Vitest | `vitest.config.ts` | Unit tests, API route tests, integration tests |
| Playwright | `playwright.config.ts` | E2E browser tests |
| Prisma | `tests/setup.ts` mocks it globally | Database access is always mocked in Vitest |
| jsdom | vitest `environment` | DOM available without a real browser |

---

## Directory Layout

```
tests/
  setup.ts                         # Global: mocks Prisma, Redis, Sentry, env vars
  api/                             # API route handler tests (mocked Prisma)
    auth.test.ts                   # Auth flows: hashing, session, Zod validation
    orders.test.ts                 # Order state machine transitions
    idempotency.test.ts            # Idempotency key tests
  eta/                             # ETA compliance
    eta-canonicalizer.test.ts
  fintech/                         # Fintech services
    risk-engine.test.ts            # Risk scoring
    oliv-integration-validation.test.ts
  unit/                            # Pure functions — NO mocks needed
    (authority-matrix.test.ts)     # TO CREATE
    (state-machine.test.ts)        # TO CREATE
    (rbac.test.ts)                 # TO CREATE
    (fee-calculator.test.ts)       # TO CREATE
    (zod-schemas.test.ts)          # TO CREATE
  integration/                     # API flows with mocked DB
    (auth-flow.test.ts)            # TO CREATE
    (order-flow.test.ts)           # TO CREATE
e2e/
  dashboard-smoke.spec.ts          # Playwright: role-based dashboard smoke
  helpers/
    auth.ts                        # loginViaAPI, ensureTestUser, TEST_USERS
```

Parenthesized files are targets to create. Existing files are reference implementations — follow their patterns.

---

## Test Patterns

### 1. Pure Unit Test (no dependencies)

Place in `tests/unit/`. No mocks. No DB. No `vi.mock()`.

```typescript
import { describe, it, expect } from "vitest";
import { functionName } from "@/lib/some-module";

describe("functionName", () => {
  it("should handle basic case", () => {
    const result = functionName(input);
    expect(result).toBe(expected);
  });

  it("should handle edge case", () => {
    expect(functionName(edgeInput)).toEqual(expectedEdge);
  });
});
```

**Run with:** `npx vitest run tests/unit/function-name.test.ts`

---

### 2. API Route Test (mocked Prisma)

Place in `tests/api/`. Always mock Prisma, session, and Redis at the top of the file — before any imports from the module under test.

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocks MUST come before the import of the module under test
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    order: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
  },
}));

vi.mock("@/lib/session", () => ({
  createSession: vi.fn().mockResolvedValue("mock-token"),
  verifySession: vi.fn().mockResolvedValue(null),
  clearSession: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/redis", () => ({
  getRedis: vi.fn().mockReturnValue(null),
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 100 }),
}));

// Dynamic import AFTER mocks so the module picks them up
const { handler } = await import("@/app/api/v1/orders/route");

import { prisma } from "@/lib/prisma";

describe("POST /api/v1/orders", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should create order with valid data", async () => {
    (prisma.order.create as any).mockResolvedValue({ id: "1", status: "DRAFT" });

    const request = new Request("http://localhost/api/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId: "s1", items: [{ productId: "p1", qty: 10 }] }),
    });

    const response = await handler(request as any);
    expect(response.status).toBe(200);
  });

  it("should reject empty body", async () => {
    const request = new Request("http://localhost/api/v1/orders", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await handler(request as any);
    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
```

**Key rules:**
- Mocks are hoisted by `vi.mock()` — but the **import of the module under test** must come AFTER all `vi.mock()` calls.
- Use `(prisma.order.create as any).mockResolvedValue(...)` to type-cast mocked functions.
- Always call `vi.clearAllMocks()` in `beforeEach`.
- Zod validation tests do NOT need Prisma mocks — import the schema directly and call `.safeParse()`.

---

### 3. State Machine Test

Place in `tests/unit/` (pure) or `tests/api/` (if testing the route-level enforcement).

```typescript
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
  },
}));

const { validateStatusTransition } = await import("@/lib/auth/state-machine");
import { OrderStatus } from "@prisma/client";

describe("Order state machine", () => {
  const validTransitions: Array<{ from: OrderStatus; to: OrderStatus }> = [
    { from: "DRAFT", to: "PENDING_APPROVAL" },
    { from: "PENDING_APPROVAL", to: "APPROVED" },
    { from: "PENDING_APPROVAL", to: "REJECTED" },
    { from: "APPROVED", to: "CONFIRMED" },
    { from: "CONFIRMED", to: "IN_TRANSIT" },
    { from: "IN_TRANSIT", to: "DELIVERED" },
    { from: "DELIVERED", to: "DISPUTED" },
    { from: "REJECTED", to: "DRAFT" },
  ];

  validTransitions.forEach(({ from, to }) => {
    it(`should allow ${from} → ${to}`, () => {
      const result = validateStatusTransition(from, to);
      expect(result.valid).toBe(true);
    });
  });

  const invalidTransitions: Array<{ from: OrderStatus; to: OrderStatus }> = [
    { from: "DRAFT", to: "DELIVERED" },
    { from: "PENDING_APPROVAL", to: "CONFIRMED" },
    { from: "CANCELLED", to: "DRAFT" },
    { from: "DELIVERED", to: "APPROVED" },
  ];

  invalidTransitions.forEach(({ from, to }) => {
    it(`should reject ${from} → ${to}`, () => {
      const result = validateStatusTransition(from, to);
      expect(result.valid).toBe(false);
    });
  });
});
```

---

### 4. Authority Matrix Test

Place in `tests/unit/` if `evaluateAuthority` is pure, or `tests/api/` if it reads from Prisma.

```typescript
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    authorityRule: {
      findMany: vi.fn().mockResolvedValue([
        { id: "r1", threshold: 10000, role: "PROCUREMENT_MANAGER", action: "AUTO_APPROVE" },
        { id: "r2", threshold: 50000, role: "PROCUREMENT_MANAGER", action: "REQUIRES_DIRECTOR" },
      ]),
    },
    $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
  },
}));

const { evaluateAuthority } = await import("@/lib/auth/authority-matrix");

describe("Authority Matrix", () => {
  it("should auto-approve orders below threshold", async () => {
    const result = await evaluateAuthority({
      orderValue: 5000,
      hotelId: "h1",
      userId: "u1",
      userRole: "PROCUREMENT_MANAGER",
    });
    expect(result.decision).toBe("AUTO_APPROVE");
  });

  it("should require escalation for high-value orders", async () => {
    const result = await evaluateAuthority({
      orderValue: 30000,
      hotelId: "h1",
      userId: "u1",
      userRole: "PROCUREMENT_MANAGER",
    });
    expect(result.decision).toBe("REQUIRES_DIRECTOR");
  });
});
```

---

### 5. Zod Schema Test

Place in `tests/unit/`. No mocks needed.

```typescript
import { describe, it, expect } from "vitest";
import { LoginSchema, BusinessRegisterSchema } from "@/lib/zod";

describe("LoginSchema", () => {
  it("should accept valid login data", () => {
    const result = LoginSchema.safeParse({
      email: "test@hotel.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = LoginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty password", () => {
    const result = LoginSchema.safeParse({
      email: "test@hotel.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("BusinessRegisterSchema", () => {
  it("should accept complete hotel registration", () => {
    const result = BusinessRegisterSchema.safeParse({
      email: "hotel@example.com",
      password: "SecurePass123!",
      name: "Grand Hotel",
      type: "hotel",
      taxId: "123456789",
      city: "Cairo",
      governorate: "Cairo",
      address: "123 Main St",
      commercialReg: "CR-001",
      phone: "+20123456789",
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing required fields", () => {
    const result = BusinessRegisterSchema.safeParse({
      email: "hotel@example.com",
      password: "SecurePass123!",
      name: "Grand Hotel",
      type: "hotel",
    });
    expect(result.success).toBe(false);
  });
});
```

---

### 6. Risk Engine / Service Test (mocked DB)

Place in `tests/fintech/`. Mock Prisma with realistic data shapes.

```typescript
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    hotel: {
      findUnique: vi.fn().mockImplementation((args: { where: { id: string } }) => {
        if (args.where.id === "nonexistent") return Promise.resolve(null);
        return Promise.resolve({
          id: "hotel-1",
          name: "Test Hotel",
          riskTier: "MEDIUM",
          creditLimit: 1000000,
          creditUsed: 200000,
          properties: [{ id: "p1", name: "Property 1" }],
          invoices: [
            { id: "inv1", status: "PAID", issueDate: new Date(), total: 50000, paymentStatus: "PAID" },
          ],
          orders: [
            { id: "ord1", status: "DELIVERED", total: 50000, createdAt: new Date(), disputeRaised: false },
          ],
          creditFacilities: [
            { id: "cf1", limit: 500000, utilized: 100000, status: "ACTIVE" },
          ],
        });
      }),
    },
    order: { findMany: vi.fn().mockResolvedValue([]) },
    invoice: { findMany: vi.fn().mockResolvedValue([]) },
  },
}));

const { assessRisk } = await import("@/lib/fintech/risk-engine");

describe("Risk Engine", () => {
  it("should return valid risk assessment", async () => {
    const result = await assessRisk("hotel-1");
    expect(result).toBeDefined();
    expect(result.hotelId).toBe("hotel-1");
    expect(result.compositeScore).toBeGreaterThanOrEqual(0);
    expect(result.compositeScore).toBeLessThanOrEqual(100);
    expect(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).toContain(result.riskTier);
  });

  it("should throw for non-existent hotel", async () => {
    await expect(assessRisk("nonexistent")).rejects.toThrow("Hotel not found");
  });
});
```

---

### 7. Playwright E2E Test

Place in `e2e/`. Uses helpers from `e2e/helpers/auth.ts`.

```typescript
import { test, expect } from "@playwright/test";
import {
  TEST_USERS,
  loginViaAPI,
  navigateAndCollectErrors,
  waitForDashboardLoad,
} from "./helpers/auth";

test.describe("Hotel Dashboard", () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    await loginViaAPI(context, TEST_USERS.hotel);
    await context.close();
  });

  test("Hotel dashboard loads without 5xx", async ({ page, context }) => {
    await loginViaAPI(context, TEST_USERS.hotel);
    const errors = await navigateAndCollectErrors(page, "/hotel");
    const serverErrors = errors.filter((e) => e.status >= 500);
    expect(serverErrors).toHaveLength(0);
    await waitForDashboardLoad(page);
  });
});
```

**E2E rules:**
- Run against deployed env (`BASE_URL`), not localhost, unless `webServer` is configured.
- Tests are sequential (`workers: 1`, `fullyParallel: false`).
- Always use `loginViaAPI` — never fill forms for auth in E2E.
- Guard with `test.skip()` if auth fails — do not fail the suite on auth issues.

---

## Running Tests

```bash
# All Vitest tests
npm test

# Single file
npx vitest run tests/unit/authority-matrix.test.ts

# Watch mode (dev)
npm run test:watch

# Coverage
npx vitest run --coverage

# E2E (requires deployed env + BASE_URL)
npx playwright test

# E2E single file
npx playwright test e2e/dashboard-smoke.spec.ts
```

---

## Global Mocks (from `tests/setup.ts`)

These are available in ALL Vitest tests automatically. Do not re-mock them unless you need different behavior:

| Mock | What it covers |
|------|----------------|
| `prisma` | All Prisma models — `vi.mock("@/lib/prisma")` in individual files for specific shapes |
| `ioredis` | `get`, `set`, `del`, `incr`, `expire`, `lpush`, `brpop` — all return sensible defaults |
| `@sentry/nextjs` | `captureException`, `captureMessage`, `setUser`, `setTag` — all no-ops |
| `@prisma/adapter-pg` | `PrismaPg` class — no-op constructor |
| `pg` | `Pool` with mocked `query` and `end` |
| `SESSION_SECRET` | Set to a 64-char test string |
| `DATABASE_URL` | `postgresql://test:test@localhost:5433/test` |

---

## Coverage Targets

| Category | Minimum | Rationale |
|----------|---------|-----------|
| Auth, RBAC, Authority Matrix | 80%+ | Security-critical — G2/G3 guardrails |
| Order state machine | 80%+ | Business-critical flow |
| Fintech (risk, fees, credit) | 80%+ | Monetary mutations — G10 guardrails |
| ETA compliance | 80%+ | Legal requirement — G4 guardrails |
| Utility functions | 90%+ | Pure functions, easy to test |
| UI components | 50%+ | Snapshot tests acceptable |
| E2E smoke | All dashboard routes | Zero 5xx target |

---

## What NOT to Test

- **Pure presentational components** that only render JSX from props (no logic).
- **Type definitions** (`types/`, `*.d.ts`).
- **Config files** (`tailwind.config.ts`, `next.config.ts`, `postcss.config.mjs`).
- **Prisma migrations** (`prisma/migrations/`).
- **Layout wrappers** that just compose children.
- **CSS/Tailwind classes** — visual regression is out of scope for Vitest.

---

## Writing Checklist

Before submitting a new test file, verify:

- [ ] File is in the correct directory (`tests/unit/`, `tests/api/`, `tests/fintech/`, `tests/eta/`, `tests/integration/`, `e2e/`)
- [ ] All `vi.mock()` calls are before the import of the module under test
- [ ] `vi.clearAllMocks()` is in `beforeEach` for tests that use mocks
- [ ] `describe` blocks group related tests
- [ ] Test names are descriptive (`"should reject DRAFT → DELIVERED"` not `"test 1"`)
- [ ] No real DB calls — all Prisma calls are mocked
- [ ] No `console.log` in tests
- [ ] No hardcoded secrets or PII
- [ ] Tests pass with `npm test`
- [ ] No TypeScript errors with `npx tsc --noEmit` (if applicable)

---

## Common Pitfalls

1. **Import order matters.** `vi.mock()` is hoisted, but if you import the module under test BEFORE the mock is set up, the mock won't apply. Always: mock → then import.

2. **Type-casting mocks.** Prisma mock functions are typed as `never`. Use `(prisma.order.create as any).mockResolvedValue(...)`.

3. **Async dynamic imports.** When importing after mocks, use `const { fn } = await import("...")` — this ensures mocks are registered.

4. **Zod tests don't need mocks.** Import schemas directly and use `.safeParse()`.

5. **E2E auth is flaky.** Always wrap `loginViaAPI` in try/catch and `test.skip()` if it fails.

6. **The `@/` alias** resolves to the project root (not `src/`). Vitest config sets this via `resolve.alias`.
