import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { requirePermission } from "@/lib/auth/rbac";
import { z } from "zod";

const UpdateRuleSchema = z.object({
  name: z.string().min(1).optional(),
  priority: z.number().int().min(0).max(9999).optional(),
  minValue: z.number().min(0).optional(),
  maxValue: z.number().min(0).optional(),
  hotelRiskTier: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).nullable().optional(),
  hotelTier: z.enum(["ECONOMY", "STANDARD", "PREMIUM", "LUXURY", "CORE"]).nullable().optional(),
  supplierTier: z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM"]).nullable().optional(),
  requesterRole: z.enum(["CLERK", "DEPARTMENT_HEAD", "GM", "FINANCIAL_CONTROLLER", "ADMIN"]).nullable().optional(),
  requiresPaymentGuarantee: z.boolean().optional(),
  requiresEtaValidation: z.boolean().optional(),
  requiresDualSignOff: z.boolean().optional(),
  action: z.enum([
    "AUTO_APPROVE", "APPROVE", "ROUTE_TO_GM", "ROUTE_TO_FINANCIAL_CONTROLLER",
    "REQUIRE_OWNER", "DUAL_SIGN_OFF", "REJECT", "REQUIRE_PAYMENT_GUARANTEE", "SMART_FIX_REQUIRED",
  ]).optional(),
  routeToRole: z.enum(["CLERK", "DEPARTMENT_HEAD", "GM", "FINANCIAL_CONTROLLER", "ADMIN"]).nullable().optional(),
  isActive: z.boolean().optional(),
});

export const GET = apiRoute(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(request);
  const rule = await prisma.authorityRule.findFirst({
    where: {
      id: params.id,
      OR: [
        { tenantId: auth.tenantId },
        { tenantId: null },
      ],
    },
  });

  if (!rule) {
    return error("Rule not found", 404);
  }

  return success(rule);
});

export const PUT = apiRoute(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(request);
  await requirePermission(auth as any, "admin:manage_authority_rules");

  const body = await request.json();
  const data = UpdateRuleSchema.parse(body);

  const existing = await prisma.authorityRule.findFirst({
    where: {
      id: params.id,
      OR: [
        { tenantId: auth.tenantId },
        { tenantId: null },
      ],
    },
  });

  if (!existing) {
    return error("Rule not found", 404);
  }

  if (existing.tenantId === null) {
    return error("Cannot modify global rules", 403);
  }

  const rule = await prisma.authorityRule.update({
    where: { id: params.id },
    data,
  });

  return success(rule);
});

export const PATCH = apiRoute(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(request);
  await requirePermission(auth as any, "admin:manage_authority_rules");

  const body = await request.json();
  const data = UpdateRuleSchema.parse(body);

  const existing = await prisma.authorityRule.findFirst({
    where: {
      id: params.id,
      OR: [
        { tenantId: auth.tenantId },
        { tenantId: null },
      ],
    },
  });

  if (!existing) {
    return error("Rule not found", 404);
  }

  if (existing.tenantId === null) {
    return error("Cannot modify global rules", 403);
  }

  const rule = await prisma.authorityRule.update({
    where: { id: params.id },
    data,
  });

  return success(rule);
});

export const DELETE = apiRoute(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(request);
  await requirePermission(auth as any, "admin:manage_authority_rules");

  const existing = await prisma.authorityRule.findFirst({
    where: {
      id: params.id,
      OR: [
        { tenantId: auth.tenantId },
        { tenantId: null },
      ],
    },
  });

  if (!existing) {
    return error("Rule not found", 404);
  }

  if (existing.tenantId === null) {
    return error("Cannot delete global rules", 403);
  }

  await prisma.authorityRule.delete({
    where: { id: params.id },
  });

  return success({ deleted: true });
});
