import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OutletCreateSchema } from "@/lib/zod";
import { ZodError } from "zod";
import { authenticate } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId") || undefined;

    const where: Record<string, unknown> = {};
    if (propertyId) where.propertyId = propertyId;

    const outlets = await prisma.outlet.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { id: true, name: true, hotelId: true } },
      },
    });

    return NextResponse.json({ success: true, data: outlets });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch outlets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = OutletCreateSchema.parse(body);

    const auth = await authenticate(request);
    const outlet = await prisma.outlet.create({
      data: { ...validated, tenantId: auth.tenantId },
      include: {
        property: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      { success: true, data: outlet },
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
      { success: false, error: "Failed to create outlet" },
      { status: 500 }
    );
  }
}
