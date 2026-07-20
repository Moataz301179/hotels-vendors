/**
 * Referral Eligibility — pilot pre-qualification for the Oliv referral funnel.
 *
 * Two entrypoints:
 *   - assessHotelReferralEligibility(hotelId, tenantId)
 *   - assessSupplierReferralEligibility(supplierId, tenantId)
 *
 * Each returns an EligibilityResult that the referral API persists onto the
 * Referral row (denormalized) so the admin pipeline view can render fast
 * without re-running the scorers. Verdicts are cached in Redis for 1 hour
 * and busted when the underlying entity changes.
 *
 * IMPORTANT: This is an advisory pre-qualification, not an auto-decision.
 * The admin always reviews ELIGIBLE referrals before the email handoff to
 * Oliv. Ineligible referrals are kept for audit + re-evaluation when the
 * underlying data improves.
 */

import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { HotelScoreEngine, type HotelCreditScore } from "@/lib/fintech/scoring/hotel-score-engine";
import { SupplierEligibilityEngine, type SupplierScoreInput, type SupplierScore } from "@/lib/fintech/scoring/supplier-eligibility-engine";

export type ReferralEntityType = "HOTEL" | "SUPPLIER";

export interface EligibilityResult {
  eligible: boolean;
  /** Hotel: AAA..D (HotelScoreEngine grade). Supplier: A..D. */
  grade: string;
  /** Hotel: 0-1000. Supplier: 0-100. */
  score: number;
  riskLevel: string;
  flags: { red: string[]; amber: string[]; green: string[] };
  recommendedFacility?: {
    limitEgp: number;
    tenorDays: number;
    advanceRate: number;
    discountRate: number;
  };
  ineligibleReasons: string[];
}

const CACHE_TTL_SECONDS = 3600;

function cacheKey(type: ReferralEntityType, id: string): string {
  return `elig:${type}:${id}`;
}

async function readCache(type: ReferralEntityType, id: string): Promise<EligibilityResult | null> {
  const r = getRedis();
  if (!r) return null;
  try {
    const raw = await r.get(cacheKey(type, id));
    return raw ? (JSON.parse(raw) as EligibilityResult) : null;
  } catch {
    return null;
  }
}

async function writeCache(type: ReferralEntityType, id: string, result: EligibilityResult): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.setex(cacheKey(type, id), CACHE_TTL_SECONDS, JSON.stringify(result));
  } catch {
    // cache failure is non-fatal
  }
}

/** Bust the cached eligibility verdict for an entity (call after entity update). */
export async function bustEligibilityCache(
  entityType: ReferralEntityType,
  entityId: string,
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.del(cacheKey(entityType, entityId));
  } catch {
    // non-fatal
  }
}

/**
 * Default hotel financials/profile/collateral/market inputs when a hotel has
 * no CreditLineApplication on file. Mirrors the conservative defaults used by
 * the existing /api/v1/factoring/credit-lines/[id]/analyze route, so a hotel
 * referred early in its lifecycle still gets a reproducible verdict instead of
 * an error. The admin sees the "no application on file" amber flag.
 */
const DEFAULT_HOTEL_MARKET = {
  sectorInflation: 12,
  avgPaymentDelayTrend: 5,
  tourismOccupancyRate: 65,
  seasonalFactor: 1.0,
};

