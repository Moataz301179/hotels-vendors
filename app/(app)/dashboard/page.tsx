"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  CreditCard,
  FileCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Users,
  Search,
  Shield,
  ClipboardList,
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  vatAmount: number;
  createdAt: string;
  hotel?: { name: string };
  supplier?: { name: string };
  items?: { product?: { name: string }; quantity: number; unitPrice: number }[];
}

interface HotelStat {
  totalOrders: number;
  pendingOrders: number;
  totalSpend: number;
  spend30Days: number;
  invoiceCount: number;
  etaAccepted: number;
  productCount: number;
  avgOrderValue: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AuthorityRule {
  id: string;
  role: string;
  minValue: number;
  maxValue: number;
  category: string;
  action: string;
  name?: string;
}

const STATUS_BADGE: Record<string, string> = {
  DRAFT: "bg-slate-500/10 text-slate-400",
  PENDING_APPROVAL: "bg-amber-500/10 text-amber-400",
  APPROVED: "bg-blue-500/10 text-blue-400",
  REJECTED: "bg-red-500/10 text-red-400",
  CONFIRMED: "bg-emerald-500/10 text-emerald-400",
  IN_TRANSIT: "bg-cyan-500/10 text-cyan-400",
  DELIVERED: "bg-emerald-500/10 text-emerald-400",
  DISPUTED: "bg-red-500/10 text-red-400",
  CANCELLED: "bg-slate-500/10 text-slate-400",
};

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  REGIONAL_GM: "Regional GM",
  GM: "General Manager",
  FINANCIAL_CONTROLLER: "Controller",
  DEPARTMENT_HEAD: "Dept Head",
  CLERK: "Clerk",
  RECEIVING_CLERK: "Receiving",
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<HotelStat | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [rules, setRules] = useState<AuthorityRule[]>([]);
  const [hotel, setHotel] = useState<{ name: string; city: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function load() {
      try {
        const [oRes, sRes, uRes, rRes, hRes] = await Promise.all([
          fetch("/api/orders?limit=50"),
          fetch("/api/hotels/cm00000000000000000000001/stats").catch(() => null),
          fetch("/api/users?limit=10"),
          fetch("/api/authority"),
          fetch("/api/hotels?limit=1"),
        ]);
        const oData = await oRes.json();
        if (oData.success) setOrders(oData.data);
        if (sRes) {
          const sData = await sRes.json();
          if (sData.success) setStats(sData.data);
        }
        const uData = await uRes.json();
        if (uData.success) setUsers(uData.data);
        const rData = await rRes.json();
        if (rData.success) setRules(rData.data);
        const hData = await hRes.json();
        if (hData.success && hData.data.length > 0) {
          setHotel({ name: hData.data[0].name, city: hData.data[0].city });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "PENDING_APPROVAL");
  const recentOrders = orders.slice(0, 10);

  const filteredOrders = recentOrders.filter((o) => {
    const matchSearch =
      search === "" ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.hotel?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.supplier?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/orders/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, approverId: "system", action: "APPROVE" }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "APPROVED" } : o)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/orders/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, approverId: "system", action: "REJECT" }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "REJECTED" } : o)));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          Loading command center...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Command Center</h1>
          <p className="text-[11px] text-foreground-muted">{hotel ? `${hotel.name} · ${hotel.city}` : "Loading hotel..."}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            ETA Connected
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
            Credit: EGP {(stats?.totalSpend || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {[
          { label: "Pending POs", value: pendingOrders.length, icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
          { label: "Total Spend", value: `EGP ${(stats?.totalSpend || 0).toLocaleString()}`, icon: <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> },
          { label: "30-Day Spend", value: `EGP ${(stats?.spend30Days || 0).toLocaleString()}`, icon: <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> },
          { label: "ETA Approved", value: `${stats?.invoiceCount ? Math.round((stats.etaAccepted / stats.invoiceCount) * 100) : 0}%`, icon: <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> },
          { label: "Avg Order", value: `EGP ${(stats?.avgOrderValue || 0).toLocaleString()}`, icon: <ShoppingCart className="w-3.5 h-3.5 text-violet-400" /> },
          { label: "Products", value: stats?.productCount || 0, icon: <Package className="w-3.5 h-3.5 text-cyan-400" /> },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-md border border-border-subtle bg-surface p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] uppercase tracking-wider text-foreground-muted font-medium">{kpi.label}</span>
              {kpi.icon}
            </div>
            <div className="text-sm font-semibold">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Orders Table */}
        <div className="lg:col-span-2 rounded-md border border-border-subtle bg-surface">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-surface-raised/50">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-3.5 h-3.5 text-foreground-muted" />
              <h2 className="text-xs font-semibold">Purchase Orders</h2>
              <span className="text-[9px] px-1 py-0 rounded-full bg-surface text-foreground-muted border border-border-subtle">{orders.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground-muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-6 pr-2 py-[3px] text-[11px] rounded-md bg-background border border-border-subtle focus:border-brand-500/50 focus:outline-none w-36"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-[11px] rounded-md bg-background border border-border-subtle px-1.5 py-[3px] focus:border-brand-500/50 focus:outline-none"
              >
                <option value="ALL">All</option>
                <option value="PENDING_APPROVAL">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="DELIVERED">Delivered</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border-subtle text-foreground-muted">
                  <th className="text-left px-3 py-1.5 font-medium">PO #</th>
                  <th className="text-left px-3 py-1.5 font-medium">Supplier</th>
                  <th className="text-left px-3 py-1.5 font-medium">Items</th>
                  <th className="text-right px-3 py-1.5 font-medium">Total</th>
                  <th className="text-left px-3 py-1.5 font-medium">Status</th>
                  <th className="text-right px-3 py-1.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-foreground-muted">No orders match your filters.</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border-subtle/40 hover:bg-surface-raised/40 transition-colors">
                      <td className="px-3 py-1.5 font-mono text-foreground-muted">{order.orderNumber}</td>
                      <td className="px-3 py-1.5">{order.supplier?.name || "—"}</td>
                      <td className="px-3 py-1.5 text-foreground-muted">{order.items?.length || 0} items</td>
                      <td className="px-3 py-1.5 text-right font-mono">EGP {order.total?.toLocaleString()}</td>
                      <td className="px-3 py-1.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[9px] font-medium ${STATUS_BADGE[order.status] || ""}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        {order.status === "PENDING_APPROVAL" ? (
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleApprove(order.id)} className="p-[3px] rounded hover:bg-emerald-500/10 text-emerald-400 transition-colors" title="Approve">
                              <CheckCircle2 className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleReject(order.id)} className="p-[3px] rounded hover:bg-red-500/10 text-red-400 transition-colors" title="Reject">
                              <XCircle className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <Link href={`/orders/${order.id}`} className="text-[9px] text-brand-400 hover:underline">View</Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Approval Queue */}
          <div className="rounded-md border border-border-subtle bg-surface">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-surface-raised/50">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <h2 className="text-xs font-semibold">Approval Queue</h2>
              {pendingOrders.length > 0 && (
                <span className="text-[9px] px-1 py-0 rounded-full bg-amber-500/10 text-amber-400">{pendingOrders.length}</span>
              )}
            </div>
            <div className="divide-y divide-border-subtle/40">
              {pendingOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="px-3 py-2 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium truncate">{order.orderNumber}</div>
                    <div className="text-[9px] text-foreground-muted">{order.supplier?.name} · EGP {order.total?.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleApprove(order.id)} className="px-1.5 py-[3px] text-[9px] rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">Approve</button>
                    <button onClick={() => handleReject(order.id)} className="px-1.5 py-[3px] text-[9px] rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Reject</button>
                  </div>
                </div>
              ))}
              {pendingOrders.length === 0 && (
                <div className="px-3 py-5 text-center text-[11px] text-foreground-muted">No pending approvals</div>
              )}
            </div>
          </div>

          {/* Team */}
          <div className="rounded-md border border-border-subtle bg-surface">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-surface-raised/50">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <h2 className="text-xs font-semibold">Team</h2>
            </div>
            <div className="divide-y divide-border-subtle/40">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="px-3 py-1.5 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-700 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                    {user.name?.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium truncate">{user.name}</div>
                    <div className="text-[9px] text-foreground-muted">{ROLE_LABELS[user.role] || user.role}</div>
                  </div>
                  <span className={`ml-auto text-[9px] px-1 py-[1px] rounded-full ${user.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"}`}>{user.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Authority Matrix Preview */}
          <div className="rounded-md border border-border-subtle bg-surface">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-surface-raised/50">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <h2 className="text-xs font-semibold">Authority Rules</h2>
            </div>
            <div className="divide-y divide-border-subtle/40">
              {rules.slice(0, 4).map((rule) => (
                <div key={rule.id} className="px-3 py-1.5">
                  <div className="text-[11px] font-medium">{rule.name || `${rule.role} Rule`}</div>
                  <div className="text-[9px] text-foreground-muted">{ROLE_LABELS[rule.role] || rule.role} · EGP {rule.minValue.toLocaleString()} – {rule.maxValue.toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="px-3 py-1.5 border-t border-border-subtle">
              <Link href="/authority" className="text-[9px] text-brand-400 hover:underline">View all rules →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
