/**
 * Split Payments Engine — Stripe Connect equivalent for Egyptian hospitality
 * Automatically splits a single hotel payment across multiple recipients:
 * - Supplier (principal minus platform fee)
 * - Platform (SaaS fee)
 * - Factoring company (discount/fee, if factored)
 * - Logistics (delivery fee, if applicable)
 */

import { prisma } from "@/lib/prisma";
import { getPlatformFee } from "./fees";
import { applyReserveHold } from "./reserve";

export interface SplitConfig {
  masterInvoiceId: string;
  hotelId: string;
  tenantId: string;
  totalAmount: number;
  supplierId: string;
  factoringCompanyId?: string | null;
  factoringFeeRate?: number;
  logisticsFee?: number;
  logisticsProviderId?: string | null;
}

export interface SplitResult {
  splitTransactionId: string;
  splits: {
    recipientType: string;
    recipientId: string;
    amount: number;
    feeAmount: number;
    netAmount: number;
    status: string;
  }[];
}

/**
 * Create a split payment from a single hotel payment.
 * This is the core multi-party settlement engine.
 */
export async function createSplitPayment(config: SplitConfig): Promise<SplitResult> {
  const {
    masterInvoiceId,
    hotelId,
    tenantId,
    totalAmount,
    supplierId,
    factoringCompanyId,
    factoringFeeRate = 0,
    logisticsFee = 0,
    logisticsProviderId,
  } = config;

  // 1. Calculate platform fee
  const platformFee = await getPlatformFee(tenantId, totalAmount);

  // 2. Calculate remaining after platform fee
  let remaining = totalAmount - platformFee;

  // 3. Deduct logistics fee if applicable
  let logisticsNet = 0;
  if (logisticsFee > 0 && logisticsProviderId) {
    logisticsNet = logisticsFee;
    remaining -= logisticsNet;
  }

  // 4. Deduct factoring fee if applicable
  let factoringNet = 0;
  if (factoringCompanyId && factoringFeeRate > 0) {
    factoringNet = remaining * factoringFeeRate;
    remaining -= factoringNet;
  }

  // 5. Supplier gets the rest
  const supplierNet = remaining;

  // 6. Apply rolling reserve hold on supplier portion
  const reserveHold = await applyReserveHold(supplierId, supplierNet);
  const supplierPayout = supplierNet - reserveHold;

  // 7. Create the split transaction
  const splitTx = await prisma.splitTransaction.create({
    data: {
      masterInvoiceId,
      hotelId,
      tenantId,
      totalAmount,
      status: "PENDING",
      splits: {
        create: [
          {
            recipientType: "PLATFORM",
            recipientId: tenantId,
            amount: platformFee,
            feeRate: null,
            feeAmount: 0,
            netAmount: platformFee,
            status: "PENDING",
            tenantId,
          },
          {
            recipientType: "SUPPLIER",
            recipientId: supplierId,
            amount: supplierNet,
            feeRate: null,
            feeAmount: reserveHold,
            netAmount: supplierPayout,
            status: reserveHold > 0 ? "HELD_IN_RESERVE" : "PENDING",
            tenantId,
          },
          ...(factoringCompanyId
            ? [
                {
                  recipientType: "FACTORING" as const,
                  recipientId: factoringCompanyId,
                  amount: factoringNet,
                  feeRate: factoringFeeRate,
                  feeAmount: 0,
                  netAmount: factoringNet,
                  status: "PENDING" as const,
                  tenantId,
                },
              ]
            : []),
          ...(logisticsProviderId
            ? [
                {
                  recipientType: "LOGISTICS" as const,
                  recipientId: logisticsProviderId,
                  amount: logisticsNet,
                  feeRate: null,
                  feeAmount: 0,
                  netAmount: logisticsNet,
                  status: "PENDING" as const,
                  tenantId,
                },
              ]
            : []),
        ],
      },
    },
    include: { splits: true },
  });

  return {
    splitTransactionId: splitTx.id,
    splits: splitTx.splits.map((s) => ({
      recipientType: s.recipientType,
      recipientId: s.recipientId,
      amount: Number(s.amount),
      feeAmount: Number(s.feeAmount),
      netAmount: Number(s.netAmount),
      status: s.status,
    })),
  };
}

/**
 * Mark a split item as paid and update the parent transaction status.
 */
export async function markSplitItemPaid(
  splitItemId: string,
  payoutRef: string,
  payoutMethod: string = "BANK_TRANSFER"
): Promise<void> {
  const method = payoutMethod as any;
  await prisma.splitItem.update({
    where: { id: splitItemId },
    data: { status: "PAID", paidAt: new Date(), payoutRef, payoutMethod: method },
  });

  // Check if all items are paid
  const item = await prisma.splitItem.findUnique({
    where: { id: splitItemId },
    include: { splitTransaction: { include: { splits: true } } },
  });

  if (item && item.splitTransaction) {
    const allPaid = item.splitTransaction.splits.every(
      (s) => s.status === "PAID" || s.status === "HELD_IN_RESERVE"
    );
    const anyFailed = item.splitTransaction.splits.some((s) => s.status === "FAILED");

    if (allPaid) {
      await prisma.splitTransaction.update({
        where: { id: item.splitTransaction.id },
        data: { status: "COMPLETED", processedAt: new Date() },
      });
    } else if (anyFailed) {
      await prisma.splitTransaction.update({
        where: { id: item.splitTransaction.id },
        data: { status: "PARTIAL" },
      });
    }
  }
}

/**
 * Release rolling reserve after the hold period.
 */
export async function releaseReserveAndPay(splitItemId: string): Promise<void> {
  const item = await prisma.splitItem.findUnique({
    where: { id: splitItemId },
    include: { splitTransaction: true },
  });

  if (!item || item.recipientType !== "SUPPLIER" || item.status !== "HELD_IN_RESERVE") {
    throw new Error("Invalid split item for reserve release");
  }

  await prisma.splitItem.update({
    where: { id: splitItemId },
    data: { status: "PAID", paidAt: new Date() },
  });

  // Update reserve balance
  await prisma.supplierReserve.updateMany({
    where: { supplierId: item.recipientId },
    data: {
      reserveBalance: { decrement: Number(item.feeAmount) },
      totalReleased: { increment: Number(item.feeAmount) },
    },
  });
}

/**
 * Get split transaction details with all recipients.
 */
export async function getSplitTransaction(splitTransactionId: string) {
  return prisma.splitTransaction.findUnique({
    where: { id: splitTransactionId },
    include: {
      splits: true,
      masterInvoice: {
        select: { invoiceNumber: true, total: true, status: true },
      },
      hotel: { select: { name: true } },
    },
  });
}