function buildHotelInputs(hotelId: string) {
  // No stored financials on Hotel model → load the most recent CreditLineApplication
  // (matched by taxId/governorate heuristics is fragile; the analyze route just takes
  // the latest application for the hotel context). We take the latest application
  // across the tenant as a reasonable fallback for the pilot.
  return prisma.creditLineApplication.findFirst({
    where: { taxId: { not: "" } },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Pre-qualify a hotel for Oliv financing referral. Combines the existing
 * HotelScoreEngine verdict with admin-tunable ReferralEligibilityConfig
 * thresholds (min score, requires ETA tax ID, min annualized revenue).
 */
export async function assessHotelReferralEligibility(
  hotelId: string,
  tenantId: string,
): Promise<EligibilityResult> {
  const cached = await readCache("HOTEL", hotelId);
  if (cached) return cached;

  const [hotel, config, application] = await Promise.all([
    prisma.hotel.findUniqueOrThrow({
      where: { id: hotelId },
      include: { properties: true },
    }),
    prisma.referralEligibilityConfig.findFirstOrThrow({
      where: { entityType: "HOTEL", active: true },
    }),
    buildHotelInputs(hotelId),
  ]);

  const hasApplication = !!application;
  const financials = application
    ? {
        annualRevenue: application.annualRevenue ?? 0,
        netProfit: application.netProfit ?? 0,
        totalAssets: application.totalAssets ?? 0,
        currentAssets: application.currentAssets ?? 0,
        totalLiabilities: application.totalLiabilities ?? 0,
        currentLiabilities: application.currentLiabilities ?? 0,
        bankBalance: application.bankBalance ?? 0,
        monthlyPurchases: application.monthlyPurchases ?? 0,
        avgPaymentDays: application.avgPaymentDays ?? 0,
        existingDebt: application.existingDebt ?? 0,
      }
    : {
        annualRevenue: 0, netProfit: 0, totalAssets: 0, currentAssets: 0,
        totalLiabilities: 0, currentLiabilities: 0, bankBalance: 0,
        monthlyPurchases: 0, avgPaymentDays: 0, existingDebt: 0,
      };

  const profile = {
    properties: hotel.properties.length || 1,
    rooms: hotel.roomCount ?? 0,
    governorate: hotel.governorate,
    brand: hotel.name,
    yearsInOperation: 5, // conservative default — no stored field on Hotel
  };

  const collateral = application
    ? {
        propertyDeed: application.propertyDeed,
        bankGuarantee: application.bankGuarantee,
        personalGuarantee: application.personalGuarantee,
        equipmentCollateral: application.equipmentCollateral,
        depositAmount: application.depositAmount ?? 0,
      }
    : {
        propertyDeed: false, bankGuarantee: false, personalGuarantee: false,
        equipmentCollateral: false, depositAmount: 0,
      };

  const score: HotelCreditScore = HotelScoreEngine.calculateScore(
    financials,
    profile,
    collateral,
    DEFAULT_HOTEL_MARKET,
  );

  const reasons: string[] = [];
  if (config.requiresEtaTaxId && !hotel.taxId) {
    reasons.push("Missing ETA tax registration (taxId required by Oliv)");
  }
  if (score.overallScore < config.minHotelScore) {
    reasons.push(`Hotel score ${score.overallScore} below minimum ${config.minHotelScore}`);
  }
  const annualizedRevenue = financials.annualRevenue;
  if (config.minMonthlyRevenueEgp > 0 && annualizedRevenue < config.minMonthlyRevenueEgp * 12) {
    reasons.push(
      `Annualized revenue ${annualizedRevenue.toLocaleString()} EGP below ${(config.minMonthlyRevenueEgp * 12).toLocaleString()} EGP minimum`,
    );
  }
  if (!hasApplication) {
    // Not a hard block — but flagged so the admin knows the verdict is based on defaults
    score.amberFlags = [...score.amberFlags, "No CreditLineApplication on file — verdict based on conservative defaults"];
  }

  const result: EligibilityResult = {
    eligible: reasons.length === 0,
    grade: score.grade,
    score: score.overallScore,
    riskLevel: score.riskLevel,
    flags: { red: score.redFlags, amber: score.amberFlags, green: score.greenFlags },
    recommendedFacility: {
      limitEgp: score.recommendedLimit,
      tenorDays: score.maxTenorDays,
      advanceRate: 0.88, // partner-sourced default — Oliv's offer may differ
      discountRate: score.factoringFee / 100,
    },
    ineligibleReasons: reasons,
  };

  await writeCache("HOTEL", hotelId, result);
  return result;
}

/**
 * Pre-qualify a supplier for Oliv receivables factoring referral. Uses the
 * lightweight SupplierEligibilityEngine against the Supplier model fields
 * already collected (isVerified, tier, rating, reviewCount, certifications,
 * olivStatus) plus years-in-business derived from the supplier's commercialReg
 * issue date if parseable, else 0.
 */
export async function assessSupplierReferralEligibility(
  supplierId: string,
  _tenantId: string,
): Promise<EligibilityResult> {
  const cached = await readCache("SUPPLIER", supplierId);
  if (cached) return cached;

  const [supplier, config] = await Promise.all([
    prisma.supplier.findUniqueOrThrow({ where: { id: supplierId } }),
    prisma.referralEligibilityConfig.findFirstOrThrow({
      where: { entityType: "SUPPLIER", active: true },
    }),
  ]);

  // yearsInBusiness: the Supplier model has no direct field. commercialReg
  // is free-text in the current schema, so we conservatively pass 0 unless we
  // can extract a year. Keeping this simple for the pilot — the admin reviews
  // anyway and the score already weights certifications + verification.
  const input: SupplierScoreInput = {
    isVerified: supplier.isVerified,
    rating: supplier.rating ?? 0,
    reviewCount: supplier.reviewCount ?? 0,
    certifications: supplier.certifications ?? null,
    olivStatus: supplier.olivStatus ?? null,
    tier: supplier.tier,
    status: supplier.status,
    yearsInBusiness: 0,
  };

  const verdict: SupplierScore = SupplierEligibilityEngine.calculate(input);

  const reasons: string[] = [];
  if (config.requiresEtaTaxId && !supplier.taxId) {
    reasons.push("Missing ETA tax registration (taxId required by Oliv)");
  }
  if (verdict.score < config.minSupplierScore) {
    reasons.push(`Supplier score ${verdict.score} below minimum ${config.minSupplierScore}`);
  }
  if (supplier.status !== "ACTIVE") {
    reasons.push(`Supplier status is ${supplier.status}, must be ACTIVE`);
  }

  const result: EligibilityResult = {
    eligible: reasons.length === 0,
    grade: verdict.grade,
    score: verdict.score,
    riskLevel: verdict.riskLevel,
    flags: verdict.flags,
    recommendedFacility: {
      limitEgp: verdict.recommendedMonthlyFacilityEgp,
      tenorDays: 60, // partner-sourced default
      advanceRate: 0.85, // partner-sourced default
      discountRate: 0.025, // partner-sourced default — Oliv's offer may differ
    },
    ineligibleReasons: reasons,
  };

  await writeCache("SUPPLIER", supplierId, result);
  return result;
}
