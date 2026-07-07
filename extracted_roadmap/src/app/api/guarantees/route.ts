import { db } from "@/db";
import { guarantees, organizations, orders, transactions } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";
import { ref } from "@/lib/utils";
import { computePgo, pricingForScore } from "@/lib/economics";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  orderId: z.number().optional(),
  supplierId: z.number(),
  faceValue: z.number().min(1000),
  termDays: z.number().min(15).max(120),
  riskScore: z.string().default("A+"),
});

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user?.orgId) return Response.json({ ok: false, error: "Auth required" }, { status: 401 });

  try {
    const b = createSchema.parse(await req.json());
    const pricing = pricingForScore(b.riskScore);

    const [g] = await db
      .insert(guarantees)
      .values({
        reference: ref("PGO"),
        instrument: "PGO",
        orderId: b.orderId,
        hotelId: user.orgId,
        supplierId: b.supplierId,
        faceValue: b.faceValue,
        supplierDiscountBps: pricing.supplierDiscountBps,
        hotelFeeBps: pricing.hotelFeeBps,
        funderSpreadBps: pricing.funderSpreadBps,
        platformMarginBps: pricing.platformMarginBps,
        termDays: b.termDays,
        status: "under_review",
        complianceScore: 60,
        evidenceComplete: false,
      })
      .returning();

    return Response.json({ ok: true, reference: g.reference, id: g.id });
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}

const actionSchema = z.object({
  id: z.number(),
  action: z.enum(["review", "issue", "claim", "settle", "decline"]),
});

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user?.orgId) return Response.json({ ok: false, error: "Auth required" }, { status: 401 });

  try {
    const { id, action } = actionSchema.parse(await req.json());
    const [g] = await db.select().from(guarantees).where(eq(guarantees.id, id)).limit(1);
    if (!g) return Response.json({ ok: false, error: "Not found" }, { status: 404 });

    if (action === "review") {
      // HotelsVendors assurance review passes -> route to funder
      await db.update(guarantees).set({ status: "funder_pending", complianceScore: 92, evidenceComplete: true }).where(eq(guarantees.id, id));
    } else if (action === "issue") {
      // Funder issues the guarantee. Supplier can now ship.
      await db.update(guarantees).set({ status: "issued", funderId: user.orgId }).where(eq(guarantees.id, id));
    } else if (action === "claim") {
      // Supplier claims after GRN -> funder disburses early payment
      const pgo = computePgo({
        faceValue: g.faceValue,
        termDays: g.termDays ?? 60,
        supplierDiscountBps: g.supplierDiscountBps ?? 300,
        hotelFeeBps: g.hotelFeeBps ?? 150,
        funderSpreadBps: g.funderSpreadBps ?? 1800,
        platformMarginBps: g.platformMarginBps ?? 120,
      });
      await db.update(guarantees).set({ status: "claimed" }).where(eq(guarantees.id, id));
      await db.insert(transactions).values({
        orgId: g.supplierId,
        kind: "disbursement",
        gateway: "instapay",
        amount: pgo.supplierEarlyPay,
        reference: ref("TX"),
        meta: { note: `Early payment on ${g.reference}`, guaranteeId: id },
      });
    } else if (action === "settle") {
      const pgo = computePgo({
        faceValue: g.faceValue,
        termDays: g.termDays ?? 60,
        supplierDiscountBps: g.supplierDiscountBps ?? 300,
        hotelFeeBps: g.hotelFeeBps ?? 150,
        funderSpreadBps: g.funderSpreadBps ?? 1800,
        platformMarginBps: g.platformMarginBps ?? 120,
      });
      await db.update(guarantees).set({ status: "settled" }).where(eq(guarantees.id, id));
      // hotel repays funder
      if (g.funderId) {
        await db.insert(transactions).values({
          orgId: g.funderId, kind: "repayment", gateway: "bank", amount: pgo.hotelRepayment - pgo.hotelFee,
          reference: ref("TX"), meta: { note: `Repayment on ${g.reference}`, guaranteeId: id },
        });
      }
      // platform margin
      await db.insert(transactions).values({
        orgId: g.hotelId, kind: "fee", gateway: "wallet", amount: pgo.platformMargin,
        reference: ref("TX"), meta: { note: `Assurance margin on ${g.reference}`, guaranteeId: id },
      });
    } else if (action === "decline") {
      await db.update(guarantees).set({ status: "declined" }).where(eq(guarantees.id, id));
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.orgId) return Response.json({ ok: false }, { status: 401 });
  const rows = await db
    .select()
    .from(guarantees)
    .where(or(eq(guarantees.hotelId, user.orgId), eq(guarantees.supplierId, user.orgId), eq(guarantees.funderId, user.orgId)))
    .orderBy(desc(guarantees.createdAt));
  return Response.json({ ok: true, guarantees: rows });
}
