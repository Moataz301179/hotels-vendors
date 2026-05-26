"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Building2,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/icons/social-icons";
import { BrandLogo } from "@/components/layout/brand-logo";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const primaryNav = [
    { label: "Platform", href: "/solutions" },
    { label: "Marketplace", href: "/marketplace", isMarketplace: true },
    { label: "Solutions", href: "#", hasDropdown: true },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  const solutionLinks = [
    { label: "For Hotels", href: "/register/hotel", desc: "Procurement OS & spend optimization", icon: Building2 },
    { label: "For Suppliers", href: "/register/supplier", desc: "Grow your B2B hospitality business", icon: ShoppingCart },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}>
      {/* Dark top bar — auth links only */}
      <div className="bg-[#000000] text-white/60 border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 h-8 flex items-center justify-end text-[11px] tracking-wide gap-3">
          <Link href="/login" className="hover:text-[#a3e635] transition-colors">Sign In</Link>
          <span className="text-white/20">|</span>
          <Link href="/register" className="hover:text-[#a3e635] transition-colors">Register</Link>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`transition-all duration-300 ${
        scrolled
          ? "bg-[#000000]/95 backdrop-blur-md border-b border-white/[0.04]"
          : "bg-[#000000] border-b border-white/[0.04]"
      }`}>
        <div className="mx-auto max-w-7xl px-6 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-10 group">
            <BrandLogo variant="light" size="sm" />
            <div className="flex flex-col">
              <span className="text-[15px] font-bold tracking-tight leading-none text-white">
                Hotels Vendors
              </span>
              <span className="text-[9px] font-semibold text-[#a3e635] uppercase tracking-[0.12em] leading-none mt-0.5">
                Smarter Together
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {primaryNav.map((item) =>
              item.hasDropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setSolutionsOpen(true)}
                  onMouseLeave={() => setSolutionsOpen(false)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-[14px] font-medium transition-colors rounded-lg text-white/50 hover:text-[#a3e635] hover:bg-white/[0.03]">
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {solutionsOpen && (
                    <div className="absolute top-full left-0 mt-1 w-72 bg-[#0a0a0a] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-3 bg-white/[0.02] border-b border-white/[0.04]">
                        <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Stakeholder Solutions</p>
                      </div>
                      {solutionLinks.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-white/[0.02] last:border-0"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#a3e635]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <link.icon className="w-4 h-4 text-[#a3e635]" />
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-white">{link.label}</div>
                            <div className="text-[11px] text-white/30 mt-0.5">{link.desc}</div>
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
                  className={`px-4 py-2 text-[14px] font-medium transition-colors rounded-lg ${
                    item.isMarketplace
                      ? "text-[#a3e635] hover:text-[#bef264] hover:bg-[#a3e635]/5"
                      : "text-white/50 hover:text-[#a3e635] hover:bg-white/[0.03]"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="p-2 rounded-lg transition-colors text-white/30 hover:text-white hover:bg-white/[0.03]">
              <Search className="w-4 h-4" />
            </button>
            <a href="https://www.facebook.com/hotelsvendors" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg transition-colors text-white/30 hover:text-[#a3e635] hover:bg-white/[0.03]" aria-label="Facebook">
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/hotelsvendors" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg transition-colors text-white/30 hover:text-[#a3e635] hover:bg-white/[0.03]" aria-label="Instagram">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/hotelsvendors" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg transition-colors text-white/30 hover:text-[#a3e635] hover:bg-white/[0.03]" aria-label="LinkedIn">
              <LinkedInIcon className="w-4 h-4" />
            </a>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold bg-[#a3e635] text-black hover:bg-[#bef264] rounded-lg transition-colors"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors text-white/50 hover:text-white hover:bg-white/[0.03]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t px-6 py-5 shadow-xl bg-[#0a0a0a] border-white/[0.04]">
          {primaryNav.map((item) => (
            <div key={item.label}>
              {item.hasDropdown ? (
                <div>
                  <button
                    onClick={() => setSolutionsOpen(!solutionsOpen)}
                    className="flex items-center justify-between w-full py-2.5 text-[14px] font-medium transition-colors text-white/70"
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {solutionsOpen && (
                    <div className="pl-4 pb-2 space-y-1">
                      {solutionLinks.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="block py-2 text-[13px] transition-colors text-white/40 hover:text-[#a3e635]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`block py-2.5 text-[14px] font-medium transition-colors ${
                    item.isMarketplace
                      ? "text-[#a3e635] hover:text-[#bef264]"
                      : "text-white/70 hover:text-[#a3e635]"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-4 mt-2 border-t border-white/[0.04]">
            <div className="flex gap-3">
              <Link href="/login" className="flex-1 text-center py-2.5 text-[13px] font-medium border rounded-lg border-white/[0.08] text-white/60 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="flex-1 text-center py-2.5 text-[13px] font-semibold bg-[#a3e635] text-black rounded-lg hover:bg-[#bef264] transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
