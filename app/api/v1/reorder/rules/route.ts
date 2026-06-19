import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { z } from "zod";

const CreateRuleSchema = z.object({
  hotelId: z.string().min(1),
  productId: z.string().min(1),
  supplierId: z.string().optional(),
  minStock: z.number().positive(),
  reorderQuantity: z.number().positive(),
  isActive: z.boolean().default(true),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get("hotelId");

  const rules = await prisma.autoReorderRule.findMany({
    where: {
      tenantId: auth.tenantId,
      ...(hotelId ? { hotelId } : {}),
    },
    include: {
      product: { select: { id: true, name: true, sku: true } },
      hotel: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return success({ rules, count: rules.length });
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const data = CreateRuleSchema.parse(body);

  const rule = await prisma.autoReorderRule.create({
    data: {
      hotelId: data.hotelId,
      productId: data.productId,
      supplierId: data.supplierId,
      minStock: data.minStock,
      reorderQuantity: data.reorderQuantity,
      isActive: data.isActive,
      tenantId: auth.tenantId,
    },
  });

  return success({ rule, message: "Auto-reorder rule created" }, 201);
});
