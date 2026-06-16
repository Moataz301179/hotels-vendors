import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

// Partners stored in database via the supplier/hotel models
// This endpoint creates a lead record for review

function requireAuth(request: NextRequest): { authorized: boolean; error?: string } {
  const authHeader = request.headers.get("authorization");
  const apiKey = process.env.INVO_SERVICE_KEY;
  if (!apiKey) {
    return { authorized: false, error: "Service key not configured" };
  }
  if (!authHeader?.includes(apiKey)) {
    return { authorized: false, error: "Unauthorized" };
  }
  return { authorized: true };
}

export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (!authResult.authorized) {
      return NextResponse.json({ success: false, error: authResult.error || "Unauthorized" }, { status: 401 });
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

    // Persist to database via Supplier model (PENDING status for admin review)
    try {
      // Find platform tenant
      const platformTenant = await prisma.tenant.findUnique({ where: { slug: "platform" } });
      
      if (platformTenant) {
        await prisma.supplier.create({
          data: {
            name: name,
            taxId: taxId,
            email: email,
            phone: phone || "",
            city: address?.split(",")[0]?.trim() || "Unknown",
            governorate: address?.split(",")[1]?.trim() || "Unknown",
            address: address || "",
            status: "PENDING",
            tier: "CORE",
            type: type === "supplier" ? "WHOLESALER" : "FACTORY",
            tenantId: platformTenant.id,
            description: contactName ? "Contact: " + contactName : null,
          },
        });
      }
    } catch (dbError) {
      console.error("[Partner Onboard] DB persistence failed:", dbError);
      // Non-blocking: continue even if DB fails
    }

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
