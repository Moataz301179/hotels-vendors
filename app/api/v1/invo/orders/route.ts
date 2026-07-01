import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/v1/invo/orders
 * Creates an order in the Invo marketplace layer.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hotel_id, supplier_id, total_value, currency = "EGP", maker_user_id } = body;

    if (!hotel_id || !supplier_id || !total_value) {
      return NextResponse.json(
        { error: "Missing required fields: hotel_id, supplier_id, total_value" },
        { status: 400 }
      );
    }

    const order = await prisma.invoOrder.create({
      data: {
        hotelId: hotel_id,
        supplierId: supplier_id,
        totalValue: total_value,
        currency,
        procurementState: "draft",
        makerUserId: maker_user_id || null,
      },
    });

    return NextResponse.json({
      success: true,
      order,
      layer: "invo",
      message: "Order created in Invo marketplace layer",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * GET /api/v1/invo/orders
 * List orders from Invo marketplace with optional filtering.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hotel_id = searchParams.get("hotel_id");
    const supplier_id = searchParams.get("supplier_id");
    const state = searchParams.get("state");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: Record<string, unknown> = {};
    if (hotel_id) where.hotelId = hotel_id;
    if (supplier_id) where.supplierId = supplier_id;
    if (state) where.procurementState = state;

    const orders = await prisma.invoOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
