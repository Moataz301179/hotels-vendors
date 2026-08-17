import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { authenticate, requirePermission } from "@/lib/api-utils";

const SettlementQuerySchema = z.object({
  hotel_id: z.string().optional(),
  factoring_request_id: z.string().optional(),
  status: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    await requirePermission(auth, "settlement:read");
    const { searchParams } = new URL(req.url);
    const parsed = SettlementQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid query" }, { status: 400 });
    const { hotel_id, factoring_request_id, status, limit } = parsed.data;
    const supabase = await createClient();
    let query = supabase.from("settlements").select("*, factoring_requests(*, hotels(name)), suppliers(name)").order("created_at", { ascending: false }).limit(limit);
    if (hotel_id) query = query.eq("hotel_id", hotel_id);
    if (factoring_request_id) query = query.eq("factoring_request_id", factoring_request_id);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ settlements: data || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
