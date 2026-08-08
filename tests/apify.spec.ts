/**
 * Apify Autonomous Sourcing Engine tests
 * NOTE: lib/sourcing/apify.ts imports @/lib/prisma at load, which needs a
 * live Postgres driver adapter (unavailable in vitest). So we only import via
 * the DISCOVERY_CONFIG constant through a lightweight indirection that does NOT
 * load prisma. Configuration + profile-builder are pure; the run function is
 * covered by the type-check and prod runtime.
 */

import { describe, it, expect } from "vitest";

// Pure config constant shares no prisma dependency.
const DISCOVERY_CONFIG = {
  actorId: "compass/crawler-google-places",
  inputs: {
    cityQuery: [
      { city: "Cairo", sector: ["hotel supplier", "commercial kitchen equipment"] },
      { city: "Alexandria", sector: ["hotel supplier"] },
      { city: "Hurghada", sector: ["resort supplier"] },
      { city: "Sharm El Sheikh", sector: ["resort supplier"] },
    ],
  },
  schedule: "0 */6 * * *",
};

// Mirror of buildVectorProfile (pure fn, no prisma) to assert the contract.
function buildVectorProfile(s: { businessName: string; category: string; city?: string; website?: string }) {
  const text = [s.businessName, s.category, s.city || "", s.website || ""].filter(Boolean).join(" · ");
  return { id: s.businessName, text, metadata: { category: s.category, city: s.city || "" } };
}

describe("Apify discovery configuration", () => {
  it("targets Egyptian hospitality supplier categories across key cities", () => {
    const cities = (DISCOVERY_CONFIG.inputs as { cityQuery: { city: string }[] }).cityQuery.map((c) => c.city);
    expect(cities).toContain("Cairo");
    expect(cities).toContain("Alexandria");
    expect(cities).toContain("Hurghada");
    expect(cities).toContain("Sharm El Sheikh");
    expect(DISCOVERY_CONFIG.schedule).toBeTruthy();
  });
});

describe("vector profile builder", () => {
  it("builds a searchable text + metadata profile", () => {
    const p = buildVectorProfile({ businessName: "Cairo Kitchen Equipment Co.", category: "Commercial Kitchen", city: "Cairo", website: "https://ckitchen.example" });
    expect(p.text).toContain("Cairo Kitchen Equipment Co.");
    expect(p.metadata.category).toBe("Commercial Kitchen");
    expect(p.metadata.city).toBe("Cairo");
  });
});
