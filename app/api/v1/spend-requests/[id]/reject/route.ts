import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server-auth";
import { releaseBudgetReservation, logGatekeeperEvent } from "@/lib/gatekeeper/engine";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { reason } = body;

    const spendRequest = await prisma.spendRequest.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
    });
    if (!spendRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (spendRequest.status === "REJECTED" || spendRequest.status === "CONVERTED_TO_ORDER") {
      return NextResponse.json({ error: "Cannot reject this request" }, { status: 400 });
    }

    const canReject =
      session.user.role === "HOTEL_OWNER" ||
      session.user.role === "CFO" ||
      session.user.canOverride ||
      spendRequest.requesterId === session.user.id;

    if (!canReject) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.spendRequest.update({
      where: { id: params.id },
      data: { status: "REJECTED", rejectionReason: reason || null },
    });

    // Release budget reservation
    const log = await prisma.spendGatekeeperLog.findFirst({
      where: { spendRequestId: params.id, event: "BUDGET_RESERVED" },
    });
    if (log?.details) {
      try {
        const details = JSON.parse(log.details);
        if (details.gateId) {
          await releaseBudgetReservation(details.gateId, Number(spendRequest.total));
          await logGatekeeperEvent(params.id, "BUDGET_RELEASED", "PASS", null, {
            gateId: details.gateId,
            amount: Number(spendRequest.total),
          }, session.user.id);
        }
      } catch { /* ignore */ }
    }

    await logGatekeeperEvent(params.id, "REJECTION", "BLOCKED", null, {
      reason: reason || "No reason provided",
      rejectedBy: session.user.id,
      rejectedByRole: session.user.role,
    }, session.user.id);

    return NextResponse.json({ success: true, data: { status: "REJECTED" } });
  } catch (err: any) {
    console.error("[POST /api/v1/spend-requests/:id/reject]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
