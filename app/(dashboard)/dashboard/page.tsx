import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardEntryPage() {
  const { userId, orgRole, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in?redirect=%2Fdashboard");

  const claimRole =
    (sessionClaims?.platformRole as string | undefined) ||
    (sessionClaims?.role as string | undefined) ||
    orgRole ||
    "hotel";

  const role = claimRole.toLowerCase();
  const destination =
    role === "admin" ? "/admin" :
    role === "supplier" ? "/supplier" :
    role === "factoring" ? "/factoring" :
    role === "shipping" || role === "carrier" ? "/shipping" :
    "/hotel";

  redirect(destination);
}
