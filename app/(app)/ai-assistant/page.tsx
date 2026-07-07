import { requireUser } from "@/lib/session";
import { db } from "@/db";
import { orders, financings } from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { Topbar } from "@/components/app/topbar";
import { AIChat } from "@/components/app/ai-chat";
import { Badge } from "@/components/ui";
import { BrainCircuit, Database, Shield, ArrowDownUp, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AIAssistantPage() {
  const user = await requireUser();
  const orgId = user.orgId!;

  const [myOrders, myFin] = await Promise.all([
    db.select().from(orders).where(or(eq(orders.hotelId, orgId), eq(orders.supplierId, orgId))).orderBy(desc(orders.createdAt)).limit(10),
    db.select().from(financings).where(or(eq(financings.borrowerId, orgId), eq(financings.funderId, orgId))).limit(10),
  ]);

  const gmv = myOrders.reduce((s, o) => s + Number(o.total), 0);
  const financed = myFin.reduce((s, f) => s + Number(f.principal), 0);

  const greeting =
    `Welcome, ${user.name.split(" ")[0]}. Across INVO I see ${myOrders.length} orders and EGP ${Math.round(gmv / 100).toLocaleString()} in recent GMV; across HV Capital ${myFin.length} facilities with EGP ${Math.round(financed / 100).toLocaleString()} deployed. Ask me to draft POs, forecast stockouts, recommend payment terms, rank suppliers, or summarise GRN variance.`;

  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={user.orgType ?? "hotel"} title="AI Procurement Copilot" />
      <main className="mx-auto w-full max-w-7xl flex-1 p-5 lg:p-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-lime-dim text-lime"><BrainCircuit className="h-5 w-5" /></div>
              <div>
                <h3 className="font-semibold">Copilot</h3>
                <p className="text-xs text-fg-3">Two-layer agent</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-fg-3">
              The copilot reads live data from both INVO (orders, suppliers, GRN, ETA) and HV Capital (credit, funders, risk scores, payments).
            </p>
          </div>
          <div className="card p-5 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-fg-4">Connected to</h4>
            {[
              { icon: Database, label: "INVO ledger", sub: "POs · GRN · ETA" },
              { icon: Shield, label: "Capital vault", sub: "Credit · factoring · risk" },
              { icon: ArrowDownUp, label: "Payments", sub: "Settlement · gateways" },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <r.icon className="h-4 w-4 text-lime" />
                <div>
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs text-fg-4">{r.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <h4 className="text-xs uppercase tracking-widest text-fg-4 mb-3">Try asking</h4>
            <div className="space-y-1.5 text-xs text-fg-2">
              {["Which suppliers should we reorder from?", "What payment terms should I use this quarter?", "Summarise GRN variance last month", "Predict stockouts for this weekend", "Rank suppliers by ETA compliance"].map((q) => (
                <p key={q}>• {q}</p>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge tone="lime"><Sparkles className="h-3 w-3" /> Live assistant</Badge>
            <span className="text-xs text-fg-4">Responses grounded in your workspace data</span>
          </div>
          <AIChat initialGreeting={greeting} />
        </div>
      </main>
    </>
  );
}
