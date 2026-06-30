import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, success, error } from "@/lib/api-utils";
import { dispatchAgentTask } from "@/lib/agents/procurement/executor";
import type { ProcurementAgentId, AgentTask } from "@/lib/agents/procurement/types";
import { z } from "zod";

const DispatchSchema = z.object({
  agentId: z.string(),
  type: z.string(),
  hotelId: z.string().optional(),
  supplierId: z.string().optional(),
  input: z.any(),
  metadata: z.record(z.unknown()).optional(),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "agent:dispatch");

  const body = await request.json();
  const data = DispatchSchema.parse(body);

  const task: AgentTask = {
    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    agentId: data.agentId as ProcurementAgentId,
    tenantId: auth.tenantId,
    hotelId: data.hotelId,
    supplierId: data.supplierId,
    type: data.type,
    input: data.input,
    status: "pending",
    metadata: data.metadata,
  };

  const result = await dispatchAgentTask(task);

  return success(result);
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agentId");

  const where: Record<string, unknown> = { tenantId: auth.tenantId };
  if (agentId) where.agentId = agentId;

  const jobs = await prisma.swarmJob.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return success(jobs);
});
