/**
 * Server-Side Authentication Helpers
 *
 * G2: RBAC IS SERVER-SIDE ONLY
 * These helpers run exclusively on the server (Server Components, Server Actions, API Routes).
 * The client NEVER decides what it can access.
 *
 * Migrated from custom JWT session to Clerk auth().
 */

import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface ServerUser {
  id: string;
  email: string;
  name: string;
  role: string;
  platformRole: string;
  tenantId: string;
  hotelId: string | null;
  supplierId: string | null;
  factoringCompanyId: string | null;
  canOverride: boolean;
}

/**
 * Get the current authenticated user from Clerk session.
 * Cached per request to avoid multiple DB queries.
 * Returns null if not authenticated.
 */
export const getCurrentUser = cache(async (): Promise<ServerUser | null> => {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: userId },
        ...(email ? [{ email }] : []),
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      platformRole: true,
      tenantId: true,
      hotelId: true,
      supplierId: true,
      factoringCompanyId: true,
      canOverride: true,
    },
  });

  if (!user) return null;

  return user as ServerUser;
});

/**
 * Require authentication. Throws if not authenticated.
 * Use in Server Components that require login.
 */
export async function requireAuth(): Promise<ServerUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Check if user has a specific platform role.
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.platformRole === role || user?.platformRole === "ADMIN";
}

/**
 * Get role-specific dashboard path.
 */
export function getDashboardPath(platformRole: string): string {
  const paths: Record<string, string> = {
    HOTEL: "/hotel",
    SUPPLIER: "/supplier",
    FACTORING: "/factoring",
    SHIPPING: "/shipping",
    ADMIN: "/admin",
    MARKETING: "/marketing",
  };
  return paths[platformRole] || "/hotel";
}
