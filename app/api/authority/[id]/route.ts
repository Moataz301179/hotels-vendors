import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rule = await prisma.authorityRule.findUnique({
      where: { id },
    });

    if (!rule) {
      return NextResponse.json(
        { success: false, error: "Rule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rule });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch rule" },
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

    const rule = await prisma.authorityRule.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: rule });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update rule" },
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
    await prisma.authorityRule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete rule" },
      { status: 500 }
    );
  }
}
