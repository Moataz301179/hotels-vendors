import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { LoginSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = LoginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      include: { hotel: { select: { id: true, name: true } } },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(validated.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createSession(user.id, user.platformRole, user.hotelId);

    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: { user: userWithoutPassword, token },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to log in" },
      { status: 500 }
    );
  }
}
