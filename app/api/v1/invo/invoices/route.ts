import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/v1/invo/invoices
 * Creates an invoice in the Invo layer with ETA compliance fields.
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

    const invoice = await prisma.invoInvoice.create({
      data: {
        orderId: order_id,
        hotelId: hotel_id,
        supplierId: supplier_id,
        faceValue: face_value,
        currency,
        issueDate: issue_date || new Date().toISOString().split("T")[0],
        dueDate: due_date || null,
        workflowState: "ingested",
        qualificationStatus: "pending_documents",
        fraudGateStatus: "pending",
        etaStatus: "pending",
      },
    });

    // Log agent audit entry
    await prisma.agentAuditLog.create({
      data: {
        agentName: "agent_1_ingestion",
        actionExecuted: "invoice_created",
        invoiceId: invoice.id,
        previousState: "none",
        newState: "ingested",
      },
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
 * List invoices from Invo layer with filtering.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hotel_id = searchParams.get("hotel_id");
    const supplier_id = searchParams.get("supplier_id");
    const qualification = searchParams.get("qualification");
    const eta_status = searchParams.get("eta_status");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: Record<string, unknown> = {};
    if (hotel_id) where.hotelId = hotel_id;
    if (supplier_id) where.supplierId = supplier_id;
    if (qualification) where.qualificationStatus = qualification;
    if (eta_status) where.etaStatus = eta_status;

    const invoices = await prisma.invoInvoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ invoices });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
