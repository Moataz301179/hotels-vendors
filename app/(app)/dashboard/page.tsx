import { requireUser } from "@/lib/session";
import { db } from "@/db";
import { orders, financings, transactions, organizations } from "@/db/schema";
import { eq, or, desc, count, sql } from "drizzle-orm";
import { Topbar } from "@/components/app/topbar";
import { TrendChart, FunnelChart } from "@/components/app/charts";
import { StatusPill, Badge, Btn } from "@/components/ui";
import { egp, shortDate, pct } from "@/lib/utils";
import { Wallet, Landmark, ShoppingCart, TrendingUp, ArrowUpRight, Sparkles, FileCheck2, Truck, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type OrderItem = { id: string; name: string };
type TransactionMeta = { note?: string };

export default async function DashboardPage() {
  const user = await requireUser();
  const orgId = user.orgId!;
  const type = user.orgType ?? "hotel";

  const [myOrders, myFin, myTx, orderCounts] = await Promise.all([
    db.select().from(orders).where(or(eq(orders.hotelId, orgId), eq(orders.supplierId, orgId), eq(orders.carrierId, orgId))).orderBy(desc(orders.createdAt)).limit(8),
    db.select().from(financings).where(or(eq(financings.borrowerId, orgId), eq(financings.funderId, orgId))).orderBy(desc(financings.createdAt)).limit(5),
    db.select().from(transactions).where(eq(transactions.orgId, orgId)).orderBy(desc(transactions.createdAt)).limit(5),
    db.select({ status: orders.status, n: sql<number>`count(*)::int` }).from(orders).groupBy(orders.status),
  ]);

  const creditAvail = (user.creditLimit ?? 0) - (user.creditUsed ?? 0);
  const financedVolume = myFin.reduce((s, f) => s + Number(f.principal), 0);
  const orderVolume = myOrders.reduce((s, o) => s + Number(o.total), 0);
  const pendingGRN = myOrders.filter((o) => o.status === "delivered" && o.grnStatus !== "fully_received").length;
  const etaExceptions = myOrders.filter((o) => o.etaStatus === "pending" || o.etaStatus === "invalid").length;

  const funnelData = [
    { label: "POs", value: orderCounts.find((c) => c.status === "confirmed" || c.status === "pending")?.n ?? 0 },
    { label: "In trans.", value: orderCounts.find((c) => c.status === "in_transit")?.n ?? 0 },
    { label: "GRN", value: orderCounts.find((c) => c.status === "delivered")?.n ?? 0 },
    { label: "Settled", value: orderCounts.find((c) => c.status === "settled")?.n ?? 0 },
  ];

  const stats =
    type === "funder"
      ? [
          { icon: Wallet, label: "Deployable capital", value: egp(user.walletBalance ?? 0, { compact: true }), sub: "Liquid balance" },
          { icon: Landmark, label: "Deployed capital", value: egp(financedVolume, { compact: true }), sub: `${myFin.length} active deals` },
          { icon: TrendingUp, label: "Blended APR", value: "19.2%", sub: "Weighted yield" },
          { icon: Sparkles, label: "Loss ratio", value: "1.7%", sub: "Trailing 12m" },
        ]
      : type === "supplier"
      ? [
          { icon: Wallet, label: "Wallet", value: egp(user.walletBalance ?? 0, { compact: true }), sub: "Settled funds" },
          { icon: ShoppingCart, label: "Order volume", value: egp(orderVolume, { compact: true }), sub: `${myOrders.length} recent` },
          { icon: TrendingUp, label: "Factored", value: egp(financedVolume, { compact: true }), sub: "Early payouts" },
          { icon: Sparkles, label: "Rating", value: String(user.rating ?? "4.8"), sub: "Supplier score" },
        ]
      : type === "carrier"
      ? [
          { icon: Wallet, label: "Wallet", value: egp(user.walletBalance ?? 0, { compact: true }), sub: "Settled funds" },
          { icon: Truck, label: "Deliveries", value: String(myOrders.length), sub: "Assigned routes" },
          { icon: TrendingUp, label: "On-time SLA", value: "98.2%", sub: "Trailing 30d" },
          { icon: Sparkles, label: "Rating", value: String(user.rating ?? "4.7"), sub: "Carrier score" },
        ]
      : [
          { icon: Landmark, label: "Credit available", value: egp(creditAvail, { compact: true }), sub: `of ${egp(user.creditLimit ?? 0, { compact: true })} limit` },
          { icon: Wallet, label: "Wallet", value: egp(user.walletBalance ?? 0, { compact: true }), sub: "Available balance" },
          { icon: ShoppingCart, label: "Order volume", value: egp(orderVolume, { compact: true }), sub: `${myOrders.length} recent` },
          { icon: TrendingUp, label: "Financed", value: egp(financedVolume, { compact: true }), sub: "Trade credit" },
        ];

  const chartData = [
    { label: "Apr", value: 210000 },
    { label: "May", value: 340000 },
    { label: "Jun", value: 290000 },
    { label: "Jul", value: 480000 },
    { label: "Aug", value: 520000 },
    { label: "Sep", value: 610000 },
    { label: "Oct", value: Math.max(orderVolume / 100, 740000) },
  ];

  const utilPct = user.creditLimit ? Math.round(((user.creditUsed ?? 0) / user.creditLimit) * 100) : 0;

  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={type} title={`Welcome, ${user.name.split(" ")[0]}`} />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-5 lg:p-8">
        {/* Alerts */}
        {(pendingGRN > 0 || etaExceptions > 0) && type === "hotel" && (
          <div className="grid gap-3 md:grid-cols-2">
            {pendingGRN > 0 && (
              <div className="flex items-start gap-3 rounded-2xl border border-yellow/30 bg-yellow/10 p-4">
                <AlertTriangle className="h-5 w-5 text-yellow mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">GRN action needed</p>
                  <p className="text-xs text-fg-3 mt-0.5">{pendingGRN} delivered order(s) awaiting Goods Received Note.</p>
                </div>
                <Btn href="/grn" variant="secondary" size="sm">Review</Btn>
              </div>
            )}
            {etaExceptions > 0 && (
              <div className="flex items-start gap-3 rounded-2xl border border-red/30 bg-red/10 p-4">
                <FileCheck2 className="h-5 w-5 text-red mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">ETA exceptions</p>
                  <p className="text-xs text-fg-3 mt-0.5">{etaExceptions} invoice(s) missing a valid ETA UUID.</p>
                </div>
                <Btn href="/compliance" variant="secondary" size="sm">Fix</Btn>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-5 transition hover:border-border-3">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-lime-dim text-lime">
                  <s.icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-fg-4" />
              </div>
              <div className="mt-4 text-2xl font-semibold tracking-tight">{s.value}</div>
              <div className="text-sm text-fg-2">{s.label}</div>
              <div className="mt-1 text-xs text-fg-4">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-semibold">
                  {type === "funder" ? "Capital deployed" : type === "supplier" ? "Revenue trend" : "Procurement spend"}
                </h2>
                <p className="text-sm text-fg-3">Last 7 months</p>
              </div>
              <Badge tone="lime"><TrendingUp className="h-3.5 w-3.5" /> +18.4%</Badge>
            </div>
            <TrendChart data={chartData} />
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Order funnel</h2>
            <p className="text-sm text-fg-3">Live pipeline</p>
            <div className="mt-2"><FunnelChart data={funnelData} /></div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {type === "hotel" ? (
            <div className="card p-6 lg:col-span-1">
              <h2 className="font-semibold">Credit facility</h2>
              <p className="text-sm text-fg-3">HV Capital revolving line</p>
              <div className="mt-6 text-3xl font-semibold">{egp(user.creditLimit ?? 0, { compact: true })}</div>
              <div className="mt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-fg-3">Utilised</span>
                  <span className="font-medium">{utilPct}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-bg-3">
                  <div className="h-full rounded-full bg-gradient-to-r from-lime to-gold" style={{ width: `${utilPct}%` }} />
                </div>
                <div className="mt-2 text-xs text-fg-3">{egp(creditAvail, { compact: true })} available</div>
              </div>
              <Btn href="/financing" variant="secondary" className="mt-6 w-full">Request financing</Btn>
              <Btn href="/ai-assistant" variant="ghost" className="mt-2 w-full border border-border">Ask the copilot</Btn>
            </div>
          ) : (
            <div className="card p-6">
              <h2 className="font-semibold">Quick actions</h2>
              <p className="text-sm text-fg-3">Move faster on the network</p>
              <div className="mt-5 space-y-2">
                <Btn href="/marketplace" variant="secondary" className="w-full justify-start"><ShoppingCart className="h-4 w-4" /> Browse marketplace</Btn>
                <Btn href="/financing" variant="secondary" className="w-full justify-start"><Landmark className="h-4 w-4" /> View capital</Btn>
                <Btn href="/wallet" variant="secondary" className="w-full justify-start"><Wallet className="h-4 w-4" /> Wallet & payouts</Btn>
              </div>
            </div>
          )}

          {/* Recent orders */}
          <div className="card overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-semibold">Recent orders</h2>
              <Link href="/orders" className="text-sm text-lime hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-border">
              {myOrders.length === 0 && <p className="p-5 text-sm text-fg-3">No orders yet.</p>}
              {myOrders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between p-5">
                  <div>
                    <div className="text-sm font-medium">{o.reference}</div>
                    <div className="text-xs text-fg-3">{shortDate(o.createdAt)} · {(o.items as OrderItem[])?.length ?? 0} line(s)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{egp(o.total, { compact: true })}</span>
                    <StatusPill status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        {myTx.length > 0 && (
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-semibold">Latest transactions</h2>
              <Link href="/wallet" className="text-sm text-lime hover:underline">Wallet</Link>
            </div>
            <div className="divide-y divide-border">
              {myTx.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-5">
                  <div>
                    <div className="text-sm font-medium capitalize">{t.kind.replace("_", " ")}</div>
                    <div className="text-xs text-fg-3">{(t.meta as TransactionMeta)?.note || t.reference} · {shortDate(t.createdAt)}</div>
                  </div>
                  <span className="text-sm font-medium">{egp(t.amount, { compact: true })}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
