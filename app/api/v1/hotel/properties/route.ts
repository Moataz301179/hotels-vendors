import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  if (auth.platformRole !== "HOTEL") {
    return error("Only hotel users can access this endpoint", 403);
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { hotelId: true },
  });

  if (!user?.hotelId) {
    return error("Hotel profile not found", 400);
  }

  const properties = await prisma.property.findMany({
    where: { hotelId: user.hotelId, tenantId: auth.tenantId },
    include: {
      hotel: { select: { id: true, name: true } },
    },
    orderBy: { name: "asc" },
  });

  return success({ properties });
});
