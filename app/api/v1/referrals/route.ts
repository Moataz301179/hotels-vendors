/**
 * Referral API — Oliv pilot referral funnel (email handoff, no API).
 *
 * POST /api/v1/referrals      — hotel/supplier self-refers to Oliv financing
 * GET  /api/v1/referrals      — list own entity's referrals
 *
 * The capture endpoint creates a Referral in SUBMITTED stage, then runs the
 * eligibility engine (lib/referral/eligibility.ts) and advances the stage to
 * ELIGIBLE or INELIGIBLE. Eligible referrals surface in the admin pipeline.
 *
 * See /docs/oliv-referral-pilot.md for the phased plan.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  apiRoute,
  authenticate,
  requirePermission,
  validateQuery,
  success,
  error,
  audit,
} from "@/lib/api-utils";
import { PaginationSchema } from "@/lib/zod";
import {
  assessHotelReferralEligibility,
  assessSupplierReferralEligibility,
  bustEligibilityCache,
  type EligibilityResult,
} from "@/lib/referral/eligibility";

const ReferralCreateSchema = z.object({
  entityType: z.enum(["HOTEL", "SUPPLIER"]),
  financingType: z
    .enum(["FACTORING", "REVERSE_FACTORING", "CREDIT_LINE", "BNPL"])
    .optional()
    .default("FACTORING"),
});

async function resolveEntity(entityType: "HOTEL" | "SUPPLIER", auth: { userId: string; tenantId: string }) {
  if (entityType === "HOTEL") {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: auth.userId },
      select: { hotelId: true, hotel: { select: { id: true, name: true, email: true, taxId: true } } },
    });
    if (!user.hotelId || !user.hotel) throw new Error("Your account is not linked to a hotel");
    return {
      entityId: user.hotel.id,
      entityName: user.hotel.name,
      entityEmail: user.hotel.email ?? `${auth.userId}@no-email.hotelsvendors.com`,
      entityTaxId: user.hotel.taxId,
    };
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: auth.userId },
    select: { supplierId: true, supplier: { select: { id: true, name: true, email: true, taxId: true } } },
  });
  if (!user.supplierId || !user.supplier) throw new Error("Your account is not linked to a supplier");
  return {
    entityId: user.supplier.id,
    entityName: user.supplier.name,
    entityEmail: user.supplier.email,
    entityTaxId: user.supplier.taxId,
  };
}

async function runEligibility(
  entityType: "HOTEL" | "SUPPLIER",
  entityId: string,
  tenantId: string,
): Promise<EligibilityResult> {
  return entityType === "HOTEL"
    ? assessHotelReferralEligibility(entityId, tenantId)
    : assessSupplierReferralEligibility(entityId, tenantId);
}

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "referral:create");
  const body = await request.json();
  const data = ReferralCreateSchema.parse(body);

  const entity = await resolveEntity(data.entityType, auth);

  // Unique guard: one active referral per (entity, financingType)
  const existing = await prisma.referral.findUnique({
    where: {
      entityType_entityId_financingType: {
        entityType: data.entityType,
        entityId: entity.entityId,
        financingType: data.financingType,
      },
    },
  });
  if (existing && !["LOST", "CONVERTED"].includes(existing.stage)) {
    return error(
      `A ${existing.stage} referral for this ${data.entityType.toLowerCase()} already exists`,
      409,
    );
  }

  // Create in SUBMITTED, then run eligibility and advance.
  const referral = await prisma.referral.create({
    data: {
      tenantId: auth.tenantId,
      entityType: data.entityType,
      entityId: entity.entityId,
      entityName: entity.entityName,
      entityEmail: entity.entityEmail,
      entityTaxId: entity.entityTaxId,
      financingType: data.financingType,
      stage: "SUBMITTED",
    },
  });

  await audit({
    entityType: "REFERRAL",
    entityId: referral.id,
    action: "REFERRAL_CREATED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { entityType: data.entityType, financingType: data.financingType },
    ipAddress: request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent"),
  });

  // Run eligibility (may throw if config missing — surface as a 500 with context)
  let verdict: EligibilityResult;
  try {
    verdict = await runEligibility(data.entityType, entity.entityId, auth.tenantId);
  } catch (err) {
    await audit({
      entityType: "REFERRAL",
      entityId: referral.id,
      action: "REFERRAL_ELIGIBILITY_FAILED",
      tenantId: auth.tenantId,
      actorId: auth.userId,
      afterState: { error: err instanceof Error ? err.message : "unknown" },
    });
    return error(`Referral created but eligibility evaluation failed: ${err instanceof Error ? err.message : "unknown"}`, 500);
  }

  const updated = await prisma.referral.update({
    where: { id: referral.id },
    data: {
      stage: verdict.eligible ? "ELIGIBLE" : "INELIGIBLE",
      eligible: verdict.eligible,
      grade: verdict.grade,
      score: verdict.score,
      riskLevel: verdict.riskLevel,
      eligibilityFlags: verdict.flags,
      recommendedFacility: verdict.recommendedFacility ?? null,
      ineligibleReasons: verdict.ineligibleReasons,
      evaluatedAt: new Date(),
    },
  });

  return success({ referral: updated }, 201);
}, { rateLimit: "api" });

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "referral:read");
  const query = validateQuery(PaginationSchema, request.nextUrl.searchParams);

  // Scope to the requesting user's entity — they only see their own referrals.
  // Admins use the /api/v1/admin/referrals route (broader access).
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { hotelId: true, supplierId: true },
  });
  const entityId =
    user?.hotelId ?? user?.supplierId;
  if (!entityId) return success({ referrals: [], pagination: { page: query.page, limit: query.limit, total: 0, totalPages: 0 } });

  const where = { entityId };
  const [referrals, total] = await Promise.all([
    prisma.referral.findMany({
      where,
      orderBy: { [query.sortBy || "createdAt"]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.referral.count({ where }),
  ]);

  return success({
    referrals,
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  });
});
