"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Oliv Referral Pipeline — admin view.
 *
 * Mirrors the admin/suppliers/pipeline pattern: stats strip + filters + table
 * with status-gated actions. The funnel stages are:
 *   SUBMITTED → ELIGIBLE → ADMIN_REVIEW → APPROVED → REFERRED → CONVERTED | LOST
 *   (INELIGIBLE can be re-evaluated back to ELIGIBLE)
 *
 * Pilot handoff is via email (no Oliv API yet) — see lib/referral/handoff.ts.
 */

interface Referral {
  id: string;
  entityType: "HOTEL" | "SUPPLIER";
  entityName: string;
  entityEmail: string;
  entityTaxId: string | null;
  stage: string;
  financingType: string;
  eligible: boolean | null;
  grade: string | null;
  score: number | null;
  riskLevel: string | null;
  ineligibleReasons: string[];
  recommendedFacility: { limitEgp: number; tenorDays: number; advanceRate: number; discountRate: number } | null;
  handoffEmailSentAt: string | null;
  convertedAt: string | null;
  createdAt: string;
}

interface Stats {
  counts: Record<string, number>;
  byEntityType: { HOTEL: number; SUPPLIER: number };
  conversionRate: number;
}

const STAGE_COLORS: Record<string, string> = {
  SUBMITTED: "bg-yellow-500/20 text-yellow-400",
  ELIGIBLE: "bg-emerald-500/20 text-emerald-400",
  INELIGIBLE: "bg-red-500/20 text-red-400",
  ADMIN_REVIEW: "bg-blue-500/20 text-blue-400",
  APPROVED: "bg-purple-500/20 text-purple-400",
  REFERRED: "bg-cyan-500/20 text-cyan-400",
  CONVERTED: "bg-green-500/20 text-green-400",
  LOST: "bg-gray-500/20 text-gray-400",
};

const PIPELINE_STAGES = [
  "SUBMITTED", "ELIGIBLE", "INELIGIBLE", "ADMIN_REVIEW",
  "APPROVED", "REFERRED", "CONVERTED", "LOST",
] as const;

export default function ReferralPipelinePage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState("");
  const [filterEntityType, setFilterEntityType] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (filterStage) params.set("stage", filterStage);
      if (filterEntityType) params.set("entityType", filterEntityType);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/v1/admin/referrals?${params.toString()}`);
      const data = await res.json();
      setReferrals(data.referrals || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch referrals:", err);
    } finally {
      setLoading(false);
    }
  }, [page, filterStage, filterEntityType, debouncedSearch]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/admin/referrals/stats");
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch referral stats:", err);
    }
  }, []);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [search]);

  useEffect(() => { fetchReferrals(); }, [fetchReferrals]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const refresh = () => { fetchReferrals(); fetchStats(); };

  const post = async (id: string, path: string, body?: Record<string, unknown>) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/admin/referrals/${id}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : "{}",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Action completed");
        refresh();
      } else {
        setMessage(data.error || "Action failed");
      }
    } catch (err) {
      setMessage("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  const advance = (id: string, toStage: string) => post(id, "advance", { toStage });
  const sendToOliv = (id: string) => post(id, "send");
  const convert = (id: string) => post(id, "convert", {});

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Oliv Referral Pipeline</h1>
          <p className="text-gray-400">
            Pre-qualified hotel + supplier referrals to Oliv Finance (pilot — email handoff)
          </p>
        </div>

        {/* Stats strip */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage} className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className={`text-xl font-bold ${(STAGE_COLORS[stage] || "").split(" ")[1]}`}>
                  {stats.counts[stage] || 0}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">{stage.replace("_", " ")}</div>
              </div>
            ))}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{stats.byEntityType.HOTEL}</div>
              <div className="text-sm text-gray-400">Hotel referrals</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{stats.byEntityType.SUPPLIER}</div>
              <div className="text-sm text-gray-400">Supplier referrals</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-emerald-400">{(stats.conversionRate * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Conversion rate (CONVERTED / CONVERTED+LOST)</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search name, email, tax ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm flex-1 min-w-[200px]"
          />
          <select
            value={filterStage}
            onChange={(e) => { setFilterStage(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm"
          >
            <option value="">All stages</option>
            {PIPELINE_STAGES.map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
          <select
            value={filterEntityType}
            onChange={(e) => { setFilterEntityType(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm"
          >
            <option value="">All types</option>
            <option value="HOTEL">Hotel</option>
            <option value="SUPPLIER">Supplier</option>
          </select>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
            {message}
          </div>
        )}

        {/* Table */}
        <div className="bg-[#0f0f0f] border border-white/[0.06] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Entity", "Type", "Stage", "Score", "Risk", "Facility", "Created", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center text-gray-500 py-8">Loading...</td></tr>
              ) : referrals.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-gray-500 py-8">No referrals yet</td></tr>
              ) : referrals.map((r) => (
                <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.entityName}</div>
                    <div className="text-xs text-gray-500">{r.entityEmail}</div>
                    {r.entityTaxId && <div className="text-xs text-gray-600">Tax: {r.entityTaxId}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${r.entityType === "HOTEL" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"}`}>
                      {r.entityType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${STAGE_COLORS[r.stage] || "bg-gray-500/20 text-gray-400"}`}>
                      {r.stage.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {r.grade && r.score != null ? `${r.grade} · ${r.score}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">{r.riskLevel ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {r.recommendedFacility
                      ? `${(r.recommendedFacility.limitEgp / 1000).toFixed(0)}K @ ${(r.recommendedFacility.advanceRate * 100).toFixed(0)}%`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {/* Stage-gated actions */}
                      {r.stage === "ELIGIBLE" && (
                        <button
                          onClick={() => advance(r.id, "ADMIN_REVIEW")}
                          disabled={actionLoading === r.id}
                          className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 disabled:opacity-50"
                        >Review</button>
                      )}
                      {r.stage === "ADMIN_REVIEW" && (
                        <button
                          onClick={() => advance(r.id, "APPROVED")}
                          disabled={actionLoading === r.id}
                          className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 disabled:opacity-50"
                        >Approve</button>
                      )}
                      {r.stage === "APPROVED" && (
                        <button
                          onClick={() => sendToOliv(r.id)}
                          disabled={actionLoading === r.id}
                          className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 disabled:opacity-50"
                        >Send to Oliv →</button>
                      )}
                      {r.stage === "REFERRED" && (
                        <button
                          onClick={() => convert(r.id)}
                          disabled={actionLoading === r.id}
                          className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 disabled:opacity-50"
                        >Mark Converted ✓</button>
                      )}
                      {["ELIGIBLE", "ADMIN_REVIEW", "APPROVED", "REFERRED"].includes(r.stage) && (
                        <button
                          onClick={() => advance(r.id, "LOST")}
                          disabled={actionLoading === r.id}
                          className="text-xs px-2 py-1 bg-gray-500/20 text-gray-400 rounded hover:bg-gray-500/30 disabled:opacity-50"
                        >Lost</button>
                      )}
                      {r.stage === "INELIGIBLE" && r.ineligibleReasons.length > 0 && (
                        <span className="text-xs text-red-400/70" title={r.ineligibleReasons.join("; ")}>
                          {r.ineligibleReasons[0]}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm disabled:opacity-50 hover:bg-white/10"
            >Previous</button>
            <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm disabled:opacity-50 hover:bg-white/10"
            >Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
