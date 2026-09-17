"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePrefs } from "@/lib/i18n/language-context";
import { btnCls } from "@/components/ui";
import {
  IcArrow,
  IcCard,
  IcCheck,
  IcDoc,
  IcLock,
  IcReceipt,
  IcScale,
  IcShield,
  IcThermo,
  IcTruck,
  IcWarehouse,
  IcX,
} from "./icons";

/* ------------------------------------------------------------------
   Educational Video & Marketing Showcase Component.
   Illustrates:
   1. Why HotelsVendors holds a distinguished role (neutral market
      infrastructure, not a marked-up distributor or broker).
   2. Why every supplier should use it (locked pre-approved POs,
      direct luxury hotel pipeline, on-dock GRN lock, 48h partner cash).
   3. What hotels benefit from using it (direct EGP pricing,
      multi-tier budget authority rules, cold-chain compliance, 3-way match).
   ------------------------------------------------------------------ */

type ShowcaseTab = "distinguished" | "suppliers" | "hotels";

interface TabVideoMeta {
  src: string;
  poster: string;
  badge: string;
  hudTitle: string;
  hudStat: string;
}

const TAB_VIDEOS: Record<ShowcaseTab, TabVideoMeta> = {
  distinguished: {
    src: "https://videos.pexels.com/video-files/4253721/4253721-uhd_4096_2160_25fps.mp4",
    poster: "https://images.pexels.com/videos/4253721/pexels-photo-4253721.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1080&dpr=2",
    badge: "0% TRADING MARKUP · NEUTRAL SPINE",
    hudTitle: "Transaction Network Infrastructure",
    hudStat: "100% 3-Way Match Enforced",
  },
  suppliers: {
    src: "https://videos.pexels.com/video-files/32838797/13996856_3840_2160_30fps.mp4",
    poster: "https://images.pexels.com/videos/32838797/copells-32838797.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1080&dpr=2",
    badge: "GUARANTEED PURCHASE ORDERS · 48H CASHFLOW",
    hudTitle: "Locked Demand & Instant Liquidity",
    hudStat: "48h Partner Cashout Available",
  },
  hotels: {
    src: "https://videos.pexels.com/video-files/6474635/6474635-uhd_4096_2160_25fps.mp4",
    poster: "https://images.pexels.com/videos/6474635/pexels-photo-6474635.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1920&h=1080&dpr=2",
    badge: "MULTI-TIER AUTHORITY · COLD-CHAIN AUDIT",
    hudTitle: "Zero Procurement Leakage",
    hudStat: "Direct Producer Pricing in EGP",
  },
};

