import { prisma } from "./prisma";

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

  const uncapturedTotal = uncapturedOrders.reduce(
    (sum, o) => sum + (o.total ?? 0),
    0
  );

  const totalExposure = creditUsed + uncapturedTotal;
  const available = Math.max(0, creditLimit - totalExposure);

  if (totalExposure + proposedAmount > creditLimit) {
    return {
      allowed: false,
      available,
      reason: `Credit limit exceeded. Exposure: ${totalExposure.toFixed(
        2
      )} / Limit: ${creditLimit.toFixed(2)}`,
    };
  }

  return { allowed: true, available };
}
