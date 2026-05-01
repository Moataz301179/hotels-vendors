import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ sku: string }> }) => {
  const auth = await authenticate(request);
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { sku } = resolved;

  const products = await prisma.product.findMany({
    where: { sku: { contains: sku } },
    orderBy: { unitPrice: "asc" },
    take: 20,
    include: { supplier: { select: { id: true, name: true, tier: true, city: true } } },
  });

  if (products.length === 0) {
    return error("No products found for SKU", 404);
  }

  const prices = products.map((p) => p.unitPrice);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return success({
    sku,
    benchmark: {
      average: avg,
      min,
      max,
      median: prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)],
      sampleSize: products.length,
    },
    products,
  });
});
