import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await prisma.factoringCompany.findUnique({
      where: { id },
      include: {
        creditFacilities: {
          include: {
            hotel: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch factoring company" },
      { status: 500 }
    );
  }
}
