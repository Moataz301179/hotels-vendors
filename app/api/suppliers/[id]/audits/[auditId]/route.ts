import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SupplierAuditUpdateSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; auditId: string }> }
) {
  try {
    const { id, auditId } = await params;

    const audit = await prisma.supplierAudit.findFirst({
      where: { id: auditId, supplierId: id },
    });

    if (!audit) {
      return NextResponse.json(
        { success: false, error: "Audit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: audit });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; auditId: string }> }
) {
  try {
    const { id, auditId } = await params;
    const body = await request.json();
    const validated = SupplierAuditUpdateSchema.parse(body);

    const existing = await prisma.supplierAudit.findFirst({
      where: { id: auditId, supplierId: id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Audit not found" },
        { status: 404 }
      );
    }

    const data: Record<string, unknown> = {};
    if (validated.auditorName !== undefined) data.auditorName = validated.auditorName;
    if (validated.auditDate !== undefined) data.auditDate = new Date(validated.auditDate);
    if (validated.score !== undefined) data.score = validated.score;
    if (validated.status !== undefined) data.status = validated.status;
    if (validated.coldChainCompliant !== undefined) data.coldChainCompliant = validated.coldChainCompliant;
    if (validated.haccpCertified !== undefined) data.haccpCertified = validated.haccpCertified;
    if (validated.onSiteVisited !== undefined) data.onSiteVisited = validated.onSiteVisited;
    if (validated.labTested !== undefined) data.labTested = validated.labTested;
    if (validated.notes !== undefined) data.notes = validated.notes;

    const audit = await prisma.supplierAudit.update({
      where: { id: auditId },
      data,
    });

    return NextResponse.json({ success: true, data: audit });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update audit" },
      { status: 500 }
    );
  }
}
