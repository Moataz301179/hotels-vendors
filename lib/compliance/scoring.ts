/**
 * Company Scoring Service
 * Manages credit and compliance scores from external sources
 * (I-Score, D&B, GAFI, manual entry, platform internal).
 *
 * These scores feed into the factoring risk engine.
 */

import { prisma } from "@/lib/prisma";
import type { ScoreSource, RiskTier } from "@prisma/client";

export interface ScoreInput {
  supplierId: string;
  source: ScoreSource;
  sourceRef?: string;
  scoreValue: number;
  scoreLabel?: string;
  riskTier?: RiskTier;
  creditLimit?: number;
  reportUrl?: string;
  rawData?: Record<string, unknown>;
  expiresAt?: Date;
  tenantId: string;
}

/**
 * Record a new company score for a supplier.
 */
export async function recordCompanyScore(input: ScoreInput) {
  const score = await prisma.companyScore.create({
    data: {
      supplierId: input.supplierId,
      source: input.source,
      sourceRef: input.sourceRef,
      scoreValue: Math.max(0, Math.min(100, input.scoreValue)),
      scoreLabel: input.scoreLabel,
      riskTier: input.riskTier,
      creditLimit: input.creditLimit,
      reportUrl: input.reportUrl,
      rawData: input.rawData ? JSON.stringify(input.rawData) : null,
      expiresAt: input.expiresAt,
      tenantId: input.tenantId,
    },
  });

  // Fire-and-forget notification (don't block on it)
  import("./notifications").then(({ notifyOnScoreChange }) => {
    notifyOnScoreChange(input.supplierId, input.tenantId, {
      scoreValue: score.scoreValue,
      riskTier: score.riskTier,
      source: score.source,
    }).catch(() => {});
  });

  return score;
}

/**
 * Get the latest score for a supplier from a specific source.
 */
export async function getLatestScore(supplierId: string, source?: ScoreSource) {
  return prisma.companyScore.findFirst({
    where: {
      supplierId,
      ...(source && { source }),
    },
    orderBy: { assessedAt: "desc" },
  });
}

/**
 * Get all scores for a supplier.
 */
export async function getSupplierScores(supplierId: string) {
  return prisma.companyScore.findMany({
    where: { supplierId },
    orderBy: { assessedAt: "desc" },
  });
}

/**
 * Get the composite score for factoring decisions.
 * Blends external scores with platform internal metrics.
 */
export async function getCompositeScore(supplierId: string): Promise<{
  compositeScore: number;
  riskTier: RiskTier;
  factors: {
    externalScore: number | null;
    platformScore: number | null;
    etaComplianceScore: number;
    transactionHistoryScore: number;
  };
}> {
  const [latestExternal, latestInternal, supplier] = await Promise.all([
    getLatestScore(supplierId),
    getLatestScore(supplierId, "PLATFORM_INTERNAL"),
    prisma.supplier.findUnique({
      where: { id: supplierId },
      include: {
        Invoice: { where: { status: { in: ["PAID", "SUBMITTED"] } } },
        Order: true,
      },
    }),
  ]);

  // Platform internal score based on transaction history
  let transactionHistoryScore = 50; // neutral baseline
  if (supplier) {
    const paidInvoices = supplier.Invoice.filter((i) => i.status === "PAID").length;
    const totalInvoices = supplier.Invoice.length;
    const totalOrders = supplier.Order.length;

    if (totalOrders > 0) {
      transactionHistoryScore = Math.min(100, 40 + paidInvoices * 10 + totalOrders * 2);
    }
  }

  // ETA compliance score
  const etaComplianceScore = supplier?.complianceStatus === "APPROVED" ? 100 : 30;

  // Weighted composite
  const externalScore = latestExternal?.scoreValue ?? null;
  const platformScore = latestInternal?.scoreValue ?? null;

  let composite = 50;
  if (externalScore !== null && platformScore !== null) {
    composite = externalScore * 0.4 + platformScore * 0.3 + transactionHistoryScore * 0.15 + etaComplianceScore * 0.15;
  } else if (externalScore !== null) {
    composite = externalScore * 0.5 + transactionHistoryScore * 0.25 + etaComplianceScore * 0.25;
  } else if (platformScore !== null) {
    composite = platformScore * 0.5 + transactionHistoryScore * 0.25 + etaComplianceScore * 0.25;
  } else {
    composite = transactionHistoryScore * 0.5 + etaComplianceScore * 0.5;
  }

  composite = Math.round(Math.max(0, Math.min(100, composite)));

  // Map to risk tier (lower score = better/riskier? let's say higher = better)
  // Actually for credit: higher score = lower risk
  let riskTier: RiskTier = "MEDIUM";
  if (composite >= 80) riskTier = "LOW";
  else if (composite >= 60) riskTier = "MEDIUM";
  else if (composite >= 40) riskTier = "HIGH";
  else riskTier = "CRITICAL";

  return {
    compositeScore: composite,
    riskTier,
    factors: {
      externalScore,
      platformScore,
      etaComplianceScore,
      transactionHistoryScore,
    },
  };
}

/**
 * Delete old expired scores to keep DB clean.
 */
export async function purgeExpiredScores(tenantId: string, beforeDate: Date) {
  const { count } = await prisma.companyScore.deleteMany({
    where: {
      tenantId,
      expiresAt: { lt: beforeDate },
    },
  });
  return count;
}
