import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_USER_ID = "cm6zabc1230001xyz";

async function resolveUser(request: NextRequest) {
  const headerUserId = request.headers.get("x-user-id");
  if (headerUserId) {
    const user = await prisma.user.findUnique({ where: { id: headerUserId } });
    if (user) return user;
  }
  // Fallback: find any hotel user
  const user = await prisma.user.findFirst({
    where: { platformRole: "HOTEL" },
    orderBy: { createdAt: "asc" },
  });
  if (user) return user;
  // Last resort: try fallback id
  return prisma.user.findUnique({ where: { id: FALLBACK_USER_ID } });
}

export async function GET(request: NextRequest) {
  try {
    const user = await resolveUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
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
          orderBy: { createdAt: "desc" },
        },
        hotel: { select: { id: true, name: true } },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          hotelId: user.hotelId || "",
          tenantId: user.tenantId,
        },
        include: {
          items: {
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
            orderBy: { createdAt: "desc" },
          },
          hotel: { select: { id: true, name: true } },
        },
      });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    const vatRate = 0.14;
    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;

    return NextResponse.json({
      success: true,
      data: {
        ...cart,
        summary: { subtotal, vatAmount, total, itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0) },
      },
    });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
