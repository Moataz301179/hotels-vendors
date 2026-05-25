import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server-auth";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  hotelId: z.string(),
  period: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL", "CUSTOM"]),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  totalBudget: z.number().positive(),
  categoryBudgets: z.record(z.number().positive()).optional(),
  warningThreshold: z.number().min(1).max(100).default(80),
  hardCap: z.boolean().default(true),
  allowRollover: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "HOTEL_OWNER" && session.user.role !== "CFO" && !session.user.canOverride) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const gate = await prisma.budgetGate.create({
      data: {
        name: data.name,
        hotelId: data.hotelId,
        tenantId: session.user.tenantId,
        period: data.period,
        periodStart: new Date(data.periodStart),
        periodEnd: new Date(data.periodEnd),
        totalBudget: data.totalBudget,
        categoryBudgets: data.categoryBudgets ? JSON.stringify(data.categoryBudgets) : null,
        categorySpent: data.categoryBudgets ? JSON.stringify(Object.fromEntries(Object.keys(data.categoryBudgets).map(k => [k, 0]))) : null,
        warningThreshold: data.warningThreshold,
        hardCap: data.hardCap,
        allowRollover: data.allowRollover,
      },
    });

    return NextResponse.json({ success: true, data: gate }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/v1/budget-gates]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId");
    const status = searchParams.get("status");

    const where: any = { tenantId: session.user.tenantId };
    if (hotelId) where.hotelId = hotelId;
    if (status) where.status = status;

    const gates = await prisma.budgetGate.findMany({
      where,
      include: {
        Hotel: { select: { name: true } },
        _count: { select: { SpendRequests: true } },
      },
      orderBy: { periodStart: "desc" },
    });

    return NextResponse.json({ success: true, data: gates });
  } catch (err: any) {
    console.error("[GET /api/v1/budget-gates]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
