"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

interface DropdownItem {
  href: string;
  label: string;
  desc?: string;
}

interface NavGroup {
  label: string;
  items: DropdownItem[];
}

const groups: NavGroup[] = [
  {
    label: "Products",
    items: [
      { href: "/marketplace", label: "Marketplace", desc: "Browse hotel suppliers & catalog" },
      { href: "/#invo", label: "INVO", desc: "Vendor marketplace sub-layer" },
      { href: "/compliance", label: "Compliance", desc: "ETA e-invoicing & FRA" },
    ],
  },
  {
    label: "Financing",
    items: [
      { href: "/factoring-service", label: "Invoice Factoring", desc: "Non-recourse invoice financing" },
      { href: "/financing/oliv", label: "Oliv Financing", desc: "Up to EGP 10M credit line" },
      { href: "/oliv/referral", label: "Oliv Referral", desc: "Get referred & priority processing" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { href: "/hotels/join", label: "For Hotels", desc: "Procurement & spend management" },
      { href: "/suppliers/join", label: "For Suppliers", desc: "List products & get paid in 48h" },
      { href: "/#how", label: "How It Works", desc: "Platform overview & workflow" },
    ],
  },
];

function DropdownMenu({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors cursor-pointer bg-transparent border-0 font-sans">
        {group.label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#12121a] border border-white/[0.06] rounded-xl shadow-2xl backdrop-blur-xl"
          style={{ background: "rgba(18,18,26,0.95)" }}
        >
          <div className="py-2">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col gap-0.5 px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-sm text-white/80">{item.label}</span>
                {item.desc && (
                  <span className="text-xs text-white/35">{item.desc}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5 bg-[#0c0c12]/85 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2.5">
        <BrandLogo variant="dark" size="sm" showText={false} />
        <span className="font-semibold text-white text-[15px] uppercase" style={{ letterSpacing: "0.2em", fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
          Hotels Vendors
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-7">
        {groups.map((g) => (
          <DropdownMenu key={g.label} group={g} />
        ))}
        <Link
          href="/pricing"
          className="text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          Pricing
        </Link>
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

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#12121a] border-b border-white/[0.06] px-6 py-4 flex flex-col gap-4 md:hidden">
          {groups.map((g) => (
            <div key={g.label} className="flex flex-col gap-1">
              <span className="text-xs text-white/30 uppercase tracking-widest font-semibold">{g.label}</span>
              {g.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-white/50 hover:text-white pl-3"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="text-sm text-white/50 hover:text-white"
          >
            Pricing
          </Link>
          <hr className="border-white/[0.06]" />
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="text-sm text-white/50 hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="text-sm px-4 py-2 font-semibold rounded-md bg-[#39ff7e] text-[#07090f] text-center"
          >
            Try the Demo
          </Link>
        </div>
      )}
    </nav>
  );
}
