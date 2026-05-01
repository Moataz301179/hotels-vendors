import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InvoiceCreateSchema, PaginationSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, sortOrder } = PaginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      sortOrder: searchParams.get("sortOrder") || "desc",
    });
    const hotelId = searchParams.get("hotelId") || undefined;
    const etaStatus = searchParams.get("etaStatus") || undefined;

    const where: Record<string, unknown> = {};
    if (hotelId) where.hotelId = hotelId;
    if (etaStatus) where.etaStatus = etaStatus;

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
      { success: false, error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = InvoiceCreateSchema.parse(body);

    const invoice = await prisma.invoice.create({
      data: validated,
      include: {
        order: { select: { id: true, orderNumber: true } },
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      { success: true, data: invoice },
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
      { success: false, error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
