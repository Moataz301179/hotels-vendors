"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ── Stripe Palette ──
const BG_PAGE = "#f7f8fa";
const BG_SURFACE = "#ffffff";
const BG_SIDEBAR = "#fafbfc";
const BORDER = "#e3e8ee";
const TEXT_PRIMARY = "#1a1f36";
const TEXT_SECONDARY = "#525f7f";
const TEXT_MUTED = "#8898aa";
const ACCENT = "#635bff";
const ACCENT_LIGHT = "#ededff";

const NAV_ITEMS = [
  { href: "/invo/dashboard", label: "Dashboard" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/invo/orders", label: "Orders" },
  { href: "/invo/invoices", label: "Invoices" },
  { href: "/invo/factoring", label: "Factoring" },
  { href: "/invo/agents", label: "Agents" },
];

export default function InvoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: BG_PAGE, color: TEXT_PRIMARY }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="w-60 shrink-0 flex flex-col border-r hidden md:flex"
        style={{ backgroundColor: BG_SIDEBAR, borderColor: BORDER }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: BORDER }}>
          <Link href="/invo/dashboard" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
              style={{ backgroundColor: ACCENT, color: "#ffffff" }}
            >
              HV
            </div>
            <div>
              <span className="text-sm font-semibold tracking-tight" style={{ color: TEXT_PRIMARY }}>
                HotelsVendors
              </span>
              <span
                className="block text-[10px] font-medium uppercase tracking-wider"
                style={{ color: ACCENT }}
              >
                INVO Layer
              </span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors"
                style={{
                  backgroundColor: isActive ? ACCENT_LIGHT : "transparent",
                  color: isActive ? ACCENT : TEXT_SECONDARY,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer badge */}
        <div className="px-4 py-4 border-t" style={{ borderColor: BORDER }}>
          <div
            className="rounded-lg px-3 py-2.5 text-center"
            style={{ backgroundColor: ACCENT_LIGHT }}
          >
            <div
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: ACCENT }}
            >
              Marketplace Engine
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: TEXT_MUTED }}>
              PostgreSQL · Prisma
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header
          className="sticky top-0 z-10 px-6 py-3 border-b flex items-center justify-between"
          style={{ backgroundColor: BG_SURFACE, borderColor: BORDER }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[12px]" style={{ color: TEXT_MUTED }}>
            <span>INVO</span>
            <span>/</span>
            <span style={{ color: TEXT_SECONDARY, fontWeight: 500 }}>
              {(() => {
                const last = pathname.split("/").pop() || "dashboard";
                return last.charAt(0).toUpperCase() + last.slice(1);
              })()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
              Supabase · INVO
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold"
              style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}
            >
              U
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
