import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server-auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const spendRequest = await prisma.spendRequest.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
      include: {
        items: { include: { Product: { select: { name: true, sku: true, category: true } } } },
        Hotel: { select: { name: true, tier: true } },
        Property: { select: { name: true } },
        Outlet: { select: { name: true } },
        Requester: { select: { name: true, email: true, role: true } },
        ApprovedBy: { select: { name: true, email: true } },
        PreferredSupplier: { select: { name: true, complianceStatus: true, rating: true } },
        logs: { orderBy: { createdAt: "desc" }, include: { Actor: { select: { name: true } } } },
      },
    });

    if (!spendRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: spendRequest });
  } catch (err: any) {
    console.error("[GET /api/v1/spend-requests/:id]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.spendRequest.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
      include: { items: true },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.status !== "DRAFT") {
      return NextResponse.json({ error: "Can only edit DRAFT requests" }, { status: 400 });
    }
    if (existing.requesterId !== session.user.id && session.user.role !== "HOTEL_OWNER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { items, ...rest } = body;

    let subtotal = Number(existing.subtotal);
    if (items && Array.isArray(items)) {
      // Delete old items, create new
      await prisma.spendRequestItem.deleteMany({ where: { spendRequestId: params.id } });
      subtotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0);
      const vatAmount = subtotal * 0.14;
      const total = subtotal + vatAmount;

      const updated = await prisma.spendRequest.update({
        where: { id: params.id },
        data: {
          ...rest,
          subtotal,
          vatAmount,
          total,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice,
            })),
          },
        },
        include: { items: true },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const updated = await prisma.spendRequest.update({
      where: { id: params.id },
      data: rest,
      include: { items: true },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("[PATCH /api/v1/spend-requests/:id]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.spendRequest.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.status === "CONVERTED_TO_ORDER") {
      return NextResponse.json({ error: "Cannot delete converted request" }, { status: 400 });
    }
    if (existing.requesterId !== session.user.id && session.user.role !== "HOTEL_OWNER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Release budget reservation if exists
    if (existing.gatekeeperDecision && existing.status !== "REJECTED" && existing.status !== "CANCELLED") {
      const log = await prisma.spendGatekeeperLog.findFirst({
        where: { spendRequestId: params.id, event: "BUDGET_RESERVED" },
      });
      if (log?.details) {
        try {
          const details = JSON.parse(log.details);
          if (details.gateId) {
            const { releaseBudgetReservation } = await import("@/lib/gatekeeper/engine");
            await releaseBudgetReservation(details.gateId, Number(existing.total));
          }
        } catch { /* ignore */ }
      }
    }

    await prisma.spendRequest.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /api/v1/spend-requests/:id]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
