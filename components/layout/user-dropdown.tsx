"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, ChevronDown, Shield, Palette, CreditCard, Users } from "lucide-react";
import { useTheme, type ThemeName, THEMES } from "@/components/theme/theme-provider";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  platformRole: string;
  tenantName?: string;
}

export function UserDropdown({ user }: { user?: UserData | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { themeName, setTheme, themes } = useTheme();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const displayName = user?.name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const roleLabel = user?.platformRole || user?.role || "User";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/[0.04] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#bef264] to-[#6d28d9] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10 flex-shrink-0">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-medium text-white leading-tight">{displayName}</p>
          <p className="text-[10px] text-white/30 leading-tight capitalize">{roleLabel.toLowerCase()}</p>
        </div>
        <ChevronDown className={`w-3 h-3 text-white/30 hidden md:block transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden animate-fade-in-up z-50">
          {/* User info */}
          <div className="p-3 border-b border-white/[0.06]">
            <p className="text-[13px] font-semibold text-white truncate">{displayName}</p>
            <p className="text-[11px] text-white/40 truncate">{user?.email || ""}</p>
            {user?.tenantName && (
              <p className="text-[10px] text-[#bef264] mt-0.5 truncate">{user.tenantName}</p>
            )}
          </div>

          {/* Quick actions */}
          <div className="p-1.5">
            <Link
              href="/settings?tab=general"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <Link
              href="/settings?tab=team"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <Users className="w-4 h-4" />
              Team Members
            </Link>
            <Link
              href="/settings?tab=billing"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Plan &amp; Billing
            </Link>
            <Link
              href="/settings?tab=appearance"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            {user?.platformRole === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Theme quick-switch */}
          <div className="px-3 py-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-3.5 h-3.5 text-white/20" />
              <span className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">Theme</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {themes.map((t) => {
                const config = THEMES[t];
                const active = themeName === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      active ? "border-white scale-110" : "border-transparent hover:scale-105"
                    }`}
                    style={{ background: config.accent }}
                    title={config.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Logout */}
          <div className="p-1.5 border-t border-white/[0.06]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
