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
    id: user.Supplier.id,
    name: user.Supplier.name,
    legalName: user.Supplier.legalName,
    taxId: user.Supplier.taxId,
    status: user.Supplier.status,
    tier: user.Supplier.tier,
    complianceStatus: user.Supplier.complianceStatus,
  });
});
