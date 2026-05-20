import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export async function checkCreditLimit(
  hotelId: string,
  proposedAmount: number
): Promise<{ allowed: boolean; available: number; reason?: string }> {
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    select: { creditLimit: true, creditUsed: true },
  });

  if (!hotel) {
    return { allowed: false, available: 0, reason: "Hotel not found" };
  }

  const creditLimit = hotel.creditLimit ?? 0;
  const creditUsed = hotel.creditUsed ?? 0;

  // Sum approved/confirmed/in_transit orders that are not yet invoiced
  const uncapturedOrders = await prisma.order.findMany({
    where: {
      hotelId,
      status: { in: ["APPROVED", "CONFIRMED", "IN_TRANSIT"] },
      invoices: { none: {} },
    },
    select: { total: true },
  });

  let uncapturedTotal = new Prisma.Decimal(0);
  for (const o of uncapturedOrders) {
    uncapturedTotal = uncapturedTotal.add(o.total ?? 0);
  }

  const totalExposure = new Prisma.Decimal(creditUsed).add(uncapturedTotal);
  const available = Math.max(0, new Prisma.Decimal(creditLimit).sub(totalExposure).toNumber());

  if (totalExposure.add(proposedAmount).toNumber() > creditLimit) {
    return {
      allowed: false,
      available,
      reason: `Credit limit exceeded. Exposure: ${totalExposure.toFixed(2)} / Limit: ${new Prisma.Decimal(creditLimit).toFixed(2)}`,
    };
  }

  return { allowed: true, available };
}
