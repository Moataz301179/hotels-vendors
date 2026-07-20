import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { apiRoute, authenticate, requirePermission, success, error, audit } from "@/lib/api-utils";
import { advanceReferralStage } from "@/lib/referral/pipeline";

const ConvertSchema = z.object({
  revenueShareBps: z.number().int().min(0).max(10000).optional(),
  notes: z.string().max(500).optional(),
});

/**
 * POST /api/v1/admin/referrals/{id}/convert
 *
 * Marks a REFERRED referral as CONVERTED after Oliv confirms the hotel/supplier
 * onboarded offline. Records an optional revenue-share bps value for Phase-2
 * ledger reconciliation (when the technical loop lands).
 */
export const POST = apiRoute(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const data = ConvertSchema.parse(body);

  const current = await prisma.referral.findUnique({ where: { id }, select: { stage: true, tenantId: true } });
  if (!current) return error("Referral not found", 404);

  // G1: Verify tenant ownership. Platform admins with admin:manage_tenants bypass.
  if (!auth.permissions?.includes("admin:manage_tenants") && current.tenantId !== auth.tenantId) {
    return error("Cross-tenant referral access denied", 403);
  }

  if (current.stage !== "REFERRED") {
    return error(`Referral must be REFERRED to convert (current: ${current.stage})`, 400);
  }

  try {
    const result = await advanceReferralStage(id, "CONVERTED", "REFERRED");
    await prisma.referral.update({
      where: { id },
      data: {
        convertedAt: new Date(),
        convertedRevenueShareBps: data.revenueShareBps ?? null,
        notes: data.notes,
      },
    });
    await audit({
      entityType: "REFERRAL",
      entityId: id,
      action: "REFERRAL_CONVERTED",
      tenantId: current.tenantId,
      actorId: auth.userId,
      actorRole: auth.platformRole,
      afterState: { revenueShareBps: data.revenueShareBps, notes: data.notes },
      ipAddress: request.headers.get("x-forwarded-for"),
    });
    return success({ referral: { id, stage: "CONVERTED", convertedAt: new Date().toISOString() } });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Conversion failed", 400);
  }
});
