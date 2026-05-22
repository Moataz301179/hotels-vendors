"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface ScoreBadgeProps {
  supplierId: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showTrend?: boolean;
}

interface ScoreData {
  compositeScore: number;
  riskTier: string;
  factors: {
    externalScore: number | null;
    platformScore: number | null;
    etaComplianceScore: number;
    transactionHistoryScore: number;
  };
}

const TIER_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  LOW: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    label: "Low Risk",
  },
  MEDIUM: {
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: <Shield className="w-3.5 h-3.5" />,
    label: "Medium Risk",
  },
  HIGH: {
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
    label: "High Risk",
  },
  CRITICAL: {
    color: "text-red-600",
    bg: "bg-red-900/20 border-red-900/30",
    icon: <ShieldX className="w-3.5 h-3.5" />,
    label: "Critical",
  },
};

export function ScoreBadge({ supplierId, size = "md", showLabel = true, showTrend = false }: ScoreBadgeProps) {
  const [score, setScore] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/suppliers/${supplierId}/composite-score`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setScore(data.data);
      })
      .finally(() => setLoading(false));
  }, [supplierId]);

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-neutral-500 animate-pulse">
        <Shield className="w-3 h-3" />
        Loading...
      </span>
    );
  }

  if (!score) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-neutral-500">
        <Shield className="w-3 h-3" />
        No Score
      </span>
    );
  }

  const cfg = TIER_CONFIG[score.riskTier] || TIER_CONFIG.MEDIUM;

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px] gap-1",
    md: "px-2 py-1 text-[11px] gap-1.5",
    lg: "px-3 py-1.5 text-[12px] gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${cfg.bg} ${cfg.color} ${sizeClasses[size]}`}
      title={`Composite: ${score.compositeScore} | External: ${score.factors.externalScore ?? "N/A"} | Platform: ${score.factors.platformScore ?? "N/A"} | ETA: ${score.factors.etaComplianceScore} | History: ${score.factors.transactionHistoryScore}`}
    >
      <span className={iconSizes[size]}>{cfg.icon}</span>
      <span className="font-medium">{score.compositeScore}</span>
      {showLabel && <span className="hidden sm:inline opacity-80">{cfg.label}</span>}
      {showTrend && score.factors.externalScore !== null && (
        <span className="opacity-60">
          {score.factors.externalScore > score.compositeScore ? (
            <TrendingUp className="w-3 h-3" />
          ) : score.factors.externalScore < score.compositeScore ? (
            <TrendingDown className="w-3 h-3" />
          ) : (
            <Minus className="w-3 h-3" />
          )}
        </span>
      )}
    </span>
  );
}

export function ScoreMiniBar({ supplierId }: { supplierId: string }) {
  const [score, setScore] = useState<ScoreData | null>(null);

  useEffect(() => {
    fetch(`/api/v1/suppliers/${supplierId}/composite-score`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setScore(data.data);
      });
  }, [supplierId]);

  if (!score) return null;

  const pct = score.compositeScore;
  const color =
    pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : pct >= 40 ? "bg-red-500" : "bg-red-700";

  return (
    <div className="w-full max-w-[120px]">
      <div className="flex justify-between text-[10px] text-neutral-500 mb-0.5">
        <span>Score</span>
        <span>{pct}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
