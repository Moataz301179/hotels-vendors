/**
 * Platform Fee Engine
 * Configurable fee rules per tenant. Supports percentage, flat, and tiered pricing.
 */

import { prisma } from "@/lib/prisma";

/**
 * Get the platform fee for a given transaction amount.
 * Defaults to 1.5% if no custom rule is configured.
 */
export async function getPlatformFee(tenantId: string, amount: number): Promise<number> {
  const rule = await prisma.platformFeeRule.findUnique({
    where: { tenantId },
  });

  if (!rule || !rule.active) {
    // Default: 1.5% with EGP 50 min, EGP 2,500 max
    const defaultRate = 0.015;
    const fee = amount * defaultRate;
    return Math.min(Math.max(fee, 50), 2500);
  }

  let fee: number;

  switch (rule.feeType) {
    case "FLAT":
      fee = Number(rule.flatFee || 0);
      break;
    case "TIERED":
      fee = calculateTieredFee(amount, rule.feeRate);
      break;
    case "PERCENTAGE":
    default:
      fee = amount * Number(rule.feeRate);
      break;
  }

  // Apply min/max caps
  if (rule.minFee && fee < Number(rule.minFee)) fee = Number(rule.minFee);
  if (rule.maxFee && fee > Number(rule.maxFee)) fee = Number(rule.maxFee);

  return fee;
}

function calculateTieredFee(amount: number, baseRate: any): number {
  // Simple tiered: lower rate for higher volumes
  const rate = Number(baseRate);
  if (amount > 500000) return amount * (rate * 0.5); // 50% discount for >500k
  if (amount > 100000) return amount * (rate * 0.75); // 25% discount for >100k
  return amount * rate;
}

/**
 * Set or update the platform fee rule for a tenant.
 */
export async function setPlatformFeeRule(params: {
  tenantId: string;
  feeType: "PERCENTAGE" | "FLAT" | "TIERED";
  feeRate?: number;
  flatFee?: number;
  minFee?: number;
  maxFee?: number;
  appliesTo?: string;
}) {
  return prisma.platformFeeRule.upsert({
    where: { tenantId: params.tenantId },
    create: {
      tenantId: params.tenantId,
      feeType: params.feeType,
      feeRate: params.feeRate,
      flatFee: params.flatFee,
      minFee: params.minFee,
      maxFee: params.maxFee,
      appliesTo: params.appliesTo || "ALL",
    },
    update: {
      feeType: params.feeType,
      feeRate: params.feeRate,
      flatFee: params.flatFee,
      minFee: params.minFee,
      maxFee: params.maxFee,
      appliesTo: params.appliesTo,
    },
  });
}

