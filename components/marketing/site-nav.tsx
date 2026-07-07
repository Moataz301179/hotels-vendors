"use client";

import Link from "next/link";
import { useState } from "react";
import { BrainCircuit, FileCheck2, Landmark, Menu, ShoppingBag, Workflow, X } from "lucide-react";
import { LogoFull } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { PaletteSwitcher } from "@/components/palette-switcher";

const links = [
  { href: "/#workflow", label: "Workflow", icon: Workflow },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/#eta", label: "ETA Compliance", icon: FileCheck2 },
  { href: "/#ai", label: "AI Assistant", icon: BrainCircuit },
  { href: "/vision", label: "Capital Thesis", icon: Landmark },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-border bg-bg/88 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" aria-label="HotelsVendors home">
          <LogoFull />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-fg-3 transition hover:bg-bg-2 hover:text-fg">
              <l.icon className="h-4 w-4 text-lime" />
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <PaletteSwitcher />
          <ThemeToggle />
          <Link href="/login" className="hidden px-3 py-2 text-sm text-fg-3 transition hover:text-fg sm:block">Sign in</Link>
          <Link href="/register" className="hidden rounded-xl bg-lime px-4 py-2 text-sm font-semibold text-bg transition hover:bg-lime-light sm:inline-flex">Get Started</Link>
          <button onClick={() => setOpen(!open)} className="grid h-8 w-8 place-items-center rounded-lg border border-border-2 lg:hidden" aria-label="Menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-bg-1 px-5 py-4 lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-fg-2 hover:bg-bg-2">
              <l.icon className="h-4 w-4 text-lime" />
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-2">
            <Link href="/login" className="flex-1 rounded-xl border border-border-2 py-2.5 text-center text-sm">Sign in</Link>
            <Link href="/register" className="flex-1 rounded-xl bg-lime py-2.5 text-center text-sm font-semibold text-bg">Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}
