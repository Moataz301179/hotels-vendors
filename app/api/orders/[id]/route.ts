import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        hotel: true,
        supplier: true,
        items: {
          include: {
            product: { select: { id: true, name: true, sku: true, unitOfMeasure: true } },
          },
        },
        approvals: {
          orderBy: { createdAt: "desc" },
          include: {
            approver: { select: { id: true, name: true, role: true } },
          },
        },
        invoices: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
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
    const { status } = body;

    const order = await prisma.order.update({
      where: { id },
      data: { ...(status ? { status } : {}) },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true } },
          },
        },
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
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
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
