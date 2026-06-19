import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const CheckSchema = z.object({
  hotelId: z.string().min(1),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const { hotelId } = CheckSchema.parse(body);

  // Find all active auto-reorder rules for this hotel
  const rules = await prisma.autoReorderRule.findMany({
    where: { hotelId, isActive: true, tenantId: auth.tenantId },
    include: { product: { select: { id: true, name: true, sku: true } } },
  });

  const reorderNeeded: { rule: typeof rules[0]; currentStock: number }[] = [];

  for (const rule of rules) {
    // Calculate current stock from transactions
    const transactions = await prisma.stockTransaction.findMany({
      where: { productId: rule.productId },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    const currentStock = transactions.length > 0
      ? Number(transactions[0].balanceAfter)
      : 0;

    if (currentStock <= Number(rule.minStock)) {
      reorderNeeded.push({ rule, currentStock });
    }
  }

  // Create draft orders for items needing reorder
  const createdOrders = [];
  for (const item of reorderNeeded) {
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-AUTO-${Date.now()}-${item.rule.productId.slice(-6)}`,
        status: "DRAFT",
        subtotal: 0,
        vatAmount: 0,
        total: 0,
        tenantId: auth.tenantId,
        hotelId,
        supplierId: item.rule.supplierId || "",
        requesterId: auth.userId,
      },
    });

    await prisma.autoReorderRule.update({
      where: { id: item.rule.id },
      data: { lastTriggeredAt: new Date() },
    });

    createdOrders.push({
      orderId: order.id,
      orderNumber: order.orderNumber,
      productId: item.rule.productId,
      productName: item.rule.product.name,
      currentStock: item.currentStock,
      reorderQuantity: item.rule.reorderQuantity,
    });
  }

  await audit({
    entityType: "AUTO_REORDER",
    entityId: hotelId,
    action: "REORDER_CHECK_RUN",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { itemsChecked: rules.length, ordersCreated: createdOrders.length },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    checked: rules.length,
    reorderNeeded: createdOrders.length,
    orders: createdOrders,
  });
});
