import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function checkAuthority(
  hotelId: string | null,
  approverId: string,
  total: number
): Promise<{
  canApprove: boolean;
  requireHigherAuthority: boolean;
  action?: string;
  routeToRole?: string | null;
  message?: string;
}> {
  const approver = await prisma.user.findUnique({
    where: { id: approverId },
    select: { role: true },
  });

  if (!approver) {
    return { canApprove: false, requireHigherAuthority: true, message: "Approver not found" };
  }

  const rules = await prisma.authorityRule.findMany({
    where: {
      hotelId: hotelId || null,
      role: approver.role,
      minValue: { lte: total },
      maxValue: { gte: total },
      isActive: true,
    },
    orderBy: { priority: "desc" },
  });

  if (rules.length === 0) {
    return {
      canApprove: false,
      requireHigherAuthority: true,
      message: "No authority rule matches this order. Route to higher approver.",
    };
  }

  const topRule = rules[0];
  const canApprove = ["APPROVE", "AUTO_APPROVE", "DUAL_SIGN_OFF"].includes(topRule.action);

  return {
    canApprove,
    requireHigherAuthority: !canApprove,
    action: topRule.action,
    routeToRole: topRule.routeToRole,
    message: canApprove ? undefined : `Insufficient authority. Route to ${topRule.routeToRole || "higher approver"}.`,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { approverId, action } = body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, category: true } },
          },
        },
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true, tier: true } },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Authority check before approving (skip for reject)
    if (action !== "REJECT") {
      const authority = await checkAuthority(order.hotelId, approverId, order.total);
      if (!authority.canApprove) {
        return NextResponse.json(
          {
            success: false,
            error: authority.message || "Insufficient authority",
            requireHigherAuthority: true,
            routeToRole: authority.routeToRole,
          },
          { status: 403 }
        );
      }
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id },
        data: {
          status: action === "REJECT" ? "REJECTED" : "APPROVED",
        },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true } },
            },
          },
          hotel: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
        },
      });

      await tx.orderApproval.create({
        data: {
          orderId: id,
          approverId,
          action: action === "REJECT" ? "REJECTED" : "APPROVED",
        },
      });

      await tx.auditLog.create({
        data: {
          entityType: "ORDER",
          entityId: id,
          action: action === "REJECT" ? "ORDER_REJECTED" : "ORDER_APPROVED",
          actorId: approverId,
          tenantId: order.tenantId,
          afterState: JSON.stringify({
            orderId: id,
            status: action === "REJECT" ? "REJECTED" : "APPROVED",
            action,
          }),
        },
      });

      // Auto-post journal entry on approval
      if (action !== "REJECT") {
        const lines = [
          { accountCode: "1300", accountName: "Inventory / Purchases", debit: updated.subtotal, credit: 0 },
          { accountCode: "2400", accountName: "VAT Input", debit: updated.vatAmount, credit: 0 },
          { accountCode: "2100", accountName: "Accounts Payable", debit: 0, credit: updated.total },
        ];
        await tx.journalEntry.create({
          data: {
            entryNumber: `JE-PO-${updated.orderNumber}`,
            date: new Date(),
            sourceType: "ORDER",
            sourceId: updated.id,
            description: `Auto-posted PO approval — ${updated.orderNumber}`,
            lines: JSON.stringify(lines),
            totalDebit: updated.subtotal + updated.vatAmount,
            totalCredit: updated.total,
            status: "POSTED",
            hotelId: updated.hotelId,
            tenantId: updated.tenantId,
          },
        });
      }

      return updated;
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process approval" },
      { status: 500 }
    );
  }
}
