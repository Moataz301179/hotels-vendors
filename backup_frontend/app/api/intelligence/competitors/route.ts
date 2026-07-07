import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const vertical = searchParams.get("vertical") || undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (vertical) where.vertical = vertical;

    const competitors = await prisma.competitor.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { insights: true } },
      },
    });

    return NextResponse.json({ success: true, data: competitors });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch competitors" },
      { status: 500 }
    );
  }
}
