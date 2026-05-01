import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthorityRuleSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get("hotelId") || undefined;
    const role = searchParams.get("role") || undefined;

    const where: Record<string, unknown> = {};
    if (hotelId) where.hotelId = hotelId;
    if (role) where.role = role;

    const rules = await prisma.authorityRule.findMany({
      where,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: rules });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch authority rules" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = AuthorityRuleSchema.parse(body);

    const rule = await prisma.authorityRule.create({
      data: validated,
    });

    return NextResponse.json({ success: true, data: rule }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create authority rule" },
      { status: 500 }
    );
  }
}
