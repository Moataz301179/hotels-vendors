import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CartCheckoutSchema } from "@/lib/zod";
import { ZodError } from "zod";

const FALLBACK_USER_ID = "cm6zabc1230001xyz";

async function resolveUser(request: NextRequest) {
  const headerUserId = request.headers.get("x-user-id");
  if (headerUserId) {
    const user = await prisma.user.findUnique({ where: { id: headerUserId } });
    if (user) return user;
  }
  const user = await prisma.user.findFirst({
    where: { platformRole: "HOTEL" },
    orderBy: { createdAt: "asc" },
  });
  if (user) return user;
  return prisma.user.findUnique({ where: { id: FALLBACK_USER_ID } });
}

function generateOrderNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PO-${year}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const user = await resolveUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validated = CartCheckoutSchema.parse(body);

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                unitPrice: true,
                supplierId: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Validate all items belong to the selected supplier
    const mismatched = cart.items.filter(
      (item: typeof cart.items[0]) => item.product.supplierId !== validated.supplierId
    );
    if (mismatched.length > 0) {
      return NextResponse.json(
        { success: false, error: "Cart contains items from different suppliers. Please select a single supplier." },
        { status: 400 }
      );
    }

    const subtotal = cart.items.reduce((sum: number, item: typeof cart.items[0]) => sum + item.total, 0);
    const vatRate = 0.14;
    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          hotelId: cart.hotelId,
          supplierId: validated.supplierId,
          requesterId: user.id,
          tenantId: user.tenantId,
          propertyId: undefined,
          outletId: validated.outletId,
          status: "DRAFT",
          subtotal,
          vatAmount,
          total,
          deliveryDate: validated.deliveryDate ? new Date(validated.deliveryDate) : undefined,
          deliveryInstructions: validated.deliveryInstructions,
          items: {
            create: cart.items.map((item: typeof cart.items[0]) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
            })),
          },
        },
        include: {
          hotel: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, sku: true } },
            },
          },
        },
      });

      // Clear cart items after conversion
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Cart checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to checkout cart" },
      { status: 500 }
    );
  }
}
