/**
 * Supplier Profile API (for authenticated supplier users)
 * GET — Returns the supplier entity linked to the current user
 */

import { NextRequest } from "next/server";
import { apiRoute, authenticate, success, ApiError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: { Supplier: true },
  });

  if (!user?.supplier) {
    throw new ApiError("No supplier profile linked to this account", 404);
  }

  return success({
    id: user.supplier.id,
    name: user.supplier.name,
    legalName: user.supplier.legalName,
    taxId: user.supplier.taxId,
    status: user.supplier.status,
    tier: user.supplier.tier,
    complianceStatus: user.supplier.complianceStatus,
  });
});
