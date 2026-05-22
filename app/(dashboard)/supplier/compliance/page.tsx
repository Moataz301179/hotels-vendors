"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  FileText,
  Download,
} from "lucide-react";
import { ScoreHistoryChart } from "@/components/compliance/score-history-chart";
import { ScoreBadge } from "@/components/compliance/score-badge";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

interface ScoreHistoryResponse {
  scores: {
    id: string;
    source: string;
    scoreValue: number;
    scoreLabel: string | null;
    riskTier: string | null;
    creditLimit: number | null;
    assessedAt: string;
    expiresAt: string | null;
  }[];
  bySource: Record<string, typeof scores>;
  summary: {
    total: number;
    sources: string[];
    latest: (typeof scores)[0] | null;
  };
}

interface CompositeScore {
  compositeScore: number;
  riskTier: string;
  factors: {
    externalScore: number | null;
    platformScore: number | null;
    etaComplianceScore: number;
    transactionHistoryScore: number;
  };
}

export default function SupplierCompliancePage() {
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [history, setHistory] = useState<ScoreHistoryResponse | null>(null);
  const [composite, setComposite] = useState<CompositeScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user's supplier profile
    fetch("/api/v1/supplier/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.id) {
          setSupplierId(data.data.id);
          loadScores(data.data.id);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const loadScores = async (id: string) => {
    try {
      const [hRes, cRes] = await Promise.all([
        fetch(`/api/v1/suppliers/${id}/score-history?limit=100`),
        fetch(`/api/v1/suppliers/${id}/composite-score`),
      ]);
      const hData = await hRes.json();
      const cData = await cRes.json();
      if (hData.success) setHistory(hData.data);
      if (cData.success) setComposite(cData.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500 text-[13px]">
        Loading compliance data...
      </div>
    );
  }

  if (!supplierId) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500 text-[13px]">
        No supplier profile found
      </div>
    );
  }

  const latest = history?.summary.latest;
  const hasHistory = (history?.scores.length || 0) > 0;

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Compliance Center</h1>
            <p className="text-[13px] text-neutral-400">
              Credit scores, certificates, and ETA compliance status
            </p>
          </div>
        </div>
        <ScoreBadge supplierId={supplierId} size="lg" showTrend />
      </motion.div>

      {/* Composite Score Cards */}
      {composite && (
        <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Composite Score",
              value: composite.compositeScore,
              color: composite.compositeScore >= 80 ? "text-emerald-400" : composite.compositeScore >= 60 ? "text-amber-400" : "text-red-400",
              icon: composite.compositeScore >= 60 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />,
            },
            {
              label: "External Score",
              value: composite.factors.externalScore ?? "—",
              color: "text-neutral-300",
              icon: null,
            },
            {
              label: "ETA Compliance",
              value: composite.factors.etaComplianceScore,
              color: composite.factors.etaComplianceScore >= 80 ? "text-emerald-400" : "text-amber-400",
              icon: null,
            },
            {
              label: "Transaction History",
              value: composite.factors.transactionHistoryScore,
              color: "text-sky-400",
              icon: null,
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className={`text-xl font-bold ${s.color} flex items-center gap-2`}>
                {s.value}
                {s.icon}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Score History Chart */}
      <motion.div variants={fadeInUp}>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neutral-400" />
              <h2 className="text-[13px] font-medium text-white">Score History</h2>
            </div>
            {latest && (
              <span className="text-[11px] text-neutral-500">
                Latest: {latest.source} on {new Date(latest.assessedAt).toLocaleDateString("en-GB")}
              </span>
            )}
          </div>
          <ScoreHistoryChart scores={history?.scores || []} height={300} />
        </div>
      </motion.div>

      {/* Score Table */}
      {hasHistory && (
        <motion.div variants={fadeInUp}>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <FileText className="w-4 h-4 text-neutral-400" />
              <h2 className="text-[13px] font-medium text-white">Score Records</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-2 text-[11px] font-medium text-neutral-500 uppercase">Source</th>
                    <th className="px-4 py-2 text-[11px] font-medium text-neutral-500 uppercase">Score</th>
                    <th className="px-4 py-2 text-[11px] font-medium text-neutral-500 uppercase">Label</th>
                    <th className="px-4 py-2 text-[11px] font-medium text-neutral-500 uppercase">Risk</th>
                    <th className="px-4 py-2 text-[11px] font-medium text-neutral-500 uppercase">Credit Limit</th>
                    <th className="px-4 py-2 text-[11px] font-medium text-neutral-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-[11px] font-medium text-neutral-500 uppercase">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {history!.scores.slice().reverse().map((s) => (
                    <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-2">
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-neutral-300">
                          {s.source.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-mono text-white">{s.scoreValue}</td>
                      <td className="px-4 py-2 text-neutral-400">{s.scoreLabel || "—"}</td>
                      <td className="px-4 py-2">
                        {s.riskTier ? (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              s.riskTier === "LOW"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : s.riskTier === "MEDIUM"
                                ? "bg-amber-500/10 text-amber-400"
                                : s.riskTier === "HIGH"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-red-900/20 text-red-600"
                            }`}
                          >
                            {s.riskTier}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-2 text-neutral-400">
                        {s.creditLimit ? `EGP ${s.creditLimit.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-4 py-2 text-neutral-400">
                        {new Date(s.assessedAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-2 text-neutral-400">
                        {s.expiresAt ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(s.expiresAt).toLocaleDateString("en-GB")}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Certificates Section */}
      <motion.div variants={fadeInUp}>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[13px] font-medium text-white">Digital Certificates</h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                e-Seal and e-Signature certificates for ETA invoice signing
              </p>
            </div>
            <a
              href="/supplier/egs-codes"
              className="text-[12px] text-sky-400 hover:text-sky-300 transition-colors"
            >
              Manage EGS Codes →
            </a>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-[12px] text-neutral-400">
              No e-Seal certificate uploaded yet.{" "}
              <span className="text-neutral-300">
                Upload your certificate from Egypt Trust, Tawtheeq, or MCDR to enable automatic digital signing.
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
