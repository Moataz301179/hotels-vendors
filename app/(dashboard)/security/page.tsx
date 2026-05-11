"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Lock, Key, AlertTriangle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Users, FileText,
  ShieldAlert, ShieldCheck, Eye,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Modal } from "@/components/ui/modal";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorId: string;
  beforeState: string;
  afterState: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    success: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Success" },
    failed: { bg: "bg-red-500/10", text: "text-red-400", label: "Failed" },
    warning: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Warning" },
  };
  const c = config[status] || config.success;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.bg} ${c.text}`}>{c.label}</span>
  );
}

function PermCell({ perm }: { perm: string }) {
  const colors: Record<string, string> = {
    all: "bg-[#8B0000]/10 text-[#8B0000]",
    write: "bg-blue-500/10 text-blue-400",
    read: "bg-white/10 text-white/40",
    none: "bg-red-500/10 text-red-400/50",
  };
  const labels: Record<string, string> = { all: "All", write: "Write", read: "Read", none: "—" };
  return (
    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${colors[perm] || colors.none}`}>{labels[perm] || perm}</span>
  );
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const { data: auditData, loading: auditLoading, error: auditError } = useApi<{ entries: AuditEntry[]; pagination: { total: number } }>(
    "/api/v1/admin/audit-log?page=1&limit=20"
  );

  const entries = auditData?.entries ?? [];

  const stats = [
    { label: "Security Score", value: "94/100", change: "Excellent", up: true, icon: ShieldCheck },
    { label: "Active Sessions", value: "23", change: "5 admin, 18 users", up: true, icon: Users },
    { label: "Failed Logins", value: "3", change: "Last 24 hours", up: true, icon: AlertTriangle },
    { label: "MFA Adoption", value: "87%", change: "156 of 180 users", up: true, icon: Lock },
  ];

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Security Center</h1>
          <p className="text-sm text-white/40 mt-0.5">Access control, audit logs, and compliance monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span className="text-[11px] font-semibold text-emerald-400">Secure</span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeInUp}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{s.label}</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <s.icon size={15} className="text-white/40" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {s.up ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
              <span className={`text-[11px] font-medium ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04] w-fit">
        {[
          { id: "overview", label: "Overview" },
          { id: "audit", label: "Audit Log" },
          { id: "permissions", label: "Permissions" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id ? "bg-white/[0.06] text-white border border-white/[0.08]" : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {activeTab === "overview" && (
        <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Shield size={14} className="text-white/40" />Security Checklist</h3>
            <div className="space-y-3">
              {[
                { label: "Two-Factor Authentication", status: "enabled", critical: true },
                { label: "Password Policy (Strong)", status: "enabled", critical: true },
                { label: "Session Timeout (15min)", status: "enabled", critical: false },
                { label: "API Rate Limiting", status: "enabled", critical: true },
                { label: "Data Encryption at Rest", status: "enabled", critical: true },
                { label: "SSL/TLS Certificates", status: "enabled", critical: true },
                { label: "Automated Backups", status: "enabled", critical: false },
                { label: "DDoS Protection", status: "warning", critical: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.status === "enabled" ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
                    {item.status === "enabled" ? <CheckCircle2 size={12} className="text-emerald-400" /> : <AlertTriangle size={12} className="text-amber-400" />}
                  </div>
                  <span className="text-xs text-white flex-1">{item.label}</span>
                  {item.critical && <span className="text-[9px] text-red-400/50 font-medium">Critical</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><ShieldAlert size={14} className="text-white/40" />Recent Alerts</h3>
            <div className="space-y-3">
              {[
                { level: "warning", msg: "Failed login attempt from IP 203.87.45.111", time: "32m ago" },
                { level: "info", msg: "API key regenerated by Sara Mohamed", time: "1h ago" },
                { level: "info", msg: "Authority Matrix override by Admin", time: "2h ago" },
                { level: "success", msg: "Weekly security scan completed", time: "5h ago" },
                { level: "info", msg: "New user registered: Laila Ibrahim", time: "8h ago" },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                  <div className={`w-2 h-2 rounded-full mt-1 ${alert.level === "warning" ? "bg-amber-400" : alert.level === "success" ? "bg-emerald-400" : "bg-blue-400"}`} />
                  <div className="flex-1">
                    <p className="text-[11px] text-white/60">{alert.msg}</p>
                    <p className="text-[10px] text-white/20 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "audit" && (
        <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><FileText size={14} className="text-white/40" />Audit Log</h3>
          </div>
          {auditLoading ? (
            <div className="p-4"><LoadingTable rows={5} /></div>
          ) : auditError ? (
            <div className="p-4"><EmptyState title="Error loading audit log" description={auditError} /></div>
          ) : entries.length === 0 ? (
            <div className="p-4"><EmptyState title="No audit entries" description="Audit log will populate as actions are taken." /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Action</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Entity</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Actor</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Time</th>
                    <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                      <td className="px-4 py-3"><span className="text-xs text-white">{entry.action}</span></td>
                      <td className="px-4 py-3"><span className="text-[11px] text-white/40">{entry.entityType} #{entry.entityId?.slice(0, 8)}</span></td>
                      <td className="px-4 py-3"><span className="text-[11px] text-white/30 font-mono">{entry.actorId?.slice(0, 12)}...</span></td>
                      <td className="px-4 py-3"><span className="text-[11px] text-white/30">{new Date(entry.createdAt).toLocaleDateString()}</span></td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedEntry(entry)} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "permissions" && (
        <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Users size={14} className="text-white/40" />Role Permissions Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Role</th>
                {["Orders", "Inventory", "Users", "Finance", "Shipping", "Reports"].map((h) => (
                  <th key={h} className="text-center px-2 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { role: "Platform Admin", users: 3, perms: ["all", "all", "all", "all", "all", "all"] },
                { role: "Hotel Manager", users: 12, perms: ["read", "read", "write", "read", "none", "read"] },
                { role: "Supplier Admin", users: 45, perms: ["read", "write", "read", "none", "read", "read"] },
                { role: "Finance Officer", users: 8, perms: ["read", "read", "read", "write", "read", "none"] },
                { role: "Logistics Coordinator", users: 6, perms: ["read", "write", "none", "read", "write", "none"] },
                { role: "Viewer", users: 28, perms: ["read", "read", "none", "none", "none", "read"] },
              ].map((role, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-white">{role.role}</span>
                    <span className="text-[10px] text-white/20 ml-2">({role.users})</span>
                  </td>
                  {role.perms.map((perm, j) => (
                    <td key={j} className="px-2 py-3 text-center"><PermCell perm={perm} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Audit Entry Detail Modal */}
      <Modal
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title={`Audit Entry`}
        description={`${selectedEntry?.action} on ${selectedEntry?.entityType}`}
        size="md"
      >
        {selectedEntry && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Entity Type</p>
                <p className="text-sm text-white mt-0.5">{selectedEntry.entityType}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Entity ID</p>
                <p className="text-sm text-white mt-0.5 font-mono">{selectedEntry.entityId}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Actor</p>
                <p className="text-sm text-white mt-0.5 font-mono">{selectedEntry.actorId}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Timestamp</p>
                <p className="text-sm text-white mt-0.5">{new Date(selectedEntry.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {selectedEntry.beforeState && (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase mb-1">Before State</p>
                <code className="text-[10px] text-white/30 font-mono">{selectedEntry.beforeState}</code>
              </div>
            )}
            {selectedEntry.afterState && (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase mb-1">After State</p>
                <code className="text-[10px] text-white/30 font-mono">{selectedEntry.afterState}</code>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
