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

// In-memory store shared with onboard route (simplified)
const partners: Partner[] = [];

function requireAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const apiKey = process.env.INVO_SERVICE_KEY || "dev-key-insecure";
  return !!authHeader?.includes(apiKey);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!requireAuth(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const partner = partners.find((p) => p.partnerId === id);

    if (!partner) {
      // Return mock data for demo
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
