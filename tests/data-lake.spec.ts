/**
 * Data Lake & Revenue Engine core tests
 * Run: npx vitest run tests/data-lake.spec.ts
 */

import { describe, it, expect } from "vitest";
import {
  computeReorderProfiles, purchaseIntentAlerts, computeReliabilityIndex,
  marketShareByCategory, round2,
} from "@/lib/data-lake/engine";

describe("procurement cycle / purchase intent", () => {
  it("computes avg reorder interval per sku per hotel group", () => {
    const profiles = computeReorderProfiles([
      { date: "2026-07-01", hotelGroupId: "g1", category: "GUEST_SUPPLIES", sku: "S1", qty: 1, priceEGP: 10 },
      { date: "2026-06-15", hotelGroupId: "g1", category: "GUEST_SUPPLIES", sku: "S1", qty: 1, priceEGP: 10 },
      { date: "2026-06-01", hotelGroupId: "g1", category: "GUEST_SUPPLIES", sku: "S1", qty: 1, priceEGP: 10 },
    ]);
    const p = profiles[0];
    expect(p.avgIntervalDays).toBe(15); // 16d then 14d → avg 15
    expect(p.sku).toBe("S1");
    expect(p.nextExpectedOrder).toBeTruthy();
  });

  it("fires purchase intent alert within 14-day window", () => {
    const now = Date.now();
    const profiles = computeReorderProfiles([
      { date: new Date(now - 30 * 86_400_000).toISOString().slice(0, 10), hotelGroupId: "g", category: "CONSUMABLES", sku: "S2", qty: 1, priceEGP: 5 },
      { date: new Date(now - 15 * 86_400_000).toISOString().slice(0, 10), hotelGroupId: "g", category: "CONSUMABLES", sku: "S2", qty: 1, priceEGP: 5 },
    ]);
    const alerts = purchaseIntentAlerts(profiles, 14, now);
    expect(alerts.some((a) => a.sku === "S2")).toBe(true);
    expect(alerts[0]).toHaveProperty("dueInDays");
  });
});

describe("credit-risk reliability index", () => {
  it("scores a healthy hotel AAA", () => {
    const idx = computeReliabilityIndex("382-910-112", { onTimePaymentPct: 98, dockDisputeRate: 0.02, etaClearanceDays: 2, orderVolume: 340 });
    expect(idx.score).toBeGreaterThanOrEqual(90);
    expect(idx.grade).toBe("AAA");
  });

  it("scores a weak hotel lower with worse grade", () => {
    const weak = computeReliabilityIndex("TX", { onTimePaymentPct: 55, dockDisputeRate: 0.3, etaClearanceDays: 8, orderVolume: 20 });
    const strong = computeReliabilityIndex("TX2", { onTimePaymentPct: 99, dockDisputeRate: 0, etaClearanceDays: 1, orderVolume: 400 });
    expect(weak.score).toBeLessThan(strong.score);
    expect(weak.grade).not.toBe("AAA");
  });

  it("escapes the 0-100 range", () => {
    const idx = computeReliabilityIndex("TX", { onTimePaymentPct: 100, dockDisputeRate: 0, etaClearanceDays: 1, orderVolume: 9999 });
    expect(idx.score).toBeLessThanOrEqual(100);
    expect(idx.score).toBeGreaterThanOrEqual(0);
  });
});

describe("manufacturer market share", () => {
  it("computes GMV, avg unit price and brand share per category", () => {
    const rows = marketShareByCategory([
      { category: "F_AND_B", brand: "A", qty: 100, priceEGP: 10 },
      { category: "F_AND_B", brand: "B", qty: 100, priceEGP: 30 },
    ]);
    const a = rows.find((r) => r.brand === "A")!;
    const b = rows.find((r) => r.brand === "B")!;
    expect(a.gmvEGP).toBe(1000);
    expect(b.gmvEGP).toBe(3000);
    expect(a.sharePct).toBe(25); // 1000/4000
    expect(b.sharePct).toBe(75);
    expect(a.avgUnitPrice).toBe(10);
  });
});

describe("rounding", () => {
  it("rounds 2dp", () => {
    expect(round2(0.1 + 0.2)).toBe(0.3);
  });
});
