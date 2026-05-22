"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Server,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Send,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface MockDoc {
  uuid: string;
  longId: string;
  internalId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function EtaMockDashboardPage() {
  const [docs, setDocs] = useState<MockDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [mockMode, setMockMode] = useState<boolean | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/eta-mock/documents");
      if (res.ok) {
        const data = await res.json();
        setDocs(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkMockMode = async () => {
    try {
      const res = await fetch("/api/eta-mock/status");
      if (res.ok) {
        const data = await res.json();
        setMockMode(data.data?.mockMode ?? false);
      }
    } catch {
      setMockMode(false);
    }
  };

  const sendCallback = async (uuid: string, status: string) => {
    try {
      await fetch("/api/eta-mock/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid, status }),
      });
      fetchDocs();
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    checkMockMode();
    fetchDocs();
    const interval = setInterval(fetchDocs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Server className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">ETA Mock Server</h1>
            <p className="text-[13px] text-neutral-400">
              Simulated Egyptian Tax Authority for development & testing
            </p>
          </div>
          <div className="ml-auto">
            {mockMode === null ? (
              <span className="text-[12px] text-neutral-500">Checking...</span>
            ) : mockMode ? (
              <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium uppercase tracking-wider">
                Mock Active
              </span>
            ) : (
              <span className="px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 font-medium uppercase tracking-wider">
                Real ETA Mode
              </span>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-[13px] text-neutral-400 leading-relaxed">
              <p className="text-neutral-300 mb-1">This mock server stores submitted invoices in Redis and simulates ETA responses.</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Submissions return a mock UUID immediately</li>
                <li>Status auto-advances from <code className="text-amber-400">Submitted</code> → <code className="text-emerald-400">Valid</code> after ~10 seconds</li>
                <li>Use the buttons below to manually trigger callbacks</li>
                <li>When real ETA credentials are available, set <code className="text-sky-400">ETA_MOCK_MODE=false</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={fetchDocs}
            disabled={loading}
            className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-neutral-300 hover:bg-white/[0.06] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Documents Table */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">UUID</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Invoice #</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-neutral-500 text-[13px]">
                      No mock documents yet. Submit an invoice through the normal flow to see it here.
                    </td>
                  </tr>
                ) : (
                  docs.map((doc) => (
                    <motion.tr
                      key={doc.uuid}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <code className="text-[12px] text-neutral-300 font-mono">{doc.uuid.slice(0, 16)}...</code>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-white">{doc.internalId}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="px-4 py-3 text-[12px] text-neutral-400">
                        {new Date(doc.createdAt).toLocaleTimeString("en-GB")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => sendCallback(doc.uuid, "Valid")}
                            className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="Send Valid callback"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => sendCallback(doc.uuid, "Invalid")}
                            className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Send Invalid callback"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => sendCallback(doc.uuid, "Submitted")}
                            className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors"
                            title="Send Submitted callback"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    Submitted: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: <Clock className="w-3 h-3" /> },
    Valid: { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: <CheckCircle2 className="w-3 h-3" /> },
    Invalid: { color: "text-red-400 bg-red-500/10 border-red-500/20", icon: <XCircle className="w-3 h-3" /> },
    Rejected: { color: "text-red-400 bg-red-500/10 border-red-500/20", icon: <XCircle className="w-3 h-3" /> },
    Cancelled: { color: "text-neutral-400 bg-white/[0.03] border-white/[0.08]", icon: <FileText className="w-3 h-3" /> },
  };
  const cfg = config[status] || config.Submitted;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${cfg.color}`}>
      {cfg.icon}
      {status}
    </span>
  );
}
