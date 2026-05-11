"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Phone,
  Mail,
  Building2,
  ShoppingCart,
  Truck,
  Landmark,
  ArrowRight,
  Shield,
  FileCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { ThemeModeToggle } from "@/components/theme/mode-toggle";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);

    const sync = () => {
      setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const primaryNav = [
    { label: "Platform", href: "/solutions" },
    { label: "Solutions", href: "#", hasDropdown: true },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  const solutionLinks = [
    { label: "For Hotels", href: "/register?role=hotel", desc: "Procurement OS & spend optimization", icon: Building2 },
    { label: "For Suppliers", href: "/become-supplier", desc: "Grow your B2B hospitality business", icon: ShoppingCart },
    { label: "For Logistics", href: "/register?role=shipping", desc: "Route optimization & delivery network", icon: Truck },
    { label: "For Factoring", href: "/register?role=factoring", desc: "Embedded liquidity & credit solutions", icon: Landmark },
  ];

  const logoSrc = isLight ? "/logo-icon.png" : "/logo-icon-white.png";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}>
      {/* ═══ Top Bar — Burgundy utility bar ═══ */}
      <div className="bg-[#8B0000] text-white/90">
        <div className="mx-auto max-w-7xl px-6 h-8 flex items-center justify-between text-[11px] tracking-wide">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              +20 100 000 0000
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              hello@hotelsvendors.com
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <span className="text-white/30">|</span>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </div>

      {/* ═══ Main Nav — White institutional ═══ */}
      <div className={`transition-all duration-300 ${
        isLight
          ? (scrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-200" : "bg-white border-b border-gray-100")
          : (scrolled ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.06]" : "bg-[#0a0a0a] border-b border-white/[0.04]")
      }`}>
        <div className="mx-auto max-w-7xl px-6 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-10 group">
            <Image
              src={logoSrc}
              alt="Hotels Vendors"
              width={36}
              height={50}
              className="object-contain"
              priority
            />
            <div className="flex flex-col">
              <span className={`text-[15px] font-bold tracking-tight leading-none ${isLight ? "text-gray-900" : "text-white"}`}>
                Hotels Vendors
              </span>
              <span className="text-[9px] font-semibold text-[#8B0000] uppercase tracking-[0.12em] leading-none mt-0.5">
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
                  <button className={`flex items-center gap-1 px-4 py-2 text-[14px] font-medium transition-colors rounded-lg ${
                    isLight
                      ? "text-gray-600 hover:text-[#8B0000] hover:bg-gray-50"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}>
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {solutionsOpen && (
                    <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
                      <div className="p-3 bg-gray-50/50 border-b border-gray-100">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Stakeholder Solutions</p>
                      </div>
                      {solutionLinks.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#8B0000]/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <link.icon className="w-4 h-4 text-[#8B0000]" />
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-gray-900">{link.label}</div>
                            <div className="text-[11px] text-gray-400 mt-0.5">{link.desc}</div>
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
                    isLight
                      ? "text-gray-600 hover:text-[#8B0000] hover:bg-gray-50"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeModeToggle />
            <button className={`p-2 rounded-lg transition-colors ${
              isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-50" : "text-white/40 hover:text-white hover:bg-white/[0.04]"
            }`}>
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold bg-[#8B0000] text-white hover:bg-[#6B0000] rounded-lg transition-colors shadow-sm"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isLight ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50" : "text-white/60 hover:text-white hover:bg-white/[0.04]"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={`lg:hidden border-t px-6 py-5 shadow-xl animate-fade-in-up ${
          isLight ? "bg-white border-gray-100" : "bg-[#0a0a0a] border-white/[0.06]"
        }`}>
          {primaryNav.map((item) => (
            <div key={item.label}>
              {item.hasDropdown ? (
                <div>
                  <button
                    onClick={() => setSolutionsOpen(!solutionsOpen)}
                    className={`flex items-center justify-between w-full py-2.5 text-[14px] font-medium transition-colors ${
                      isLight ? "text-gray-700" : "text-white/70"
                    }`}
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
                          className={`block py-2 text-[13px] transition-colors ${
                            isLight ? "text-gray-500 hover:text-[#8B0000]" : "text-white/40 hover:text-white/70"
                          }`}
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
                    isLight ? "text-gray-700 hover:text-[#8B0000]" : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div className={`pt-4 mt-2 border-t flex gap-3 ${isLight ? "border-gray-100" : "border-white/[0.06]"}`}>
            <Link
              href="/login"
              className={`flex-1 text-center py-2.5 text-[13px] font-medium border rounded-lg transition-colors ${
                isLight
                  ? "border-gray-200 text-gray-600 hover:text-gray-900"
                  : "border-white/[0.10] text-white/60 hover:text-white"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center py-2.5 text-[13px] font-semibold bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
