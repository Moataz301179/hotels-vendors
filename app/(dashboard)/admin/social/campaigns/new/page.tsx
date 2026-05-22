"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Megaphone,
  Target,
  Calendar,
  Hash,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";

const OBJECTIVES = [
  { value: "AWARENESS", label: "Brand Awareness", desc: "Reach new audiences" },
  { value: "ENGAGEMENT", label: "Engagement", desc: "Drive interactions" },
  { value: "CONVERSION", label: "Conversion", desc: "Drive signups/orders" },
  { value: "LEAD_GENERATION", label: "Lead Generation", desc: "Collect leads" },
  { value: "RETENTION", label: "Retention", desc: "Keep users active" },
];

const PLATFORMS = [
  { value: "FACEBOOK", label: "Facebook", color: "#1877F2" },
  { value: "INSTAGRAM", label: "Instagram", color: "#E4405F" },
  { value: "LINKEDIN", label: "LinkedIn", color: "#0A66C2" },
  { value: "X", label: "X (Twitter)", color: "#fff" },
];

const ROLES = [
  { value: "HOTEL", label: "Hotels" },
  { value: "SUPPLIER", label: "Suppliers" },
  { value: "LOGISTICS", label: "Logistics" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "exciting", label: "Exciting" },
  { value: "educational", label: "Educational" },
];

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "3x_week", label: "3x per week" },
  { value: "weekly", label: "Weekly" },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    objective: "AWARENESS",
    targetRoles: ["HOTEL"],
    platforms: ["FACEBOOK", "INSTAGRAM"],
    budgetEgp: "",
    startDate: "",
    endDate: "",
    themes: ["Beta launch"],
    tone: "professional" as const,
    hashtags: "#HotelsVendors #EgyptHospitality",
    postingFrequency: "3x_week" as const,
    postCount: 5,
  });

  function toggleRole(role: string) {
    setForm((f) => ({
      ...f,
      targetRoles: f.targetRoles.includes(role)
        ? f.targetRoles.filter((r) => r !== role)
        : [...f.targetRoles, role],
    }));
  }

  function togglePlatform(platform: string) {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(platform)
        ? f.platforms.filter((p) => p !== platform)
        : [...f.platforms, platform],
    }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/social/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          objective: form.objective,
          targetRoles: form.targetRoles,
          platforms: form.platforms,
          budgetEgp: form.budgetEgp ? parseFloat(form.budgetEgp) : undefined,
          startDate: new Date(form.startDate).toISOString(),
          endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
          contentStrategy: {
            themes: form.themes,
            tone: form.tone,
            hashtags: form.hashtags.split(" ").filter(Boolean),
            postingFrequency: form.postingFrequency,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to create campaign");
      const data = await res.json();

      // Auto-generate posts
      await fetch("/api/v1/social/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: data.campaign.id,
          count: form.postCount,
          topics: form.themes,
        }),
      });

      router.push("/admin/social");
    } catch (err) {
      console.error(err);
      alert("Failed to create campaign. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/admin/social"
            className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-[24px] font-bold tracking-tight">New Campaign</h1>
            <p className="text-white/40 text-[13px]">Create a social media campaign with AI-generated content</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${
                s <= step ? "bg-[#8b5cf6]" : "bg-white/[0.06]"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basics */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-2">Campaign Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Beta Launch Awareness"
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What is this campaign about?"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-2">Objective</label>
              <div className="grid grid-cols-2 gap-2">
                {OBJECTIVES.map((obj) => (
                  <button
                    key={obj.value}
                    onClick={() => setForm((f) => ({ ...f, objective: obj.value }))}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      form.objective === obj.value
                        ? "bg-[#8b5cf6]/10 border-[#8b5cf6]/40"
                        : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="text-[13px] font-medium text-white">{obj.label}</div>
                    <div className="text-[11px] text-white/40 mt-0.5">{obj.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-white/60 mb-2">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-white/60 mb-2">End Date (optional)</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-2">Budget (EGP, optional)</label>
              <input
                type="number"
                value={form.budgetEgp}
                onChange={(e) => setForm((f) => ({ ...f, budgetEgp: e.target.value }))}
                placeholder="5000"
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!form.name || !form.startDate}
                className="px-6 py-2.5 text-[13px] font-medium bg-[#8b5cf6] hover:bg-[#7A0000] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Audience
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Audience & Platforms */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-2">Target Platforms</label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => togglePlatform(p.value)}
                    className={`p-3 rounded-lg border text-left transition-colors flex items-center gap-3 ${
                      form.platforms.includes(p.value)
                        ? "bg-[#8b5cf6]/10 border-[#8b5cf6]/40"
                        : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-[13px] font-medium text-white">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-2">Target Audience</label>
              <div className="flex gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => toggleRole(r.value)}
                    className={`px-4 py-2.5 rounded-lg border text-[13px] font-medium transition-colors ${
                      form.targetRoles.includes(r.value)
                        ? "bg-[#8b5cf6]/10 border-[#8b5cf6]/40 text-[#8b5cf6]"
                        : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2.5 text-[13px] font-medium text-white/50 hover:text-white border border-white/[0.08] rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={form.platforms.length === 0 || form.targetRoles.length === 0}
                className="px-6 py-2.5 text-[13px] font-medium bg-[#8b5cf6] hover:bg-[#7A0000] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Content
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Content Strategy */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-2">Content Tone</label>
              <div className="flex gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setForm((f) => ({ ...f, tone: t.value as any }))}
                    className={`px-4 py-2.5 rounded-lg border text-[13px] font-medium transition-colors ${
                      form.tone === t.value
                        ? "bg-[#8b5cf6]/10 border-[#8b5cf6]/40 text-[#8b5cf6]"
                        : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-2">Content Themes</label>
              <input
                type="text"
                value={form.themes.join(", ")}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    themes: e.target.value.split(",").map((s) => s.trim()),
                  }))
                }
                placeholder="Beta launch, Supplier spotlight, Industry insights"
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-white/60 mb-2">Hashtags</label>
              <input
                type="text"
                value={form.hashtags}
                onChange={(e) => setForm((f) => ({ ...f, hashtags: e.target.value }))}
                placeholder="#HotelsVendors #EgyptHospitality"
                className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-white/60 mb-2">Posting Frequency</label>
                <select
                  value={form.postingFrequency}
                  onChange={(e) => setForm((f) => ({ ...f, postingFrequency: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] focus:outline-none focus:border-[#8b5cf6]/50 transition-colors appearance-none"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f.value} value={f.value} className="bg-[#1a1a1a]">
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-white/60 mb-2">Posts to Generate</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={form.postCount}
                  onChange={(e) => setForm((f) => ({ ...f, postCount: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 text-[13px] font-medium text-white/50 hover:text-white border border-white/[0.08] rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium bg-[#8b5cf6] hover:bg-[#7A0000] rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Create & Generate Posts
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
