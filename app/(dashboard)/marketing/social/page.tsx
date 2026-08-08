"use client";

import { useMemo, useState } from "react";
import {
  AtSign,
  ThumbsUp,
  Network,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  CalendarDays,
  Image as ImageIcon,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

type AccountType = "instagram" | "whatsapp" | "facebook" | "linkedin";
type PostStatus = "scheduled" | "published" | "failed";

interface Account {
  id: string;
  name: string;
  handle: string;
  type: AccountType;
  connected: boolean;
  followers: string;
}

interface SocialPost {
  id: string;
  content: string;
  channel: AccountType;
  status: PostStatus;
  scheduledAt: string;
}

const ACC_META: Record<AccountType, { label: string; icon: typeof AtSign; color: string }> = {
  instagram: { label: "Instagram", icon: AtSign, color: "text-pink-600" },
  whatsapp: { label: "WhatsApp Business", icon: MessageSquare, color: "text-emerald-600" },
  facebook: { label: "Facebook", icon: ThumbsUp, color: "text-blue-600" },
  linkedin: { label: "LinkedIn", icon: Network, color: "text-sky-700" },
};

const STATUS_STYLES: Record<PostStatus, { bg: string; text: string; icon: typeof Clock; label: string }> = {
  scheduled: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock, label: "Scheduled" },
  published: { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle2, label: "Published" },
  failed: { bg: "bg-red-100", text: "text-red-700", icon: XCircle, label: "Failed" },
};

const MAX_CHARS = 280;

const INITIAL_ACCOUNTS: Account[] = [
  { id: "ig", name: "Instagram", handle: "@hotelsvendors", type: "instagram", connected: true, followers: "24.1K" },
  { id: "wa", name: "WhatsApp Business", handle: "+20 100 000 0000", type: "whatsapp", connected: true, followers: "8.4K" },
  { id: "fb", name: "Facebook", handle: "/hotelsvendors", type: "facebook", connected: true, followers: "31.7K" },
  { id: "li", name: "LinkedIn", handle: "HotelsVendors", type: "linkedin", connected: false, followers: "12.9K" },
];

export default function SocialMediaPage() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [composer, setComposer] = useState("");
  const [channel, setChannel] = useState<AccountType>("instagram");
  const [localPosts, setLocalPosts] = useState<SocialPost[]>([]);
  const [postError, setPostError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PostStatus | "all">("all");

  const {
    data: postsData,
    loading,
    error: fetchError,
  } = useApi<{ posts: SocialPost[] }>("/api/v1/marketing/social/posts");

  const remotePosts = useMemo(() => postsData?.posts ?? [], [postsData]);
  const allPosts = useMemo(
    () => [...remotePosts, ...localPosts].sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt)),
    [remotePosts, localPosts]
  );

  const filteredPosts = filter === "all" ? allPosts : allPosts.filter((p) => p.status === filter);

  const remaining = MAX_CHARS - composer.length;

  const toggleAccount = (id: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, connected: !a.connected } : a)));
  };

  const handlePublish = () => {
    const text = composer.trim();
    if (!text) return;
    setPostError(null);

    const newPost: SocialPost = {
      id: `local-${Date.now()}`,
      content: text,
      channel,
      status: "scheduled",
      scheduledAt: new Date().toISOString(),
    };
    setLocalPosts((prev) => [newPost, ...prev]);
    setComposer("");

    try {
      fetch("/api/v1/marketing/social/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, channel, scheduledAt: newPost.scheduledAt }),
      });
    } catch {
      // Endpoint unavailable — post added to local feed.
    }
  };

  const feedTabs: { key: PostStatus | "all"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "scheduled", label: "Scheduled" },
    { key: "published", label: "Published" },
    { key: "failed", label: "Failed" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Social Media</h1>
          <p className="text-sm text-slate-500 mt-1">Manage connected accounts and publish posts</p>
        </div>

        {/* Connected accounts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map((acc) => {
            const meta = ACC_META[acc.type];
            return (
              <div
                key={acc.id}
                className={`rounded-xl border bg-white shadow-sm p-4 transition-colors ${
                  acc.connected ? "border-slate-200" : "border-slate-200 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <meta.icon size={18} className={meta.color} />
                  </div>
                  <button
                    onClick={() => toggleAccount(acc.id)}
                    className={`text-[11px] font-medium rounded-full px-2.5 py-1 transition-colors ${
                      acc.connected
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {acc.connected ? "Connected" : "Disconnected"}
                  </button>
                </div>
                <p className="text-sm font-semibold">{meta.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{acc.handle}</p>
                <p className="text-[11px] text-slate-500 mt-2">{acc.followers} followers</p>
              </div>
            );
          })}
        </div>

        {/* Post composer */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold mb-4">
            <Send size={16} className="text-blue-600" />
            Compose Post
          </h2>
          <textarea
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            placeholder="What would you like to share?"
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as AccountType)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              >
                {(Object.keys(ACC_META) as AccountType[]).map((c) => (
                  <option key={c} value={c}>
                    {ACC_META[c].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium ${
                  remaining < 0 ? "text-red-600" : remaining <= 20 ? "text-amber-600" : "text-slate-400"
                }`}
              >
                {remaining} chars left
              </span>
              <button
                onClick={handlePublish}
                disabled={!composer.trim() || remaining < 0}
                className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                <CalendarDays size={14} />
                Schedule
              </button>
            </div>
          </div>
          {postError && <p className="mt-2 text-xs text-red-600">{postError}</p>}
        </div>

        {/* Post feed */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 px-4 py-3">
            <span className="text-sm font-semibold mr-2 flex items-center gap-2">
              <ImageIcon size={15} className="text-blue-600" />
              Post Feed
            </span>
            {feedTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filter === tab.key
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading && <p className="px-5 py-6 text-xs text-slate-400">Loading posts…</p>}
          {fetchError && !loading && (
            <p className="px-5 py-4 text-xs text-amber-600 bg-amber-50 border-b border-amber-100">
              Post API unavailable — showing local feed.
            </p>
          )}

          {!loading && filteredPosts.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No posts in this view.</p>
              <p className="text-xs text-slate-400 mt-1">Compose a post above to see it here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredPosts.map((post) => {
                const meta = ACC_META[post.channel];
                const s = STATUS_STYLES[post.status];
                return (
                  <li key={post.id} className="flex gap-3 px-5 py-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <meta.icon size={16} className={meta.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-800">{post.content}</p>
                      <p className="text-xs text-slate-400 mt-1.5">
                        {meta.label} • {new Date(post.scheduledAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 h-fit rounded-full text-[11px] font-medium ${s.bg} ${s.text}`}>
                      <s.icon size={12} />
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}