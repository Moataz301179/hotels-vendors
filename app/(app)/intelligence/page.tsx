"use client";

import { useState, useEffect } from "react";
import { Brain, Sparkles, Target, Globe, Shield } from "lucide-react";

interface Competitor {
  id: string;
  name: string;
  type: string;
  marketShare: number;
  threatLevel: string;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  severity: string;
}

interface Feature {
  id: string;
  title: string;
  category: string;
  impact: string;
  status: string;
  moatScore: number;
  revenuePotential: number;
}

export default function IntelligencePage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/intelligence/competitors").then((r) => r.json()),
      fetch("/api/intelligence/insights").then((r) => r.json()),
      fetch("/api/intelligence/features").then((r) => r.json()),
    ])
      .then(([c, i, f]) => {
        if (c.success) setCompetitors(c.data);
        if (i.success) setInsights(i.data);
        if (f.success) setFeatures(f.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-xs text-foreground-muted">
        <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading intelligence layer...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold flex items-center gap-2">
            <Brain className="w-4 h-4 text-brand-400" />
            Market Intelligence
          </h1>
          <p className="text-[11px] text-foreground-muted">Competitor tracking, market gaps, and AI-generated feature proposals</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: "Competitors", value: competitors.length, icon: <Globe className="w-3.5 h-3.5 text-blue-400" /> },
          { label: "Active Insights", value: insights.length, icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
          { label: "Proposed Features", value: features.length, icon: <Target className="w-3.5 h-3.5 text-violet-400" /> },
          { label: "Avg Moat Score", value: Math.round(features.reduce((s, f) => s + (f.moatScore || 0), 0) / (features.length || 1)), icon: <Shield className="w-3.5 h-3.5 text-emerald-400" /> },
        ].map((k) => (
          <div key={k.label} className="rounded-md border border-border-subtle bg-surface p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] uppercase tracking-wider text-foreground-muted font-medium">{k.label}</span>
              {k.icon}
            </div>
            <div className="text-sm font-semibold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
          <div className="px-3 py-2 border-b border-border-subtle bg-surface-raised/50 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <h2 className="text-xs font-semibold">Competitors</h2>
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border-subtle text-foreground-muted bg-surface-raised/50">
                <th className="text-left px-3 py-1.5 font-medium">Name</th>
                <th className="text-left px-3 py-1.5 font-medium">Type</th>
                <th className="text-right px-3 py-1.5 font-medium">Share</th>
                <th className="text-left px-3 py-1.5 font-medium">Threat</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c) => (
                <tr key={c.id} className="border-b border-border-subtle/40 hover:bg-surface-raised/40 transition-colors">
                  <td className="px-3 py-1.5 font-medium">{c.name}</td>
                  <td className="px-3 py-1.5 text-foreground-muted">{c.type}</td>
                  <td className="px-3 py-1.5 text-right font-mono">{c.marketShare}%</td>
                  <td className="px-3 py-1.5">
                    <span className={`text-[9px] px-1.5 py-[1px] rounded-full ${c.threatLevel === "HIGH" ? "bg-red-500/10 text-red-400" : c.threatLevel === "MEDIUM" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>{c.threatLevel}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
          <div className="px-3 py-2 border-b border-border-subtle bg-surface-raised/50 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <h2 className="text-xs font-semibold">Market Insights</h2>
          </div>
          <div className="divide-y divide-border-subtle/40">
            {insights.slice(0, 6).map((i) => (
              <div key={i.id} className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium">{i.title}</span>
                  <span className={`text-[9px] px-1.5 py-[1px] rounded-full ${i.severity === "CRITICAL" ? "bg-red-500/10 text-red-400" : i.severity === "HIGH" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"}`}>{i.severity}</span>
                </div>
                <div className="text-[9px] text-foreground-muted mt-0.5 truncate">{i.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
        <div className="px-3 py-2 border-b border-border-subtle bg-surface-raised/50 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-violet-400" />
          <h2 className="text-xs font-semibold">Feature Proposals</h2>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border-subtle text-foreground-muted bg-surface-raised/50">
              <th className="text-left px-3 py-1.5 font-medium">Feature</th>
              <th className="text-left px-3 py-1.5 font-medium">Category</th>
              <th className="text-left px-3 py-1.5 font-medium">Impact</th>
              <th className="text-right px-3 py-1.5 font-medium">Moat</th>
              <th className="text-right px-3 py-1.5 font-medium">Revenue</th>
              <th className="text-left px-3 py-1.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.id} className="border-b border-border-subtle/40 hover:bg-surface-raised/40 transition-colors">
                <td className="px-3 py-1.5 font-medium">{f.title}</td>
                <td className="px-3 py-1.5 text-foreground-muted">{f.category}</td>
                <td className="px-3 py-1.5 text-foreground-muted">{f.impact}</td>
                <td className="px-3 py-1.5 text-right font-mono">{f.moatScore}</td>
                <td className="px-3 py-1.5 text-right font-mono">EGP {(f.revenuePotential / 1000000).toFixed(1)}M</td>
                <td className="px-3 py-1.5">
                  <span className="text-[9px] px-1.5 py-[1px] rounded-full bg-surface border border-border-subtle">{f.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
