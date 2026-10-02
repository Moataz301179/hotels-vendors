import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface ServerSession {
  user?: {
    id: string;
    tenantId: string;
    role: string;
    platformRole: string;
  };
}

/**
 * Get the current server session from Clerk.
 * Replaces custom JWT session with Clerk auth().
 */
export async function getServerSession(): Promise<ServerSession | null> {
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
      tenantId: true,
      role: true,
      platformRole: true,
    },
  });

  if (!user) return null;

  return {
    user: {
      id: user.id,
      tenantId: user.tenantId || "",
      role: user.role,
      platformRole: user.platformRole,
    },
  };
}
