"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

const navLinks = [
  { label: "Platform", href: "/platform" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Invoicing", href: "/vat-invoicing" },
  { label: "Financing", href: "/financing/oliv" },
  { label: "Pricing", href: "/pricing" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080b12]/78 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex-shrink-0">
          <BrandLogo variant="dark" size="sm" showText={false} />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-[13px] text-white/50 transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="tech-chip px-2.5 py-1 text-[10px]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-base)]" />
            Operational Fabric
          </span>
          <Link href="/login" className="btn-ghost !py-2 !px-4 !text-[13px]">Sign In</Link>
          <Link href="/register" className="btn-accent !py-2 !px-4 !text-[13px]">Get Started</Link>
        </div>

        <button className="text-white/60 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" type="button">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="tech-panel border-t border-white/[0.08] bg-[#060a11]/95 md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            <div className="mb-2">
              <span className="tech-chip px-2.5 py-1 text-[10px]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-base)]" />
                Operational Fabric
              </span>
            </div>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2.5 text-[14px] text-white/50 transition-colors hover:bg-white/[0.03] hover:text-white" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.04] pt-4">
              <Link href="/login" className="btn-ghost text-center !text-[13px]" onClick={() => setOpen(false)}>Sign In</Link>
              <Link href="/register" className="btn-accent text-center !text-[13px]" onClick={() => setOpen(false)}>Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
