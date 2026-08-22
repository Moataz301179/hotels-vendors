import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { authenticate, requirePermission } from "@/lib/api-utils";

const InvoOrdersQuerySchema = z.object({
  hotel_id: z.string().optional(),
  status: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    await requirePermission(auth, "invoice:read");

    const { searchParams } = new URL(req.url);
    const parsed = InvoOrdersQuerySchema.safeParse({
      hotel_id: searchParams.get("hotel_id"),
      status: searchParams.get("status"),
      limit: searchParams.get("limit"),
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }
    const { hotel_id, status, limit } = parsed.data;

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Orders service unavailable (Supabase not configured)" },
        { status: 503 }
      );
    }

    let query = supabase.from("v_procurement_status").select("*").limit(limit);
    if (hotel_id) query = query.eq("hotel_id", hotel_id);
    if (status) query = query.eq("procurement_state", status);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
