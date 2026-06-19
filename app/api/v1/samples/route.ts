import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const CreateSampleSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  notes: z.string().max(500).optional(),
  deliveryAddress: z.string().max(500).optional(),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const data = CreateSampleSchema.parse(body);

  const sample = await prisma.sampleRequest.create({
    data: {
      productId: data.productId,
      userId: auth.userId,
      quantity: data.quantity,
      notes: data.notes,
      deliveryAddress: data.deliveryAddress,
      status: "PENDING",
    },
  });

  await prisma.sampleRequestLog.create({
    data: {
      sampleRequestId: sample.id,
      action: "CREATED",
      actorId: auth.userId,
      actorRole: auth.platformRole,
      notes: data.notes,
    },
  });

  await audit({
    entityType: "SAMPLE_REQUEST",
    entityId: sample.id,
    action: "SAMPLE_CREATED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { productId: data.productId, quantity: data.quantity },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ sample, message: "Sample request created" }, 201);
});
