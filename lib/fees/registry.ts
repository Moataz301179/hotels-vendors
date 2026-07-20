/**
 * Fee Registry — single source of truth for platform fees.
 *
 * Replaces the fragmented hardcoded rates across the codebase
 * (0.025, 0.02, 0.015, 0.005 — see migration inventory in
 * /docs/fee-unification.md). Factoring partner discount/advance
 * rates are NOT stored here — those are partner-sourced (Oliv's offer),
 * not platform-defined.
 *
 * Strategy:
 *   - DB-backed FeePolicy rows (admin-editable, no redeploy to change rates)
 *   - Module-level in-memory cache, 60s TTL → zero DB round-trips on hot path
 *   - Safe fallback defaults if DB is unreachable
 *   - `refreshFeeRegistry()` to bust the cache after admin edits a policy
 */

import { prisma } from "@/lib/prisma";

export type FeeType =
  | "MARKETPLACE_TRANSACTION"
  | "FACTORING_PLATFORM_DISCOUNT"
  | "ADVANCE_RATE";

/** Single declaration site for the Egyptian VAT rate (was duplicated at 0.14 across checkout + invoice schema). */
export const VAT_RATE = 0.14;

/**
 * Hard-coded fallbacks used only if the FeePolicy table is empty or unreachable.
 * Kept in sync with the seeded defaults in prisma/seed.ts.
 * These are SAFETY NET values — the DB is the source of truth when available.
 */
export const FALLBACK_FEE_BPS: Record<FeeType, number> = {
  MARKETPLACE_TRANSACTION: 200, // 2.00% — market-verified pilot default
  FACTORING_PLATFORM_DISCOUNT: 0, // partner-sourced, not platform-defined
  ADVANCE_RATE: 0, // partner-sourced
};

interface CachedRow {
  bps: number;
  riskBand: string | null;
}

const cache = new Map<FeeType, CachedRow[]>();
let cacheAt = 0;
const TTL_MS = 60_000;

async function loadPolicies(type: FeeType): Promise<CachedRow[]> {
  const now = new Date();
  const rows = await prisma.feePolicy.findMany({
    where: {
      type,
      active: true,
      effectiveFrom: { lte: now },
      OR: [{ effectiveTo: null }, { effectiveTo: { gt: now } }],
    },
    orderBy: { bps: "asc" },
    select: { bps: true, riskBand: true },
  });
  return rows.map((r) => ({ bps: r.bps, riskBand: r.riskBand }));
}

/**
 * Resolve the fee in basis points for a given type (and optional risk band
 * for tiered factoring discount/advance). Falls back to FALLBACK_FEE_BPS
 * if the DB returns no rows or is unreachable.
 */
export async function resolveFeeBps(
  type: FeeType,
  riskBand?: string,
): Promise<number> {
  // Cold or stale cache → reload
  if (Date.now() - cacheAt > TTL_MS || !cache.has(type)) {
    try {
      cache.set(type, await loadPolicies(type));
      cacheAt = Date.now();
    } catch {
      // DB unreachable — keep whatever's cached (or empty) and rely on fallback
      if (!cache.has(type)) cache.set(type, []);
    }
  }
  const rows = cache.get(type) ?? [];
  // Prefer a risk-band match; otherwise the lowest-bps row (first by orderBy)
  const match =
    (riskBand ? rows.find((r) => r.riskBand === riskBand) : null) ?? rows[0];
  if (match) return match.bps;
  return FALLBACK_FEE_BPS[type];
}

/** Same as resolveFeeBps but returned as a decimal rate (0.02 = 2%). */
export async function resolveFeeRate(
  type: FeeType,
  riskBand?: string,
): Promise<number> {
  return (await resolveFeeBps(type, riskBand)) / 10_000;
}

/**
 * Bust the in-memory cache. Call after an admin mutates a FeePolicy row
 * (the admin fees/CRUD routes call this) so the next read picks up the change
 * without waiting for the 60s TTL.
 */
export function refreshFeeRegistry(): void {
  cache.clear();
  cacheAt = 0;
}

/**
 * Convenience for the hot path — the platform marketplace transactional fee.
 * Use this everywhere we previously hard-coded 0.025 / 0.02 / 0.015 / 0.005
 * as the platform's cut of a marketplace transaction.
 */
export async function platformFeeRate(): Promise<number> {
  return resolveFeeRate("MARKETPLACE_TRANSACTION");
}

/**
 * Compute the platform fee amount for a given gross transaction value.
 * E.g. platformFeeAmount(100_000) → 2_000 at the 2% default.
 */
export async function platformFeeAmount(gross: number): Promise<number> {
  return Math.round(gross * (await platformFeeRate()));
}
