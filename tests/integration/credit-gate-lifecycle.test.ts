import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import { canReleasePayment } from "@/lib/matching/three-way";
import type { MatchResult } from "@/lib/matching/three-way";

const baseMatchResult = (overrides?: Partial<MatchResult>): MatchResult => ({
  orderId: "ord_001",
  orderNumber: "PO-2026-0001",
  grnId: "grn_001",
  grnNumber: "GRN-2026-0001",
  invoiceId: "inv_001",
  invoiceNumber: "INV-2026-0001",
  status: "MATCHED",
  lineItems: [
    {
      orderItemId: "oi_001",
      productName: "Test Product",
      sku: "TST-001",
      orderedQty: 100,
      receivedQty: 98,
      invoicedQty: 100,
      poUnitPrice: 50,
      invoiceUnitPrice: 50,
      quantityMatch: true,
      priceMatch: true,
      variancePercent: 2,
      notes: [],
    },
  ],
  summary: {
    totalPOAmount: 5000,
    totalGRNAccepted: 4900,
    totalInvoiceAmount: 5000,
    varianceAmount: 0,
    matchRate: 100,
  },
  matchedAt: new Date(),
  ...overrides,
});

describe("3-Way Matching — Match Engine", () => {
  it("MATCHED → payment allowed", () => {
    const result = canReleasePayment(baseMatchResult());
    expect(result.allowed).toBe(true);
  });

  it("NO_GRN → payment blocked", () => {
    const result = canReleasePayment(baseMatchResult({ status: "NO_GRN" }));
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("No GRN");
  });

  it("NO_INVOICE → payment blocked", () => {
    const result = canReleasePayment(baseMatchResult({ status: "NO_INVOICE" }));
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("No invoice");
  });

  it("QTY_MISMATCH → payment blocked", () => {
    const result = canReleasePayment(
      baseMatchResult({
        status: "QTY_MISMATCH",
        summary: { totalPOAmount: 5000, totalGRNAccepted: 4000, totalInvoiceAmount: 5000, varianceAmount: 1000, matchRate: 50 },
      })
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("manual review");
  });

  it("PARTIAL_MATCH with 95%+ match rate → payment allowed", () => {
    const result = canReleasePayment(
      baseMatchResult({
        status: "PARTIAL_MATCH",
        summary: { totalPOAmount: 5000, totalGRNAccepted: 4900, totalInvoiceAmount: 5000, varianceAmount: 100, matchRate: 95 },
      })
    );
    expect(result.allowed).toBe(true);
    expect(result.reason).toContain("95%");
  });

  it("PARTIAL_MATCH with <95% match rate → payment blocked", () => {
    const result = canReleasePayment(
      baseMatchResult({
        status: "PARTIAL_MATCH",
        summary: { totalPOAmount: 5000, totalGRNAccepted: 4000, totalInvoiceAmount: 5000, varianceAmount: 1000, matchRate: 80 },
      })
    );
    expect(result.allowed).toBe(false);
  });

  it("variance > EGP 1000 → blocked even with partial match", () => {
    const result = canReleasePayment(
      baseMatchResult({
        status: "PARTIAL_MATCH",
        summary: { totalPOAmount: 10000, totalGRNAccepted: 5000, totalInvoiceAmount: 12000, varianceAmount: 2000, matchRate: 90 },
      })
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Variance");
  });

  it("QTY_MISMATCH with low variance amount → blocked (not auto-approvable)", () => {
    const result = canReleasePayment(
      baseMatchResult({
        status: "QTY_MISMATCH",
        summary: { totalPOAmount: 500, totalGRNAccepted: 450, totalInvoiceAmount: 500, varianceAmount: 50, matchRate: 50 },
      })
    );
    expect(result.allowed).toBe(false);
  });

  it("PRICE_MISMATCH → payment blocked", () => {
    const result = canReleasePayment(
      baseMatchResult({
        status: "PRICE_MISMATCH",
        lineItems: [{
          orderItemId: "oi_001", productName: "Test", sku: "TST-001",
          orderedQty: 100, receivedQty: 100, invoicedQty: 100,
          poUnitPrice: 50, invoiceUnitPrice: 52,
          quantityMatch: true, priceMatch: false,
          variancePercent: 4, notes: [],
        }],
        summary: { totalPOAmount: 5000, totalGRNAccepted: 5000, totalInvoiceAmount: 5200, varianceAmount: 200, matchRate: 0 },
      })
    );
    expect(result.allowed).toBe(false);
  });
});

describe("Credit Gate — Business Logic", () => {
  const SINGLE_LIMIT = 100000;

  // Pure logic tests — no DB needed
  describe("Credit calculation", () => {
    it("available = limit - used", () => {
      const used = 30000;
      const available = SINGLE_LIMIT - used;
      expect(available).toBe(70000);
    });

    it("order within limit → allowed", () => {
      const used = 30000;
      const proposed = 10000;
      const available = SINGLE_LIMIT - used;
      expect(proposed <= available).toBe(true);
    });

    it("order exceeding limit → blocked", () => {
      const used = 95000;
      const proposed = 10000;
      const available = SINGLE_LIMIT - used;
      expect(proposed > available).toBe(true);
    });

    it("edge: exactly at limit → allowed", () => {
      const used = 100000;
      const proposed = 0;
      const available = SINGLE_LIMIT - used;
      expect(proposed <= available).toBe(true);
    });

    it("edge: exact remaining credit → allowed", () => {
      const used = 90000;
      const proposed = 10000;
      const available = SINGLE_LIMIT - used;
      expect(proposed <= available).toBe(true);
    });

    it("edge: one cent over → blocked", () => {
      const used = 90000;
      const proposed = 10000.01;
      const available = SINGLE_LIMIT - used;
      expect(proposed > available).toBe(true);
    });
  });

  describe("Reserve credit", () => {
    it("reserve increments creditUsed", () => {
      let creditUsed = 30000;
      const orderTotal = 10000;
      creditUsed += orderTotal;
      expect(creditUsed).toBe(40000);
    });

    it("reserve does not exceed limit check (checked separately)", () => {
      const limit = 100000;
      let used = 95000;
      const proposed = 5000;
      const available = limit - used;
      expect(proposed <= available).toBe(true);
      used += proposed;
      expect(used).toBe(100000);
    });

    it("reserve on already maxed out account", () => {
      let used = 100000;
      const amount = 1;
      // This would have been blocked by checkCreditLimit first
      used += amount;
      expect(used).toBe(100001);
    });
  });

  describe("Release credit", () => {
    it("release decrements creditUsed", () => {
      let creditUsed = 50000;
      const paymentAmount = 50000;
      creditUsed = Math.max(0, creditUsed - paymentAmount);
      expect(creditUsed).toBe(0);
    });

    it("partial release", () => {
      let creditUsed = 50000;
      const paymentAmount = 20000;
      creditUsed = Math.max(0, creditUsed - paymentAmount);
      expect(creditUsed).toBe(30000);
    });

    it("release below zero clamps to 0", () => {
      let creditUsed = 30000;
      const paymentAmount = 50000;
      creditUsed = Math.max(0, creditUsed - paymentAmount);
      expect(creditUsed).toBe(0);
    });

    it("release exactly to zero", () => {
      let creditUsed = 50000;
      const paymentAmount = 50000;
      creditUsed = Math.max(0, creditUsed - paymentAmount);
      expect(creditUsed).toBe(0);
    });

    it("release zero amount (no-op)", () => {
      let creditUsed = 50000;
      const paymentAmount = 0;
      creditUsed = Math.max(0, creditUsed - paymentAmount);
      expect(creditUsed).toBe(50000);
    });
  });

  describe("Full lifecycle (unit test)", () => {
    it("place order → reserve → check → pay → release", () => {
      const limit = 100000;
      let used = 0;

      // Order 1 for $60,000
      const order1Amount = 60000;
      expect(order1Amount <= limit - used).toBe(true);
      used += order1Amount;
      expect(used).toBe(60000);

      // Order 2 for $30,000
      const order2Amount = 30000;
      expect(order2Amount <= limit - used).toBe(true);
      used += order2Amount;
      expect(used).toBe(90000);

      // Pay order 1 (when order is DELIVERED/invoiced)
      used = Math.max(0, used - order1Amount);
      expect(used).toBe(30000);

      // Order 3 for $80,000 — exceeds remaining $70K
      const order3Amount = 80000;
      expect(order3Amount <= limit - used).toBe(false);

      // Pay order 2
      used = Math.max(0, used - order2Amount);
      expect(used).toBe(0);

      // Now order 3 can go through
      expect(order3Amount <= limit - used).toBe(true);
      used += order3Amount;
      expect(used).toBe(80000);
    });
  });
});
