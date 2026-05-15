"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain, TrendingUp, AlertTriangle, CheckCircle2, Zap,
  Users, Building2, Hotel, ShoppingCart, Landmark, Loader2,
  ArrowUpRight, ArrowDownRight, Activity, Lightbulb,
} from "lucide-react";

interface Insight {
  id: string;
  type: "anomaly" | "trend" | "recommendation" | "alert";
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  metric?: string;
  change?: number;
  entity: string;
  timestamp: string;
}

interface HealthScore {
  overall: number;
  categories: {
    name: string;
    score: number;
    icon: React.ElementType;
    color: string;
  }[];
}

const MOCK_INSIGHTS: Insight[] = [
  {
    id: "1",
    type: "anomaly",
    severity: "warning",
    title: "Unusual order spike from Nile Grand Hotel",
    description: "Order volume increased 340% compared to 30-day average. Review for bulk procurement event or system error.",
    metric: "+340%",
    change: 340,
    entity: "orders",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    type: "trend",
    severity: "info",
    title: "F&B category dominates Q2 procurement",
    description: "Food & Beverage represents 62% of total GMV this quarter, up from 48% in Q1. Consider negotiating volume discounts.",
    metric: "62%",
    change: 14,
    entity: "analytics",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "3",
    type: "recommendation",
    severity: "info",
    title: "5 suppliers at risk of suspension",
    description: "Delta Food Supply, Cairo Fresh, and 3 others have delivery performance below 85%. Proactive outreach recommended.",
    metric: "5 suppliers",
    entity: "suppliers",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "4",
    type: "alert",
    severity: "critical",
    title: "ETA compliance threshold approaching",
    description: "3 invoices pending ETA submission with deadlines within 48 hours. Automatic penalties apply after deadline.",
    metric: "3 invoices",
    entity: "compliance",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "5",
    type: "trend",
    severity: "info",
    title: "Credit utilization rising across Premier hotels",
    description: "Premier tier hotels are utilizing 78% of their credit lines on average. Consider proactive limit reviews.",
    metric: "78%",
    change: 12,
    entity: "factoring",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "6",
    type: "recommendation",
    severity: "info",
    title: "AI suggests seasonal inventory pre-order",
    description: "Based on historical data, coastal hotels will need 40% more linens in July. Recommend pre-ordering from Verified suppliers.",
    metric: "+40% demand",
    entity: "products",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

const HEALTH_SCORE: HealthScore = {
  overall: 87,
  categories: [
    { name: "Platform Uptime", score: 99.8, icon: Activity, color: "#10b981" },
    { name: "Order Fulfillment", score: 94, icon: ShoppingCart, color: "#3b82f6" },
    { name: "ETA Compliance", score: 91, icon: CheckCircle2, color: "#8b5cf6" },
    { name: "Supplier Health", score: 82, icon: Building2, color: "#f59e0b" },
    { name: "Credit Risk", score: 76, icon: Landmark, color: "#ef4444" },
    { name: "User Engagement", score: 88, icon: Users, color: "#06b6d4" },
  ],
};

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "critical": return <AlertTriangle className="w-4 h-4 text-red-400" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    default: return <Lightbulb className="w-4 h-4 text-blue-400" />;
  }
}

function getSeverityBorder(severity: string) {
  switch (severity) {
    case "critical": return "border-red-500/20 bg-red-500/5";
    case "warning": return "border-amber-500/20 bg-amber-500/5";
    default: return "border-blue-500/20 bg-blue-500/5";
  }
}

function formatTimeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminAiInsightsPage() {
  const [insights] = useState<Insight[]>(MOCK_INSIGHTS);
  const [filter, setFilter] = useState<string>("all");

  const filteredInsights = filter === "all"
    ? insights
    : insights.filter((i) => i.type === filter);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[#8B0000]/10 border border-[#8B0000]/20">
            <Brain className="w-5 h-5 text-[#ff6b6b]" />
          </div>
          <h1 className="text-[24px] font-bold tracking-tight text-white">AI Insights</h1>
        </div>
        <p className="text-[13px] text-white/40">Intelligent anomaly detection, trend analysis, and strategic recommendations</p>
      </div>

      {/* Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Overall Score */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0f] p-6">
          <h3 className="text-sm font-medium text-white/60 mb-4">Platform Health Score</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={HEALTH_SCORE.overall >= 90 ? "#10b981" : HEALTH_SCORE.overall >= 75 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="8"
                  strokeDasharray={`${(HEALTH_SCORE.overall / 100) * 264} 264`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{HEALTH_SCORE.overall}</span>
                <span className="text-[10px] text-white/30 uppercase tracking-wider">/ 100</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-white/40 mt-4">
            {HEALTH_SCORE.overall >= 90 ? "Excellent — Platform operating optimally" :
             HEALTH_SCORE.overall >= 75 ? "Good — Minor issues to address" :
             "Needs attention — Critical issues detected"}
          </p>
        </div>

        {/* Category Scores */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-[#0a0a0f] p-6">
          <h3 className="text-sm font-medium text-white/60 mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {HEALTH_SCORE.categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.name} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: cat.color }} />
                    <span className="text-xs text-white/40">{cat.name}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-white/70">{cat.score}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights Feed */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0f]">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-[#ff6b6b]" />
              <h2 className="text-lg font-semibold text-white">Intelligent Alerts & Recommendations</h2>
            </div>
            <div className="flex gap-1">
              {["all", "anomaly", "trend", "recommendation", "alert"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === f
                      ? "bg-[#8B0000]/20 text-[#ff6b6b] border border-[#8B0000]/30"
                      : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filteredInsights.map((insight, idx) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-5 border-l-2 ${
                insight.severity === "critical" ? "border-l-red-500" :
                insight.severity === "warning" ? "border-l-amber-500" :
                "border-l-blue-500"
              } hover:bg-white/[0.01] transition-colors`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg border ${getSeverityBorder(insight.severity)} mt-0.5`}>
                  {getSeverityIcon(insight.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-white/80">{insight.title}</h3>
                    <span className="text-[10px] text-white/20">{formatTimeAgo(insight.timestamp)}</span>
                  </div>
                  <p className="text-sm text-white/40 mb-2">{insight.description}</p>
                  <div className="flex items-center gap-3">
                    {insight.metric && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        insight.change && insight.change > 0
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {insight.change && insight.change > 0 ? (
                          <ArrowUpRight className="inline w-3 h-3 mr-0.5" />
                        ) : insight.change && insight.change < 0 ? (
                          <ArrowDownRight className="inline w-3 h-3 mr-0.5" />
                        ) : null}
                        {insight.metric}
                      </span>
                    )}
                    <span className="text-[10px] text-white/20 uppercase tracking-wider">{insight.entity}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredInsights.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/30 text-sm">No insights match this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
