import { describe, it, expect, vi } from "vitest";

// Mock prisma before importing risk engine
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
            { id: "inv2", status: "PAID", issueDate: new Date(), total: 75000, paymentStatus: "PAID" },
          ],
          orders: [
            { id: "ord1", status: "DELIVERED", total: 50000, createdAt: new Date(), disputeRaised: false },
            { id: "ord2", status: "DELIVERED", total: 75000, createdAt: new Date(), disputeRaised: false },
          ],
          creditFacilities: [
            { id: "cf1", limit: 500000, utilized: 100000, status: "ACTIVE" },
          ],
        });
      }),
    },
    order: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    invoice: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

// Import after mock
const { assessRisk } = await import("@/lib/fintech/risk-engine");

describe("Risk Engine", () => {
  describe("assessRisk", () => {
    it("should return a valid risk assessment for a hotel", async () => {
      const result = await assessRisk("hotel-1");

      expect(result).toBeDefined();
      expect(result.hotelId).toBe("hotel-1");
      expect(typeof result.compositeScore).toBe("number");
      expect(result.compositeScore).toBeGreaterThanOrEqual(0);
      expect(result.compositeScore).toBeLessThanOrEqual(100);
      expect(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).toContain(result.riskTier);
      expect(result.factors).toBeDefined();
    });

    it("should throw for non-existent hotel", async () => {
      await expect(assessRisk("nonexistent")).rejects.toThrow("Hotel not found");
    });
  });
});
