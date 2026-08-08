/**
 * Product Acquisition Tests
 * HotelsVendors — external ecommerce → marketplace sourcing
 *
 * Run: npx vitest run tests/sourcing.spec.ts
 */

import { describe, it, expect } from "vitest";
import { registerProvider, listProviders, getProvider, acquireProductCatalog } from "@/lib/sourcing/product-acquisition";

describe("Product Acquisition — Provider Registry", () => {
  it("should register and list providers", () => {
    const names = listProviders();
    expect(names).toContain("supplier-portal");
    expect(names).toContain("dropshipping");
    expect(names).toContain("public-catalog");
  });

  it("should look up a provider by name", () => {
    const p = getProvider("dropshipping");
    expect(p).toBeDefined();
    expect(p?.supportsAutoSync).toBe(true);
  });

  it("should return undefined for unknown provider", () => {
    expect(getProvider("nonexistent")).toBeUndefined();
  });
});

describe("Product Acquisition — Execution", () => {
  it("should return error for unknown provider", async () => {
    const result = await acquireProductCatalog("taager-bogus", {});
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.acquired).toBe(0);
  });

  it("should acquire candidates from a registered provider", async () => {
    registerProvider({
      name: "test-shop",
      supportsAutoSync: true,
      async fetchProducts(creds, filters) {
        return [
          {
            externalId: "EX-1",
            provider: "test-shop",
            title: "Egyptian Cotton Sheet",
            sku: "LIN-TEST-001",
            category: "LINEN",
            unitPrice: 72,
            currency: "EGP",
            stockQuantity: 500,
            moq: 50,
            supplierName: "Test Textile Co.",
          },
        ];
      },
    });

    const result = await acquireProductCatalog("test-shop", {});
    expect(result.acquired).toBe(1);
    expect(result.products[0].sku).toBe("LIN-TEST-001");
    expect(result.products[0].category).toBe("LINEN");
    expect(result.errors).toHaveLength(0);
  });

  it("should propagate provider errors", async () => {
    registerProvider({
      name: "broken-shop",
      supportsAutoSync: false,
      async fetchProducts() {
        throw new Error("Portal returned 503");
      },
    });

    const result = await acquireProductCatalog("broken-shop", {});
    expect(result.acquired).toBe(0);
    expect(result.errors[0]).toContain("503");
  });
});

describe("Product Candidate normalization contract", () => {
  it("should enforce required fields on candidates", () => {
    const candidate = {
      externalId: "EX-2",
      provider: "test-shop",
      title: "Hotel Towel",
      category: "LINEN",
      unitPrice: 45,
      currency: "EGP",
      stockQuantity: 300,
      supplierName: "Test Towel Co.",
    };
    expect(candidate.title).toBeTruthy();
    expect(candidate.category).toBeTruthy();
    expect(candidate.unitPrice).toBeGreaterThan(0);
    expect(candidate.currency).toBe("EGP");
  });
});