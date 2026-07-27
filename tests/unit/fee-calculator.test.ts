import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  calculatePlatformFee,
  calculateFullFeeBreakdown,
  FEE_RATE_TABLE,
} from "@/lib/fintech/fee-calculator";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    invoice: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Fee Calculator", () => {
  describe("calculatePlatformFee — TRANSACTION", () => {
    it("should calculate 2.5% for CORE tier", () => {
      const result = calculatePlatformFee(10000, "CORE", "TRANSACTION");
      expect(result.amount).toBe(250);
      expect(result.rate).toBe(0.025);
      expect(result.feeType).toBe("TRANSACTION");
      expect(result.currency).toBe("EGP");
    });

    it("should calculate 2.0% for PREMIER tier", () => {
      const result = calculatePlatformFee(10000, "PREMIER", "TRANSACTION");
      expect(result.amount).toBe(200);
      expect(result.rate).toBe(0.02);
    });

    it("should calculate 1.5% for COASTAL tier", () => {
      const result = calculatePlatformFee(10000, "COASTAL", "TRANSACTION");
      expect(result.amount).toBe(150);
      expect(result.rate).toBe(0.015);
    });

    it("should round to 2 decimal places", () => {
      const result = calculatePlatformFee(3333, "CORE", "TRANSACTION");
      // 3333 * 0.025 = 83.325 → 83.33
      expect(result.amount).toBe(83.33);
    });

    it("should handle zero amount", () => {
      const result = calculatePlatformFee(0, "CORE", "TRANSACTION");
      expect(result.amount).toBe(0);
    });
  });

  describe("calculatePlatformFee — FACTORING_REFERRAL", () => {
    it("should calculate 0.5% flat regardless of tier", () => {
      const result = calculatePlatformFee(100000, "CORE", "FACTORING_REFERRAL");
      expect(result.amount).toBe(500);
      expect(result.rate).toBe(0.005);
    });

    it("should use same rate for PREMIER", () => {
      const result = calculatePlatformFee(100000, "PREMIER", "FACTORING_REFERRAL");
      expect(result.amount).toBe(500);
    });

    it("should round to 2 decimal places", () => {
      const result = calculatePlatformFee(12345, "CORE", "FACTORING_REFERRAL");
      // 12345 * 0.005 = 61.725 → 61.73
      expect(result.amount).toBe(61.73);
    });
  });

  describe("calculatePlatformFee — DOCUMENT_PROCESSING", () => {
    it("should return flat EGP 5 fee", () => {
      const result = calculatePlatformFee(50000, "CORE", "DOCUMENT_PROCESSING");
      expect(result.amount).toBe(5);
      expect(result.rate).toBe(0);
    });
  });

  describe("calculateFullFeeBreakdown", () => {
    it("should sum all three fee types for CORE", () => {
      const breakdown = calculateFullFeeBreakdown(100000, "CORE", 2);
      // Transaction: 2500, Factoring: 500, Documents: 10
      expect(breakdown.transactionFee.amount).toBe(2500);
      expect(breakdown.factoringReferralFee.amount).toBe(500);
      expect(breakdown.documentProcessingFee.amount).toBe(10);
      expect(breakdown.totalPlatformFees).toBe(3010);
    });

    it("should sum correctly for COASTAL", () => {
      const breakdown = calculateFullFeeBreakdown(100000, "COASTAL", 1);
      // Transaction: 1500, Factoring: 500, Documents: 5
      expect(breakdown.transactionFee.amount).toBe(1500);
      expect(breakdown.totalPlatformFees).toBe(2005);
    });

    it("should default to 1 document", () => {
      const breakdown = calculateFullFeeBreakdown(10000, "CORE");
      expect(breakdown.documentProcessingFee.amount).toBe(5);
    });

    it("should handle zero invoice total", () => {
      const breakdown = calculateFullFeeBreakdown(0, "CORE", 1);
      expect(breakdown.totalPlatformFees).toBe(5);
    });
  });

  describe("FEE_RATE_TABLE", () => {
    it("should export correct rate table", () => {
      expect(FEE_RATE_TABLE.transaction.CORE).toBe(0.025);
      expect(FEE_RATE_TABLE.transaction.PREMIER).toBe(0.02);
      expect(FEE_RATE_TABLE.transaction.COASTAL).toBe(0.015);
      expect(FEE_RATE_TABLE.factoringReferral).toBe(0.005);
      expect(FEE_RATE_TABLE.documentProcessing).toBe(5);
    });
  });

  describe("Edge cases", () => {
    it("should handle very large amounts", () => {
      const result = calculatePlatformFee(999999999, "CORE", "TRANSACTION");
      expect(Number.isFinite(result.amount)).toBe(true);
    });

    it("should handle very small amounts", () => {
      const result = calculatePlatformFee(0.01, "CORE", "TRANSACTION");
      expect(result.amount).toBe(0);
    });

    it("breakdown strings should contain EGP", () => {
      const result = calculatePlatformFee(10000, "CORE", "TRANSACTION");
      expect(result.breakdown).toContain("EGP");
    });
  });
});
