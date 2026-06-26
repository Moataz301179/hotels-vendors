/**
 * Logistics Dashboard API
 *
 * Returns fleet KPIs, active trips, delivery jobs, temperature violations,
 * and driver status scoped to the user's tenant/carrier.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/server-auth";

export async function GET() {
  const user = await requireAuth();

  if (user.platformRole !== "SHIPPING" && user.platformRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tenantId = user.tenantId;

  try {
    const [assignedJobs, inTransit, completedToday, activeTrips] = await Promise.all([
      // Assigned jobs
      prisma.deliveryJob.count({
        where: {
          tenantId,
          status: { in: ["ASSIGNED", "ACCEPTED_BY_CARRIER"] },
        },
      }),
      // In transit
      prisma.deliveryJob.count({
        where: {
          tenantId,
          status: "IN_TRANSIT",
        },
      }),
      // Completed today
      prisma.deliveryJob.count({
        where: {
          tenantId,
          status: "DELIVERED",
          deliveredAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      // Active trips
      prisma.trip.findMany({
        where: {
          tenantId,
          status: { in: ["IN_TRANSIT", "LOADING"] },
        },
        orderBy: { scheduledDate: "asc" },
        take: 10,
        select: {
          id: true,
          tripNumber: true,
          driverName: true,
          vehiclePlate: true,
          status: true,
          scheduledDate: true,
          _count: { select: { stops: true } },
          stops: {
            where: { status: { in: ["PENDING", "ARRIVED"] } },
            orderBy: { stopOrder: "asc" },
            take: 1,
            select: {
              id: true,
              estimatedArrival: true,
              hotel: { select: { name: true } },
            },
          },
        },
      }),
    ]);

    // Fleet utilization = (active vehicles / total vehicles) * 100
    const totalCarriers = await prisma.carrier.count({
      where: { tenantId, status: "ACTIVE" },
    });
    const activeCarriers = await prisma.carrier.count({
      where: { tenantId, status: "ACTIVE" },
    });
    const fleetUtilization =
      totalCarriers > 0 ? Math.round((activeCarriers / totalCarriers) * 100) : 0;

    // Delivery jobs requiring attention (unassigned or high priority)
    const attentionJobs = await prisma.deliveryJob.findMany({
      where: {
        tenantId,
        status: { in: ["ASSIGNED", "FAILED"] },
        carrierId: null,
      },
      orderBy: { deliveryDate: "asc" },
      take: 10,
      select: {
        id: true,
        jobNumber: true,
        pickupAddress: true,
        deliveryAddress: true,
        status: true,
        deliveryDate: true,
        order: { select: { orderNumber: true } },
      },
    });

    // Temperature violations
    const tempViolations = await prisma.deliveryJob.findMany({
      where: {
        tenantId,
        tempViolation: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: {
        id: true,
        jobNumber: true,
        temperatureLog: true,
        updatedAt: true,
      },
    });

    // Driver status (from trips)
    const drivers = await prisma.trip.findMany({
      where: {
        tenantId,
        status: { in: ["IN_TRANSIT", "SCHEDULED", "LOADING"] },
      },
      select: {
        driverName: true,
        driverPhone: true,
        status: true,
        tripNumber: true,
      },
      take: 20,
    });

    // Fleet performance (last 7 days)
    const fleetData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(d.setHours(23, 59, 59, 999));

      const [completed, failed] = await Promise.all([
        prisma.deliveryJob.count({
          where: {
            tenantId,
            status: "DELIVERED",
            deliveredAt: { gte: dayStart, lte: dayEnd },
          },
        }),
        prisma.deliveryJob.count({
          where: {
            tenantId,
            status: "FAILED",
            updatedAt: { gte: dayStart, lte: dayEnd },
          },
        }),
      ]);

      fleetData.push({
        day: d.toLocaleString("en", { weekday: "short" }),
        completed,
        failed,
      });
    }

    return NextResponse.json({
      kpis: {
        assignedJobs,
        inTransit,
        completedToday,
        fleetUtilization,
      },
      trips: activeTrips.map((t) => ({
        id: t.id,
        tripNumber: t.tripNumber,
        driverName: t.driverName || "Unassigned",
        vehiclePlate: vehiclePlate || "N/A",
        nextStop: t.stops[0]?.hotel?.name || "Unknown",
        eta: t.stops[0]?.estimatedArrival?.toISOString() || "",
        status: t.status,
        stopsCompleted: t._count.stops,
        totalStops: t._count.stops,
      })),
      jobs: attentionJobs.map((j) => ({
        id: j.id,
        jobNumber: j.jobNumber,
        orderNumber: j.order?.orderNumber || "N/A",
        pickup: j.pickupAddress,
        delivery: j.deliveryAddress,
        status: j.status,
        assignedTo: null,
        priority: j.status === "FAILED" ? "high" as const : "normal" as const,
      })),
      tempViolations: tempViolations.map((v) => ({
        id: v.id,
        jobNumber: v.jobNumber,
        temperature: 0,
        required: 0,
        recordedAt: v.updatedAt.toISOString(),
        duration: "Unknown",
      })),
      drivers: drivers.map((d) => ({
        id: d.driverName || "unknown",
        name: d.driverName || "Unknown",
        status: d.status === "IN_TRANSIT" ? "on-trip" as const : "available" as const,
        currentJob: d.tripNumber,
      })),
      fleetData,
    });
  } catch (error) {
    console.error("[Dashboard API Logistics]", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
