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

function requireAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const apiKey = process.env.INVO_SERVICE_KEY || "dev-key-insecure";
  return !!authHeader?.includes(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    if (!requireAuth(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, name, taxId, email, phone, contactName, address, categories, documents } = body;

    if (!type || !name || !taxId || !email) {
      return NextResponse.json(
        { success: false, error: "type, name, taxId, email required" },
        { status: 400 }
      );
    }

    const partner: Partner = {
      partnerId: `part_${Date.now()}`,
      type,
      name,
      taxId,
      email,
      phone: phone || "",
      contactName: contactName || "",
      address: address || "",
      categories: categories || [],
      documents: documents || [],
      status: "pending_review",
      submittedAt: new Date().toISOString(),
    };

    partners.push(partner);

    return NextResponse.json(
      {
        success: true,
        data: {
          partnerId: partner.partnerId,
          status: partner.status,
          submittedAt: partner.submittedAt,
          reviewUrl: `https://invo.hotelsvendors.com/partner/status/${partner.partnerId}`,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
