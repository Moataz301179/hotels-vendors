"use client";

import { useState } from "react";
import { Users, Search, Filter, ChevronLeft, ChevronRight, Building2, Store, ShieldCheck, Clock, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/lib/hooks/use-api";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  platformRole: string;
  status: string;
  tenant: { id: string; name: string; slug: string } | null;
  assignedRole: { id: string; name: string } | null;
  hotel: { id: string; name: string } | null;
  supplier: { id: string; name: string } | null;
  lastActive: string | null;
  createdAt: string;
}

interface UsersData {
  users: UserRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  HOTEL: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SUPPLIER: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  FACTORING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  SHIPPING: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400",
  INACTIVE: "bg-surface-2 text-foreground-muted",
  SUSPENDED: "bg-red-500/10 text-red-400",
  PENDING: "bg-amber-500/10 text-amber-400",
};

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", "20");
  if (search) queryParams.set("search", search);
  if (roleFilter) queryParams.set("role", roleFilter);
  if (statusFilter) queryParams.set("status", statusFilter);

  const { data, loading, error } = useApi<UsersData>(`/api/v1/admin/users?${queryParams.toString()}`);

  const users = data?.users || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border-subtle">
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-base/15 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent-base" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-white">User Management</h1>
              <p className="text-[13px] text-foreground-muted">View, search, and manage all platform users</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-foreground-muted">
              {pagination?.total ?? 0} total users
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-5">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">{error}</div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full h-10 pl-10 pr-4 rounded-lg text-sm text-white placeholder:text-foreground-muted bg-surface-2 border border-border-subtle outline-none focus:border-accent-base/40 transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="h-10 px-3 rounded-lg text-sm text-foreground-secondary bg-surface-2 border border-border-subtle outline-none focus:border-accent-base/40"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="HOTEL">Hotel</option>
            <option value="SUPPLIER">Supplier</option>
            <option value="FACTORING">Factoring</option>
            <option value="SHIPPING">Shipping</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-10 px-3 rounded-lg text-sm text-foreground-secondary bg-surface-2 border border-border-subtle outline-none focus:border-accent-base/40"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl bg-surface-1 border border-border-subtle overflow-hidden">
          <div className="overflow-x-auto table-scroll-wrapper">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">User</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Tenant</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Entity</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-foreground-muted text-[13px]">Loading users...</td>
                  </tr>
                )}
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-foreground-muted text-[13px]">No users found</td>
                  </tr>
                )}
                {users.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-surface-1 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-base to-red-900 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                          {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-white">{user.name}</p>
                          <p className="text-[13px] text-foreground-muted flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${ROLE_COLORS[user.platformRole] || "bg-surface-2 text-foreground-muted border-border-subtle"}`}>
                        {user.platformRole === "HOTEL" && <Building2 className="w-3 h-3" />}
                        {user.platformRole === "SUPPLIER" && <Store className="w-3 h-3" />}
                        {user.platformRole === "ADMIN" && <ShieldCheck className="w-3 h-3" />}
                        {user.platformRole}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] text-foreground-secondary">{user.tenant?.name || "—"}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {user.hotel && <p className="text-[13px] text-foreground-secondary">{user.hotel.name}</p>}
                      {user.supplier && <p className="text-[13px] text-foreground-secondary">{user.supplier.name}</p>}
                      {!user.hotel && !user.supplier && <span className="text-[13px] text-foreground-muted">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${STATUS_COLORS[user.status] || "bg-surface-2 text-foreground-muted"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] text-foreground-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : "Never"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between">
              <span className="text-[11px] text-foreground-muted">
                Showing {(page - 1) * pagination.limit + 1} - {Math.min(page * pagination.limit, pagination.total)} of {pagination.total}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-white hover:bg-surface-2 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[12px] text-foreground-tertiary px-2">
                  {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  className="p-1.5 rounded-lg text-foreground-muted hover:text-white hover:bg-surface-2 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
