"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  MessageSquare,
  Webhook,
  Filter,
  ChevronDown,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

interface DeliveryLog {
  id: string;
  channel: string;
  recipient: string;
  type: string;
  status: string;
  response: string | null;
  error: string | null;
  createdAt: string;
}

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  email: <Mail className="w-3.5 h-3.5" />,
  sms: <MessageSquare className="w-3.5 h-3.5" />,
  webhook: <Webhook className="w-3.5 h-3.5" />,
};

const STATUS_STYLES: Record<string, string> = {
  DELIVERED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  SENT: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  FAILED: "text-red-400 bg-red-500/10 border-red-500/20",
  PENDING: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  BOUNCED: "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

export default function AdminDeliveryLogsPage() {
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (channelFilter !== "all") params.set("channel", channelFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/v1/admin/delivery-logs?${params.toString()}`);
      const data = await res.json();
      if (data.success) setLogs(data.data);
    } finally {
      setLoading(false);
    }
  }, [channelFilter, statusFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const stats = {
    total: logs.length,
    delivered: logs.filter((l) => l.status === "DELIVERED").length,
    failed: logs.filter((l) => l.status === "FAILED").length,
    pending: logs.filter((l) => l.status === "PENDING").length,
  };

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Send className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Delivery Logs</h1>
            <p className="text-[13px] text-neutral-400">Track notification delivery across all channels</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-neutral-300" },
          { label: "Delivered", value: stats.delivered, color: "text-emerald-400" },
          { label: "Failed", value: stats.failed, color: "text-red-400" },
          { label: "Pending", value: stats.pending, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-neutral-500" />
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30"
        >
          <option value="all">All Channels</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="webhook">Webhook</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[12px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30"
        >
          <option value="all">All Statuses</option>
          <option value="DELIVERED">Delivered</option>
          <option value="SENT">Sent</option>
          <option value="FAILED">Failed</option>
          <option value="PENDING">Pending</option>
        </select>
      </motion.div>

      {/* Logs Table */}
      <motion.div variants={fadeInUp}>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Channel</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Response</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">Loading...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-neutral-500 text-[13px]">No delivery logs yet.</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-[12px] text-neutral-300">
                          <span className="text-neutral-500">{CHANNEL_ICONS[log.channel] || <Send className="w-3.5 h-3.5" />}</span>
                          {log.channel}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-neutral-300">{log.type.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3">
                        <code className="text-[11px] text-neutral-400 font-mono">{log.recipient.slice(0, 40)}{log.recipient.length > 40 ? "..." : ""}</code>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border ${STATUS_STYLES[log.status] || "text-neutral-400 bg-white/[0.05] border-white/[0.08]"}`}>
                          {log.status === "DELIVERED" && <CheckCircle2 className="w-3 h-3" />}
                          {log.status === "FAILED" && <XCircle className="w-3 h-3" />}
                          {log.status === "PENDING" && <Clock className="w-3 h-3" />}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-neutral-400">{log.response || log.error || "—"}</td>
                      <td className="px-4 py-3 text-[11px] text-neutral-500">{new Date(log.createdAt).toLocaleString("en-GB")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
