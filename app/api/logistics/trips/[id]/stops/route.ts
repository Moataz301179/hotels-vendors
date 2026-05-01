import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TripStopCreateSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = TripStopCreateSchema.parse(body);

    // Get trip to find hotel context
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { stops: true },
    });

    if (!trip) {
      return NextResponse.json(
        { success: false, error: "Trip not found" },
        { status: 404 }
      );
    }

    const stop = await prisma.tripStop.create({
      data: {
        tripId: id,
        hotelId: trip.hubId, // fallback; in real use case, derive from order
        orderId: validated.orderId,
        stopOrder: validated.stopNumber,
        stopNumber: validated.stopNumber,
        eta: validated.eta ? new Date(validated.eta) : null,
        estimatedArrival: validated.eta ? new Date(validated.eta) : null,
      },
      include: {
        trip: { select: { id: true, tripNumber: true } },
        hotel: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      { success: true, data: stop },
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
      { success: false, error: "Failed to add trip stop" },
      { status: 500 }
    );
  }
}
