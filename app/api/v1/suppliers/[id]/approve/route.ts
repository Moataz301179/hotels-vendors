import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { tier = "CORE", notes = "" } = body;

    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      return NextResponse.json(
        { success: false, error: "Supplier not found" },
        { status: 404 }
      );
    }

    if (supplier.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: `Supplier is already ${supplier.status}` },
        { status: 400 }
      );
    }

    const updated = await prisma.supplier.update({
      where: { id },
      data: {
        status: "ACTIVE",
        tier: tier as "CORE" | "PREMIER" | "COASTAL" | "VERIFIED",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "SUPPLIER_APPROVED",
        entityType: "Supplier",
        entityId: id,
        actorId: "admin",
        tenantId: supplier.tenantId,
        afterState: JSON.stringify({ notes, tier }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: `${updated.name} has been approved and is now ACTIVE.`,
    });
  } catch (error) {
    console.error("Approve supplier error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to approve supplier" },
      { status: 500 }
    );
  }
}
