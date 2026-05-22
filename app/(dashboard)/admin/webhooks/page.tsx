"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Webhook,
  Plus,
  Check,
  X,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Clock,
  Send,
  Shield,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

interface WebhookSub {
  id: string;
  name: string;
  url: string;
  events: string;
  active: boolean;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  failureCount: number;
  createdAt: string;
}

const ALL_EVENTS = [
  "SCORE_CHANGED",
  "SCORE_EXPIRED",
  "ETA_SUBMITTED",
  "ETA_REJECTED",
  "FACTORING_APPROVED",
  "FACTORING_REJECTED",
  "CERTIFICATE_EXPIRING",
  "ORDER_DELIVERED",
  "SYSTEM",
];

export default function AdminWebhooksPage() {
  const [subs, setSubs] = useState<WebhookSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newSub, setNewSub] = useState({ name: "", url: "", secret: "", events: [] as string[] });

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/webhooks");
      const data = await res.json();
      if (data.success) setSubs(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  const createSub = async () => {
    if (!newSub.name || !newSub.url || newSub.events.length === 0) return;
    try {
      const res = await fetch("/api/v1/admin/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSub.name,
          url: newSub.url,
          events: newSub.events,
          secret: newSub.secret || undefined,
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewSub({ name: "", url: "", secret: "", events: [] });
        fetchSubs();
      }
    } catch {
      // ignore
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await fetch("/api/v1/admin/webhooks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !current }),
      });
      setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, active: !current } : s)));
    } catch {
      // ignore
    }
  };

  const deleteSub = async (id: string) => {
    if (!confirm("Delete this webhook subscription?")) return;
    try {
      await fetch(`/api/v1/admin/webhooks?id=${id}`, { method: "DELETE" });
      setSubs((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // ignore
    }
  };

  const activeSubs = subs.filter((s) => s.active);
  const failingSubs = subs.filter((s) => s.active && s.failureCount > 0);

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <Webhook className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Webhooks</h1>
            <p className="text-[13px] text-neutral-400">
              Push real-time events to partner endpoints
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[13px] text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          New Webhook
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3">
        {[
          { label: "Active", value: activeSubs.length, color: "text-emerald-400" },
          { label: "Failing", value: failingSubs.length, color: "text-red-400" },
          { label: "Total", value: subs.length, color: "text-neutral-300" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-medium text-white">Create Webhook</h3>
              <button onClick={() => setShowCreate(false)} className="text-neutral-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-neutral-500 uppercase tracking-wider">Name</label>
                <input
                  value={newSub.name}
                  onChange={(e) => setNewSub((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Cairo Capital Events"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-500 uppercase tracking-wider">Endpoint URL</label>
                <input
                  value={newSub.url}
                  onChange={(e) => setNewSub((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://partner.com/webhooks/hotels-vendors"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-neutral-500 uppercase tracking-wider">Secret (for HMAC signature)</label>
              <input
                value={newSub.secret}
                onChange={(e) => setNewSub((p) => ({ ...p, secret: e.target.value }))}
                placeholder="whsec_xxxxxxxxxxxxxxxx"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-500 uppercase tracking-wider">Events</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {ALL_EVENTS.map((evt) => (
                  <label key={evt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSub.events.includes(evt)}
                      onChange={(e) => {
                        setNewSub((p) => ({
                          ...p,
                          events: e.target.checked ? [...p.events, evt] : p.events.filter((x) => x !== evt),
                        }));
                      }}
                      className="w-4 h-4 rounded border-white/[0.12] bg-white/[0.03] text-violet-500 focus:ring-violet-500/30"
                    />
                    <span className="text-[12px] text-neutral-300">{evt.replace(/_/g, " ")}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={createSub}
              disabled={!newSub.name || !newSub.url || newSub.events.length === 0}
              className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[13px] text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
            >
              Create Webhook
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscriptions Table */}
      <motion.div variants={fadeInUp}>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Endpoint</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Events</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Health</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">Loading...</td></tr>
                ) : subs.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-neutral-500 text-[13px]">No webhooks yet.</td></tr>
                ) : (
                  subs.map((sub) => (
                    <tr key={sub.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="text-[13px] text-white">{sub.name}</div>
                        <div className="text-[11px] text-neutral-500">{new Date(sub.createdAt).toLocaleDateString("en-GB")}</div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-[11px] text-neutral-400 font-mono">{sub.url.slice(0, 50)}{sub.url.length > 50 ? "..." : ""}</code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {sub.events.split(",").map((e) => (
                            <span key={e} className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-neutral-300">{e.trim()}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {sub.failureCount > 0 ? (
                          <span className="flex items-center gap-1 text-[11px] text-red-400">
                            <AlertTriangle className="w-3 h-3" />
                            {sub.failureCount} failures
                          </span>
                        ) : sub.lastSuccessAt ? (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                            <Check className="w-3 h-3" />
                            OK
                          </span>
                        ) : (
                          <span className="text-[11px] text-neutral-500">No deliveries yet</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(sub.id, sub.active)}
                          className="text-neutral-400 hover:text-white transition-colors"
                        >
                          {sub.active ? (
                            <ToggleRight className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-neutral-600" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteSub(sub.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Webhook Payload Guide */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-start gap-3">
          <Send className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
          <div className="text-[13px] text-neutral-400 leading-relaxed space-y-1">
            <p className="text-neutral-300 font-medium">Webhook Payload Format</p>
            <p>Every webhook POST includes this JSON body:</p>
            <pre className="mt-2 p-3 rounded-lg bg-black/30 text-[11px] text-emerald-400 font-mono overflow-x-auto">
{`{
  "event": "SCORE_CHANGED",
  "timestamp": "2026-05-21T12:00:00Z",
  "data": {
    "title": "Score improved for Returants for E-Marketing",
    "message": "...",
    "priority": "HIGH",
    "entityType": "SUPPLIER",
    "entityId": "cmpxxx..."
  }
}`}
            </pre>
            <p className="text-[11px] text-neutral-500 mt-1">
              If a secret is configured, verify the <code className="text-neutral-300">X-Webhook-Signature</code> header using HMAC-SHA256.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
