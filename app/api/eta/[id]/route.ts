import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: { select: { id: true, name: true, sku: true } },
              },
            },
          },
        },
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch ETA record" },
      { status: 500 }
    );
  }
}
