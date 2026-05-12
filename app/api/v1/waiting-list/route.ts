import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const waitingListSchema = z.object({
  email: z.string().email("Valid email is required"),
  role: z.enum(["HOTEL", "SUPPLIER", "LOGISTICS", "FACTORING"]),
  source: z.string().optional().default("beta-launch"),
  referrer: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = waitingListSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, role, source, referrer } = parsed.data;

    // Upsert: if email already exists for this source, update the role
    const entry = await prisma.waitingListEntry.upsert({
      where: {
        email_source: {
          email: email.toLowerCase().trim(),
          source,
        },
      },
      update: {
        role,
        status: "PENDING",
        updatedAt: new Date(),
      },
      create: {
        email: email.toLowerCase().trim(),
        role,
        source,
        referrer: referrer || undefined,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        entry: {
          id: entry.id,
          email: entry.email,
          role: entry.role,
          status: entry.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[WaitingList] POST error:", error);
    return NextResponse.json(
      { error: "Failed to join waiting list" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const source = searchParams.get("source") || undefined;
    const status = searchParams.get("status") || undefined;
    const role = searchParams.get("role") || undefined;

    const entries = await prisma.waitingListEntry.findMany({
      where: {
        ...(source && { source }),
        ...(status && { status: status as any }),
        ...(role && { role }),
      },
      orderBy: { createdAt: "desc" },
    });

    // Return counts by status and role for dashboard
    const counts = await prisma.waitingListEntry.groupBy({
      by: ["status", "role"],
      _count: { id: true },
    });

    return NextResponse.json({
      entries,
      counts,
      total: entries.length,
    });
  } catch (error) {
    console.error("[WaitingList] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch waiting list" },
      { status: 500 }
    );
  }
}
