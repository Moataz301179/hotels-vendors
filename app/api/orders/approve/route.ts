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

export async function POST(req: NextRequest) {
  try {
    const { orderId, action, approverId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { hotel: true, items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Authority check before approving (skip for reject)
    if (action === "APPROVE") {
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

    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus as any },
    });

    // Auto-post journal entry on approval
    if (action === "APPROVE") {
      const totalInventory = order.subtotal;
      const vatAmount = order.vatAmount;
      const totalPayable = order.total;

      const lines = [
        { accountCode: "1300", accountName: "Inventory / Purchases", debit: totalInventory, credit: 0 },
        { accountCode: "2400", accountName: "VAT Input", debit: vatAmount, credit: 0 },
        { accountCode: "2100", accountName: "Accounts Payable", debit: 0, credit: totalPayable },
      ];

      await prisma.journalEntry.create({
        data: {
          entryNumber: `JE-PO-${order.orderNumber}`,
          date: new Date(),
          sourceType: "ORDER",
          sourceId: order.id,
          description: `Auto-posted PO approval — ${order.orderNumber}`,
          lines: JSON.stringify(lines),
          totalDebit: totalInventory + vatAmount,
          totalCredit: totalPayable,
          status: "POSTED",
          hotelId: order.hotelId,
        },
      });
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
