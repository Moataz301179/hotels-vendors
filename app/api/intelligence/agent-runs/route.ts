import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const agentName = searchParams.get("agentName") || undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (agentName) where.agentName = agentName;

    const runs = await prisma.agentRun.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: runs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch agent runs" },
      { status: 500 }
    );
  }
}
