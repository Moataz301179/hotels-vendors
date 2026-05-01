/**
 * Financial Simulator — Unit Economics + ROI Engine
 * Hotels Vendors Finance Layer
 *
 * Calculates real-time Platform Yield minus API/Infra costs.
 * Proves unit economics before UI is rendered.
 */

import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────
// 1. COST MODEL
// ─────────────────────────────────────────

export interface PlatformCostModel {
  // Fixed costs (monthly)
  vercelPro: number;           // 20 USD
  database: number;            // 15 USD (Neon/Supabase)
  monitoring: number;          // 10 USD
  emailService: number;        // 5 USD
  totalFixedMonthly: number;

  // Variable costs (per transaction)
  etaApiCall: number;          // 0.001 USD per invoice
  paymobFee: number;           // 0.025 USD per deposit transaction
  aiInference: number;         // 0.003 USD per AI request
  smsCost: number;             // 0.02 USD per SMS
  totalVariablePerTransaction: number;
}

const DEFAULT_COST_MODEL: PlatformCostModel = {
  vercelPro: 20,
  database: 15,
  monitoring: 10,
  emailService: 5,
  totalFixedMonthly: 50,
  etaApiCall: 0.001,
  paymobFee: 0.025,
  aiInference: 0.003,
  smsCost: 0.02,
  totalVariablePerTransaction: 0.049,
};

// ─────────────────────────────────────────
// 2. REVENUE MODEL
// ─────────────────────────────────────────

export interface RevenueStream {
  transactionFees: number;     // 1.5-2.5% of GMV
  supplierSubscriptions: number; // Monthly subscription tiers
  sponsoredListings: number;   // Pay-per-click or featured placement
  logisticsMarkup: number;     // 5-10% on shipping
  factoringSpread: number;     // Platform share of factoring fee
  etaComplianceSaaS: number;   // Monthly fee for ETA handling
  dataInsights: number;        // Premium analytics reports
}

// ─────────────────────────────────────────
// 3. SIMULATION RESULTS
// ─────────────────────────────────────────

export interface UnitEconomicsResult {
  // Time period
  period: { start: Date; end: Date };

  // Volume
  totalOrders: number;
  totalGMV: number;            // Gross Merchandise Value
  totalInvoices: number;
  totalFactoredInvoices: number;

  // Revenue
  revenue: RevenueStream;
  totalRevenue: number;

  // Costs
  fixedCosts: number;
  variableCosts: number;
  totalCosts: number;

  // Profitability
  grossProfit: number;
  netProfit: number;
  grossMargin: number;
  netMargin: number;

  // Per-unit economics
  revenuePerOrder: number;
  costPerOrder: number;
  profitPerOrder: number;

  // Break-even
  breakEvenOrdersPerMonth: number;
  breakEvenGMVPerMonth: number;

  // LTV / CAC (simulated)
  estimatedLTV: number;
  estimatedCAC: number;
  ltvCacRatio: number;

  // ROI metrics
  roi: number;
  paybackMonths: number;
}

// ─────────────────────────────────────────
// 4. SIMULATION ENGINE
// ─────────────────────────────────────────

/**
 * Run unit economics simulation for a given period.
 */
