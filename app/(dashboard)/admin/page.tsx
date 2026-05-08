"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Banknote,
  Receipt,
  Users,
  CheckCircle,
  AlertTriangle,
  Server,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Settings,
  Eye,
  FileText,
  Zap,
  TrendingUp,
  Search,
  Trash2,
  Edit3,
  Play,
  Bot,
  MessageSquare,
  Star,
  BarChart3,
  ShoppingCart,
  Truck,
  Landmark,
  ShieldCheck,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { FinancialInsights } from "@/components/admin/financial-insights";
import { EtaIntegrations } from "@/components/admin/eta-integrations";
import { ReviewSystem } from "@/components/admin/review-system";

// ─── TYPES ───
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant: string;
  status: "active" | "suspended" | "pending";
  lastActive: string;
}

interface DemoTransaction {
  id: string;
  hotel: string;
  supplier: string;
  products: string[];
  total: number;
  status: string;
  etaStatus: string;
  timestamp: string;
}

// ─── MOCK DATA ───
const MOCK_USERS: User[] = [
  { id: "u1", name: "Ahmed Hassan", email: "ahmed@fourseasons.com", role: "hotel_manager", tenant: "Four Seasons Cairo", status: "active", lastActive: "2m ago" },
  { id: "u2", name: "Sara Khalil", email: "sara@marriott.com", role: "procurement_head", tenant: "Marriott Mena House", status: "active", lastActive: "15m ago" },
  { id: "u3", name: "Mohamed Ali", email: "mohamed@juhayna.com", role: "supplier_admin", tenant: "Juhayna Food Industries", status: "active", lastActive: "1h ago" },
  { id: "u4", name: "Fatima Zahra", email: "fatima@hilton.com", role: "finance_controller", tenant: "Hilton Cairo", status: "suspended", lastActive: "3d ago" },
  { id: "u5", name: "Omar El-Sayed", email: "omar@edit.com.eg", role: "supplier_sales", tenant: "Edita Food Industries", status: "pending", lastActive: "Never" },
];



// ─── COMPONENTS ───

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function UserRow({ user, onDelete }: { user: User; onDelete: (id: string) => void }) {
  const statusColor = { active: "#34d399", suspended: "#ef4444", pending: "#fbbf24" }[user.status];
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-white/[0.02] transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center text-[11px] font-bold text-white/50">
          {user.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="text-sm text-white font-medium">{user.name}</p>
          <p className="text-[11px] text-white/30">{user.email} · {user.tenant}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider" style={{ background: `${statusColor}15`, color: statusColor }}>
          {user.status}
        </span>
        <span className="text-[11px] text-white/20">{user.lastActive}</span>
        <button onClick={() => onDelete(user.id)} className="p-1.5 rounded-lg text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12} className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-white/10"} />
      ))}
      <span className="text-[11px] text-white/50 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── GROK AGENT COMPONENT ───
