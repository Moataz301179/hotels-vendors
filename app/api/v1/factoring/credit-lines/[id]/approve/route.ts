import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { approvedLimit, approvedInterestRate } = body;

    await prisma.creditLineApplication.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedLimit,
        approvedInterestRate,
        approvedAt: new Date(),
      },
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false, error: "Approval failed" }, { status: 500 });
  }
}
