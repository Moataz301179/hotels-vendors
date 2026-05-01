import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SupplierUpdateSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        products: true,
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { hotel: { select: { id: true, name: true } } },
        },
        _count: {
          select: { products: true, orders: true, audits: true },
        },
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: "Supplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: supplier });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch supplier" },
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
    const validated = SupplierUpdateSchema.parse(body);

    const supplier = await prisma.supplier.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json({ success: true, data: supplier });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update supplier" },
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
    await prisma.supplier.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete supplier" },
      { status: 500 }
    );
  }
}
