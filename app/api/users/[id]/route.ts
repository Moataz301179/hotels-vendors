import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserUpdateSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        hotel: true,
        approvals: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            order: { select: { id: true, orderNumber: true, total: true } },
          },
        },
        _count: {
          select: { approvals: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
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
    const validated = UserUpdateSchema.parse(body);

    const user = await prisma.user.update({
      where: { id },
      data: validated,
      include: {
        hotel: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
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
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
