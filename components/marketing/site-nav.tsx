"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoFull } from "@/components/logo";

const links = [
  { href: "/about", label: "About" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/pricing", label: "Pricing" },
  { href: "/solutions", label: "Solutions" },
  { href: "/become-supplier", label: "For Suppliers" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" aria-label="HotelsVendors home">
          <LogoFull />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm text-white/50 transition hover:bg-white/[0.04] hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden px-3 py-2 text-sm text-white/50 transition hover:text-white sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="hidden rounded-lg bg-[#84cc16] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#a3e635] sm:inline-flex"
          >
            Get Started
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.06] text-white/50 hover:text-white lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/[0.06] bg-black px-5 py-4 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center rounded-lg px-3 py-2.5 text-sm text-white/50 hover:bg-white/[0.04] hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-2">
            <Link
              href="/login"
              className="flex-1 rounded-lg border border-white/[0.06] py-2.5 text-center text-sm text-white/50 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded-lg bg-[#84cc16] py-2.5 text-center text-sm font-medium text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
