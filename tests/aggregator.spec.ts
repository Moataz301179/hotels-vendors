/**
 * Dropship & Affiliate Aggregator core tests
 * Run: npx vitest run tests/aggregator.spec.ts
 */

import { describe, it, expect } from "vitest";
import {
  maskSku, maskUrl, applyMargin, splitOrder, createStockLocks,
  resolveShortfall, buildUnifiedInvoice, buildOlivPayoutRequest, round2,
} from "@/lib/dropshipping/aggregator";

describe("SKU masking & identity", () => {
  it("strips vendor identity and returns stable masked SKU", () => {
    const a = maskSku("VENDOR-SKU-123", "maxab");
    const b = maskSku("VENDOR-SKU-123", "maxab");
    expect(a).toBe(b);
    expect(a).toMatch(/^ATT-/);
    expect(a).not.toContain("123");
    expect(a).not.toContain("maxab");
  });

  it("returns canonical masked URL, never the vendor URL", () => {
    expect(maskUrl("https://vendor.example/p/secret", "att-1")).toMatch(/^\/p\//);
    expect(maskUrl("https://vendor.example/p/secret", "att-1")).not.toContain("vendor.example");
  });
});

describe("dynamic margin layer", () => {
  it("applies platform fee + fixed uplift, rounded 2dp", () => {
    const { hotelPrice, fee } = applyMargin({ wholesaleCost: 1000, category: "FFE", platformFeePct: 8, fixedUplift: 50 });
    expect(hotelPrice).toBe(1130); // 1000 + 80 + 50
    expect(fee).toBe(130);
  });

  it("rounds correctly to avoid floating point drift", () => {
    const { hotelPrice } = applyMargin({ wholesaleCost: 0.1, category: "CONSUMABLES", platformFeePct: 10 });
    expect(hotelPrice).toBe(0.11);
  });
});

describe("order splitting & inventory lock", () => {
  const basket = [
    { productId: "a", sku: "ATT-1", qty: 3, supplierId: "maxab", unitPrice: 100 },
    { productId: "b", sku: "ATT-2", qty: 2, supplierId: "factory-x", unitPrice: 50 },
    { productId: "c", sku: "ATT-3", qty: 1, supplierId: "maxab", unitPrice: 200 },
  ];

  it("splits a single basket into per-supplier POs", () => {
    const pos = splitOrder(basket);
    expect(pos.size).toBe(2);
    expect(pos.get("maxab")!.lines).toHaveLength(2);
    expect(pos.get("maxab")!.totalEGP).toBe(500); // 3*100 + 1*200
    expect(pos.get("factory-x")!.totalEGP).toBe(100);
    expect(pos.get("maxab")!.packingSlipId).toMatch(/^PS-/);
  });

  it("creates temporary stock reservation locks", () => {
    const locks = createStockLocks(basket, "ORD-1", 15);
    expect(locks).toHaveLength(3);
    expect(locks[0].qtyLocked).toBe(3);
    expect(locks[0].untilMs).toBeGreaterThan(Date.now());
  });

  it("resolves partial fulfillment shortfall without crashing", () => {
    const { fulfilled, short } = resolveShortfall(
      [{ sku: "ATT-1", qty: 5 }, { sku: "ATT-2", qty: 4 }],
      { "ATT-1": 3, "ATT-2": 10 }
    );
    expect(fulfilled[0].qty).toBe(3);
    expect(short[0].qty).toBe(2);
    expect(fulfilled[1].qty).toBe(4);
  });
});

describe("Merchant of Record — unified ETA invoice + factoring", () => {
  it("builds a single unified ETA invoice across suppliers", () => {
    const invoice = buildUnifiedInvoice("ORD-X", [
      { sku: "ATT-1", qty: 2, unitPriceEGP: 100, taxPct: 14 },
      { sku: "ATT-2", qty: 1, unitPriceEGP: 50, taxPct: 14 },
    ]);
    expect(invoice.subtotal).toBe(250);
    expect(invoice.tax).toBe(35);
    expect(invoice.total).toBe(285);
    expect(invoice.lineRows).toBeUndefined; // shape-safe
  });

  it("triggers 48h Oliv payout with CHV000 promo", () => {
    const req = buildOlivPayoutRequest(1000, "ETA-ORD-X");
    expect(req.promo).toBe("CHV000");
    expect(req.settlement).toBe("48h");
    expect(req.amountEGP).toBe(1000);
  });
});

describe("rounding helper", () => {
  it("rounds to 2 decimal places", () => {
    expect(round2(0.1 + 0.2)).toBe(0.3);
    expect(round2(1.005)).toBe(1.01);
  });
});
