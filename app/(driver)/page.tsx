import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DriverHomeClient from "./DriverHomeClient";

const SESSION_COOKIE = "hv_session";
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

export default async function DriverHomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  let userId: string | null = null;
  let platformRole: string | null = null;
  let tenantId: string | null = null;
  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    userId = payload.userId as string;
    platformRole = payload.platformRole as string;
    tenantId = payload.tenantId as string;
  } catch {
    redirect("/login");
  }

  if (!userId || !tenantId) redirect("/login");

  // Get driver's carrier
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, carrierId: true, carrier: { select: { id: true, name: true } } },
  });

  if (!user?.carrierId) redirect("/login");

  // Today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [assignedCount, inTransitCount, deliveredCount, pendingGrns] = await Promise.all([
    prisma.deliveryJob.count({
      where: { carrierId: user.carrierId, status: "ASSIGNED", tenantId },
    }),
    prisma.deliveryJob.count({
      where: { carrierId: user.carrierId, status: { in: ["PICKED_UP", "IN_TRANSIT", "ARRIVED"] }, tenantId },
    }),
    prisma.deliveryJob.count({
      where: { carrierId: user.carrierId, status: "DELIVERED", deliveredAt: { gte: today }, tenantId },
    }),
    prisma.grn.count({
      where: { status: "PENDING_VERIFICATION", tenantId },
    }),
  ]);

  // Active trip for today
  const activeTrip = await prisma.trip.findFirst({
    where: {
      driverName: user.name,
      scheduledDate: { gte: today, lt: new Date(today.getTime() + 86400000) },
      status: { in: ["IN_TRANSIT", "LOADING"] },
    },
    include: {
      stops: {
        where: { status: { not: "DELIVERED" } },
        orderBy: { stopOrder: "asc" },
        take: 1,
        include: { hotel: { select: { name: true } } },
      },
    },
  });

  const stats = { assignedCount, inTransitCount, deliveredCount, pendingGrns };

  return (
    <DriverHomeClient
      driverName={user.name || "Driver"}
      carrierName={user.carrier?.name || ""}
      stats={stats}
      activeTrip={activeTrip ? {
        tripNumber: activeTrip.tripNumber,
        nextStop: activeTrip.stops[0] ? {
          hotelName: activeTrip.stops[0].hotel.name,
          stopOrder: activeTrip.stops[0].stopOrder,
          estimatedArrival: activeTrip.stops[0].estimatedArrival?.toISOString() || null,
        } : null,
      } : null}
    />
  );
}
