import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  // Find authority rules for this user's role that allow factoring
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { role: true },
  });

  if (!user) return error("User not found", 404);

  const rules = await prisma.authorityRule.findMany({
    where: {
      tenantId: auth.tenantId,
      role: user.role as any,
      canRequestFactoring: true,
      isActive: true,
    },
  });

  const isEligible = rules.length > 0;

  return success({
    isEligible,
    role: user.role,
    message: isEligible
      ? "You are eligible to request factoring"
      : "Your role is not authorized to request factoring. Contact your administrator.",
  });
});
