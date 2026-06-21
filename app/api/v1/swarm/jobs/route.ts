/**
 * GET /api/v1/swarm/jobs?limit=50 — List recent jobs
 * POST /api/v1/swarm/jobs — Create a new job
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, success, ApiError } from "@/lib/api-utils";
import { z } from "zod";

const CreateJobSchema = z.object({
  agentId: z.string().min(1),
  jobType: z.string().min(1),
  prompt: z.string().min(1).max(5000),
  priority: z.number().min(1).max(10).optional().default(5),
});

export async function GET(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!auth) throw new ApiError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "50", 10));

    const jobs = await prisma.swarmJob.findMany({
      where: { tenantId: auth.tenantId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return success({ jobs });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticate(req);
    if (!auth) throw new ApiError("Unauthorized", 401);

    const body = await req.json();
    const { agentId, jobType, prompt, priority } = CreateJobSchema.parse(body);

    const job = await prisma.swarmJob.create({
      data: {
        queueName: "default",
        assignedAgent: agentId,
        squad: "general",
        jobType,
        jobName: `${jobType} — ${new Date().toLocaleString()}`,
        status: "PENDING",
        payload: prompt,
        priority,
        tenantId: auth.tenantId,
      },
    });

    return success({ job }, 201);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Failed to create job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
