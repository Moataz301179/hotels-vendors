"use client";

import { ReactNode, useState, createContext, useContext } from "react";
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
import { InstallButton } from "@/components/pwa/install-button";
import { DashboardCartWrapper } from "@/components/cart/dashboard-cart-wrapper";
import { useApi } from "@/lib/hooks/use-api";

export interface DashboardContextValue {
  userId: string;
  platformRole: string;
  tenantId: string;
  hotelId?: string;
  supplierId?: string;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboardContext must be used within DashboardShell");
  return ctx;
}

interface DashboardShellProps {
  children: ReactNode;
  role: string;
  userName?: string;
  tenantName?: string;
  userId?: string;
  tenantId?: string;
  hotelId?: string;
  supplierId?: string;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/hotel", label: "Procurement", icon: ShoppingBag },
  { href: "/dashboard/invoices", label: "Transactions", icon: FileText },
  { href: "/dashboard/factoring", label: "Credit Lines", icon: Landmark },
  { href: "/dashboard/eta", label: "ETA Compliance", icon: ShieldCheck },
  { href: "/dashboard/shipping", label: "Logistics", icon: Truck },
];

const BG_PAGE = "var(--background)";
const BG_SURFACE = "var(--surface-raised)";
const BG_SIDEBAR = "var(--surface)";
const BORDER = "var(--border-subtle)";
const TEXT_PRIMARY = "var(--foreground)";
const TEXT_SECONDARY = "var(--foreground-secondary)";
const TEXT_MUTED = "var(--foreground-muted)";
const ACCENT = "var(--accent-base)";
const ACCENT_LIGHT = "var(--accent-muted)";
const SIDEBAR_WIDTH = 260;
const HEADER_HEIGHT = 56;

/* ═══ LIVE CONTEXT WIDGETS ═══ */

interface EtaInvoice {
  id: string;
  invoiceNumber: string;
  total: number;
  etaStatus: string;
  etaUuid: string | null;
  createdAt: string;
}

function ETAInvoiceTracker() {
  const { data, loading } = useApi<{ invoices: EtaInvoice[]; pagination: { total: number } }>("/api/v1/invoices?page=1&limit=5&sortOrder=desc");
  const invoices = data?.invoices ?? [];

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Receipt size={14} style={{ color: ACCENT }} />
          <span className="text-[11px] font-semibold text-white/70">ETA E-Invoicing Pipeline</span>
        </div>
        {invoices.length > 0 && (
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#4ADE80" }}>
            {data?.pagination?.total ?? 0}
          </span>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-4 rounded bg-white/[0.03] animate-pulse" />)
          }</div>
      ) : invoices.length === 0 ? (
        <p className="text-[11px] text-white/25 text-center py-3">No invoices yet</p>
      ) : (
        <div className="space-y-2">
          {invoices.slice(0, 5).map((inv) => (
            <div key={inv.id} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: inv.etaStatus === "VALIDATED" || inv.etaStatus === "ACCEPTED" ? "#22C55E" : "#EAB308" }} />
                <span className="text-[11px] font-mono text-white/60">{inv.invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-white/50">{inv.total.toLocaleString()} EGP</span>
                <span className="text-[9px] font-mono text-white/30">{inv.etaUuid ? inv.etaUuid.slice(0, 8) : "—"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface RfqItem {
  id: string;
  rfqNumber: string;
  title: string;
  status: string;
  responseCount: number;
  createdAt: string;
}

function RFQMatchingPipeline() {
  const { data, loading } = useApi<{ rfqs: RfqItem[]; pagination: { total: number } }>("/api/v1/rfq?page=1&limit=5&sortOrder=desc");
  const rfqs = data?.rfqs ?? [];
  const activeCount = rfqs.filter(r => r.status !== "CLOSED" && r.status !== "CANCELLED").length;

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: ACCENT }} />
          <span className="text-[11px] font-semibold text-white/70">RFQ Matching Pipeline</span>
        </div>
        {rfqs.length > 0 && (
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}>{activeCount} Active</span>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-4 rounded bg-white/[0.03] animate-pulse" />)
          }</div>
      ) : rfqs.length === 0 ? (
        <p className="text-[11px] text-white/25 text-center py-3">No RFQs yet</p>
      ) : (
        <div className="space-y-2">
          {rfqs.slice(0, 5).map((rfq) => (
            <div key={rfq.id} className="flex items-center justify-between py-1.5">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/60 truncate">{rfq.title}</p>
                <p className="text-[10px] text-white/30">{rfq.rfqNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-white/40">{rfq.responseCount} resp.</span>
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{
                  backgroundColor: rfq.status === "OPEN" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)",
                  color: rfq.status === "OPEN" ? "#4ADE80" : "#FACC15",
                }}>{rfq.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface FactoringLine {
  id: string;
  supplierName: string;
  creditLimit: number;
  utilized: number;
  rate: number;
}

function ReverseFactoringLimits() {
  const { data, loading } = useApi<{ facilities: FactoringLine[] }>("/api/v1/factoring/facilities?page=1&limit=5");
  const facilities = data?.facilities ?? [];
  const nearLimit = facilities.filter(f => f.creditLimit > 0 && (f.utilized / f.creditLimit) > 0.85).length;

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CircleDollarSign size={14} style={{ color: ACCENT }} />
          <span className="text-[11px] font-semibold text-white/70">Supplier Reverse Factoring</span>
        </div>
        {nearLimit > 0 && (
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#F87171" }}>{nearLimit} Near Limit</span>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-4 rounded bg-white/[0.03] animate-pulse" />)
          }</div>
      ) : facilities.length === 0 ? (
        <p className="text-[11px] text-white/25 text-center py-3">No factoring lines yet</p>
      ) : (
        <div className="space-y-2.5">
          {facilities.slice(0, 5).map((f) => {
            const pct = f.creditLimit > 0 ? Math.round((f.utilized / f.creditLimit) * 100) : 0;
            return (
              <div key={f.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-white/60">{f.supplierName}</span>
                  <span className="text-[10px] text-white/40">{(f.rate * 100).toFixed(1)}% HV</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${pct}%`,
                      backgroundColor: pct > 90 ? "#EF4444" : pct > 70 ? "#EAB308" : ACCENT,
                    }} />
                  </div>
                  <span className="text-[10px] text-white/40 w-24 text-right">{f.utilized.toLocaleString()} / {f.creditLimit.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DashboardShell({ children, role, userName, tenantName, userId, tenantId, hotelId, supplierId }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <DashboardContext.Provider value={{ userId: userId || "", platformRole: role, tenantId: tenantId || "", hotelId, supplierId }}>
    <DashboardCartWrapper>
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
        id="dashboard-sidebar"
        aria-label="Dashboard sidebar"
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
        <nav
          aria-label="Dashboard navigation"
          role="navigation"
          style={{ flex: 1, padding: "12px 12px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}
        >
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
          aria-label="Dashboard header"
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
              aria-expanded={mobileOpen}
              aria-controls="dashboard-sidebar"
              aria-label="Open navigation menu"
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
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <InstallButton />
              <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 6, display: "flex", position: "relative" }}>
                <Bell size={18} color={TEXT_MUTED} />
                <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", backgroundColor: "#EF4444", border: "1px solid #0D1119" }} />
              </button>
            </div>
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
        <main aria-label="Dashboard content" style={{ padding: "24px" }}>
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
    </DashboardCartWrapper>
    </DashboardContext.Provider>
  );
}
