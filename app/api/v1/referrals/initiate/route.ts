/**
 * Oliv Referral Initiate
 *
 * POST /api/v1/referrals/initiate
 *
 * Records that a supplier/hotel clicked the "Activate Oliv Financing" CTA
 * and was redirected to Oliv with referral code CHV000. Creates a Referral
 * record in the REFERRED stage so the pipeline shows the lead even before
 * Oliv confirms funding. Authenticated — the user must be logged in so
 * we can attribute the referral to their tenant and entity.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, success, error, authenticate, audit } from "@/lib/api-utils";

const OLIV_REFERRAL_CODE = "CHV000";
const OLIV_ONBOARD_URL = "https://oliv.finance/onboard";

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  if (!auth) return error("Unauthorized", 401);

  const body = await request.json().catch(() => ({}));
  const { userType, referralCode, redirectUri } = body as {
    userId?: string;
    userType?: "HOTEL" | "SUPPLIER";
    referralCode?: string;
    redirectUri?: string;
  };

  if (referralCode !== OLIV_REFERRAL_CODE) {
    return error("Invalid referral code", 400);
  }
  if (userType !== "HOTEL" && userType !== "SUPPLIER") {
    return error("userType must be HOTEL or SUPPLIER", 400);
  }

  // Resolve the entity (supplier or hotel) + email/taxId from the authenticated user
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      email: true,
      name: true,
      supplierId: true,
      hotelId: true,
    },
  });
  if (!user) return error("User not found", 404);

  const entityId = userType === "SUPPLIER" ? user.supplierId : user.hotelId;
  if (!entityId) {
    return error(`User has no linked ${userType.toLowerCase()} entity`, 400);
  }

  // Fetch entity details for the referral record
  const entity =
    userType === "SUPPLIER"
      ? await prisma.supplier.findUnique({
          where: { id: entityId },
          select: { name: true, email: true, taxId: true },
        })
      : await prisma.hotel.findUnique({
          where: { id: entityId },
          select: { name: true, email: true, taxId: true },
        });

  if (!entity) return error(`${userType} not found`, 404);

  // Upsert referral record (unique on [entityType, entityId, financingType]).
  // If the user already clicked before, update the stage back to REFERRED
  // and refresh the timestamp; otherwise create a new record.
  const referral = await prisma.referral.upsert({
    where: {
      entityType_entityId_financingType: {
        entityType: userType,
        entityId,
        financingType: "FACTORING",
      },
    },
    create: {
      tenantId: auth.tenantId,
      entityType: userType,
      entityId,
      entityName: entity.name,
      entityEmail: entity.email,
      entityTaxId: entity.taxId,
      financingType: "FACTORING",
      stage: "REFERRED",
      notes: `Referred to Oliv via CTA. Code ${OLIV_REFERRAL_CODE}. Redirect: ${redirectUri || OLIV_ONBOARD_URL}`,
    },
    update: {
      stage: "REFERRED",
      notes: `Referred to Oliv via CTA (re-click). Code ${OLIV_REFERRAL_CODE}. Redirect: ${redirectUri || OLIV_ONBOARD_URL}`,
    },
  });

  await audit({
    entityType: "REFERRAL",
    entityId: referral.id,
    action: "OLIV_REFERRAL_INITIATED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      referralCode: OLIV_REFERRAL_CODE,
      entityType: userType,
      entityId,
      stage: "REFERRED",
      target: OLIV_ONBOARD_URL,
    },
    ipAddress: request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    referralId: referral.id,
    referralCode: OLIV_REFERRAL_CODE,
    targetUrl: OLIV_ONBOARD_URL,
  });
});
