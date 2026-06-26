/**
 * DELETE /api/v1/supplier/api-keys/:id — revoke an API key
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission } from "@/lib/api-utils";
import { revokeApiKey } from "@/lib/supplier/api-key-service";

export const DELETE = apiRoute(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "apikey:revoke");

  const { id } = await params;

  const supplier = await prisma.supplier.findFirst({
    where: { tenantId: auth.tenantId },
  });
  if (!supplier) return error("Supplier not found", 404);

  const revoked = await revokeApiKey(id, supplier.id, auth.tenantId);
  if (!revoked) return error("API key not found or already revoked", 404);

  return success({ revoked: true, id });
});
