/**
 * Cashflow Planner — AI Agent
 * Forecasts cash position, recommends payment timing,
 * identifies liquidity gaps, suggests factoring.
 */

import { prisma } from "@/lib/prisma";
import { OrderStatus, FactoringRequestStatus, MasterInvoiceStatus } from "@prisma/client";

export interface CashflowInput {
  hotelId: string;
  tenantId: string;
  horizonDays?: number; // default 90
}

export interface CashflowForecast {
  date: string;
  projectedCash: number;
  projectedPayables: number;
  projectedReceivables: number;
  netPosition: number;
}

export interface LiquidityGap {
  date: string;
  shortfall: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendedAction: string;
}

export interface CashflowResult {
  currentCash: number;
  currentCreditUsed: number;
  currentCreditLimit: number;
  forecast: CashflowForecast[];
  gaps: LiquidityGap[];
  recommendations: string[];
  factoringOpportunities: Array<{
    invoiceId: string;
    amount: number;
    daysOutstanding: number;
    estimatedAdvanceRate: number;
    estimatedFee: number;
  }>;
  summary: string;
}

export async function planCashflow(input: CashflowInput): Promise<CashflowResult> {
  const { hotelId, tenantId, horizonDays = 90 } = input;

  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    select: { creditLimit: true, creditUsed: true },
  });

  const currentCreditLimit = Number(hotel?.creditLimit ?? 0);
  const currentCreditUsed = Number(hotel?.creditUsed ?? 0);
  const currentCash = currentCreditLimit - currentCreditUsed;

  // Pending payables: orders not yet paid (CONFIRMED, IN_TRANSIT, PARTIALLY_DELIVERED)
  const pendingOrders = await prisma.order.findMany({
    where: {
      hotelId,
      tenantId,
      status: { in: [OrderStatus.CONFIRMED, OrderStatus.IN_TRANSIT, OrderStatus.PARTIALLY_DELIVERED] },
    },
    select: { id: true, totalAmount: true, createdAt: true, status: true },
  });

  // Pending receivables: invoices not yet paid by hotel (from MasterInvoice)
  const pendingInvoices = await prisma.masterInvoice.findMany({
    where: {
      hotelId,
      tenantId,
      status: { in: [MasterInvoiceStatus.ISSUED, MasterInvoiceStatus.PARTIALLY_PAID] },
    },
    select: { id: true, totalAmount: true, createdAt: true, status: true },
  });

  // Build daily forecast
  const forecast: CashflowForecast[] = [];
  const gaps: LiquidityGap[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = 0; d <= horizonDays; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];

    // Assume payables due at 30 days from order
    const payables = pendingOrders
      .filter((o) => {
        const due = new Date(o.createdAt);
        due.setDate(due.getDate() + 30);
        return due.toISOString().split("T")[0] === dateStr;
      })
      .reduce((s, o) => s + Number(o.totalAmount), 0);

    // Assume receivables (hotel collections) at 45 days from invoice
    const receivables = pendingInvoices
      .filter((i) => {
        const due = new Date(i.createdAt);
        due.setDate(due.getDate() + 45);
        return due.toISOString().split("T")[0] === dateStr;
      })
      .reduce((s, i) => s + Number(i.totalAmount), 0);

    const projectedCash = currentCash + receivables - payables;
    const netPosition = projectedCash;

    forecast.push({
      date: dateStr,
      projectedCash,
      projectedPayables: payables,
      projectedReceivables: receivables,
      netPosition,
    });

    if (netPosition < 0) {
      const severity = netPosition < -50000 ? "CRITICAL" : netPosition < -20000 ? "HIGH" : netPosition < -5000 ? "MEDIUM" : "LOW";
      gaps.push({
        date: dateStr,
        shortfall: Math.abs(netPosition),
        severity,
        recommendedAction: severity === "CRITICAL" || severity === "HIGH"
          ? "Initiate factoring or request emergency credit line extension."
          : "Defer non-essential orders or negotiate extended payment terms.",
      });
    }
  }

  // Factoring opportunities: outstanding invoices eligible for factoring
  const factoringOpportunities = await findFactoringOpportunities(hotelId, tenantId);

  const recommendations = buildRecommendations(gaps, factoringOpportunities, currentCreditLimit, currentCreditUsed);

  const summary = gaps.length === 0
    ? `Cashflow healthy for next ${horizonDays} days. Current available credit: ${fmt(currentCash)}.`
    : `${gaps.length} liquidity gaps detected over ${horizonDays} days. Largest shortfall: ${fmt(Math.max(...gaps.map((g) => g.shortfall)))}.`;

  return {
    currentCash,
    currentCreditUsed,
    currentCreditLimit,
    forecast,
    gaps,
    recommendations,
    factoringOpportunities,
    summary,
  };
}

// ── Helpers ──

async function findFactoringOpportunities(hotelId: string, tenantId: string) {
  const invoices = await prisma.masterInvoice.findMany({
    where: {
      hotelId,
      tenantId,
      status: { in: [MasterInvoiceStatus.ISSUED, MasterInvoiceStatus.FACTORING_REQUESTED] },
    },
    select: { id: true, totalAmount: true, createdAt: true },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  const now = Date.now();
  return invoices.map((inv) => {
    const daysOutstanding = Math.floor((now - new Date(inv.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const amount = Number(inv.totalAmount);
    const advanceRate = 0.85; // 85% advance heuristic
    const feeRate = 0.02 + daysOutstanding * 0.0005; // 2% + 0.05% per day
    return {
      invoiceId: inv.id,
      amount,
      daysOutstanding,
      estimatedAdvanceRate: advanceRate,
      estimatedFee: amount * feeRate,
    };
  });
}

function buildRecommendations(
  gaps: LiquidityGap[],
  factoringOps: Array<{ invoiceId: string; amount: number; estimatedFee: number }>,
  creditLimit: number,
  creditUsed: number
): string[] {
  const recs: string[] = [];

  if (gaps.length > 0) {
    recs.push(`Urgent: ${gaps.length} cash shortfalls detected. Review payment timing.`);
  }

  const totalFactoring = factoringOps.reduce((s, o) => s + o.amount, 0);
  if (totalFactoring > 0) {
    recs.push(`Factoring opportunity: ${fmt(totalFactoring)} across ${factoringOps.length} invoices. Estimated fees: ${fmt(factoringOps.reduce((s, o) => s + o.estimatedFee, 0))}.`);
  }

  const utilization = creditLimit > 0 ? creditUsed / creditLimit : 0;
  if (utilization > 0.8) {
    recs.push(`Credit utilization at ${pct(utilization)}. Consider paying down balance.`);
  } else if (utilization < 0.3 && creditLimit > 0) {
    recs.push(`Low credit utilization (${pct(utilization)}). Room to leverage credit for strategic purchases.`);
  }

  return recs;
}

function fmt(n: number) {
  return `${n.toFixed(2)} EGP`;
}
function pct(n: number) {
  return `${(n * 100).toFixed(0)}%`;
}
