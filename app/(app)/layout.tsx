import type { ReactNode } from "react";
import { getCurrentUser, setSession } from "@/lib/session";
import { isSeeded, seedDatabase } from "@/lib/seed";
import { db } from "@/db";
import { users } from "@/db/schema";
import { Sidebar } from "@/components/app/sidebar";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  let user = await getCurrentUser();

  // NO LOGIN WALL. Auto-provision a demo session if none exists.
  if (!user) {
    if (!(await isSeeded())) {
      await seedDatabase();
    }
    const row = await db.select().from(users).limit(1);
    if (row[0]) {
      await setSession(row[0].id);
      user = await getCurrentUser();
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
