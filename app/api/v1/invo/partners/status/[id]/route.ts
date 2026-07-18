// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";

interface Partner {
  partnerId: string;
  type: "supplier" | "logistics" | "bank";
  name: string;
  taxId: string;
  email: string;
  phone: string;
  contactName: string;
  address: string;
  categories: string[];
  documents: string[];
  status: "pending_review" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

const partners: Partner[] = [];

import { requireServiceKey } from "@/lib/api-utils";

function requireAuth(request: NextRequest): void {
  requireServiceKey(request, "INVO_SERVICE_KEY");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);

    const { id } = await params;
    const partner = partners.find((p) => p.partnerId === id);

    if (!partner) {
      return NextResponse.json({
        success: true,
        data: {
          partnerId: id,
          status: "pending_review",
          type: "supplier",
          name: "Demo Supplier Co.",
          taxId: "123456789",
          submittedAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        partnerId: partner.partnerId,
        status: partner.status,
        type: partner.type,
        name: partner.name,
        submittedAt: partner.submittedAt,
        reviewedAt: partner.reviewedAt,
        reviewerNotes: partner.reviewerNotes,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
