/**
 * Hub-Revenue Calculator
 * Hotels Vendors Fintech Layer
 *
 * Automatically calculates platform fees, membership discounts, and risk surcharges.
 * Ensures the platform is paid FIRST from every factoring disbursement.
 */

import { HotelTier } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { RiskTier } from "./risk-engine";

// ─────────────────────────────────────────
// 1. CONFIGURATION
// ─────────────────────────────────────────

export interface HubRevenueConfig {
  basePlatformFeeRate: number;      // 0.025 = 2.5%
  primeDiscountRate: number;        // 0.50 = 50% off for PREMIER
  coastalSurchargeRate: number;     // 0.005 = +0.5%
  etaComplianceFeeRate: number;     // 0.003 = +0.3%
  highRiskSurchargeRate: number;    // 0.005 = +0.5%
  criticalRiskSurchargeRate: number;// 0.010 = +1.0%
}

const DEFAULT_CONFIG: HubRevenueConfig = {
  basePlatformFeeRate: 0.025,
  primeDiscountRate: 0.50,
  coastalSurchargeRate: 0.005,
  etaComplianceFeeRate: 0.003,
  highRiskSurchargeRate: 0.005,
  criticalRiskSurchargeRate: 0.010,
};

// ─────────────────────────────────────────
// 2. TYPES
// ─────────────────────────────────────────

export interface HubRevenueResult {
  // Inputs
  grossAmount: number;
  hotelTier: HotelTier;
  riskTier: RiskTier;
  isCoastal: boolean;
  partnerDiscountRate: number;
  advanceRate: number;
  membershipTier: "CORE" | "PREMIER";

  // Platform fee breakdown
  basePlatformFee: number;
  membershipDiscount: number;
  riskSurcharge: number;
  logisticsSurcharge: number;
  etaComplianceFee: number;
  netPlatformFee: number;
  platformFeeRate: number; // Effective rate

  // Partner fee
  factoringFee: number;

  // Disbursement
  supplierDisbursement: number;
  grossDisbursementBeforeFees: number; // grossAmount * advanceRate

  // Audit
  calculatedAt: Date;
  configVersion: string;
}

// ─────────────────────────────────────────
// 3. CALCULATION ENGINE
// ─────────────────────────────────────────

/**
 * Calculate hub revenue and supplier disbursement for a factoring transaction.
 *
 * INVARIANT: Platform fee is ALWAYS deducted BEFORE factoring partner fee.
 * This ensures the hub is paid first.
 *
 * SECURITY: All tier/risk inputs are validated against database state.
 * Never trust user-provided tier classifications.
 */
export async function calculateHubRevenue(params: {
  invoiceId: string;
  partnerDiscountRate: number;
  advanceRate: number;
  config?: Partial<HubRevenueConfig>;
}): Promise<HubRevenueResult> {
  // Fetch authoritative data from database — NEVER trust user input
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.invoiceId },
    include: { hotel: true },
  });

  if (!invoice) {
    throw new Error(`Invoice not found: ${params.invoiceId}`);
  }

  const hotel = invoice.hotel;
  const grossAmount = invoice.total;
  const hotelTier = hotel.tier;
  const riskTier = hotel.riskTier ?? "MEDIUM";
  const isCoastal = hotel.city.toLowerCase().includes("coast") ||
    hotel.governorate.toLowerCase().includes("matrouh") ||
    hotel.governorate.toLowerCase().includes("red sea");

  const {
    partnerDiscountRate,
    advanceRate,
    config: userConfig,
  } = params;

  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const membershipTier = hotelTier === "PREMIER" ? "PREMIER" : "CORE";

  // 1. Base platform fee
  const basePlatformFee = grossAmount * config.basePlatformFeeRate;

  // 2. Membership discount (PREMIER gets 50% off platform fee)
  let membershipDiscount = 0;
  if (membershipTier === "PREMIER") {
    membershipDiscount = basePlatformFee * config.primeDiscountRate;
  }

  // 3. Risk surcharge
  let riskSurcharge = 0;
  if (riskTier === "HIGH") {
    riskSurcharge = grossAmount * config.highRiskSurchargeRate;
  } else if (riskTier === "CRITICAL") {
    riskSurcharge = grossAmount * config.criticalRiskSurchargeRate;
  }

  // 4. Logistics surcharge (coastal)
  let logisticsSurcharge = 0;
  if (isCoastal) {
    logisticsSurcharge = grossAmount * config.coastalSurchargeRate;
  }

  // 5. ETA compliance fee
  const etaComplianceFee = grossAmount * config.etaComplianceFeeRate;

  // 6. Net platform fee
  const netPlatformFee = basePlatformFee - membershipDiscount + riskSurcharge + logisticsSurcharge + etaComplianceFee;

  // 7. Effective platform fee rate
  const platformFeeRate = grossAmount > 0 ? netPlatformFee / grossAmount : 0;

  // 8. Factoring partner fee
  const factoringFee = grossAmount * partnerDiscountRate;

  // 9. Gross disbursement (before any fees)
  const grossDisbursementBeforeFees = grossAmount * advanceRate;

  // 10. Net supplier disbursement
  // PLATFORM FEE IS DEDUCTED FIRST
  const supplierDisbursement = Math.max(0, grossDisbursementBeforeFees - netPlatformFee - factoringFee);

  return {
    grossAmount,
    hotelTier,
    riskTier,
    isCoastal,
    partnerDiscountRate,
    advanceRate,
    membershipTier,
    basePlatformFee,
    membershipDiscount,
    riskSurcharge,
    logisticsSurcharge,
    etaComplianceFee,
    netPlatformFee,
    platformFeeRate,
    factoringFee,
    supplierDisbursement,
    grossDisbursementBeforeFees,
    calculatedAt: new Date(),
    configVersion: "1.0",
  };
}

