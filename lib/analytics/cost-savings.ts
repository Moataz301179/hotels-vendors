/**
 * Hotel Cost Savings Analytics
 * Calculates and displays how much a hotel saves by using HV vs manual purchasing.
 */

import { prisma } from "@/lib/prisma";

export interface CostSavingsReport {
  period: string;
  totalSpend: number;
  estimatedManualCost: number;
  savingsAmount: number;
  savingsPercent: number;
  breakdown: {
    bulkPricingSavings: number;
    timeSavingsHours: number;
    timeSavingsValue: number;
    financingBenefit: number;
    logisticsSavings: number;
    complianceSavings: number;
  };
}

export async function calculateCostSavings(
  hotelId: string,
  months: number = 6
): Promise<CostSavingsReport> {
  const startDate = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000);

  const orders = await prisma.order.findMany({
    where: {
      hotelId,
      createdAt: { gte: startDate },
      status: { in: ["CONFIRMED", "DELIVERED", "COMPLETED"] },
    },
    include: { OrderItem: { include: { Product: true } } },
  });

  const totalSpend = orders.reduce((s, o) => s + Number(o.total), 0);
  const orderCount = orders.length;

  // 1. Bulk pricing savings
  // Estimate: marketplace prices are 8-15% lower than individual negotiation
  const bulkPricingSavings = totalSpend * 0.10;

  // 2. Time savings
  // Manual procurement: ~4 hours per order (phone, WhatsApp, follow-up, payment)
  // HV platform: ~15 minutes per order
  const timeSavedHours = orderCount * 3.75; // 4 hours - 15 min
  const hourlyRate = 75; // EGP 75/hour for procurement staff
  const timeSavingsValue = timeSavedHours * hourlyRate;

  // 3. Financing benefit
  // If hotel uses 60-day financing, working capital benefit
  // Assume hotel's cost of capital is 18% APR
  // Benefit = spend * 18% * (60/365)
  const financedOrders = orders.filter((o) => o.paymentLane === "FACTORING" || o.paymentLane === "SUPPLIER_CREDIT");
  const financedAmount = financedOrders.reduce((s, o) => s + Number(o.total), 0);
  const financingBenefit = financedAmount * 0.18 * (60 / 365);

  // 4. Logistics savings
  // Shared-route delivery saves ~25% vs individual supplier deliveries
  const ordersWithShipping = orders.filter((o) => Number(o.shippingCost || 0) > 0);
  const totalShipping = ordersWithShipping.reduce((s, o) => s + Number(o.shippingCost || 0), 0);
  const logisticsSavings = totalShipping * 0.25;

  // 5. Compliance/ETA savings
  // Manual ETA compliance: accountant cost ~EGP 500/invoice
  // HV automated: included in platform fee
  const invoiceCount = await prisma.invoice.count({
    where: { hotelId, createdAt: { gte: startDate } },
  });
  const complianceSavings = invoiceCount * 400; // EGP 400 saved per invoice

  const totalSavings = bulkPricingSavings + timeSavingsValue + financingBenefit + logisticsSavings + complianceSavings;
  const estimatedManualCost = totalSpend + totalSavings;
  const savingsPercent = (totalSavings / estimatedManualCost) * 100;

  return {
    period: `Last ${months} months`,
    totalSpend: Math.round(totalSpend),
    estimatedManualCost: Math.round(estimatedManualCost),
    savingsAmount: Math.round(totalSavings),
    savingsPercent: Math.round(savingsPercent * 10) / 10,
    breakdown: {
      bulkPricingSavings: Math.round(bulkPricingSavings),
      timeSavingsHours: Math.round(timeSavedHours),
      timeSavingsValue: Math.round(timeSavingsValue),
      financingBenefit: Math.round(financingBenefit),
      logisticsSavings: Math.round(logisticsSavings),
      complianceSavings: Math.round(complianceSavings),
    },
  };
}
