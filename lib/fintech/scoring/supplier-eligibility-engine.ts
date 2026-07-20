/**
 * Supplier Eligibility Engine
 *
 * Lightweight pre-qualification scoring for suppliers being referred to Oliv
 * for receivables factoring. Mirrors the HotelScoreEngine output shape
 * (`HotelCreditScore`) but on a 0-100 scale, since suppliers on this platform
 * do not have hotel-grade financial statements stored — the inputs we DO have
 * (isVerified, tier, rating, reviewCount, certifications, years in business,
 * olivStatus) are sufficient for a pilot-grade referral filter.
 *
 * This engine is deliberately conservative: it never auto-approves a referral.
 * Its verdict is an advisory pre-qualification — the admin still reviews every
 * eligible referral before the email handoff to Oliv (see lib/referral/handoff.ts).
 */

export interface SupplierScoreInput {
  /** Passed platform verification (admin-reviewed docs). */
  isVerified: boolean;
  /** Average platform rating, 0-5. */
  rating: number;
  /** Number of platform reviews/orders behind the rating. */
  reviewCount: number;
  /** Free-text certifications blob (ISO/BPOM/HACCP etc.) — non-null counts. */
  certifications?: string | null;
  /** Existing Oliv onboarding state, if any. NOT_STARTED counts as none. */
  olivStatus?: string | null;
  /** Supplier tier enum string. */
  tier: string;
  /** Supplier status enum string (PENDING|ACTIVE|SUSPENDED|REJECTED). */
  status: string;
  /** Years operating (from commercialReg issue date or self-declared). 0 if unknown. */
  yearsInBusiness?: number;
}

export type SupplierGrade = "A" | "B" | "C" | "D";
export type SupplierRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

export interface SupplierScore {
  /** 0-100 composite score. */
  score: number;
  grade: SupplierGrade;
  riskLevel: SupplierRiskLevel;
  flags: {
    red: string[];
    amber: string[];
    green: string[];
  };
  /** Indicative monthly receivables facility the supplier could support. */
  recommendedMonthlyFacilityEgp: number;
}

/**
 * The maximum recommended facility a supplier can factor through Oliv per
 * month at the top grade. Scales down with the score band.
 */
const FACILITY_CEIL_EGP = 2_000_000;

export class SupplierEligibilityEngine {
  /**
   * Compute a 0-100 supplier eligibility score.
   *
   * Weighting (adds up to 100 when all positive signals present):
   *   verification  25  (admin-verified docs)
   *   active status 15
   *   tier          15  (VERIFIED/PREMIER > CORE)
   *   rating        20  (up to 5★ × 4)
   *   review count  10  (≥10 reviews)
   *   certifications 15
   *   years in biz  10  (≥2 years)
   *   oliv history  +green flag (no score — informational)
   */
  static calculate(s: SupplierScoreInput): SupplierScore {
    const flags = { red: [] as string[], amber: [] as string[], green: [] as string[] };
    let score = 0;

    // Verification
    if (s.isVerified) {
      score += 25;
      flags.green.push("Platform-verified supplier");
    } else {
      flags.amber.push("Supplier not yet platform-verified");
    }

    // Status
    if (s.status === "ACTIVE") {
      score += 15;
    } else if (s.status === "PENDING") {
      flags.amber.push("Supplier pending admin approval");
    } else {
      flags.red.push(`Supplier status is ${s.status}`);
    }

    // Tier
    if (s.tier === "VERIFIED" || s.tier === "PREMIER") {
      score += 15;
      flags.green.push(`${s.tier} tier supplier`);
    } else if (s.tier === "CORE") {
      score += 8;
    } else {
      flags.amber.push(`Low tier: ${s.tier}`);
    }

    // Rating (0-5 → up to 20)
    const ratingContribution = Math.min(20, Math.max(0, s.rating) * 4);
    score += ratingContribution;
    if (s.rating >= 4) flags.green.push(`Strong rating (${s.rating.toFixed(1)}★)`);
    else if (s.rating > 0 && s.rating < 3) flags.amber.push(`Low rating (${s.rating.toFixed(1)}★)`);

    // Review count
    if (s.reviewCount > 10) {
      score += 10;
      flags.green.push(`${s.reviewCount} platform reviews`);
    } else if (s.reviewCount > 0) {
      flags.amber.push(`Only ${s.reviewCount} platform reviews`);
    }

    // Certifications
    if (s.certifications && s.certifications.trim().length > 0) {
      score += 15;
      flags.green.push("Holds industry certifications");
    } else {
      flags.amber.push("No certifications on file");
    }

    // Years in business
    if (s.yearsInBusiness && s.yearsInBusiness >= 2) {
      score += 10;
    } else {
      flags.amber.push("Less than 2 years operating history");
    }

    // Oliv history — informational only (no score impact; would create circular bias)
    if (s.olivStatus && s.olivStatus !== "NOT_STARTED") {
      flags.green.push(`Prior Oliv relationship (${s.olivStatus})`);
    }

    score = Math.min(100, Math.max(0, score));

    const grade: SupplierGrade =
      score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : "D";
    const riskLevel: SupplierRiskLevel =
      score >= 75 ? "LOW" : score >= 55 ? "MEDIUM" : score >= 35 ? "HIGH" : "VERY_HIGH";

    const recommendedMonthlyFacilityEgp =
      score >= 75 ? FACILITY_CEIL_EGP
      : score >= 55 ? Math.round(FACILITY_CEIL_EGP * 0.375) // 750k
      : 0; // Grade D → not eligible for a recommended facility

    return { score, grade, riskLevel, flags, recommendedMonthlyFacilityEgp };
  }
}
