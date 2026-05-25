import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server-auth";
import { commitBudgetSpend, logGatekeeperEvent } from "@/lib/gatekeeper/engine";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const spendRequest = await prisma.spendRequest.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
      include: { items: true },
    });
    if (!spendRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (spendRequest.status !== "APPROVED") {
      return NextResponse.json({ error: "Can only convert APPROVED requests" }, { status: 400 });
    }

    // Generate order number
    const count = await prisma.order.count({ where: { tenantId: session.user.tenantId } });
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(6, "0")}`;

    // Create order from spend request
    const order = await prisma.order.create({
      data: {
        orderNumber,
        hotelId: spendRequest.hotelId,
        propertyId: spendRequest.propertyId,
        outletId: spendRequest.outletId,
        supplierId: spendRequest.preferredSupplierId || "",
        requesterId: spendRequest.requesterId,
        tenantId: spendRequest.tenantId,
        subtotal: spendRequest.subtotal,
        vatAmount: spendRequest.vatAmount,
        total: spendRequest.total,
        currency: spendRequest.currency,
        deliveryDate: spendRequest.deliveryDate,
        deliveryInstructions: spendRequest.deliveryInstructions,
        costCenter: spendRequest.costCenter,
        status: "PENDING_APPROVAL", // Goes through normal order flow
        OrderItem: {
          create: spendRequest.items.map((item: any) => ({
            productId: item.productId || "",
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            notes: item.description,
          })),
        },
      },
    });

    // Mark spend request as converted
    await prisma.spendRequest.update({
      where: { id: params.id },
      data: { status: "CONVERTED_TO_ORDER", convertedOrderId: order.id },
    });

    await logGatekeeperEvent(params.id, "CONVERTED_TO_ORDER", "PASS", null, {
      orderId: order.id,
      orderNumber,
    }, session.user.id);

    return NextResponse.json({ success: true, data: { orderId: order.id, orderNumber } });
  } catch (err: any) {
    console.error("[POST /api/v1/spend-requests/:id/convert]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
