"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Mail,
  Shield,
  Clock,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Modal } from "@/components/ui/modal";

interface SupplierUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string | null;
  createdAt: string;
}

interface UsersData {
  users: SupplierUser[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const ROLE_COLORS: Record<string, string> = {
  SUPPLIER_ADMIN: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  SUPPLIER_MANAGER: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  SUPPLIER_STAFF: "bg-surface-raised text-foreground-tertiary border-subtle10",
};

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function SupplierUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("SUPPLIER_STAFF");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", "20");
  if (search) queryParams.set("search", search);

  const { data, loading, error, refetch } = useApi<UsersData>(`/api/v1/supplier/users?${queryParams.toString()}`);

  const users = data?.users || [];
  const pagination = data?.pagination;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError("");
    setInviteSuccess("");
    try {
      const res = await fetch("/api/v1/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, type: "SUPPLIER_USER", role: inviteRole }),
      });
      const json = await res.json();
      if (json.success) {
        setInviteSuccess(`Invitation sent to ${inviteEmail}`);
        setInviteEmail("");
        refetch();
      } else {
        setInviteError(json.error || "Failed to send invite");
      }
    } catch {
      setInviteError("Network error");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Team Members</h1>
            <p className="text-sm text-foreground-tertiary mt-0.5">Manage users who can access your supplier account</p>
          </div>
        </div>
        <button
          onClick={() => { setInviteModalOpen(true); setInviteError(""); setInviteSuccess(""); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs text-foreground font-medium transition-all"
        >
          <UserPlus size={14} /> Invite Member
        </button>
      </motion.div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">{error}</div>}

      <motion.div variants={fadeInUp} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-10 pr-4 rounded-lg text-sm text-foreground placeholder:text-foreground-muted bg-surface-raised border border-subtle outline-none focus:border-emerald-500/40 transition-all"
          />
        </div>
        <span className="text-xs text-foreground-muted">{pagination?.total ?? 0} members</span>
      </motion.div>

      <motion.div variants={fadeInUp}>
        {loading ? (
          <LoadingTable rows={6} />
        ) : users.length === 0 ? (
          <EmptyState title="No team members" description="Invite users to help manage your products and orders." action={
            <button onClick={() => setInviteModalOpen(true)} className="px-4 py-2 rounded-lg bg-emerald-500 text-xs text-foreground font-medium">Invite Member</button>
          } />
        ) : (
          <div className="rounded-xl bg-[#0f0f0f] border border-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-subtle">
                    <th className="px-5 py-3 text-[11px] font-semibold text-foreground-tertiary uppercase tracking-wider">User</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-foreground-tertiary uppercase tracking-wider">Role</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-foreground-tertiary uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-foreground-tertiary uppercase tracking-wider">Last Active</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-foreground-tertiary uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {users.map((user, i) => (
                    <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-surface-raised transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-[#065F46] flex items-center justify-center text-foreground text-[10px] font-bold flex-shrink-0">
                            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-foreground">{user.name}</p>
                            <p className="text-[11px] text-foreground-muted flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${ROLE_COLORS[user.role] || "bg-surface-raised text-foreground-tertiary border-subtle10"}`}>
                          <Shield className="w-3 h-3" />{user.role.replace("SUPPLIER_", "")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${user.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400" : "bg-surface-raised text-foreground-tertiary"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === "ACTIVE" ? "bg-emerald-400" : "bg-foreground-muted"}`} />{user.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] text-foreground-muted flex items-center gap-1"><Clock className="w-3 h-3" />{user.lastActive ? new Date(user.lastActive).toLocaleDateString() : "Never"}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] text-foreground-muted">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="px-5 py-3 border-t border-subtle flex items-center justify-between">
                <span className="text-[11px] text-foreground-muted">Showing {(page - 1) * pagination.limit + 1} &ndash; {Math.min(page * pagination.limit, pagination.total)} of {pagination.total}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 rounded-lg text-foreground-tertiary hover:text-foreground hover:bg-surface-raised disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-[12px] text-foreground-muted px-2">{page} / {pagination.totalPages}</span>
                  <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages} className="p-1.5 rounded-lg text-foreground-tertiary hover:text-foreground hover:bg-surface-raised disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <Modal isOpen={inviteModalOpen} onClose={() => setInviteModalOpen(false)} title="Invite Team Member" description="Send an invite to join your supplier team" size="sm">
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="text-xs text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Email Address</label>
            <input type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@supplier.com" className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-emerald-500/50" />
          </div>
          <div>
            <label className="text-xs text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Role</label>
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground focus:outline-none">
              <option value="SUPPLIER_ADMIN" className="bg-[var(--background)]">Admin</option>
              <option value="SUPPLIER_MANAGER" className="bg-[var(--background)]">Manager</option>
              <option value="SUPPLIER_STAFF" className="bg-[var(--background)]">Staff</option>
            </select>
          </div>
          {inviteError && <p className="text-xs text-red-400">{inviteError}</p>}
          {inviteSuccess && <p className="text-xs text-emerald-400">{inviteSuccess}</p>}
          <button type="submit" disabled={inviteLoading} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-xs text-foreground font-medium transition-all">
            {inviteLoading ? "Sending..." : "Send Invitation"}
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
