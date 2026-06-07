import type { Metadata } from "next";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardCartWrapper } from "@/components/cart/dashboard-cart-wrapper";
import { WorkspaceChatbot } from "@/components/ai-assistant/workspace-chatbot";
import { prisma } from "@/lib/prisma";
import { SandboxBanner } from "@/components/layout/sandbox-banner";

const SESSION_COOKIE = "hv_session";
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

export const metadata: Metadata = {
  title: {
    default: "Dashboard — Hotels Vendors",
    template: "%s — Hotels Vendors",
  },
  description:
    "Role-specific command center for the Egyptian hospitality procurement hub.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/login");
  }

  let role: string | null = null;
  let userId: string | null = null;
  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    role = (payload.platformRole as string)?.toLowerCase() || null;
    userId = payload.userId as string || null;
  } catch {
    redirect("/login");
  }

  if (!role) {
    redirect("/login");
  }

  // Fetch user data for header
  let userData = null;
  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { tenant: { select: { name: true } } },
      });
      if (user) {
        userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          platformRole: user.platformRole,
          tenantName: user.tenant?.name,
        };
      }
    } catch {
      // Silently fail — header will show generic user
    }
  }

  const validRole = role as "admin" | "hotel" | "supplier" | "factoring" | "shipping" | "marketing";

  return (
    <>
      <SandboxBanner />
      <DashboardShell role={validRole} user={userData}>
        <DashboardCartWrapper>
          {children}
        </DashboardCartWrapper>
        <WorkspaceChatbot mode={validRole} userId={userId || ""} />
      </DashboardShell>
    </>
  );
}
