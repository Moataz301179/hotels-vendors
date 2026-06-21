/**
 * POST /api/v1/swarm/jobs/[id]/approve
 * Approve a pending swarm job for execution.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, success, ApiError } from "@/lib/api-utils";
import { z } from "zod";

const ApproveSchema = z.object({
  reason: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticate(req);
    if (!auth) throw new ApiError("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();
    const { reason } = ApproveSchema.parse(body);

    const job = await prisma.swarmJob.findUnique({
      where: { id },
    });

    if (!job) throw new ApiError("Job not found", 404);
    if (job.status !== "PENDING" && job.status !== "WAITING_APPROVAL") {
      throw new ApiError(`Job is ${job.status}, cannot approve`, 400);
    }

    const updated = await prisma.swarmJob.update({
      where: { id },
      data: {
        status: "RUNNING",
        startedAt: new Date(),
        approvedAt: new Date(),
        approvalReason: reason,
      },
    });

    return success({ job: updated, message: reason || "Approved" });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    const message = error instanceof Error ? error.message : "Failed to approve job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
