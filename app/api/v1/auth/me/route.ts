import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, success, error } from "@/lib/api-utils";

export const GET = apiRoute(async (_request: NextRequest) => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return error("Unauthorized", 401);
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: clerkUser.id },
        ...(email ? [{ email }] : []),
      ],
    },
    include: { hotel: true, approvals: { take: 5, orderBy: { createdAt: "desc" } } },
  });

  if (!user) {
    return error("User not found", 404);
  }

  const permissions = buildPermissions(user.role, user.canOverride);

  return success({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    platformRole: user.platformRole,
    hotelId: user.hotelId || null,
    canOverride: user.canOverride,
    permissions,
    hotel: user.hotel
      ? {
          id: user.hotel.id,
          name: user.hotel.name,
          tier: user.hotel.tier,
          city: user.hotel.city,
        }
      : null,
  });
});

function buildPermissions(role: string, canOverride: boolean): string[] {
  const base = ["read:orders", "read:invoices", "read:products"];
  const perms: Record<string, string[]> = {
    CLERK: [...base, "create:orders"],
    DEPARTMENT_HEAD: [...base, "create:orders", "approve:orders_low", "read:analytics"],
    FINANCIAL_CONTROLLER: [...base, "create:orders", "approve:orders_medium", "read:analytics", "read:finance"],
    GM: [...base, "create:orders", "approve:orders_high", "read:analytics", "read:finance", "manage:users"],
    REGIONAL_GM: [...base, "create:orders", "approve:orders_high", "read:analytics", "read:finance", "manage:users", "manage:hotels"],
    OWNER: [...base, "create:orders", "approve:orders_critical", "read:analytics", "read:finance", "manage:users", "manage:hotels", "manage:suppliers", "admin:all"],
    RECEIVING_CLERK: ["read:orders", "update:delivery"],
  };
  const rolePerms = perms[role] || base;
  if (canOverride) {
    return [...rolePerms, "admin:override"];
  }
  return rolePerms;
}
