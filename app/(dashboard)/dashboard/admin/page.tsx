"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Shield,
  Activity,
  TrendingUp,
  Users,
  Receipt,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Lock,
  Eye,
  Server,
} from "lucide-react";

interface SystemMetrics {
  totalOrders: number;
  totalGMV: number;
  activeFactoring: number;
  platformYield: number;
  riskAlerts: number;
  securityScore: number;
  etaCompliance: number;
  activeUsers: number;
}

export default function AdminCommandCenter() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalOrders: 1247,
    totalGMV: 28475000,
    activeFactoring: 89,
    platformYield: 569500,
    riskAlerts: 3,
    securityScore: 6.2,
    etaCompliance: 94.7,
    activeUsers: 156,
  });

  const [animatedValues, setAnimatedValues] = useState<SystemMetrics>(metrics);

  useEffect(() => {
    // Animate metrics on load
    const duration = 1500;
    const start = performance.now();
    const from = { ...metrics };
    const to = { ...metrics };

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        totalOrders: Math.round(from.totalOrders * ease),
        totalGMV: Math.round(from.totalGMV * ease),
        activeFactoring: Math.round(from.activeFactoring * ease),
        platformYield: Math.round(from.platformYield * ease),
        riskAlerts: from.riskAlerts,
        securityScore: parseFloat((from.securityScore * ease).toFixed(1)),
        etaCompliance: parseFloat((from.etaCompliance * ease).toFixed(1)),
        activeUsers: Math.round(from.activeUsers * ease),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const MetricCard = ({
    label,
    value,
    subtext,
    icon: Icon,
    color,
    wide,
  }: {
    label: string;
    value: string;
    subtext?: string;
    icon: React.ElementType;
    color: string;
    wide?: boolean;
  }) => (
    <div className={`glass-card p-5 ${wide ? "command-wide" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={18} />
        </div>
        {subtext && (
          <span className="text-[11px] font-medium text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-full">
            {subtext}
          </span>
        )}
      </div>
      <p className="metric-value text-2xl font-bold text-foreground">{value}</p>
      <p className="metric-label mt-1">{label}</p>
    </div>
  );

  const StatusRow = ({
    label,
    status,
    detail,
  }: {
    label: string;
    status: "active" | "warning" | "critical";
    detail: string;
  }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-border-subtle last:border-0">
      <div className="flex items-center gap-3">
        <span
          className={`w-2 h-2 rounded-full ${
            status === "active"
              ? "bg-accent-emerald"
              : status === "warning"
              ? "bg-accent-amber"
              : "bg-brand-500"
          }`}
        />
        <span className="text-sm text-foreground-muted">{label}</span>
      </div>
      <span className="text-xs font-mono text-foreground-faint">{detail}</span>
    </div>
  );

  return (
    <DashboardShell role="admin">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text-animated">Command Center</span>
          </h1>
          <p className="text-foreground-muted mt-1 text-sm">
            Real-time oversight of the Egyptian hospitality procurement network
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="command-grid mb-8">
          <MetricCard
            label="Total Orders"
            value={animatedValues.totalOrders.toLocaleString()}
            subtext="+12% this week"
            icon={Receipt}
            color="bg-accent-cyan/10 text-accent-cyan"
          />
          <MetricCard
            label="Gross Merchandise Value"
            value={`${(animatedValues.totalGMV / 1000000).toFixed(2)}M EGP`}
            subtext="On track"
            icon={TrendingUp}
            color="bg-accent-emerald/10 text-accent-emerald"
          />
          <MetricCard
            label="Active Factoring"
            value={animatedValues.activeFactoring.toString()}
            subtext="4 pending"
            icon={Zap}
            color="bg-accent-gold/10 text-accent-gold"
          />
          <MetricCard
            label="Platform Yield"
            value={`${(animatedValues.platformYield / 1000).toFixed(0)}K EGP`}
            subtext="2.0% margin"
            icon={TrendingUp}
            color="bg-brand-700/20 text-brand-400"
          />
          <MetricCard
            label="Security Score"
            value={`${animatedValues.securityScore}/10`}
            subtext="6.2 → target 9.0"
            icon={Shield}
            color="bg-accent-amber/10 text-accent-amber"
            wide
          />
          <MetricCard
            label="ETA Compliance"
            value={`${animatedValues.etaCompliance}%`}
            subtext="94.7% validated"
            icon={CheckCircle}
            color="bg-accent-emerald/10 text-accent-emerald"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Heatmap */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand-700/20">
                  <AlertTriangle size={18} className="text-brand-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Credit Heatmap</h2>
                  <p className="text-xs text-foreground-faint">Egyptian hotel chain risk distribution</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-accent-emerald" />
                  Low
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-accent-amber" />
                  Medium
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-brand-500" />
                  High
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-brand-800" />
                  Critical
                </span>
              </div>
            </div>

            {/* Simplified heatmap visualization */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { name: "Marriott Cairo", city: "Cairo", tier: "LOW", score: 15, exposure: "2.4M" },
                { name: "Four Seasons", city: "Giza", tier: "LOW", score: 22, exposure: "3.1M" },
                { name: "Hilton Alexandria", city: "Alexandria", tier: "MEDIUM", score: 42, exposure: "1.8M" },
                { name: "Movenpick Red Sea", city: "Hurghada", tier: "MEDIUM", score: 48, exposure: "950K" },
                { name: "Steigenberger", city: "Cairo", tier: "LOW", score: 18, exposure: "1.2M" },
                { name: "Kempinski Nile", city: "Cairo", tier: "LOW", score: 12, exposure: "4.5M" },
                { name: "Pyramid View Hotel", city: "Giza", tier: "CRITICAL", score: 88, exposure: "280K" },
                { name: "Sunrise Marina", city: "North Coast", tier: "HIGH", score: 67, exposure: "620K" },
              ].map((hotel) => (
                <div
                  key={hotel.name}
                  className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                    hotel.tier === "LOW"
                      ? "bg-accent-emerald/5 border-accent-emerald/20"
                      : hotel.tier === "MEDIUM"
                      ? "bg-accent-amber/5 border-accent-amber/20"
                      : hotel.tier === "HIGH"
                      ? "bg-brand-500/5 border-brand-500/20"
                      : "bg-brand-800/10 border-brand-700/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      hotel.tier === "LOW"
                        ? "text-accent-emerald"
                        : hotel.tier === "MEDIUM"
                        ? "text-accent-amber"
                        : hotel.tier === "HIGH"
                        ? "text-brand-400"
                        : "text-brand-300"
                    }`}>
                      {hotel.tier}
                    </span>
                    <span className="text-lg font-bold text-foreground">{hotel.score}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{hotel.name}</p>
                  <p className="text-xs text-foreground-faint">{hotel.city}</p>
                  <p className="text-xs font-mono text-foreground-muted mt-2">{hotel.exposure} EGP</p>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-lg bg-accent-cyan/10">
                <Server size={18} className="text-accent-cyan" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">System Health</h2>
                <p className="text-xs text-foreground-faint">Fortress Protocol Status</p>
              </div>
            </div>

            <div className="space-y-1">
              <StatusRow label="Financial Fraud Prevention" status="active" detail="Idempotency armed" />
              <StatusRow label="Identity Breach Detection" status="warning" detail="Fingerprint 80%" />
              <StatusRow label="AI Hallucination Guard" status="active" detail="HITL > 100K EGP" />
              <StatusRow label="Data Integrity" status="active" detail="ACID + Hash chain" />
              <StatusRow label="API Security" status="warning" detail="HMAC active, mTLS pending" />
              <StatusRow label="Anomaly Detection" status="active" detail="Threshold 70%" />
            </div>

            <div className="mt-5 p-4 rounded-xl bg-surface-raised border border-border-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground-muted">Overall Score</span>
                <span className="text-sm font-bold text-accent-amber">6.2 / 10</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-hover overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-700 via-accent-amber to-accent-emerald transition-all duration-1000"
                  style={{ width: "62%" }}
                />
              </div>
              <p className="text-[11px] text-foreground-faint mt-2">
                Target: 9.0 — 4 P0 fixes remaining
              </p>
            </div>
          </div>

          {/* Liquidity Monitor */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-accent-gold/10">
                  <TrendingUp size={18} className="text-accent-gold" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Liquidity Monitor</h2>
                  <p className="text-xs text-foreground-faint">Partner capital deployment</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-foreground-faint">Today</p>
                  <p className="text-sm font-bold text-foreground">2.4M EGP</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-foreground-faint">This Month</p>
                  <p className="text-sm font-bold text-foreground">18.7M EGP</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "EFG Hermes", deployed: 12400000, capacity: 50000000, rate: 0.02, active: 45 },
                { name: "Contact Financial", deployed: 6300000, capacity: 20000000, rate: 0.03, active: 44 },
              ].map((partner) => (
                <div
                  key={partner.name}
                  className="p-4 rounded-xl bg-surface-raised border border-border-subtle"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">{partner.name}</span>
                    <span className="text-[10px] font-mono text-foreground-faint bg-surface px-2 py-0.5 rounded">
                      {(partner.rate * 100).toFixed(1)}% rate
                    </span>
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-lg font-bold text-foreground">
                      {(partner.deployed / 1000000).toFixed(1)}M
                    </span>
                    <span className="text-xs text-foreground-faint">
                      of {(partner.capacity / 1000000).toFixed(0)}M
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-hover overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent-gold transition-all duration-1000"
                      style={{ width: `${(partner.deployed / partner.capacity) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-foreground-faint mt-2">
                    {partner.active} active requests
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Agents */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-lg bg-accent-violet/10">
                <Users size={18} className="text-accent-violet" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Active Agents</h2>
                <p className="text-xs text-foreground-faint">Swarm status</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: "Risk Engine", status: "Active", tasks: 12, color: "bg-brand-500" },
                { name: "Smart Fix", status: "Active", tasks: 8, color: "bg-accent-amber" },
                { name: "Load Pooler", status: "Active", tasks: 5, color: "bg-accent-cyan" },
                { name: "ETA Bridge", status: "Active", tasks: 23, color: "bg-accent-emerald" },
                { name: "Hybrid AI", status: "Standby", tasks: 0, color: "bg-foreground-faint" },
              ].map((agent) => (
                <div
                  key={agent.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-raised border border-border-subtle hover:border-border-default transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${agent.color}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{agent.name}</p>
                      <p className="text-[10px] text-foreground-faint">{agent.status}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-foreground-muted">{agent.tasks} tasks</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
