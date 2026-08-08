import { describe, expect, it, vi } from "vitest";

// Mock prisma — these tests only test pure functions
vi.mock("@/lib/prisma", () => ({
  prisma: {
    supplier: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}));

import {
  deriveOlivStatusFromFacilityEvent,
  deriveOlivStatusFromPayoutStatus,
} from "@/lib/fintech/oliv-status-sync";

describe("deriveOlivStatusFromPayoutStatus", () => {
  it("maps successful payout states to ACTIVE", () => {
    expect(deriveOlivStatusFromPayoutStatus("APPROVED")).toBe("ACTIVE");
    expect(deriveOlivStatusFromPayoutStatus("DISBURSED")).toBe("ACTIVE");
    expect(deriveOlivStatusFromPayoutStatus("SETTLED")).toBe("ACTIVE");
  });

  it("passes through failure payout states", () => {
    expect(deriveOlivStatusFromPayoutStatus("REJECTED")).toBe("REJECTED");
    expect(deriveOlivStatusFromPayoutStatus("DEFAULTED")).toBe("DEFAULTED");
  });

  it("ignores unknown payout states", () => {
    expect(deriveOlivStatusFromPayoutStatus("PENDING")).toBeNull();
  });
});

describe("deriveOlivStatusFromFacilityEvent", () => {
  it("marks approved and updated facilities as ACTIVE", () => {
    expect(deriveOlivStatusFromFacilityEvent("credit_facility.approved")).toBe("ACTIVE");
    expect(deriveOlivStatusFromFacilityEvent("credit_facility.updated")).toBe("ACTIVE");
  });

  it("marks suspended facilities as SUSPENDED", () => {
    expect(deriveOlivStatusFromFacilityEvent("credit_facility.suspended")).toBe("SUSPENDED");
  });

  it("ignores unrelated events", () => {
    expect(deriveOlivStatusFromFacilityEvent("funding.disbursed")).toBeNull();
  });
});
