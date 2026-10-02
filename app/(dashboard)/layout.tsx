import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: {
    default: "Dashboard — HotelsVendors",
    template: "%s — HotelsVendors",
  },
  description:
    "HotelsVendors Virtual Shadow intelligence workspace for hospitality procurement.",
};

type DashboardRole =
  | "admin"
  | "hotel"
  | "supplier"
  | "factoring"
  | "shipping"
  | "marketing";

const VALID_ROLES = new Set<DashboardRole>([
  "admin",
  "hotel",
  "supplier",
  "factoring",
  "shipping",
  "marketing",
]);

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { userId, orgRole, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const claimRole =
    (sessionClaims?.platformRole as string | undefined) ||
    (sessionClaims?.role as string | undefined) ||
    orgRole ||
    "HOTEL";

  const role = claimRole.toLowerCase() as DashboardRole;
  const validRole = VALID_ROLES.has(role) ? role : "hotel";

  return (
    <DashboardShell role={validRole} user={null}>
      {children}
    </DashboardShell>
  );
}
