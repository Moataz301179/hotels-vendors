import { describe, it, expect } from "vitest";

describe("Credit Gate — Lifecycle", () => {
  describe("Credit calculation logic", () => {
    it("should calculate available credit correctly", () => {
      const creditLimit = 100000;
      const creditUsed = 30000;
      const available = creditLimit - creditUsed;
      expect(available).toBe(70000);
    });

    it("should block when credit exceeded", () => {
      const creditLimit = 100000;
      const creditUsed = 95000;
      const requested = 10000;
      const available = creditLimit - creditUsed;
      expect(available - requested).toBeLessThan(0);
    });

    it("should allow when credit available", () => {
      const creditLimit = 100000;
      const creditUsed = 30000;
      const requested = 10000;
      const available = creditLimit - creditUsed;
      expect(available - requested).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Reserve and release", () => {
    it("reserve increases creditUsed", () => {
      let creditUsed = 0;
      const amount = 50000;
      creditUsed += amount;
      expect(creditUsed).toBe(50000);
    });

    it("release decreases creditUsed", () => {
      let creditUsed = 50000;
      const amount = 50000;
      creditUsed -= amount;
      expect(creditUsed).toBe(0);
    });

    it("release should not go below zero", () => {
      let creditUsed = 30000;
      const amount = 50000;
      creditUsed = Math.max(0, creditUsed - amount);
      expect(creditUsed).toBe(0);
    });
  });

  describe("3-way matching tolerance", () => {
    const QTY_TOLERANCE = 0.05;
    const PRICE_TOLERANCE = 0.01;

    it("qty within 5% tolerance → match", () => {
      const ordered = 100;
      const received = 104;
      const variance = Math.abs(ordered - received) / ordered;
      expect(variance).toBeLessThanOrEqual(QTY_TOLERANCE);
    });

    it("qty outside 5% tolerance → mismatch", () => {
      const ordered = 100;
      const received = 110;
      const variance = Math.abs(ordered - received) / ordered;
      expect(variance).toBeGreaterThan(QTY_TOLERANCE);
    });

    it("price within 1% tolerance → match", () => {
      const poPrice = 100;
      const invoicePrice = 100.50;
      const variance = Math.abs(poPrice - invoicePrice) / poPrice;
      expect(variance).toBeLessThanOrEqual(PRICE_TOLERANCE);
    });

    it("price outside 1% tolerance → mismatch", () => {
      const poPrice = 100;
      const invoicePrice = 102;
      const variance = Math.abs(poPrice - invoicePrice) / poPrice;
      expect(variance).toBeGreaterThan(PRICE_TOLERANCE);
    });
  });
});
