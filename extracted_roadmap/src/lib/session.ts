import { cookies } from "next/headers";
import { db } from "@/db";
import { users, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const COOKIE = "hotelsvendors_session";

export async function setSession(userId: number) {
  const jar = await cookies();
  jar.set(COOKIE, String(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getCurrentUser() {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const id = Number(raw);
  if (!Number.isFinite(id)) return null;

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      avatar: users.avatar,
      orgId: users.orgId,
      orgName: organizations.name,
      orgType: organizations.type,
      city: organizations.city,
      creditLimit: organizations.creditLimit,
      creditUsed: organizations.creditUsed,
      walletBalance: organizations.walletBalance,
      rating: organizations.rating,
    })
    .from(users)
    .leftJoin(organizations, eq(users.orgId, organizations.id))
    .where(eq(users.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export type SessionUser = Exclude<Awaited<ReturnType<typeof getCurrentUser>>, null>;

/** Auto-provision a demo hotel session without signup friction. */
export async function ensureDemoSession(): Promise<SessionUser | null> {
  const existing = await getCurrentUser();
  if (existing) return existing;

  // Lazy seed if tables empty
  const { isSeeded, seedDatabase } = await import("@/lib/seed");
  if (!(await isSeeded())) await seedDatabase();

  const hotel = await db.select().from(users).limit(1);
  if (hotel[0]) {
    await setSession(hotel[0].id);
    return getCurrentUser();
  }
  return null;
}

export async function requireUser(): Promise<SessionUser> {
  let user = await getCurrentUser();

  // Auto-provision: seed + auto-login as hotel demo if no session
  if (!user) {
    const { isSeeded, seedDatabase } = await import("@/lib/seed");
    if (!(await isSeeded())) await seedDatabase();
    const { db: dbClient } = await import("@/db");
    const { users: usersTable } = await import("@/db/schema");
    const row = await dbClient.select().from(usersTable).limit(1);
    if (row[0]) {
      await setSession(row[0].id);
      user = await getCurrentUser();
    }
  }

  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
    throw new Error("redirect");
  }
  return user;
}
