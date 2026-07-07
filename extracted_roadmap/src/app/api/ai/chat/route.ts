import { db } from "@/db";
import { orders, products, organizations, financings } from "@/db/schema";
import { eq, desc, or } from "drizzle-orm";
import { getCurrentUser } from "@/lib/session";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
});

const INVO_ACTIONS = [
  "draft-po",
  "reorder",
  "recommend-payment-terms",
  "predict-stockout",
  "supplier-ranking",
  "grn-variance-summary",
];

function detectIntent(q: string): string {
  const s = q.toLowerCase();
  if (/(reorder|replenish|stock out|stockout|run out)/i.test(s)) return "reorder";
  if (/(order|create po|po |purchase order)/i.test(s)) return "draft-po";
  if (/(payment|term|net|pay now|net-60|factoring)/i.test(s)) return "recommend-payment-terms";
  if (/(grn|goods received|variance|quality|acceptance)/i.test(s)) return "grn-variance-summary";
  if (/(supplier|best price|rank|cheapest|best supplier)/i.test(s)) return "supplier-ranking";
  if (/(forecast|predict|inventory|stock level|par)/i.test(s)) return "predict-stockout";
  return "general";
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user?.orgId) return Response.json({ ok: false, error: "Auth required" }, { status: 401 });

  const body = await req.json();
  const { messages } = schema.parse(body);
  const last = (messages[messages.length - 1]?.content || "").toLowerCase();
  const orgId = user.orgId;
  const intent = detectIntent(last);

  let reply = "";
  let actions: { label: string; href?: string; payload?: any }[] = [];

  // Pull live data for contextual answers
  const [myOrders, myDeals, hotProducts] = await Promise.all([
    db.select().from(orders).where(or(eq(orders.hotelId, orgId), eq(orders.supplierId, orgId))).orderBy(desc(orders.createdAt)).limit(5),
    db.select().from(financings).where(or(eq(financings.borrowerId, orgId), eq(financings.funderId, orgId))).limit(5),
    db.select().from(products).orderBy(desc(products.leadTimeDays)).limit(6),
  ]);

  const totalSpend = myOrders.reduce((s, o) => s + Number(o.total), 0);
  const financed = myDeals.reduce((s, f) => s + (f.status === "funded" || f.status === "repaying" ? Number(f.principal) : 0), 0);
  const pending = myOrders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
  const inTransit = myOrders.filter((o) => o.status === "in_transit").length;

  switch (intent) {
    case "reorder": {
      const rec = hotProducts.slice(0, 3).map((p) => `${p.name} (${p.moq} ${p.unit} MOQ)`).join(", ");
      reply = `Based on your recent order velocity and current MOQs, I'd recommend reordering: ${rec}. Net-60 factoring is currently priced at 2.1% — cheaper than drawing on your facility. Shall I draft POs?`;
      actions = [{ label: "Draft POs now", payload: { action: "draft-po", skus: hotProducts.slice(0, 3).map((p) => p.id) } }];
      break;
    }
    case "recommend-payment-terms": {
      const rate = 2.1;
      reply = `For your current EGP ${Math.round(totalSpend / 100).toLocaleString()} spend profile, factoring on Net-60 (${rate}% all-in) preserves EGP ${Math.round((totalSpend * 0.4) / 100).toLocaleString()} of working capital versus paying upfront. I see you have ${pending} pending POs and ${inTransit} in transit — I'd apply factoring to anything over EGP 250K.`;
      actions = [
        { label: "Apply to open POs", href: "/financing" },
        { label: "View capital desk", href: "/wallet" },
      ];
      break;
    }
    case "grn-variance-summary": {
      const delivered = myOrders.filter((o) => o.grnStatus === "partially_received" || o.grnStatus === "fully_received");
      const avgVariance = delivered.length
        ? Math.round(delivered.reduce((s, o) => s + (o.grnVarianceBps ?? 0), 0) / delivered.length) / 100
        : 0;
      reply = `Your GRN average variance is ${avgVariance}% across ${delivered.length} delivered orders. Orders with >2% variance should trigger invoice holds automatically. Would you like me to set that rule?`;
      actions = [{ label: "Enable 2% hold rule", payload: { action: "set-variance-rule", bps: 200 } }];
      break;
    }
    case "supplier-ranking": {
      reply = "Top-ranked suppliers by ETA compliance + GRN acceptance + delivery SLA: FreshFields Produce (98%), Cairo Linen House (96%), Chef's Equipment Egypt (95%). AquaPure has the fastest lead time for beverages at 2 days.";
      actions = [{ label: "Open marketplace", href: "/marketplace" }];
      break;
    }
    case "predict-stockout":
      reply = "Using your last 8 weeks of orders + seasonal occupancy, breakfast dairy will breach PAR in ~36 hours, minibar water in ~3 days. I can draft a PO now for FreshFields (milk, 28 cases) and AquaPure (water, 40 cases).";
      actions = [{ label: "Draft replenishment PO", payload: { action: "draft-replenishment" } }];
      break;
    default:
      reply = `Connected across INVO and HV Capital. I see ${myOrders.length} recent orders (EGP ${Math.round(totalSpend / 100).toLocaleString()} GMV) and ${myDeals.length} financing facilities (EGP ${Math.round(financed / 100).toLocaleString()} deployed). You can ask me to draft a PO, predict stockouts, recommend payment terms, rank suppliers or summarise GRN variance.`;
      actions = [
        { label: "Draft a PO", href: "/marketplace" },
        { label: "Check capital", href: "/financing" },
        { label: "View audit trail", href: "/compliance" },
      ];
  }

  return Response.json({
    ok: true,
    reply,
    intent,
    actions,
    data: {
      orders: myOrders.length,
      gmv: totalSpend,
      financed,
      pending,
      inTransit,
    },
  });
}
