import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreditFacilityCreateSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId") || undefined;
    const status = searchParams.get("status") || undefined;

    const where: Record<string, unknown> = {};
    if (hotelId) where.hotelId = hotelId;
    if (status) where.status = status;

    const facilities = await prisma.creditFacility.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        hotel: { select: { id: true, name: true } },
        factoringCompany: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: facilities });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch credit facilities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreditFacilityCreateSchema.parse(body);

    const facility = await prisma.creditFacility.create({
      data: {
        ...validated,
        status: "PENDING",
        utilized: 0,
      },
      include: {
        hotel: { select: { id: true, name: true } },
        factoringCompany: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      { success: true, data: facility },
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
      { success: false, error: "Failed to create credit facility" },
      { status: 500 }
    );
  }
}
