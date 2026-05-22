/**
 * Rolling Reserve Engine
 * Holds a percentage of supplier earnings as security against disputes and chargebacks.
 * Automatically releases after a configurable hold period (default 30 days).
 */

import { prisma } from "@/lib/prisma";

/**
 * Apply a reserve hold on a supplier payout.
 * Returns the amount held (0 if no reserve configured).
 */
export async function applyReserveHold(supplierId: string, payoutAmount: number): Promise<number> {
  const reserve = await prisma.supplierReserve.findUnique({
    where: { supplierId },
  });

  if (!reserve) {
    // Auto-create default reserve (10% hold, 30-day release)
    await prisma.supplierReserve.create({
      data: {
        supplierId,
        reserveRate: 0.10,
        releaseAfterDays: 30,
        tenantId: await getSupplierTenantId(supplierId),
      },
    });
    const hold = payoutAmount * 0.10;
    return Math.round(hold * 100) / 100;
  }

  const hold = payoutAmount * Number(reserve.reserveRate);
  const roundedHold = Math.round(hold * 100) / 100;

  // Update reserve balance
  await prisma.supplierReserve.update({
    where: { supplierId },
    data: {
      reserveBalance: { increment: roundedHold },
      totalHeld: { increment: roundedHold },
    },
  });

  return roundedHold;
}

/**
 * Release reserve balance that has passed the hold period.
 * Should be called by a scheduled job (e.g., daily cron).
 */
export async function releaseExpiredReserves(): Promise<{ released: number; totalAmount: number }> {
  // Find all split items that are HELD_IN_RESERVE and past the hold period
  const holdItems = await prisma.splitItem.findMany({
    where: {
      status: "HELD_IN_RESERVE",
      createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
    include: { splitTransaction: true },
  });

  let released = 0;
  let totalAmount = 0;

  for (const item of holdItems) {
    try {
      await prisma.splitItem.update({
        where: { id: item.id },
        data: { status: "PAID", paidAt: new Date() },
      });

      await prisma.supplierReserve.updateMany({
        where: { supplierId: item.recipientId },
        data: {
          reserveBalance: { decrement: Number(item.feeAmount) },
          totalReleased: { increment: Number(item.feeAmount) },
        },
      });

      released++;
      totalAmount += Number(item.feeAmount);
    } catch (err) {
      console.error(`[Reserve] Failed to release item ${item.id}:`, err);
    }
  }

  return { released, totalAmount };
}

/**
 * Get reserve status for a supplier.
 */
export async function getReserveStatus(supplierId: string) {
  return prisma.supplierReserve.findUnique({
    where: { supplierId },
  });
}

/**
 * Configure reserve settings for a supplier.
 */
export async function configureReserve(params: {
  supplierId: string;
  reserveRate: number;
  releaseAfterDays: number;
  tenantId: string;
}) {
  return prisma.supplierReserve.upsert({
    where: { supplierId: params.supplierId },
    create: {
      supplierId: params.supplierId,
      reserveRate: params.reserveRate,
      releaseAfterDays: params.releaseAfterDays,
      tenantId: params.tenantId,
    },
    update: {
      reserveRate: params.reserveRate,
      releaseAfterDays: params.releaseAfterDays,
    },
  });
}

async function getSupplierTenantId(supplierId: string): Promise<string> {
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    select: { tenantId: true },
  });
  return supplier?.tenantId || "";
}
