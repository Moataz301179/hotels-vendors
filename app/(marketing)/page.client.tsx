"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  FileText,
  CheckCircle2,
  Truck,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  Package,
  MapPin,
  Building2,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   SCROLL ANIMATION HOOK
   ────────────────────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".animate-on-scroll");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ──────────────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────────────── */
export default function MarketingPage() {
  useScrollReveal();
  const { locale } = useLanguage();
  const [layer, setLayer] = useState<"hv" | "invo">("hv");
  const [tab, setTab] = useState<"hotel" | "vendor" | "chat">("hotel");

  const ar = locale === "ar";

  return (
    <main className="min-h-screen bg-[#0c0c12] text-white font-sans">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background: hotel room photo with dark overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1920&q=80&fm=webp"
            alt=""
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c12] via-[#0c0c12]/85 to-[#0c0c12]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-transparent to-[#0c0c12]/30" />
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(57,255,126,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,126,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 60% 50% at 70% 50%, black 10%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 70% 50%, black 10%, transparent 70%)",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Copy */}
          <div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wider uppercase mb-6 border animate-fade-in ${ar ? "" : ""}`} style={{ borderColor: "#39ff7e44", background: "#39ff7e0a", color: "#39ff7e" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#39ff7e] animate-pulse" />
              {ar ? "مصر والشرق الأوسط — منصة مشتريات فندقية بالذكاء الاصطناعي" : "Egypt & MENA — AI-Native B2B Hotel Procurement"}
            </div>

            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6 animate-fade-in-up ${ar ? "" : ""}`}>
              {ar ? (
                <>بنية المشتريات<br />الفندقية<span className="text-[#39ff7e]">.</span></>
              ) : (
                <>Hotel Procurement<br />Infrastructure<span className="text-[#39ff7e]">.</span></>
              )}
            </h1>

            <p className={`text-lg md:text-xl text-white/70 max-w-lg mb-8 leading-relaxed animate-fade-in-up animation-delay-100 ${ar ? "" : ""}`}>
              {ar
                ? "الفنادق والموردون والخدمات اللوجستية والتمويل — كلها في منصة واحدة موحدة ومتوافقة مع الهيئة الضريبية."
                : "Hotels, suppliers, logistics, and capital — unified on one AI-governed, ETA-compliant platform."}
            </p>

            <div className="flex flex-wrap gap-3 mb-10 animate-fade-in-up animation-delay-200">
              <span className="px-3 py-1 rounded-full border text-xs font-medium" style={{ borderColor: "#39ff7e44", color: "#39ff7e", background: "#39ff7e0a" }}>ETA</span>
              <span className="px-3 py-1 rounded-full border text-xs font-medium" style={{ borderColor: "#ff7e1a44", color: "#ff7e1a", background: "#ff7e1a0a" }}>FRA</span>
              <span className="px-3 py-1 rounded-full border text-xs font-medium" style={{ borderColor: "#c455ff44", color: "#c455ff", background: "#c455ff0a" }}>ISO 27001</span>
              <span className="px-3 py-1 rounded-full border text-xs font-medium" style={{ borderColor: "#39ff7e44", color: "#39ff7e", background: "#39ff7e0a" }}>{ar ? "مجاني للبدء" : "Free to Start"}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-300">
              <Link href="/register" className={`text-sm px-8 py-3.5 font-semibold rounded-lg inline-flex items-center justify-center gap-2 bg-[#39ff7e] text-[#07090f] hover:bg-[#5fff9a] transition-colors ${ar ? "" : ""}`}>
                {ar ? "ابدأ مجاناً" : "Start Free"}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
              <Link href="/sandbox" className={`text-sm px-8 py-3.5 font-semibold rounded-lg border inline-flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] transition-colors ${ar ? "" : ""}`} style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                {ar ? "جرّب المنصة" : "Explore Sandbox"}
              </Link>
            </div>
          </div>

          {/* Right: Product UI Mockup */}
          <div className="hidden lg:block animate-fade-in-up animation-delay-400">
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl" style={{ boxShadow: "0 0 80px 2px rgba(57,255,126,0.06)" }}>
              {/* Mac-style title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#12121a] border-b border-white/[0.06]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#39ff7e" }} />
                <div className="flex-1 mx-3 bg-[#0c0c12]/60 rounded-md px-3 py-1 text-[11px] text-white/30 border border-white/[0.04] text-center font-mono">
                  app.hotelsvendors.com
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="bg-[#0c0c12] p-5">
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-white">Meridian Hotels</div>
                    <div className="text-[11px] text-white/40">3 properties · AI Forecast: <span className="text-[#39ff7e]">↓ 8% savings</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-[#39ff7e] text-[#07090f]">AI Assist</div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: ar ? "الطلبات" : "Orders", value: "34", color: "#39ff7e", sub: "+8%" },
                    { label: ar ? "المصروف" : "Spend", value: "$182K", color: "#ff7e1a", sub: ar ? "التوقع: $168K" : "Forecast: $168K" },
                    { label: ar ? "الموردون" : "Vendors", value: "47", color: "#c455ff", sub: "INVO" },
                    { label: ar ? "التمويل" : "Factoring", value: "6", color: "#39ff7e", sub: ar ? "48 ساعة" : "48h payout" },
                  ].map((c) => (
                    <div key={c.label} className="rounded-lg border border-white/[0.04] bg-[#12121a]/60 p-3">
                      <div className="text-[10px] text-white/35 mb-1">{c.label}</div>
                      <div className="text-base font-semibold text-white">{c.value}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: c.color }}>{c.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Orders table */}
                <div className="rounded-lg border border-white/[0.04] bg-[#12121a]/40 overflow-hidden">
                  <div className="px-3 py-2 border-b border-white/[0.04] flex items-center justify-between">
                    <span className="text-[11px] font-medium text-white/60">{ar ? "الطلبات الأخيرة" : "Recent Orders"}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#39ff7e]/30 text-[#39ff7e]">{ar ? "متوافق" : "ETA Verified"}</span>
                  </div>
                  {[
                    { vendor: "Luxe Linen Co.", item: ar ? "ملاءات قطن مصري × 200" : "Egyptian Cotton Sheets × 200", price: "$14,400", status: ar ? "تم التوصيل" : "Delivered", color: "#39ff7e" },
                    { vendor: "ProClean Supplies", item: ar ? "حزم مرافق صديقة للبيئة × 500" : "Eco Amenity Kits × 500", price: "$3,250", status: ar ? "في الطريق" : "In Transit", color: "#ff7e1a" },
                    { vendor: "GourmetSource", item: ar ? "قهوة مميزة × 50 كجم" : "Premium Coffee Blend × 50kg", price: "$2,100", status: ar ? "تمويل نشط" : "Factoring Active", color: "#c455ff" },
                  ].map((o, i) => (
                    <div key={i} className={`flex items-center justify-between px-3 py-2.5 text-[11px] ${i < 2 ? "border-b border-white/[0.03]" : ""}`}>
                      <div>
                        <div className="font-medium text-white">{o.vendor}</div>
                        <div className="text-white/35">{o.item}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">{o.price}</div>
                        <div style={{ color: o.color }}>{o.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST BAR — Client Logos ═══════════ */}
      <section className="py-8 border-y border-white/[0.04] bg-[#0a0a10]">
        <div className="max-w-6xl mx-auto px-6">
          <p className={`text-center text-xs text-white/25 uppercase tracking-widest mb-6 ${ar ? "" : ""}`}>
            {ar ? "يثق بنا أكبر الفنادق والمجموعات" : "Trusted by leading hotel groups across Egypt"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-30">
            {["Mövenpick", "IHG", "Sofitel", "Marriott", "Hilton", "Kempinski"].map((name) => (
              <span key={name} className="text-sm md:text-base font-semibold tracking-wider uppercase text-white/50">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="relative py-14 animate-on-scroll">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: ar ? "مجاني" : "Free", label: ar ? "للبدء — بدون اشتراك" : "To Start — No Subscription", color: "#39ff7e" },
            { value: "1%", label: ar ? "على التحويلات البنكية" : "On Bank Transfers", color: "#ff7e1a" },
            { value: "1.5–3%", label: ar ? "رسوم التمويل" : "On Factoring Services", color: "#c455ff" },
            { value: "48h", label: ar ? "دفع التمويل العكسي" : "Reverse Factoring Payout", color: "#39ff7e" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl mb-1 font-semibold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-white/40 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ PRODUCT SHOWCASE ═══════════ */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 animate-on-scroll">
          <span className={`text-xs tracking-widest uppercase ${ar ? "" : ""}`} style={{ color: "#ff7e1a" }}>
            {ar ? "كل ما يحتاجه فندقك" : "Every Category. One Platform."}
          </span>
          <h2 className={`text-3xl md:text-4xl mt-3 mb-3 text-white font-semibold ${ar ? "" : ""}`}>
            {ar ? "كل ما يحتاجه فندقك — في مكان واحد" : "Source Everything Your Hotel Needs"}
          </h2>
          <p className={`text-white/45 text-base max-w-xl mx-auto text-balance ${ar ? "" : ""}`}>
            {ar
              ? "من المفروشات الفاخرة إلى معدات المطابخ التجارية — احصل على كل ما تحتاجه عبر موردين موثوقين."
              : "From premium linens to commercial kitchen equipment — source everything through verified suppliers."}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {[
            { img: "photo-1631049307264-da0ec9d70304", name: ar ? "مفروشات فاخرة" : "Premium Linens", price: ar ? "من 450 ج.م / وحدة" : "From EGP 450/unit", color: "#39ff7e" },
            { img: "photo-1584132967334-10e028bd69f7", name: ar ? "مرافق الحمام" : "Bathroom Amenities", price: ar ? "من 35 ج.م / طقم" : "From EGP 35/set", color: "#ff7e1a" },
            { img: "photo-1556909114-f6e7ad7d3136", name: ar ? "معدات المطبخ" : "Kitchen Equipment", price: ar ? "من 2,100 ج.م" : "From EGP 2,100", color: "#c455ff" },
            { img: "photo-1585421514284-efb74c2b69ba", name: ar ? "مواد التنظيف" : "Cleaning Supplies", price: ar ? "من 80 ج.م / لتر" : "From EGP 80/L", color: "#39ff7e" },
            { img: "photo-1596394516093-501ba68a0ba6", name: ar ? "أثاث الغرف" : "Guest Room Furniture", price: ar ? "من 3,500 ج.م" : "From EGP 3,500", color: "#ff7e1a" },
            { img: "photo-1563453392212-326f5e854473", name: ar ? "التكييف والهندسة" : "HVAC & Engineering", price: ar ? "من 15,000 ج.م" : "From EGP 15,000", color: "#c455ff" },
            { img: "photo-1582719478250-c89cae4dc85b", name: ar ? "مفروشات السرير" : "Hotel Bedding", price: ar ? "من 1,200 ج.م" : "From EGP 1,200", color: "#39ff7e" },
            { img: "photo-1571896349842-33c89424de2d", name: ar ? "السبا والمسابح" : "Pool & Spa Supplies", price: ar ? "من 550 ج.م" : "From EGP 550", color: "#ff7e1a" },
          ].map((p) => (
            <div key={p.name} className="animate-on-scroll group">
              <div className="rounded-xl border overflow-hidden bg-[#12121a] transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: `${p.color}22` }}>
                <div className="relative h-36 overflow-hidden">
                  <img src={`https://images.unsplash.com/${p.img}?w=400&q=75&fm=webp`} alt={p.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300" width={400} height={144} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent" />
                </div>
                <div className="px-4 py-3">
                  <div className={`text-sm font-semibold text-white mb-0.5 ${ar ? "" : ""}`}>{p.name}</div>
                  <div className="text-xs" style={{ color: `${p.color}cc` }}>{p.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how" className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 animate-on-scroll">
          <span className={`text-xs tracking-widest uppercase ${ar ? "" : ""}`} style={{ color: "#39ff7e" }}>
            {ar ? "كيف تعمل المنصة" : "How It Works"}
          </span>
          <h2 className={`text-3xl md:text-4xl mt-3 mb-3 text-white font-semibold ${ar ? "" : ""}`}>
            {ar ? "ابدأ مجاناً. تواصل بذكاء." : "Start Free. Transact Smart."}
          </h2>
          <p className={`text-white/45 text-base max-w-2xl mx-auto text-balance ${ar ? "" : ""}`}>
            {ar
              ? "بدون اشتراك. بدون تكلفة إعداد. وكلاء الذكاء الاصطناعي يرشدونك من التسجيل إلى أول معاملة متوافقة."
              : "No subscription. No setup cost. Our AI agents guide you from registration to your first compliant transaction."}
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-5 stagger-children">
          {[
            { num: "01", color: "#39ff7e", title: ar ? "الفنادق تنضم مجاناً" : "Hotels Join Free", desc: ar ? "سجّل مجموعتك على HotelsVendors. وكلاء الذكاء الاصطناعي يرشدونك عبر امتثال الهيئة الضريبية في دقائق." : "Register your property group. AI agents guide you through ETA-compliant onboarding in minutes." },
            { num: "02", color: "#ff7e1a", title: ar ? "اكتشف على INVO" : "Discover on INVO", desc: ar ? "تصفح INVO — سوق الموردين المدمج عبر APIs. ابحث، قارن، واطلب." : "Browse INVO — our vendor marketplace aggregated via APIs. Find, compare, and order." },
            { num: "03", color: "#c455ff", title: ar ? "الدفع والتحصيل" : "Checkout & Pay", desc: ar ? "HotelsVendors يتعامل مع الدفع متعدد العملات والتحويلات البنكية. وكلاء الذكاء الاصطناعي يتنبأون بمصروفاتك." : "Handles multi-currency payments and bank transfers. AI agents forecast your spend and flag gaps." },
            { num: "04", color: "#39ff7e", title: ar ? "الموردون يحصلون على أموالهم بسرعة" : "Suppliers Get Paid Fast", desc: ar ? "الموردون يطلبون التمويل العكسي. وكلاء المجمع يتحققون ويصدّقون ويصرفون خلال 48 ساعة." : "Vendors request reverse factoring. Swarm agents validate and disburse within 48 hours." },
          ].map((s) => (
            <div key={s.num} className="animate-on-scroll">
              <div
                className="neon-card relative rounded-2xl border bg-[#12121a] p-5 h-full flex flex-col"
                style={{ borderColor: `${s.color}33` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 18px 2px ${s.color}30, inset 0 0 20px 0px ${s.color}08`; e.currentTarget.style.borderColor = `${s.color}88`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${s.color}33`; }}
              >
                <div className="text-3xl mb-3 opacity-15 font-semibold" style={{ color: s.color }}>{s.num}</div>
                <div className={`text-sm mb-2 font-medium ${ar ? "" : ""}`} style={{ color: s.color }}>{s.title}</div>
                <p className={`text-white/45 text-xs leading-relaxed flex-1 ${ar ? "" : ""}`}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ DUAL LAYERS ═══════════ */}
      <section id="invo" className="py-24 border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 animate-on-scroll">
            <span className={`text-xs font-semibold tracking-widest uppercase ${ar ? "" : ""}`} style={{ color: "#c455ff" }}>
              {ar ? "بنية مزدوجة الطبقات" : "Dual-Layer Architecture"}
            </span>
            <h2 className={`text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-white ${ar ? "" : ""}`}>
              {ar ? "منصتان. شبكة واحدة." : "Two Platforms. One Network."}
            </h2>
            <p className={`text-white/45 text-lg max-w-2xl mx-auto text-balance ${ar ? "" : ""}`}>
              {ar
                ? "كل طبقة لها مساحة عمل وقاعدة مستخدمين وهدف — مترابطة وكلاء ذكاء اصطناعي وبنية تسوية مشتركة."
                : "Each layer has its own workspace, user base, and purpose — connected by AI agents and shared settlement infrastructure."}
            </p>
          </div>

          {/* Layer switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex border rounded-xl p-1 gap-1 bg-[#0c0c12]" style={{ borderColor: "#39ff7e33" }}>
              <button onClick={() => setLayer("hv")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${ar ? "" : ""}`} style={{ background: layer === "hv" ? "#39ff7e" : "transparent", color: layer === "hv" ? "#07090f" : "rgba(160,160,176,1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /></svg>
                HotelsVendors
              </button>
              <button onClick={() => setLayer("invo")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${ar ? "" : ""}`} style={{ background: layer === "invo" ? "#ff7e1a" : "transparent", color: layer === "invo" ? "#07090f" : "rgba(160,160,176,1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                INVO
              </button>
            </div>
          </div>

          {/* HotelsVendors Layer */}
          {layer === "hv" && (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-widest uppercase mb-4 ${ar ? "" : ""}`} style={{ borderColor: "#39ff7e44", color: "#39ff7e", background: "#39ff7e10" }}>
                  {ar ? "طبقة الفنادق" : "Hotel Layer"}
                </div>
                <h3 className={`text-3xl font-extrabold mb-4 text-white ${ar ? "" : ""}`}>
                  {ar ? "دماغ المشتريات والدفع" : "The Checkout & Payments Brain"}
                </h3>
                <p className={`text-white/45 leading-relaxed mb-6 ${ar ? "" : ""}`}>
                  {ar
                    ? "HotelsVendors هو مساحة العمل الموجهة للفنادق. يجمع المشتريات، يتنبأ بالإنفاق، يعالج المدفوعات، ويوفر خدمات التمويل والامتثال — كلها مدعومة بكلاء الذكاء الاصطناعي."
                    : "HotelsVendors is the hotel-facing workspace. It aggregates procurement, forecasts spending, processes payments via integrated gateways, and gives access to factoring and compliance services — all powered by AI."}
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    ar ? "تنبأ ذكي بالإنفاق وتنبيهات الميزانية" : "AI-powered spend forecasting and budget alerts",
                    ar ? "دفع متعدد البوابات (بطاقات، SWIFT، بنوك محلية)" : "Multi-gateway checkout (cards, SWIFT, local banks)",
                    ar ? "طلبات التمويل العكسي مع تلقائي الصلاحيات" : "Reverse factoring requests with automated authorisation",
                    ar ? "محرك امتثال ETA و FRA مدمج" : "ETA & FRA compliance engine built-in",
                    ar ? "كلاء المجمع يتعاملون مع التوثيق في كل مرحلة" : "Swarm agents handle documentation at every stage",
                  ].map((t) => (
                    <li key={t} className={`flex items-start gap-2 text-sm text-white ${ar ? "" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#39ff7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M20 6 9 17l-5-5" /></svg>{t}</li>
                  ))}
                </ul>
                <Link href="/marketplace" className={`mt-8 font-semibold gap-2 cursor-pointer rounded-lg text-sm px-6 py-3 inline-flex items-center bg-[#39ff7e] text-[#07090f] hover:bg-[#5fff9a] transition-colors ${ar ? "" : ""}`}>
                  {ar ? "استكشف HotelsVendors" : "Explore HotelsVendors"} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
              </div>
              <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: "#39ff7e33", boxShadow: "0 0 40px 2px #39ff7e18" }}>
                <img src="https://images.unsplash.com/photo-1646645409452-866ad2fb64e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Hotel procurement dashboard" className="w-full h-72 object-cover opacity-70" width={1080} height={400} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl border backdrop-blur-sm" style={{ borderColor: "#39ff7e44", background: "rgba(7,9,15,0.75)" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "#39ff7e" }}>app.hotelsvendors.com/hotel/dashboard</div>
                  <div className={`text-sm font-semibold text-white ${ar ? "" : ""}`}>{ar ? "مركز المشتريات الفندقية — بالذكاء الاصطناعي" : "Hotel Procurement Hub — AI-Powered"}</div>
                </div>
              </div>
            </div>
          )}

          {/* INVO Layer */}
          {layer === "invo" && (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-widest uppercase mb-4 ${ar ? "" : ""}`} style={{ borderColor: "#ff7e1a44", color: "#ff7e1a", background: "#ff7e1a10" }}>
                  {ar ? "طبقة سوق الموردين" : "Vendor Marketplace Layer"}
                </div>
                <h3 className={`text-3xl font-extrabold mb-4 text-white ${ar ? "" : ""}`}>
                  {ar ? "سوق المشتريات B2B" : "The B2B Procurement Marketplace"}
                </h3>
                <p className={`text-white/45 leading-relaxed mb-6 ${ar ? "" : ""}`}>
                  {ar
                    ? "INVO هو الطبقة الموجهة للموردين — سوق ذكي مدمج من شبكات شركاء عبر APIs و Plugins. الموردون يعرضون كتالوجاتهم، الفنادق تكتشف وتطلب، وكل معاملة تمر عبر HotelsVendors للتسوية."
                    : "INVO is the vendor-facing sub-layer — a smart marketplace aggregated from partner networks via APIs and plugins. Suppliers list catalogs, hotels discover and order, and every transaction flows to HotelsVendors for settlement."}
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    ar ? "تكامل سلس مع أسواق الموردين الحالية" : "Plug-and-play integration with existing supplier marketplaces",
                    ar ? "الروبوت يساعد الفنادق في إيجاد المورد المناسب" : "AI chatbot helps hotels find the right vendor instantly",
                    ar ? "تسجيل الموردين في أقل من 24 ساعة" : "Vendor onboarding in under 24 hours",
                    ar ? "أمان بيانات بمعايير ISO" : "ISO-certified data security and fraud protection",
                    ar ? "كل الفواتير متوافقة مع الهيئة الضريبية" : "All invoicing is ETA-compliant by default",
                  ].map((t) => (
                    <li key={t} className={`flex items-start gap-2 text-sm text-white ${ar ? "" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff7e1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M20 6 9 17l-5-5" /></svg>{t}</li>
                  ))}
                </ul>
                <Link href="/marketplace" className={`mt-8 font-semibold gap-2 cursor-pointer rounded-lg text-sm px-6 py-3 inline-flex items-center bg-[#ff7e1a] text-[#07090f] hover:bg-[#ff9640] transition-colors ${ar ? "" : ""}`}>
                  {ar ? "استكشف INVO" : "Explore INVO"} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
              </div>
              <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: "#ff7e1a33", boxShadow: "0 0 40px 2px #ff7e1a18" }}>
                <img src="https://images.unsplash.com/photo-1690935986319-c11e6cae84f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="INVO vendor marketplace" className="w-full h-72 object-cover opacity-70" width={1080} height={400} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl border backdrop-blur-sm" style={{ borderColor: "#ff7e1a44", background: "rgba(7,9,15,0.75)" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "#ff7e1a" }}>app.hotelsvendors.com/invo/marketplace</div>
                  <div className={`text-sm font-semibold text-white ${ar ? "" : ""}`}>{ar ? "سوق INVO للموردين — مباشر" : "INVO Vendor Marketplace — Live"}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ AI AGENTS ═══════════ */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 animate-on-scroll">
          <span className={`text-xs font-semibold tracking-widest uppercase ${ar ? "" : ""}`} style={{ color: "#ff7e1a" }}>
            {ar ? "مدعوم بالذكاء الاصطناعي" : "AI-Powered"}
          </span>
          <h2 className={`text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-white ${ar ? "" : ""}`}>
            {ar ? "كلاء المجمع يتعاملون مع التعقيد" : "Swarm Agents Handle the Complexity"}
          </h2>
          <p className={`text-white/45 text-lg max-w-2xl mx-auto text-balance ${ar ? "" : ""}`}>
            {ar
              ? "انت تركز على الضيافة. وكلاء الذكاء الاصطناعي يتعاملون مع الامتثال والتوثيق ومطابقة الموردين والتنبؤ بالإنفاق وعمليات التمويل — تلقائياً."
              : "You focus on hospitality. Our AI swarm handles compliance, documentation, vendor matching, spend forecasting, and factoring — automatically."}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 stagger-children">
          {[
            { color: "#39ff7e", title: ar ? "وكيل التسجيل" : "Onboarding Agent", desc: ar ? "يرشد الفنادق والموردين عبر تسجيل الهيئة الضريبية واستلام المستندات — بالمحادثة." : "Guides hotels and vendors through ETA registration and document collection — conversationally." },
            { color: "#c455ff", title: ar ? "وكيل التنبؤ بالإنفاق" : "Spend Forecast Agent", desc: ar ? "يحلل الطلبات التاريخية للتنبأ بتكاليف المشتريات المستقبلية وتنبيهك قبل تجاوز الميزانية." : "Analyses historical orders to predict future costs and flag budget overruns before they happen." },
            { color: "#ff7e1a", title: ar ? "مجمع الامتثال" : "Compliance Swarm", desc: ar ? "cluster من وكلاء متخصصين يفحص كل معاملة ضد معايير ETA و FRA ويوثق التوثيق المطلوب." : "Specialised agents audit every transaction against ETA and FRA standards, generating required documentation." },
            { color: "#39ff7e", title: ar ? "وكيل التمويل العكسي" : "Factoring Workflow Agent", desc: ar ? "ينظم التمويل العكسي من الطلب إلى الصرف خلال 48 ساعة — مع التحقق الكامل من FRA." : "Orchestrates reverse factoring end-to-end — request, approval, FRA validation, and 48h disbursement." },
            { color: "#c455ff", title: ar ? "روبوت المشتريات" : "AI Procurement Chatbot", desc: ar ? "الفنادق تصف ما تحتاجه باللغة العادية. الروبوت يبحث في INVO ويقارن ويولّد طلب شراء جاهز." : "Hotels describe needs in plain language. Chatbot searches INVO, compares vendors, generates ready-to-approve orders." },
            { color: "#ff7e1a", title: ar ? "وكيل التكامل" : "Integration Agent", desc: ar ? "يتصل بـ APIs وأسواق شريكة تلقائياً وينقل كتالوجات الموردين إلى بنية INVO الموحدة." : "Connects to external marketplace APIs automatically, mapping catalogs into INVO's unified structure." },
          ].map((a) => (
            <div key={a.title} className="animate-on-scroll">
              <div
                className="neon-card rounded-2xl border bg-[#12121a] p-5 h-full"
                style={{ borderColor: `${a.color}33` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 18px 2px ${a.color}30, inset 0 0 20px 0px ${a.color}08`; e.currentTarget.style.borderColor = `${a.color}88`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${a.color}33`; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border" style={{ background: `${a.color}15`, borderColor: `${a.color}40`, color: a.color }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                </div>
                <div className={`font-semibold text-sm mb-2 text-white ${ar ? "" : ""}`}>{a.title}</div>
                <p className={`text-white/45 text-xs leading-relaxed ${ar ? "" : ""}`}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ DEMO SANDBOX ═══════════ */}
      <section className="py-20 border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10 animate-on-scroll">
            <span className={`text-xs tracking-widest uppercase ${ar ? "" : ""}`} style={{ color: "#39ff7e" }}>
              {ar ? "تجربة تجريبية" : "Sandbox Demo"}
            </span>
            <h2 className={`text-3xl md:text-4xl mt-3 mb-3 text-white font-semibold ${ar ? "" : ""}`}>
              {ar ? "استكشف قبل أن تلتزم" : "Explore Before You Commit"}
            </h2>
            <p className={`text-white/45 text-sm max-w-xl mx-auto ${ar ? "" : ""}`}>
              {ar
                ? "بدون حساب. استكشف لوحة تحكم الفندق وسوق الموردين وروبوت المشتريات — كلها آمنة وتجريبية."
                : "No account needed. Experience the hotel dashboard, vendor marketplace, and AI chatbot — all sandboxed."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 flex-wrap gap-2">
            {([
              { key: "hotel" as const, label: ar ? "لوحة الفندق" : "Hotel Dashboard", color: "#39ff7e" },
              { key: "vendor" as const, label: ar ? "سوق INVO" : "INVO Marketplace", color: "#ff7e1a" },
              { key: "chat" as const, label: ar ? "روبوت الذكاء الاصطناعي" : "AI Chatbot", color: "#c455ff" },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${ar ? "" : ""}`}
                style={{
                  background: tab === t.key ? t.color : "transparent",
                  color: tab === t.key ? "#07090f" : "rgba(160,160,176,1)",
                  borderColor: tab === t.key ? t.color : `${t.color}33`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Hotel Dashboard Tab */}
          {tab === "hotel" && (
            <div className="rounded-2xl border overflow-hidden bg-[#0c0c12]" style={{ borderColor: "#39ff7e44", boxShadow: "0 0 40px 2px #39ff7e14" }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#12121a]/60">
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#39ff7e" }} />
                <div className="flex-1 mx-4 bg-[#0c0c12]/50 rounded px-3 py-1 text-xs text-white/45 border border-white/[0.06]/50 font-mono">app.hotelsvendors.com/hotels/dashboard</div>
              </div>
              <div className="p-6 min-h-[440px]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-lg text-white">{ar ? "فنادق ميريديان — مركز المشتريات" : "Meridian Hotels — Procurement Hub"}</h3>
                    <p className="text-white/45 text-sm">{ar ? "3 عقارات · توقع الذكاء الاصطناعي" : "3 properties · AI Spend Forecast:"} <span style={{ color: "#39ff7e" }}>{ar ? "↓ 8% مقابل الربع الماضي" : "↓ 8% vs last quarter"}</span></p>
                  </div>
                  <button className={`text-sm px-4 py-2 font-semibold cursor-pointer rounded-md inline-flex items-center gap-1 bg-[#39ff7e] text-[#07090f] ${ar ? "" : ""}`}>{ar ? "مساعدة الذكاء الاصطناعي" : "AI Assist"}</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: ar ? "الطلبات النشطة" : "Active Orders", value: "34", color: "#39ff7e", sub: "+8%" },
                    { label: ar ? "المصروف الشهري" : "Monthly Spend", value: "$182K", color: "#ff7e1a", sub: ar ? "التوقع: $168K" : "Forecast: $168K" },
                    { label: ar ? "شبكة الموردين" : "Vendor Network", value: "47", color: "#c455ff", sub: "via INVO" },
                    { label: ar ? "طلبات التمويل" : "Factoring Requests", value: "6", color: "#39ff7e", sub: ar ? "2 معلقة — 48 ساعة" : "2 pending 48h" },
                  ].map((c) => (
                    <div key={c.label} className="rounded-xl border bg-[#12121a] p-4" style={{ borderColor: `${c.color}33` }}>
                      <div className="text-xs text-white/45 mb-1">{c.label}</div>
                      <div className="text-2xl font-semibold text-white">{c.value}</div>
                      <div className="text-xs mt-1" style={{ color: c.color }}>{c.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border bg-[#12121a] overflow-hidden" style={{ borderColor: "#39ff7e22" }}>
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">{ar ? "الطلبات الأخيرة — متوافقة مع الهيئة الضريبية" : "Recent Orders — ETA Compliant"}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: "#39ff7e44", color: "#39ff7e" }}>{ar ? "الكل موثق" : "All verified"}</span>
                  </div>
                  {[
                    { vendor: "Luxe Linen Co.", item: ar ? "ملاءات قطن مصري × 200" : "Egyptian Cotton Sheets × 200", price: "$14,400", status: ar ? "تم التوصيل" : "Delivered", color: "#39ff7e" },
                    { vendor: "ProClean Supplies", item: ar ? "حزم مرافق صديقة للبيئة × 500" : "Eco Amenity Kits × 500", price: "$3,250", status: ar ? "في الطريق" : "In Transit", color: "#ff7e1a" },
                    { vendor: "GourmetSource", item: ar ? "قهوة مميزة × 50 كجم" : "Premium Coffee Blend × 50kg", price: "$2,100", status: ar ? "تمويل نشط" : "Factoring Active", color: "#c455ff" },
                  ].map((o, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i < 2 ? "border-b border-white/[0.04]" : ""}`}>
                      <div><div className="font-medium text-white">{o.vendor}</div><div className="text-white/45 text-xs">{o.item}</div></div>
                      <div className="text-right"><div className="font-semibold text-white">{o.price}</div><div className="text-xs" style={{ color: o.color }}>{o.status}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vendor Tab */}
          {tab === "vendor" && (
            <div className="rounded-2xl border overflow-hidden bg-[#0c0c12]" style={{ borderColor: "#ff7e1a44", boxShadow: "0 0 40px 2px #ff7e1a14" }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#12121a]/60">
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#39ff7e" }} />
                <div className="flex-1 mx-4 bg-[#0c0c12]/50 rounded px-3 py-1 text-xs text-white/45 border border-white/[0.06]/50 font-mono">app.hotelsvendors.com/invo/marketplace</div>
              </div>
              <div className="p-6 min-h-[440px]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-lg text-white">{ar ? "سوق INVO — بوابة الموردين" : "INVO Marketplace — Vendor Portal"}</h3>
                    <p className="text-white/45 text-sm">{ar ? "مدمج من 14 شبكة شريكة" : "Aggregated from 14 partner networks"} · <span style={{ color: "#ff7e1a" }}>{ar ? "340 مشترٍ فندقي نشط" : "340 active hotel buyers"}</span></p>
                  </div>
                  <button className={`text-sm px-4 py-2 font-semibold cursor-pointer rounded-md bg-[#ff7e1a] text-[#07090f] ${ar ? "" : ""}`}>{ar ? "+ عرض المنتجات" : "+ List Products"}</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: ar ? "مشترو فندقيون" : "Hotel Buyers", value: "340", color: "#ff7e1a" },
                    { label: "MRR", value: "$94K", color: "#39ff7e" },
                    { label: ar ? "متوسط الطلب" : "Avg. Order", value: "$2.8K", color: "#c455ff" },
                    { label: ar ? "نسبة إعادة الطلب" : "Reorder Rate", value: "74%", color: "#ff7e1a" },
                  ].map((c) => (
                    <div key={c.label} className="rounded-xl border bg-[#12121a] p-4" style={{ borderColor: `${c.color}33` }}>
                      <div className="text-xs text-white/45 mb-1">{c.label}</div>
                      <div className="text-2xl font-semibold text-white">{c.value}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border bg-[#12121a] overflow-hidden" style={{ borderColor: "#ff7e1a22" }}>
                  <div className="px-4 py-3 border-b border-white/[0.06] font-semibold text-sm text-white">{ar ? "أفضل المنتجات · التمويل العكسي متاح" : "Top Products · Reverse Factoring Available"}</div>
                  {[
                    { name: ar ? "ملاءات قطن مصري (كينج)" : "Egyptian Cotton Sheets (King)", units: ar ? "840 وحدة مباعة" : "840 units sold", revenue: "$120K", badge: true },
                    { name: ar ? "طقم بطانية ميكروفايبر" : "Microfibre Duvet Set", units: ar ? "620 وحدة مباعة" : "620 units sold", revenue: "$74K", badge: false },
                    { name: ar ? "حزمة مناشف مسبح (12 قطعة)" : "Pool Towel Bundle (12pk)", units: ar ? "380 وحدة مباعة" : "380 units sold", revenue: "$34K", badge: true },
                  ].map((p, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i < 2 ? "border-b border-white/[0.04]" : ""}`}>
                      <div><div className="font-medium text-white">{p.name}</div><div className="text-white/45 text-xs">{p.units}</div></div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold" style={{ color: "#39ff7e" }}>{p.revenue}</span>
                        {p.badge && <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: "#ff7e1a55", color: "#ff7e1a" }}>⚡ 48h</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {tab === "chat" && (
            <div className="rounded-2xl border overflow-hidden bg-[#0c0c12]" style={{ borderColor: "#c455ff44", boxShadow: "0 0 40px 2px #c455ff14" }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#12121a]/60">
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ background: "#39ff7e" }} />
                <div className="flex-1 mx-4 bg-[#0c0c12]/50 rounded px-3 py-1 text-xs text-white/45 border border-white/[0.06]/50 font-mono">app.hotelsvendors.com/ai-agent</div>
              </div>
              <div className="p-6 min-h-[440px] flex flex-col">
                <div className="flex items-center gap-3 mb-6 p-3 rounded-xl border" style={{ borderColor: "#c455ff33", background: "#c455ff08" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#c455ff20", color: "#c455ff" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">HV AI {ar ? "وكيل المشتريات" : "Procurement Agent"}</div>
                    <div className="text-xs text-white/45">{ar ? "متوافق مع الهيئة الضريبية · مرتبط بـ INVO · متاح دائماً" : "ETA-aware · INVO-connected · Always on"}</div>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: "#39ff7e" }} />
                </div>
                <div className="flex-1 flex flex-col gap-4 overflow-auto mb-4">
                  <div className="flex justify-start">
                    <div className={`max-w-xs rounded-2xl rounded-tl-none p-3 text-sm text-white ${ar ? "rounded-tr-none rounded-tl-2xl " : ""}`} style={{ background: "#c455ff18", border: "1px solid #c455ff33" }}>
                      {ar
                        ? "مرحباً! أنا وكيل المشتريات بالذكاء الاصطناعي. أستطيع مساعدتك في إيجاد موردين على INVO أو التحقق من امتثال الهيئة الضريبية أو التنبأ بإنفاقك أو بدء طلب تمويل عكسي. ماذا تحتاج اليوم؟"
                        : "Hello! I'm your AI procurement agent. I can help you find vendors on INVO, check ETA compliance, forecast your spend, or initiate a reverse factoring request. What do you need today?"}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-xs rounded-2xl rounded-tr-none p-3 text-sm bg-[#12121a] border border-white/[0.06] text-white">
                      {ar ? "أحتاج 500 وحدة من حزم المرافق المميزة لـ 3 عقارات بإجمالي أقل من $6,000." : "I need 500 units of premium amenity kits for 3 properties under $6,000 total."}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className={`max-w-sm rounded-2xl rounded-tl-none p-3 text-sm text-white ${ar ? "rounded-tr-none rounded-tl-2xl " : ""}`} style={{ background: "#c455ff18", border: "1px solid #c455ff33" }}>
                      {ar ? (
                        <>وجدت <span style={{ color: "#39ff7e" }}>4 موردين موثوقين</span> على INVO. أفضل خيار: <span style={{ color: "#ff7e1a" }}>ProClean Supplies</span> — 500 حزمة مرافق صديقة للبيئة بسعر $3,250 (فاتورة الهيئة الضريبية مرفقة). هل أُعد طلب الشراء؟</>
                      ) : (
                        <>Found <span style={{ color: "#39ff7e" }}>4 verified vendors</span> on INVO matching your criteria. Best match: <span style={{ color: "#ff7e1a" }}>ProClean Supplies</span> — 500 Eco Amenity Kits at $3,250 total (ETA invoice included). Shall I generate a purchase order?</>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-xs rounded-2xl rounded-tr-none p-3 text-sm bg-[#12121a] border border-white/[0.06] text-white">
                      {ar ? "نعم، هل يمكن للمورد طلب تمويل عكسي للدفع المبكر؟" : "Yes, and can the supplier request factoring for early payment?"}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className={`max-w-sm rounded-2xl rounded-tl-none p-3 text-sm text-white ${ar ? "rounded-tr-none rounded-tl-2xl " : ""}`} style={{ background: "#c455ff18", border: "1px solid #c455ff33" }}>
                      {ar ? (
                        <>بالتأكيد. بمجرد موافقتك على طلب الشراء، يمكن لـ ProClean تقديم <span style={{ color: "#ff7e1a" }}>طلب تمويل عكسي</span>. مجمع الامتثال لدينا سيتحقق من معايير FRA ويصرف خلال <span style={{ color: "#39ff7e" }}>48 ساعة</span>. الطلب جاهز — هل توافق الآن؟</>
                      ) : (
                        <>Absolutely. Once you approve the PO, ProClean can submit a <span style={{ color: "#ff7e1a" }}>reverse factoring request</span>. Our compliance swarm will verify it against FRA standards and disburse in <span style={{ color: "#39ff7e" }}>48 hours</span>. PO is ready — approve now?</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className={`flex-1 rounded-xl border border-white/[0.06] bg-[#12121a]/50 px-4 py-2.5 text-sm text-white/45 ${ar ? "" : ""}`}>{ar ? "اكتب طلب المشتريات..." : "Type your procurement request..."}</div>
                  <button className={`text-sm px-4 py-2 font-semibold cursor-pointer rounded-md bg-[#c455ff] text-[#07090f] ${ar ? "" : ""}`}>{ar ? "إرسال" : "Send"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ FACTORING ═══════════ */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-on-scroll">
            <span className={`text-xs font-semibold tracking-widest uppercase ${ar ? "" : ""}`} style={{ color: "#ff7e1a" }}>
              {ar ? "التمويل العكسي" : "Reverse Factoring"}
            </span>
            <h2 className={`text-4xl font-extrabold mt-3 mb-4 text-balance text-white ${ar ? "" : ""}`}>
              {ar ? "الموردون يحصلون على أموالهم خلال 48 ساعة." : "Suppliers Paid in 48 Hours. No Wait."}
            </h2>
            <p className={`text-white/45 text-lg leading-relaxed mb-8 ${ar ? "" : ""}`}>
              {ar
                ? "شروط الدفع التقليدية من 60-90 يوماً تقتل تدفق أموال الموردين. التمويل العكسي المدمج، المدعوم بكلاء الذكاء الاصطناعي والمتحقق في كل مرحلة ضد متطلبات FRA، يتيح للموردين استلام أموالهم خلال 48 ساعة — بينما تحتفظ الفنادق بجدول الدفع المعتاد."
                : "Traditional payment terms of 60–90 days kill supplier cash flow. Our embedded reverse factoring workflow, powered by AI agents and validated against FRA requirements, lets vendors redeem their money in 48 hours — while hotels keep their standard payment schedule."}
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {[
                { color: "#39ff7e", text: ar ? "المورد يقدم طلب التمويل" : "Vendor submits factoring request" },
                { color: "#ff7e1a", text: ar ? "كلاء المجمع يتحققون من الفاتورة والطلب" : "Swarm agents verify invoice & order" },
                { color: "#c455ff", text: ar ? "الفندق يوافق رقمياً عبر البوابة" : "Hotel approves digitally via portal" },
                { color: "#39ff7e", text: ar ? "تحقق تلقائي من معايير FRA" : "FRA compliance check automated" },
                { color: "#ff7e1a", text: ar ? "يتم صرف الأموال خلال 48 ساعة" : "Funds disbursed in 48 hours" },
              ].map((s) => (
                <div key={s.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0 text-xs font-semibold" style={{ borderColor: `${s.color}55`, color: s.color, background: `${s.color}10` }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                  <div className={`text-sm text-white ${ar ? "" : ""}`}>{s.text}</div>
                </div>
              ))}
            </div>
            <div className={`inline-flex items-center gap-2 text-sm font-semibold ${ar ? "" : ""}`} style={{ color: "#ff7e1a" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {ar ? "رسوم 1.5–3% فقط على التمويل — بدون رسوم خفية" : "1.5–3% fee only on factoring — no hidden charges"}
            </div>
          </div>
          <div className="flex flex-col gap-4 animate-on-scroll">
            <div
              className="neon-card rounded-2xl border bg-[#12121a] p-5"
              style={{ borderColor: "#ff7e1a33" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 18px 2px #ff7e1a30, inset 0 0 20px 0px #ff7e1a08"; e.currentTarget.style.borderColor = "#ff7e1a88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#ff7e1a33"; }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-white/45 mb-1">{ar ? "طلب تمويل رقم" : "Factoring Request"} #F-2847</div>
                  <div className="font-semibold text-white">Luxe Linen Co.</div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: "#39ff7e20", color: "#39ff7e" }}>{ar ? "نشط" : "Active"}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="rounded-lg p-2 bg-[#0c0c12]/60">
                  <div className="text-xl font-semibold" style={{ color: "#ff7e1a" }}>$14.4K</div>
                  <div className="text-xs text-white/45">{ar ? "قيمة الفاتورة" : "Invoice Value"}</div>
                </div>
                <div className="rounded-lg p-2 bg-[#0c0c12]/60">
                  <div className="text-xl font-semibold" style={{ color: "#39ff7e" }}>$13.9K</div>
                  <div className="text-xs text-white/45">{ar ? "تم الصرف" : "Disbursed"}</div>
                </div>
                <div className="rounded-lg p-2 bg-[#0c0c12]/60">
                  <div className="text-xl font-semibold" style={{ color: "#c455ff" }}>38h</div>
                  <div className="text-xs text-white/45">{ar ? "وقت الدفع" : "Time to Pay"}</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  ar ? "تم التحقق من الفاتورة بواسطة وكيل الامتثال" : "Invoice verified by compliance agent",
                  ar ? "تمت موافقة الفندق" : "Hotel approval received",
                  ar ? "اكتمل التحقق من FRA" : "FRA validation complete",
                  ar ? "تم صرف الأموال" : "Funds disbursed",
                ].map((t) => (
                  <div key={t} className={`flex items-center gap-2 text-xs text-white ${ar ? "" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#39ff7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 6 9 17l-5-5" /></svg>{t}</div>
                ))}
              </div>
            </div>

            <div
              className="neon-card rounded-2xl border bg-[#12121a] p-5"
              style={{ borderColor: "#c455ff33" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 18px 2px #c455ff30, inset 0 0 20px 0px #c455ff08"; e.currentTarget.style.borderColor = "#c455ff88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#c455ff33"; }}
            >
              <div className={`text-xs font-semibold uppercase tracking-widest mb-3 ${ar ? "" : ""}`} style={{ color: "#c455ff" }}>{ar ? "شفافية الأسعار" : "Pricing Transparency"}</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3" style={{ borderColor: "#39ff7e33" }}>
                  <div className="text-xl font-semibold" style={{ color: "#39ff7e" }}>1%</div>
                  <div className="text-xs text-white/45 mt-0.5">{ar ? "رسوم التحويل البنكي المباشر" : "Direct bank transfer fee"}</div>
                </div>
                <div className="rounded-lg border p-3" style={{ borderColor: "#ff7e1a33" }}>
                  <div className="text-xl font-semibold" style={{ color: "#ff7e1a" }}>1.5–3%</div>
                  <div className="text-xs text-white/45 mt-0.5">{ar ? "رسوم خدمة التمويل" : "Factoring service fee"}</div>
                </div>
              </div>
              <p className={`text-xs text-white/45 mt-3 ${ar ? "" : ""}`}>{ar ? "بدون اشتراك. بدون تكلفة إعداد. أنت تدفع فقط عند المعاملة." : "No subscription. No setup fee. You only pay when you transact."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COMPLIANCE ═══════════ */}
      <section className="py-24 border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 animate-on-scroll">
            <span className={`text-xs font-semibold tracking-widest uppercase ${ar ? "" : ""}`} style={{ color: "#c455ff" }}>
              {ar ? "الأمان والامتثال" : "Security & Compliance"}
            </span>
            <h2 className={`text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-white ${ar ? "" : ""}`}>
              {ar ? "مصمم للسوق المصري المنظم" : "Built for Egypt&apos;s Regulated Market"}
            </h2>
            <p className={`text-white/45 text-lg max-w-2xl mx-auto text-balance ${ar ? "" : ""}`}>
              {ar
                ? "HotelsVendors و INVO متوافقان بالكامل مع الهيئة المصرية للمعاملات الإلكترونية (ETA) وهيئة الرقابة المالية (FRA). كل معاملة وفاتورة وطلب تمويل يتم مراجعته تلقائياً."
                : "HotelsVendors and INVO are fully compliant with Egypt's Electronic Transaction Authority (ETA) and Financial Regulatory Authority (FRA). Every transaction, invoice, and factoring request is automatically audited."}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12 stagger-children">
            {[
              { color: "#39ff7e", label: "ETA" },
              { color: "#ff7e1a", label: "FRA" },
              { color: "#c455ff", label: "ISO 27001" },
              { color: "#39ff7e", label: "PCI-DSS" },
              { color: "#ff7e1a", label: "AML / KYC" },
              { color: "#c455ff", label: "GDPR" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm animate-on-scroll" style={{ borderColor: `${b.color}55`, color: b.color, background: `${b.color}10` }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                {b.label}
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div
              className="neon-card rounded-2xl border bg-[#12121a] p-5"
              style={{ borderColor: "#39ff7e33" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 18px 2px #39ff7e30, inset 0 0 20px 0px #39ff7e08"; e.currentTarget.style.borderColor = "#39ff7e88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#39ff7e33"; }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center border" style={{ background: "#39ff7e15", borderColor: "#39ff7e40", color: "#39ff7e" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
                </div>
                <div className={`font-semibold text-white ${ar ? "" : ""}`}>{ar ? "محرك امتثال الهيئة الضريبية" : "ETA Compliance Engine"}</div>
              </div>
              <p className={`text-sm text-white/45 leading-relaxed ${ar ? "" : ""}`}>
                {ar
                  ? "كل فاتورة تصدر عبر INVO تتم بنيتها تلقائياً ل meet معيار الهيئة الضريبية الإلكترونية. لا حاجة للإرسال اليدوي — وكلاء يتعاملون معها من البداية للنهاية."
                  : "Every invoice issued through INVO is automatically structured to meet Egypt's ETA electronic invoicing standard. No manual submission required — our agents handle it end-to-end."}
              </p>
            </div>
            <div
              className="neon-card rounded-2xl border bg-[#12121a] p-5"
              style={{ borderColor: "#ff7e1a33" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 18px 2px #ff7e1a30, inset 0 0 20px 0px #ff7e1a08"; e.currentTarget.style.borderColor = "#ff7e1a88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#ff7e1a33"; }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center border" style={{ background: "#ff7e1a15", borderColor: "#ff7e1a40", color: "#ff7e1a" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <div className={`font-semibold text-white ${ar ? "" : ""}`}>{ar ? "معايير FRA المالية" : "FRA Financial Standards"}</div>
              </div>
              <p className={`text-sm text-white/45 leading-relaxed ${ar ? "" : ""}`}>
                {ar
                  ? "جميع عمليات التمويل والتمويل العكسي تتم ضمن إطار FRA التنظيمي. KYC و AML ومراقبة المعاملات مدمجة في كل سير عمل."
                  : "All factoring and reverse factoring operations are conducted within the FRA regulatory framework. Automated KYC, AML screening, and transaction monitoring are embedded in every workflow."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 animate-on-scroll">
          <span className={`text-xs font-semibold tracking-widest uppercase ${ar ? "" : ""}`} style={{ color: "#39ff7e" }}>
            {ar ? "أصوات الوصول المبكر" : "Early Access Voices"}
          </span>
          <h2 className={`text-4xl md:text-5xl font-extrabold mt-3 text-white ${ar ? "" : ""}`}>
            {ar ? "ماذا يقول مستخدمونا" : "What Our Beta Users Say"}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 stagger-children">
          {[
            { color: "#39ff7e", quote: ar ? "روبوت الذكاء الاصطناعي على INVO وفّر لفريقي 3 ساعات يومياً. نصف ما تحتاجه ونحصل على طلب شراء جاهز للتوافق فوراً." : "The AI chatbot on INVO saved my team 3 hours a day. We just describe what we need and get a ready-to-approve order instantly.", name: "Sophia Müller", role: ar ? "رئيس المشتريات، فنادق ميريديان" : "Head of Procurement, Meridian Hotels", initials: "SM" },
            { color: "#ff7e1a", quote: ar ? "التمويل العكسي غيّر تدفق أموالنا بالكامل. 48 ساعة حقيقية — اختبرناها من اليوم الأول. لا مزيد من انتظار 90 يوماً." : "Reverse factoring changed our cash flow completely. 48 hours is real — we tested it on day one. No more waiting 90-day payment terms.", name: "Carlos Reyes", role: ar ? "الرئيس التنفيذي، Luxe Linen Co." : "CEO, Luxe Linen Co.", initials: "CR" },
            { color: "#c455ff", quote: ar ? "امتثال الهيئة الضريبية كان كابوساً. وكلاء المجمع يوثقون كل مستند مطلوب تلقائياً. لا أي حمل يدوي." : "ETA compliance used to be a nightmare. The swarm agents generate every required document automatically. Zero manual overhead.", name: "Aisha Nakamura", role: ar ? "مديرة المالية، سكلاين ريزورتس" : "Finance Director, Skyline Resorts", initials: "AN" },
          ].map((t) => (
            <div key={t.name} className="animate-on-scroll">
              <div
                className="neon-card rounded-2xl border bg-[#12121a] p-5 h-full flex flex-col"
                style={{ borderColor: `${t.color}33` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 18px 2px ${t.color}30, inset 0 0 20px 0px ${t.color}08`; e.currentTarget.style.borderColor = `${t.color}88`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${t.color}33`; }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={t.color} stroke={t.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  ))}
                </div>
                <p className={`text-sm text-white/45 leading-relaxed flex-1 mb-5 ${ar ? "" : ""}`}>&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border" style={{ background: `${t.color}15`, borderColor: `${t.color}44`, color: t.color }}>{t.initials}</div>
                  <div><div className="font-semibold text-sm text-white">{t.name}</div><div className="text-xs text-white/45">{t.role}</div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section className="py-24 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14 animate-on-scroll">
            <span className={`text-xs tracking-widest uppercase ${ar ? "" : ""}`} style={{ color: "#39ff7e" }}>
              {ar ? "أسعار شفافة" : "Transparent Pricing"}
            </span>
            <h2 className={`text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-white ${ar ? "" : ""}`}>
              {ar ? "ادفع فقط عند المعاملة" : "Pay Only When You Transact"}
            </h2>
            <p className={`text-white/45 text-lg ${ar ? "" : ""}`}>{ar ? "بدون اشتراكات. بدون قيود. ننمو فقط عندما تنمو." : "No subscriptions. No lock-in. We grow only when you grow."}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              { color: "#39ff7e", badge: ar ? "الفنادق والموردون" : "Hotels & Vendors", title: ar ? "منصة مجانية" : "Platform Access", price: ar ? "مجاني" : "Free", unit: ar ? "للأبد" : "Forever", features: [ar ? "لوحة تحكم كاملة" : "Full HotelsVendors dashboard", ar ? "وصول سوق INVO" : "INVO marketplace access", ar ? "روبوت وكلاء الذكاء الاصطناعي" : "AI chatbot & agents", ar ? "فوترة متوافقة مع الهيئة الضريبية" : "ETA-compliant invoicing", ar ? "مستخدمين وعقارات غير محدودة" : "Unlimited users & properties"] },
              { color: "#ff7e1a", badge: ar ? "كل أنواع الدفع" : "All payment types", title: ar ? "التحويل البنكي" : "Bank Transfer", price: "1%", unit: ar ? "لكل معاملة" : "per transaction", highlight: true, features: [ar ? "دعم العملات المتعددة" : "Multi-currency support", ar ? "تحويلات SWIFT وبنوك محلية" : "SWIFT & local bank rails", ar ? "تأكيد فوري" : "Instant confirmation", ar ? "إيصالات تلقائية" : "Auto-generated receipts", ar ? "سجل تدقيق كامل" : "Full audit trail"] },
              { color: "#c455ff", badge: ar ? "التمويل العكسي" : "Reverse factoring", title: ar ? "خدمة التمويل" : "Factoring Service", price: "1.5–3%", unit: ar ? "من قيمة الفاتورة" : "of invoice value", features: [ar ? "دفع المورد خلال 48 ساعة" : "48-hour supplier payout", ar ? "إذن بالذكاء الاصطناعي" : "AI-driven authorisation", ar ? "عملية متوافقة مع FRA" : "FRA-compliant process", ar ? "صفر ورق" : "Zero paperwork", ar ? "خيار جوكер — استخدم في أي وقت" : "Joker option — use anytime"] },
            ].map((p) => (
              <div key={p.title} className="animate-on-scroll">
                <div
                  className="neon-card rounded-2xl border bg-[#12121a] p-5 flex flex-col h-full relative"
                  style={{ borderColor: `${p.color}33` }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 18px 2px ${p.color}30, inset 0 0 20px 0px ${p.color}08`; e.currentTarget.style.borderColor = `${p.color}88`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${p.color}33`; }}
                >
                  {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold" style={{ background: "#ff7e1a", color: "#07090f" }}>{ar ? "الأكثر استخداماً" : "Most Used"}</div>}
                  <div className={`text-xs font-semibold tracking-widest uppercase mb-3 ${ar ? "" : ""}`} style={{ color: p.color }}>{p.badge}</div>
                  <div className={`text-2xl font-semibold mb-1 text-white ${ar ? "" : ""}`}>{p.title}</div>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-white">{p.price}</span>
                    <span className={`text-white/45 pb-1 text-sm ${ar ? "" : ""}`}>{p.unit}</span>
                  </div>
                  <ul className="flex flex-col gap-2.5 flex-1 mb-7">
                    {p.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2 text-sm text-white ${ar ? "" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 6 9 17l-5-5" /></svg>{f}</li>
                    ))}
                  </ul>
                  <Link href="/register" className={`w-full font-semibold cursor-pointer rounded-lg text-sm py-2.5 text-center block ${ar ? "" : ""}`} style={{ background: p.color, color: "#07090f" }}>{ar ? "ابدأ الآن" : "Get Started"}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(to right, #39ff7e 1px, transparent 1px), linear-gradient(to bottom, #39ff7e 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center animate-on-scroll">
          <div className="flex justify-center mb-6"><BrandLogo variant="dark" size="lg" showText={false} /></div>
          <h2 className={`text-4xl md:text-6xl font-extrabold mb-6 text-balance leading-tight text-white ${ar ? "" : ""}`}>
            {ar ? (
              <>مستقبل المشتريات<br /><span style={{ color: "#39ff7e" }}>الفندقية هنا.</span></>
            ) : (
              <>The Future of Hotel<br /><span style={{ color: "#39ff7e" }}>Procurement is Here.</span></>
            )}
          </h2>
          <p className={`text-white/45 text-lg mb-4 max-w-xl mx-auto ${ar ? "" : ""}`}>
            {ar
              ? "ابدأ مجاناً اليوم. استكشف التجربة التجريبية. وكلاء الذكاء الاصطناعي يرشدونك عبر التسجيل. لا التزام، لا اشتراك — فقط نتائج."
              : "Start free today. Explore the sandbox. Let our AI agents guide your onboarding. No commitment, no subscription — just results."}
          </p>
          <p className={`text-sm mb-10 ${ar ? "" : ""}`} style={{ color: "#ff7e1a" }}>
            {ar ? "أول منصة مشتريات B2B بالذكاء الاصطناعي لقطاع الضيافة في مصر والمنطقة." : "First B2B AI-driven procurement platform for hospitality in Egypt and the region."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className={`font-semibold px-10 py-3 cursor-pointer gap-2 text-base rounded-lg inline-flex items-center justify-center bg-[#39ff7e] text-[#07090f] hover:bg-[#5fff9a] transition-colors ${ar ? "" : ""}`}>
              {ar ? "ابدأ مجاناً — بدون بطاقة" : "Start Free — No Card Needed"}
            </Link>
            <Link href="/sandbox" className={`font-semibold cursor-pointer text-base gap-2 rounded-lg border inline-flex items-center justify-center px-10 py-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors ${ar ? "" : ""}`} style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
              {ar ? "احجز عرضاً" : "Book a Demo"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────
   SANDBOX CAROUSEL — Procurement flow: PO → Execution → Delivery → Payment
   ────────────────────────────────────────────────────────────── */
const STEPS = [
  {
    step: 1,
    title: "Purchase Order",
    subtitle: "Hotel initiates procurement",
    color: "#39ff7e",
    icon: FileText,
    items: [
      { icon: ShoppingCart, text: "Browse supplier catalogs" },
      { icon: Building2, text: "Select items & quantities" },
      { icon: FileText, text: "Submit purchase order" },
    ],
    dashboard: {
      title: "New Purchase Order",
      table: [
        { item: "Premium Detergent (4×5L)", qty: "12 units", price: "EGP 4,200" },
        { item: "Cotton Bath Towels (500gsm)", qty: "200 pcs", price: "EGP 18,000" },
        { item: "Mineral Water (500ml×24)", qty: "50 cases", price: "EGP 3,750" },
      ],
      total: "EGP 25,950",
    },
  },
  {
    step: 2,
    title: "Execution",
    subtitle: "Supplier confirms & processes",
    color: "#ff7e1a",
    icon: CheckCircle2,
    items: [
      { icon: CheckCircle2, text: "Supplier confirms order" },
      { icon: Package, text: "Picks & packs inventory" },
      { icon: FileText, text: "ETA e-invoice generated" },
    ],
    dashboard: {
      title: "Order Confirmed",
      table: [
        { item: "Order #HV-2026-0847", qty: "Status: Processing", price: "ETA UUID: ✓" },
        { item: "Supplier: CleanPro Egypt", qty: "Tier: Gold", price: "ETA Status: Accepted" },
        { item: "ETA Digital Signature", qty: "Verified", price: "Invoice #INV-4821" },
      ],
      total: "Payment guaranteed ✓",
    },
  },
  {
    step: 3,
    title: "Delivery",
    subtitle: "Logistics fulfills & ships",
    color: "#c455ff",
    icon: Truck,
    items: [
      { icon: Truck, text: "Route optimization" },
      { icon: MapPin, text: "Real-time GPS tracking" },
      { icon: CheckCircle2, text: "Proof of delivery" },
    ],
    dashboard: {
      title: "Shipment Tracking",
      table: [
        { item: "Shipment #SHP-1192", qty: "Route: 6th Oct → Hurg", price: "ETA: 2h 15m" },
        { item: "Carrier: SwiftLog Egypt", qty: "Vehicle: Refrigerated", price: "Status: In Transit" },
        { item: "GPS Checkpoint 3/5", qty: "Cairo-Alex Rd.", price: "Temp: 4°C ✓" },
      ],
      total: "On-time delivery 98.2%",
    },
  },
  {
    step: 4,
    title: "Payment",
    subtitle: "Settlement & factoring",
    color: "#64b5f6",
    icon: CreditCard,
    items: [
      { icon: CreditCard, text: "Payment processed" },
      { icon: Building2, text: "Factoring liquidity" },
      { icon: CheckCircle2, text: "Revenue secured" },
    ],
    dashboard: {
      title: "Payment Settlement",
      table: [
        { item: "Invoice #INV-4821", qty: "Amount: EGP 25,950", price: "Status: Settled" },
        { item: "Platform Fee (2.5%)", qty: "EGP 648.75", price: "Deducted" },
        { item: "Factoring Spread", qty: "EGP 389.25", price: "To partner" },
      ],
      total: "Supplier paid: EGP 24,912",
    },
  },
];

export function SandboxCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive((p) => (p + 1) % STEPS.length), 6000);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const go = (dir: number) => {
    setActive((p) => (p + dir + STEPS.length) % STEPS.length);
    resetTimer();
  };

  const step = STEPS[active];

  return (
    <section className="py-20 border-y animate-on-scroll" style={{ borderColor: "#39ff7e18" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-xs tracking-widest uppercase" style={{ color: "#39ff7e" }}>Platform Demo</span>
          <h2 className="text-3xl md:text-4xl mt-3 mb-3 text-white font-medium">See It in Action</h2>
          <p className="text-white/45 text-sm max-w-xl mx-auto">Follow a complete procurement cycle — from order placement to payment settlement.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <React.Fragment key={s.step}>
                {i > 0 && <div className="hidden sm:block w-8 h-px" style={{ background: i <= active ? step.color : "rgba(255,255,255,0.08)" }} />}
                <button
                  onClick={() => { setActive(i); resetTimer(); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: i === active ? `${s.color}15` : "transparent",
                    border: i === active ? `1px solid ${s.color}33` : "1px solid transparent",
                    color: i === active ? s.color : "rgba(255,255,255,0.3)",
                  }}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{s.title}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Main card */}
        <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: `${step.color}44`, boxShadow: `0 0 50px 4px ${step.color}10` }}>
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#12121a]/80">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: step.color }} />
            <div className="flex-1 mx-4 bg-[#0c0c12]/50 rounded px-3 py-1 text-xs text-white/30 border border-white/[0.06]/50">
              app.hotelsvendors.com — Step {step.step}: {step.title}
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#0c0c12] p-6 sm:p-8">
            <div className="grid sm:grid-cols-[1fr_1.5fr] gap-6">
              {/* Left: step details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${step.color}15`, border: `1px solid ${step.color}33` }}>
                    <step.icon size={20} style={{ color: step.color }} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-[15px]">Step {step.step}: {step.title}</h3>
                    <p className="text-white/40 text-[12px]">{step.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {step.items.map((item, j) => {
                    const Icon = item.icon;
                    return (
                      <div key={j} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <Icon size={14} style={{ color: step.color }} className="shrink-0" />
                        <span className="text-white/70 text-[13px]">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: mock dashboard */}
              <div className="rounded-xl border border-white/[0.06] bg-[#12121a]/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: step.color }} />
                  <span className="text-white/60 text-[12px] font-medium">{step.dashboard.title}</span>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {step.dashboard.table.map((row, j) => (
                    <div key={j} className="flex items-center justify-between px-4 py-3">
                      <span className="text-white/70 text-[12px]">{row.item}</span>
                      <span className="text-white/40 text-[12px]">{row.qty}</span>
                      <span className="text-[12px] font-medium" style={{ color: step.color }}>{row.price}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-white/30 text-[11px] uppercase tracking-wider">Summary</span>
                  <span className="text-[13px] font-semibold" style={{ color: step.color }}>{step.dashboard.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          <button onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#12121a]/80 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer backdrop-blur-sm">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#12121a]/80 border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer backdrop-blur-sm">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); resetTimer(); }}
              className="w-2 h-2 rounded-full transition-all cursor-pointer"
              style={{
                background: i === active ? s.color : "rgba(255,255,255,0.1)",
                boxShadow: i === active ? `0 0 8px ${s.color}44` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
