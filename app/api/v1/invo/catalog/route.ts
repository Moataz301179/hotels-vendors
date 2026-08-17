import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { authenticate, requirePermission } from "@/lib/api-utils";

const CatalogQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  supplier_id: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    await requirePermission(auth, "catalog:read");
    const { searchParams } = new URL(req.url);
    const parsed = CatalogQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid query parameters" }, { status: 400 });
    }
    const { category, search, supplier_id, min_price, max_price, limit, offset } = parsed.data;
    const supabase = await createClient();
    let query = supabase.from("products").select("*, suppliers(name, id, verified)").order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (category) query = query.eq("category", category);
    if (supplier_id) query = query.eq("supplier_id", supplier_id);
    if (min_price !== undefined) query = query.gte("unit_price", min_price);
    if (max_price !== undefined) query = query.lte("unit_price", max_price);
    if (search) query = query.ilike("name", `%${search}%`);
    const { data, error, count } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ products: data || [], total: count || data?.length || 0 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
