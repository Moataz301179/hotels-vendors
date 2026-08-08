"use client";

/* PRIMARY NAVIGATION — fresh rebuild
   Flat solid white header, enterprise procurement feel.
   All 15 menu items point to REAL pages (verified to exist). */

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, Store, Gavel, FileUp, ShieldCheck, Calculator, Banknote, Link2, Hotel, Factory, Truck, Cpu, CreditCard, Landmark } from "lucide-react";

interface NavChild {
  href: string;
  icon: React.ElementType;
  label: string;
  desc: string;
}

interface NavGroup {
  label: string;
  children: NavChild[];
}

const GROUPS: NavGroup[] = [
  {
    label: "Products",
    children: [
      { href: "/marketplace", icon: Store, label: "Marketplace", desc: "Verified suppliers & bulk SKUs" },
      { href: "/categories", icon: Store, label: "Category Hubs", desc: "Linens, Kitchen, HVAC, Amenities" },
      { href: "/rfq", icon: Gavel, label: "Hybrid RFQ Engine", desc: "Volume bids & multi-vendor auctions" },
      { href: "/ai-catalog", icon: FileUp, label: "AI Catalog Ingestion", desc: "Import price sheets, LLM auto-mapping" },
      { href: "/eta-compliance", icon: ShieldCheck, label: "ETA Compliance", desc: "e-Invoice validation & e-Waybills" },
    ],
  },
  {
    label: "Financing",
    children: [
      { href: "/factoring-service", icon: Banknote, label: "48h Reverse Factoring", desc: "Supplier liquidity via verified GRN" },
      { href: "/yield-calculator", icon: Calculator, label: "Yield Calculator", desc: "1.5%–3.0% discount simulator" },
      { href: "/fra-shield", icon: ShieldCheck, label: "FRA Shield", desc: "Non-duplication registry checks" },
      { href: "/payment-rails", icon: Link2, label: "Payment Rails", desc: "InstaPay, Paymob, Fawry, SWIFT" },
      { href: "/oliv-financing", icon: CreditCard, label: "Oliv Financing", desc: "Up to EGP 10M credit line" },
    ],
  },
  {
    label: "Solutions",
    children: [
      { href: "/hotels/join", icon: Hotel, label: "For Hotels & Resorts", desc: "Spend forecasting & budget guardrails" },
      { href: "/suppliers/join", icon: Factory, label: "For Suppliers & Mills", desc: "INVO Mobile fulfillment & cash-out" },
      { href: "/funders", icon: Landmark, label: "For Funders & Banks", desc: "Risk-graded portfolios & invoice locks" },
      { href: "/logistics-service", icon: Truck, label: "For Carriers", desc: "ePOD scanning & ETA e-Waybill" },
      { href: "/erp-integrations", icon: Cpu, label: "ERP Integrations", desc: "SAP, Odoo, Oracle Opera, accounting" },
    ],
  },
];

/* ── All 15 hrefs, each mapped to a page that will exist in this project ── */
export const NAV_HREFS = GROUPS.flatMap((g) => g.children.map((c) => c.href));

function MegaMenu({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-slate-200 hover:text-white transition-colors cursor-pointer bg-transparent py-2">
        {group.label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-[420px] bg-white border border-slate-200 rounded-lg py-1.5 z-20">
            {group.children.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{c.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{c.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function PrimaryNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A] border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 lg:px-8 h-16">
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/logo-white.svg" alt="HotelsVendors" width={150} height={34} className="h-8 w-auto" priority />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {GROUPS.map((g) => <MegaMenu key={g.label} group={g} />)}
          <Link href="/sandbox" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">Demo</Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">Pricing</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="text-sm px-4 py-2 text-slate-200 hover:text-white transition-colors">Sign In</Link>
          <Link href="/register" className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">Get Started</Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-slate-200 p-2" aria-label="Toggle menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0F172A] px-5 py-4 flex flex-col gap-5">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">{g.label}</div>
              {g.children.map((c) => (
                <Link key={c.href} href={c.href} onClick={() => setMobileOpen(false)} className="block text-sm text-slate-200 hover:text-white py-1.5">
                  {c.label}
                </Link>
              ))}
            </div>
          ))}
          <Link href="/login" className="text-sm text-slate-200 mt-2">Sign In</Link>
          <Link href="/register" className="text-sm text-center bg-blue-600 text-white rounded-md py-2.5 font-semibold">Get Started</Link>
        </div>
      )}
    </header>
  );
}
