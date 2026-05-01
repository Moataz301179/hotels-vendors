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

  // Subscribe to SSE in production
  useEffect(() => {
    // For now, simulate live events
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
      case "CRITICAL": return "pulse-item-critical";
      case "WARNING": return "pulse-item-warning";
      default: return "pulse-item-info";
    }
  };

  const getDotClass = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "pulse-dot-critical";
      case "WARNING": return "pulse-dot-warning";
      default: return "pulse-dot-info";
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
      <div className="h-full flex flex-col items-center py-4 border-r border-border-subtle bg-surface">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground transition-colors"
        >
          <ChevronRight size={18} />
        </button>
        <div className="mt-6 flex flex-col gap-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="p-2.5 rounded-xl hover:bg-surface-raised text-foreground-muted hover:text-foreground transition-colors"
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
    <div className="h-full flex flex-col bg-surface border-r border-border-subtle">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-brand-500" />
          <span className="text-sm font-semibold tracking-wide">AGENT PULSE</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground transition-colors"
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
                ? "bg-brand-900/20 text-brand-400 border border-brand-900/30"
                : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
            }`}
          >
            <item.icon size={16} />
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-2 h-px bg-border-subtle" />

      {/* Live Pulse Feed */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">
            Live Events
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
            <span className="text-[10px] text-foreground-faint">LIVE</span>
          </span>
        </div>
        <div className="pulse-feed">
          {pulseEvents.map((event) => (
            <div key={event.id} className={`pulse-item ${getSeverityClass(event.severity)}`}>
              <span className={`pulse-dot ${getDotClass(event.severity)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-foreground-muted leading-snug">{event.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  {event.agent && (
                    <span className="text-[10px] font-mono text-foreground-dim bg-surface-hover px-1.5 py-0.5 rounded">
                      {event.agent}
                    </span>
                  )}
                  <span className="text-[10px] text-foreground-dim">{formatTime(event.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-900/30 flex items-center justify-center">
            <Shield size={14} className="text-brand-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">Fortress Active</p>
            <p className="text-[10px] text-foreground-faint">6/10 controls armed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
