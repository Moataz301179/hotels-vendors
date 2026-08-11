/**
 * Swarm Shared-Memory layer.
 *
 * TENANT-ISOLATED by design: every entry is keyed under a tenantId. Cross-tenant
 * access is impossible (lookups are always scoped), and unscoped access (missing
 * or empty tenantId) is REJECTED — it never falls back to a shared bucket.
 *
 * This in-memory store backs the agent-control plane at runtime and is the unit
 * under test for tenant isolation. It implements the same API shape used by the
 * hybrid Prisma+Redis hot-cache layer so the control plane can swap in a durable
 * backend without changing callers.
 */

type MemoryValue = Record<string, unknown> | string | number | boolean | null;

interface MemoryEntry {
  key: string;
  value: MemoryValue;
  createdAt: number;
}

// storeMap: tenantId -> (namespace -> Map(key -> entry))
const storeMap = new Map<string, Map<string, Map<string, MemoryEntry>>>();

function requireTenantId(tenantId: string): void {
  if (typeof tenantId !== "string" || tenantId.trim() === "") {
    throw new Error("tenantId is required — unscoped access is not allowed");
  }
}

function namespaceFor(tenantId: string): Map<string, Map<string, MemoryEntry>> {
  let tenant = storeMap.get(tenantId);
  if (!tenant) {
    tenant = new Map<string, Map<string, MemoryEntry>>();
    storeMap.set(tenantId, tenant);
  }
  return tenant;
}

/**
 * Store a value under (tenantId, namespace, key). Throws if tenantId is empty.
 */
export async function storeMemory(
  tenantId: string,
  namespace: string,
  key: string,
  value: MemoryValue
): Promise<void> {
  requireTenantId(tenantId);
  const tenant = namespaceFor(tenantId);

  let ns = tenant.get(namespace);
  if (!ns) {
    ns = new Map<string, MemoryEntry>();
    tenant.set(namespace, ns);
  }
  ns.set(key, { key, value, createdAt: Date.now() });
}

/**
 * Retrieve a single value by (tenantId, namespace, key). Returns null when the
 * key does not exist for THIS tenant (never another tenant's data). Throws if
 * tenantId is empty.
 */
export async function retrieveMemory<T = MemoryValue>(
  tenantId: string,
  namespace: string,
  key: string
): Promise<T | null> {
  requireTenantId(tenantId);
  const tenant = storeMap.get(tenantId);
  const entry = tenant?.get(namespace)?.get(key);
  if (!entry) return null;
  return entry.value as T;
}

/**
 * List all entries under (tenantId, namespace), scoped to that tenant only.
 * Each item exposes `{ key, value }`. Throws if tenantId is empty.
 */
export async function listMemory<T = MemoryValue>(
  tenantId: string,
  namespace: string
): Promise<Array<{ key: string; value: T }>> {
  requireTenantId(tenantId);
  const tenant = storeMap.get(tenantId);
  const ns = tenant?.get(namespace);
  if (!ns) return [];
  return Array.from(ns.values()).map((e) => ({ key: e.key, value: e.value as T }));
}

/**
 * Remove every entry belonging to a single tenant (all namespaces/keys).
 * Returns the number of entries removed. Never touches other tenants.
 */
export async function clearTenantMemory(tenantId: string): Promise<number> {
  requireTenantId(tenantId);
  const tenant = storeMap.get(tenantId);
  if (!tenant) return 0;

  let count = 0;
  for (const ns of tenant.values()) count += ns.size;
  storeMap.delete(tenantId);
  return count;
}

/** Reset the whole in-memory store. Primarily for tests; safe in non-prod. */
export function _resetMemory(): void {
  storeMap.clear();
}