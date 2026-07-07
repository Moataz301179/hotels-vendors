import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const entries = await prisma.journalEntry.findMany({
      orderBy: { date: "desc" },
      take: 100,
      include: { hotel: { select: { name: true } } },
    });

    return NextResponse.json({ success: true, data: entries });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
