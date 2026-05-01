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
      { success: false, error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const invoice = await prisma.invoice.update({
      where: { id },
      data: body,
      include: {
        order: { select: { id: true, orderNumber: true } },
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
