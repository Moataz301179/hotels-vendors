"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  ShoppingCart,
  CreditCard,
  FileCheck,
  Clock,
  Package,
  Search,
  Bot,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { text: string; cls: string; dot: string }> = {
    PENDING_APPROVAL: { text: "Pending Approval", cls: "bg-accent-amber/10 text-accent-amber border-accent-amber/20", dot: "bg-accent-amber" },
    APPROVED: { text: "Approved", cls: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20", dot: "bg-accent-emerald" },
    CONFIRMED: { text: "Confirmed", cls: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20", dot: "bg-accent-cyan" },
    IN_TRANSIT: { text: "In Transit", cls: "bg-accent-violet/10 text-accent-violet border-accent-violet/20", dot: "bg-accent-violet" },
    DELIVERED: { text: "Delivered", cls: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20", dot: "bg-accent-emerald" },
    DRAFT: { text: "Draft", cls: "bg-surface-raised text-foreground-faint border-border-subtle", dot: "bg-foreground-faint" },
  };
  const c = config[status] || config.DRAFT;
  return (
    <span className={`status-badge border ${c.cls}`}>
      <span className={`status-dot ${c.dot}`} />
      {c.text}
    </span>
  );
}

export default function HotelDashboard() {
  const [metrics, setMetrics] = useState({
    openOrders: 0,
    spendThisMonth: 0,
    pendingApprovals: 0,
    creditAvailable: 1250000,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetch("/api/v1/hotel/orders?limit=5")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setRecentOrders(d.data.orders || []);
          setMetrics(m => ({
            ...m,
            openOrders: d.data.pagination?.total || 0,
            pendingApprovals: (d.data.orders || []).filter((o: any) => o.status === "PENDING_APPROVAL").length,
          }));
        }
      });

    fetch("/api/v1/hotel/catalog?limit=6")
      .then(r => r.json())
      .then(d => {
        if (d.success) setCatalogItems(d.data.products || []);
      });

    fetch("/api/v1/hotel/spend")
      .then(r => r.json())
      .then(d => {
        if (d.success) setMetrics(m => ({ ...m, spendThisMonth: d.data.total || 0 }));
      });
  }, []);

  async function askAI(question: string) {
    setAiLoading(true);
    const res = await fetch("/api/v1/ai/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAiAnswer(data.data?.answer || "I'm analyzing your request...");
    setAiLoading(false);
  }

  const METRICS = [
    { label: "Open Orders", value: metrics.openOrders.toLocaleString(), subtext: "Active POs", icon: ShoppingCart, color: "bg-accent-cyan/10 text-accent-cyan" },
    { label: "Spend This Month", value: `${metrics.spendThisMonth.toLocaleString()} EGP`, subtext: "Confirmed orders", icon: CreditCard, color: "bg-accent-emerald/10 text-accent-emerald" },
    { label: "Pending Approvals", value: metrics.pendingApprovals.toString(), subtext: "Needs GM sign-off", icon: FileCheck, color: "bg-accent-amber/10 text-accent-amber" },
    { label: "Credit Available", value: `${metrics.creditAvailable.toLocaleString()} EGP`, subtext: "EFG Hermes facility", icon: CreditCard, color: "bg-accent-gold/10 text-accent-gold" },
  ];
  return (
    <DashboardShell role="hotel">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text-animated">Procurement Command Center</span>
          </h1>
          <p className="text-foreground-muted mt-1 text-sm">
            Manage purchase orders, browse the catalog, and track deliveries across your properties
          </p>
        </div>

        {/* Metrics */}
        <div className="command-grid mb-8">
          {METRICS.map((m) => (
            <div key={m.label} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${m.color}`}>
                  <m.icon size={18} />
                </div>
                {m.subtext && (
                  <span className="text-[11px] font-medium text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-full">
                    {m.subtext}
                  </span>
                )}
              </div>
              <p className="metric-value text-2xl font-bold text-foreground">{m.value}</p>
              <p className="metric-label mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Catalog Quick Browse */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-accent-violet/10">
                  <Package size={18} className="text-accent-violet" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Catalog Quick Browse</h2>
                  <p className="text-xs text-foreground-faint">Recently viewed categories</p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
                View Catalog <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {catalogItems.map((item) => (
                <div
                  key={item.name}
                  className="group surface-card p-4 hover:border-border-default cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-faint bg-surface-raised px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-sm font-bold text-foreground">{item.price} <span className="text-xs font-normal text-foreground-faint">EGP/{item.unit}</span></span>
                  </div>
                  <p className="text-sm font-medium text-foreground group-hover:text-brand-400 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-foreground-faint mt-1">{item.supplier}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="flex-1 h-8 rounded-lg bg-brand-900/20 text-brand-400 text-xs font-medium hover:bg-brand-900/30 transition-colors flex items-center justify-center gap-1.5">
                      <ShoppingCart size={13} /> Add to PO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant Panel */}
          <div className="glass-card p-6 flex flex-col">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-lg bg-accent-gold/10">
                <Bot size={18} className="text-accent-gold" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">AI Assistant</h2>
                <p className="text-xs text-foreground-faint">Procurement intelligence</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <div className="p-3 rounded-xl bg-surface-raised border border-border-subtle">
                <div className="flex items-start gap-2.5">
                  <Sparkles size={14} className="text-accent-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground-muted leading-snug">
                      Based on your consumption patterns, I recommend increasing your olive oil order by 15% for Ramadan season.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-raised border border-border-subtle">
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={14} className="text-accent-amber mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground-muted leading-snug">
                      3 suppliers in your catalog have raised prices this week. Consider locking rates with Nile Textiles before May 5.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-raised border border-border-subtle">
                <div className="flex items-start gap-2.5">
                  <TrendingUp size={14} className="text-accent-emerald mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground-muted leading-snug">
                      Your hotel group is eligible for a 2.1% factoring rate upgrade. EFG Hermes pre-approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Ask about orders, suppliers, or budgets..."
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-surface-raised border border-border-subtle text-sm text-foreground placeholder:text-foreground-faint focus:outline-none focus:border-brand-700 transition-colors"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-faint" />
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-accent-cyan/10">
                <Clock size={18} className="text-accent-cyan" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Recent Orders</h2>
                <p className="text-xs text-foreground-faint">Last 5 purchase orders</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border-subtle">
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Order ID</th>
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Supplier</th>
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Items</th>
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Total</th>
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Status</th>
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="data-table-row">
                    <td className="py-3 text-sm font-mono text-foreground">{order.id}</td>
                    <td className="py-3 text-sm text-foreground-muted">{order.supplier}</td>
                    <td className="py-3 text-sm text-foreground-muted">{order.items}</td>
                    <td className="py-3 text-sm font-medium text-foreground">{order.total.toLocaleString()} EGP</td>
                    <td className="py-3"><StatusBadge status={order.status} /></td>
                    <td className="py-3 text-sm text-foreground-faint text-right">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
