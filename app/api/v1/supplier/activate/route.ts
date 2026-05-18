import { NextRequest, NextResponse } from "next/server";
import { claimShellSupplier } from "@/lib/supplier/shell-onboard";
import { z } from "zod";

const ActivateSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bankAccount: z.string().min(10, "Valid bank account is required"),
  bankName: z.string().min(2, "Bank name is required"),
  subscriptionPlan: z.enum(["BASIC", "PREMIUM", "ENTERPRISE"]).default("BASIC"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = ActivateSchema.parse(body);

    const result = await claimShellSupplier({
      token: data.token,
      passwordRaw: data.password,
      bankAccount: data.bankAccount,
      bankName: data.bankName,
      subscriptionPlan: data.subscriptionPlan,
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: result.user.id,
        supplierId: result.supplier.id,
        name: result.supplier.name,
        email: result.supplier.email,
        status: result.supplier.status,
        message: "Your shell account has been successfully claimed and activated.",
      },
    });
  } catch (error) {
    console.error("Shell activation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to activate shell account" },
      { status: 422 }
    );
  }
}
