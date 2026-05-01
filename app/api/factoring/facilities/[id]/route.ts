import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreditFacilityUpdateSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = CreditFacilityUpdateSchema.parse(body);

    const data: Record<string, unknown> = { ...validated };
    if (validated.status === "ACTIVE") {
      data.approvedAt = new Date();
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      data.expiresAt = expiresAt;
    }

    const facility = await prisma.creditFacility.update({
      where: { id },
      data,
      include: {
        hotel: { select: { id: true, name: true } },
        factoringCompany: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: facility });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update credit facility" },
      { status: 500 }
    );
  }
}
