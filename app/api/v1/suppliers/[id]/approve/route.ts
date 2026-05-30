import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, success, error, audit } from "@/lib/api-utils";
import { atomicSupplierStatusUpdate } from "../shared";

export const POST = apiRoute(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { tier = "CORE", notes = "" } = body;

  const result = await atomicSupplierStatusUpdate(id, "ACTIVE", tier, auth.userId, auth.tenantId);

  if (!result.success) {
    return error(result.error || "Failed to approve supplier", 400);
  }

  await audit({
    entityType: "SUPPLIER",
    entityId: id,
    action: "SUPPLIER_APPROVED",
    tenantId: result.tenantId || auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { notes, tier },
  });

  return success({
    data: result.supplier,
    message: `${result.supplier?.name || "Supplier"} has been approved and is now ACTIVE.`,
  });
});
