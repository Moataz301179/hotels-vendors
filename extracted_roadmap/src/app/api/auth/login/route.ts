import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { setSession } from "@/lib/session";
import { isSeeded, seedDatabase } from "@/lib/seed";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().email(), password: z.string().optional() });

export async function POST(req: Request) {
  try {
    const { email } = schema.parse(await req.json());

    if (!(await isSeeded())) {
      await seedDatabase();
    }

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    const user = rows[0];
    if (!user) {
      return Response.json(
        {
          ok: false,
          error:
            "Demo user not found. Use hotel@hotelsvendors.demo, supplier@hotelsvendors.demo, funder@hotelsvendors.demo, or carrier@hotelsvendors.demo.",
        },
        { status: 401 }
      );
    }

    // Sandbox mode: any password is accepted so reviewers can inspect all dashboards fast.
    await setSession(user.id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
