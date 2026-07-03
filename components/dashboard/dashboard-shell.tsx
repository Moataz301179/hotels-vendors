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
} from "lucide-react";

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

const BG_PAGE = "#f7f8fa";
const BG_SURFACE = "#ffffff";
const BG_SIDEBAR = "#ffffff";
const BORDER = "#e3e8ee";
const TEXT_PRIMARY = "#1a1f36";
const TEXT_SECONDARY = "#525f7f";
const TEXT_MUTED = "#8898aa";
const ACCENT = "#635bff";
const ACCENT_LIGHT = "#ededff";
const ACCENT_HOVER = "#5851db";
const SIDEBAR_WIDTH = 256;
const HEADER_HEIGHT = 56;

export function DashboardShell({ children, role, userName, tenantName }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG_PAGE, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40, backgroundColor: "rgba(0,0,0,0.3)" }}
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
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: ACCENT,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              HV
            </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, backgroundColor: BG_PAGE }}>
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
      <div style={{ marginLeft: 0 }} className="md:ml-[256px]">
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
            {/* Role badge */}
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
              <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", backgroundColor: "#df1b41", border: "1px solid #fff" }} />
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

        {/* Content */}
        <main style={{ padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
