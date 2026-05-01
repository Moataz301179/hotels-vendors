import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderCreateSchema, PaginationSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, sortOrder } = PaginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      sortOrder: searchParams.get("sortOrder") || "desc",
    });
    const hotelId = searchParams.get("hotelId") || undefined;
    const supplierId = searchParams.get("supplierId") || undefined;
    const status = searchParams.get("status") || undefined;

    const where: Record<string, unknown> = {};
    if (hotelId) where.hotelId = hotelId;
    if (supplierId) where.supplierId = supplierId;
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: sortOrder },
        include: {
          hotel: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
          outlet: { select: { id: true, name: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, sku: true } },
            },
          },
          approvals: {
            include: {
              approver: { select: { id: true, name: true, role: true } },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = OrderCreateSchema.parse(body);

    const { items, ...orderData } = validated;

    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const vatAmount = subtotal * 0.14;
    const total = subtotal + vatAmount;

    const order = await prisma.order.create({
      data: {
        ...orderData,
        subtotal,
        vatAmount,
        total,
        items: {
          create: items.map((item) => ({
            ...item,
            total: item.unitPrice * item.quantity,
          })),
        },
      },
      include: {
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
        outlet: { select: { id: true, name: true } },
        items: {
          include: {
            product: { select: { id: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
