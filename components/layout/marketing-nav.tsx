"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { ThemeModeToggle } from "@/components/theme/mode-toggle";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);

    // Sync with theme mode
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

  const navItems = [
    { label: "Marketplace", href: "/marketplace", isMarketplace: true },
    { label: "Hotel Solutions", href: "/register?role=hotel" },
    { label: "Hotel Dashboard", href: "/login" },
    { label: "Supplier Portal", href: "/login" },
    { label: "ETA Compliance", href: "/eta-demo" },
  ];

  const logoSrc = isLight ? "/logo-icon.png" : "/logo-icon-white.png";

  return (
    <header
      className={`marketing-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "marketing-nav-scrolled bg-[#050505]/95 backdrop-blur-md border-b border-white/[0.06]"
          : "marketing-nav-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <Image
            src={logoSrc}
            alt="Hotels Vendors"
            width={36}
            height={50}
            className="object-contain"
            priority
          />
          <div className="flex flex-col">
            <span className="marketing-nav-logo-text text-[15px] font-bold text-white tracking-tight leading-none">
              Hotels Vendors
            </span>
            <span className="marketing-nav-logo-sub text-[9px] font-medium text-white/40 uppercase tracking-[0.1em] leading-none mt-0.5">
              Smarter Together
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`px-4 py-2 text-[13px] font-medium transition-colors rounded-lg hover:bg-white/[0.04] ${
                item.isMarketplace
                  ? "marketing-nav-link-marketplace text-[#facc15]"
                  : "marketing-nav-link text-white/60 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeModeToggle />
          <button className="marketing-nav-icon p-2 text-white/40 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="marketing-nav-icon p-2 text-white/40 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors">
            <ShoppingCart className="w-4 h-4" />
          </button>
          <Link
            href="/register"
            className="px-5 py-2.5 text-[13px] font-semibold bg-[#e11d48] text-white hover:bg-[#be123c] rounded-lg transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="marketing-nav-signin text-[13px] font-medium text-white/50 hover:text-white px-4 py-2 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="marketing-nav-mobile lg:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="marketing-nav-mobile-menu lg:hidden bg-[#050505] border-t border-white/[0.06] px-6 py-5 shadow-xl">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`block py-2.5 text-[14px] font-medium transition-colors ${
                item.isMarketplace
                  ? "text-[#facc15]"
                  : "marketing-nav-mobile-link text-white/60 hover:text-white"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="marketing-nav-mobile-border pt-4 mt-2 border-t border-white/[0.06] flex gap-3">
            <Link
              href="/login"
              className="marketing-nav-mobile-btn-ghost flex-1 text-center py-2.5 text-[13px] font-medium border border-white/[0.10] text-white/60 hover:text-white rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center py-2.5 text-[13px] font-semibold bg-[#e11d48] text-white rounded-lg hover:bg-[#be123c] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
