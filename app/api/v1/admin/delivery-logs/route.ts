/**
 * Delivery Logs (Admin)
 * GET — List delivery logs with optional channel filter
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
} from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:read");

  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel");
  const status = searchParams.get("status");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);

  const logs = await prisma.deliveryLog.findMany({
    where: {
      tenantId: auth.tenantId,
      ...(channel && { channel }),
      ...(status && { status }),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return success(logs);
});
