"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Shield,
  Users,
  BarChart3,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Plus,
  Trash2,
  UserCircle,
  ArrowRight,
} from "lucide-react";

/* ── Hotel Dashboard + Authority Matrix ── */
export default function HotelDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "matrix" | "users" | "spend">("overview");

  /* Authority Matrix State */
  const [rules, setRules] = useState([
    { id: 1, role: "Department Head", min: 0, max: 10000, category: "F&B", tier: "Any", action: "Auto-Approve" },
    { id: 2, role: "Department Head", min: 10000, max: 50000, category: "F&B", tier: "Premier", action: "Route to GM" },
    { id: 3, role: "GM", min: 50000, max: 200000, category: "Any", tier: "Any", action: "Approve" },
    { id: 4, role: "Financial Controller", min: 200000, max: 500000, category: "Any", tier: "Any", action: "Dual Sign-Off" },
    { id: 5, role: "Owner", min: 500000, max: 999999999, category: "Capital Equipment", tier: "Any", action: "Approve" },
  ]);

  const [newRule, setNewRule] = useState({ role: "Department Head", min: 0, max: 10000, category: "Any", tier: "Any", action: "Auto-Approve" });

  const addRule = () => {
    setRules([...rules, { ...newRule, id: Date.now() }]);
  };

  const removeRule = (id: number) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  /* Mock Data */
  const stats = [
    { label: "Pending POs", value: "12", change: "+3 today", color: "text-amber-400" },
    { label: "Monthly Spend", value: "EGP 1.2M", change: "On budget", color: "text-emerald-400" },
    { label: "ETA Submissions", value: "48", change: "100% compliant", color: "text-emerald-400" },
    { label: "Avg. Approval Time", value: "4.2 hrs", change: "-1.3 hrs", color: "text-emerald-400" },
  ];

  const approvalQueue = [
    { id: "PO-2841", supplier: "Nile Fresh Co.", amount: "EGP 45,000", requester: "F&B Manager", status: "Pending", priority: "High" },
    { id: "PO-2840", supplier: "Delta Linens", amount: "EGP 12,500", requester: "Housekeeping Lead", status: "Approved", priority: "Normal" },
    { id: "PO-2839", supplier: "Cairo Engineering", amount: "EGP 89,000", requester: "Engineering Head", status: "Rejected", priority: "High" },
    { id: "PO-2838", supplier: "Red Sea Fisheries", amount: "EGP 28,000", requester: "F&B Manager", status: "Pending", priority: "Normal" },
  ];

  const users = [
    { name: "Ahmed Hassan", role: "Owner", properties: "All", lastActive: "Now" },
    { name: "Sara Khalil", role: "Regional GM", properties: "Cairo Cluster (8)", lastActive: "5m ago" },
    { name: "Omar Farouk", role: "GM", properties: "Nile Resort", lastActive: "1h ago" },
    { name: "Laila Mahmoud", role: "Financial Controller", properties: "All", lastActive: "2h ago" },
    { name: "Karim Nasser", role: "F&B Manager", properties: "Pyramids Plaza", lastActive: "3h ago" },
  ];

  const spendData = [
    { cat: "F&B", pct: 78, val: "EGP 936K", color: "from-brand-700 to-brand-500" },
    { cat: "Housekeeping", pct: 52, val: "EGP 624K", color: "from-brand-600 to-brand-400" },
    { cat: "Engineering", pct: 35, val: "EGP 420K", color: "from-brand-500 to-brand-300" },
    { cat: "Guest Amenities", pct: 28, val: "EGP 336K", color: "from-surface-hover to-foreground-faint" },
  ];

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "matrix", label: "Authority Matrix", icon: Shield },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "spend", label: "Spend Analytics", icon: BarChart3 },
  ] as const;

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Hotel Operations Dashboard</h1>
            <p className="text-sm text-foreground-muted mt-1">Nile Resort Group — 15 Properties</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/eta-demo"
              className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-raised transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Submit ETA Invoice
            </Link>
            <button className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-glow-red">
              <Plus className="h-4 w-4" />
              New Purchase Order
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 rounded-xl border border-border-subtle bg-surface p-1 mb-8 overflow-x-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === item.id
                  ? "bg-brand-700 text-white shadow-sm"
                  : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border-subtle bg-surface p-5">
                  <p className="text-xs text-foreground-faint">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold">{s.value}</p>
                  <p className={`text-xs mt-1 ${s.color}`}>{s.change}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Approval Queue */}
              <div className="lg:col-span-2 rounded-xl border border-border-subtle bg-surface p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Approval Queue</h3>
                  <Link href="/dashboard?tab=matrix" className="text-xs text-brand-400 hover:text-brand-300">
                    Configure Matrix
                  </Link>
                </div>
                <div className="space-y-2">
                  {approvalQueue.map((po) => (
                    <div key={po.id} className="flex items-center justify-between rounded-lg bg-background border border-border-subtle px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${
                          po.status === "Approved" ? "bg-emerald-400" :
                          po.status === "Rejected" ? "bg-red-400" : "bg-amber-400"
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{po.id} — {po.supplier}</p>
                          <p className="text-xs text-foreground-faint">{po.requester} • {po.amount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          po.priority === "High" ? "bg-red-500/10 text-red-400" : "bg-surface-raised text-foreground-faint"
                        }`}>{po.priority}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          po.status === "Approved" ? "bg-emerald-500/10 text-emerald-400" :
                          po.status === "Rejected" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                        }`}>{po.status}</span>
                        {po.status === "Pending" && (
                          <div className="flex gap-1">
                            <button className="rounded-md bg-emerald-600/20 p-1 hover:bg-emerald-600/30">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            </button>
                            <button className="rounded-md bg-red-600/20 p-1 hover:bg-red-600/30">
                              <XCircle className="h-3.5 w-3.5 text-red-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-border-subtle bg-surface p-5">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: "New Purchase Order", icon: Plus, color: "text-brand-400" },
                    { label: "Submit ETA Invoice", icon: CheckCircle2, color: "text-emerald-400" },
                    { label: "Add User", icon: Users, color: "text-amber-400" },
                    { label: "Delivery Schedule", icon: Truck, color: "text-foreground-muted" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="flex items-center gap-3 w-full rounded-lg bg-background border border-border-subtle px-4 py-3 text-sm hover:border-border-default transition-colors"
                    >
                      <action.icon className={`h-4 w-4 ${action.color}`} />
                      <span className="text-foreground-muted">{action.label}</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto text-foreground-faint" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AUTHORITY MATRIX TAB */}
        {activeTab === "matrix" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border-subtle bg-surface p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Authority Matrix Configurator</h2>
                  <p className="text-sm text-foreground-muted">Define who can approve what, based on order value, category, and supplier tier.</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Changes require Owner approval
                </div>
              </div>

              {/* Rules Table */}
              <div className="rounded-xl border border-border-subtle bg-background overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-surface-raised text-xs text-foreground-faint uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-left">Value Range (EGP)</th>
                      <th className="px-4 py-3 text-left">Category</th>
                      <th className="px-4 py-3 text-left">Supplier Tier</th>
                      <th className="px-4 py-3 text-left">Action</th>
                      <th className="px-4 py-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {rules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-surface-raised/30">
                        <td className="px-4 py-3 font-medium">{rule.role}</td>
                        <td className="px-4 py-3 text-foreground-muted">
                          {rule.min.toLocaleString()} — {rule.max === 999999999 ? "∞" : rule.max.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-xs">{rule.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-xs">{rule.tier}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${
                            rule.action === "Auto-Approve" ? "text-emerald-400" :
                            rule.action === "Approve" ? "text-brand-400" :
                            rule.action === "Dual Sign-Off" ? "text-amber-400" : "text-foreground-muted"
                          }`}>{rule.action}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => removeRule(rule.id)} className="text-foreground-faint hover:text-red-400 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Rule */}
              <div className="rounded-xl border border-border-subtle bg-background p-5">
                <h4 className="text-sm font-semibold mb-4">Add New Rule</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                  <div>
                    <label className="block text-xs text-foreground-faint mb-1.5">Role</label>
                    <select
                      value={newRule.role}
                      onChange={(e) => setNewRule({ ...newRule, role: e.target.value })}
                      className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground focus:border-brand-600 focus:outline-none"
                    >
                      {["Department Head", "GM", "Financial Controller", "Owner", "Regional GM"].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-foreground-faint mb-1.5">Min (EGP)</label>
                    <input
                      type="number"
                      value={newRule.min}
                      onChange={(e) => setNewRule({ ...newRule, min: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground focus:border-brand-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground-faint mb-1.5">Max (EGP)</label>
                    <input
                      type="number"
                      value={newRule.max}
                      onChange={(e) => setNewRule({ ...newRule, max: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground focus:border-brand-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground-faint mb-1.5">Category</label>
                    <select
                      value={newRule.category}
                      onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                      className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground focus:border-brand-600 focus:outline-none"
                    >
                      {["Any", "F&B", "Housekeeping", "Engineering", "Capital Equipment", "Guest Amenities"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-foreground-faint mb-1.5">Action</label>
                    <select
                      value={newRule.action}
                      onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                      className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-foreground focus:border-brand-600 focus:outline-none"
                    >
                      {["Auto-Approve", "Route to GM", "Approve", "Dual Sign-Off", "Reject"].map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={addRule}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-glow-red"
                  >
                    <Plus className="h-4 w-4" />
                    Add Rule
                  </button>
                </div>
              </div>
            </div>

            {/* Approval Chain Visualizer */}
            <div className="rounded-xl border border-border-subtle bg-surface p-6">
              <h3 className="font-semibold mb-6">Sample Approval Chain</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {[
                  { role: "F&B Manager", action: "Submits PO", amount: "EGP 45,000", status: "done" },
                  { role: "GM", action: "Reviews", amount: "Within threshold", status: "done" },
                  { role: "Financial Controller", action: "Dual Sign-Off", amount: "Required > 200K", status: "skip" },
                  { role: "Owner", action: "Final Approval", amount: "Not required", status: "skip" },
                ].map((step, i, arr) => (
                  <div key={step.role} className="flex items-center gap-4">
                    <div className={`rounded-xl border p-4 min-w-[160px] ${
                      step.status === "done" ? "border-emerald-600/30 bg-emerald-900/10" :
                      step.status === "skip" ? "border-border-subtle bg-surface-raised opacity-50" :
                      "border-amber-600/30 bg-amber-900/10"
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <UserCircle className={`h-4 w-4 ${
                          step.status === "done" ? "text-emerald-400" :
                          step.status === "skip" ? "text-foreground-faint" : "text-amber-400"
                        }`} />
                        <span className="text-sm font-semibold">{step.role}</span>
                      </div>
                      <p className="text-xs text-foreground-muted">{step.action}</p>
                      <p className="text-xs text-foreground-faint mt-1">{step.amount}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <ArrowRight className="hidden md:block h-4 w-4 text-foreground-faint" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="rounded-xl border border-border-subtle bg-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Users &amp; Roles</h2>
                <p className="text-sm text-foreground-muted">Manage access across your hotel group</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-glow-red">
                <Plus className="h-4 w-4" />
                Invite User
              </button>
            </div>

            <div className="rounded-xl border border-border-subtle bg-background overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-raised text-xs text-foreground-faint uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Properties</th>
                    <th className="px-4 py-3 text-left">Last Active</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {users.map((u) => (
                    <tr key={u.name} className="hover:bg-surface-raised/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-brand-700/20 flex items-center justify-center text-brand-400 text-xs font-bold">
                            {u.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs ${
                          u.role === "Owner" ? "bg-brand-700/20 text-brand-400" :
                          u.role === "Financial Controller" ? "bg-amber-500/10 text-amber-400" :
                          "bg-surface-raised text-foreground-muted"
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-foreground-muted">{u.properties}</td>
                      <td className="px-4 py-3 text-foreground-faint text-xs">{u.lastActive}</td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-xs text-brand-400 hover:text-brand-300 mr-3">Edit</button>
                        <button className="text-xs text-foreground-faint hover:text-red-400">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SPEND ANALYTICS TAB */}
        {activeTab === "spend" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-xl border border-border-subtle bg-surface p-6">
                <h3 className="font-semibold mb-6">Spend by Category</h3>
                <div className="space-y-4">
                  {spendData.map((d) => (
                    <div key={d.cat}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-foreground-muted">{d.cat}</span>
                        <span className="text-foreground-faint">{d.val}</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-surface-raised overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${d.color}`} style={{ width: `${d.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Total Spend (YTD)", value: "EGP 14.2M", sub: "+8% vs last year" },
                  { label: "Budget Remaining", value: "EGP 3.8M", sub: "26% of annual budget" },
                  { label: "Top Supplier", value: "Nile Fresh Co.", sub: "EGP 2.1M YTD" },
                  { label: "Cost per Room Night", value: "EGP 185", sub: "-4% vs last quarter" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border-subtle bg-surface p-5">
                    <p className="text-xs text-foreground-faint">{s.label}</p>
                    <p className="text-xl font-bold mt-1">{s.value}</p>
                    <p className="text-xs text-emerald-400 mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface p-6">
              <h3 className="font-semibold mb-4">Monthly Spend Trend</h3>
              <div className="flex items-end gap-3 h-48">
                {[45, 52, 48, 61, 55, 70, 68, 82, 75, 88, 92, 98].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-md bg-brand-700/40 hover:bg-brand-600 transition-colors" style={{ height: `${h}%` }} />
                    <span className="text-[10px] text-foreground-faint">{["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
