"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Building2,
  Package,
  Truck,
  Landmark,
  Mail,
  Phone,
  MapPin,
  Clock,
  X,
  Send,
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  Plus,
  Loader2,
  Calendar,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { useApi, usePost } from "@/lib/hooks/use-api";
import { calculateLeadScore, formatScoreColor } from "@/lib/crm/lead-scoring";

// --- Types ---

interface LeadRecord {
  id: string;
  entityType: "HOTEL" | "SUPPLIER" | "FACTOR" | "LOGISTICS";
  name: string;
  legalName: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  governorate: string | null;
  address: string | null;
  tier: string;
  starRating: number | null;
  roomCount: number | null;
  category: string | null;
  source: string;
  sourceUrl: string | null;
  discoveredBy: string;
  enrichment: string | null;
  trustSignals: string | null;
  status: string;
  priority: number;
  lastContactAt: string | null;
  contactCount: number;
  responseCount: number;
  convertedAt: string | null;
  convertedToId: string | null;
  createdAt: string;
  outreachLogs?: OutreachRecord[];
  _count?: { outreachLogs: number };
}

interface OutreachRecord {
  id: string;
  channel: string;
  messageType: string;
  subject: string | null;
  body: string | null;
  leadId: string | null;
  leadName: string | null;
  recipientEmail: string | null;
  recipientPhone: string | null;
  sentByAgent: string;
  agentName: string;
  createdAt: string;
}

