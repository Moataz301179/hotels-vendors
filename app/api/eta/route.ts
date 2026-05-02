import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaginationSchema } from "@/lib/zod";

function generateEtaUuid(): string {
  return "eta-" + crypto.randomUUID();
}

function generateDigitalSignature(): string {
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, sortOrder } = PaginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      sortOrder: searchParams.get("sortOrder") || "desc",
    });
    const hotelId = searchParams.get("hotelId") || undefined;

    const where: Record<string, unknown> = {};
    if (hotelId) where.hotelId = hotelId;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: sortOrder },
        include: {
          order: { select: { id: true, orderNumber: true } },
          hotel: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: invoices,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch ETA submissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId } = body;

    const etaUuid = generateEtaUuid();
    const digitalSignature = generateDigitalSignature();

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        etaUuid,
        digitalSignature,
        etaStatus: "ACCEPTED",
        status: "VALIDATED",
      },
      include: {
        order: { select: { id: true, orderNumber: true } },
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
          tenantId: invoice.tenantId,
        
        entityType: "INVOICE",
        entityId: invoiceId,
        action: "ETA_SUBMITTED",
        actorId: "system",
        afterState: JSON.stringify({ etaUuid, invoiceId }),
      },
    });

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit ETA" },
      { status: 500 }
    );
  }
}
