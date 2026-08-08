/**
 * Storefront Commerce + Shipping engine tests
 * Run: npx vitest run tests/storefront.spec.ts
 */

import { describe, it, expect } from "vitest";
import {
  normalizeTerm, correctTerm, expandQuery, scoreProduct, suggestCompletions,
  complementaryKeywords, alternativeKeywords, comparePrices,
} from "@/lib/storefront/commerce";
import { classifyCity, quoteDelivery, scheduleFor } from "@/lib/storefront/shipping";

describe("smart search", () => {
  it("normalizes Arabic + typo'd English", () => {
    expect(normalizeTerm("  Towls  ")).toBe("towls");
    expect(correctTerm("towls")).toBe("towels");
    expect(correctTerm("schampoo")).toBe("shampoo");
  });

  it("expands related terms", () => {
    const terms = expandQuery("towels");
    expect(terms).toContain("towels");
    expect(terms).toContain("bath linen");
  });

  it("scores products by relevance", () => {
    const hot = scoreProduct("towels", { name: "Egyptian Cotton Bath Towels GSM 500", category: "LIN" });
    const cold = scoreProduct("towels", { name: "Mini Bar Fridge 40L", category: "FFE" });
    expect(hot).toBeGreaterThan(cold);
    expect(hot).toBeGreaterThan(0);
  });

  it("suggests completions from an index", () => {
    const idx = ["Egyptian Cotton Bath Towels", "Hand Towels", "Beach Towels", "Mini Bar Fridge"];
    const s = suggestCompletions("tow", idx, 5);
    expect(s.some((x) => x.includes("towel"))).toBe(true);
  });
});

describe("complements + alternatives", () => {
  it("returns complementary bundles for towel", () => {
    const c = complementaryKeywords(["linen", "towel"], "Bath Towel");
    expect(c.some((x) => x.includes("washcloth") || x.includes("bath mat") || x.includes("hand towel"))).toBe(true);
  });
  it("returns alternatives for shampoo", () => {
    const a = alternativeKeywords("Hotel Shampoo");
    expect(a.some((x) => x.includes("body wash") || x.includes("soap"))).toBe(true);
  });
});

describe("price comparison", () => {
  it("ranks offers by price and computes spread", () => {
    const res = comparePrices([
      { supplierId: "a", supplierName: "A", unitPrice: 120, unitOfMeasure: "piece" },
      { supplierId: "b", supplierName: "B", unitPrice: 100, unitOfMeasure: "piece" },
      { supplierId: "c", supplierName: "C", unitPrice: 80, unitOfMeasure: "piece" },
    ]);
    expect(res.lowest?.supplierName).toBe("C");
    expect(res.spreadPct).toBe(50); // (120-80)/80
    expect(res.offers[0].supplierName).toBe("C");
  });
});

describe("storefront shipping", () => {
  it("classifies resort vs cairo", () => {
    expect(classifyCity("Hurghada").zone).toBe("resort");
    expect(classifyCity("New Cairo").zone).toBe("national");
    expect(classifyCity("Alexandria").zone).toBe("north-coast");
  });

  it("produces a quote with cost + eta for a resort hotel", () => {
    const q = quoteDelivery("Hurghada", 3, 40, "EXPRESS");
    expect(q.corridor).toContain("Red Sea");
    expect(q.estimatedCostEGP).toBeGreaterThan(0);
    expect(q.etaText.length).toBeGreaterThan(0);
    expect(q.schedule.cutoff).toBeTruthy();
  });

  it("schedule for express cairo is faster than regular resort", () => {
    expect(scheduleFor("Greater Cairo Corridor", "EXPRESS").etaHoursMax).toBeLessThan(
      scheduleFor("Red Sea / Sinai Corridor", "REGULAR").etaHoursMax
    );
  });
});
