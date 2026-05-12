import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    await prisma.creditLineApplication.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectedReason: body.reason,
      },
    });
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false, error: "Rejection failed" }, { status: 500 });
  }
}
