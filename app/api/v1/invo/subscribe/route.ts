import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, validateBody, success, error } from "@/lib/api-utils";
import { z } from "zod";

const SubscribeSchema = z.object({
  planId: z.string().min(1),
  autoRenew: z.boolean().optional().default(true),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invo:subscribe");
  const body = await request.json();
  const data = validateBody(SubscribeSchema, body);

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: data.planId },
  });
  if (!plan || !plan.isActive) {
    return error("Plan not found or inactive", 404);
  }

  const existing = await prisma.subscription.findFirst({
    where: { tenantId: auth.tenantId, status: "ACTIVE" },
  });

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: {
        status: "CANCELLED",
        endDate: new Date(),
        autoRenew: false,
      },
    });
  }

  const subscription = await prisma.subscription.create({
    data: {
      planId: data.planId,
      tenantId: auth.tenantId,
      status: "ACTIVE",
      autoRenew: data.autoRenew,
      startDate: new Date(),
    },
    include: { plan: true },
  });

  return success(subscription, 201);
});
