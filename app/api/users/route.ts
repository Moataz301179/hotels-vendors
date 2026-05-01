import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserCreateSchema, PaginationSchema } from "@/lib/zod";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, search, sortBy, sortOrder } = PaginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "20",
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    });
    const hotelId = searchParams.get("hotelId") || undefined;
    const role = searchParams.get("role") || undefined;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ];
    }
    if (hotelId) where.hotelId = hotelId;
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
          hotel: { select: { id: true, name: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = UserCreateSchema.parse(body);

    const user = await prisma.user.create({
      data: validated,
      include: {
        hotel: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
