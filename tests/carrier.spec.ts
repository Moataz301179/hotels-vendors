/**
 * Carrier Logistics — integration tests (wired flow)
 * provider connect → quote/arbitrage → book shipment → advance stages → GRN reconcile
 *
 * Run: npx vitest run tests/carrier.spec.ts
 */

import { describe, it, expect } from "vitest";
import { getProvider, EGYPT_PROVIDERS, resolveProvider } from "@/lib/logistics/providers";
import { quoteCorridor, arbitrageBestRate } from "@/lib/logistics/cost-matrix";
import { ShipmentTracker, TRANSITIONS, ShipmentStage } from "@/lib/logistics/tracking";
import { reconcileGrn, accountabilityDecision, DEFAULT_TERMS, makeWaybillQr, verifyWaybillQr } from "@/lib/logistics/grn";

process.env.HOTELSVENDORS_HMAC_SECRET = "test-secret-for-carrier-tests";

describe("Egyptian provider registry", () => {
  it("should list only local-first providers including Bosta, Mylerz, 1Trolley, Naqla", () => {
    const ids = EGYPT_PROVIDERS.map((p) => p.id);
    expect(ids).toContain("bosta");
    expect(ids).toContain("mylerz");
    expect(ids).toContain("onetrolley");
    expect(ids).toContain("naqla");
    expect(ids).toContain("r2s");
    expect(ids).toContain("sprint");
  });

  it("should resolve a freight provider for resort corridors", () => {
    const p = resolveProvider(null, "Hurghada", false, ["bosta", "naqla"]);
    expect(p?.type).toBe("freight");
    expect(p?.id).toBe("naqla");
  });

  it("should resolve last-mile for urban cores", () => {
    const p = resolveProvider(null, "Cairo", false, ["bosta", "mylerz", "naqla"]);
    expect(p?.type).toBe("last_mile");
  });
});

describe("Cost-reduction matrix", () => {
  it("should discount more as parcel volume increases (consolidation)", () => {
    const small = quoteCorridor("Hurghada", 2, 10, "REGULAR", "naqla");
    const large = quoteCorridor("Hurghada", 20, 100, "REGULAR", "naqla");
    expect(large.savingsPercent).toBeGreaterThan(small.savingsPercent);
    expect(large.discountedTotal / large.parcels).toBeLessThan(small.discountedTotal / small.parcels);
  });

  it("should arbitrage to a connected provider and beat the standard rate", () => {
    const best = arbitrageBestRate("Hurghada", 100, 250, "REGULAR", ["bosta", "naqla", "onetrolley"], undefined);
    expect(best.discountedTotal).toBeGreaterThan(0);
    // Not Express — regular corridor chosen
    expect(best.service).toBe("REGULAR");
    // Absolute savings exists (discounted < standard)
    expect(best.discountedTotal).toBeLessThan(best.standardTotal);
  });

  it("should respect a preferred provider when given", () => {
    const best = arbitrageBestRate("Hurghada", 100, 250, "REGULAR", ["bosta", "naqla", "onetrolley"], "naqla");
    expect(best.providerId).toBe("naqla");
  });
});

describe("Shipment tracking state machine", () => {
  it("should allow a driver to pick up and transit", () => {
    const t = new ShipmentTracker({ stage: "CREATED", actor: "SYSTEM", actorId: "s", at: new Date().toISOString() });
    expect(t.advance("PICKUP_SCHEDULED", { role: "DISPATCHER", id: "d" })).toBe("PICKUP_SCHEDULED");
    expect(t.advance("PICKED_UP", { role: "DRIVER", id: "drv" })).toBe("PICKED_UP");
    expect(t.advance("IN_TRANSIT", { role: "DRIVER", id: "drv" })).toBe("IN_TRANSIT");
    expect(t.advance("ARRIVED_DOCK", { role: "DRIVER", id: "drv" })).toBe("ARRIVED_DOCK");
  });

  it("should reject unauthorized transitions", () => {
    const t = new ShipmentTracker({ stage: "CREATED", actor: "SYSTEM", actorId: "s", at: new Date().toISOString() });
    // A buyer cannot schedule pickup (only dispatcher/driver)
    expect(t.advance("PICKUP_SCHEDULED", { role: "BUYER", id: "b" })).toBeNull();
    // Jumping CREATED → IN_TRANSIT is illegal
    expect(t.advance("IN_TRANSIT", { role: "DISPATCHER", id: "d" })).toBeNull();
  });

  it("should record a full timeline", () => {
    const t = new ShipmentTracker({ stage: "PICKED_UP", actor: "DRIVER", actorId: "drv", at: new Date().toISOString() });
    t.advance("IN_TRANSIT", { role: "DRIVER", id: "drv" });
    t.advance("ARRIVED_DOCK", { role: "DRIVER", id: "drv" });
    t.advance("GOODS_RECEIVED", { role: "DOCK", id: "dock" });
    t.advance("COMPLETED", { role: "DOCK", id: "dock" });
    expect(t.timeline.map((e) => e.stage)).toEqual(["PICKED_UP", "IN_TRANSIT", "ARRIVED_DOCK", "GOODS_RECEIVED", "COMPLETED"]);
  });
});

describe("e-Waybill QR + GRN reconciliation", () => {
  it("should generate and verify a scannable e-Waybill QR", () => {
    const qr = makeWaybillQr("SHP-1", "EWB-1", "382-910-112", 3);
    expect(qr.startsWith("HVWB:")).toBe(true);
    const v = verifyWaybillQr(qr);
    expect(v.valid).toBe(true);
    expect(v.orderId).toBe("SHP-1");
  });

  it("should reject a tampered QR", () => {
    const qr = makeWaybillQr("SHP-1", "EWB-1", "382-910-112", 2);
    expect(verifyWaybillQr(qr + "x")).toMatchObject({ valid: false });
  });

  it("should flag damages and compute accountability", () => {
    const grn = reconcileGrn("SHP-1", [
      { sku: "LIN-001", expected: 200, received: 190, damageNote: "2 boxes water damaged" },
    ], "MAHMOUD", "QR_SCAN");
    expect(grn.discrepancies).toContain("SHORTAGE");
    expect(grn.discrepancies).toContain("DAMAGED");
    const acc = accountabilityDecision(grn, DEFAULT_TERMS);
    expect(acc.amount).toBeGreaterThan(0);
  });

  it("should clear carrier when no discrepancy", () => {
    const grn = reconcileGrn("SHP-1", [{ sku: "LIN-001", expected: 200, received: 200, damageNote: null }], "DOCK", "QR_SCAN");
    expect(grn.discrepancies).toHaveLength(0);
    const acc = accountabilityDecision(grn, DEFAULT_TERMS);
    expect(acc.liableParty).toBe("NONE");
  });
});
