import { requireUser } from "@/lib/session";
import { db } from "@/db";
import { organizations, orders, financings, waitlist } from "@/db/schema";
import { sql } from "drizzle-orm";
import { Topbar } from "@/components/app/topbar";
import { Badge } from "@/components/ui";
import { egp } from "@/lib/utils";
import { Settings2, ShieldCheck, Users, Landmark, ShoppingCart, FileWarning } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireUser();
  const [orgStats, orderStats, financeStats, waitStats] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(organizations),
    db.select({ n: sql<number>`count(*)::int`, total: sql<number>`coalesce(sum(${orders.total}),0)::bigint` }).from(orders),
    db.select({ n: sql<number>`count(*)::int`, principal: sql<number>`coalesce(sum(${financings.principal}),0)::bigint` }).from(financings),
    db.select({ n: sql<number>`count(*)::int` }).from(waitlist),
  ]);

  const cards = [
    { icon: Users, label: "Organizations", value: orgStats[0]?.n ?? 0, sub: "hotels, suppliers, funders, carriers" },
    { icon: ShoppingCart, label: "Order GMV", value: egp(orderStats[0]?.total ?? 0, { compact: true }), sub: `${orderStats[0]?.n ?? 0} orders` },
    { icon: Landmark, label: "Financing book", value: egp(financeStats[0]?.principal ?? 0, { compact: true }), sub: `${financeStats[0]?.n ?? 0} facilities` },
    { icon: ShieldCheck, label: "Waitlist", value: waitStats[0]?.n ?? 0, sub: "priority onboarding" },
  ];

  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={user.orgType ?? "platform"} title="Admin control panel" />
      <main className="mx-auto w-full max-w-6xl flex-1 p-5 lg:p-8">
        <div className="mb-6 card p-6">
          <div className="flex items-center gap-3"><Settings2 className="h-6 w-6 text-[var(--brand)]" /><h2 className="text-xl font-semibold">SaaS orchestration layer</h2></div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">Platform operators monitor tenant onboarding, supplier verification, credit exposure, ETA exceptions, risk controls and audit readiness. In production this route becomes platform-admin only.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="card p-5">
              <c.icon className="h-5 w-5 text-[var(--brand)]" />
              <div className="mt-4 text-2xl font-semibold">{c.value}</div>
              <div className="text-sm text-muted">{c.label}</div>
              <div className="mt-1 text-xs text-muted-2">{c.sub}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-semibold">Risk & compliance queues</h3>
            <div className="mt-4 space-y-3">
              {['ETA invoice exceptions','KYC in review','Credit limit breaches','GRN variance > threshold','Supplier SLA incidents'].map((q, i) => (
                <div key={q} className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-3 text-sm">
                  <span className="flex items-center gap-2"><FileWarning className="h-4 w-4 text-[var(--warning)]" />{q}</span>
                  <Badge tone={i < 2 ? "warning" : "muted"}>{i + 1}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold">Role matrix</h3>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              {[
                ['Hotel', 'Buy, approve, receive, pay, request credit'],
                ['Supplier', 'Quote, fulfil, invoice, factor receivables'],
                ['Funder', 'Review files, approve funding, monitor repayment'],
                ['Carrier', 'Accept route, update delivery, upload POD'],
                ['Platform admin', 'Onboard, configure limits, audit, resolve exceptions'],
              ].map(([role, scope]) => (
                <div key={role} className="grid grid-cols-[130px_1fr] border-b border-border p-3 text-sm last:border-b-0">
                  <span className="font-medium">{role}</span><span className="text-muted">{scope}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
