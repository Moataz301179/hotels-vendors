import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InvoDashboardShell } from "./_components/invo-dashboard-shell";

const SESSION_COOKIE = "hv_session";
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  platformRole: string;
  tenantName?: string;
}

async function getUserData(): Promise<UserData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    const userId = payload.userId as string;
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
  } catch {
    return null;
  }
}

export default async function InvoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserData();
  if (!user) {
    redirect("/login?next=/invo/dashboard");
  }

  return (
    <InvoDashboardShell user={user}>
      {children}
    </InvoDashboardShell>
  );
}
