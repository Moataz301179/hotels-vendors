import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SupplierAuditCreateSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: "Supplier not found" },
        { status: 404 }
      );
    }

    const audits = await prisma.supplierAudit.findMany({
      where: { supplierId: id },
      orderBy: { auditDate: "desc" },
    });

    return NextResponse.json({ success: true, data: audits });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch audits" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = SupplierAuditCreateSchema.parse(body);

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: "Supplier not found" },
        { status: 404 }
      );
    }

    const audit = await prisma.supplierAudit.create({
      data: {
        supplierId: id,
        auditorName: validated.auditorName,
        auditDate: new Date(validated.auditDate),
        score: validated.score ?? null,
        status: validated.status,
        coldChainCompliant: validated.coldChainCompliant ?? null,
        haccpCertified: validated.haccpCertified ?? null,
        onSiteVisited: validated.onSiteVisited ?? null,
        labTested: validated.labTested ?? null,
        notes: validated.notes ?? null,
      },
    });

    return NextResponse.json(
      { success: true, data: audit },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create audit" },
      { status: 500 }
    );
  }
}
