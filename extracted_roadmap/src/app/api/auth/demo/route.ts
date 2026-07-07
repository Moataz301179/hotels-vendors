import { db } from "@/db";
import { users, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { setSession } from "@/lib/session";
import { isSeeded, seedDatabase } from "@/lib/seed";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({ role: z.enum(["hotel", "supplier", "funder", "carrier"]) });

const roleEmail: Record<string, string> = {
  hotel: "hotel@hotelsvendors.demo",
  supplier: "supplier@hotelsvendors.demo",
  funder: "funder@hotelsvendors.demo",
  carrier: "carrier@hotelsvendors.demo",
};

export async function POST(req: Request) {
  try {
    const { role } = schema.parse(await req.json());
    if (!(await isSeeded())) await seedDatabase();
    const email = roleEmail[role];
    const rows = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!rows[0]) return Response.json({ ok: false, error: "Demo user not found" }, { status: 404 });
    await setSession(rows[0].id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}
