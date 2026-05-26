"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/solutions", label: "Solutions" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#000000]/90 backdrop-blur-2xl border-b border-white/[0.04]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <BrandLogo variant="dark" size="sm" />
          <span className="text-[14px] font-semibold text-white tracking-tight">HotelsVendors</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[12px] font-medium text-white/30 hover:text-white/70 transition-colors tracking-wide uppercase"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-[12px] font-semibold text-black bg-[#a3e635] hover:bg-[#bef264] px-5 py-2 rounded-full transition-all"
          >
            Sign In
          </Link>
        </div>

        <button
          className="md:hidden text-white/50 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#000000]/95 backdrop-blur-xl border-b border-white/[0.06] px-8 py-6">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-white/50 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="inline-flex items-center justify-center text-[14px] font-semibold text-black bg-[#a3e635] hover:bg-[#bef264] px-5 py-2.5 rounded-full transition-all mt-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
