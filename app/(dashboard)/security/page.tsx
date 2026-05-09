"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Lock, Key, Eye, EyeOff, AlertTriangle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Users, FileText, Clock,
  ShieldAlert, ShieldCheck,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const SECURITY_STATS = [
  { label: "Security Score", value: "94/100", change: "Excellent", up: true, icon: ShieldCheck },
  { label: "Active Sessions", value: "23", change: "5 admin, 18 users", up: true, icon: Users },
  { label: "Failed Logins", value: "3", change: "Last 24 hours", up: true, icon: AlertTriangle },
  { label: "MFA Adoption", value: "87%", change: "156 of 180 users", up: true, icon: Lock },
];

const AUDIT_LOGS = [
  { action: "User login", user: "ahmed@hotelsvendors.com", ip: "196.219.123.45", status: "success", time: "2m ago" },
  { action: "Role changed", user: "admin@hotelsvendors.com", ip: "196.219.123.12", status: "success", time: "15m ago" },
  { action: "Failed login", user: "unknown", ip: "203.87.45.111", status: "failed", time: "32m ago" },
  { action: "API key regenerated", user: "sara@hotelsvendors.com", ip: "196.219.123.45", status: "success", time: "1h ago" },
  { action: "Authority override", user: "admin@hotelsvendors.com", ip: "196.219.123.12", status: "success", time: "2h ago" },
  { action: "Settings updated", user: "khaled@hotelsvendors.com", ip: "196.219.123.78", status: "success", time: "3h ago" },
];

const PERMISSION_MATRIX = [
  { role: "Platform Admin", users: 3, permissions: ["all", "all", "all", "all", "all", "all"] },
  { role: "Hotel Manager", users: 12, permissions: ["read", "read", "write", "read", "none", "read"] },
  { role: "Supplier Admin", users: 45, permissions: ["read", "write", "read", "none", "read", "read"] },
  { role: "Finance Officer", users: 8, permissions: ["read", "read", "read", "write", "read", "none"] },
  { role: "Logistics Coordinator", users: 6, permissions: ["read", "write", "none", "read", "write", "none"] },
  { role: "Viewer", users: 28, permissions: ["read", "read", "none", "none", "none", "read"] },
];

const PERMISSION_HEADERS = ["Orders", "Inventory", "Users", "Finance", "Shipping", "Reports"];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    success: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Success" },
    failed: { bg: "bg-red-500/10", text: "text-red-400", label: "Failed" },
    warning: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Warning" },
  };
  const c = config[status] || config.success;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function PermCell({ perm }: { perm: string }) {
  const colors: Record<string, string> = {
    all: "bg-[#022349]/10 text-[#022349]",
    write: "bg-blue-500/10 text-blue-400",
    read: "bg-white/10 text-white/40",
    none: "bg-red-500/10 text-red-400/50",
  };
  const labels: Record<string, string> = {
    all: "All",
    write: "Write",
    read: "Read",
    none: "—",
  };
  return (
    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${colors[perm] || colors.none}`}>
      {labels[perm] || perm}
    </span>
  );
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("overview");

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
        {SECURITY_STATS.map((s) => (
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
              activeTab === tab.id
                ? "bg-white/[0.06] text-white border border-white/[0.08]"
                : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {activeTab === "overview" && (
        <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Security Checklist */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Shield size={14} className="text-white/40" />
              Security Checklist
            </h3>
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
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    item.status === "enabled" ? "bg-emerald-500/10" : "bg-amber-500/10"
                  }`}>
                    {item.status === "enabled" ? (
                      <CheckCircle2 size={12} className="text-emerald-400" />
                    ) : (
                      <AlertTriangle size={12} className="text-amber-400" />
                    )}
                  </div>
                  <span className="text-xs text-white flex-1">{item.label}</span>
                  {item.critical && (
                    <span className="text-[9px] text-red-400/50 font-medium">Critical</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldAlert size={14} className="text-white/40" />
              Recent Alerts
            </h3>
            <div className="space-y-3">
              {[
                { level: "warning", msg: "Failed login attempt from IP 203.87.45.111", time: "32m ago" },
                { level: "info", msg: "API key regenerated by Sara Mohamed", time: "1h ago" },
                { level: "info", msg: "Authority Matrix override by Admin", time: "2h ago" },
                { level: "success", msg: "Weekly security scan completed", time: "5h ago" },
                { level: "info", msg: "New user registered: Laila Ibrahim", time: "8h ago" },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    alert.level === "warning" ? "bg-amber-400" :
                    alert.level === "success" ? "bg-emerald-400" :
                    "bg-blue-400"
                  }`} />
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
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText size={14} className="text-white/40" />
              Audit Log
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Action</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">IP Address</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOGS.map((log, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs text-white">{log.action}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/40">{log.user}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-mono text-white/30">{log.ip}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/30">{log.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {activeTab === "permissions" && (
        <motion.div variants={fadeInUp} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users size={14} className="text-white/40" />
              Role Permissions Matrix
            </h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Users</th>
                {PERMISSION_HEADERS.map((h) => (
                  <th key={h} className="text-center px-2 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_MATRIX.map((role, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-white">{role.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-white/60">{role.users}</span>
                  </td>
                  {role.permissions.map((perm, j) => (
                    <td key={j} className="px-2 py-3 text-center">
                      <PermCell perm={perm} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}
