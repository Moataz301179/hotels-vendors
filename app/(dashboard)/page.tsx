/**
 * Dashboard Overview — Role Router
 *
 * Serves as the /dashboard entry point. Detects the user's platform role
 * and renders the appropriate role-specific dashboard.
 *
 * Existing per-role pages (/dashboard/hotel, /dashboard/supplier, etc.)
 * remain accessible for direct navigation and deep links.
 */

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";
import { getDashboardRole } from "@/components/dashboard/get-dashboard-role";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "hv_session";
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production"
);

export default async function DashboardOverviewPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/login");
  }

  let role: string | null = null;
  let userId: string | null = null;

  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    role = (payload.platformRole as string) || null;
    userId = (payload.userId as string) || null;
  } catch {
    redirect("/login");
  }

  if (!role) {
    redirect("/login");
  }

  // Fetch user for role detection
  let dashboardRole = getDashboardRole({ platformRole: role });

  // For non-admin roles, also check if we should redirect to their dedicated page
  // Admin stays on the overview; others get their role dashboard rendered here
  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { platformRole: true, roleId: true },
      });
      if (user) {
        dashboardRole = getDashboardRole(user);
      }
    } catch {
      // Silently continue with JWT-derived role
    }
  }

  return <RoleDashboard role={dashboardRole} />;
}
