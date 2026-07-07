import { db } from "@/db";
import { waitlist } from "@/db/schema";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email(),
  company: z.string().max(160).optional(),
  segment: z.string().max(40).optional(),
  message: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await db.insert(waitlist).values({
      name: data.name,
      email: data.email,
      company: data.company,
      segment: data.segment ?? "hotel",
      message: data.message,
    });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }
}
