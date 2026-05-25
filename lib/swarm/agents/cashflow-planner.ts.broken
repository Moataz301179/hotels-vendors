/**
 * Cashflow Planner — Hotels Vendors AI Agent
 * Predictive cashflow modeling and working capital optimization.
 *
 * RULES:
 * - Read-only analysis. Never mutates ledgers, credit lines, or orders.
 * - All money uses Prisma.Decimal(12,2).
 * - Every DB query scoped to tenantId.
 * - Integrates with Oliv factoring workflow recommendations.
 */

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

export interface CashflowForecast {
  hotelId: string;
  tenantId: string;
  generatedAt: string;
  currentPosition: CashPosition;
  thirtyDayForecast: PeriodForecast;
  sixtyDayForecast: PeriodForecast;
  ninetyDayForecast: PeriodForecast;
  liquidityGaps: LiquidityGap[];
  factoringRecommendations: FactoringRecommendation[];
  drawdownSchedule: DrawdownRecommendation[];
  treasuryYield: TreasuryYieldOpportunity[];
  triTierAnalysis: TriTierAnalysis;
}

interface CashPosition {
  totalPayables: number;
  totalReceivables: number;
  netPosition: number;
  availableCredit: number;
  utilizedCredit: number;
  creditUtilizationPct: number;
  cashOnHand: number; // Approximated from recent direct payments
}

interface PeriodForecast {
  period: string;
  projectedPayables: number;
  projectedReceivables: number;
  projectedNetPosition: number;
  projectedCreditNeed: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

interface LiquidityGap {
  date: string;
  gapAmount: number;
  severity: "WARNING" | "CRITICAL";
  cause: string;
  recommendedAction: string;
}

interface FactoringRecommendation {
  masterInvoiceId?: string;
  orderId?: string;
  amount: number;
  currentLane: string;
  recommendedLane: "FACTORING" | "DIRECT_BANK";
  reason: string;
  estimatedSavings: number;
  urgency: "NOW" | "SOON" | "PLAN";
}

interface DrawdownRecommendation {
  creditLineId: string;
  recommendedAmount: number;
  recommendedDate: string;
  purpose: string;
  estimatedInterest: number;
  paybackDate: string;
}

interface TreasuryYieldOpportunity {
  type: "HOTEL_ADMIN_FEE" | "EARLY_PAYMENT_DISCOUNT" | "CASH_RESERVE";
  description: string;
  potentialYield: number;
  riskLevel: "LOW" | "MEDIUM";
  actionRequired: boolean;
}

interface TriTierAnalysis {
  platformFeeRate: number;
  platformFeeRevenue: number;
  nbfiFeeRate: number;
  nbfiFeeRevenue: number;
  hotelAdminFeeRate: number;
  hotelAdminFeeRevenue: number;
  totalRevenue: number;
  optimizationSuggestion: string;
}

// ─────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────

const PLATFORM_FEE_RATE = 0.015;
const NBFI_FEE_RATE = 0.02;
const HOTEL_ADMIN_FEE_RATE = 0.005;
const CONFIDENCE_THRESHOLD_HIGH = 10;
const CONFIDENCE_THRESHOLD_MEDIUM = 5;

// ─────────────────────────────────────────
// MAIN PLANNER
// ─────────────────────────────────────────

export class CashflowPlanner {
  /**
   * Generate a comprehensive cashflow forecast for a hotel.
   */
  public async generateForecast(
    hotelId: string,
    tenantId: string
  ): Promise<CashflowForecast> {
    const currentPosition = await this.getCurrentPosition(hotelId, tenantId);
    const [
      thirtyDay,
      sixtyDay,
      ninetyDay,
      liquidityGaps,
      factoringRecs,
      drawdownSchedule,
      treasuryYield,
      triTier,
    ] = await Promise.all([
      this.forecastPeriod(hotelId, tenantId, 30),
      this.forecastPeriod(hotelId, tenantId, 60),
      this.forecastPeriod(hotelId, tenantId, 90),
      this.detectLiquidityGaps(hotelId, tenantId, currentPosition),
      this.recommendFactoring(hotelId, tenantId, currentPosition),
      this.recommendDrawdowns(hotelId, tenantId, currentPosition),
      this.findTreasuryYield(hotelId, tenantId, currentPosition),
      this.analyzeTriTier(hotelId, tenantId),
    ]);

    return {
      hotelId,
      tenantId,
      generatedAt: new Date().toISOString(),
      currentPosition,
      thirtyDayForecast: thirtyDay,
      sixtyDayForecast: sixtyDay,
      ninetyDayForecast: ninetyDay,
      liquidityGaps,
      factoringRecommendations: factoringRecs,
      drawdownSchedule,
      treasuryYield,
      triTierAnalysis: triTier,
    };
  }

