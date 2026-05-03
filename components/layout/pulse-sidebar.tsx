"use client";

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Shield,
  Activity,
  Users,
  Building2,
  Receipt,
  Truck,
  TrendingUp,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Zap,
  Megaphone,
  CalendarDays,
  BarChart3,
  Share2,
} from "lucide-react";

interface PulseEvent {
  id: string;
  type: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  timestamp: string;
  agent?: string;
}

interface PulseSidebarProps {
  role: string;
  collapsed: boolean;
  onToggle: () => void;
}

const ROLE_NAV = {
  admin: [
    { icon: LayoutDashboard, label: "Command Center", href: "/admin" },
    { icon: Shield, label: "Fortress Protocol", href: "/admin/security" },
    { icon: Activity, label: "Risk Heatmap", href: "/admin/risk" },
    { icon: TrendingUp, label: "Liquidity", href: "/admin/liquidity" },
    { icon: Users, label: "Tenants", href: "/admin/tenants" },
    { icon: Receipt, label: "Audit Log", href: "/admin/audit-log" },
    { icon: AlertTriangle, label: "Authority Matrix", href: "/admin/authority-matrix" },
  ],
  hotel: [
    { icon: LayoutDashboard, label: "Procurement", href: "/hotel" },
    { icon: Building2, label: "Catalog", href: "/hotel/catalog" },
    { icon: Receipt, label: "Orders", href: "/hotel/orders" },
    { icon: Activity, label: "Approvals", href: "/hotel/approvals" },
  ],
  supplier: [
    { icon: LayoutDashboard, label: "Inventory", href: "/supplier" },
    { icon: Truck, label: "Orders", href: "/supplier/orders" },
    { icon: TrendingUp, label: "Performance", href: "/supplier/performance" },
  ],
  factoring: [
    { icon: LayoutDashboard, label: "Liquidity", href: "/factoring" },
    { icon: Receipt, label: "Invoices", href: "/factoring/invoices" },
    { icon: Activity, label: "Risk", href: "/factoring/risk" },
  ],
  shipping: [
    { icon: LayoutDashboard, label: "Trips", href: "/shipping" },
    { icon: Truck, label: "Fleet", href: "/shipping/fleet" },
    { icon: Activity, label: "Optimization", href: "/shipping/optimization" },
  ],
  marketing: [
    { icon: LayoutDashboard, label: "Command Center", href: "/marketing" },
    { icon: Megaphone, label: "Campaigns", href: "/marketing/campaigns" },
    { icon: CalendarDays, label: "Content Calendar", href: "/marketing/calendar" },
    { icon: BarChart3, label: "Analytics", href: "/marketing/analytics" },
    { icon: Share2, label: "Social Media", href: "/marketing/social" },
    { icon: Users, label: "Lead Tracking", href: "/marketing/leads" },
  ],
};

export function PulseSidebar({ role, collapsed, onToggle }: PulseSidebarProps) {
  const [activePath, setActivePath] = useState("");
  const [pulseEvents, setPulseEvents] = useState<PulseEvent[]>([
    {
      id: "1",
      type: "system.health",
      severity: "INFO",
      message: "Agent swarm initialized — 10 modules active",
      timestamp: new Date().toISOString(),
      agent: "SYSTEM",
    },
    {
      id: "2",
      type: "security.breach",
      severity: "WARNING",
      message: "Anomaly detected: Session fingerprint mismatch for user #u_123",
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      agent: "FORTRESS",
    },
    {
      id: "3",
      type: "factoring.disbursed",
      severity: "INFO",
      message: "EFG Hermes disbursed 86,750 EGP to Supplier #s_456",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      agent: "FINANCE",
    },
    {
      id: "4",
      type: "risk.alert",
      severity: "CRITICAL",
      message: "Hotel 'Pyramid View' risk tier elevated to CRITICAL",
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      agent: "RISK_ENGINE",
    },
    {
      id: "5",
      type: "agent.action",
      severity: "INFO",
      message: "Smart Fix generated: 20% deposit required for order #PO-2026-0089",
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      agent: "SMART_FIX",
    },
  ]);

  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const mockEvents: PulseEvent[] = [
        {
          id: `evt_${Date.now()}`,
          type: "system.health",
          severity: "INFO",
          message: `Platform yield: ${(Math.random() * 10000 + 50000).toFixed(0)} EGP this hour`,
          timestamp: new Date().toISOString(),
          agent: "SIMULATOR",
        },
        {
          id: `evt_${Date.now()}`,
          type: "agent.action",
          severity: "INFO",
          message: "Bundle prediction: 85% chance of Eco-Ship match in 6th of October",
          timestamp: new Date().toISOString(),
          agent: "LOGISTICS",
        },
      ];
      const event = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      setPulseEvents((prev) => [event, ...prev].slice(0, 50));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const navItems = ROLE_NAV[role as keyof typeof ROLE_NAV] || ROLE_NAV.admin;

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "border-l-2 border-[var(--error)] bg-[var(--error)]/5";
      case "WARNING": return "border-l-2 border-[var(--warning)] bg-[var(--warning)]/5";
      default: return "border-l-2 border-[var(--success)] bg-[var(--success)]/5";
    }
  };

  const getDotClass = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-[var(--error)]";
      case "WARNING": return "bg-[var(--warning)]";
      default: return "bg-[var(--success)]";
    }
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h`;
  };

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 border-r border-[var(--border-subtle)] bg-[var(--surface)]">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ChevronRight size={18} />
        </button>
        <div className="mt-6 flex flex-col gap-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="p-2.5 rounded-xl hover:bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              title={item.label}
            >
              <item.icon size={18} />
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--surface)] border-r border-[var(--border-subtle)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-[var(--accent-500)]" />
          <span className="text-sm font-semibold tracking-wide text-[var(--foreground)]">AGENT PULSE</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-3 space-y-0.5">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setActivePath(item.href)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              activePath === item.href
                ? "bg-[var(--accent-500)]/10 text-[var(--accent-400)] border border-[var(--accent-500)]/20"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-raised)]"
            }`}
          >
            <item.icon size={16} />
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-2 h-px bg-[var(--border-subtle)]" />

      {/* Live Pulse Feed */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
            Live Events
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-[10px] text-[var(--foreground-muted)]">LIVE</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
          {pulseEvents.map((event) => (
            <div key={event.id} className={`p-2.5 rounded-md ${getSeverityClass(event.severity)}`}>
              <div className="flex items-start gap-2">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${getDotClass(event.severity)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[var(--foreground-secondary)] leading-snug">{event.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {event.agent && (
                      <span className="text-[10px] font-mono text-[var(--foreground-muted)] bg-[var(--surface-raised)] px-1.5 py-0.5 rounded">
                        {event.agent}
                      </span>
                    )}
                    <span className="text-[10px] text-[var(--foreground-muted)]">{formatTime(event.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--accent-500)]/10 flex items-center justify-center">
            <Shield size={14} className="text-[var(--accent-400)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--foreground)]">Fortress Active</p>
            <p className="text-[10px] text-[var(--foreground-muted)]">6/10 controls armed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
