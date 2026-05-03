import type { Metadata } from "next";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardCartWrapper } from "@/components/cart/dashboard-cart-wrapper";

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
  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    role = (payload.platformRole as string)?.toLowerCase() || null;
  } catch {
    redirect("/login");
  }

  if (!role) {
    redirect("/login");
  }

  const validRole = role as "admin" | "hotel" | "supplier" | "factoring" | "shipping" | "marketing";

  return (
    <DashboardShell role={validRole}>
      <DashboardCartWrapper>
        {children}
      </DashboardCartWrapper>
    </DashboardShell>
  );
}
