import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authenticate, requirePermission } from "@/lib/api-utils";

/**
 * POST /api/v1/invo/orders
 * Creates an order in Supabase (Invo marketplace layer).
 * The HotelsVendors (Prisma) layer syncs via background reconciliation.
 */
export async function POST(req: NextRequest) {
  try {
    // TODO (security): Add unit tests for permission `order:create` and validate Supabase row-level tenant enforcement.
    const auth = await authenticate(req);
    await requirePermission(auth, "order:create");

    const body = await req.json();
    const { hotel_id, supplier_id, total_value, currency = "EGP", maker_user_id } = body;

    if (!hotel_id || !supplier_id || !total_value) {
      return NextResponse.json(
        { error: "Missing required fields: hotel_id, supplier_id, total_value" },
        { status: 400 }
      );
    }

    // TODO (tenant-hardening): Validate that hotel_id belongs to auth.tenantId before
    // inserting into Supabase. Without this check a caller can create an order for any
    // hotel_id. Add a Prisma lookup: `prisma.hotel.findFirst({ where: { id: hotel_id,
    // tenantId: auth.tenantId } })` and reject with 403 if not found. Track with #tenant-scope.
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
    const auth = await authenticate(req);
    await requirePermission(auth, "order:read");

    const { searchParams } = new URL(req.url);
    const hotel_id = searchParams.get("hotel_id");
    const supplier_id = searchParams.get("supplier_id");
    const state = searchParams.get("state");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // TODO (tenant-hardening): This Supabase query has no tenant-level filter. If Supabase
    // RLS is not enabled on the `orders` table, any authenticated caller can enumerate all
    // orders across all tenants by omitting hotel_id/supplier_id. The fix requires either:
    //   a) Supabase RLS policy scoped to the JWT tenant claim, or
    //   b) Resolving the caller's allowed hotel_ids from Prisma and adding an `.in("hotel_id", allowedIds)` filter.
    // Track with #tenant-scope.
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
