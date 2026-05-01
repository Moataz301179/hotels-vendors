import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TripCreateSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hubId = searchParams.get("hubId") || undefined;
    const status = searchParams.get("status") || undefined;

    const where: Record<string, unknown> = {};
    if (hubId) where.hubId = hubId;
    if (status) where.status = status;

    const trips = await prisma.trip.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        hub: { select: { id: true, name: true, city: true } },
        stops: {
          include: {
            hotel: { select: { id: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: trips });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = TripCreateSchema.parse(body);

    const tripNumber = `TRIP-${Date.now()}`;
    const trip = await prisma.trip.create({
      data: {
        ...validated,
        tripNumber,
        scheduledDate: new Date(validated.scheduledDate),
      },
      include: {
        hub: { select: { id: true, name: true, city: true } },
        stops: true,
      },
    });

    return NextResponse.json(
      { success: true, data: trip },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create trip" },
      { status: 500 }
    );
  }
}
