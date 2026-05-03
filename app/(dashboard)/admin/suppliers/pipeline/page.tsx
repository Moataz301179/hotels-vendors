"use client";

import { useState, useEffect, useCallback } from "react";

interface Lead {
  id: string;
  name: string;
  city: string | null;
  category: string | null;
  status: string;
  priority: number;
  email: string | null;
  phone: string | null;
  source: string;
  sourceUrl: string | null;
  createdAt: string;
  lastContactAt: string | null;
  contactCount: number;
}

interface Source {
  id: string;
  name: string;
  region: string;
  category: string;
  priority: number;
  url: string;
}

interface PipelineStats {
  total: number;
  discovered: number;
  enriched: number;
  contacted: number;
  converted: number;
  lost: number;
}

export default function SupplierPipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [acquiring, setAcquiring] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (filterStatus) params.set("status", filterStatus);
      if (search) params.set("search", search);

      const res = await fetch(`/api/v1/leads?${params.toString()}`);
      const data = await res.json();
      setLeads(data.leads || []);
      setTotalPages(data.pagination?.totalPages || 1);

      const all = data.leads || [];
      const stats: PipelineStats = {
        total: data.pagination?.total || 0,
        discovered: all.filter((l: Lead) => l.status === "DISCOVERED").length,
        enriched: all.filter((l: Lead) => l.status === "ENRICHED").length,
        contacted: all.filter((l: Lead) => ["CONTACTED", "RESPONDED"].includes(l.status)).length,
        converted: all.filter((l: Lead) => l.status === "CONVERTED").length,
        lost: all.filter((l: Lead) => l.status === "LOST").length,
      };
      setStats(stats);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, search]);

  const fetchSources = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/swarm/acquire");
      const data = await res.json();
      setSources(data.sources || []);
    } catch (err) {
      console.error("Failed to fetch sources:", err);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchSources();
  }, [fetchLeads, fetchSources]);

  const triggerAcquisition = async () => {
    if (selectedSources.length === 0) {
      setMessage("Select at least one source");
      return;
    }
    setAcquiring(true);
    setMessage("");
    try {
      const res = await fetch("/api/v1/swarm/acquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceIds: selectedSources,
          maxLeadsPerSource: 20,
          autoEnrich: true,
          autoOutreach: false,
          dryRun: false,
        }),
      });
      const data = await res.json();
      setMessage(`Acquisition queued: ${data.runId}. ${data.message}`);
      setSelectedSources([]);
    } catch (err) {
      setMessage("Failed to start acquisition");
    } finally {
      setAcquiring(false);
    }
  };

  const enrichLead = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/leads/${id}/enrich`, { method: "POST" });
      const data = await res.json();
      if (data.leadId) {
        setMessage(`Lead enriched successfully`);
        fetchLeads();
      }
    } catch (err) {
      setMessage(`Failed to enrich lead`);
    }
  };

  const convertLead = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/leads/${id}/convert`, { method: "POST" });
      const data = await res.json();
      if (data.supplierId) {
        setMessage(`Lead converted to supplier: ${data.supplierName}`);
        fetchLeads();
      }
    } catch (err) {
      setMessage(`Failed to convert lead`);
    }
  };

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      DISCOVERED: "bg-yellow-500/20 text-yellow-400",
      ENRICHED: "bg-blue-500/20 text-blue-400",
      CONTACTED: "bg-purple-500/20 text-purple-400",
      RESPONDED: "bg-green-500/20 text-green-400",
      QUALIFIED: "bg-emerald-500/20 text-emerald-400",
      CONVERTED: "bg-red-500/20 text-red-400",
      LOST: "bg-gray-500/20 text-gray-400",
      PAUSED: "bg-orange-500/20 text-orange-400",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Supplier Acquisition Pipeline</h1>
          <p className="text-gray-400">
            Autonomous lead discovery, enrichment, and conversion tracking
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Total Leads", value: stats.total, color: "text-white" },
              { label: "Discovered", value: stats.discovered, color: "text-yellow-400" },
              { label: "Enriched", value: stats.enriched, color: "text-blue-400" },
              { label: "Contacted", value: stats.contacted, color: "text-purple-400" },
              { label: "Converted", value: stats.converted, color: "text-red-400" },
              { label: "Lost", value: stats.lost, color: "text-gray-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Launch Acquisition Run</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {sources.map((source) => (
              <label
                key={source.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                  selectedSources.includes(source.id)
                    ? "border-red-500 bg-red-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 accent-red-500"
                  checked={selectedSources.includes(source.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSources((prev) => [...prev, source.id]);
                    } else {
                      setSelectedSources((prev) => prev.filter((id) => id !== source.id));
                    }
                  }}
                />
                <div className="flex-1">
                  <div className="font-medium">{source.name}</div>
                  <div className="text-sm text-gray-400">
                    {source.region} &middot; {source.category} &middot; Priority {source.priority}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <button
            onClick={triggerAcquisition}
            disabled={acquiring || selectedSources.length === 0}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition"
          >
            {acquiring ? "Launching..." : `Acquire from ${selectedSources.length} source(s)`}
          </button>
          {message && (
            <div className="mt-3 text-sm text-gray-300">{message}</div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
          >
            <option value="">All Statuses</option>
            <option value="DISCOVERED">Discovered</option>
            <option value="ENRICHED">Enriched</option>
            <option value="CONTACTED">Contacted</option>
            <option value="RESPONDED">Responded</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="CONVERTED">Converted</option>
            <option value="LOST">Lost</option>
          </select>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                <th className="p-4">Name</th>
                <th className="p-4">City</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Source</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    No leads found. Launch an acquisition run to discover suppliers.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-4">
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.id.slice(0, 8)}</div>
                    </td>
                    <td className="p-4 text-gray-300">{lead.city || "—"}</td>
                    <td className="p-4 text-gray-300">{lead.category || "—"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${lead.priority * 10}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{lead.priority}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {lead.email && <div>{lead.email}</div>}
                      {lead.phone && <div>{lead.phone}</div>}
                      {!lead.email && !lead.phone && <span className="text-gray-500">—</span>}
                    </td>
                    <td className="p-4 text-sm text-gray-400">{lead.source}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {lead.status === "DISCOVERED" && (
                          <button
                            onClick={() => enrichLead(lead.id)}
                            className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded text-xs hover:bg-blue-600/30 transition"
                          >
                            Enrich
                          </button>
                        )}
                        {lead.status !== "CONVERTED" && lead.status !== "LOST" && (
                          <button
                            onClick={() => convertLead(lead.id)}
                            className="px-3 py-1 bg-red-600/20 text-red-400 rounded text-xs hover:bg-red-600/30 transition"
                          >
                            Convert
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
