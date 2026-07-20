import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { apiRoute, authenticate, requirePermission, success, error, audit } from "@/lib/api-utils";
import { advanceReferralStage } from "@/lib/referral/pipeline";

const AdvanceSchema = z.object({
  toStage: z.enum(["ELIGIBLE", "INELIGIBLE", "ADMIN_REVIEW", "APPROVED", "REFERRED", "CONVERTED", "LOST"]),
  notes: z.string().max(500).optional(),
});

/**
 * POST /api/v1/admin/referrals/{id}/advance
 *
 * Admin-driven forward-only stage transition. The transition table in
 * lib/referral/pipeline.ts validates the move. The REFERRED stage is normally
 * reached via the /send endpoint (which also sends the Oliv email), but
 * admins may advance to CONVERTED or LOST directly here.
 */
export const POST = apiRoute(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const data = AdvanceSchema.parse(body);

  // G1: Verify tenant ownership of the referral being mutated.
  // Platform admins with admin:manage_tenants bypass (cross-tenant ops).
  if (!auth.permissions?.includes("admin:manage_tenants")) {
    const ref = await prisma.referral.findUnique({
      where: { id },
      select: { tenantId: true },
    });
    if (!ref) return error("Referral not found", 404);
    if (ref.tenantId !== auth.tenantId) {
      return error("Cross-tenant referral access denied", 403);
    }
  }

  try {
    const result = await advanceReferralStage(id, data.toStage);
    await audit({
      entityType: "REFERRAL",
      entityId: id,
      action: `REFERRAL_ADVANCED_${data.toStage}`,
      tenantId: auth.tenantId,
      actorId: auth.userId,
      actorRole: auth.platformRole,
      afterState: { from: result.previousStage, to: result.stage, notes: data.notes },
      ipAddress: request.headers.get("x-forwarded-for"),
    });
    return success({ referral: result });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Stage transition failed", 400);
  }
});