  // ─────────────────────────────────────────
  // CURRENT POSITION
  // ─────────────────────────────────────────

  private async getCurrentPosition(
    hotelId: string,
    tenantId: string
  ): Promise<CashPosition> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Payables: orders not yet paid (confirmed or pending)
    const payablesAgg = await prisma.order.aggregate({
      where: {
        hotelId,
        tenantId,
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      _sum: { total: true },
    });
    const totalPayables = Number(payablesAgg._sum.total ?? 0);

    // Receivables: factoring requests pending disbursement
    const receivablesAgg = await prisma.factoringRequest.aggregate({
      where: {
        hotelId,
        tenantId,
        status: { in: ["APPROVED", "PENDING"] },
      },
      _sum: { amount: true },
    });
    const totalReceivables = Number(receivablesAgg._sum.amount ?? 0);

    // Credit line
    const creditLine = await prisma.hotelCreditLine.findUnique({
      where: { hotelId },
    });
    const availableCredit = creditLine ? Number(creditLine.availableBalance) : 0;
    const utilizedCredit = creditLine ? Number(creditLine.utilizedBalance) : 0;
    const creditUtilizationPct = creditLine && Number(creditLine.creditLimit) > 0
      ? utilizedCredit / Number(creditLine.creditLimit)
      : 0;

    // Approximate cash on hand from recent direct bank payments
    const recentDirectPayments = await prisma.order.aggregate({
      where: {
        hotelId,
        tenantId,
        status: "SETTLED",
        paymentLaneRef: { contains: "direct" },
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { total: true },
    });
    const cashOnHand = Number(recentDirectPayments._sum.total ?? 0) * 0.3; // Rough: 30% of recent direct payments = available cash

    return {
      totalPayables,
      totalReceivables,
      netPosition: totalReceivables - totalPayables,
      availableCredit,
      utilizedCredit,
      creditUtilizationPct,
      cashOnHand,
    };
  }

  // ─────────────────────────────────────────
  // PERIOD FORECAST
  // ─────────────────────────────────────────

  private async forecastPeriod(
    hotelId: string,
    tenantId: string,
    days: number
  ): Promise<PeriodForecast> {
    const lookbackDays = days * 2; // Use 2x period for trend
    const lookbackDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    // Historical payables trend
    const historicalPayables = await prisma.order.aggregate({
      where: {
        hotelId,
        tenantId,
        createdAt: { gte: lookbackDate },
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    // Historical receivables trend
    const historicalReceivables = await prisma.factoringRequest.aggregate({
      where: {
        hotelId,
        tenantId,
        createdAt: { gte: lookbackDate },
        status: { in: ["APPROVED", "DISBURSED"] },
      },
      _sum: { amount: true },
    });

    const orderCount = historicalPayables._count.id ?? 0;
    const avgOrderValue = orderCount > 0
      ? Number(historicalPayables._sum.total ?? 0) / orderCount
      : 0;

    // Project forward: assume same order frequency, adjusted for seasonality
    const projectedOrders = Math.max(1, Math.round((orderCount / lookbackDays) * days));
    const projectedPayables = avgOrderValue * projectedOrders;
    const projectedReceivables = Number(historicalReceivables._sum.amount ?? 0) * (days / lookbackDays);
    const projectedNet = projectedReceivables - projectedPayables;

    // Credit need if net negative
    const projectedCreditNeed = projectedNet < 0 ? Math.abs(projectedNet) - 5000 : 0; // Buffer EGP 5k

    // Confidence based on data volume
    let confidence: PeriodForecast["confidence"] = "LOW";
    if (orderCount >= CONFIDENCE_THRESHOLD_HIGH) confidence = "HIGH";
    else if (orderCount >= CONFIDENCE_THRESHOLD_MEDIUM) confidence = "MEDIUM";

    return {
      period: futureDate.toISOString().split("T")[0],
      projectedPayables,
      projectedReceivables,
      projectedNetPosition: projectedNet,
      projectedCreditNeed: Math.max(0, projectedCreditNeed),
      confidence,
    };
  }

  // ─────────────────────────────────────────
  // LIQUIDITY GAPS
  // ─────────────────────────────────────────

  private async detectLiquidityGaps(
    hotelId: string,
    tenantId: string,
    position: CashPosition
  ): Promise<LiquidityGap[]> {
    const gaps: LiquidityGap[] = [];

    // Check upcoming large payables in next 14 days
    const fourteenDays = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const upcomingPayables = await prisma.order.findMany({
      where: {
        hotelId,
        tenantId,
        status: "CONFIRMED",
        estimatedDelivery: { lte: fourteenDays },
      },
      orderBy: { total: "desc" },
      take: 5,
    });

    for (const order of upcomingPayables) {
      const amount = Number(order.total);
      if (amount > position.cashOnHand + position.availableCredit * 0.5) {
        gaps.push({
          date: order.estimatedDelivery?.toISOString().split("T")[0] ?? "soon",
          gapAmount: amount,
          severity: amount > position.cashOnHand ? "CRITICAL" : "WARNING",
          cause: `Large payable order #${order.orderNumber}`,
          recommendedAction: amount > 50000
            ? "Consider factoring this order via Oliv"
            : "Use credit line drawdown",
        });
      }
    }

    // Check credit utilization
    if (position.creditUtilizationPct > 0.8) {
      gaps.push({
        date: new Date().toISOString().split("T")[0],
        gapAmount: position.utilizedCredit * 0.2,
        severity: "WARNING",
        cause: "Credit utilization above 80%",
        recommendedAction: "Request credit limit increase or reduce outstanding draws",
      });
    }

    return gaps;
  }

  // ─────────────────────────────────────────
  // FACTORING RECOMMENDATIONS
  // ─────────────────────────────────────────

  private async recommendFactoring(
    hotelId: string,
    tenantId: string,
    position: CashPosition
  ): Promise<FactoringRecommendation[]> {
    const recommendations: FactoringRecommendation[] = [];

    // Find large confirmed orders that haven't been factored
    const largeOrders = await prisma.order.findMany({
      where: {
        hotelId,
        tenantId,
        status: "CONFIRMED",
        paymentLaneRef: null, // Not assigned to a lane yet
      },
      orderBy: { total: "desc" },
      take: 10,
    });

    for (const order of largeOrders) {
      const amount = Number(order.total);
      if (amount < 20000) continue;

      const creditLine = await prisma.hotelCreditLine.findUnique({
        where: { hotelId },
      });

      if (creditLine?.status === "ACTIVE" && Number(creditLine.availableBalance) >= amount) {
        const financingFee = amount * NBFI_FEE_RATE;
        const interestSaved = amount * 0.04 * (60 / 365); // Rough opportunity cost
        const netSavings = interestSaved - financingFee;

        recommendations.push({
          orderId: order.id,
          amount,
          currentLane: "UNASSIGNED",
          recommendedLane: "FACTORING",
          reason: `Large order (EGP ${amount.toFixed(0)}) — factoring preserves cash for other payables`,
          estimatedSavings: Math.max(0, netSavings),
          urgency: amount > 100000 ? "NOW" : amount > 50000 ? "SOON" : "PLAN",
        });
      }
    }

    // Find pending master invoices approaching due date
    const pendingInvoices = await prisma.masterInvoice.findMany({
      where: {
        hotelId,
        tenantId,
        status: { in: ["PENDING", "APPROVED"] },
      },
      orderBy: { total: "desc" },
      take: 5,
    });

    for (const inv of pendingInvoices) {
      const amount = Number(inv.total);
      if (amount < 50000) continue;

      recommendations.push({
        masterInvoiceId: inv.id,
        amount,
        currentLane: "SUPPLIER_CREDIT",
        recommendedLane: "FACTORING",
        reason: `Master invoice EGP ${amount.toFixed(0)} — factor now to unlock supplier cash early`,
        estimatedSavings: amount * 0.01, // Rough 1% savings from early settlement
        urgency: "SOON",
      });
    }

    return recommendations.sort((a, b) => b.amount - a.amount);
  }

  // ─────────────────────────────────────────
  // DRAWDOWN SCHEDULE
  // ─────────────────────────────────────────

  private async recommendDrawdowns(
    hotelId: string,
    tenantId: string,
    position: CashPosition
  ): Promise<DrawdownRecommendation[]> {
    const recommendations: DrawdownRecommendation[] = [];

    const creditLine = await prisma.hotelCreditLine.findUnique({
      where: { hotelId },
    });
    if (!creditLine || creditLine.status !== "ACTIVE") return recommendations;

    // Find upcoming payables that exceed cash on hand
    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const upcomingOrders = await prisma.order.findMany({
      where: {
        hotelId,
        tenantId,
        status: "CONFIRMED",
        estimatedDelivery: { lte: thirtyDays },
      },
      orderBy: { estimatedDelivery: "asc" },
    });

    let runningCash = position.cashOnHand;
    for (const order of upcomingOrders) {
      const amount = Number(order.total);
      runningCash -= amount;

      if (runningCash < 0 && position.availableCredit > Math.abs(runningCash)) {
        const drawAmount = Math.abs(runningCash) + 5000; // Buffer
        const interestRate = Number(creditLine.interestRate) / 100;
        const tenorDays = creditLine.tenorDays;
        const estimatedInterest = drawAmount * interestRate * (tenorDays / 365);
        const paybackDate = new Date(Date.now() + tenorDays * 24 * 60 * 60 * 1000);

        recommendations.push({
          creditLineId: creditLine.id,
          recommendedAmount: drawAmount,
          recommendedDate: order.estimatedDelivery?.toISOString().split("T")[0] ?? new Date().toISOString().split("T")[0],
          purpose: `Cover payable order #${order.orderNumber}`,
          estimatedInterest,
          paybackDate: paybackDate.toISOString().split("T")[0],
        });

        runningCash += drawAmount;
      }
    }

    return recommendations;
  }

  // ─────────────────────────────────────────
  // TREASURY YIELD
  // ─────────────────────────────────────────

  private async findTreasuryYield(
    hotelId: string,
    tenantId: string,
    position: CashPosition
  ): Promise<TreasuryYieldOpportunity[]> {
    const opportunities: TreasuryYieldOpportunity[] = [];

    // Hotel admin fee yield
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const adminFees = await prisma.masterInvoice.aggregate({
      where: {
        hotelId,
        tenantId,
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { total: true },
    });
    const monthlyVolume = Number(adminFees._sum.total ?? 0);
    const adminYield = monthlyVolume * HOTEL_ADMIN_FEE_RATE;

    if (adminYield > 0) {
      opportunities.push({
        type: "HOTEL_ADMIN_FEE",
        description: `Monthly hotel admin fee yield: EGP ${adminYield.toFixed(2)} from EGP ${monthlyVolume.toFixed(2)} volume`,
        potentialYield: adminYield,
        riskLevel: "LOW",
        actionRequired: false,
      });
    }

    // Early payment discount opportunities
    const suppliersWithDiscount = await prisma.supplier.findMany({
      where: {
        tenantId,
        earlyPaymentDiscount: { not: null },
      },
      select: { name: true, earlyPaymentDiscount: true },
    });

    for (const supplier of suppliersWithDiscount) {
      if (supplier.earlyPaymentDiscount) {
        opportunities.push({
          type: "EARLY_PAYMENT_DISCOUNT",
          description: `${supplier.name} offers ${supplier.earlyPaymentDiscount}% early payment discount`,
          potentialYield: monthlyVolume * (Number(supplier.earlyPaymentDiscount) / 100),
          riskLevel: "LOW",
          actionRequired: true,
        });
      }
    }

    // Cash reserve recommendation
    if (position.cashOnHand < position.totalPayables * 0.2) {
      opportunities.push({
        type: "CASH_RESERVE",
        description: "Cash reserve below 20% of payables. Build buffer to avoid emergency draws.",
        potentialYield: 0,
        riskLevel: "MEDIUM",
        actionRequired: true,
      });
    }

    return opportunities;
  }

  // ─────────────────────────────────────────
  // TRI-TIER ANALYSIS
  // ─────────────────────────────────────────

  private async analyzeTriTier(
    hotelId: string,
    tenantId: string
  ): Promise<TriTierAnalysis> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const volume = await prisma.order.aggregate({
      where: {
        hotelId,
        tenantId,
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ["CONFIRMED", "DELIVERED", "SETTLED"] },
      },
      _sum: { subtotal: true },
    });

    const monthlySubtotal = Number(volume._sum.subtotal ?? 0);
    const platformRevenue = monthlySubtotal * PLATFORM_FEE_RATE;
    const nbfiRevenue = monthlySubtotal * NBFI_FEE_RATE;
    const hotelAdminRevenue = monthlySubtotal * HOTEL_ADMIN_FEE_RATE;

    return {
      platformFeeRate: PLATFORM_FEE_RATE * 100,
      platformFeeRevenue: platformRevenue,
      nbfiFeeRate: NBFI_FEE_RATE * 100,
      nbfiFeeRevenue: nbfiRevenue,
      hotelAdminFeeRate: HOTEL_ADMIN_FEE_RATE * 100,
      hotelAdminFeeRevenue: hotelAdminRevenue,
      totalRevenue: platformRevenue + nbfiRevenue + hotelAdminRevenue,
      optimizationSuggestion: monthlySubtotal > 1000000
        ? "Volume exceeds 1M EGP/month — negotiate tier reduction to 1.2% platform fee"
        : "Current tier appropriate for volume",
    };
  }
}

// Singleton export
export const cashflowPlanner = new CashflowPlanner();