function GrokAgentPanel() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    // Simulate Grok API call
    setTimeout(() => {
      setResponse(`**Analysis Complete**\n\nBased on current platform data:\n\n• Total active tenants: 47\n• Monthly GMV trend: +12% vs last month\n• Top performing supplier: Juhayna Food Industries (EGP 4.9M)\n• ETA compliance rate: 99.7%\n• 2 anomaly flags require attention\n\n**Recommendation:** Review credit limits for hotels in the Red Sea cluster — seasonal demand spike detected.`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
          <Bot size={16} className="text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Grok Admin Agent</h3>
          <p className="text-[10px] text-white/30">AI-powered platform analytics</p>
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Ask anything about platform data..."
          className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-purple-500/40"
        />
        <button onClick={submit} disabled={loading} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
          {loading ? "..." : "Ask"}
        </button>
      </div>
      {response && (
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[13px] text-white/70 leading-relaxed whitespace-pre-line">
          {response}
        </div>
      )}
    </div>
  );
}

// ─── DEMO MODE ───
function DemoModePanel() {
  const [active, setActive] = useState(false);
  const [transactions, setTransactions] = useState<DemoTransaction[]>([]);

  const runDemo = () => {
    setActive(true);
    const tx: DemoTransaction = {
      id: `DEMO-${Date.now()}`,
      hotel: "Four Seasons Cairo",
      supplier: "Juhayna Food Industries",
      products: ["Milk 1L × 200", "Yogurt × 150", "Cheese × 80"],
      total: 48500,
      status: "CONFIRMED",
      etaStatus: "SUBMITTED",
      timestamp: new Date().toISOString(),
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Play size={16} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Demo Transaction Mode</h3>
            <p className="text-[10px] text-white/30">Simulate complete order lifecycle</p>
          </div>
        </div>
        <button
          onClick={runDemo}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          Run Demo Order
        </button>
      </div>
      {transactions.length > 0 && (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-white/40">{tx.id}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{tx.status}</span>
              </div>
              <p className="text-[12px] text-white/70">{tx.hotel} → {tx.supplier}</p>
              <p className="text-[11px] text-white/40">EGP {tx.total.toLocaleString()} · ETA: {tx.etaStatus}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ───
export default function AdminMissionControl() {
  const [tab, setTab] = useState<"overview" | "users" | "transactions" | "financial" | "reviews" | "system">("overview");
  const [users, setUsers] = useState(MOCK_USERS);
  const [showAddUser, setShowAddUser] = useState(false);

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "users" as const, label: "Users", icon: Users },
    { id: "transactions" as const, label: "Transactions", icon: ShoppingCart },
    { id: "financial" as const, label: "Financial", icon: Banknote },
    { id: "reviews" as const, label: "Reviews", icon: Star },
    { id: "system" as const, label: "System", icon: Cpu },
  ];

  const deleteUser = (id: string) => setUsers((prev) => prev.filter((u) => u.id !== id));

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text-animated">Mission Control</span>
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            Platform administration, user governance, transaction monitoring, and AI analytics
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", borderColor: "rgba(239,68,68,0.20)" }}>
            <AlertTriangle size={12} />
            2 anomalies
          </span>
          <Link href="/admin/settings" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/70 hover:bg-white/[0.03] hover:text-white transition-colors">
            <Settings size={12} /> Settings
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              tab === t.id
                ? "bg-white/[0.06] text-white border border-white/[0.08]"
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Total Tenants" value="47" icon={Building2} color="#34d399" />
            <MetricCard label="Monthly GMV" value="2.4M EGP" icon={Banknote} color="#8B0A1E" />
            <MetricCard label="Platform Fees" value="48K EGP" icon={Receipt} color="#fbbf24" />
            <MetricCard label="Active Users" value="156" icon={Users} color="#55b3ff" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GrokAgentPanel />
            <DemoModePanel />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">System Health</h3>
              <div className="space-y-3">
                {["API 99.9%", "Database 99.99%", "ETA Bridge 99.5%", "Redis 100%"].map((s) => (
                  <div key={s} className="flex items-center justify-between">
                    <span className="text-xs text-white/50">{s.split(" ")[0]}</span>
                    <span className="text-[11px] text-emerald-400 font-medium">{s.split(" ")[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {["Order PO-2026-0042 confirmed", "ETA invoice validated", "New tenant onboarded", "Factoring request approved"].map((a) => (
                  <div key={a} className="flex items-center gap-2 text-[12px] text-white/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Add User", href: "#", icon: Plus },
                  { label: "Export Report", href: "#", icon: Download },
                  { label: "View Swarm", href: "/admin/swarm", icon: Zap },
                  { label: "Pipeline", href: "/admin/suppliers/pipeline", icon: TrendingUp },
                ].map((a) => (
                  <Link key={a.label} href={a.href} className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors text-[12px] text-white/50 hover:text-white">
                    <a.icon size={13} />
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── USERS TAB ─── */}
      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input placeholder="Search users..." className="pl-10 pr-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-white/[0.12] w-72" />
            </div>
            <button onClick={() => setShowAddUser(!showAddUser)} className="px-4 py-2 rounded-lg bg-[#8B0A1E] hover:bg-[#6B0512] text-white text-sm font-medium transition-colors flex items-center gap-2">
              <Plus size={14} /> Add User
            </button>
          </div>

          {showAddUser && (
            <div className="glass-card p-4 border border-[#8B0A1E]/20">
              <p className="text-sm text-white/60 mb-2">Add New User</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input placeholder="Full Name" className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none" />
                <input placeholder="Email" className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none" />
                <select className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white/50 outline-none">
                  <option>hotel_manager</option>
                  <option>supplier_admin</option>
                  <option>finance_controller</option>
                  <option>admin</option>
                </select>
                <button onClick={() => setShowAddUser(false)} className="px-4 py-2 rounded-lg bg-white/[0.05] text-white text-sm font-medium hover:bg-white/[0.08]">Create</button>
              </div>
            </div>
          )}

          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">All Users ({users.length})</h3>
              <span className="text-[11px] text-white/20">Manage accounts, suspend, or delete</span>
            </div>
            <div className="space-y-1">
              {users.map((u) => (
                <UserRow key={u.id} user={u} onDelete={deleteUser} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TRANSACTIONS TAB ─── */}
      {tab === "transactions" && (
        <div className="space-y-4">
          <DemoModePanel />
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Live Order Monitor</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {["PENDING", "CONFIRMED", "IN_TRANSIT", "DELIVERED", "INVOICED", "ETA_SUBMITTED"].map((status) => (
                <div key={status} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">{status}</p>
                  <p className="text-xl font-bold text-white mt-1">{Math.floor(Math.random() * 50 + 5)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── FINANCIAL TAB ─── */}
      {tab === "financial" && (
        <FinancialInsights />
      )}

      {/* ─── REVIEWS TAB ─── */}
      {tab === "reviews" && (
        <ReviewSystem />
      )}

      {/* ─── SYSTEM TAB ─── */}
      {tab === "system" && (
        <div className="space-y-6">
          <EtaIntegrations />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Agent Swarm Status</h3>
              <div className="space-y-2">
                {[
                  { name: "Growth Squad", agents: 12, status: "active" },
                  { name: "Operations Squad", agents: 10, status: "active" },
                  { name: "Intelligence Squad", agents: 9, status: "active" },
                  { name: "Execution Squad", agents: 10, status: "active" },
                ].map((squad) => (
                  <div key={squad.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]">
                    <span className="text-xs text-white/50">{squad.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-white/30">{squad.agents} agents</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.04]">
                <Link href="/admin/swarm" className="text-[11px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                  Open Swarm Control <ArrowUpRight size={10} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
