import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "referral:read");
  const { id } = await params;

  const referral = await prisma.referral.findUnique({ where: { id } });
  if (!referral) return error("Referral not found", 404);

  // Enforce entity ownership: non-admin requesters may only read their own.
  if (auth.platformRole !== "ADMIN") {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { hotelId: true, supplierId: true },
    });
    const ownId = user?.hotelId ?? user?.supplierId;
    if (ownId !== referral.entityId) {
      return error("Referral not found", 404);
    }
  }

  return success({ referral });
});
