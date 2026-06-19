import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { z } from "zod";

const BannerQuerySchema = z.object({
  placement: z.enum(["HOMEPAGE_HERO", "DASHBOARD_SIDEBAR", "CATALOG_TOP", "CHECKOUT_BOTTOM"]).optional(),
  audience: z.enum(["ALL", "HOTEL", "SUPPLIER"]).optional(),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const { searchParams } = new URL(request.url);
  const { placement, audience } = BannerQuerySchema.parse(
    Object.fromEntries(searchParams.entries())
  );

  const now = new Date();

  const banners = await prisma.banner.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
      ...(placement ? { placement } : {}),
      ...(audience ? { targetAudience: audience } : {}),
      OR: [
        { tenantId: null },
        { tenantId: auth.tenantId },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return success({ banners, count: banners.length });
});
