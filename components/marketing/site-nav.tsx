"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, ShoppingCart, CreditCard, Building2, Smartphone, Truck, Store, FileUp, ShieldCheck, Calculator, Banknote, Landmark, Hotel, Factory, Briefcase } from "lucide-react";

interface MegaMenuItem {
  href: string;
  icon?: React.ElementType;
  label: string;
  desc?: string;
}

interface NavGroup {
  label: string;
  items: MegaMenuItem[];
}

function getGroups(): NavGroup[] {
  return [
    {
      label: "Products",
      items: [
        { href: "/marketplace", icon: Store, label: "INVO Marketplace", desc: "Verified Egyptian hospitality suppliers & bulk SKUs" },
        { href: "/categories", icon: ShoppingCart, label: "Category Hubs", desc: "Linens, Kitchen, HVAC, Amenities, Chemicals" },
        { href: "/rfq", icon: FileUp, label: "Hybrid RFQ Engine", desc: "Create custom volume bids & multi-vendor auctions" },
        { href: "/catalog/import", icon: Building2, label: "AI Catalog Ingestion", desc: "Import supplier price sheets via PDF/Excel with LLM auto-mapping" },
        { href: "/compliance", icon: ShieldCheck, label: "ETA Compliance Sentinel", desc: "Real-time e-Invoice validation & e-Waybill generation" },
      ],
    },
    {
      label: "Financing",
      items: [
        { href: "/factoring-service", icon: Banknote, label: "48-Hour Reverse Factoring", desc: "Instant supplier liquidity via Oliv based on verified GRN" },
        { href: "/financing/yield-calculator", icon: Calculator, label: "Dynamic Yield Calculator", desc: "Interactive 1.5%–3.0% early-payment discount simulator" },
        { href: "/financing/fra", icon: ShieldCheck, label: "FRA Regulatory Shield", desc: "Automated non-duplication registry checks & audit logs" },
        { href: "/financing/rails", icon: Landmark, label: "Bank & Payment Rails", desc: "InstaPay, Paymob, Fawry, local bank SWIFT integration" },
        { href: "/financing/oliv", icon: CreditCard, label: "Oliv Credit Line", desc: "Up to EGP 10M credit line for verified hotels" },
      ],
    },
    {
      label: "Solutions",
      items: [
        { href: "/hotels/join", icon: Hotel, label: "For Hotels & Resorts", desc: "Spend forecasting, budget guardrails, SAP/Oracle/Odoo PMS sync" },
        { href: "/suppliers/join", icon: Factory, label: "For Suppliers & Mills", desc: "INVO Mobile fulfillment, GRN camera audits, 48h cash-out" },
        { href: "/funders/join", icon: Landmark, label: "For Funders & Banks", desc: "Risk-graded loan portfolios, FRA-backed invoice locks" },
        { href: "/carriers/join", icon: Truck, label: "For Carriers & Logistics", desc: "ePOD scanning, ETA e-Waybill, GPS geofencing" },
        { href: "/solutions/erp", icon: Briefcase, label: "ERP Integrations", desc: "SAP, Odoo, Oracle Opera PMS, local accounting bi-directional sync" },
      ],
    },
  ];
}

function MegaDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-transparent border-0 cursor-pointer py-2"
      >
        {group.label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-[480px] bg-white border border-slate-200 rounded-xl p-3 grid grid-cols-1 gap-1 z-20">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  {Icon && (
                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                      <Icon size={15} className="text-slate-500" />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-slate-900">{item.label}</div>
                    {item.desc && (
                      <div className="text-xs text-slate-500 mt-0.5 leading-tight">{item.desc}</div>
                    )}
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

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const groups = getGroups();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 bg-white border-b border-slate-200">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0">
        <Image src="/logo-white.svg" alt="HotelsVendors" width={156} height={36} className="h-9 w-auto object-contain invert" priority />
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8">
        {groups.map((g) => (
          <MegaDropdown key={g.label} group={g} />
        ))}
        <Link href="/sandbox" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          Sandbox
        </Link>
        <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          Pricing
        </Link>
      </div>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <Link
          href="/login"
          className="text-sm px-4 py-2 font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="text-sm px-4 py-2 font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden text-slate-600 p-2"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 border-b border-slate-200 px-6 py-4 flex flex-col gap-4 md:hidden bg-white">
          {groups.map((g) => (
            <div key={g.label} className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{g.label}</span>
              {g.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-slate-600 hover:text-slate-900 py-1"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <hr className="border-slate-100" />
          <Link href="/sandbox" onClick={() => setMobileOpen(false)} className="text-sm text-slate-600 hover:text-slate-900">Sandbox</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)} className="text-sm text-slate-600 hover:text-slate-900">Pricing</Link>
          <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm text-slate-600 hover:text-slate-900">Sign In</Link>
          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="text-sm px-4 py-2 font-semibold rounded-md bg-slate-900 text-white text-center"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}