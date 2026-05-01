import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const outlets = await prisma.outlet.findMany({
      where: { propertyId: id },
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { id: true, name: true, hotelId: true } },
      },
    });

    return NextResponse.json({ success: true, data: outlets });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch property outlets" },
      { status: 500 }
    );
  }
}
