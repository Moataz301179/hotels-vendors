import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const targetActor = searchParams.get("targetActor") || undefined;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (targetActor) where.targetActor = targetActor;

    const features = await prisma.featureProposal.findMany({
      where,
      orderBy: [{ moatScore: "desc" }, { votes: "desc" }],
    });

    return NextResponse.json({ success: true, data: features });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, votes, status } = body;

    const updated = await prisma.featureProposal.update({
      where: { id },
      data: {
        ...(votes !== undefined ? { votes } : {}),
        ...(status ? { status } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update feature" },
      { status: 500 }
    );
  }
}
