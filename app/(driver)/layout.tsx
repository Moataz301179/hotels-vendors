"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Truck, FileCheck, ScanLine, User, WifiOff } from "lucide-react";

const TABS = [
  { href: "/deliveries", label: "Deliveries", icon: Truck },
  { href: "/grns", label: "GRNs", icon: FileCheck },
  { href: "/scanner", label: "Scanner", icon: ScanLine },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div data-theme="ember" className="min-h-screen" style={{ background: "var(--bg-canvas)", color: "var(--text-primary)" }}>
      {/* Offline banner */}
      {isOffline && (
        <div
          className="flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium"
          style={{ background: "var(--warning)", color: "#000" }}
        >
          <WifiOff size={14} />
          You are offline — changes will sync when reconnected
        </div>
      )}

      {/* Top bar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 backdrop-blur-md"
        style={{ background: "var(--bg-surface-1)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div>
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Driver Mode</p>
          <h1 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>HotelsVendors</h1>
        </div>
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{today}</span>
      </header>

      {/* Page content */}
      <main className="max-w-md mx-auto pb-24 px-4">{children}</main>

      {/* Bottom tab navigation */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-around backdrop-blur-md"
        style={{
          background: "var(--bg-surface-1)",
          borderTop: "1px solid var(--border-subtle)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-h-[56px] min-w-[56px] transition-colors"
              style={{ color: active ? "var(--accent-base)" : "var(--text-muted)" }}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
