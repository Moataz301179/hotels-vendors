import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || undefined;
    const governorate = searchParams.get("governorate") || undefined;

    const where: Record<string, unknown> = {};
    if (city) where.city = city;
    if (governorate) where.governorate = governorate;

    const hubs = await prisma.logisticsHub.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: hubs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch logistics hubs" },
      { status: 500 }
    );
  }
}
