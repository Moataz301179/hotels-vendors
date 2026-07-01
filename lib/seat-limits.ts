import { prisma } from "@/lib/prisma";

export class SeatLimitExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SeatLimitExceededError";
  }
}

export async function enforceTenantSeatCapacity(tenantId: string): Promise<void> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { seatCount: true, maxUsers: true },
  });

  if (!tenant) {
    throw new SeatLimitExceededError("Tenant not found");
  }

  const activeUserCount = await prisma.user.count({
    where: {
      tenantId,
      status: { not: "INACTIVE" },
    },
  });

  if (activeUserCount >= tenant.seatCount) {
    throw new SeatLimitExceededError(
      `Seat capacity exceeded: ${activeUserCount}/${tenant.seatCount} active users. ` +
      "Upgrade your subscription tier to add more users."
    );
  }
}

export async function enforceHotelSeatCapacity(hotelId: string): Promise<void> {
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    select: { maxUsers: true, id: true },
  });

  if (!hotel) {
    throw new SeatLimitExceededError("Hotel not found");
  }

  const activeUserCount = await prisma.user.count({
    where: {
      hotelId,
      status: { not: "INACTIVE" },
    },
  });

  if (activeUserCount >= hotel.maxUsers) {
    throw new SeatLimitExceededError(
      `Hotel seat capacity exceeded: ${activeUserCount}/${hotel.maxUsers}. ` +
      "Contact your tenant administrator to increase the limit."
    );
  }
}
