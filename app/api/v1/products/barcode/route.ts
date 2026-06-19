import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { z } from "zod";

const BarcodeQuerySchema = z.object({
  barcode: z.string().min(3),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const { searchParams } = new URL(request.url);
  const { barcode } = BarcodeQuerySchema.parse(
    Object.fromEntries(searchParams.entries())
  );

  const product = await prisma.product.findFirst({
    where: {
      barcode,
      tenantId: auth.tenantId,
    },
    include: {
      supplier: { select: { id: true, name: true } },
    },
  });

  if (!product) {
    return error("Product not found for this barcode", 404);
  }

  return success({ product });
});
