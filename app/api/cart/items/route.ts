import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CartItemCreateSchema } from "@/lib/zod";
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
    const validated = CartItemCreateSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: validated.productId },
    });
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id, hotelId: user.hotelId },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: validated.productId },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + validated.quantity;
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          total: newQuantity * product.unitPrice,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              unitPrice: true,
              images: true,
              category: true,
              supplier: { select: { id: true, name: true } },
            },
          },
        },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: validated.productId,
        quantity: validated.quantity,
        unitPrice: product.unitPrice,
        total: validated.quantity * product.unitPrice,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
            images: true,
            category: true,
            supplier: { select: { id: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Cart item POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
