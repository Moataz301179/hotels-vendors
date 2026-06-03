import { NextRequest, NextResponse } from "next/server";
import { apiRoute, authenticate, requirePermission } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/v1/swarm/jobs/:id/approve
 * Approve a job that requires human approval (e.g., outreach emails)
 */
export const POST = apiRoute(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const { id } = await params;
  const { reason } = await request.json();

  const job = await prisma.swarmJob.findUnique({ where: { id } });
  if (!job) {
    return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
  }

  if (job.status !== "WAITING_APPROVAL") {
    return NextResponse.json(
      { success: false, error: `Job status is ${job.status}, cannot approve` },
      { status: 400 }
    );
  }

  await prisma.swarmJob.update({
    where: { id },
    data: {
      status: "PENDING",
      approvedAt: new Date(),
      approvedBy: auth.userId,
      approvalReason: reason || "Approved by admin",
    },
  });

  return NextResponse.json({
    success: true,
    message: "Job approved and queued for execution",
    data: { jobId: id, approvedBy: auth.userId },
  });
});
