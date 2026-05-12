/**
 * Cashflow Compass API
 * GET: Latest market reading
 * POST: Generate new reading (admin/cron only)
 */

import { NextRequest } from "next/server";
import { cashflowCompass } from "@/lib/swarm/agents/cashflow-compass";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reading = await cashflowCompass.getLastReading();
    if (!reading) {
      const fresh = await cashflowCompass.generateReading();
      return Response.json({ success: true, data: fresh });
    }
    return Response.json({ success: true, data: reading });
  } catch (error) {
    console.error("Compass GET error:", error);
    return Response.json({ success: false, error: "Failed to fetch compass reading" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const force = body.force === true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!force) {
      const existing = await prisma.compassReading.findFirst({
        where: { date: { gte: today } },
        orderBy: { date: "desc" },
      }).catch(() => null);
      
      if (existing) {
        return Response.json({
          success: true,
          data: existing,
          message: "Today's reading already exists. Use force=true to regenerate.",
        });
      }
    }

    const reading = await cashflowCompass.generateReading();
    return Response.json({ success: true, data: reading });
  } catch (error) {
    console.error("Compass POST error:", error);
    return Response.json({ success: false, error: "Failed to generate compass reading" }, { status: 500 });
  }
}
