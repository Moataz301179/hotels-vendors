import { NextRequest, NextResponse } from "next/server";
import { apiRoute, authenticate } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const search = request.nextUrl.searchParams.get("search") || "";
  const category = request.nextUrl.searchParams.get("category") || undefined;
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20", 10);
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) where.category = category;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        supplier: { select: { name: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        price: p.unitPrice,
        quantity: p.stockQuantity,
        unit: p.unitOfMeasure,
        supplierName: p.supplier?.name,
        status: p.status,
        createdAt: p.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
});
