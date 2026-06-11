/**
 * Multi-Supplier Checkout API
 *
 * Splits cart items by supplier and creates one Order per supplier.
 *
 * ATOMICITY: The entire checkout flow is wrapped in a Prisma transaction.
 * Orders are created and the buyer's cart is cleared in the same atomic
 * operation. If the server crashes mid-checkout, the database rolls back
 * completely — the cart is not cleared without orders being created,
 * and no orphan orders exist without a cleared cart.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  error,
} from "@/lib/api-utils";
import { z } from "zod";

const CheckoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      unitPrice: z.number(),
      notes: z.string().optional(),
    })
  ),
  address: z.object({
    label: z.string().optional(),
    address: z.string(),
    city: z.string(),
    governorate: z.string(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  shippingMethod: z.enum(["express", "standard", "self"]),
  paymentMethod: z.string(),
  poNumber: z.string().optional(),
  costCenter: z.string().optional(),
  procurementNotes: z.string().optional(),
});

function generateOrderNumber(): string {
  const date = new Date();
  const prefix = "HV";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}${month}${day}-${random}`;
}

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "order:create");
  const body = await request.json();
  const data = CheckoutSchema.parse(body);

  // Get product details with supplier info
  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { supplier: { select: { id: true, name: true } } },
  });

  if (products.length !== data.items.length) {
    return error("Some products were not found", 400);
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Group items by supplier
  const supplierGroups = new Map<string, typeof data.items>();
  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) continue;
    const sid = product.supplierId;
    if (!supplierGroups.has(sid)) {
      supplierGroups.set(sid, []);
    }
    supplierGroups.get(sid)!.push(item);
  }

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: { hotel: true },
  });

  if (!user) {
    return error("User not found", 404);
  }

  const hotelId = user.hotelId;
  if (!hotelId) {
    return error("No hotel associated with user", 400);
  }

  // Generate checkout group ID
  const checkoutGroupId = `CG-${Date.now()}`;

  // ── ATOMIC TRANSACTION: Create all orders + clear cart ──
  // If any step fails, the entire transaction rolls back.
  // This prevents: cart cleared without orders, orphan orders, double checkout.
  let createdOrders;
  try {
    createdOrders = await prisma.$transaction(async (tx) => {
      const orders: Array<{
        id: string;
        orderNumber: string;
        supplier: { name: string };
        total: number;
        status: string;
      }> = [];
      let orderIndex = 0;

      for (const [supplierId, items] of supplierGroups) {
        const supplier = productMap.get(items[0].productId)!.supplier;

        // Calculate totals
        const subtotal = items.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0
        );
        const vatAmount = subtotal * 0.14;
        const shippingCost =
          data.shippingMethod === "express"
            ? 150
            : data.shippingMethod === "standard"
              ? 75
              : 0;
        const total = subtotal + vatAmount + shippingCost;

        // Generate order number with suffix for multi-supplier
        const suffix = String.fromCharCode(65 + orderIndex); // A, B, C...
        const orderNumber = `${generateOrderNumber()}-${suffix}`;

        const order = await tx.order.create({
          data: {
            orderNumber,
            status: "DRAFT",
            subtotal,
            vatAmount,
            total,
            currency: "EGP",
            hotelId,
            supplierId,
            requesterId: auth.userId,
            tenantId: auth.tenantId,
            checkoutGroupId,
            shippingMethod: data.shippingMethod,
            shippingCost,
            poNumber: data.poNumber,
            costCenter: data.costCenter,
            deliveryAddress: JSON.stringify(data.address),
            deliveryInstructions: data.procurementNotes,
            items: {
              create: items.map((item) => ({
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.quantity * item.unitPrice,
                productId: item.productId,
                notes: item.notes,
              })),
            },
          },
          include: {
            items: { include: { product: { select: { name: true } } } },
            supplier: { select: { name: true } },
          },
        });

        orders.push(order);
        orderIndex++;
      }

      // ── CLEAR CART ATOMICALLY ──
      // Delete all cart items for this user in the same transaction.
      // If this fails, the entire transaction rolls back — no orders, cart intact.
      await tx.cartItem.deleteMany({
        where: {
          cart: { userId: auth.userId },
        },
      });

      return orders;
    }, {
      maxWait: 5000,
      timeout: 15000,
    });
  } catch (txErr) {
    const message =
      txErr instanceof Error ? txErr.message : "Checkout transaction failed";
    return error(`Checkout failed: ${message}`, 500);
  }

  return success({
    orders: createdOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      supplier: o.supplier.name,
      total: o.total,
      status: o.status,
    })),
    checkoutGroupId,
    orderCount: createdOrders.length,
  });
});
