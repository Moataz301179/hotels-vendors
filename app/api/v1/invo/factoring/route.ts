import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/v1/invo/factoring
 * Creates a factoring request from a qualified invoice.
 * Triggers agent_4_routing for funder matching.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      invoice_id,
      hotel_id,
      face_value,
      creditor_name,
      debtor_name,
      maturity_date,
    } = body;

    if (!invoice_id || !hotel_id || !face_value) {
      return NextResponse.json(
        { error: "Missing required fields: invoice_id, hotel_id, face_value" },
        { status: 400 }
      );
    }

    // Check invoice qualification
    const qualification = await prisma.invoiceQualification.findUnique({
      where: { invoiceId: invoice_id },
    });

    if (qualification && !qualification.factoringEligible) {
      return NextResponse.json(
        { error: "Invoice is not eligible for factoring", qualification },
        { status: 422 }
      );
    }

    const request = await prisma.invoFactoringRequest.create({
      data: {
        invoiceId: invoice_id,
        hotelId: hotel_id,
        faceValue: face_value,
        creditorName: creditor_name || null,
        debtorName: debtor_name || null,
        maturityDate: maturity_date || null,
        status: "bidding_open",
        matchStatus: "not_submitted",
      },
    });

    // Log agent audit entry
    await prisma.agentAuditLog.create({
      data: {
        agentName: "agent_4_routing",
        actionExecuted: "factoring_request_created",
        invoiceId: invoice_id,
        previousState: "qualified",
        newState: "bidding_open",
      },
    });

    return NextResponse.json({
      success: true,
      request,
      layer: "invo",
      message: "Factoring request created — funders can now bid",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * GET /api/v1/invo/factoring
 * List factoring requests with bids.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hotel_id = searchParams.get("hotel_id");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: Record<string, unknown> = {};
    if (hotel_id) where.hotelId = hotel_id;
    if (status) where.status = status;

    const requests = await prisma.invoFactoringRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { bids: true },
    });

    return NextResponse.json({ requests });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
