import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server-auth";
import { commitBudgetSpend, logGatekeeperEvent } from "@/lib/gatekeeper/engine";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const spendRequest = await prisma.spendRequest.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
      include: { items: true },
    });
    if (!spendRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (spendRequest.status !== "PENDING_APPROVAL" && spendRequest.status !== "GATEKEEPER_EVALUATING") {
      return NextResponse.json({ error: "Can only approve pending requests" }, { status: 400 });
    }

    // Authority check
    const canApprove =
      session.user.role === "HOTEL_OWNER" ||
      session.user.role === "CFO" ||
      session.user.canOverride ||
      (spendRequest.requiredApproverRole && session.user.role === spendRequest.requiredApproverRole);

    if (!canApprove) {
      return NextResponse.json({ error: "Insufficient authority to approve" }, { status: 403 });
    }

    await prisma.spendRequest.update({
      where: { id: params.id },
      data: {
        status: "APPROVED",
        approvedById: session.user.id,
        approvedAt: new Date(),
      },
    });

    // Commit budget spend
    const log = await prisma.spendGatekeeperLog.findFirst({
      where: { spendRequestId: params.id, event: "BUDGET_RESERVED" },
    });
    if (log?.details) {
      try {
        const details = JSON.parse(log.details);
        if (details.gateId) {
          await commitBudgetSpend(details.gateId, Number(spendRequest.total));
          await logGatekeeperEvent(params.id, "BUDGET_COMMITTED", "PASS", null, {
            gateId: details.gateId,
            amount: Number(spendRequest.total),
          }, session.user.id);
        }
      } catch { /* ignore */ }
    }

    await logGatekeeperEvent(params.id, "APPROVAL", "PASS", null, {
      approverRole: session.user.role,
      approverId: session.user.id,
    }, session.user.id);

    return NextResponse.json({ success: true, data: { status: "APPROVED" } });
  } catch (err: any) {
    console.error("[POST /api/v1/spend-requests/:id/approve]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
