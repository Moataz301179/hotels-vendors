import {
  Clock,
  CreditCard,
  TrendingUp,
  FileCheck,
  ShoppingCart,
  Package,
  CheckCircle,
  XCircle,
  Search,
  ChevronDown,
  Users,
  Shield,
} from "lucide-react";

const METRICS = [
  { label: "PENDING POS", value: "1", icon: Clock, iconBg: "bg-amber-500/15 text-amber-400" },
  { label: "TOTAL SPEND", value: "EGP 0", icon: CreditCard, iconBg: "bg-emerald-500/15 text-emerald-400" },
  { label: "30-DAY SPEND", value: "EGP 0", icon: TrendingUp, iconBg: "bg-blue-500/15 text-blue-400" },
  { label: "ETA APPROVED", value: "0%", icon: FileCheck, iconBg: "bg-emerald-500/15 text-emerald-400" },
  { label: "AVG ORDER", value: "EGP 0", icon: ShoppingCart, iconBg: "bg-purple-500/15 text-purple-400" },
  { label: "PRODUCTS", value: "8", icon: Package, iconBg: "bg-cyan-500/15 text-cyan-400" },
];

const ORDERS = [
  { id: "ORD-2026-0003", supplier: "CleanMax Professional", items: 2, total: "EGP 47,880", status: "PENDING APPROVAL" },
  { id: "ORD-2026-0002", supplier: "Cotton House Linens", items: 2, total: "EGP 142,500", status: "DELIVERED" },
  { id: "ORD-2026-0001", supplier: "Al-Gomhouria Food Supply", items: 3, total: "EGP 96,900", status: "DELIVERED" },
];

const TEAM = [
  { initials: "KF", name: "Karim Fathy", role: "Dept Head", status: "ACTIVE" },
  { initials: "LI", name: "Laila Ibrahim", role: "Dept Head", status: "ACTIVE" },
  { initials: "MF", name: "Mohamed Farouk", role: "Controller", status: "ACTIVE" },
  { initials: "SE", name: "Sarah El-Masry", role: "General Manager", status: "ACTIVE" },
  { initials: "AH", name: "Ahmed Hassan", role: "Owner", status: "ACTIVE" },
];

const AUTHORITY_RULES = [
  { role: "Owner", label: "Unlimited", range: "EGP 0 – 999,999,999" },
  { role: "GM", label: "Large Orders", range: "EGP 250,000 – 1,000,000" },
  { role: "Controller", label: "Medium Orders", range: "EGP 50,000 – 250,000" },
  { role: "Department Head", label: "Standard", range: "EGP 0 – 50,000" },
];

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "PENDING APPROVAL": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${styles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
      {status}
    </span>
  );
}

export default function HotelDashboardPage() {
  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-0.5">Nile Palace Hotel · Cairo</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ETA Connected
          </span>
          <span className="text-xs text-[var(--foreground-secondary)]">Credit: EGP 0</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {METRICS.map((m) => (
          <div key={m.label} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">{m.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.iconBg}`}>
                <m.icon size={16} />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left: Purchase Orders */}
        <div className="flex-1 min-w-0">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <ClipboardIcon />
                <h2 className="text-sm font-semibold text-white">Purchase Orders</h2>
                <span className="text-xs text-[var(--foreground-muted)]">3</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="h-9 w-48 pl-9 pr-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-default)] text-sm text-white placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent-500)]"
                  />
                </div>
                <button className="flex items-center gap-2 h-9 px-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-default)] text-xs text-[var(--foreground-secondary)] hover:text-white">
                  All <ChevronDown size={12} />
                </button>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">PO #</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Supplier</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Items</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((o) => (
                  <tr key={o.id} className="border-b border-[var(--border-subtle)] last:border-b-0">
                    <td className="px-5 py-3.5 text-white font-medium">{o.id}</td>
                    <td className="px-5 py-3.5 text-[var(--foreground-secondary)]">{o.supplier}</td>
                    <td className="px-5 py-3.5 text-[var(--foreground-secondary)]">{o.items} items</td>
                    <td className="px-5 py-3.5 text-white font-medium">{o.total}</td>
                    <td className="px-5 py-3.5"><StatusPill status={o.status} /></td>
                    <td className="px-5 py-3.5">
                      {o.status === "PENDING APPROVAL" ? (
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20">
                            <CheckCircle size={14} />
                          </button>
                          <button className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20">
                            <XCircle size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--accent-400)] cursor-pointer hover:underline">View</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Sidebar Cards */}
        <div className="w-[340px] flex-shrink-0 space-y-4">
          {/* Approval Queue */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-[var(--accent-400)]" />
              <h3 className="text-sm font-semibold text-white">Approval Queue</h3>
              <span className="ml-auto text-xs text-[var(--accent-400)] font-bold">1</span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-default)]">
                <p className="text-sm font-medium text-white">ORD-2026-0003</p>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">CleanMax Professional · EGP 47,880</p>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex-1 h-8 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 hover:bg-emerald-500/20">
                    Approve
                  </button>
                  <button className="flex-1 h-8 rounded-md bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20 hover:bg-red-500/20">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-[var(--accent-400)]" />
              <h3 className="text-sm font-semibold text-white">Team</h3>
            </div>
            <div className="space-y-3">
              {TEAM.map((t) => (
                <div key={t.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-500)] flex items-center justify-center text-white text-[10px] font-bold">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{t.name}</p>
                      <p className="text-[11px] text-[var(--foreground-muted)]">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Authority Rules */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-[var(--accent-400)]" />
              <h3 className="text-sm font-semibold text-white">Authority Rules</h3>
            </div>
            <div className="space-y-4">
              {AUTHORITY_RULES.map((r) => (
                <div key={r.role}>
                  <p className="text-sm font-medium text-white">{r.role} - {r.label}</p>
                  <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">{r.role} · {r.range}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 text-xs text-[var(--accent-400)] hover:underline">
              View all rules →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--foreground-muted)]">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}
