import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hotelId, role, total, category, supplierTier } = body;

    const rules = await prisma.authorityRule.findMany({
      where: {
        hotelId: hotelId || null,
        role,
        minValue: { lte: total },
        maxValue: { gte: total },
        category: category || null,
        supplierTier: supplierTier || null,
      },
      orderBy: { priority: "desc" },
    });

    if (rules.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          canApprove: false,
          canReject: false,
          message: "No authority rule matches this order. Route to higher approver.",
        },
      });
    }

    const topRule = rules[0];
    const canApprove = ["APPROVE", "AUTO_APPROVE", "DUAL_SIGN_OFF"].includes(topRule.action);
    const canReject = ["REJECT"].includes(topRule.action);

    return NextResponse.json({
      success: true,
      data: {
        canApprove,
        canReject,
        action: topRule.action,
        routeToRole: topRule.routeToRole,
        ruleId: topRule.id,
        ruleName: topRule.name,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to check authority" },
      { status: 500 }
    );
  }
}
