import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, requirePermission } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "delivery:read");
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const where: Record<string, unknown> = { tenantId: auth.tenantId };
  if (status) where.status = status;

  if (auth.platformRole === "SHIPPING") {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { carrierId: true },
    });
    if (user?.carrierId) where.carrierId = user.carrierId;
  }

  const [deliveries, total] = await Promise.all([
    prisma.deliveryJob.findMany({
      where,
      orderBy: { deliveryDate: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        order: { select: { id: true, orderNumber: true } },
        carrier: { select: { id: true, name: true } },
        tripStop: { select: { id: true, hotel: { select: { id: true, name: true } } } },
        otpDelivery: { select: { id: true, status: true, expiresAt: true } },
      },
    }),
    prisma.deliveryJob.count({ where }),
  ]);

  return success({ deliveries, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});
