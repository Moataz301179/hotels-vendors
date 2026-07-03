import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/v1/invo/invoices
 * Creates an invoice in Supabase (Invo layer) with ETA compliance fields.
 * Triggers agent_1_ingestion audit log entry.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      hotel_id,
      supplier_id,
      face_value,
      currency = "EGP",
      issue_date,
      due_date,
    } = body;

    if (!order_id || !hotel_id || !supplier_id || !face_value) {
      return NextResponse.json(
        { error: "Missing required fields: order_id, hotel_id, supplier_id, face_value" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert({
        order_id,
        hotel_id,
        supplier_id,
        face_value,
        currency,
        issue_date: issue_date || new Date().toISOString().split("T")[0],
        due_date: due_date || null,
        workflow_state: "ingested",
        qualification_status: "pending_documents",
        fraud_gate_status: "pending",
        eta_status: "pending",
      })
      .select()
      .single();

    if (error || !invoice) {
      return NextResponse.json(
        { error: `Invoice creation failed: ${error?.message}` },
        { status: 500 }
      );
    }

    // Log agent audit entry
    await supabase.from("agent_audit_log").insert({
      agent_name: "agent_1_ingestion",
      action_executed: "invoice_created",
      invoice_id: invoice.id,
      previous_state: "none",
      new_state: "ingested",
    });

    return NextResponse.json({
      success: true,
      invoice,
      layer: "invo",
      message: "Invoice created and queued for agent processing",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * GET /api/v1/invo/invoices
 * List invoices from Supabase with filtering.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hotel_id = searchParams.get("hotel_id");
    const supplier_id = searchParams.get("supplier_id");
    const qualification = searchParams.get("qualification");
    const eta_status = searchParams.get("eta_status");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const supabase = await createClient();
    let query = supabase
      .from("invoices")
      .select("*, hotels(name), suppliers(name)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (hotel_id) query = query.eq("hotel_id", hotel_id);
    if (supplier_id) query = query.eq("supplier_id", supplier_id);
    if (qualification) query = query.eq("qualification_status", qualification);
    if (eta_status) query = query.eq("eta_status", eta_status);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invoices: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
