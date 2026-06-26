import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  if (auth.platformRole !== "SHIPPING" && auth.platformRole !== "ADMIN") {
    return error("Only shipping users can access driver stats", 403);
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      name: true,
      email: true,
      carrierId: true,
      carrier: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user?.carrierId) {
    return error("No carrier assigned to this user", 400);
  }

  // Get latest trip info for profile
  const latestTrip = await prisma.trip.findFirst({
    where: { driverName: user.name },
    orderBy: { scheduledDate: "desc" },
    select: {
      driverPhone: true,
      vehiclePlate: true,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [assignedCount, inTransitCount, deliveredCount, pendingGrns] = await Promise.all([
    prisma.deliveryJob.count({
      where: { carrierId: user.carrierId, status: "ASSIGNED", tenantId: auth.tenantId },
    }),
    prisma.deliveryJob.count({
      where: {
        carrierId: user.carrierId,
        status: { in: ["PICKED_UP", "IN_TRANSIT", "ARRIVED"] },
        tenantId: auth.tenantId,
      },
    }),
    prisma.deliveryJob.count({
      where: {
        carrierId: user.carrierId,
        status: "DELIVERED",
        deliveredAt: { gte: today },
        tenantId: auth.tenantId,
      },
    }),
    prisma.grn.count({
      where: { status: "PENDING_VERIFICATION", tenantId: auth.tenantId },
    }),
  ]);

  return success({
    stats: { assignedCount, inTransitCount, deliveredCount, pendingGrns },
    profile: {
      name: user.name,
      email: user.email,
      carrierName: user.carrier?.name || "",
      driverPhone: latestTrip?.driverPhone || null,
      vehiclePlate: latestTrip?.vehiclePlate || null,
    },
  });
});
