"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  Clock,
  FileX,
  AlertTriangle,
  Users,
  Phone,
  CheckCircle2,
  Zap,
  ArrowRight,
  BrainCircuit,
  Receipt,
  BarChart3,
  Truck,
  ShieldCheck,
  Building2,
} from "lucide-react";

const PAIN_POINTS = [
  {
    icon: Mail,
    title: "Fragmented Email Chains",
    desc: "Procurement teams juggle 50+ email threads per week. Quotes get lost, prices change, nobody knows which version is current.",
    stat: "50+",
    statLabel: "emails/week",
  },
  {
    icon: Clock,
    title: "Delayed Quote Responses",
    desc: "Suppliers take 3–5 days to respond. By then, the hotel has already overpaid on emergency purchases or run out of stock.",
    stat: "3–5",
    statLabel: "days delay",
  },
  {
    icon: FileX,
    title: "Mismatched Purchase Orders",
    desc: "Manual PO creation leads to wrong quantities, wrong prices, wrong suppliers. Reconciliation takes hours every month.",
    stat: "34%",
    statLabel: "error rate",
  },
  {
    icon: AlertTriangle,
    title: "Zero Spend Visibility",
    desc: "No real-time view of what's been ordered, what's been delivered, or what's been paid. Budget overruns are discovered weeks later.",
    stat: "0",
    statLabel: "real-time data",
  },
  {
    icon: Users,
    title: "Supplier Discovery is Manual",
    desc: "Finding a new supplier means asking around at industry events. No searchable marketplace, no verified reviews, no price comparison.",
    stat: "Weeks",
    statLabel: "to find vendors",
  },
  {
    icon: Phone,
    title: "Compliance is Afterthought",
    desc: "ETA e-invoicing compliance is handled manually after the fact. Penalties and rejected invoices cost time and money.",
    stat: "Manual",
    statLabel: "tax compliance",
  },
];

const SOLUTION_POINTS = [
  {
    icon: BrainCircuit,
    title: "AI-Powered RFQ Routing",
    desc: "Requests for quotation are automatically routed to the best-matched suppliers based on category, location, pricing history, and availability. Responses in hours, not days.",
    metric: "10x",
    metricLabel: "faster quotes",
  },
  {
    icon: Receipt,
    title: "Automated E-Invoicing",
    desc: "Every invoice is digitally signed, UUID-validated, and submitted to the Egyptian Tax Authority automatically. Zero manual tax work.",
    metric: "100%",
    metricLabel: "ETA compliant",
  },
  {
    icon: BarChart3,
    title: "Real-Time Spend Analytics",
    desc: "Live dashboards show every order, every delivery, every payment across all properties. AI flags anomalies and surfaces savings opportunities.",
    metric: "360°",
    metricLabel: "visibility",
  },
  {
    icon: Truck,
    title: "Shared-Route Logistics",
    desc: "AI consolidates deliveries across suppliers and properties. Cut logistics costs by up to 40% — critical for Red Sea resorts.",
    metric: "40%",
    metricLabel: "logistics savings",
  },
  {
    icon: ShieldCheck,
    title: "Verified Supplier Network",
    desc: "680+ pre-vetted suppliers in one searchable marketplace. Compare prices, check reviews, and order — all from one platform.",
    metric: "680+",
    metricLabel: "verified vendors",
  },
  {
    icon: Building2,
    title: "48-Hour Supplier Settlement",
    desc: "Suppliers get paid in 48 hours via reverse factoring. Hotels keep Net-30/60 terms. Everyone's cash flow improves.",
    metric: "48h",
    metricLabel: "supplier payment",
  },
];

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

