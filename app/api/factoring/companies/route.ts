import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FactoringCompanyStatus } from "@prisma/client";

export async function GET(_request: NextRequest) {
  try {
    const companies = await prisma.factoringCompany.findMany({
      where: { status: FactoringCompanyStatus.ACTIVE },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: companies });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch factoring companies" },
      { status: 500 }
    );
  }
}
