"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, ChevronDown, ArrowRight, Building2, ShoppingCart } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const primaryNav = [
    { label: "Platform", href: "#why" },
    { label: "How It Works", href: "#how" },
    { label: "Network", href: "#network" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  const solutionLinks = [
    { label: "For Hotels", href: "/register/hotel", desc: "Procurement OS & spend optimization", icon: Building2 },
    { label: "For Suppliers", href: "/register/supplier", desc: "Grow your B2B hospitality business", icon: ShoppingCart },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <BrandLogo variant="dark" size="sm" />
          <div className="flex flex-col">
            <span className="text-[15px] font-bold tracking-tight leading-none text-white">
              Hotels Vendors
            </span>
            <span className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.12em] leading-none mt-0.5">
              Smarter Together
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {primaryNav.map((item) =>
            item.label === "Platform" ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-[13px] font-medium transition-colors rounded-lg text-white/50 hover:text-white hover:bg-white/[0.04]">
                  {item.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      solutionsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {solutionsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-[#0a0a0a] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-3 bg-white/[0.02] border-b border-white/[0.04]">
                      <p className="text-[11px] font-semibold text-white/20 uppercase tracking-wider">
                        Stakeholder Solutions
                      </p>
                    </div>
                    {solutionLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] last:border-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <link.icon className="w-4 h-4 text-[#8b5cf6]" />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-white/80">
                            {link.label}
                          </div>
                          <div className="text-[11px] text-white/30 mt-0.5">
                            {link.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-[13px] font-medium transition-colors rounded-lg text-white/50 hover:text-white hover:bg-white/[0.04]"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-[13px] font-medium text-white/50 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold bg-[#8b5cf6] text-white hover:bg-[#6d28d9] rounded-lg transition-colors"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 rounded-lg transition-colors text-white/50 hover:text-white hover:bg-white/[0.04]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.06] px-6 py-5 bg-[#050505]/95 backdrop-blur-xl">
          {primaryNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block py-2.5 text-[14px] font-medium transition-colors text-white/60 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-white/[0.06]">
            <div className="flex gap-3">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 text-[13px] font-medium border rounded-lg border-white/[0.08] text-white/60 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 text-[13px] font-semibold bg-[#8b5cf6] text-white rounded-lg hover:bg-[#6d28d9] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
