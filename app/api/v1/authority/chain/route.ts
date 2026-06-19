import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { z } from "zod";

const ChainQuerySchema = z.object({
  orderId: z.string().optional(),
  amount: z.coerce.number().positive(),
  role: z.string().optional(),
  category: z.string().optional(),
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const { searchParams } = new URL(request.url);
  const { orderId, amount, role, category } = ChainQuerySchema.parse(
    Object.fromEntries(searchParams.entries())
  );

  // Find matching authority rules for this tenant, ordered by priority
  const rules = await prisma.authorityRule.findMany({
    where: {
      tenantId: auth.tenantId,
      isActive: true,
      minValue: { lte: amount },
      maxValue: { gte: amount },
      ...(category ? { category } : {}),
      ...(role ? { role: role as any } : {}),
    },
    orderBy: { priority: "desc" },
  });

  if (rules.length === 0) {
    return success({
      chain: [],
      message: "No authority rules match this criteria. Order will require manual routing.",
    });
  }

  // Use the highest-priority rule
  const rule = rules[0];

  // Parse approval chain if it exists
  let chain: string[] = [];
  if (rule.approvalChain) {
    try {
      chain = JSON.parse(rule.approvalChain);
    } catch {
      // Invalid JSON — fall back to single role
      if (rule.routeToRole) {
        chain = [rule.routeToRole];
      }
    }
  } else if (rule.routeToRole) {
    chain = [rule.routeToRole];
  }

  // Get current step if orderId provided
  let currentStep = 0;
  let completedSteps: { role: string; action: string; reason?: string | null }[] = [];

  if (orderId) {
    const orderApprovals = await prisma.orderApproval.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
      select: { stepIndex: true, action: true, reason: true, approverId: true },
    });

    if (orderApprovals.length > 0) {
      completedSteps = orderApprovals.map((a) => ({
        role: "", // Will be filled from user lookup
        action: a.action,
        reason: a.reason,
      }));
      currentStep = orderApprovals[orderApprovals.length - 1].stepIndex + 1;
    }
  }

  // Build chain status
  const chainStatus = chain.map((stepRole, index) => ({
    role: stepRole,
    step: index,
    status: index < currentStep ? "completed" : index === currentStep ? "pending" : "waiting",
  }));

  return success({
    chain: chainStatus,
    currentStep,
    totalSteps: chain.length,
    requiresDualSignOff: rule.requiresDualSignOff,
    message: currentStep >= chain.length
      ? "All approvals complete. Ready for confirmation."
      : `Awaiting approval from: ${chain[currentStep] || "N/A"}`,
  });
});