export default function EducationalShowcase() {
  const { t, lang } = usePrefs();
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("distinguished");
  const [tourOpen, setTourOpen] = useState(false);

  return (
    <section
      id="educational-showcase"
      className="sf-void band-lg air-glow relative border-b border-white/10 text-white"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="kicker mb-3.5 text-brass-300">{t("showcase.kicker")}</div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            {t("showcase.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-300 sm:text-lg">
            {t("showcase.subtitle")}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-white/15 pb-4">
          <button
            onClick={() => setActiveTab("distinguished")}
            className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "distinguished"
                ? "bg-brass-400 text-ink-950 shadow-lg"
                : "text-ink-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <IcScale className="text-lg" />
            <span>{t("showcase.tabDistinguished")}</span>
          </button>

          <button
            onClick={() => setActiveTab("suppliers")}
            className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "suppliers"
                ? "bg-brass-400 text-ink-950 shadow-lg"
                : "text-ink-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <IcWarehouse className="text-lg" />
            <span>{t("showcase.tabSuppliers")}</span>
          </button>

          <button
            onClick={() => setActiveTab("hotels")}
            className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "hotels"
                ? "bg-brass-400 text-ink-950 shadow-lg"
                : "text-ink-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <IcShield className="text-lg" />
            <span>{t("showcase.tabHotels")}</span>
          </button>

          <button
            onClick={() => setTourOpen(true)}
            className="ms-auto flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold text-brass-200 transition-colors hover:bg-white/15"
          >
            <span>{t("showcase.watchTour")}</span>
            <IcArrow className="rtl:-scale-x-100" />
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="mt-8">
          {activeTab === "distinguished" && <DistinguishedTab video={TAB_VIDEOS.distinguished} />}
          {activeTab === "suppliers" && <SuppliersTab video={TAB_VIDEOS.suppliers} />}
          {activeTab === "hotels" && <HotelsTab video={TAB_VIDEOS.hotels} />}
        </div>
      </div>

      {/* Interactive Platform Tour Modal */}
      {tourOpen && <PlatformTourModal onClose={() => setTourOpen(false)} />}
    </section>
  );
}

/* ------------------------------------------------------------------
   Tab 1: The Distinguished Role (Market Infrastructure vs Distributor)
   ------------------------------------------------------------------ */

function DistinguishedTab({ video }: { video: TabVideoMeta }) {
  const { t, lang } = usePrefs();

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
      {/* Interactive Video Player */}
      <div className="lg:col-span-6">
        <ShowcaseVideoPlayer video={video} />

        {/* 3-Way Match Spine Diagram */}
        <div className="mt-5 rounded-xl border border-white/15 bg-ink-950/70 p-5 backdrop-blur">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-brass-300">
            {lang === "ar" ? "عمود المطابقة الثلاثية الإلزامي" : "THE AUDITED 3-WAY MATCH SPINE"}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded border border-white/10 bg-white/5 p-2.5">
              <IcDoc className="mx-auto mb-1.5 text-base text-brass-400" />
              <div className="font-semibold text-white">{lang === "ar" ? "أمر الشراء" : "Purchase Order"}</div>
              <div className="mt-0.5 text-[10px] text-ink-300">{lang === "ar" ? "معتمد مسبقاً" : "Pre-approved"}</div>
            </div>
            <div className="rounded border border-white/10 bg-white/5 p-2.5">
              <IcReceipt className="mx-auto mb-1.5 text-base text-brass-400" />
              <div className="font-semibold text-white">{lang === "ar" ? "سند الاستلام" : "Digital GRN"}</div>
              <div className="mt-0.5 text-[10px] text-ink-300">{lang === "ar" ? "مفحوص على الرصيف" : "On-dock verified"}</div>
            </div>
            <div className="rounded border border-white/10 bg-white/5 p-2.5">
              <IcCard className="mx-auto mb-1.5 text-base text-brass-400" />
              <div className="font-semibold text-white">{lang === "ar" ? "الفاتورة والتسوية" : "Invoice & Settle"}</div>
              <div className="mt-0.5 text-[10px] text-ink-300">{lang === "ar" ? "مطابقة تامة 100%" : "Zero discrepancy"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Editorial Content */}
      <div className="space-y-6 lg:col-span-6">
        <div>
          <span className="rounded-full border border-brass-400/40 bg-brass-400/10 px-3 py-1 text-[11px] font-bold tracking-wider text-brass-300">
            {lang === "ar" ? "بنية تحتية محايدة" : "MARKET INFRASTRUCTURE"}
          </span>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t("showcase.distHeading")}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-200 sm:text-base">
            {t("showcase.distLead")}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-xl border border-white/15 bg-white/5">
          <div className="grid grid-cols-2 border-b border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider">
            <span className="text-rose-300">
              {lang === "ar" ? "الموزع التقليدي / الوسيط" : "Traditional Middleman"}
            </span>
            <span className="text-emerald-300">
              {lang === "ar" ? "بنية HotelsVendors" : "HotelsVendors Rails"}
            </span>
          </div>
          <div className="divide-y divide-white/10 text-[12px] leading-snug">
            <div className="grid grid-cols-2 px-4 py-2.5">
              <span className="text-ink-400">{lang === "ar" ? "هامش ربح إضافي 20-35%" : "20–35% hidden markup"}</span>
              <span className="font-semibold text-white">{lang === "ar" ? "0% هامش — سعر المصدر بالجنيه" : "0% markup — direct producer EGP"}</span>
            </div>
            <div className="grid grid-cols-2 px-4 py-2.5">
              <span className="text-ink-400">{lang === "ar" ? "أوامر شفوية غير معتمدة" : "Rogue verbal / offline orders"}</span>
              <span className="font-semibold text-white">{lang === "ar" ? "مصفوفة صلاحيات إلكترونية مقفلة" : "Authority rules enforced digitally"}</span>
            </div>
            <div className="grid grid-cols-2 px-4 py-2.5">
              <span className="text-ink-400">{lang === "ar" ? "نزاعات متكررة عند الفاتورة" : "Frequent deduction disputes"}</span>
              <span className="font-semibold text-white">{lang === "ar" ? "سند استلام GRN رقمي مقفل" : "Digital on-dock GRN locks total"}</span>
            </div>
            <div className="grid grid-cols-2 px-4 py-2.5">
              <span className="text-ink-400">{lang === "ar" ? "انتظار 90 يوماً للشيكات" : "90-day manual pay cycles"}</span>
              <span className="font-semibold text-white">{lang === "ar" ? "خصم فواتير في 48 ساعة عبر شريك" : "48h optional licensed discounting"}</span>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-3.5">
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brass-400/20 text-brass-300">
              <IcScale className="text-base" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{t("showcase.distP1Title")}</div>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-300">{t("showcase.distP1Desc")}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brass-400/20 text-brass-300">
              <IcShield className="text-base" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{t("showcase.distP2Title")}</div>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-300">{t("showcase.distP2Desc")}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brass-400/20 text-brass-300">
              <IcCard className="text-base" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{t("showcase.distP3Title")}</div>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-300">{t("showcase.distP3Desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Tab 2: Why Every Supplier Uses It (Guaranteed POs, 48h Cash)
   ------------------------------------------------------------------ */

function SuppliersTab({ video }: { video: TabVideoMeta }) {
  const { t, lang } = usePrefs();

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
      {/* Interactive Video Player */}
      <div className="lg:col-span-6">
        <ShowcaseVideoPlayer video={video} />

        {/* Quantified Supplier Advantage Strip */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-center">
            <div className="tnum text-2xl font-bold text-brass-300">100%</div>
            <div className="mt-1 text-[11px] leading-tight text-ink-300">
              {lang === "ar" ? "أوامر معتمدة مسبقاً" : "Pre-Approved POs"}
            </div>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-center">
            <div className="tnum text-2xl font-bold text-emerald-400">48h</div>
            <div className="mt-1 text-[11px] leading-tight text-ink-300">
              {lang === "ar" ? "سيولة عبر شريك مرخّص" : "Licensed Partner Cash"}
            </div>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-center">
            <div className="tnum text-2xl font-bold text-brass-300">0%</div>
            <div className="mt-1 text-[11px] leading-tight text-ink-300">
              {lang === "ar" ? "رسوم عمولة وسطاء" : "Middleman Cuts"}
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Editorial Breakdown */}
      <div className="space-y-6 lg:col-span-6">
        <div>
          <span className="rounded-full border border-brass-400/40 bg-brass-400/10 px-3 py-1 text-[11px] font-bold tracking-wider text-brass-300">
            {lang === "ar" ? "للمورّدين والمصنّعين" : "FOR EGYPTIAN SUPPLIERS"}
          </span>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t("showcase.supHeading")}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-200 sm:text-base">
            {t("showcase.supLead")}
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <div className="flex items-center gap-2 font-bold text-white text-[13px]">
              <IcWarehouse className="text-base text-brass-400" />
              <span>{t("showcase.supP1Title")}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{t("showcase.supP1Desc")}</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <div className="flex items-center gap-2 font-bold text-white text-[13px]">
              <IcLock className="text-base text-brass-400" />
              <span>{t("showcase.supP2Title")}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{t("showcase.supP2Desc")}</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <div className="flex items-center gap-2 font-bold text-white text-[13px]">
              <IcReceipt className="text-base text-brass-400" />
              <span>{t("showcase.supP3Title")}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{t("showcase.supP3Desc")}</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <div className="flex items-center gap-2 font-bold text-white text-[13px]">
              <IcCard className="text-base text-brass-400" />
              <span>{t("showcase.supP4Title")}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{t("showcase.supP4Desc")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="/supplier-central" className={btnCls("accent", "md")}>
            {t("showcase.ctaSupplier")}
            <IcArrow className="rtl:-scale-x-100" />
          </Link>
          <Link
            href="/suppliers"
            className="inline-flex h-11 items-center gap-2 rounded border border-white/25 bg-white/5 px-4 text-sm font-medium text-white hover:bg-white/10"
          >
            {lang === "ar" ? "استعراض شبكة الموردين" : "View Supplier Network"}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Tab 3: What Hotels Benefit (Direct EGP, Authority Rules, 3-Way Match)
   ------------------------------------------------------------------ */

function HotelsTab({ video }: { video: TabVideoMeta }) {
  const { t, lang } = usePrefs();

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
      {/* Interactive Video Player */}
      <div className="lg:col-span-6">
        <ShowcaseVideoPlayer video={video} />

        {/* Real Authority Rule Preview Pill */}
        <div className="mt-5 rounded-xl border border-white/15 bg-ink-950/70 p-5 backdrop-blur">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
            {lang === "ar" ? "حوكمة مصفوفة الصلاحيات الفندقية" : "HOTEL AUTHORITY GOVERNANCE"}
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2">
              <span className="font-semibold text-white">
                {lang === "ar" ? "أقل من 50,000 ج.م" : "EGP 0 – 50,000"}
              </span>
              <span className="text-emerald-300 font-medium">
                {lang === "ar" ? "اعتماد فوري (رئيس المشتريات)" : "Auto-Approved (Procurement Lead)"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2">
              <span className="font-semibold text-white">
                {lang === "ar" ? "50,001 – 200,000 ج.م" : "EGP 50,001 – 200,000"}
              </span>
              <span className="text-brass-300 font-medium">
                {lang === "ar" ? "اعتماد المدير العام (24h)" : "General Manager Approval (24h)"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2">
              <span className="font-semibold text-white">
                {lang === "ar" ? "أكثر من 200,000 ج.م" : "EGP > 200,000"}
              </span>
              <span className="text-rose-300 font-medium">
                {lang === "ar" ? "اعتماد مزدوج: المدير المالي + المدير العام" : "Dual CFO + GM Approval"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Editorial Breakdown */}
      <div className="space-y-6 lg:col-span-6">
        <div>
          <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-300">
            {lang === "ar" ? "للفنادق والمنتجعات" : "FOR HOTELS & RESORTS"}
          </span>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t("showcase.htlHeading")}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-200 sm:text-base">
            {t("showcase.htlLead")}
          </p>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <div className="flex items-center gap-2 font-bold text-white text-[13px]">
              <IcCheck className="text-base text-emerald-400" />
              <span>{t("showcase.htlP1Title")}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{t("showcase.htlP1Desc")}</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <div className="flex items-center gap-2 font-bold text-white text-[13px]">
              <IcShield className="text-base text-emerald-400" />
              <span>{t("showcase.htlP2Title")}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{t("showcase.htlP2Desc")}</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <div className="flex items-center gap-2 font-bold text-white text-[13px]">
              <IcThermo className="text-base text-emerald-400" />
              <span>{t("showcase.htlP3Title")}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{t("showcase.htlP3Desc")}</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4">
            <div className="flex items-center gap-2 font-bold text-white text-[13px]">
              <IcDoc className="text-base text-emerald-400" />
              <span>{t("showcase.htlP4Title")}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{t("showcase.htlP4Desc")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="/marketplace" className={btnCls("accent", "md")}>
            {t("showcase.ctaHotel")}
            <IcArrow className="rtl:-scale-x-100" />
          </Link>
          <Link
            href="/orders"
            className="inline-flex h-11 items-center gap-2 rounded border border-white/25 bg-white/5 px-4 text-sm font-medium text-white hover:bg-white/10"
          >
            {lang === "ar" ? "أوامر الشراء والاستلام" : "POs & Receiving"}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Dedicated Showcase Video Player with HUD Overlays & Controls
   ------------------------------------------------------------------ */

function ShowcaseVideoPlayer({ video }: { video: TabVideoMeta }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = 0;
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => undefined);
  }, [video.src]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play();
      setPlaying(true);
    }
  };

  const toggleMute = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl">
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        muted={muted}
        loop
        playsInline
        onCanPlay={() => setReady(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-40"
        }`}
      />

      {/* Cinematic Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60" />

      {/* Overlaid Telemetry Badge */}
      <div className="absolute start-4 top-4 z-10 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-2 rounded-full border border-brass-400/40 bg-ink-950/80 px-3 py-1 text-[10px] font-bold tracking-wider text-brass-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-brass-400 animate-pulse" />
          {video.badge}
        </span>
      </div>

      {/* Overlaid Bottom Title & Controls */}
      <div className="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-white">{video.hudTitle}</div>
          <div className="text-xs text-brass-200">{video.hudStat}</div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur transition-transform hover:scale-105"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            )}
          </button>
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur transition-transform hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path d="M4 9.5h3L12 5.5v13L7 14.5H4v-5Z" />
              {!muted ? (
                <path d="M16 9.2a4 4 0 0 1 0 5.6M18.6 6.6a7.5 7.5 0 0 1 0 10.8" />
              ) : (
                <path d="m16.5 9.5 5 5m0-5-5 5" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Interactive Platform Tour Walkthrough Modal
   ------------------------------------------------------------------ */

function PlatformTourModal({ onClose }: { onClose: () => void }) {
  const { lang } = usePrefs();
  const [ch, setCh] = useState<0 | 1 | 2>(0);

  const steps = [
    {
      title: lang === "ar" ? "1. الدور المميّز للمنصة المحايدة" : "1. The Distinguished Neutral Role",
      sub: lang === "ar" ? "بنية تحتية لتداول الضيافة بلا هوامش وسيطة" : "Market infrastructure with zero trading markup",
      desc: lang === "ar"
        ? "تعمل HotelsVendors كشبكة معاملات مؤسسية محايدة تربط الفنادق بالمصنّعين مباشرة. لا نملك مخزوناً ولا نفرض عمولات خفية. المطابقة الثلاثية (أمر شراء ↔ سند استلام ↔ فاتورة) تضمن انضباطاً كاملاً في كل معاملة."
        : "HotelsVendors serves as neutral transaction infrastructure connecting verified hotels directly with audited producers. We hold zero inventory, charge no intermediary spread, and guarantee an audited 3-way match across every order.",
      video: TAB_VIDEOS.distinguished.src,
      badge: "NEUTRAL INFRASTRUCTURE",
      bullets: [
        lang === "ar" ? "0% هامش وسيط أو عمولة تداول" : "0% distributor markup or trading bias",
        lang === "ar" ? "مطابقة ثلاثية إلزامية قبل الدفع" : "Enforced 3-way match (PO ↔ GRN ↔ Invoice)",
        lang === "ar" ? "ربط قانوني بنّاء مع شركاء مرخّصين" : "Regulated handoff to licensed carriers and partners",
      ],
    },
    {
      title: lang === "ar" ? "2. لماذا ينبغي لكل مورّد استخدام المنصة" : "2. Why Every Supplier Uses It",
      sub: lang === "ar" ? "أوامر شراء معتمدة بنسبة 100% وسيولة نقدية في 48 ساعة" : "100% committed POs and 48-hour cashflow",
      desc: lang === "ar"
        ? "يستفيد المورد من الوصول الرقمي المباشر لأكبر سلاسل الفنادق في مصر. كل أمر شراء يصل المورّد يكون معتمداً من الإدارة المالية للفندق، وسند الاستلام GRN على الرصيف يقفل قيمة الفاتورة. يمكن للمورد خصم الفاتورة فوراً عبر شريك التمويل المرخّص."
        : "Suppliers gain direct digital reach to Egypt's premier hotel groups. Every incoming order is backed by executive authority rules, on-dock GRN acceptance locks invoice amounts against arbitrary disputes, and licensed partners provide 48-hour working capital discounting.",
      video: TAB_VIDEOS.suppliers.src,
      badge: "FOR EGYPTIAN SUPPLIERS",
      bullets: [
        lang === "ar" ? "أوامر شراء مؤكدة 100% بلا مخاطر إلغاء" : "100% committed pre-approved Purchase Orders",
        lang === "ar" ? "سند الاستلام الرقمي يقفل المستحقات فوراً" : "On-dock GRN verification ends billing disputes",
        lang === "ar" ? "تحصيل الفواتير خلال 48 ساعة عبر شريك مرخّص" : "48-hour liquidity via licensed partner NileBridge Capital",
      ],
    },
    {
      title: lang === "ar" ? "3. ما هي مكاسب الفنادق والمنتجعات" : "3. What Hotels Benefit From It",
      sub: lang === "ar" ? "أسعار مباشرة بالجنيه وحوكمة مصفوفة الصلاحيات" : "Direct EGP pricing & multi-tier budget rules",
      desc: lang === "ar"
        ? "تستعيد الفنادق الرقابة التامة على موازنات الأغذية والمفروشات والمستلزمات الهندسية. مصفوفة الصلاحيات تمنع الشراء العشوائي، وتتبع سلسلة التبريد يحمي سلامة الغذاء، وسند الاستلام يضمن عدم دفع مليم قبل التأكد من سلامة البضاعة."
        : "Hotels eliminate procurement leakage across F&B, Housekeeping, Guest Amenities and Engineering. Multi-tier authority rules prevent rogue off-contract spend, live temperature tracking protects food safety, and on-dock receipt ensures payment only for intact deliveries.",
      video: TAB_VIDEOS.hotels.src,
      badge: "FOR HOTELS & RESORTS",
      bullets: [
        lang === "ar" ? "أسعار معلنة بالجنيه مباشرة من المصنع" : "Transparent direct-from-source EGP pricing",
        lang === "ar" ? "مصفوفة صلاحيات آلية تمنع تجاوز الموازنة" : "Multi-tier approval matrix stops rogue spend",
        lang === "ar" ? "تتبع حي لدرجات الحرارة ومواعيد الوصول" : "Real-time cold-chain & delivery compliance",
      ],
    },
  ];

  const curr = steps[ch];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-ink-950 text-white shadow-2xl">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <div className="kicker text-brass-300">
              {lang === "ar" ? "جولة تعليمية تفاعلية" : "EDUCATIONAL BRIEFING"}
            </div>
            <div className="text-lg font-bold text-white">{curr.title}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-ink-300 hover:bg-white/10 hover:text-white"
          >
            <IcX className="text-xl" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid flex-1 gap-6 overflow-y-auto p-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/15 bg-black">
              <video
                src={curr.video}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
              <div className="absolute start-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-brass-300 backdrop-blur">
                {curr.badge}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            <div className="text-sm font-semibold text-brass-200">{curr.sub}</div>
            <p className="text-xs leading-relaxed text-ink-200">{curr.desc}</p>
            <div className="space-y-2 border-t border-white/10 pt-3">
              {curr.bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-white">
                  <IcCheck className="text-sm text-emerald-400 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Scrubber */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/5 px-6 py-3.5">
          <div className="flex gap-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setCh(idx as 0 | 1 | 2)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  ch === idx
                    ? "bg-brass-400 text-ink-950"
                    : "border border-white/15 text-ink-300 hover:text-white"
                }`}
              >
                {idx === 0
                  ? lang === "ar" ? "الدور المميّز" : "1. Neutral Role"
                  : idx === 1
                  ? lang === "ar" ? "للمورّدين" : "2. For Suppliers"
                  : lang === "ar" ? "للفنادق" : "3. For Hotels"}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-ink-950 hover:bg-ink-100"
          >
            {lang === "ar" ? "إغلاق الجولة" : "Done with briefing"}
          </button>
        </div>
      </div>
    </div>
  );
}
