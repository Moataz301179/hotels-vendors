import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const ApproveSchema = z.object({
  sampleRequestId: z.string().min(1),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const { sampleRequestId } = ApproveSchema.parse(body);

  const sample = await prisma.sampleRequest.findUnique({
    where: { id: sampleRequestId },
  });

  if (!sample) return error("Sample request not found", 404);
  if (sample.status !== "PENDING") {
    return error(`Sample request is already ${sample.status.toLowerCase()}`, 400);
  }

  const updated = await prisma.sampleRequest.update({
    where: { id: sampleRequestId },
    data: {
      status: "APPROVED",
      approvedById: auth.userId,
      approvedAt: new Date(),
    },
  });

  await prisma.sampleRequestLog.create({
    data: {
      sampleRequestId,
      action: "APPROVED",
      actorId: auth.userId,
      actorRole: auth.platformRole,
    },
  });

  await audit({
    entityType: "SAMPLE_REQUEST",
    entityId: sampleRequestId,
    action: "SAMPLE_APPROVED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { status: "APPROVED" },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ sample: updated, message: "Sample request approved" });
});
