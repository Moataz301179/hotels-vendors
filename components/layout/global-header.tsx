"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Bell, Menu, X, ShoppingCart } from "lucide-react";

export function GlobalHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-12 flex items-center justify-center rounded-lg border-2 border-[#b91c1c]/80 bg-white p-1">
              <Image
                src="/logo-horse-only.png"
                alt="Hotels Vendors"
                width={36}
                height={42}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight text-gray-900 leading-tight">Hotels Vendors</h1>
              <p className="text-[9px] text-gray-400 uppercase tracking-wider leading-tight">Digital Procurement Hub</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Catalog", href: "/catalog" },
              { label: "Suppliers", href: "/catalog" },
              { label: "Solutions", href: "/catalog" },
              { label: "Pricing", href: "/catalog" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/login"
              className="hidden sm:inline-flex px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {["Catalog", "Suppliers", "Solutions", "Pricing"].map((item) => (
              <Link
                key={item}
                href="/catalog"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {item}
              </Link>
            ))}
            <div className="pt-2 flex gap-2">
              <Link href="/login" className="flex-1 text-center px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700">Sign In</Link>
              <Link href="/register" className="flex-1 text-center px-4 py-2.5 rounded-lg bg-[#b91c1c] text-white text-sm font-medium">Get Started</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
