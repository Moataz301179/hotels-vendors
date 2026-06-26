"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Megaphone,
  Calendar,
  BarChart3,
  Users,
  Plus,
  Rocket,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Eye,
  Play,
  Pause,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: string;
  platforms: string[];
  startDate: string;
  endDate: string | null;
  totalPosts: number;
  publishedPosts: number;
}

interface QueueStatus {
  overdue: number;
  scheduled: number;
  draft: number;
  publishedToday: number;
  failed: number;
}

interface WaitingListStats {
  total: number;
  byRole: Record<string, number>;
  byStatus: Record<string, number>;
}

export default function SocialAdminPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [queue, setQueue] = useState<QueueStatus | null>(null);
  const [waitingList, setWaitingList] = useState<WaitingListStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [campaignsRes, queueRes, waitingRes] = await Promise.all([
          fetch("/api/v1/social/campaigns"),
          fetch("/api/v1/social/queue"),
          fetch("/api/v1/waiting-list"),
        ]);

        if (campaignsRes.ok) {
          const data = await campaignsRes.json();
          setCampaigns(data.campaigns || []);
        }
        if (queueRes.ok) {
          const data = await queueRes.json();
          setQueue(data.queue);
        }
        if (waitingRes.ok) {
          const data = await waitingRes.json();
          const byRole: Record<string, number> = {};
          const byStatus: Record<string, number> = {};
          data.counts?.forEach((c: any) => {
            byRole[c.role] = (byRole[c.role] || 0) + c._count.id;
            byStatus[c.status] = (byStatus[c.status] || 0) + c._count.id;
          });
          setWaitingList({
            total: data.total || 0,
            byRole,
            byStatus,
          });
        }
      } catch (err) {
        console.error("Failed to load social admin data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function processQueue() {
    try {
      const res = await fetch("/api/v1/social/queue", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        alert(`Queue processed: ${data.processed} posts published`);
        // Refresh queue status
        const queueRes = await fetch("/api/v1/social/queue");
        if (queueRes.ok) {
          const q = await queueRes.json();
          setQueue(q.queue);
        }
      }
    } catch (err) {
      console.error("Failed to process queue:", err);
    }
  }

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    SCHEDULED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    ACTIVE: "bg-green-500/10 text-green-400 border-green-500/20",
    PAUSED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    COMPLETED: "bg-accent-base/10 text-accent-base border-accent-base/20",
    CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">Social Media Command Center</h1>
            <p className="text-white/40 text-[14px] mt-1">
              Campaign management, post scheduling, and beta launch orchestration
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={processQueue}
              className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium bg-accent-base hover:bg-[#7A0000] rounded-lg transition-colors"
            >
              <Rocket className="w-4 h-4" />
              Process Queue
            </button>
            <Link
              href="/admin/social/campaigns/new"
              className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Beta Waiting List"
            value={waitingList?.total || 0}
            subtext={`Hotels: ${waitingList?.byRole?.HOTEL || 0} · Suppliers: ${waitingList?.byRole?.SUPPLIER || 0}`}
            color="var(--accent-base)"
          />
          <StatCard
            icon={Megaphone}
            label="Active Campaigns"
            value={campaigns.filter((c) => c.status === "ACTIVE" || c.status === "SCHEDULED").length}
            subtext={`${campaigns.length} total campaigns`}
            color="#1877F2"
          />
          <StatCard
            icon={Calendar}
            label="Scheduled Posts"
            value={queue?.scheduled || 0}
            subtext={`${queue?.overdue || 0} overdue · ${queue?.draft || 0} drafts`}
            color="#E4405F"
          />
          <StatCard
            icon={CheckCircle2}
            label="Published Today"
            value={queue?.publishedToday || 0}
            subtext={`${queue?.failed || 0} failed`}
            color="#10B981"
          />
        </div>

        {/* Campaigns Table */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-semibold">Campaigns</h2>
            <span className="text-[12px] text-white/30">{campaigns.length} total</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-white/30">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 border border-white/[0.06] rounded-xl bg-white/[0.02]">
              <Megaphone className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-[14px]">No campaigns yet</p>
              <p className="text-white/20 text-[12px] mt-1">Create your first social media campaign</p>
            </div>
          ) : (
            <div className="border border-white/[0.06] rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-4 py-3 text-[11px] font-medium text-white/40 uppercase tracking-wider">Campaign</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-white/40 uppercase tracking-wider">Objective</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-white/40 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-white/40 uppercase tracking-wider">Platforms</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-white/40 uppercase tracking-wider">Posts</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-white/40 uppercase tracking-wider">Timeline</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-white/40 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[13px]">{c.name}</div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-white/50">{c.objective}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusColors[c.status] || statusColors.DRAFT}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {c.platforms.map((p) => (
                            <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/40 border border-white/[0.06]">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-white/50">
                        {c.publishedPosts}/{c.totalPosts}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-white/50">
                        {new Date(c.startDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                        {c.endDate && (
                          <> — {new Date(c.endDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}</>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/social/campaigns/${c.id}`}
                            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Queue & Waiting List Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Publishing Queue */}
          <section className="border border-white/[0.06] rounded-xl p-6 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-accent-base" />
              <h2 className="text-[16px] font-semibold">Publishing Queue</h2>
            </div>
            {queue ? (
              <div className="space-y-3">
                <QueueRow label="Overdue" value={queue.overdue} color="text-red-400" />
                <QueueRow label="Scheduled" value={queue.scheduled} color="text-blue-400" />
                <QueueRow label="Draft" value={queue.draft} color="text-white/40" />
                <QueueRow label="Published Today" value={queue.publishedToday} color="text-green-400" />
                <QueueRow label="Failed" value={queue.failed} color="text-orange-400" />
              </div>
            ) : (
              <div className="text-white/30 text-[13px]">Loading queue...</div>
            )}
          </section>

          {/* Waiting List Breakdown */}
          <section className="border border-white/[0.06] rounded-xl p-6 bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-accent-base" />
              <h2 className="text-[16px] font-semibold">Beta Waiting List</h2>
            </div>
            {waitingList ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(waitingList.byRole).map(([role, count]) => (
                    <div key={role} className="text-center p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-[20px] font-bold text-white">{count}</div>
                      <div className="text-[11px] text-white/40 mt-1">{role.toLowerCase()}s</div>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-white/40">Pending invites</span>
                    <span className="text-white/60 font-medium">
                      {waitingList.byStatus?.PENDING || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[12px] mt-2">
                    <span className="text-white/40">Converted</span>
                    <span className="text-green-400 font-medium">
                      {waitingList.byStatus?.CONVERTED || 0}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white/30 text-[13px]">Loading waiting list...</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  subtext: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5" style={{ color }} />
        <TrendingUp className="w-3.5 h-3.5 text-white/20" />
      </div>
      <div className="text-[28px] font-bold tracking-tight">{value}</div>
      <div className="text-[12px] text-white/40 mt-1">{label}</div>
      <div className="text-[11px] text-white/25 mt-1">{subtext}</div>
    </motion.div>
  );
}

function QueueRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-white/50">{label}</span>
      <span className={`text-[13px] font-semibold ${color}`}>{value}</span>
    </div>
  );
}