interface LeadsResponse {
  leads: LeadRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface LeadDetailResponse extends LeadRecord {
  outreachLogs: OutreachRecord[];
}

// --- Constants ---

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  DISCOVERED: {
    label: "Discovered",
    color: "bg-white/5 text-white/50 border-white/10",
    dot: "bg-white/30",
  },
  ENRICHED: {
    label: "Enriched",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400",
  },
  CONTACTED: {
    label: "Contacted",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  RESPONDED: {
    label: "Responded",
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    dot: "bg-cyan-400",
  },
  QUALIFIED: {
    label: "Qualified",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    dot: "bg-green-400",
  },
  MEETING_SCHEDULED: {
    label: "Meeting",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    dot: "bg-purple-400",
  },
  PROPOSAL_SENT: {
    label: "Proposal",
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    dot: "bg-pink-400",
  },
  NEGOTIATING: {
    label: "Negotiating",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    dot: "bg-orange-400",
  },
  CONVERTED: {
    label: "Converted",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  LOST: {
    label: "Lost",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
  PAUSED: {
    label: "Paused",
    color: "bg-white/5 text-white/30 border-white/8",
    dot: "bg-white/20",
  },
};

const ENTITY_ICONS: Record<string, React.ElementType> = {
  HOTEL: Building2,
  SUPPLIER: Package,
  FACTOR: Landmark,
  LOGISTICS: Truck,
};

const ENTITY_COLORS: Record<string, string> = {
  HOTEL: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  SUPPLIER: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  FACTOR: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  LOGISTICS: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  EMAIL: Mail,
  PHONE: Phone,
  MEETING: Calendar,
  LINKEDIN: ExternalLink,
  WHATSAPP: MessageSquare,
  OTHER: Send,
};

const ALL_STATUSES = [
  "DISCOVERED",
  "ENRICHED",
  "CONTACTED",
  "RESPONDED",
  "QUALIFIED",
  "MEETING_SCHEDULED",
  "PROPOSAL_SENT",
  "NEGOTIATING",
  "CONVERTED",
  "LOST",
  "PAUSED",
];

const OUTREACH_CHANNELS = ["EMAIL", "PHONE", "MEETING", "LINKEDIN", "WHATSAPP", "OTHER"];
const OUTREACH_TYPES = ["COLD", "FOLLOW_UP", "DEMO", "PROPOSAL", "CHECK_IN", "REMARKETING", "OTHER"];

// --- Components ---

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DISCOVERED;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${config.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = formatScoreColor(score);
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded-lg text-[11px] font-bold ${color}`}
    >
      {score}
    </span>
  );
}

function PriorityBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? "text-red-400 bg-red-500/10"
      : score >= 5
        ? "text-amber-400 bg-amber-500/10"
        : "text-white/30 bg-white/5";
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded-lg text-[11px] font-bold ${color}`}
    >
      P{score}
    </span>
  );
}

function StatsCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent || "bg-accent-base/15"}`}
      >
        <Icon className="w-4 h-4 text-accent-base" />
      </div>
      <div>
        <p className="text-[20px] font-bold text-white leading-tight">
          {value}
        </p>
        <p className="text-[11px] text-white/40 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
}

function SlideOver({
  lead,
  onClose,
  onRefresh,
}: {
  lead: LeadDetailResponse;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [outreachForm, setOutreachForm] = useState({
    channel: "EMAIL",
    messageType: "FOLLOW_UP",
    subject: "",
    body: "",
    recipientEmail: "",
    recipientPhone: "",
  });
  const [showOutreach, setShowOutreach] = useState(false);

  const {
    post: logOutreach,
    loading: outreachLoading,
  } = usePost(`/api/v1/crm/leads/${lead.id}/outreach`);

  const score = calculateLeadScore(lead);

  const handleLogOutreach = async () => {
    const payload: Record<string, string> = {
      channel: outreachForm.channel,
      messageType: outreachForm.messageType,
    };
    if (outreachForm.subject) payload.subject = outreachForm.subject;
    if (outreachForm.body) payload.body = outreachForm.body;
    if (outreachForm.recipientEmail) payload.recipientEmail = outreachForm.recipientEmail;
    if (outreachForm.recipientPhone) payload.recipientPhone = outreachForm.recipientPhone;

    try {
      await logOutreach(payload);
      setShowOutreach(false);
      setOutreachForm({
        channel: "EMAIL",
        messageType: "FOLLOW_UP",
        subject: "",
        body: "",
        recipientEmail: "",
        recipientPhone: "",
      });
      onRefresh();
    } catch {
      // error handled by usePost
    }
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-[#0f0f0f] border-l border-white/[0.06] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 bg-[#0f0f0f] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-white">Lead Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Header */}
          <div className="flex items-start gap-3">
            {(() => {
              const Icon = ENTITY_ICONS[lead.entityType] || Building2;
              return (
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${ENTITY_COLORS[lead.entityType]}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              );
            })()}
            <div className="flex-1 min-w-0">
              <h3 className="text-[17px] font-bold text-white truncate">
                {lead.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <StatusBadge status={lead.status} />
                <PriorityBadge score={lead.priority} />
                <ScoreBadge score={score} />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Type", value: lead.entityType },
              { label: "City", value: lead.city || "—" },
              { label: "Governorate", value: lead.governorate || "—" },
              { label: "Tier", value: lead.tier },
              { label: "Star Rating", value: lead.starRating ? `${lead.starRating}★` : "—" },
              { label: "Room Count", value: lead.roomCount?.toLocaleString() || "—" },
              { label: "Source", value: lead.source },
              { label: "Category", value: lead.category || "—" },
              { label: "Email", value: lead.email || "—" },
              { label: "Phone", value: lead.phone || "—" },
              { label: "Website", value: lead.website || "—" },
              {
                label: "Last Contact",
                value: lead.lastContactAt
                  ? new Date(lead.lastContactAt).toLocaleDateString()
                  : "Never",
              },
              { label: "Contacts", value: String(lead.contactCount) },
              { label: "Responses", value: String(lead.responseCount) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
                  {label}
                </p>
                <p className="text-[13px] text-white/70 truncate">{value}</p>
              </div>
            ))}
          </div>

          {lead.enrichment && (
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                Enrichment Notes
              </p>
              <p className="text-[13px] text-white/60 whitespace-pre-wrap">
                {lead.enrichment}
              </p>
            </div>
          )}

          {/* Outreach History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[13px] font-semibold text-white/70">
                Outreach History
              </h4>
              <button
                onClick={() => setShowOutreach(!showOutreach)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-accent-base/15 text-accent-base border border-accent-base/25 hover:bg-accent-base/25 transition-colors"
              >
                <Send className="w-3 h-3" />
                Log Outreach
              </button>
            </div>

            <AnimatePresence>
              {showOutreach && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-3"
                >
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={outreachForm.channel}
                        onChange={(e) =>
                          setOutreachForm({ ...outreachForm, channel: e.target.value })
                        }
                        className="h-8 px-2 rounded-lg text-[12px] text-white/70 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40"
                      >
                        {OUTREACH_CHANNELS.map((ch) => (
                          <option key={ch} value={ch}>
                            {ch}
                          </option>
                        ))}
                      </select>
                      <select
                        value={outreachForm.messageType}
                        onChange={(e) =>
                          setOutreachForm({
                            ...outreachForm,
                            messageType: e.target.value,
                          })
                        }
                        className="h-8 px-2 rounded-lg text-[12px] text-white/70 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40"
                      >
                        {OUTREACH_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Subject"
                      value={outreachForm.subject}
                      onChange={(e) =>
                        setOutreachForm({
                          ...outreachForm,
                          subject: e.target.value,
                        })
                      }
                      className="w-full h-8 px-3 rounded-lg text-[12px] text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40"
                    />
                    <textarea
                      placeholder="Message body..."
                      rows={3}
                      value={outreachForm.body}
                      onChange={(e) =>
                        setOutreachForm({ ...outreachForm, body: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg text-[12px] text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40 resize-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        placeholder="Recipient email"
                        value={outreachForm.recipientEmail}
                        onChange={(e) =>
                          setOutreachForm({
                            ...outreachForm,
                            recipientEmail: e.target.value,
                          })
                        }
                        className="h-8 px-3 rounded-lg text-[12px] text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40"
                      />
                      <input
                        type="tel"
                        placeholder="Recipient phone"
                        value={outreachForm.recipientPhone}
                        onChange={(e) =>
                          setOutreachForm({
                            ...outreachForm,
                            recipientPhone: e.target.value,
                          })
                        }
                        className="h-8 px-3 rounded-lg text-[12px] text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40"
                      />
                    </div>
                    <button
                      onClick={handleLogOutreach}
                      disabled={outreachLoading}
                      className="w-full h-8 rounded-lg bg-accent-base hover:bg-[#b91c1c] text-white text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {outreachLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Send className="w-3 h-3" />
                      )}
                      Log Outreach
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {(lead.outreachLogs ?? []).length === 0 && (
                <p className="text-[12px] text-white/20 py-4 text-center">
                  No outreach logged yet
                </p>
              )}
              {(lead.outreachLogs ?? []).map((log) => {
                const ChIcon = CHANNEL_ICONS[log.channel] || Send;
                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <ChIcon className="w-3 h-3 text-white/30" />
                        <span className="text-[11px] font-medium text-white/60">
                          {log.channel} · {log.messageType}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/20">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {log.subject && (
                      <p className="text-[12px] text-white/50 mb-0.5">
                        {log.subject}
                      </p>
                    )}
                    {log.body && (
                      <p className="text-[11px] text-white/30 line-clamp-2">
                        {log.body}
                      </p>
                    )}
                    <p className="text-[10px] text-white/20 mt-1">
                      by {log.agentName}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Main Page ---

export default function AdminCrmPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadDetailResponse | null>(
    null
  );

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "20");
  if (search) params.set("search", search);
  if (typeFilter) params.set("entityType", typeFilter);
  if (statusFilter) params.set("status", statusFilter);
  if (cityFilter) params.set("city", cityFilter);
  if (priorityFilter) params.set("priority", priorityFilter);

  const {
    data,
    loading,
    error: fetchError,
    refetch,
  } = useApi<LeadsResponse>(`/api/v1/crm/leads?${params.toString()}`);

  const leads = data?.leads ?? [];
  const pagination = data?.pagination;

  const stats = useMemo(() => {
    const total = pagination?.total ?? 0;
    const byStatus: Record<string, number> = {};
    leads.forEach((l) => {
      byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    });

    const converted =
      leads.filter((l) => l.status === "CONVERTED").length;
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : "0";

    const contacted = leads.filter((l) => l.lastContactAt);
    const avgResponse =
      contacted.length > 0
        ? (
            contacted.reduce((sum, l) => {
              const created = new Date(l.createdAt).getTime();
              const contacted = new Date(l.lastContactAt!).getTime();
              return sum + (contacted - created);
            }, 0) /
            contacted.length /
            86400000
          ).toFixed(1)
        : "—";

    return { total, byStatus, conversionRate, avgResponse };
  }, [leads, pagination]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/[0.06]">
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-base/15 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-accent-base" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-white">
                CRM Pipeline
              </h1>
              <p className="text-[13px] text-white/40">
                Lead management and outreach tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-white/40">
              {pagination?.total ?? 0} total leads
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-5">
        {fetchError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
            {fetchError}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatsCard
            label="Total Leads"
            value={stats.total}
            icon={Users}
          />
          <StatsCard
            label="Converted"
            value={
              leads.filter((l) => l.status === "CONVERTED").length
            }
            icon={TrendingUp}
            accent="bg-emerald-500/15"
          />
          <StatsCard
            label="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={BarChart3}
            accent="bg-blue-500/15"
          />
          <StatsCard
            label="Avg Response (days)"
            value={stats.avgResponse}
            icon={Clock}
            accent="bg-amber-500/15"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 pl-10 pr-4 rounded-lg text-sm text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40 transition-all"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-lg text-sm text-white/60 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40"
          >
            <option value="">All Types</option>
            <option value="HOTEL">Hotels</option>
            <option value="SUPPLIER">Suppliers</option>
            <option value="FACTOR">Factors</option>
            <option value="LOGISTICS">Logistics</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-lg text-sm text-white/60 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40"
          >
            <option value="">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s]?.label || s}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="City"
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-lg text-sm text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40 w-32"
          />
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-lg text-sm text-white/60 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-accent-base/40"
          >
            <option value="">All Priority</option>
            <option value="10">P10 (Critical)</option>
            <option value="8">P8+</option>
            <option value="5">P5+</option>
            <option value="3">P3+</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto table-scroll-wrapper">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                    Last Contact
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-white/30 text-[13px]"
                    >
                      Loading leads...
                    </td>
                  </tr>
                )}
                {!loading && leads.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-white/30 text-[13px]"
                    >
                      No leads found
                    </td>
                  </tr>
                )}
                {leads.map((lead, i) => {
                  const Icon = ENTITY_ICONS[lead.entityType] || Building2;
                  const score = calculateLeadScore(lead);
                  return (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() =>
                        setSelectedLead(lead as LeadDetailResponse)
                      }
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ENTITY_COLORS[lead.entityType]}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-white truncate max-w-[200px]">
                              {lead.name}
                            </p>
                            <p className="text-[12px] text-white/30 flex items-center gap-1">
                              {lead.email && (
                                <>
                                  <Mail className="w-3 h-3" /> {lead.email}
                                </>
                              )}
                              {!lead.email && lead.phone && (
                                <>
                                  <Phone className="w-3 h-3" /> {lead.phone}
                                </>
                              )}
                              {!lead.email && !lead.phone && (
                                <span className="text-white/15">No contact</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${ENTITY_COLORS[lead.entityType]}`}
                        >
                          {lead.entityType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[13px] text-white/50 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-white/20" />
                          {lead.city || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <PriorityBadge score={lead.priority} />
                      </td>
                      <td className="px-5 py-3.5">
                        <ScoreBadge score={score} />
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] text-white/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lead.lastContactAt
                            ? new Date(lead.lastContactAt).toLocaleDateString()
                            : "Never"}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-white/30">
                Showing {(page - 1) * pagination.limit + 1} -{" "}
                {Math.min(page * pagination.limit, pagination.total)} of{" "}
                {pagination.total}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[12px] text-white/50 px-2">
                  {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page >= pagination.totalPages}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over */}
      <AnimatePresence>
        {selectedLead && (
          <SlideOver
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onRefresh={() => {
              refetch();
              setSelectedLead(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
