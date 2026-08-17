import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { authenticate, requirePermission } from "@/lib/api-utils";

const InvoicesQuerySchema = z.object({
  hotel_id: z.string().optional(),
  supplier_id: z.string().optional(),
  status: z.string().optional(),
  eta_status: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    await requirePermission(auth, "invoice:read");
    const { searchParams } = new URL(req.url);
    const parsed = InvoicesQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid query" }, { status: 400 });
    const { hotel_id, supplier_id, status, eta_status, limit, offset } = parsed.data;
    const supabase = await createClient();
    let query = supabase.from("invoices").select("*, hotels(name), suppliers(name)").order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (hotel_id) query = query.eq("hotel_id", hotel_id);
    if (supplier_id) query = query.eq("supplier_id", supplier_id);
    if (status) query = query.eq("status", status);
    if (eta_status) query = query.eq("eta_status", eta_status);
    const { data, error, count } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ invoices: data || [], total: count || data?.length || 0 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
