import { db } from "@/db";
import { financings, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";
import { ref } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  amount: z.number().min(10000), // in piastres
  termDays: z.number().min(15).max(120),
  type: z.enum(["trade_credit", "factoring"]).default("trade_credit"),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user?.orgId) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    const { amount, termDays, type } = createSchema.parse(await req.json());
    const [fin] = await db
      .insert(financings)
      .values({
        reference: ref("FIN"),
        type,
        borrowerId: user.orgId,
        principal: amount,
        aprBps: type === "factoring" ? 2100 : 1850,
        termDays,
        feeBps: type === "factoring" ? 220 : 150,
        status: "requested",
      })
      .returning();
    return Response.json({ ok: true, reference: fin.reference });
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}

const patchSchema = z.object({ id: z.number(), action: z.enum(["approve", "decline"]) });

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user?.orgId || user.orgType !== "funder") {
    return Response.json({ ok: false, error: "Only funders can act" }, { status: 403 });
  }
  try {
    const { id, action } = patchSchema.parse(await req.json());
    await db
      .update(financings)
      .set({
        status: action === "approve" ? "funded" : "declined",
        funderId: action === "approve" ? user.orgId : null,
      })
      .where(eq(financings.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
