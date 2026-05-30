"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Platform", href: "/solutions" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Solutions", href: "#", hasDropdown: true },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  const solutions = [
    { label: "Hotels", href: "/register?role=hotel", desc: "Procurement OS & spend optimization" },
    { label: "Suppliers", href: "/become-supplier", desc: "B2B hospitality sales channel" },
    { label: "Logistics", href: "/register?role=shipping", desc: "Route optimization & delivery" },
    { label: "Factoring", href: "/register?role=factoring", desc: "Supply chain financing" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
      style={{ backgroundColor: scrolled ? "rgba(27, 27, 31, 0.95)" : "#1B1B1F" }}
    >
      <div className="border-b border-[#8B0000]/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#8B0000] rounded-lg flex items-center justify-center">
                <Image src="/logo-horse-only.png" alt="HV" width={24} height={24} className="object-contain brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-tight">Hotels Vendors</span>
                <span className="text-xs text-[#C9A227] uppercase tracking-wider -mt-1">OS</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) =>
                item.hasDropdown ? (
                  <div key={item.label} className="relative" onMouseEnter={() => setSolutionsOpen(true)} onMouseLeave={() => setSolutionsOpen(false)}>
                    <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg">
                      {item.label}
                      <ChevronDown className={`w-3 h-3 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
                    </button>
                    {solutionsOpen && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-[#1B1B1F] border border-[#8B0000]/30 rounded-xl overflow-hidden shadow-xl">
                        <div className="p-3 border-b border-[#8B0000]/30">
                          <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider">Solutions</p>
                        </div>
                        {solutions.map((s) => (
                          <Link key={s.label} href={s.href} className="block px-4 py-3 text-zinc-300 hover:bg-[#8B0000]/20 border-b border-[#8B0000]/20 last:border-0">
                            <div className="font-semibold text-white">{s.label}</div>
                            <div className="text-xs text-zinc-400">{s.desc}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={item.label} href={item.href} className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg">
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/register" className="px-5 py-2 text-sm font-semibold bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000] transition">
                Get Started
              </Link>
            </div>

            <button className="lg:hidden p-2 text-zinc-300" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#8B0000]/30 bg-[#1B1B1F]">
          <nav className="px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="block py-2 text-zinc-300 hover:text-white" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/register" className="inline-block py-2 text-sm font-semibold text-white" onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
