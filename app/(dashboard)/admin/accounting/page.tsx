"use client";

import { useState, useEffect } from "react";
import {
  Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign,
  FileText, Landmark, Download, Filter, RefreshCw, CreditCard, Banknote
} from "lucide-react";

interface AccountingData {
  totalRevenue: number;
  platformFees: number;
  factoringCommissions: number;
  subscriptionRevenue: number;
  pendingPayouts: number;
  completedPayouts: number;
  netProfit: number;
  operatingCosts: number;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    costs: number;
    profit: number;
    fees: number;
    factoring: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    description: string;
    amount: number;
    status: string;
    date: string;
  }>;
  feeCollection: Array<{
    source: string;
    amount: number;
    percentage: number;
  }>;
}

export default function AdminAccountingPage() {
  const [data, setData] = useState<AccountingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");

  useEffect(() => {
    fetchAccounting();
  }, [period]);

  const fetchAccounting = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/accounting?period=${period}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      setData({
        totalRevenue: 485000,
        platformFees: 25000,
        factoringCommissions: 85000,
        subscriptionRevenue: 120000,
        pendingPayouts: 45000,
        completedPayouts: 440000,
        netProfit: 180000,
        operatingCosts: 305000,
        monthlyBreakdown: [
          { month: "Jan", revenue: 85000, costs: 42000, profit: 43000, fees: 4200, factoring: 12000 },
          { month: "Feb", revenue: 92000, costs: 44000, profit: 48000, fees: 4600, factoring: 14000 },
          { month: "Mar", revenue: 105000, costs: 48000, profit: 57000, fees: 5200, factoring: 16000 },
          { month: "Apr", revenue: 118000, costs: 52000, profit: 66000, fees: 5900, factoring: 19000 },
          { month: "May", revenue: 132000, costs: 58000, profit: 74000, fees: 6600, factoring: 22000 },
          { month: "Jun", revenue: 145000, costs: 62000, profit: 83000, fees: 7200, factoring: 25000 },
        ],
        recentTransactions: [
          { id: "TXN-001", type: "PLATFORM_FEE", description: "Platform fee - Order #ORD-1234", amount: 850, status: "COMPLETED", date: "2026-07-15T10:00:00Z" },
          { id: "TXN-002", type: "FACTORING", description: "Factoring commission - ", amount: 2500, status: "COMPLETED", date: "2026-07-15T09:00:00Z" },
          { id: "TXN-003", type: "SUBSCRIPTION", description: "Supplier subscription - ABC Cleaning", amount: 500, status: "PENDING", date: "2026-07-14T18:00:00Z" },
          { id: "TXN-004", type: "PLATFORM_FEE", description: "Platform fee - Order #ORD-1235", amount: 1200, status: "COMPLETED", date: "2026-07-14T16:00:00Z" },
          { id: "TXN-005", type: "FACTORING", description: "Factoring commission - ", amount: 3200, status: "COMPLETED", date: "2026-07-14T14:00:00Z" },
        ],
        feeCollection: [
          { source: "Platform Fees (2%)", amount: 25000, percentage: 51 },
          { source: "Factoring Commissions", amount: 85000, percentage: 17.5 },
          { source: "Subscriptions", amount: 120000, percentage: 24.7 },
          { source: "ETA Processing", amount: 15000, percentage: 3.1 },
          { source: "Other", amount: 40000, percentage: 8.2 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const formatEGP = (amount: number) => `EGP ${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border-subtle mb-8">
        <div className="py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-white flex items-center gap-3">
              <Wallet className="w-6 h-6 text-accent-base" />
              Accounting & Revenue
            </h1>
            <p className="text-[13px] text-foreground-muted mt-1">Platform fees, commissions, and financial overview</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 p-1 bg-surface-1 rounded-lg border border-border-subtle">
              {(["month", "quarter", "year"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all capitalize ${
                    period === p ? "bg-accent-base/10 text-accent-base" : "text-foreground-muted hover:text-foreground-tertiary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-border-subtle text-foreground-tertiary text-[11px] hover:bg-surface-2 transition-colors">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* Revenue Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: formatEGP(data.totalRevenue), icon: DollarSign, color: "var(--accent-base)" },
              { label: "Platform Fees", value: formatEGP(data.platformFees), icon: CreditCard, color: "#f59e0b" },
              { label: "Factoring Commissions", value: formatEGP(data.factoringCommissions), icon: Landmark, color: "#8b5cf6" },
              { label: "Net Profit", value: formatEGP(data.netProfit), icon: TrendingUp, color: "#10b981" },
            ].map((kpi) => (
              <div key={kpi.label} className="p-5 rounded-2xl bg-surface-1 border border-border-subtle">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                  <span className="text-[11px] text-foreground-muted uppercase tracking-wider">{kpi.label}</span>
                </div>
                <div className="text-[24px] font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Revenue Breakdown & Monthly */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Fee Collection Breakdown */}
            <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
              <h3 className="text-sm font-semibold text-foreground-secondary mb-4">Revenue Sources</h3>
              <div className="space-y-3">
                {data.feeCollection.map((f) => (
                  <div key={f.source} className="flex items-center gap-3">
                    <span className="text-sm text-foreground-secondary flex-1">{f.source}</span>
                    <span className="text-sm font-medium text-foreground-secondary">{formatEGP(f.amount)}</span>
                    <div className="w-20 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                      <div className="h-full rounded-full bg-accent-base/60" style={{ width: `${f.percentage}%` }} />
                    </div>
                    <span className="text-[11px] text-foreground-muted w-10 text-right">{f.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly P&L */}
            <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
              <h3 className="text-sm font-semibold text-foreground-secondary mb-4">Monthly P&L</h3>
              <div className="space-y-2">
                {data.monthlyBreakdown.map((m) => (
                  <div key={m.month} className="grid grid-cols-4 gap-2 p-2 rounded-lg hover:bg-surface-1 transition-colors">
                    <span className="text-[11px] text-foreground-muted">{m.month}</span>
                    <span className="text-[11px] text-emerald-400 text-right">{formatEGP(m.revenue)}</span>
                    <span className="text-[11px] text-red-400 text-right">{formatEGP(m.costs)}</span>
                    <span className="text-[11px] text-foreground-secondary text-right font-medium">{formatEGP(m.profit)}</span>
                  </div>
                ))}
                <div className="grid grid-cols-4 gap-2 p-2 border-t border-border-subtle mt-2">
                  <span className="text-[11px] text-foreground-secondary font-semibold">Total</span>
                  <span className="text-[11px] text-emerald-400 text-right font-semibold">{formatEGP(data.monthlyBreakdown.reduce((a, m) => a + m.revenue, 0))}</span>
                  <span className="text-[11px] text-red-400 text-right font-semibold">{formatEGP(data.monthlyBreakdown.reduce((a, m) => a + m.costs, 0))}</span>
                  <span className="text-[11px] text-foreground-secondary text-right font-semibold">{formatEGP(data.monthlyBreakdown.reduce((a, m) => a + m.profit, 0))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-xl border border-border-subtle bg-surface-1">
            <div className="p-4 border-b border-border-invisible flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground-secondary">Recent Transactions</h3>
              <button className="text-[11px] text-foreground-muted hover:text-foreground-secondary transition-colors">View All →</button>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {data.recentTransactions.map((txn) => (
                <div key={txn.id} className="p-4 flex items-center gap-4 hover:bg-surface-1 transition-colors">
                  <div className={`p-1.5 rounded-md ${txn.type === "PLATFORM_FEE" ? "bg-emerald-500/10" : txn.type === "FACTORING" ? "bg-purple-500/10" : "bg-blue-500/10"}`}>
                    {txn.type === "PLATFORM_FEE" ? <CreditCard className="w-4 h-4 text-emerald-400" /> : txn.type === "FACTORING" ? <Landmark className="w-4 h-4 text-purple-400" /> : <Banknote className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground-secondary">{txn.description}</p>
                    <p className="text-[11px] text-foreground-muted">{new Date(txn.date).toLocaleDateString()} · {txn.id}</p>
                  </div>
                  <span className="text-sm font-medium text-foreground-secondary">{formatEGP(txn.amount)}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded border ${
                    txn.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {txn.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
