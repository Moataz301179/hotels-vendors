import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const ForecastAgentSchema = z.object({
  hotelId: z.string().min(1),
  productId: z.string().min(1).optional(),
  days: z.number().int().min(1).max(90).default(14),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const { hotelId, productId, days } = ForecastAgentSchema.parse(body);

  const swarmJob = await prisma.swarmJob.create({
    data: {
      queueName: "forecast",
      jobType: "demand_forecast",
      jobName: `forecast-${hotelId}`,
      payload: JSON.stringify({ hotelId, productId, days, requestedBy: auth.userId }),
      squad: "procurement",
      status: "PENDING",
      tenantId: auth.tenantId,
    },
  });

  const agentRun = await prisma.agentRun.create({
    data: {
      taskType: "demand_forecast",
      taskName: `forecast-${hotelId}`,
      prompt: JSON.stringify({ hotelId, productId, days }),
      agentName: "forecast-agent",
      status: "PENDING",
      tenantId: auth.tenantId,
    },
  });

  await audit({
    entityType: "AGENT_RUN",
    entityId: agentRun.id,
    action: "DEMAND_FORECAST_AGENT_STARTED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { hotelId, productId, days, swarmJobId: swarmJob.id, agentRunId: agentRun.id },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    swarmJobId: swarmJob.id,
    agentRunId: agentRun.id,
    status: "PENDING",
    message: "Demand forecast agent has been queued. Results will be available shortly.",
  }, 202);
});
