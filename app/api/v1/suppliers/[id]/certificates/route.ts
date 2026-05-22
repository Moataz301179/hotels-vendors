/**
 * Supplier e-Seal Certificate API
 * GET  — List certificates (metadata only, no keys)
 * POST — Upload/store a new certificate
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  ApiError,
} from "@/lib/api-utils";
import {
  storeCertificate,
  listCertificates,
} from "@/lib/compliance/eseal";

export const GET = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "supplier:read");

  const { id } = await ctx.params;
  const certs = await listCertificates(id);
  return success(certs);
});

export const POST = apiRoute(async (request: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "supplier:update");

  const { id } = await ctx.params;
  const body = await request.json();

  if (!body.certificatePem || !body.privateKey) {
    throw new ApiError("certificatePem and privateKey required", 400);
  }

  const cert = await storeCertificate({
    supplierId: id,
    type: body.type || "E_SEAL",
    provider: body.provider,
    serialNumber: body.serialNumber,
    certificatePem: body.certificatePem,
    privateKey: body.privateKey,
    pin: body.pin,
    issuedAt: body.issuedAt ? new Date(body.issuedAt) : undefined,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    tenantId: auth.tenantId,
  });

  return success(cert, 201);
});
