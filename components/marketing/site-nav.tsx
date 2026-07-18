"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

interface MegaItem {
  label: string;
  href: string;
  desc?: string;
}

interface MegaColumn {
  heading: string;
  items: MegaItem[];
}

interface MegaTab {
  label: string;
  columns: MegaColumn[];
}

const NAV_TABS: MegaTab[] = [
  {
    label: "Platform",
    columns: [
      {
        heading: "Product",
        items: [
          { label: "Platform Overview", href: "/platform", desc: "How the hub works end-to-end" },
          { label: "Solutions", href: "/solutions", desc: "By role and property type" },
          { label: "How It Works", href: "/flow", desc: "Order → finance → deliver flow" },
          { label: "INVO", href: "/#invo", desc: "Vendor marketplace engine" },
        ],
      },
      {
        heading: "Compliance",
        items: [
          { label: "ETA E-Invoicing", href: "/compliance", desc: "Egyptian Tax Authority native" },
          { label: "VAT Invoicing", href: "/vat-invoicing", desc: "Signed, UUID-stamped invoices" },
        ],
      },
    ],
  },
  {
    label: "Marketplace",
    columns: [
      {
        heading: "Discover",
        items: [
          { label: "Marketplace", href: "/marketplace", desc: "Browse hospitality SKUs" },
          { label: "Hotels", href: "/hotels", desc: "Buyer procurement portal" },
          { label: "Suppliers", href: "/suppliers", desc: "Verified supplier network" },
        ],
      },
      {
        heading: "Join",
        items: [
          { label: "Become a Supplier", href: "/become-supplier", desc: "Onboard your catalog" },
          { label: "Hotels Join", href: "/hotels/join", desc: "List your property" },
          { label: "Suppliers Join", href: "/suppliers/join", desc: "Fast-track signup" },
        ],
      },
    ],
  },
  {
    label: "Finance & Logistics",
    columns: [
      {
        heading: "Finance",
        items: [
          { label: "Factoring", href: "/factoring-service", desc: "Non-recourse liquidity" },
          { label: "Oliv Financing", href: "/financing/oliv", desc: "Get paid in 48h, up to EGP 10M" },
          { label: "Pricing", href: "/pricing", desc: "Transactional fee tiers" },
        ],
      },
      {
        heading: "Logistics",
        items: [
          { label: "Logistics Service", href: "/logistics-service", desc: "Shared-route fulfillment" },
        ],
      },
    ],
  },
  {
    label: "Company",
    columns: [
      {
        heading: "About",
        items: [
          { label: "About Us", href: "/about", desc: "The Market Changer story" },
          { label: "Contact", href: "/contact", desc: "Talk to our team" },
          { label: "Demo", href: "/demo", desc: "See the platform in action" },
        ],
      },
      {
        heading: "Resources",
        items: [
          { label: "Help & Guides", href: "/help", desc: "Docs and walkthroughs" },
          { label: "Social Media", href: "/social-media", desc: "Follow our channels" },
        ],
      },
    ],
  },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [openTab, setOpenTab] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenTab(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenTab(null), 120);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5 bg-[#0c0c12]/85 backdrop-blur-xl"
      onMouseLeave={scheduleClose}
    >
      <Link href="/" className="flex items-center">
        <BrandLogo variant="dark" size="sm" showText={false} />
      </Link>

      {/* Desktop mega-menu */}
      <div className="hidden md:flex items-center gap-1" onMouseLeave={scheduleClose}>
        {NAV_TABS.map((tab) => (
          <div key={tab.label} className="relative" onMouseEnter={() => openMega(tab.label)}>
            <button
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                openTab === tab.label
                  ? "text-white bg-white/[0.04]"
                  : "text-white/50 hover:text-white"
              }`}
              aria-expanded={openTab === tab.label}
            >
              {tab.label}
              <ChevronDown
                size={14}
                className={`transition-transform ${openTab === tab.label ? "rotate-180" : ""}`}
              />
            </button>

            {openTab === tab.label && (
              <div
                className="absolute left-0 top-full pt-2"
                onMouseEnter={() => openMega(tab.label)}
              >
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 p-5 min-w-[520px] rounded-xl border border-white/[0.08] bg-[#0c0c12]/98 backdrop-blur-xl shadow-2xl shadow-black/60">
                  {tab.columns.map((col) => (
                    <div key={col.heading}>
                      <p className="px-2 mb-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">
                        {col.heading}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {col.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenTab(null)}
                            className="flex flex-col gap-0.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
                          >
                            <span className="text-[13px] font-medium text-white/80 hover:text-white">
                              {item.label}
                            </span>
                            {item.desc && (
                              <span className="text-[11px] text-white/35">{item.desc}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm px-4 py-2 text-white/50 hover:text-white transition-colors cursor-pointer bg-transparent font-sans"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="text-sm px-4 py-2 font-semibold cursor-pointer rounded-md bg-[#39ff7e] text-[#07090f]"
        >
          Try the Demo
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-white/50 cursor-pointer bg-transparent border-0 p-2"
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile: collapsible categorized menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#12121a] border-b border-white/[0.06] px-6 py-4 md:hidden max-h-[80vh] overflow-y-auto">
          {NAV_TABS.map((tab) => (
            <div key={tab.label} className="border-b border-white/[0.04] last:border-0">
              <button
                className="flex items-center justify-between w-full py-3 text-sm font-medium text-white/70"
                onClick={() =>
                  setMobileExpanded(mobileExpanded === tab.label ? null : tab.label)
                }
                aria-expanded={mobileExpanded === tab.label}
              >
                {tab.label}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${mobileExpanded === tab.label ? "rotate-180" : ""}`}
                />
              </button>
              {mobileExpanded === tab.label && (
                <div className="pb-3 space-y-3">
                  {tab.columns.map((col) => (
                    <div key={col.heading}>
                      <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.15em] mb-1">
                        {col.heading}
                      </p>
                      {col.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block py-1.5 text-[13px] text-white/55 hover:text-white"
                          onClick={() => {
                            setOpen(false);
                            setMobileExpanded(null);
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 flex gap-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 text-center py-2.5 text-sm font-medium border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex-1 text-center py-2.5 text-sm font-semibold rounded-md bg-[#39ff7e] text-[#07090f]"
            >
              Try the Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
