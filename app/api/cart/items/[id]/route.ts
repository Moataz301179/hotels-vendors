import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ZodError } from "zod";

const UpdateSchema = z.object({
  quantity: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = UpdateSchema.parse(body);

    if (validated.quantity !== undefined && validated.quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
      return NextResponse.json({ success: true, data: null });
    }

    const updateData: Record<string, unknown> = {};
    if (validated.quantity !== undefined) {
      updateData.quantity = validated.quantity;
    }

    const item = await prisma.cartItem.findUnique({
      where: { id },
      include: { product: { select: { unitPrice: true } } },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 }
      );
    }

    const quantity = validated.quantity ?? item.quantity;
    updateData.total = quantity * item.product.unitPrice;

    const updated = await prisma.cartItem.update({
      where: { id },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unitPrice: true,
            images: true,
            category: true,
            supplier: { select: { id: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Cart item PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart item" },
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
    await prisma.cartItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart item DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
