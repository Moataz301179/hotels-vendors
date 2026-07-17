import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ReferralLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role: "SUPPLIER" | "HOTEL";
  source: string;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, role } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (!["SUPPLIER", "HOTEL"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Role must be SUPPLIER or HOTEL" },
        { status: 400 }
      );
    }

    const id = "HV-OLIV-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();

    const lead = await prisma.leadCapture.create({
      data: {
        companyName: company || `${name} (Oliv Referral)`,
        email,
        sector: "HOSPITALITY",
        role,
        message: phone || undefined,
        source: "OLIV_REFERRAL_PAGE",
        status: "new",
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: lead.id, message: "Referral lead captured successfully" },
    });
  } catch (error) {
    console.error("Referral lead error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await prisma.leadCapture.findMany({
      where: { source: "OLIV_REFERRAL_PAGE" },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error("Fetch referral leads error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
