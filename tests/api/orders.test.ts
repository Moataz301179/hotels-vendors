import { describe, it, expect, vi } from "vitest";

// Mock prisma to avoid driver adapter issues in tests
vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
    order: { findMany: vi.fn().mockResolvedValue([]) },
    invoice: { findMany: vi.fn().mockResolvedValue([]) },
    hotel: { findUnique: vi.fn().mockResolvedValue(null) },
  },
}));

// Import after mock
const { validateStatusTransition } = await import("@/lib/auth/state-machine");
import { OrderStatus } from "@prisma/client";

describe("Order State Machine", () => {
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
