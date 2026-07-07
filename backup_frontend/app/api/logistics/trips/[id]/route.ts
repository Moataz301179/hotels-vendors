import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TripUpdateSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        hub: { select: { id: true, name: true, city: true } },
        stops: {
          include: {
            hotel: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!trip) {
      return NextResponse.json(
        { success: false, error: "Trip not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: trip });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch trip" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = TripUpdateSchema.parse(body);

    const data: Record<string, unknown> = { ...validated };
    if (validated.scheduledDate) {
      data.scheduledDate = new Date(validated.scheduledDate);
    }
    if (validated.status === "COMPLETED") {
      data.completedAt = new Date();
    }

    const trip = await prisma.trip.update({
      where: { id },
      data,
      include: {
        hub: { select: { id: true, name: true, city: true } },
        stops: {
          include: {
            hotel: { select: { id: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: trip });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update trip" },
      { status: 500 }
    );
  }
}
