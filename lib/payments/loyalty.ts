/**
 * Loyalty & Rewards Engine
 * Hotels earn points for procurement volume. Points can be redeemed for:
 * - Discounted platform fees
 * - Free months of SaaS subscription
 * - Priority support
 * - Early access to new features
 */

import { prisma } from "@/lib/prisma";

const POINTS_PER_EGP = 0.1; // 1 point per 10 EGP spent
const TIER_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 50000,
  GOLD: 200000,
  PLATINUM: 500000,
};

/**
 * Award points to a hotel for a completed order/invoice.
 */
export async function awardPoints(hotelId: string, amount: number, description: string, orderId?: string, invoiceId?: string) {
  const points = Math.floor(amount * POINTS_PER_EGP);
  if (points <= 0) return null;

  const account = await getOrCreateAccount(hotelId);

  const txn = await prisma.loyaltyTransaction.create({
    data: {
      accountId: account.id,
      type: "EARN",
      points,
      description,
      orderId,
      invoiceId,
      tenantId: account.tenantId,
    },
  });

  // Update account balance and check tier upgrade
  const newLifetime = account.lifetimePoints + points;
  const newTier = calculateTier(newLifetime);

  await prisma.loyaltyAccount.update({
    where: { id: account.id },
    data: {
      pointsBalance: { increment: points },
      lifetimePoints: newLifetime,
      tier: newTier,
    },
  });

  return txn;
}

/**
 * Redeem points for a benefit.
 */
export async function redeemPoints(hotelId: string, points: number, description: string) {
  const account = await prisma.loyaltyAccount.findUnique({
    where: { hotelId },
  });

  if (!account || account.pointsBalance < points) {
    throw new Error("Insufficient points");
  }

  const txn = await prisma.loyaltyTransaction.create({
    data: {
      accountId: account.id,
      type: "REDEEM",
      points: -points,
      description,
      tenantId: account.tenantId,
    },
  });

  await prisma.loyaltyAccount.update({
    where: { id: account.id },
    data: {
      pointsBalance: { decrement: points },
      redeemedPoints: { increment: points },
    },
  });

  return txn;
}

/**
 * Award bonus points (e.g., for referrals, promotions).
 */
export async function awardBonus(hotelId: string, points: number, description: string) {
  const account = await getOrCreateAccount(hotelId);

  const txn = await prisma.loyaltyTransaction.create({
    data: {
      accountId: account.id,
      type: "BONUS",
      points,
      description,
      tenantId: account.tenantId,
    },
  });

  await prisma.loyaltyAccount.update({
    where: { id: account.id },
    data: {
      pointsBalance: { increment: points },
      lifetimePoints: { increment: points },
    },
  });

  return txn;
}

/**
 * Get loyalty account with tier benefits.
 */
export async function getLoyaltyAccount(hotelId: string) {
  const account = await prisma.loyaltyAccount.findUnique({
    where: { hotelId },
    include: { transactions: { orderBy: { createdAt: "desc" }, take: 20 } },
  });

  if (!account) return null;

  return {
    ...account,
    benefits: getTierBenefits(account.tier),
    nextTier: getNextTier(account.tier),
    pointsToNextTier: getPointsToNextTier(account.lifetimePoints, account.tier),
  };
}

async function getOrCreateAccount(hotelId: string) {
  let account = await prisma.loyaltyAccount.findUnique({
    where: { hotelId },
  });

  if (!account) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      select: { tenantId: true },
    });

    account = await prisma.loyaltyAccount.create({
      data: {
        hotelId,
        tenantId: hotel?.tenantId || "",
      },
    });
  }

  return account;
}

function calculateTier(lifetimePoints: number): string {
  if (lifetimePoints >= TIER_THRESHOLDS.PLATINUM) return "PLATINUM";
  if (lifetimePoints >= TIER_THRESHOLDS.GOLD) return "GOLD";
  if (lifetimePoints >= TIER_THRESHOLDS.SILVER) return "SILVER";
  return "BRONZE";
}

function getNextTier(tier: string): string | null {
  const tiers = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
  const idx = tiers.indexOf(tier);
  return idx < tiers.length - 1 ? tiers[idx + 1] : null;
}

function getPointsToNextTier(lifetimePoints: number, tier: string): number {
  const next = getNextTier(tier);
  if (!next) return 0;
  const threshold = TIER_THRESHOLDS[next as keyof typeof TIER_THRESHOLDS];
  return Math.max(0, threshold - lifetimePoints);
}

function getTierBenefits(tier: string) {
  const benefits: Record<string, string[]> = {
    BRONZE: ["1 point per 10 EGP spent", "Standard support"],
    SILVER: ["1.5 points per 10 EGP spent", "Priority email support", "5% platform fee discount"],
    GOLD: ["2 points per 10 EGP spent", "Priority phone support", "10% platform fee discount", "Free analytics reports"],
    PLATINUM: ["3 points per 10 EGP spent", "Dedicated account manager", "15% platform fee discount", "Free analytics reports", "Early access to features"],
  };
  return benefits[tier] || benefits.BRONZE;
}
