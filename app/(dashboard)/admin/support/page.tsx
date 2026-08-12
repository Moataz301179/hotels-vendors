"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  LifeBuoy,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  X,
  User,
  Mail,
  Calendar,
  Bot,
  StickyNote,
  CheckCircle,
} from "lucide-react";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";

// ─── Types ───────────────────────────────────────────────

interface SupportTicket {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  agentResponse: string | null;
  adminNotes: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

interface TicketsResponse {
  tickets: SupportTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type StatusFilter = "ALL" | "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type PriorityFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// ─── Badge Components ────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { text: string; bg: string; dot: string }> = {
    OPEN: { text: "Open", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20", dot: "bg-blue-400" },
    IN_PROGRESS: { text: "In Progress", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
    RESOLVED: { text: "Resolved", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
    CLOSED: { text: "Closed", bg: "bg-gray-500/10 text-gray-400 border-gray-500/20", dot: "bg-gray-400" },
  };
  const c = config[status] || config.OPEN;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.text}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { text: string; bg: string }> = {
    URGENT: { text: "Urgent", bg: "bg-red-500/10 text-red-400 border-red-500/20" },
    HIGH: { text: "High", bg: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    MEDIUM: { text: "Medium", bg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    LOW: { text: "Low", bg: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  };
  const c = config[priority] || config.LOW;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${c.bg}`}>
      {c.text}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const config: Record<string, { text: string; bg: string }> = {
    BILLING: { text: "Billing", bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
    TECHNICAL: { text: "Technical", bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    ORDER: { text: "Order", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
    SUPPLIER: { text: "Supplier", bg: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
    FACTORING: { text: "Factoring", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    ETA: { text: "ETA", bg: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
    OTHER: { text: "Other", bg: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  };
  const c = config[category] || config.OTHER;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border ${c.bg}`}>
      {c.text}
    </span>
  );
}

// ─── Ticket Detail Drawer ────────────────────────────────

function TicketDetailDrawer({
  ticket,
  onClose,
  onResolved,
}: {
  ticket: SupportTicket;
  onClose: () => void;
  onResolved: () => void;
}) {
  const [resolution, setResolution] = useState("");
  const [adminNotes, setAdminNotes] = useState(ticket.adminNotes || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleResolve = async () => {
    if (resolution.trim().length < 5) {
      setSubmitError("Resolution must be at least 5 characters");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/v1/support/ticket/${ticket.id}/resolve`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution: resolution.trim(), adminNotes: adminNotes.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      onResolved();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to resolve ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-1 border border-border-subtle rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border-subtle">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CategoryBadge category={ticket.category} />
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
            <h2 className="text-lg font-semibold text-foreground truncate">{ticket.subject}</h2>
          </div>
          <button onClick={onClose} className="ml-3 p-1.5 rounded-lg hover:bg-white/5 text-foreground-muted">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* User info */}
          <div className="flex items-center gap-4 text-xs text-foreground-muted">
            <span className="flex items-center gap-1.5"><User size={14} /> {ticket.userName}</span>
            <span className="flex items-center gap-1.5"><Mail size={14} /> {ticket.userEmail}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-1.5">Description</h3>
            <p className="text-sm text-foreground-secondary bg-surface-2 rounded-lg p-3 border border-border-invisible whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* AI Agent Response */}
          {ticket.agentResponse && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-1.5 flex items-center gap-1.5">
                <Bot size={14} /> AI Agent Response
              </h3>
              <p className="text-sm text-foreground-secondary bg-purple-500/5 rounded-lg p-3 border border-purple-500/10 whitespace-pre-wrap">{ticket.agentResponse}</p>
            </div>
          )}

          {/* Resolution (if already resolved) */}
          {ticket.resolution && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Resolution
              </h3>
              <p className="text-sm text-emerald-400 bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10 whitespace-pre-wrap">{ticket.resolution}</p>
            </div>
          )}

          {/* Admin Notes (existing) */}
          {ticket.adminNotes && !ticket.resolution && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-1.5 flex items-center gap-1.5">
                <StickyNote size={14} /> Admin Notes
              </h3>
              <p className="text-sm text-foreground-secondary bg-surface-2 rounded-lg p-3 border border-border-invisible whitespace-pre-wrap">{ticket.adminNotes}</p>
            </div>
          )}

          {/* Resolve form (only if not resolved/closed) */}
          {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
            <div className="space-y-3 pt-2 border-t border-border-subtle">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-1.5 flex items-center gap-1.5">
                  <StickyNote size={14} /> Admin Notes (optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  placeholder="Internal diagnosis notes..."
                  className="w-full bg-surface-2 border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:border-accent-light"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-foreground-muted mb-1.5">
                  Resolution *
                </label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={3}
                  placeholder="Describe what was done to fix the issue..."
                  className="w-full bg-surface-2 border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:border-accent-light"
                />
              </div>
              {submitError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5"><AlertTriangle size={14} /> {submitError}</p>
              )}
              <button
                onClick={handleResolve}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-semibold hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
              >
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Resolve Ticket & Notify User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [total, setTotal] = useState(0);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (priorityFilter !== "ALL") params.set("priority", priorityFilter);
      params.set("limit", "100");
      const res = await fetch(`/api/v1/admin/support/tickets?${params.toString()}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      setTickets(json.data.tickets);
      setTotal(json.data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Summary stats
  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === "OPEN").length;
    const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
    const resolved = tickets.filter((t) => t.status === "RESOLVED").length;
    const urgent = tickets.filter((t) => t.priority === "URGENT" && t.status !== "RESOLVED" && t.status !== "CLOSED").length;
    return { open, inProgress, resolved, urgent, total };
  }, [tickets]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LifeBuoy size={24} className="text-accent-light" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Support Tickets</h1>
            <p className="text-xs text-foreground-muted">Manage and resolve customer support tickets</p>
          </div>
        </div>
        <button
          onClick={fetchTickets}
          className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 border border-border-subtle rounded-lg text-xs font-medium text-foreground-secondary hover:bg-surface-3 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Open", value: stats.open, icon: MessageSquare, color: "text-blue-400" },
          { label: "In Progress", value: stats.inProgress, icon: Clock, color: "text-amber-400" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Urgent", value: stats.urgent, icon: AlertTriangle, color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-1 border border-border-subtle rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-foreground-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <Filter size={14} />
          <span>Filter:</span>
        </div>
        <div className="flex items-center gap-1">
          {(["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                statusFilter === s
                  ? "bg-accent-muted text-accent-light border border-accent-light/30"
                  : "bg-surface-2 text-foreground-muted border border-border-subtle hover:bg-surface-3"
              }`}
            >
              {s === "ALL" ? "All Status" : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {(["ALL", "URGENT", "HIGH", "MEDIUM", "LOW"] as PriorityFilter[]).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                priorityFilter === p
                  ? "bg-accent-muted text-accent-light border border-accent-light/30"
                  : "bg-surface-2 text-foreground-muted border border-border-subtle hover:bg-surface-3"
              }`}
            >
              {p === "ALL" ? "All Priority" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      {loading ? (
        <LoadingTable rows={5} />
      ) : error ? (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertTriangle size={24} className="text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchTickets} className="mt-3 text-xs text-foreground-muted underline">Try again</button>
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState
          title="No support tickets"
          description="Tickets will appear here when users submit them."
          icon="inbox"
        />
      ) : (
        <div className="bg-surface-1 border border-border-subtle rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Subject</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-foreground-muted">User</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Priority</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="border-b border-border-invisible hover:bg-surface-2 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 text-foreground font-medium max-w-xs truncate">{ticket.subject}</td>
                  <td className="py-3 px-4 text-foreground-muted text-xs">{ticket.userName}</td>
                  <td className="py-3 px-4"><CategoryBadge category={ticket.category} /></td>
                  <td className="py-3 px-4"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="py-3 px-4"><StatusBadge status={ticket.status} /></td>
                  <td className="py-3 px-4 text-foreground-muted text-xs whitespace-nowrap">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedTicket && (
        <TicketDetailDrawer
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onResolved={() => {
            setSelectedTicket(null);
            fetchTickets();
          }}
        />
      )}
    </div>
  );
}
