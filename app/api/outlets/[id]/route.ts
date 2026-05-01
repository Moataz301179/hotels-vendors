import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OutletUpdateSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const outlet = await prisma.outlet.findUnique({
      where: { id },
      include: {
        property: { select: { id: true, name: true, hotelId: true } },
      },
    });

    if (!outlet) {
      return NextResponse.json(
        { success: false, error: "Outlet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: outlet });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch outlet" },
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
    const validated = OutletUpdateSchema.parse(body);

    const outlet = await prisma.outlet.update({
      where: { id },
      data: validated,
      include: {
        property: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: outlet });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update outlet" },
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
    await prisma.outlet.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete outlet" },
      { status: 500 }
    );
  }
}
