/**
 * Swarm Shared-Memory TENANT ISOLATION tests.
 * Proves: agent memory for tenant A is invisible to tenant B, and unscoped
 * access (missing tenantId) is rejected — never falls back to a shared bucket.
 * Run: npx vitest run tests/swarm-memory.spec.ts
 */

import { describe, it, expect } from "vitest";
import { storeMemory, retrieveMemory, listMemory, clearTenantMemory } from "@/lib/swarm/memory";

describe("swarm memory tenant isolation", () => {
  it("tenant A's memory is invisible to tenant B", async () => {
    await storeMemory("tenant-A", "rfq", "quote-1", { supplierId: "aaa", priceEGP: 450 });
    const b = await retrieveMemory("tenant-B", "rfq", "quote-1");
    expect(b).toBeNull(); // B must NOT see A's data
  });

  it("tenant can read its own memory back", async () => {
    await storeMemory("tenant-A", "rfq", "quote-2", { supplierId: "aaa", priceEGP: 610 });
    const a = await retrieveMemory<{ priceEGP: number }>("tenant-A", "rfq", "quote-2");
    expect(a?.priceEGP).toBe(610);
  });

  it("listMemory is scoped to a single tenant and namespace", async () => {
    await storeMemory("tenant-A", "catalog", "item-1", { sku: "x" });
    await storeMemory("tenant-C", "catalog", "item-1", { sku: "TOP-SECRET-C" });
    const aItems = await listMemory("tenant-A", "catalog");
    expect(aItems.length).toBeGreaterThan(0);
    // A's list must not contain tenant C's value
    const leaked = aItems.some((it) => (it.value as { sku?: string }).sku === "TOP-SECRET-C");
    expect(leaked).toBe(false);
  });

  it("rejects access without a tenantId (no shared bucket)", async () => {
    await expect(storeMemory(undefined as unknown as string, "x", "y", { v: 1 })).rejects.toThrow(/tenantId/);
    await expect(retrieveMemory("" as string, "x", "y")).rejects.toThrow(/tenantId/);
  });

  it("clearTenantMemory only removes that tenant", async () => {
    await storeMemory("tenant-A", "n", "a", { v: 1 });
    await storeMemory("tenant-B", "n", "b", { v: 2 });
    const removed = await clearTenantMemory("tenant-A");
    expect(removed).toBeGreaterThan(0);
    await expect(retrieveMemory("tenant-A", "n", "a")).resolves.toBeNull();
    expect(await retrieveMemory("tenant-B", "n", "b")).not.toBeNull();
  });
});
