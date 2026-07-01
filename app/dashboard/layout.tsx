import type { Metadata } from "next";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "hv_session";

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET && process.env.NODE_ENV === "production") {
  throw new Error(
    "FATAL: SESSION_SECRET environment variable is required in production."
  );
}
const SECRET = new TextEncoder().encode(
  SESSION_SECRET || "dev-secret-do-not-use-in-production"
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

  let userData: {
    id: string;
    name: string;
    email: string;
    role: string;
    platformRole: string;
    tenantId: string;
    tenantName?: string;
    hotelId?: string;
    supplierId?: string;
  } | null = null;
  if (userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          tenant: { select: { name: true, id: true } },
          hotel: { select: { id: true } },
          supplier: { select: { id: true } },
        },
      });
      if (user) {
        userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          platformRole: user.platformRole,
          tenantId: user.tenant?.id || "",
          tenantName: user.tenant?.name,
          hotelId: user.hotel?.id,
          supplierId: user.supplier?.id,
        };
      }
    } catch {
      // Silently fail
    }
  }

  const validRole = role as "admin" | "hotel" | "supplier" | "factoring" | "shipping" | "marketing";

  return (
    <ThemeProvider>
      <DashboardShell
        role={validRole}
        userName={userData?.name || undefined}
        tenantName={userData?.tenantName || undefined}
        userId={userData?.id}
        tenantId={userData?.tenantId}
        hotelId={userData?.hotelId}
        supplierId={userData?.supplierId}
      >
        {children}
      </DashboardShell>
    </ThemeProvider>
  );
}
