import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { transformManyToMarketplace } from "@/lib/marketplace/category-mapper";
import { apiRoute, authenticate, requirePermission, success } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  await authenticate(request);

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      supplier: {
        select: {
          id: true,
          name: true,
          tier: true,
          rating: true,
          reviewCount: true,
          city: true,
          description: true,
        },
      },
    },
  });

  if (!product) {
    return Response.json(
      { success: false, error: "Product not found" },
      { status: 404 },
    );
  }

  const [marketplaceProduct] = transformManyToMarketplace([product as Parameters<typeof transformManyToMarketplace>[0][0]]);

  return success({ product: marketplaceProduct });
});
