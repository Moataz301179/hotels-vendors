import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HotelUpdateSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        properties: true,
        users: true,
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { supplier: { select: { id: true, name: true } } },
        },
        _count: {
          select: { orders: true, properties: true, users: true },
        },
      },
    });

    if (!hotel) {
      return NextResponse.json(
        { success: false, error: "Hotel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: hotel });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch hotel" },
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
    const validated = HotelUpdateSchema.parse(body);

    const hotel = await prisma.hotel.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json({ success: true, data: hotel });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update hotel" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.hotel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete hotel" },
      { status: 500 }
    );
  }
}
