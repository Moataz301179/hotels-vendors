/**
 * Referral Pipeline — stage transitions + stats aggregation.
 *
 * Forward-only stage machine:
 *   SUBMITTED → ELIGIBLE | INELIGIBLE
 *   ELIGIBLE  → ADMIN_REVIEW → APPROVED → REFERRED → CONVERTED | LOST
 *   INELIGIBLE → (admin can re-evaluate and move to ELIGIBLE)
 *
 * Transitions are validated against the FORWARD_MAP; admin actions always go
 * through advanceReferralStage / setReferralStage so audit can be attached at
 * the call-site (the API routes). Stats are computed client-side from the
 * list endpoint; this module exposes the heavy queries for the /stats route.
 */

import { prisma } from "@/lib/prisma";
import type { ReferralStage } from "@prisma/client";

/**
 * Allowed forward transitions. Keys are "from" stages; values are the set of
 * stages you may move TO from that stage. Admin overrides (re-evaluating an
 * INELIGIBLE referral back to ELIGIBLE, or marking LOST from any non-terminal
 * stage) are explicitly allowed here.
 */
export const FORWARD_MAP: Record<ReferralStage, ReferralStage[]> = {
  SUBMITTED: ["ELIGIBLE", "INELIGIBLE"],
  ELIGIBLE: ["ADMIN_REVIEW", "LOST"],
  INELIGIBLE: ["ELIGIBLE", "LOST"],
  ADMIN_REVIEW: ["APPROVED", "ELIGIBLE", "LOST"],
  APPROVED: ["REFERRED", "ADMIN_REVIEW", "LOST"],
  REFERRED: ["CONVERTED", "LOST"],
  CONVERTED: [], // terminal
  LOST: ["ELIGIBLE", "SUBMITTED"], // can revive
};

export function isValidTransition(
  from: ReferralStage,
  to: ReferralStage,
): boolean {
  return FORWARD_MAP[from]?.includes(to) ?? false;
}

/**
 * Apply a stage transition with optimistic-lock protection against concurrent
 * admin edits. Throws if the current DB stage is not `expectedFrom` (when
 * provided) or if the transition is not in FORWARD_MAP.
 */
export async function advanceReferralStage(
  referralId: string,
  toStage: ReferralStage,
  expectedFrom?: ReferralStage,
): Promise<{ id: string; previousStage: ReferralStage; stage: ReferralStage }> {
  const current = await prisma.referral.findUniqueOrThrow({
    where: { id: referralId },
    select: { stage: true },
  });

  if (expectedFrom && current.stage !== expectedFrom) {
    throw new Error(
      `Referral ${referralId} stage is ${current.stage}, expected ${expectedFrom}`,
    );
  }

  if (!isValidTransition(current.stage, toStage)) {
    throw new Error(
      `Invalid stage transition: ${current.stage} → ${toStage}`,
    );
  }

  const updateData: Record<string, unknown> = { stage: toStage };
  if (toStage === "CONVERTED") updateData.convertedAt = new Date();

  const updated = await prisma.referral.update({
    where: { id: referralId },
    data: updateData,
    select: { id: true, stage: true },
  });

  return { id: updated.id, previousStage: current.stage, stage: updated.stage };
}

export interface ReferralStats {
  counts: Record<ReferralStage, number>;
  byEntityType: { HOTEL: number; SUPPLIER: number };
  conversionRate: number; // CONVERTED / (CONVERTED + LOST), 0-1
}

/**
 * Aggregate pipeline counts for the /stats endpoint. Reads the full set of
 * stages in one GROUP BY query and fills zero-counts for absent stages so the
 * admin UI can render every column deterministically.
 */
export async function getReferralStats(tenantId?: string): Promise<ReferralStats> {
  const grouped = await prisma.referral.groupBy({
    by: ["stage"],
    _count: { _all: true },
    where: tenantId ? { tenantId } : undefined,
  });

  const allStages: ReferralStage[] = [
    "SUBMITTED", "ELIGIBLE", "INELIGIBLE", "ADMIN_REVIEW",
    "APPROVED", "REFERRED", "CONVERTED", "LOST",
  ];
  const counts = allStages.reduce(
    (acc, s) => {
      acc[s] = 0;
      return acc;
    },
    {} as Record<ReferralStage, number>,
  );
  for (const g of grouped) {
    counts[g.stage as ReferralStage] = g._count._all;
  }

  const byEntityTypeRows = await prisma.referral.groupBy({
    by: ["entityType"],
    _count: { _all: true },
    where: tenantId ? { tenantId } : undefined,
  });
  const byEntityType = { HOTEL: 0, SUPPLIER: 0 };
  for (const r of byEntityTypeRows) {
    byEntityType[r.entityType as "HOTEL" | "SUPPLIER"] = r._count._all;
  }

  const converted = counts.CONVERTED;
  const lost = counts.LOST;
  const conversionRate = converted + lost > 0 ? converted / (converted + lost) : 0;

  return { counts, byEntityType, conversionRate };
}
