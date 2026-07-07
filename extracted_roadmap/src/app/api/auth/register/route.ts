import { db } from "@/db";
import { users, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/session";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  company: z.string().min(2).max(160),
  type: z.enum(["hotel", "supplier", "funder", "carrier"]),
  city: z.string().max(80).optional(),
});

export async function POST(req: Request) {
  try {
    const data = schema.parse(await req.json());
    const email = data.email.toLowerCase();
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing[0]) {
      return Response.json({ ok: false, error: "Email already registered" }, { status: 409 });
    }
    const [org] = await db
      .insert(organizations)
      .values({
        name: data.company,
        type: data.type,
        city: data.city || "Cairo",
        kycStatus: "in_review",
        creditLimit: data.type === "hotel" ? 25000000 : 0,
      })
      .returning();

    const passwordHash = await bcrypt.hash(data.password, 10);
    const [user] = await db
      .insert(users)
      .values({ orgId: org.id, name: data.name, email, passwordHash, role: "admin" })
      .returning();

    await setSession(user.id);
    return Response.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ ok: false, error: err.issues[0]?.message ?? "Invalid" }, { status: 400 });
    }
    return Response.json({ ok: false, error: "Registration failed" }, { status: 500 });
  }
}
