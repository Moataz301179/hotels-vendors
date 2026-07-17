import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "referral-leads.json");

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

async function readLeads(): Promise<ReferralLead[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLeads(leads: ReferralLead[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf-8");
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

    const leads = await readLeads();

    const id = "HV-OLIV-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();

    const lead: ReferralLead = {
      id,
      name,
      email,
      phone: phone || "",
      company: company || "",
      role,
      source: "OLIV_REFERRAL_PAGE",
      createdAt: new Date().toISOString(),
    };

    leads.push(lead);
    await writeLeads(leads);

    return NextResponse.json({
      success: true,
      data: { id, message: "Referral lead captured successfully" },
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
  const leads = await readLeads();
  return NextResponse.json({ success: true, data: leads });
}
