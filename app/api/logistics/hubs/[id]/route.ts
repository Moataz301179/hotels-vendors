import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TripStatus } from "@prisma/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hub = await prisma.logisticsHub.findUnique({
      where: { id },
      include: {
        trips: {
          where: {
            status: { in: [TripStatus.SCHEDULED, TripStatus.LOADING, TripStatus.IN_TRANSIT] },
          },
          orderBy: { scheduledDate: "asc" },
          include: {
            stops: {
              include: {
                hotel: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });

    if (!hub) {
      return NextResponse.json(
        { success: false, error: "Hub not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: hub });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch logistics hub" },
      { status: 500 }
    );
  }
}
