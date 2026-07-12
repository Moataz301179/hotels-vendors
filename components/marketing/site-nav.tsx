"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

const links = [
  { href: "/#how", label: "How It Works" },
  { href: "/#invo", label: "INVO" },
  { href: "/factoring-service", label: "Factoring" },
  { href: "/financing/oliv", label: "Oliv Financing" },
  { href: "/suppliers/join", label: "For Suppliers" },
  { href: "/hotels/join", label: "For Hotels" },
  { href: "/compliance", label: "Compliance" },
  { href: "/pricing", label: "Pricing" },
  { href: "/marketplace", label: "Marketplace" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5 bg-[#0c0c12]/85 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2.5">
        <BrandLogo variant="dark" size="sm" />
        <span className="tracking-[0.12em] font-semibold text-white text-[15px] uppercase">
          Hotels<span className="text-[#39ff7e]">Vendors</span>
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-7">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            {l.label}
          </Link>
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

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#12121a] border-b border-white/[0.06] px-6 py-4 flex flex-col gap-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-white/50 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
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