export async function simulateUnitEconomics(params: {
  startDate: Date;
  endDate: Date;
  costModel?: Partial<PlatformCostModel>;
}): Promise<UnitEconomicsResult> {
  const { startDate, endDate, costModel: customCostModel } = params;
  const costModel = { ...DEFAULT_COST_MODEL, ...customCostModel };

  // Fetch data
  const [orders, invoices, factoredInvoices] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: startDate, lte: endDate }, status: { not: "CANCELLED" } },
      select: { total: true, status: true },
    }),
    prisma.invoice.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { total: true, factoringStatus: true },
    }),
    prisma.invoice.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        factoringStatus: { in: ["ACCEPTED", "PAID"] },
      },
      select: { total: true },
    }),
  ]);

  const totalOrders = orders.length;
  const totalGMV = orders.reduce((s, o) => s + o.total, 0);
  const totalInvoices = invoices.length;
  const totalFactoredInvoices = factoredInvoices.length;
  const factoredAmount = factoredInvoices.reduce((s, i) => s + i.total, 0);

  // Revenue calculation
  const revenue: RevenueStream = {
    transactionFees: totalGMV * 0.02, // Average 2%
    supplierSubscriptions: totalOrders > 0 ? 500 : 0, // Simplified
    sponsoredListings: totalOrders * 0.5,
    logisticsMarkup: totalGMV * 0.02, // 2% logistics markup
    factoringSpread: factoredAmount * 0.005, // 0.5% of factored value
    etaComplianceSaaS: totalInvoices * 2, // 2 EGP per invoice
    dataInsights: totalOrders > 100 ? 200 : 0,
  };

  const totalRevenue = Object.values(revenue).reduce((s, v) => s + v, 0);

  // Costs
  const months = Math.max(1, (endDate.getTime() - startDate.getTime()) / (30 * 24 * 60 * 60 * 1000));
  const fixedCosts = costModel.totalFixedMonthly * months;
  const variableCosts = totalOrders * costModel.totalVariablePerTransaction;
  const totalCosts = fixedCosts + variableCosts;

  // Profitability
  const grossProfit = totalRevenue - variableCosts;
  const netProfit = totalRevenue - totalCosts;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Per-unit
  const revenuePerOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const costPerOrder = totalOrders > 0 ? totalCosts / totalOrders : 0;
  const profitPerOrder = totalOrders > 0 ? netProfit / totalOrders : 0;

  // Break-even
  const breakEvenOrdersPerMonth = revenuePerOrder > 0
    ? Math.ceil(costModel.totalFixedMonthly / (revenuePerOrder - costModel.totalVariablePerTransaction))
    : 0;
  const breakEvenGMVPerMonth = breakEvenOrdersPerMonth > 0 && totalOrders > 0
    ? (totalGMV / totalOrders) * breakEvenOrdersPerMonth
    : 0;

  // LTV / CAC (simplified model)
  const estimatedLTV = profitPerOrder * 24; // 24-month lifetime
  const estimatedCAC = 50; // Estimated cost to acquire one hotel
  const ltvCacRatio = estimatedCAC > 0 ? estimatedLTV / estimatedCAC : 0;

  // ROI
  const roi = totalCosts > 0 ? ((totalRevenue - totalCosts) / totalCosts) * 100 : 0;
  const paybackMonths = netProfit > 0 ? estimatedCAC / (netProfit / months) : 0;

  return {
    period: { start: startDate, end: endDate },
    totalOrders,
    totalGMV,
    totalInvoices,
    totalFactoredInvoices,
    revenue,
    totalRevenue,
    fixedCosts,
    variableCosts,
    totalCosts,
    grossProfit,
    netProfit,
    grossMargin,
    netMargin,
    revenuePerOrder,
    costPerOrder,
    profitPerOrder,
    breakEvenOrdersPerMonth,
    breakEvenGMVPerMonth,
    estimatedLTV,
    estimatedCAC,
    ltvCacRatio,
    roi,
    paybackMonths,
  };
}

// ─────────────────────────────────────────
// 5. SCENARIO SIMULATOR
// ─────────────────────────────────────────

export interface ScenarioParams {
  name: string;
  hotelCount: number;
  supplierCount: number;
  avgMonthlyGMVPerHotel: number;
  platformFeeRate: number;
  factoringPenetration: number; // % of invoices factored
  logisticsMarkupRate: number;
  months: number;
}

export async function simulateScenario(params: ScenarioParams): Promise<UnitEconomicsResult> {
  const { name, hotelCount, supplierCount, avgMonthlyGMVPerHotel, platformFeeRate, factoringPenetration, logisticsMarkupRate, months } = params;

  const totalGMV = hotelCount * avgMonthlyGMVPerHotel * months;
  const totalOrders = Math.floor(totalGMV / 5000); // Avg order ~5K EGP
  const totalInvoices = totalOrders;
  const totalFactoredInvoices = Math.floor(totalInvoices * factoringPenetration);
  const factoredAmount = (totalGMV * factoringPenetration);

  const revenue: RevenueStream = {
    transactionFees: totalGMV * platformFeeRate,
    supplierSubscriptions: supplierCount * 100 * months, // 100 EGP/month per supplier
    sponsoredListings: totalOrders * 0.5,
    logisticsMarkup: totalGMV * logisticsMarkupRate,
    factoringSpread: factoredAmount * 0.005,
    etaComplianceSaaS: totalInvoices * 2,
    dataInsights: hotelCount > 10 ? hotelCount * 50 * months : 0,
  };

  const totalRevenue = Object.values(revenue).reduce((s, v) => s + v, 0);
  const fixedCosts = DEFAULT_COST_MODEL.totalFixedMonthly * months;
  const variableCosts = totalOrders * DEFAULT_COST_MODEL.totalVariablePerTransaction;
  const totalCosts = fixedCosts + variableCosts;

  return {
    period: { start: new Date(), end: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000) },
    totalOrders,
    totalGMV,
    totalInvoices,
    totalFactoredInvoices,
    revenue,
    totalRevenue,
    fixedCosts,
    variableCosts,
    totalCosts,
    grossProfit: totalRevenue - variableCosts,
    netProfit: totalRevenue - totalCosts,
    grossMargin: totalRevenue > 0 ? ((totalRevenue - variableCosts) / totalRevenue) * 100 : 0,
    netMargin: totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0,
    revenuePerOrder: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    costPerOrder: totalOrders > 0 ? totalCosts / totalOrders : 0,
    profitPerOrder: totalOrders > 0 ? (totalRevenue - totalCosts) / totalOrders : 0,
    breakEvenOrdersPerMonth: 0,
    breakEvenGMVPerMonth: 0,
    estimatedLTV: 0,
    estimatedCAC: 50,
    ltvCacRatio: 0,
    roi: totalCosts > 0 ? ((totalRevenue - totalCosts) / totalCosts) * 100 : 0,
    paybackMonths: 0,
  };
}
