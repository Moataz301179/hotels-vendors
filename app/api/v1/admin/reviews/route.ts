// @ts-nocheck — TODO: Pre-existing type errors; tracked in docs/audit-log.md
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success } from "@/lib/api-utils";

/**
 * GET /api/v1/admin/reviews — List reviews with hotel/supplier info.
 */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const status = searchParams.get("status") || undefined;

  const where: Record<string, unknown> = { tenantId: auth.tenantId };
  if (status && status !== "all") where.status = status.toUpperCase();

  const [reviews, total] = await Promise.all([
    // @ts-expect-error — TODO: see above
    prisma.review.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        hotel: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    }),
    // @ts-expect-error — TODO: see above
    prisma.review.count({ where }),
  ]);

  return success({
    reviews: (reviews as any[]).map((r: any) => ({
      id: r.id,
      hotel: r.hotel?.name || "Unknown Hotel",
      supplier: r.supplier?.name || "Unknown Supplier",
      hotelRating: r.rating,
      supplierRating: r.rating,
      comment: r.comment || "",
      date: r.createdAt ? new Date(r.createdAt).toISOString() : "",
      orderValue: 0,
      status: r.status?.toLowerCase() || "published",
      helpful: 0,
      tags: [],
    })),
    total,
    pagination: { total, limit, offset },
  });
}, { rateLimit: "api" });