export function ProblemSolutionSplit() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-16">
        <Reveal>
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: "var(--accent-base)" }}>
              The Problem & The Solution
            </span>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight mb-4 leading-[1.1] text-foreground"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Stop Managing Procurement
              <br />
              <span style={{ color: "var(--accent-base)" }}>With Spreadsheets</span>
            </h2>
            <p className="text-[14px] md:text-[15px] text-muted max-w-lg mx-auto leading-relaxed">
              Every day without automation is a day your hotel overpays, under-orders, or misses compliance deadlines.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Split view */}
      <div className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-0 relative">
          {/* Divider line on desktop */}
          <div
            className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, var(--border-subtle), transparent)" }}
          />
          {/* Mobile divider */}
          <div
            className="lg:hidden h-px w-full mb-10"
            style={{ background: "linear-gradient(to right, transparent, var(--border-subtle), transparent)" }}
          />

          {/* ═══════ LEFT: THE PROBLEM ═══════ */}
          <div className="lg:pr-10">
            <Reveal>
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--error)" + "12", border: "1px solid var(--error)" + "30" }}
                >
                  <AlertTriangle size={18} style={{ color: "var(--error)" }} />
                </div>
                <div>
                  <h3
                    className="text-[18px] md:text-[22px] font-semibold text-foreground"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Traditional Procurement
                  </h3>
                  <p className="text-[11px] text-muted uppercase tracking-[0.12em]">Manual · Error-Prone · Slow</p>
                </div>
              </div>
            </Reveal>

            <div className="space-y-3">
              {PAIN_POINTS.map((point, i) => {
                const Icon = point.icon;
                return (
                  <Reveal key={point.title} delay={i * 0.06}>
                    <div
                      className="rounded-xl p-4 transition-all duration-300 group"
                      style={{ backgroundColor: "var(--error)" + "06", border: "1px solid var(--error)" + "10" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--error)" + "30";
                        e.currentTarget.style.backgroundColor = "var(--error)" + "10";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--error)" + "10";
                        e.currentTarget.style.backgroundColor = "var(--error)" + "06";
                      }}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: "var(--error)" + "10", border: "1px solid var(--error)" + "20" }}
                        >
                          <Icon size={15} style={{ color: "var(--error)" }} className="opacity-70" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <h4 className="text-[13px] font-semibold text-foreground">{point.title}</h4>
                            <div className="text-right shrink-0">
                              <span className="text-[15px] font-bold" style={{ color: "var(--error)", fontFamily: "var(--font-serif)" }}>
                                {point.stat}
                              </span>
                              <span className="text-[9px] text-muted block">{point.statLabel}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-secondary leading-relaxed">{point.desc}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Problem summary callout */}
            <Reveal delay={0.4}>
              <div
                className="mt-6 rounded-xl p-4"
                style={{ backgroundColor: "var(--error)" + "08", border: "1px solid var(--error)" + "18" }}
              >
                <p className="text-[12px] text-secondary leading-relaxed">
                  <strong className="text-foreground">The cost:</strong> Hotels using manual procurement spend 15–25% more than necessary, experience 34% PO error rates, and have zero real-time visibility into spend.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ═══════ RIGHT: THE SOLUTION ═══════ */}
          <div className="lg:pl-10 mt-10 lg:mt-0">
            <Reveal>
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--accent-muted)", border: "1px solid var(--border-accent)" }}
                >
                  <Zap size={18} style={{ color: "var(--accent-base)" }} />
                </div>
                <div>
                  <h3
                    className="text-[18px] md:text-[22px] font-semibold text-foreground"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    HotelsVendors AI Platform
                  </h3>
                  <p className="text-[11px] text-muted uppercase tracking-[0.12em]">Automated · Compliant · Real-Time</p>
                </div>
              </div>
            </Reveal>

            <div className="space-y-3">
              {SOLUTION_POINTS.map((point, i) => {
                const Icon = point.icon;
                return (
                  <Reveal key={point.title} delay={i * 0.06}>
                    <div
                      className="rounded-xl p-4 transition-all duration-300 group surface-card"
                      style={{ backgroundColor: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-visible)";
                        e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-subtle)";
                        e.currentTarget.style.backgroundColor = "var(--bg-surface-1)";
                      }}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: "var(--accent-muted)", border: "1px solid var(--border-accent)" }}
                        >
                          <Icon size={15} style={{ color: "var(--accent-base)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <h4 className="text-[13px] font-semibold text-foreground">{point.title}</h4>
                            <div className="text-right shrink-0">
                              <span className="text-[15px] font-bold" style={{ color: "var(--accent-base)", fontFamily: "var(--font-serif)" }}>
                                {point.metric}
                              </span>
                              <span className="text-[9px] text-muted block">{point.metricLabel}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-secondary leading-relaxed">{point.desc}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Solution summary callout */}
            <Reveal delay={0.4}>
              <div
                className="mt-6 rounded-xl p-4"
                style={{ backgroundColor: "var(--accent-muted)", border: "1px solid var(--border-accent)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={14} style={{ color: "var(--accent-base)" }} />
                  <span className="text-[12px] font-semibold text-foreground">The result</span>
                </div>
                <p className="text-[12px] text-secondary leading-relaxed">
                  Hotels on HotelsVendors cut procurement costs by 15–25%, reduce PO errors to near zero, and get real-time visibility across every property — from day one.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom comparison bar */}
        <Reveal delay={0.5}>
          <div
            className="mt-14 rounded-2xl p-6 md:p-8"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {[
                { label: "Quote Response", before: "3–5 days", after: "< 4 hours" },
                { label: "PO Error Rate", before: "34%", after: "< 1%" },
                { label: "Spend Visibility", before: "None", after: "Real-time" },
                { label: "Supplier Payment", before: "60 days", after: "48 hours" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-[9px] text-muted uppercase tracking-[0.15em] mb-3">{item.label}</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[13px] font-medium line-through" style={{ color: "var(--error)" }}>{item.before}</span>
                    <ArrowRight size={12} className="text-muted shrink-0" />
                    <span className="text-[13px] font-bold" style={{ color: "var(--accent-base)" }}>{item.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
