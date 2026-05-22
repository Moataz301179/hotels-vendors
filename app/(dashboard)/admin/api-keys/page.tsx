"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Clock,
  AlertTriangle,
  X,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string;
  usageCount: number;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  FactoringCompany: { name: string } | null;
}

const AVAILABLE_SCOPES = [
  { value: "read:scores", label: "Read Scores", desc: "Access supplier credit scores" },
  { value: "read:invoices", label: "Read Invoices", desc: "View invoice data" },
  { value: "write:factoring", label: "Write Factoring", desc: "Submit factoring decisions" },
];

export default function AdminApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["read:scores"]);
  const [newKeyRaw, setNewKeyRaw] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/api-keys");
      const data = await res.json();
      if (data.success) setKeys(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const createKey = async () => {
    if (!newKeyName.trim()) return;
    try {
      const res = await fetch("/api/v1/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName, scopes: selectedScopes }),
      });
      const data = await res.json();
      if (data.success) {
        setNewKeyRaw(data.data.rawKey);
        setKeys((prev) => [data.data, ...prev]);
      }
    } catch {
      // ignore
    }
  };

  const revokeKey = async (id: string) => {
    if (!confirm("Revoke this API key? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/v1/admin/api-keys?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, revokedAt: new Date().toISOString() } : k)));
      }
    } catch {
      // ignore
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeKeys = keys.filter((k) => !k.revokedAt);
  const revokedKeys = keys.filter((k) => k.revokedAt);

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Key className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">API Keys</h1>
            <p className="text-[13px] text-neutral-400">
              Manage partner API keys for external integrations
            </p>
          </div>
        </div>
        <button
          onClick={() => { setShowCreate(true); setNewKeyRaw(null); setNewKeyName(""); }}
          className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[13px] text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          New Key
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3">
        {[
          { label: "Active Keys", value: activeKeys.length, color: "text-emerald-400" },
          { label: "Total Usage", value: keys.reduce((s, k) => s + k.usageCount, 0), color: "text-sky-400" },
          { label: "Revoked", value: revokedKeys.length, color: "text-neutral-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Create Key Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-medium text-white">Create API Key</h3>
              <button onClick={() => setShowCreate(false)} className="text-neutral-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {newKeyRaw ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <Shield className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] text-emerald-400 font-medium">API Key Created</p>
                    <p className="text-[11px] text-neutral-500">
                      Copy this key now. You won&apos;t be able to see it again.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/[0.06] text-[12px] text-emerald-400 font-mono break-all">
                    {newKeyRaw}
                  </code>
                  <button
                    onClick={() => copyToClipboard(newKeyRaw)}
                    className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-neutral-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-[11px] text-neutral-500 uppercase tracking-wider">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Cairo Capital Integration"
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-500 uppercase tracking-wider">Scopes</label>
                  <div className="mt-2 space-y-2">
                    {AVAILABLE_SCOPES.map((scope) => (
                      <label key={scope.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedScopes.includes(scope.value)}
                          onChange={(e) => {
                            setSelectedScopes((prev) =>
                              e.target.checked ? [...prev, scope.value] : prev.filter((s) => s !== scope.value)
                            );
                          }}
                          className="w-4 h-4 rounded border-white/[0.12] bg-white/[0.03] text-sky-500 focus:ring-sky-500/30"
                        />
                        <div>
                          <div className="text-[13px] text-neutral-300">{scope.label}</div>
                          <div className="text-[11px] text-neutral-500">{scope.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={createKey}
                  disabled={!newKeyName.trim() || selectedScopes.length === 0}
                  className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[13px] text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                >
                  Generate Key
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keys Table */}
      <motion.div variants={fadeInUp}>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Key</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Scopes</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Usage</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Last Used</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-neutral-500 text-[13px]">Loading...</td>
                  </tr>
                ) : keys.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-neutral-500 text-[13px]">
                      No API keys yet. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  keys.map((key) => (
                    <tr
                      key={key.id}
                      className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${key.revokedAt ? "opacity-50" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <div className="text-[13px] text-white">{key.name}</div>
                        {key.FactoringCompany && (
                          <div className="text-[11px] text-neutral-500">{key.FactoringCompany.name}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-[12px] text-neutral-400 font-mono">{key.keyPrefix}••••••••</code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {key.scopes.split(",").map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-neutral-300">
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-neutral-300">{key.usageCount}</td>
                      <td className="px-4 py-3 text-[12px] text-neutral-400">
                        {key.lastUsedAt ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(key.lastUsedAt).toLocaleDateString("en-GB")}
                          </span>
                        ) : (
                          "Never"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {key.revokedAt ? (
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-[10px] text-red-400 font-medium">
                            Revoked
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[10px] text-emerald-400 font-medium">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {!key.revokedAt && (
                          <button
                            onClick={() => revokeKey(key.id)}
                            className="p-1.5 rounded hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
                            title="Revoke"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Usage Guide */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
          <div className="text-[13px] text-neutral-400 leading-relaxed space-y-1">
            <p className="text-neutral-300 font-medium">Partner Integration Guide</p>
            <p>Factoring partners can access supplier scores using their API key:</p>
            <code className="block mt-2 p-2 rounded bg-black/30 text-[11px] text-emerald-400 font-mono">
              curl -H &quot;X-API-Key: hv_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx&quot; \<br/>
              &nbsp;&nbsp;https://your-domain.com/api/v1/public/suppliers/TAX_ID/composite-score
            </code>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
