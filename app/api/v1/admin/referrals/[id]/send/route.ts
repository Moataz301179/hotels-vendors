import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, success, error } from "@/lib/api-utils";
import { sendReferralToOliv } from "@/lib/referral/handoff";

const SendSchema = {
  parse(body: unknown): { olivEmail?: string } {
    if (body && typeof body === "object" && "olivEmail" in body) {
      const v = (body as Record<string, unknown>).olivEmail;
      if (typeof v === "string" && v.length > 0) return { olivEmail: v };
    }
    return {};
  },
};

/**
 * POST /api/v1/admin/referrals/{id}/send
 *
 * Sends the structured referral packet to Oliv via email (pilot handoff —
 * no API). Requires the referral to be in APPROVED stage. On success the
 * referral moves to REFERRED and the Resend message id is recorded.
 *
 * The olivEmail override lets the admin redirect a one-off referral to a
 * specific Oliv POC (e.g. Reymon's direct email) without changing env config.
 */
export const POST = apiRoute(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { olivEmail } = SendSchema.parse(body);

  // G1: Verify tenant ownership before sending to Oliv.
  // Platform admins with admin:manage_tenants bypass this check (cross-tenant ops).
  if (!auth.permissions?.includes("admin:manage_tenants")) {
    const referral = await prisma.referral.findUnique({
      where: { id },
      select: { tenantId: true, stage: true },
    });
    if (!referral) return error("Referral not found", 404);
    if (referral.tenantId !== auth.tenantId) {
      return error("Cross-tenant referral access denied", 403);
    }
  }

  if (olivEmail) {
    process.env.OLIV_REFERRAL_EMAIL = olivEmail; // one-off override for this send
  }

  try {
    const result = await sendReferralToOliv(
      id,
      auth.userId,
      request.headers.get("x-forwarded-for"),
    );
    return success({ sent: true, messageId: result.messageId, to: result.to });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Failed to send referral", 400);
  }
});
