"use client";

import { motion } from "framer-motion";
import { Shield, Clock, User, Activity, RefreshCw } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

interface AuditEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  actorId: string | null;
  actorRole: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export default function AdminLogsPage() {
  const { data: logsData, loading, refetch } = useApi<{ logs: AuditEntry[]; total: number }>(
    "/api/v1/admin/audit-log?page=1&limit=50"
  );

  const logs = logsData?.logs ?? [];

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">System Audit Logs</h1>
          <p className="text-sm text-white/40 mt-0.5">Immutable record of all system actions and security events</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-white/80 transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </motion.div>

      <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-[#39ff7e] rounded-full animate-spin mx-auto" />
            <p className="text-xs text-white/30 mt-3">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center">
            <Shield size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">No audit logs yet.</p>
            <p className="text-xs text-white/20 mt-1">System actions will be recorded here automatically.</p>
          </div>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Timestamp</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Action</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Entity</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Actor</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/40 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-white">{log.action}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/40">{log.entityType}:{log.entityId.slice(0, 8)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/40">{log.actorId?.slice(0, 8) || "system"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] text-white/30">{log.actorRole || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono text-white/20">{log.ipAddress || "—"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
}
