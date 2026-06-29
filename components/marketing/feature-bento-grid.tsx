"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RfqRoutingIcon } from "./icons/RfqRoutingIcon";
import { EInvoicingIcon } from "./icons/EInvoicingIcon";
import { ProcurementMatchingIcon } from "./icons/ProcurementMatchingIcon";
import { ArrowRight, Zap, CheckCircle2 } from "lucide-react";

const A = "#FF6B00";
const AM = "rgba(255,107,0,0.08)";
const AB = "rgba(255,107,0,0.25)";
const AG = "rgba(255,107,0,0.15)";
const S1 = "#080B12";
const SC = "#0C1018";
const B1 = "rgba(255,255,255,0.06)";
const BH = "rgba(255,255,255,0.12)";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function BentoCardLarge({
  icon,
  title,
  subtitle,
  description,
  features,
  metric,
  accent = false,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  metric?: { value: string; label: string };
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-7 md:p-8 h-full transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden ${className}`}
      style={{
        backgroundColor: accent ? "rgba(255,107,0,0.04)" : SC,
        border: `1px solid ${accent ? AB : B1}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent ? "rgba(255,107,0,0.35)" : BH;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = accent ? AB : B1;
      }}
    >
      {/* Ambient glow on accent card */}
      {accent && (
        <div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${AG} 0%, transparent 70%)`, opacity: 0.4 }}
        />
      )}

      <div className="relative">
        {/* Icon */}
        <div className="mb-6">{icon}</div>

        {/* Title area */}
        <div className="mb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: A }}>
            {subtitle}
          </span>
        </div>
        <h3
          className="text-[20px] md:text-[24px] font-semibold text-white mb-3 leading-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h3>
        <p className="text-[13px] text-white/40 leading-relaxed mb-6">{description}</p>

        {/* Metric highlight */}
        {metric && (
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl mb-6"
            style={{ backgroundColor: AM, border: `1px solid ${AB}` }}
          >
            <Zap size={14} style={{ color: A }} />
            <span className="text-[15px] font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
              {metric.value}
            </span>
            <span className="text-[11px] text-white/30">{metric.label}</span>
          </div>
        )}

        {/* Feature list */}
        <ul className="space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[12px] text-white/50">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: A }} />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FeatureBentoGrid() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: S1 }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: A }}>
              Core Technical Pillars
            </span>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Three Engines.
              <br />
              One Platform.
            </h2>
            <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
              Each module works independently or as part of the full AI-powered procurement ecosystem.
            </p>
          </div>
        </Reveal>

        {/* Asymmetrical Bento Grid */}
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Card A — RFQ Routing — spans 7 cols (large) */}
          <Reveal className="lg:col-span-7">
            <BentoCardLarge
              icon={<RfqRoutingIcon className="w-20 h-20" />}
              title="Real-Time Automated RFQ Routing"
              subtitle="Card A — RFQ Engine"
              description="AI-powered request-for-quotation engine that automatically routes procurement needs to the best-matched suppliers. Factors in category expertise, geographic proximity, historical pricing, and real-time availability."
              features={[
                "Multi-supplier broadcast with intelligent filtering",
                "Dynamic scoring: price, delivery speed, quality rating, compliance history",
                "Auto-escalation when suppliers don't respond within SLA windows",
                "Real-time bid comparison dashboard with side-by-side analytics",
                "Arabic + English RFQ templates for Egyptian hospitality standards",
              ]}
              metric={{ value: "< 4 hours", label: "avg. quote response" }}
              accent
            />
          </Reveal>

          {/* Card B — E-Invoicing — spans 5 cols (tall) */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <BentoCardLarge
              icon={<EInvoicingIcon className="w-20 h-20" />}
              title="E-Invoicing with Live Compliance"
              subtitle="Card B — Tax Engine"
              description="Every invoice is digitally signed, UUID-validated, and submitted to the Egyptian Tax Authority in real time. Zero manual tax work — ever."
              features={[
                "RSA 2048-bit digital signatures on every invoice",
                "Real-time ETA submission with instant UUID validation",
                "Automatic rejection alerts with correction workflows",
                "SHA-256 cryptographic audit trail — fully traceable",
              ]}
              metric={{ value: "100%", label: "ETA compliant" }}
            />
          </Reveal>

          {/* Card C — Procurement Matching Analytics — spans 12 cols (full width) */}
          <Reveal delay={0.15} className="lg:col-span-12">
            <div
              className="rounded-2xl p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
              style={{ backgroundColor: SC, border: `1px solid ${B1}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = BH;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = B1;
              }}
            >
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                {/* Left: Icon + content */}
                <div className="lg:col-span-7">
                  <div className="mb-6">
                    <ProcurementMatchingIcon className="w-20 h-20" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: A }}>
                    Card C — Analytics Engine
                  </span>
                  <h3
                    className="text-[20px] md:text-[24px] font-semibold text-white mb-3 leading-tight mt-1"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Automated Procurement Matching Analytics
                  </h3>
                  <p className="text-[13px] text-white/40 leading-relaxed mb-6 max-w-xl">
                    Machine learning models analyze historical purchasing patterns, supplier performance, seasonal demand fluctuations, and market pricing to automatically match hotels with optimal suppliers — and flag cost-saving opportunities humans would miss.
                  </p>
                  <div
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl mb-6"
                    style={{ backgroundColor: AM, border: `1px solid ${AB}` }}
                  >
                    <Zap size={14} style={{ color: A }} />
                    <span className="text-[15px] font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
                      94%
                    </span>
                    <span className="text-[11px] text-white/30">forecast accuracy</span>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-2.5">
                    {[
                      "AI-driven supplier-hotel matching based on 12+ signals",
                      "Seasonal demand forecasting: occupancy, events, weather",
                      "Price anomaly detection across 680+ vendor catalogs",
                      "Automated reorder triggers when stock hits safety levels",
                      "Cross-property spend consolidation for volume discounts",
                      "Supplier scorecard: on-time rate, quality, compliance, price",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[12px] text-white/50">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: A }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Visual analytics mockup */}
                <div className="lg:col-span-5">
                  <div
                    className="rounded-2xl p-5"
                    style={{ backgroundColor: "rgba(255,255,255,0.015)", border: `1px solid ${B1}` }}
                  >
                    {/* Mini chart visualization */}
                    <div className="space-y-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25">
                        Matching Performance
                      </div>

                      {/* Bar chart mockup */}
                      {[
                        { label: "F&B Suppliers", value: 94, color: A },
                        { label: "Consumables", value: 89, color: A },
                        { label: "FF&E", value: 82, color: "rgba(255,107,0,0.6)" },
                        { label: "Services", value: 76, color: "rgba(255,107,0,0.4)" },
                        { label: "Guest Supplies", value: 91, color: A },
                      ].map((bar) => (
                        <div key={bar.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] text-white/40">{bar.label}</span>
                            <span className="text-[11px] font-bold" style={{ color: bar.color }}>
                              {bar.value}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: bar.color }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${bar.value}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            />
                          </div>
                        </div>
                      ))}

                      {/* Summary row */}
                      <div
                        className="pt-3 mt-2 flex items-center justify-between"
                        style={{ borderTop: `1px solid ${B1}` }}
                      >
                        <span className="text-[11px] text-white/30">Average match score</span>
                        <span className="text-[16px] font-bold" style={{ color: A, fontFamily: "var(--font-serif)" }}>
                          86.4%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
