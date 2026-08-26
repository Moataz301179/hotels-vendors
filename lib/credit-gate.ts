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

  const creditLimit = Number(hotel.creditLimit ?? 0);
  const creditUsed = Number(hotel.creditUsed ?? 0);

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
    (sum, o) => sum + Number(o.total ?? 0),
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

/**
 * Reserve credit when an order is confirmed (creditUsed += order total).
 * Called when order transitions to CONFIRMED or APPROVED.
 */
/**
 * Atomic check-and-reserve of hotel credit, to be called INSIDE a Prisma
 * interactive transaction. Uses SELECT ... FOR UPDATE to take a row lock on
 * the Hotel record before reading creditLimit/creditUsed, so concurrent
 * order transactions are serialized: each one sees the committed creditUsed
 * of the previous and two orders cannot both pass the same headroom.
 *
 * Throws CREDIT_EXCEEDED_ERROR if the reservation would breach the limit;
 * the surrounding transaction rolls back (no increment applied).
 */
export class CREDIT_EXCEEDED_ERROR extends Error {
  constructor(
    message: string,
    public currentExposure: number
  ) {
    super(message);
    this.name = "CREDIT_EXCEEDED_ERROR";
  }
}

// Minimal structural type so this works with any transaction client
// (Prisma.TransactionClient or a test double) without importing the runtime.
interface CreditGateTx {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $queryRaw: (strings: TemplateStringsArray, ...values: any[]) => Promise<unknown>;
  hotel: {
    update(args: {
      where: { id: string };
      data: { creditUsed: { increment: number } };
    }): Promise<unknown>;
  };
}

export async function checkAndReserveCredit(
  tx: CreditGateTx,
  hotelId: string,
  amount: number
): Promise<void> {
  // Row-level lock: concurrent transactions block on this read until this
  // one commits. NOTE: requires PostgreSQL (prod); SQLite ignores FOR UPDATE
  // but is single-writer anyway.
  const rows = (await tx.$queryRaw`
    SELECT "creditLimit", "creditUsed" FROM "Hotel" WHERE id = ${hotelId} FOR UPDATE
  `) as Array<{ creditLimit: number | null; creditUsed: number | null }>;

  const hotel = rows[0];
  if (!hotel) {
    throw new Error(`Hotel not found: ${hotelId}`);
  }

  const creditLimit = Number(hotel.creditLimit ?? Infinity);
  const currentExposure = Number(hotel.creditUsed ?? 0);

  if (currentExposure + amount > creditLimit) {
    throw new CREDIT_EXCEEDED_ERROR(
      `Concurrent credit breach. Exposure: EGP ${currentExposure.toFixed(2)} + this order EGP ${amount.toFixed(2)} > Limit: EGP ${(hotel.creditLimit ?? 0).toFixed(2)}`,
      currentExposure
    );
  }

  await tx.hotel.update({
    where: { id: hotelId },
    data: { creditUsed: { increment: amount } },
  });
}

export async function reserveCredit(
  hotelId: string,
  amount: number
): Promise<void> {
  await prisma.hotel.update({
    where: { id: hotelId },
    data: {
      creditUsed: {
        increment: amount,
      },
    },
  });
}

/**
 * Release credit when an invoice is paid.
 * Called when invoice paymentStatus transitions to PAID.
 */
export async function releaseCredit(
  hotelId: string,
  amount: number
): Promise<void> {
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    select: { creditUsed: true },
  });
  if (!hotel) return;

  const current = Number(hotel.creditUsed ?? 0);
  const newAmount = Math.max(0, current - amount);

  await prisma.hotel.update({
    where: { id: hotelId },
    data: {
      creditUsed: newAmount,
    },
  });
}
