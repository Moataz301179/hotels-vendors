import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { apiRoute, authenticate, validateBody, success, error, requirePermission } from "@/lib/api-utils";

const CreateGrnSchema = z.object({
  orderId: z.string(),
  tripStopId: z.string().optional(),
  notes: z.string().optional(),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "grn:read");
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const where: Record<string, unknown> = { tenantId: auth.tenantId };
  if (status) where.status = status;

  const [grns, total] = await Promise.all([
    prisma.grn.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            supplier: { select: { name: true } },
          },
        },
        grnItems: { select: { id: true } },
      },
    }),
    prisma.grn.count({ where }),
  ]);

  return success({ grns, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "grn:create");
  const body = await request.json();
  const data = validateBody(CreateGrnSchema, body);

  const order = await prisma.order.findFirst({
    where: { id: data.orderId, tenantId: auth.tenantId },
    include: { orderItems: { include: { product: { select: { id: true } } } } },
  });

  if (!order) return error("Order not found", 404);

  // Generate GRN number
  const grnCount = await prisma.grn.count({ where: { tenantId: auth.tenantId } });
  const grnNumber = `GRN-${String(grnCount + 1).padStart(6, "0")}`;

  const grn = await prisma.grn.create({
    data: {
      grnNumber,
      status: "DRAFT",
      orderId: data.orderId,
      tripStopId: data.tripStopId || null,
      notes: data.notes || null,
      tenantId: auth.tenantId,
      grnItems: {
        create: order.orderItems.map((item) => ({
          orderItemId: item.id,
          productId: item.productId,
          expectedQuantity: item.quantity,
          receivedQuantity: 0,
          rejectedQuantity: 0,
        })),
      },
    },
    include: {
      order: true,
      grnItems: { include: { product: true } },
    },
  });

  return success({ grn }, 201);
});
