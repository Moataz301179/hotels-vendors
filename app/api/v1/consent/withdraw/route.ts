import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, success, error, authenticate } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

/**
 * Consent Withdrawal API
 *
 * POST /api/v1/consent/withdraw — Withdraw previously granted consent
 *
 * PDPL Art. 6: User may withdraw consent at any time.
 * Withdrawal does not affect lawful processing before withdrawal.
 */

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  if (!auth) return error("Unauthorized", 401);

  const body = await request.json();
  const { consentType, partnerId, reason } = body as {
    consentType: string;
    partnerId: string;
    reason?: string;
  };

  if (!consentType || !partnerId) {
    return error("Missing required fields: consentType, partnerId", 400);
  }

  // Find active consent
  const consent = await prisma.consentRecord.findUnique({
    where: {
      userId_consentType_partnerId: {
        userId: auth.userId,
        consentType,
        partnerId,
      },
    },
  });

  if (!consent || consent.status !== "GRANTED") {
    return error("No active consent found for this type and partner", 404);
  }

  // Withdraw consent
  const updated = await prisma.consentRecord.update({
    where: { id: consent.id },
    data: {
      status: "WITHDRAWN",
      withdrawnAt: new Date(),
      withdrawalReason: reason || null,
    },
  });

  // If withdrawing Oliv data sharing consent, update supplier status
  if (consentType === "OLIV_DATA_SHARING" && partnerId === "oliv_finance") {
    await prisma.supplier.updateMany({
      where: { tenantId: auth.tenantId },
      data: { olivStatus: "CONSENT_WITHDRAWN" },
    });

    // Freeze Oliv credit facility (don't cancel — existing obligations remain)
    await prisma.olivCreditFacility.updateMany({
      where: {
        tenantId: auth.tenantId,
        status: "ACTIVE",
      },
      data: { status: "SUSPENDED" },
    });
  }

  return success({
    consent: updated,
    message: "Consent withdrawn. Data sharing with this partner has been suspended.",
  });
});
