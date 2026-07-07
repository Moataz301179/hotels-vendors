import { db } from "@/db";
import { orders, products, invoices, financings, organizations, guarantees } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";
import { ref } from "@/lib/utils";
import { pricingForScore } from "@/lib/economics";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  productId: z.number(),
  qty: z.number().min(1),
  paymentTermDays: z.number().default(0),
  finance: z.boolean().default(false),
});

const FEE_BPS = 250; // 2.5% platform take-rate

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user?.orgId) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { productId, qty, paymentTermDays, finance } = schema.parse(await req.json());
    const [product] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!product) return Response.json({ ok: false, error: "Product not found" }, { status: 404 });

    const subtotal = product.price * qty;
    const platformFee = Math.round((subtotal * FEE_BPS) / 10000);
    const total = subtotal + platformFee;

    const [order] = await db
      .insert(orders)
      .values({
        reference: ref("ORD"),
        hotelId: user.orgId,
        supplierId: product.supplierId,
        status: finance ? "financed" : "confirmed",
        subtotal,
        platformFee,
        total,
        paymentTermDays,
        items: [{ productId: product.id, name: product.name, qty, price: product.price }],
      })
      .returning();

    const due = new Date(Date.now() + paymentTermDays * 864e5);
    await db.insert(invoices).values({
      orderId: order.id,
      supplierId: product.supplierId,
      hotelId: user.orgId,
      amount: subtotal,
      status: finance ? "financed" : "issued",
      dueDate: paymentTermDays > 0 ? due : null,
    });

    if (finance) {
      const [funder] = await db.select({ id: organizations.id }).from(organizations).where(eq(organizations.type, "funder")).limit(1);
      await db.insert(financings).values({
        reference: ref("FIN"),
        type: "trade_credit",
        orderId: order.id,
        borrowerId: user.orgId,
        funderId: funder?.id,
        principal: subtotal,
        aprBps: 1850,
        termDays: paymentTermDays || 60,
        feeBps: 150,
        status: "funded",
      });
      // increase credit used
      await db
        .update(organizations)
        .set({ creditUsed: (user.creditUsed ?? 0) + subtotal })
        .where(eq(organizations.id, user.orgId));

      // Issue a Payment Guarantee Order (PGO) so the supplier can ship without upfront payment.
      const pricing = pricingForScore("A+");
      await db.insert(guarantees).values({
        reference: ref("PGO"),
        instrument: "PGO",
        orderId: order.id,
        hotelId: user.orgId,
        supplierId: product.supplierId,
        faceValue: subtotal,
        supplierDiscountBps: pricing.supplierDiscountBps,
        hotelFeeBps: pricing.hotelFeeBps,
        funderSpreadBps: pricing.funderSpreadBps,
        platformMarginBps: pricing.platformMarginBps,
        termDays: paymentTermDays || 60,
        status: "under_review",
        complianceScore: 72,
        evidenceComplete: false,
      });
    }

    return Response.json({ ok: true, reference: order.reference, guaranteed: finance });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }
    return Response.json({ ok: false, error: "Order failed" }, { status: 500 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.orgId) return Response.json({ ok: false }, { status: 401 });
  const rows = await db
    .select()
    .from(orders)
    .where(or(eq(orders.hotelId, user.orgId), eq(orders.supplierId, user.orgId)))
    .orderBy(desc(orders.createdAt));
  return Response.json({ ok: true, orders: rows });
}
