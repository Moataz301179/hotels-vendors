import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { z } from "zod";

const ForecastQuerySchema = z.object({
  hotelId: z.string().min(1),
  days: z.coerce.number().int().min(1).max(90).default(14),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const { searchParams } = new URL(request.url);
  const { hotelId, days } = ForecastQuerySchema.parse(
    Object.fromEntries(searchParams.entries())
  );

  const fromDate = new Date();
  const toDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const forecasts = await prisma.demandForecast.findMany({
    where: {
      hotelId,
      tenantId: auth.tenantId,
      forecastDate: { gte: fromDate, lte: toDate },
    },
    include: {
      product: { select: { id: true, name: true, sku: true } },
    },
    orderBy: { forecastDate: "asc" },
  });

  return success({ forecasts, days, count: forecasts.length });
});
