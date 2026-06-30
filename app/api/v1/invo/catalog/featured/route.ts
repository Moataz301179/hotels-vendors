import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, success } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "12", 10));

  const products = await prisma.product.findMany({
    where: {
      featured: true,
      featuredUntil: { gte: new Date() },
      status: "ACTIVE",
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      supplier: {
        select: { id: true, name: true, tier: true, rating: true, reviewCount: true, city: true },
      },
    },
  });

  return success(products);
});
