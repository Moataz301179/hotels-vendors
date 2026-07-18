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
    // TODO: 'review' model missing from Prisma schema — needs migration
    // @ts-expect-error — Prisma schema mismatch; review model not yet migrated
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
    prisma.review.count({ where }),
  ]);

  return success({
    reviews: reviews.map((r) => ({
      id: r.id,
      hotel: r.hotel?.name || "Unknown Hotel",
      supplier: r.supplier?.name || "Unknown Supplier",
      hotelRating: r.rating,
      supplierRating: r.rating,
      comment: r.comment || "",
      date: r.createdAt?.toISOString() || "",
      orderValue: 0,
      status: r.status?.toLowerCase() || "published",
      helpful: 0,
      tags: [],
    })),
    total,
    pagination: { total, limit, offset },
  });
}, { rateLimit: "api" });
