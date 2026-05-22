/**
 * Digital Agreements API
 * POST — Generate agreements for a factoring relationship
 * GET — List agreements for a tenant/hotel/supplier
 * PATCH — Sign an agreement
 */

import { NextRequest } from "next/server";
import { apiRoute, authenticate, requirePermission, success, ApiError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { onboardFactoringRelationship, signAgreement, seedAgreementTemplates } from "@/lib/agreements/service";

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_tenants");

  const body = await request.json();

  if (body.action === "seed_templates") {
    await seedAgreementTemplates(auth.tenantId);
    return success({ seeded: true });
  }

  if (!body.hotelId || !body.factoringCompanyId) {
    throw new ApiError("hotelId and factoringCompanyId required", 400);
  }

  const nbfi = await prisma.factoringCompany.findUnique({
    where: { id: body.factoringCompanyId },
    select: { name: true, taxId: true },
  });

  if (!nbfi) throw new ApiError("Factoring company not found", 404);

  const agreements = await onboardFactoringRelationship({
    tenantId: auth.tenantId,
    hotelId: body.hotelId,
    supplierId: body.supplierId,
    factoringCompanyId: body.factoringCompanyId,
    principalName: nbfi.name,
    principalTaxId: nbfi.taxId || "N/A",
    commissionRate: body.commissionRate || "1.5",
    disbursementFee: body.disbursementFee || "500",
    creditLimit: body.creditLimit,
    interestRate: body.interestRate,
    tenorDays: body.tenorDays,
  });

  return success(agreements, 201);
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:read");

  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get("hotelId");
  const supplierId = searchParams.get("supplierId");
  const status = searchParams.get("status");

  const agreements = await prisma.digitalAgreement.findMany({
    where: {
      tenantId: auth.tenantId,
      ...(hotelId && { hotelId }),
      ...(supplierId && { supplierId }),
      ...(status && { status: status as any }),
    },
    include: { template: true },
    orderBy: { createdAt: "desc" },
  });

  return success(agreements);
});

export const PATCH = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const body = await request.json();
  if (!body.agreementId || !body.signerRole) {
    throw new ApiError("agreementId and signerRole required", 400);
  }

  const updated = await signAgreement(body.agreementId, body.signerRole, auth.userId);
  return success(updated);
});
