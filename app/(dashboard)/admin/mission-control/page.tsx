"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  XCircle, Clock, Package, Users, Building2, Truck, CreditCard,
  Shield, BarChart3, Activity, Wallet
} from "lucide-react";

interface MissionControlData {
  counts: {
    hotels: number;
    suppliers: number;
    orders: number;
    pendingOrders: number;
    spendRequests: number;
    pendingSpendRequests: number;
    approvedSpendRequests: number;
    rejectedSpendRequests: number;
    budgetGates: number;
    activeBudgetGates: number;
    users: number;
    products: number;
    factoringRequests: number;
    creditFacilities: number;
    invoices: number;
  };
  financials: {
    totalOrderValue: number;
    spendGatekeeperStats: Array<{ status: string; _count: { id: number }; _sum: { total: number | null } }>;
  };
  budgetStatus: Array<{
    id: string;
    name: string;
    totalBudget: number;
    spentAmount: number;
    reservedAmount: number;
    status: string;
    pctUsed: number;
  }>;
  recentOrders: Array<any>;
  recentSpendRequests: Array<any>;
  lowStockProducts: Array<any>;
  pendingApprovals: Array<any>;
  generatedAt: string;
}

export default function MissionControlPage() {
  const [data, setData] = useState<MissionControlData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>("-");

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/mission-control", { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setLastRefresh(new Date().toLocaleTimeString());
      } else {
        setError(json.error || "Failed to load");
      }
    } catch {
      setError("Network error — check connection");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">Mission Control Unavailable</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchData}><RefreshCw className="w-4 h-4 mr-1" /> Retry</Button>
      </div>
    );
  }

  if (!data) return null;

  const c = data.counts;
  const gatekeeperPct = c.spendRequests > 0 ? Math.round((c.approvedSpendRequests / c.spendRequests) * 100) : 0;

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
          <p className="text-muted-foreground">Live platform overview — auto-refreshes every 30s</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Last refresh: {lastRefresh}</span>
          <Button size="sm" variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Core Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Hotels" value={c.hotels} icon={Building2} color="text-blue-500" />
        <StatCard title="Suppliers" value={c.suppliers} icon={Truck} color="text-amber-500" />
        <StatCard title="Orders" value={c.orders} sub={`${c.pendingOrders} pending approval`} icon={Package} color="text-green-500" />
        <StatCard title="Users" value={c.users} icon={Users} color="text-purple-500" />
        <StatCard title="Spend Requests" value={c.spendRequests} sub={`${c.pendingSpendRequests} pending`} icon={Shield} color="text-rose-500" />
        <StatCard title="Gatekeeper Approval Rate" value={`${gatekeeperPct}%`} sub={`${c.approvedSpendRequests} approved · ${c.rejectedSpendRequests} rejected`} icon={CheckCircle2} color="text-emerald-500" />
        <StatCard title="Active Budget Gates" value={c.activeBudgetGates} sub={`${c.budgetGates} total`} icon={Wallet} color="text-cyan-500" />
        <StatCard title="Total Order Value" value={`${Number(data.financials.totalOrderValue).toLocaleString("en-GB", { minimumFractionDigits: 0 })} EGP`} icon={BarChart3} color="text-indigo-500" />
      </div>

      {/* Budget Gate Status */}
      {data.budgetStatus.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="w-5 h-5" /> Budget Gate Status</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.budgetStatus.map((bg) => (
                <div key={bg.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{bg.name}</span>
                    <span className={`font-mono ${bg.pctUsed >= 100 ? "text-red-500" : bg.pctUsed >= 80 ? "text-amber-500" : "text-green-500"}`}>
                      {bg.pctUsed}% used
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${bg.pctUsed >= 100 ? "bg-red-500" : bg.pctUsed >= 80 ? "bg-amber-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(bg.pctUsed, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Spent: {Number(bg.spentAmount).toLocaleString()} · Reserved: {Number(bg.reservedAmount).toLocaleString()} · Budget: {Number(bg.totalBudget).toLocaleString()} EGP
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Approvals */}
      {data.pendingApprovals.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              Pending Order Approvals ({data.pendingApprovals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.pendingApprovals.map((o: any) => (
                <div key={o.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2">
                  <div>
                    <span className="font-medium">{o.orderNumber}</span>
                    <span className="text-muted-foreground ml-2">{o.Hotel?.name} · {o.Supplier?.name}</span>
                    <span className="text-muted-foreground ml-2">by {o.Requester?.name}</span>
                  </div>
                  <div className="font-bold">{Number(o.total).toLocaleString("en-GB", { minimumFractionDigits: 2 })} EGP</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Two-column: Recent Orders + Recent Spend Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent>
            {data.recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No orders yet.</p>
            ) : (
              <div className="space-y-2">
                {data.recentOrders.map((o: any) => (
                  <div key={o.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2">
                    <div>
                      <span className="font-medium">{o.orderNumber}</span>
                      <Badge variant="outline" className="ml-2 text-xs">{o.status}</Badge>
                      <div className="text-muted-foreground text-xs">{o.Hotel?.name} · {o.Supplier?.name}</div>
                    </div>
                    <div className="font-mono">{Number(o.total).toLocaleString("en-GB", { minimumFractionDigits: 2 })}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Spend Requests</CardTitle></CardHeader>
          <CardContent>
            {data.recentSpendRequests.length === 0 ? (
              <p className="text-muted-foreground text-sm">No spend requests yet.</p>
            ) : (
              <div className="space-y-2">
                {data.recentSpendRequests.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2">
                    <div>
                      <span className="font-medium">{s.requestNumber}</span>
                      <Badge variant="error" className={`ml-2 text-xs ${s.status === "APPROVED" ? "border-green-500 text-green-600" : s.status === "REJECTED" ? "border-red-500 text-red-600" : "border-amber-500 text-amber-600"}`}>
                        {s.status.replace(/_/g, " ")}
                      </Badge>
                      <div className="text-muted-foreground text-xs">{s.Hotel?.name} · {s.Requester?.name}</div>
                    </div>
                    <div className="font-mono">{Number(s.total).toLocaleString("en-GB", { minimumFractionDigits: 2 })}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {data.lowStockProducts.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alerts ({data.lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.lowStockProducts.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2">
                  <div>
                    <span className="font-medium">{p.name}</span>
                    <span className="text-muted-foreground ml-2">{p.sku}</span>
                    <span className="text-muted-foreground ml-2">Supplier: {p.Supplier?.name}</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">{p.stockQuantity} left</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground">
        Generated at {new Date(data.generatedAt).toLocaleString("en-GB")} · HotelsVendors Mission Control v3
      </div>
    </div>
  );
}
