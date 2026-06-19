import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const OnboardingStepSchema = z.object({
  step: z.number().int().min(1).max(5),
  data: z.record(z.string(), z.unknown()),
});

const STEP_NAMES = [
  "role_selection",
  "company_details",
  "credit_check",
  "first_order",
  "complete",
];

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const { step, data } = OnboardingStepSchema.parse(body);

  if (step < 1 || step > 5) {
    return error("Invalid step number. Must be 1-5.", 400);
  }

  // Store onboarding progress in the user's AiUsage record
  const aiUsage = await prisma.aiUsage.findUnique({
    where: { userId: auth.userId },
  });

  const existingProgress = aiUsage?.onboardingProgress
    ? JSON.parse(aiUsage.onboardingProgress)
    : {};

  existingProgress[`step_${step}`] = {
    completedAt: new Date().toISOString(),
    data,
  };
  existingProgress.currentStep = step;
  existingProgress.lastUpdated = new Date().toISOString();

  if (aiUsage) {
    await prisma.aiUsage.update({
      where: { userId: auth.userId },
      data: { onboardingProgress: JSON.stringify(existingProgress) },
    });
  } else {
    await prisma.aiUsage.create({
      data: {
        userId: auth.userId,
        tenantId: auth.tenantId,
        onboardingProgress: JSON.stringify(existingProgress),
      },
    });
  }

  await audit({
    entityType: "ONBOARDING",
    entityId: auth.userId,
    action: `ONBOARDING_STEP_${step}_${STEP_NAMES[step - 1].toUpperCase()}`,
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { step, stepName: STEP_NAMES[step - 1] },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    step,
    stepName: STEP_NAMES[step - 1],
    isComplete: step === 5,
    message: step === 5
      ? "Onboarding complete! Welcome to HotelsVendors."
      : `Step ${step} saved.`,
  });
});
