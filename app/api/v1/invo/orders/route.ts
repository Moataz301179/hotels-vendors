import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/v1/invo/orders
 * Creates an order in Supabase (Invo marketplace layer).
 * The HotelsVendors (Prisma) layer syncs via background reconciliation.
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

    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        hotel_id,
        supplier_id,
        total_value,
        currency,
        procurement_state: "draft",
        maker_user_id: maker_user_id || null,
      })
      .select()
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: `Order creation failed: ${error?.message}` },
        { status: 500 }
      );
    }

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
 * List orders from Supabase with optional filtering.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hotel_id = searchParams.get("hotel_id");
    const supplier_id = searchParams.get("supplier_id");
    const state = searchParams.get("state");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const supabase = await createClient();
    let query = supabase
      .from("orders")
      .select("*, hotels(name), suppliers(name)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (hotel_id) query = query.eq("hotel_id", hotel_id);
    if (supplier_id) query = query.eq("supplier_id", supplier_id);
    if (state) query = query.eq("procurement_state", state);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
