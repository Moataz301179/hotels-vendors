import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, validateBody, success, error } from "@/lib/api-utils";
import { z } from "zod";

const UpdateSchema = z.object({
  action: z.enum(["cancel", "change"]),
  planId: z.string().optional(),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invo:read");

  const subscription = await prisma.subscription.findFirst({
    where: { tenantId: auth.tenantId, status: "ACTIVE" },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) {
    return success(null);
  }

  return success(subscription);
});

export const PATCH = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invo:subscribe");
  const body = await request.json();
  const data = validateBody(UpdateSchema, body);

  const subscription = await prisma.subscription.findFirst({
    where: { tenantId: auth.tenantId, status: "ACTIVE" },
  });

  if (!subscription) {
    return error("No active subscription found", 404);
  }

  if (data.action === "cancel") {
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "CANCELLED", endDate: new Date(), autoRenew: false },
      include: { plan: true },
    });
    return success(updated);
  }

  if (data.action === "change") {
    if (!data.planId) {
      return error("planId required for change action", 400);
    }
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: data.planId },
    });
    if (!plan || !plan.isActive) {
      return error("Plan not found or inactive", 404);
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "CANCELLED", endDate: new Date(), autoRenew: false },
    });

    const updated = await prisma.subscription.create({
      data: {
        planId: data.planId,
        tenantId: auth.tenantId,
        status: "ACTIVE",
        autoRenew: true,
        startDate: new Date(),
      },
      include: { plan: true },
    });
    return success(updated, 201);
  }

  return error("Invalid action", 400);
});
