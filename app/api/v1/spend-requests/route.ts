import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server-auth";
import { z } from "zod";

const createSchema = z.object({
  hotelId: z.string(),
  propertyId: z.string().optional(),
  outletId: z.string().optional(),
  preferredSupplierId: z.string().optional(),
  deliveryDate: z.string().datetime().optional(),
  deliveryInstructions: z.string().optional(),
  costCenter: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().optional(),
    description: z.string().min(1),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const { hotelId, propertyId, outletId, preferredSupplierId, deliveryDate, deliveryInstructions, costCenter, items } = parsed.data;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const vatAmount = subtotal * 0.14; // 14% Egyptian VAT
    const total = subtotal + vatAmount;

    // Generate request number
    const count = await prisma.spendRequest.count({ where: { tenantId: session.user.tenantId } });
    const requestNumber = `SR-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

    const spendRequest = await prisma.spendRequest.create({
      data: {
        requestNumber,
        hotelId,
        propertyId,
        outletId,
        requesterId: session.user.id,
        tenantId: session.user.tenantId,
        subtotal,
        vatAmount,
        total,
        preferredSupplierId,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        deliveryInstructions,
        costCenter,
        status: "DRAFT",
        items: {
          create: items.map(item => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { items: true, Hotel: { select: { name: true } }, Requester: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ success: true, data: spendRequest }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/v1/spend-requests]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = { tenantId: session.user.tenantId };
    if (hotelId) where.hotelId = hotelId;
    if (status) where.status = status;

    // Role-based filtering
    if (session.user.platformRole === "HOTEL" && session.user.role !== "HOTEL_OWNER") {
      where.requesterId = session.user.id;
    }

    const [data, total] = await Promise.all([
      prisma.spendRequest.findMany({
        where,
        include: {
          items: { include: { Product: { select: { name: true, sku: true } } } },
          Hotel: { select: { name: true } },
          Requester: { select: { name: true, email: true } },
          ApprovedBy: { select: { name: true, email: true } },
          PreferredSupplier: { select: { name: true } },
          _count: { select: { logs: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.spendRequest.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err: any) {
    console.error("[GET /api/v1/spend-requests]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
