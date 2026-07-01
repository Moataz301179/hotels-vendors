"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mail,
  UserCog,
  Shield,
  Trash2,
  X,
  Loader2,
  ChevronDown,
  AlertTriangle,
  Send,
  UserPlus,
  Clock,
  CheckCircle2,
  Ban,
} from "lucide-react";
import Link from "next/link";

interface AssignedRole {
  id: string;
  name: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  lastActive: string | null;
  createdAt: string;
  assignedRole: AssignedRole | null;
}

interface TenantInfo {
  name: string;
  maxUsers: number;
  seatCount: number;
  totalUsers: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Remove confirmation
  const [removingUser, setRemovingUser] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  // Edit role
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [roleOptions, setRoleOptions] = useState<AssignedRole[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/auth/users");
      const json = await res.json();
      if (json.success) {
        setUsers(json.data.users);
        setTenant(json.data.tenant);
        setRoleOptions(json.data.roles || []);
      } else {
        setError(json.error || "Failed to load users");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInvite = async () => {
    setInviteError(null);
    setInviting(true);

    try {
      const res = await fetch("/api/v1/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const json = await res.json();

      if (json.success) {
        setInviteSuccess(true);
        setInviteEmail("");
        setTimeout(() => {
          setShowInviteModal(false);
          setInviteSuccess(false);
        }, 2000);
      } else {
        setInviteError(json.error || "Failed to send invite");
      }
    } catch {
      setInviteError("Network error");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (userId: string) => {
    setRemoving(true);
    try {
      const res = await fetch("/api/v1/auth/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const json = await res.json();

      if (json.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch {
      // silently fail
    } finally {
      setRemoving(false);
      setRemovingUser(null);
    }
  };

  const handleRoleChange = async (userId: string, roleId: string) => {
    try {
      const res = await fetch("/api/v1/auth/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roleId }),
      });
      const json = await res.json();

      if (json.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, assignedRole: roleOptions.find((r) => r.id === roleId) || u.assignedRole }
              : u
          )
        );
      }
    } catch {
      // silently fail
    } finally {
      setEditingRole(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "var(--success)", border: "1px solid rgba(16, 185, 129, 0.2)" };
      case "INVITED":
        return { bg: "rgba(245, 158, 11, 0.1)", color: "var(--accent-base)", border: "1px solid rgba(245, 158, 11, 0.2)" };
      default:
        return { bg: "rgba(100, 116, 139, 0.1)", color: "var(--text-muted)", border: "1px solid rgba(100, 116, 139, 0.2)" };
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--accent-base)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle size={32} style={{ color: "var(--error)" }} />
        <p style={{ color: "var(--text-secondary)" }}>{error}</p>
        <button
          onClick={fetchUsers}
          className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
          style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Manage Team
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              {tenant?.name || "Your organization"}
            </p>
          </div>
          <button
            onClick={() => {
              setInviteSuccess(false);
              setInviteError(null);
              setInviteEmail("");
              setShowInviteModal(true);
            }}
            disabled={tenant ? tenant.totalUsers >= tenant.maxUsers : false}
            className="cta-glow flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
            style={{
              backgroundColor: "var(--accent-base)",
              color: "var(--accent-text)",
              opacity: tenant && tenant.totalUsers >= tenant.maxUsers ? 0.5 : 1,
              cursor: tenant && tenant.totalUsers >= tenant.maxUsers ? "not-allowed" : "pointer",
            }}
          >
            <UserPlus size={16} />
            Invite User
          </button>
        </div>

        {/* Seat usage */}
        <div
          className="mt-4 rounded-xl p-4"
          style={{ backgroundColor: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--text-secondary)" }}>
              <Users size={14} className="inline mr-2" />
              Seat usage
            </span>
            <span style={{ color: "var(--text-primary)" }}>
              {tenant?.totalUsers || 0} of {tenant?.maxUsers || 0} users
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg-surface-2)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(((tenant?.totalUsers || 0) / (tenant?.maxUsers || 1)) * 100, 100)}%`,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--accent-base)" }}
            />
          </div>
        </div>
      </div>

      {/* Users list */}
      <div
        className="overflow-hidden rounded-xl"
        style={{ backgroundColor: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  User
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Role
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Status
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Last Active
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                          style={{ backgroundColor: "var(--accent-muted)", color: "var(--accent-base)" }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {user.name}
                          </p>
                          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {editingRole === user.id ? (
                        <select
                          value={user.assignedRole?.id || ""}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          autoFocus
                          className="rounded-md px-2.5 py-1.5 text-xs font-medium"
                          style={{
                            backgroundColor: "var(--bg-surface-2)",
                            border: "1px solid var(--border-visible)",
                            color: "var(--text-primary)",
                            outline: "none",
                          }}
                          onBlur={() => setEditingRole(null)}
                        >
                          {roleOptions.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingRole(user.id)}
                          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
                          style={{
                            backgroundColor: "var(--bg-surface-2)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {user.assignedRole?.name || user.role}
                          <ChevronDown size={12} />
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={getStatusStyle(user.status)}
                      >
                        {user.status === "ACTIVE" ? (
                          <CheckCircle2 size={12} />
                        ) : user.status === "INVITED" ? (
                          <Clock size={12} />
                        ) : (
                          <Ban size={12} />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--text-tertiary)" }}>
                      {formatDate(user.lastActive)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setRemovingUser(user.id)}
                        className="rounded-lg p-2 transition-colors hover:bg-red-500/10"
                        style={{ color: "var(--text-muted)" }}
                        title="Remove user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Users size={40} style={{ color: "var(--text-muted)" }} />
            <p className="mt-3 text-sm" style={{ color: "var(--text-tertiary)" }}>
              No users yet
            </p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowInviteModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md rounded-xl p-6 shadow-2xl"
              style={{
                backgroundColor: "var(--bg-surface-1)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  Invite Team Member
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-lg p-1.5 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={18} />
                </button>
              </div>

              {inviteSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-6 text-center"
                >
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.15)" }}
                  >
                    <Send size={20} style={{ color: "var(--success)" }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Invitation sent!
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    They will receive an email to join your organization
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                        Email address
                      </label>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2"
                          style={{ color: "var(--text-muted)" }}
                        />
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="colleague@company.com"
                          className="w-full rounded-lg py-2.5 pl-10 pr-4 text-sm"
                          style={{
                            backgroundColor: "var(--bg-surface-2)",
                            border: "1px solid var(--border-subtle)",
                            color: "var(--text-primary)",
                            outline: "none",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "var(--accent-base)")}
                          onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
                        />
                      </div>
                    </div>

                    {inviteError && (
                      <div
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
                        style={{
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          color: "var(--error)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                        }}
                      >
                        <AlertTriangle size={14} />
                        {inviteError}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setShowInviteModal(false)}
                      className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleInvite}
                      disabled={inviting || !inviteEmail.trim()}
                      className="cta-glow flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: inviteEmail.trim() ? "var(--accent-base)" : "var(--bg-surface-2)",
                        color: inviteEmail.trim() ? "var(--accent-text)" : "var(--text-muted)",
                        cursor: inviteEmail.trim() && !inviting ? "pointer" : "not-allowed",
                      }}
                    >
                      {inviting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Invite
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Remove confirmation modal */}
      <AnimatePresence>
        {removingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setRemovingUser(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm rounded-xl p-6 shadow-2xl"
              style={{
                backgroundColor: "var(--bg-surface-1)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(239, 68, 68, 0.15)" }}
                >
                  <AlertTriangle size={20} style={{ color: "var(--error)" }} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  Remove user?
                </h3>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  This will permanently remove this user from your organization.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setRemovingUser(null)}
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemove(removingUser)}
                  disabled={removing}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all"
                  style={{
                    backgroundColor: removing ? "var(--bg-surface-2)" : "var(--error)",
                    cursor: removing ? "not-allowed" : "pointer",
                  }}
                >
                  {removing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Remove
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
