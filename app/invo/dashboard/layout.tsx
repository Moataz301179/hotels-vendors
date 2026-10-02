import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InvoDashboardShell } from "./_components/invo-dashboard-shell";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  platformRole: string;
  tenantName?: string;
}

async function getUserData(): Promise<UserData | null> {
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
    include: { tenant: { select: { name: true } } },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    platformRole: user.platformRole,
    tenantName: user.tenant?.name,
  };
}

export default async function InvoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserData();
  if (!user) {
    redirect("/sign-in?next=/invo/dashboard");
  }

  return (
    <InvoDashboardShell user={user}>
      {children}
    </InvoDashboardShell>
  );
}
