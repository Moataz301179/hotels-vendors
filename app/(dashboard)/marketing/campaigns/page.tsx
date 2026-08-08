"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  MousePointerClick,
  Target,
  DollarSign,
  Plus,
  AtSign,
  ThumbsUp,
  Network,
  MessageSquare,
  Megaphone,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

type Platform = "instagram" | "facebook" | "linkedin" | "google" | "whatsapp";
type CampaignStatus = "active" | "paused" | "completed" | "draft";

interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  status: CampaignStatus;
  budget: number;
  reach: number;
  spend: number;
  impressions: number;
  clicks: number;
}

interface Stats {
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
}

const PLATFORM_META: Record<Platform, { label: string; icon: typeof AtSign; color: string }> = {
  instagram: { label: "Instagram", icon: AtSign, color: "text-pink-600" },
  facebook: { label: "Facebook", icon: ThumbsUp, color: "text-blue-600" },
  linkedin: { label: "LinkedIn", icon: Network, color: "text-sky-700" },
  google: { label: "Google Ads", icon: Target, color: "text-amber-600" },
  whatsapp: { label: "WhatsApp", icon: MessageSquare, color: "text-emerald-600" },
};

const STATUS_STYLES: Record<CampaignStatus, { bg: string; text: string; dot: string; label: string }> = {
  active: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-600", label: "Active" },
  paused: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500", label: "Paused" },
  completed: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-600", label: "Completed" },
  draft: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400", label: "Draft" },
};

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function StatusPill({ status }: { status: CampaignStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    name: "Summer Launch Awareness",
    platform: "instagram",
    status: "active",
    budget: 5000,
    spend: 3240,
    reach: 182000,
    impressions: 412000,
    clicks: 18400,
  },
  {
    id: "c2",
    name: "Hotel Procurement Webinar",
    platform: "linkedin",
    status: "active",
    budget: 2500,
    spend: 980,
    reach: 64000,
    impressions: 151000,
    clicks: 6200,
  },
  {
    id: "c3",
    name: "Q3 Retargeting Push",
    platform: "facebook",
    status: "paused",
    budget: 3000,
    spend: 2100,
    reach: 121000,
    impressions: 298000,
    clicks: 11000,
  },
  {
    id: "c4",
    name: "Brand Search Campaign",
    platform: "google",
    status: "completed",
    budget: 4000,
    spend: 3950,
    reach: 96000,
    impressions: 230000,
    clicks: 9800,
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    platform: "instagram" as Platform,
    status: "draft" as CampaignStatus,
    budget: 1000,
  });

  const {
    data: statsData,
    loading,
    error: fetchError,
  } = useApi<{ stats: Stats }>("/api/v1/marketing/campaigns/stats");

  const stats: Stats = useMemo(
    () =>
      statsData?.stats ?? {
        impressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
        clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
        ctr: 0,
        spend: campaigns.reduce((sum, c) => sum + c.spend, 0),
      },
    [statsData, campaigns]
  );

  const ctr = useMemo(() => {
    const impressions = stats.impressions || 0;
    const clicks = stats.clicks || 0;
    return impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00";
  }, [stats]);

  const statCards = [
    { label: "Impressions", value: stats.impressions.toLocaleString(), icon: BarChart3, color: "text-blue-600" },
    { label: "Clicks", value: stats.clicks.toLocaleString(), icon: MousePointerClick, color: "text-emerald-600" },
    { label: "CTR", value: `${ctr}%`, icon: Target, color: "text-amber-600" },
    { label: "Spend", value: currency(stats.spend), icon: DollarSign, color: "text-pink-600" },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newCampaign: Campaign = {
      id: `local-${Date.now()}`,
      name: form.name.trim(),
      platform: form.platform,
      status: form.status,
      budget: Math.max(0, form.budget),
      spend: 0,
      reach: 0,
      impressions: 0,
      clicks: 0,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    setForm({ name: "", platform: "instagram", status: "draft", budget: 1000 });
    setFormOpen(false);

    try {
      fetch("/api/v1/marketing/campaigns", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCampaign, spend: undefined, reach: undefined, impressions: undefined, clicks: undefined }),
      });
    } catch {
      // Endpoint unavailable — campaign already added to local table.
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-sm text-slate-500 mt-1">Monitor performance and manage ad campaigns</p>
          </div>
          <button
            onClick={() => setFormOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            <Plus size={15} />
            New Campaign
          </button>
        </div>

        {fetchError && (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Stats API unavailable — showing computed local metrics.
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 animate-pulse">
                  <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
                  <div className="h-6 w-24 bg-slate-200 rounded" />
                </div>
              ))
            : statCards.map((card) => (
                <div key={card.label} className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{card.label}</span>
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <card.icon size={16} className={card.color} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              ))}
        </div>

        {/* New campaign form */}
        {formOpen && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold mb-4">
              <Megaphone size={16} className="text-blue-600" />
              New Campaign
            </h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Fall engagement drive"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value as Platform }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                >
                  {(Object.keys(PLATFORM_META) as Platform[]).map((p) => (
                    <option key={p} value={p}>
                      {PLATFORM_META[p].label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Budget (USD)</label>
                <input
                  type="number"
                  min={0}
                  value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Campaigns table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <Megaphone size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold">All Campaigns</h2>
            <span className="ml-auto text-xs text-slate-400">{campaigns.length} campaigns</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Campaign", "Platform", "Status", "Budget", "Spend", "Reach"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((c) => {
                  const meta = PLATFORM_META[c.platform];
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <meta.icon size={15} className={meta.color} />
                          </div>
                          <span className="text-sm font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{meta.label}</td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium">{currency(c.budget)}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{currency(c.spend)}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{c.reach.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}