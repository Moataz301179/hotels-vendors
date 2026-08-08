/**
 * Swarm Shared Memory — tenant-isolated inter-agent context store.
 *
 * SECURITY MODEL (HARD REQUIREMENT):
 * Every key is namespaced by tenantId. An agent for account T can ONLY read/write
 * keys under `hv:swarm:{tenantId}:*`. There is NO global/shared-by-default space.
 * A missing tenantId is rejected (never defaults to a shared bucket), so one
 * account's memory can never leak into another's.
 *
 * Backend: Redis when available (getRedis), in-memory fallback for build/test.
 * TTL on all entries — memory is ephemeral signal, not durable records.
 */

import { getRedis } from "@/lib/redis";

const TTL_SECONDS = 60 * 60 * 24; // 24h default

/** Strictly validate a tenantId. Rejects empty/undefined — never a shared bucket. */
function requireTenant(tenantId: string | undefined | null): string {
  if (!tenantId || typeof tenantId !== "string") {
    throw new Error("SwarmMemory: tenantId is required — refusing to access unscoped memory.");
  }
  return tenantId;
}

/** Memory key, namespaced by tenant. */
function key(tenantId: string, namespace: string, id: string): string {
  return `hv:swarm:${tenantId}:${namespace}:${id}`;
}

/* ── In-memory fallback map (used when Redis unavailable: build/test/local) ── */
const memFallback = new Map<string, { value: unknown; expiresAt: number }>();

/** Store a value in the tenant's agent-shared memory. */
export async function storeMemory(tenantId: string, namespace: string, id: string, value: unknown, ttlSeconds = TTL_SECONDS): Promise<void> {
  const tenant = requireTenant(tenantId);
  const k = key(tenant, namespace, id);
  const json = JSON.stringify({ v: value });
  const ttl = Math.max(ttlSeconds, 1);

  const r = getRedis();
  if (r) {
    try { await r.set(k, json, "EX", ttl); return; } catch { /* fall through to mem */ }
  }
  memFallback.set(k, { value, expiresAt: Date.now() + ttl * 1000 });
}

/** Retrieve a value previously stored by this or another agent of the SAME tenant. */
export async function retrieveMemory<T = unknown>(tenantId: string, namespace: string, id: string): Promise<T | null> {
  const tenant = requireTenant(tenantId);
  const k = key(tenant, namespace, id);

  const r = getRedis();
  if (r) {
    try {
      const raw = await r.get(k);
      if (raw === null) return null;
      return (JSON.parse(raw) as { v: T }).v;
    } catch { /* fall through */ }
  }
  const m = memFallback.get(k);
  if (!m) return null;
  if (m.expiresAt < Date.now()) { memFallback.delete(k); return null; }
  return m.value as T;
}

/** Read ALL namespaces/ids an agent wrote for a tenant (scoped). */
export async function listMemory(tenantId: string, namespace?: string): Promise<Array<{ namespace: string; id: string; value: unknown }>> {
  const tenant = requireTenant(tenantId);
  const out: Array<{ namespace: string; id: string; value: unknown }> = [];
  const prefix = `hv:swarm:${tenant}:`;

  const r = getRedis();
  if (r) {
    try {
      const keys = await r.keys(`${prefix}*`);
      for (const k of keys) {
        const raw = await r.get(k);
        if (raw === null) continue;
        const rest = k.slice(prefix.length); // namespace:id
        const sep = rest.indexOf(":");
        if (sep < 0) continue;
        const ns = rest.slice(0, sep);
        if (namespace && ns !== namespace) continue;
        out.push({ namespace: ns, id: rest.slice(sep + 1), value: (JSON.parse(raw) as { v: unknown }).v });
      }
      return out;
    } catch { /* fall through to mem */ }
  }
  for (const [k, m] of memFallback) {
    if (!k.startsWith(prefix)) continue;
    const rest = k.slice(prefix.length);
    const sep = rest.indexOf(":");
    if (sep < 0) continue;
    const ns = rest.slice(0, sep);
    if (namespace && ns !== namespace) continue;
    if (m.expiresAt < Date.now()) continue;
    out.push({ namespace: ns, id: rest.slice(sep + 1), value: m.value });
  }
  return out;
}

/** Delete a tenant's memory entries (e.g. account close). Namespaced, safe. */
export async function clearTenantMemory(tenantId: string): Promise<number> {
  const tenant = requireTenant(tenantId);
  const prefix = `hv:swarm:${tenant}:`;
  const r = getRedis();
  if (r) {
    try {
      const keys = await r.keys(`${prefix}*`);
      if (keys.length) await r.del(...keys);
      return keys.length;
    } catch { /* fall through */ }
  }
  let removed = 0;
  for (const k of [...memFallback.keys()]) {
    if (k.startsWith(prefix)) { memFallback.delete(k); removed++; }
  }
  return removed;
}
