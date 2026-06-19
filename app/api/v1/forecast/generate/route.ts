import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const GenerateSchema = z.object({
  hotelId: z.string().min(1),
  productId: z.string().min(1).optional(),
  days: z.number().int().min(1).max(90).default(14),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const { hotelId, productId, days } = GenerateSchema.parse(body);

  const job = await prisma.swarmJob.create({
    data: {
      queueName: "forecast",
      jobType: "demand_forecast",
      jobName: `forecast-${hotelId}`,
      payload: JSON.stringify({ hotelId, productId, days }),
      squad: "procurement",
      status: "PENDING",
      tenantId: auth.tenantId,
    },
  });

  await audit({
    entityType: "DEMAND_FORECAST",
    entityId: job.id,
    action: "FORECAST_GENERATION_QUEUED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { hotelId, productId, days, jobId: job.id },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    jobId: job.id,
    status: "PENDING",
    message: "Demand forecast generation has been queued. Results will be available shortly.",
  }, 202);
});
