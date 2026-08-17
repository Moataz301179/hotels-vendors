import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { authenticate, requirePermission } from "@/lib/api-utils";

const FactoringQuerySchema = z.object({
  hotel_id: z.string().optional(),
  status: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const FactoringRequestSchema = z.object({
  invoice_id: z.string().min(1, "Invoice ID is required"),
  hotel_id: z.string().min(1, "Hotel ID is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("EGP"),
  factoring_company_id: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    await requirePermission(auth, "factoring:read");
    const { searchParams } = new URL(req.url);
    const parsed = FactoringQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid query" }, { status: 400 });
    const { hotel_id, status, limit } = parsed.data;
    const supabase = await createClient();
    let query = supabase.from("factoring_requests").select("*, hotels(name), factoring_companies(name)").order("created_at", { ascending: false }).limit(limit);
    if (hotel_id) query = query.eq("hotel_id", hotel_id);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ factoring_requests: data || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    await requirePermission(auth, "factoring:create");
    const body = await req.json();
    const parsed = FactoringRequestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid request body" }, { status: 400 });
    const { invoice_id, hotel_id, amount, currency, factoring_company_id } = parsed.data;
    const supabase = await createClient();
    const { data, error } = await supabase.from("factoring_requests").insert({ invoice_id, hotel_id, amount, currency, factoring_company_id: factoring_company_id || null, status: "pending_documents" }).select().single();
    if (error || !data) return NextResponse.json({ error: `Factoring request failed: ${error?.message}` }, { status: 500 });
    return NextResponse.json({ success: true, factoring_request: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
