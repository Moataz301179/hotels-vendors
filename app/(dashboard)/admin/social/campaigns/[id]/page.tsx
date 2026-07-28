"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Megaphone,
  Calendar,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Hash,
  ExternalLink,
} from "lucide-react";

interface CampaignDetail {
  campaign: {
    id: string;
    name: string;
    description: string | null;
    objective: string;
    status: string;
    platforms: string[];
    targetRoles: string[];
    startDate: string;
    endDate: string | null;
    contentStrategy: string | null;
  };
  stats: {
    totalPosts: number;
    publishedPosts: number;
    scheduledPosts: number;
    failedPosts: number;
    draftPosts: number;
    engagement: {
      likes: number;
      shares: number;
      comments: number;
      clicks: number;
    };
  };
}

interface Post {
  id: string;
  platform: string;
  content: string;
  hashtags: string | null;
  scheduledAt: string;
  publishedAt: string | null;
  status: string;
  engagement: string | null;
}

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [campaignRes, postsRes] = await Promise.all([
          fetch(`/api/v1/social/campaigns?id=${id}`),
          fetch(`/api/v1/social/posts?campaignId=${id}`),
        ]);

        if (campaignRes.ok) {
          const data = await campaignRes.json();
          setCampaign(data);
        }
        if (postsRes.ok) {
          const data = await postsRes.json();
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error("Failed to load campaign:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    SCHEDULED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PUBLISHED: "bg-green-500/10 text-green-400 border-green-500/20",
    FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-canvas text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent-base" />
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="min-h-screen bg-canvas text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-foreground-muted">Campaign not found</p>
          <Link href="/admin/social" className="text-accent-base hover:underline text-[13px] mt-2 inline-block">
            Back to Social Hub
          </Link>
        </div>
      </main>
    );
  }

  const c = campaign.campaign;
  const s = campaign.stats;
  const strategy = c.contentStrategy ? JSON.parse(c.contentStrategy) : null;

  return (
    <main className="min-h-screen bg-canvas text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/social"
            className="p-2 rounded-lg text-foreground-muted hover:text-white hover:bg-surface-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-bold tracking-tight">{c.name}</h1>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusColors[c.status] || statusColors.DRAFT}`}>
                {c.status}
              </span>
            </div>
            {c.description && (
              <p className="text-foreground-muted text-[13px] mt-1">{c.description}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatBox label="Total Posts" value={s.totalPosts} icon={Megaphone} />
          <StatBox label="Published" value={s.publishedPosts} icon={CheckCircle2} color="text-green-400" />
          <StatBox label="Scheduled" value={s.scheduledPosts} icon={Clock} color="text-blue-400" />
          <StatBox label="Failed" value={s.failedPosts} icon={AlertCircle} color="text-red-400" />
        </div>

        {/* Campaign Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-4">
            {/* Posts */}
            <section className="border border-border-subtle rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border-subtle bg-surface-1 flex items-center justify-between">
                <h2 className="text-[14px] font-semibold">Posts</h2>
                <span className="text-[11px] text-foreground-muted">{posts.length} total</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {posts.length === 0 ? (
                  <div className="px-4 py-8 text-center text-foreground-muted text-[13px]">
                    No posts yet. Generate posts from the campaign list.
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="px-4 py-4 hover:bg-surface-1 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusColors[post.status] || statusColors.DRAFT}`}>
                            {post.platform}
                          </span>
                          <span className="text-[11px] text-foreground-muted">
                            {post.scheduledAt
                              ? new Date(post.scheduledAt).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Not scheduled"}
                          </span>
                        </div>
                        {post.publishedAt && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        )}
                      </div>
                      <p className="text-[13px] text-foreground-secondary leading-relaxed">{post.content}</p>
                      {post.hashtags && (
                        <p className="text-[11px] text-accent-base/60 mt-1.5">{post.hashtags}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="border border-border-subtle rounded-xl p-4 bg-surface-1">
              <h3 className="text-[13px] font-semibold mb-3">Campaign Details</h3>
              <div className="space-y-2.5">
                <DetailRow label="Objective" value={c.objective} />
                <DetailRow
                  label="Platforms"
                  value={c.platforms.join(", ")}
                />
                <DetailRow
                  label="Target"
                  value={c.targetRoles.join(", ")}
                />
                <DetailRow
                  label="Start"
                  value={new Date(c.startDate).toLocaleDateString("en-GB")}
                />
                {c.endDate && (
                  <DetailRow
                    label="End"
                    value={new Date(c.endDate).toLocaleDateString("en-GB")}
                  />
                )}
              </div>
            </div>

            {strategy && (
              <div className="border border-border-subtle rounded-xl p-4 bg-surface-1">
                <h3 className="text-[13px] font-semibold mb-3">Content Strategy</h3>
                <div className="space-y-2.5">
                  <DetailRow label="Tone" value={strategy.tone} />
                  <DetailRow label="Frequency" value={strategy.postingFrequency} />
                  {strategy.themes && (
                    <div>
                      <span className="text-[11px] text-foreground-muted block mb-1">Themes</span>
                      <div className="flex flex-wrap gap-1">
                        {strategy.themes.map((t: string) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-foreground-tertiary border border-border-subtle">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Engagement */}
            <div className="border border-border-subtle rounded-xl p-4 bg-surface-1">
              <h3 className="text-[13px] font-semibold mb-3">Engagement</h3>
              <div className="space-y-2.5">
                <DetailRow label="Likes" value={s.engagement.likes.toString()} />
                <DetailRow label="Shares" value={s.engagement.shares.toString()} />
                <DetailRow label="Comments" value={s.engagement.comments.toString()} />
                <DetailRow label="Clicks" value={s.engagement.clicks.toString()} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatBox({
  label,
  value,
  icon: Icon,
  color = "text-foreground-secondary",
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-border-subtle bg-surface-1">
      <Icon className={`w-4 h-4 mb-2 ${color}`} />
      <div className="text-[22px] font-bold">{value}</div>
      <div className="text-[11px] text-foreground-muted mt-0.5">{label}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-foreground-muted">{label}</span>
      <span className="text-[12px] text-foreground-secondary font-medium">{value}</span>
    </div>
  );
}
