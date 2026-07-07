import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const verified = searchParams.get("verified");
    const competitorId = searchParams.get("competitorId") || undefined;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (verified !== null) where.verified = verified === "true";
    if (competitorId) where.competitorId = competitorId;

    const insights = await prisma.marketInsight.findMany({
      where,
      orderBy: [{ impactScore: "desc" }, { createdAt: "desc" }],
      include: {
        competitor: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: insights });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}
