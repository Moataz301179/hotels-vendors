"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Landmark,
  ShieldCheck,
  Truck,
  Search,
  Bell,
  UserCircle,
  Menu,
  X,
  LogOut,
  Receipt,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Banknote,
  TrendingUp,
  Package,
  CircleDollarSign,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

interface DashboardShellProps {
  children: ReactNode;
  role: string;
  userName?: string;
  tenantName?: string;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/hotel", label: "Procurement", icon: ShoppingBag },
  { href: "/dashboard/invoices", label: "Transactions", icon: FileText },
  { href: "/dashboard/factoring", label: "Credit Lines", icon: Landmark },
  { href: "/dashboard/eta", label: "ETA Compliance", icon: ShieldCheck },
  { href: "/dashboard/shipping", label: "Logistics", icon: Truck },
];

const BG_PAGE = "#0B0F17";
const BG_SURFACE = "#111520";
const BG_SIDEBAR = "#0D1119";
const BORDER = "rgba(255,255,255,0.06)";
const TEXT_PRIMARY = "#F0F2F5";
const TEXT_SECONDARY = "rgba(161,168,184,0.85)";
const TEXT_MUTED = "rgba(107,115,132,0.70)";
const ACCENT = "#FF6B00";
const ACCENT_LIGHT = "rgba(255,107,0,0.12)";
const SIDEBAR_WIDTH = 260;
const HEADER_HEIGHT = 56;

/* ═══ LIVE CONTEXT WIDGETS ═══ */

function ETAInvoiceTracker() {
  const invoices = [
    { id: "INV-2026-0041", amount: "124,500", status: "SUBMITTED", uuid: "ETA-8A3F-9B21", date: "Today" },
    { id: "INV-2026-0040", amount: "87,200", status: "VALIDATED", uuid: "ETA-7C2E-8A10", date: "Today" },
    { id: "INV-2026-0039", amount: "203,800", status: "SUBMITTED", uuid: "ETA-6D1D-7B09", date: "Yesterday" },
  ];

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Receipt size={14} style={{ color: ACCENT }} />
          <span className="text-[11px] font-semibold text-white/70">ETA E-Invoicing Pipeline</span>
        </div>
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#4ADE80" }}>Live</span>
      </div>
      <div className="space-y-2">
        {invoices.map((inv) => (
          <div key={inv.id} className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: inv.status === "VALIDATED" ? "#22C55E" : "#EAB308" }} />
              <span className="text-[11px] font-mono text-white/60">{inv.id}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-white/50">{inv.amount} EGP</span>
              <span className="text-[9px] font-mono text-white/30">{inv.uuid}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RFQMatchingPipeline() {
  const rfqs = [
    { id: "RFQ-0891", item: "Fresh Seafood (120kg)", matches: 4, status: "MATCHED", eta: "2h" },
    { id: "RFQ-0890", item: "Pool Chemicals (200L)", matches: 7, status: "MATCHED", eta: "1h" },
    { id: "RFQ-0889", item: "Guest Towels (500pcs)", matches: 2, status: "PENDING", eta: "4h" },
  ];

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: ACCENT }} />
          <span className="text-[11px] font-semibold text-white/70">RFQ Matching Pipeline</span>
        </div>
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}>3 Active</span>
      </div>
      <div className="space-y-2">
        {rfqs.map((rfq) => (
          <div key={rfq.id} className="flex items-center justify-between py-1.5">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-white/60 truncate">{rfq.item}</p>
              <p className="text-[10px] text-white/30">{rfq.id} · {rfq.eta} remaining</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-white/40">{rfq.matches} matches</span>
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{
                backgroundColor: rfq.status === "MATCHED" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)",
                color: rfq.status === "MATCHED" ? "#4ADE80" : "#FACC15",
              }}>{rfq.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReverseFactoringLimits() {
  const suppliers = [
    { name: "Al-Gomhouria Foods", limit: "500,000", used: "312,000", rate: "1.2%" },
    { name: "Nile Linen Co.", limit: "250,000", used: "98,000", rate: "1.4%" },
    { name: "Red Sea Chemicals", limit: "180,000", used: "178,500", rate: "1.1%" },
  ];

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CircleDollarSign size={14} style={{ color: ACCENT }} />
          <span className="text-[11px] font-semibold text-white/70">Supplier Reverse Factoring</span>
        </div>
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#F87171" }}>1 Near Limit</span>
      </div>
      <div className="space-y-2.5">
        {suppliers.map((s) => {
          const usedNum = parseInt(s.used.replace(/,/g, ""));
          const limitNum = parseInt(s.limit.replace(/,/g, ""));
          const pct = Math.round((usedNum / limitNum) * 100);
          return (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-white/60">{s.name}</span>
                <span className="text-[10px] text-white/40">{s.rate} HV</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${pct}%`,
                    backgroundColor: pct > 90 ? "#EF4444" : pct > 70 ? "#EAB308" : ACCENT,
                  }} />
                </div>
                <span className="text-[10px] text-white/40 w-20 text-right">{s.used} / {s.limit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardShell({ children, role, userName, tenantName }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG_PAGE, fontFamily: "'Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40, backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: mobileOpen ? 0 : undefined,
          width: SIDEBAR_WIDTH,
          height: "100vh",
          backgroundColor: BG_SIDEBAR,
          borderRight: `1px solid ${BORDER}`,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s ease",
          transform: mobileOpen ? "translateX(0)" : undefined,
        }}
        className={mobileOpen ? "" : "hidden md:flex"}
      >
        {/* Logo */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <BrandLogo variant="dark" size="xs" showText={false} forceColor="bw" />
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY }}>HotelsVendors</span>
              <span style={{ display: "block", fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.06 }}>Dashboard</span>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} style={{ display: "none", background: "none", border: "none", cursor: "pointer" }} className="md:hidden">
            <X size={18} color={TEXT_MUTED} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 12px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? ACCENT : TEXT_SECONDARY,
                  backgroundColor: isActive ? ACCENT_LIGHT : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, backgroundColor: BG_SURFACE }}>
            <UserCircle size={28} color={ACCENT} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_PRIMARY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userName || roleLabel}
              </div>
              {tenantName && (
                <div style={{ fontSize: 11, color: TEXT_MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tenantName}
                </div>
              )}
            </div>
            <Link href="/logout" style={{ color: TEXT_MUTED, display: "flex" }}>
              <LogOut size={16} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ marginLeft: 0 }} className="md:ml-[260px]">
        {/* Header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            height: HEADER_HEIGHT,
            backgroundColor: BG_SURFACE,
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
              className="md:hidden"
            >
              <Menu size={20} color={TEXT_SECONDARY} />
            </button>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.06,
                color: ACCENT,
                backgroundColor: ACCENT_LIGHT,
                padding: "4px 10px",
                borderRadius: 4,
              }}
            >
              {roleLabel}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 6, display: "flex" }}>
              <Search size={18} color={TEXT_MUTED} />
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 6, display: "flex", position: "relative" }}>
              <Bell size={18} color={TEXT_MUTED} />
              <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", backgroundColor: "#EF4444", border: "1px solid #0D1119" }} />
            </button>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: ACCENT_LIGHT,
                color: ACCENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 600,
                marginLeft: 4,
              }}
            >
              {(userName || "U").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content with live context widgets */}
        <main style={{ padding: "24px" }}>
          {/* Live context strip */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <ETAInvoiceTracker />
            <RFQMatchingPipeline />
            <ReverseFactoringLimits />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
