import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HotelCreateSchema, HotelUpdateSchema, PaginationSchema } from "@/lib/zod";
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

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { legalName: { contains: search, mode: "insensitive" as const } },
            { taxId: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [hotels, total] = await Promise.all([
      prisma.hotel.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
          properties: {
            select: { id: true, name: true, city: true, type: true },
          },
          users: {
            select: { id: true, name: true, role: true, status: true },
          },
          _count: { select: { orders: true, properties: true, users: true } },
        },
      }),
      prisma.hotel.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: hotels,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch hotels" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = HotelCreateSchema.parse(body);

    const hotel = await prisma.hotel.create({
      data: validated,
    });

    return NextResponse.json({ success: true, data: hotel }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create hotel" },
      { status: 500 }
    );
  }
}
