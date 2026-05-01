import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, taxId, commercialReg } = await request.json();
    const result: {
      emailExists?: boolean;
      taxIdExists?: boolean;
      crValid?: boolean;
      suggestions?: string[];
    } = {};

    if (email) {
      const user = await prisma.user.findUnique({ where: { email } });
      const hotel = await prisma.hotel.findFirst({ where: { email } });
      const supplier = await prisma.supplier.findFirst({ where: { email } });
      result.emailExists = !!(user || hotel || supplier);
    }

    if (taxId) {
      const hotel = await prisma.hotel.findFirst({ where: { taxId } });
      const supplier = await prisma.supplier.findFirst({ where: { taxId } });
      result.taxIdExists = !!(hotel || supplier);
    }

    result.crValid = !!commercialReg && commercialReg.length >= 3;

    // Smart suggestions
    result.suggestions = [];
    if (!result.emailExists && !result.taxIdExists) {
      result.suggestions.push("Your details appear unique — proceed with registration.");
    }
    if (email && !email.includes("@")) {
      result.suggestions.push("Please enter a valid email address.");
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