// ─────────────────────────────────────────
// 4. TCP (TOTAL COST OF PROCUREMENT) REPORT
// ─────────────────────────────────────────

export interface TcpReport {
  hotelId: string;
  hotelName: string;
  orderId: string;
  orderTotal: number;

  // Offline "cheaper" price
  offlinePrice: number;

  // Hidden costs
  costOfCapital: number;
  etaPenaltyRisk: number;
  logisticsFragmentation: number;
  storageWaste: number;
  disputeLosses: number;
  totalOfflineCost: number;

  // Platform price
  platformPrice: number;
  platformFee: number;
  factoringFee: number;
  netPlatformPrice: number;

  // Savings
  absoluteSavings: number;
  percentageSavings: number;

  // Narrative
  narrative: string;
}

/**
 * Generate a "Total Cost of Procurement" report for a hesitant hotel CFO.
 * Proves that the platform is cheaper than "cheaper" offline deals.
 */
export function generateTcpReport(params: {
  hotelId: string;
  hotelName: string;
  orderId: string;
  orderTotal: number;
  paymentTermsDays: number; // How long supplier waits offline
  hotelStorageCostMonthly: number; // EGP
  averageDisputeRate: number; // 0.05 = 5%
  etaPenaltyRate: number; // 0.025 = 2.5%
  supplierCostOfCapitalAnnual: number; // 0.20 = 20%
}): TcpReport {
  const {
    hotelId,
    hotelName,
    orderId,
    orderTotal,
    paymentTermsDays,
    hotelStorageCostMonthly,
    averageDisputeRate,
    etaPenaltyRate,
    supplierCostOfCapitalAnnual,
  } = params;

  // Offline price ("cheaper" on paper)
  const offlinePrice = orderTotal;

  // Hidden costs of offline procurement
  const costOfCapital = orderTotal * supplierCostOfCapitalAnnual * (paymentTermsDays / 365);
  const etaPenaltyRisk = orderTotal * etaPenaltyRate;
  const logisticsFragmentation = orderTotal * 0.042; // 4.2% average fragmentation cost
  const storageWaste = hotelStorageCostMonthly * 0.3; // 30% of monthly storage
  const disputeLosses = orderTotal * averageDisputeRate;

  const totalOfflineCost = offlinePrice + costOfCapital + etaPenaltyRisk + logisticsFragmentation + storageWaste + disputeLosses;

  // Platform price
  const platformFee = orderTotal * 0.025; // 2.5%
  const factoringFee = orderTotal * 0.02; // 2%
  const platformPrice = orderTotal + platformFee + factoringFee;
  const netPlatformPrice = platformPrice; // Total cost to hotel

  // Savings
  const absoluteSavings = totalOfflineCost - netPlatformPrice;
  const percentageSavings = totalOfflineCost > 0 ? (absoluteSavings / totalOfflineCost) * 100 : 0;

  const narrative = `
Your offline supplier quotes ${offlinePrice.toLocaleString()} EGP. 
But when you factor in the 90-day payment delay, your supplier is paying 
${costOfCapital.toFixed(0)} EGP in cost of capital — which they silently pass 
back to you through higher future prices. Add ETA compliance fines 
(${etaPenaltyRisk.toFixed(0)} EGP risk), fragmented delivery costs 
(${logisticsFragmentation.toFixed(0)} EGP), and storage waste 
(${storageWaste.toFixed(0)} EGP/month), and your TRUE offline cost is 
${totalOfflineCost.toLocaleString()} EGP.

With Hotels Vendors, you pay ${netPlatformPrice.toLocaleString()} EGP total 
(including our 2.5% fee + 2% factoring). That is a 
${percentageSavings.toFixed(1)}% savings — and your supplier gets paid 
within 48 hours, strengthening your relationship and future pricing power.
  `.trim();

  return {
    hotelId,
    hotelName,
    orderId,
    orderTotal,
    offlinePrice,
    costOfCapital,
    etaPenaltyRisk,
    logisticsFragmentation,
    storageWaste,
    disputeLosses,
    totalOfflineCost,
    platformPrice,
    platformFee,
    factoringFee,
    netPlatformPrice,
    absoluteSavings,
    percentageSavings,
    narrative,
  };
}
