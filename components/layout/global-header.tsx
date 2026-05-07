"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Truck,
  DollarSign,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/hotel", icon: LayoutDashboard },
  { label: "Marketplace", href: "/hotel/catalog", icon: ShoppingBag },
  { label: "Orders", href: "/hotel/order", icon: ClipboardList },
  { label: "Logistics", href: "/shipping", icon: Truck },
  { label: "Payments", href: "/factoring", icon: DollarSign },
];

const ADMIN_ITEMS = [
  { label: "Mission Control", href: "/admin/control", icon: Shield },
  { label: "Swarm", href: "/admin/swarm", icon: Settings },
];

export function GlobalHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = pathname?.startsWith("/admin");
  const navItems = isAdmin ? ADMIN_ITEMS : NAV_ITEMS;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-lg bg-[#800000]/15 border border-[#800000]/25 flex items-center justify-center group-hover:bg-[#800000]/25 transition-colors">
              <Image
                src="/logo-horse-only.png"
                alt="Hotels Vendors"
                width={24}
                height={24}
                className="opacity-90 group-hover:opacity-100 transition-opacity"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold tracking-tight leading-tight">Hotels Vendors</h1>
              <p className="text-[9px] text-white/30 uppercase tracking-wider leading-tight">Procurement Hub</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#800000]/15 text-[#ff4d4d] border border-[#800000]/20"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-xs">Search...</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#800000] border border-black" />
            </button>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#800000]/20 border border-[#800000]/30 flex items-center justify-center text-xs font-bold text-[#ff4d4d]">
                  OM
                </div>
                <ChevronDown className={`w-3 h-3 text-white/30 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/[0.08] bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                >
                  <div className="p-3 border-b border-white/[0.06]">
                    <p className="text-sm font-medium">Omar El-Sayed</p>
                    <p className="text-xs text-white/40">hotel.owner@nilegrand.com</p>
                  </div>
                  <div className="p-2">
                    <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-white/[0.06] bg-black/90 backdrop-blur-xl"
        >
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#800000]/15 text-[#ff4d4d] border border-[#800000]/20"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
