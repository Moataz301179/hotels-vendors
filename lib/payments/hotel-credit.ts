/**
 * Hotel Credit Line Engine
 * Pre-approved revolving credit facilities for hotels.
 * Audits hotel eligibility based on transaction history, credit scores, and risk profile.
 */

import { prisma } from "@/lib/prisma";
import { assessHotelCreditRisk } from "@/lib/payments/hotel-risk";

export interface CreditLineApplication {
  hotelId: string;
  tenantId: string;
  nbfiPartnerId: string;
  requestedLimit: number;
  tenorDays: number;
}

export interface CreditLineDecision {
  approved: boolean;
  approvedLimit: number;
  interestRate: number;
  tenorDays: number;
  reason: string;
}

/**
 * Audit hotel eligibility for a credit line.
 * Returns a decision with approved limit and interest rate.
 */
export async function auditHotelEligibility(
  application: CreditLineApplication
): Promise<CreditLineDecision> {
  const { hotelId, tenantId, requestedLimit, tenorDays } = application;

  // 1. Get hotel data
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { Tenant: true },
  });

  if (!hotel) {
    return { approved: false, approvedLimit: 0, interestRate: 0, tenorDays, reason: "Hotel not found" };
  }

  // 2. Get hotel-specific credit risk assessment
  const riskProfile = await assessHotelCreditRisk(hotelId);
  const compositeScore = riskProfile.score;
  const riskTier = riskProfile.tier;

  // 3. Calculate transaction history
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
  const orders = await prisma.order.findMany({
    where: {
      hotelId,
      createdAt: { gte: sixMonthsAgo },
      status: { in: ["CONFIRMED", "DELIVERED", "COMPLETED"] },
    },
  });

  const totalSpend = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const orderCount = orders.length;
  const avgOrderValue = orderCount > 0 ? totalSpend / orderCount : 0;

  // 4. Eligibility rules
  const MIN_SCORE = 60;
  const MIN_ORDERS = 5;
  const MIN_SPEND = 50000;
  const MAX_LIMIT_MULTIPLIER = 3; // 3x monthly average

  if (compositeScore < MIN_SCORE) {
    return {
      approved: false,
      approvedLimit: 0,
      interestRate: 0,
      tenorDays,
      reason: `Credit score ${compositeScore} below minimum threshold ${MIN_SCORE}. Improve compliance and transaction history.`,
    };
  }

  if (orderCount < MIN_ORDERS) {
    return {
      approved: false,
      approvedLimit: 0,
      interestRate: 0,
      tenorDays,
      reason: `Insufficient transaction history. Minimum ${MIN_ORDERS} completed orders required. Current: ${orderCount}.`,
    };
  }

  if (totalSpend < MIN_SPEND) {
    return {
      approved: false,
      approvedLimit: 0,
      interestRate: 0,
      tenorDays,
      reason: `Insufficient spend volume. Minimum EGP ${MIN_SPEND} required. Current: EGP ${totalSpend}.`,
    };
  }

  // 5. Calculate approved limit
  const monthlyAvg = totalSpend / 6;
  const maxLimit = monthlyAvg * MAX_LIMIT_MULTIPLIER;
  const approvedLimit = Math.min(requestedLimit, maxLimit, 2000000); // Cap at EGP 2M

  // 6. Calculate interest rate based on risk
  let baseRate = 0.14; // 14% base
  if (riskTier === "LOW") baseRate = 0.12;
  if (riskTier === "MEDIUM") baseRate = 0.14;
  if (riskTier === "HIGH") baseRate = 0.18;
  if (riskTier === "CRITICAL") baseRate = 0.22;

  // Adjust for tenor
  const tenorPremium = (tenorDays - 30) / 30 * 0.02; // +2% per additional 30 days
  const interestRate = Math.min(baseRate + tenorPremium, 0.24); // Cap at 24%

  return {
    approved: true,
    approvedLimit,
    interestRate,
    tenorDays,
    reason: `Approved based on composite score ${compositeScore}, ${orderCount} orders, EGP ${totalSpend} spend. Risk tier: ${riskTier}.`,
  };
}

/**
 * Create or update a hotel credit line after NBFI approval.
 */
export async function createCreditLine(params: {
  hotelId: string;
  tenantId: string;
  nbfiPartnerId: string;
  approvedLimit: number;
  interestRate: number;
  tenorDays: number;
  expiresAt?: Date;
}) {
  return prisma.hotelCreditLine.upsert({
    where: { hotelId: params.hotelId },
    create: {
      hotelId: params.hotelId,
      tenantId: params.tenantId,
      nbfiPartnerId: params.nbfiPartnerId,
      approvedLimit: params.approvedLimit,
      availableBalance: params.approvedLimit,
      utilizedBalance: 0,
      interestRate: params.interestRate,
      tenorDays: params.tenorDays,
      status: "ACTIVE",
      approvedAt: new Date(),
      expiresAt: params.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    update: {
      nbfiPartnerId: params.nbfiPartnerId,
      approvedLimit: params.approvedLimit,
      availableBalance: params.approvedLimit,
      utilizedBalance: 0,
      interestRate: params.interestRate,
      tenorDays: params.tenorDays,
      status: "ACTIVE",
      approvedAt: new Date(),
      expiresAt: params.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });
}

/**
 * Process a repayment against a credit draw.
 */
export async function repayDraw(drawId: string, amount: number, type: "SCHEDULED" | "EARLY" | "AUTO_DEBIT" = "SCHEDULED") {
  const draw = await prisma.creditDraw.findUnique({
    where: { id: drawId },
    include: { creditLine: true },
  });

  if (!draw) throw new Error("Draw not found");
  if (draw.status === "REPAID") throw new Error("Already fully repaid");

  const remaining = Number(draw.totalDue) - Number(draw.repaidAmount);
  const payAmount = Math.min(amount, remaining);

  await prisma.creditRepayment.create({
    data: {
      creditDrawId: drawId,
      amount: payAmount,
      type,
      tenantId: draw.tenantId,
    },
  });

  const newRepaid = Number(draw.repaidAmount) + payAmount;
  const isFullyRepaid = newRepaid >= Number(draw.totalDue);

  await prisma.creditDraw.update({
    where: { id: drawId },
    data: {
      repaidAmount: newRepaid,
      status: isFullyRepaid ? "REPAID" : "PARTIALLY_REPAID",
    },
  });

  // Restore available balance
  await prisma.hotelCreditLine.update({
    where: { id: draw.creditLineId },
    data: {
      availableBalance: { increment: payAmount },
      utilizedBalance: { decrement: payAmount },
    },
  });

  return { repaid: payAmount, remaining: remaining - payAmount, fullyRepaid: isFullyRepaid };
}
