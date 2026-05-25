import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server-auth";
import { evaluateSpendRequest, reserveBudget, logGatekeeperEvent } from "@/lib/gatekeeper/engine";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const spendRequest = await prisma.spendRequest.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
      include: { items: true, Hotel: true },
    });
    if (!spendRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (spendRequest.status !== "DRAFT" && spendRequest.status !== "SUBMITTED") {
      return NextResponse.json({ error: "Can only evaluate DRAFT or SUBMITTED requests" }, { status: 400 });
    }

    const result = await evaluateSpendRequest({
      hotelId: spendRequest.hotelId,
      tenantId: spendRequest.tenantId,
      requesterId: spendRequest.requesterId,
      requesterRole: session.user.role,
      total: spendRequest.total,
      subtotal: spendRequest.subtotal,
      vatAmount: spendRequest.vatAmount,
      items: spendRequest.items.map(i => ({
        productId: i.productId || undefined,
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.total,
      })),
      preferredSupplierId: spendRequest.preferredSupplierId || undefined,
      costCenter: spendRequest.costCenter || undefined,
      deliveryDate: spendRequest.deliveryDate || undefined,
    });

    // Update spend request with evaluation
    const newStatus = result.canAutoApprove ? "APPROVED" :
                      result.decision === "BLOCKED" ? "REJECTED" : "PENDING_APPROVAL";

    await prisma.spendRequest.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        gatekeeperDecision: result.decision,
        gatekeeperScore: result.score,
        gatekeeperReasons: JSON.stringify(result.reasons),
        gatekeeperEvaluatedAt: new Date(),
        requiredApproverRole: result.requiredApproverRole,
      },
    });

    // Log the evaluation
    await logGatekeeperEvent(params.id, "GATEKEEPER_EVALUATION", result.decision, result.score, {
      reasons: result.reasons,
      canAutoApprove: result.canAutoApprove,
      requiredApproverRole: result.requiredApproverRole,
      budgetImpact: result.budgetImpact,
    }, session.user.id);

    // Reserve budget if not blocked
    if (result.decision !== "BLOCKED" && result.budgetImpact.gateId) {
      const reserved = await reserveBudget(result.budgetImpact.gateId, Number(spendRequest.total));
      if (reserved) {
        await logGatekeeperEvent(params.id, "BUDGET_RESERVED", result.decision, result.score, {
          gateId: result.budgetImpact.gateId,
          amount: Number(spendRequest.total),
        }, session.user.id);
      } else {
        // Budget reservation failed — block the request
        await prisma.spendRequest.update({
          where: { id: params.id },
          data: { status: "REJECTED", gatekeeperDecision: "BLOCKED" },
        });
        await logGatekeeperEvent(params.id, "BUDGET_RESERVATION_FAILED", "BLOCKED", result.score, {
          gateId: result.budgetImpact.gateId,
          amount: Number(spendRequest.total),
        }, session.user.id);
        return NextResponse.json({
          success: false,
          data: { decision: "BLOCKED", score: result.score, reasons: [...result.reasons, "Budget reservation failed"] },
        });
      }
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("[POST /api/v1/spend-requests/:id/evaluate]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
