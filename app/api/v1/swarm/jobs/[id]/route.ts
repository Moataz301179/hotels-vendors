/**
 * GET /api/v1/swarm/jobs/[id]
 * Returns a single swarm job by ID.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, success, ApiError } from "@/lib/api-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticate(req);
    if (!auth) throw new ApiError("Unauthorized", 401);

    const { id } = await params;

    const job = await prisma.swarmJob.findUnique({
      where: { id },
    });

    if (!job) throw new ApiError("Job not found", 404);

    // Tenant isolation: ensure job belongs to requesting user's tenant
    if (job.tenantId !== auth.tenantId) {
      throw new ApiError("Unauthorized", 401);
    }

    return success({ job });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}
