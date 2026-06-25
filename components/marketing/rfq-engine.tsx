"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Clock, CheckCircle2, ArrowRight, Send, BarChart3 } from "lucide-react";

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

const STEPS = [
  { num: "01", title: "Describe Your Need", desc: "Type what you need in plain language — Arabic or English. Our AI understands hospitality procurement.", icon: "📝" },
  { num: "02", title: "AI Routes to Best Suppliers", desc: "The engine matches your request to suppliers by category, location, pricing history, and availability.", icon: "🧠" },
  { num: "03", title: "Receive Quotes in Hours", desc: "Suppliers respond within SLA windows. Auto-escalation triggers if they don't reply in time.", icon: "⚡" },
  { num: "04", title: "Compare & Accept", desc: "Side-by-side comparison: price, delivery speed, quality rating, compliance history. One-click accept.", icon: "✅" },
];

const LIVE_RFQS = [
  { id: "RFQ-2026-1847", item: "Fresh Seafood — 500kg/week", responses: 4, target: 5, timeLeft: "2h 14m", best: "EGP 265/kg", status: "active" },
  { id: "RFQ-2026-1846", item: "Pool Chemicals — Monthly", responses: 3, target: 3, timeLeft: "Closed", best: "EGP 172/kg", status: "closed" },
  { id: "RFQ-2026-1845", item: "Linen Towels — 2,000 units", responses: 5, target: 5, timeLeft: "Closed", best: "EGP 78/unit", status: "closed" },
];

export function RFQEngine() {
  const [input, setInput] = useState("");

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${AG} 0%, transparent 70%)`, opacity: 0.3 }}
      />
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: A }}>
              Automated RFQ Routing
            </span>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              From &quot;I Need&quot; to &quot;I Got Quotes&quot;
              <br />
              in Under 4 Hours
            </h2>
            <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
              Describe what you need. Our AI routes it to the best suppliers. Compare quotes side-by-side. Accept with one click.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: RFQ input mockup */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="p-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${B1}` }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22C55E" }} />
                  <span className="text-[11px] font-medium text-white/50">New RFQ</span>
                </div>
                <div className="p-5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/25 mb-2 block">What do you need?</label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., Fresh seafood for 200 rooms, weekly delivery to Sharm El-Sheikh..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl text-[13px] text-white placeholder:text-white/15 outline-none resize-none mb-4"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${B1}` }}
                  />
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["F&B", "Consumables", "Guest Supplies", "FF&E"].map((tag) => (
                      <span key={tag} className="text-[10px] px-2.5 py-1 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    className="w-full py-3 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ backgroundColor: A, color: "#fff", boxShadow: `0 4px 20px ${AG}` }}
                  >
                    <Send size={13} /> Send RFQ
                  </button>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/25">
                      <Clock size={10} /> Avg. first quote: 47 min
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/25">
                      <Zap size={10} /> AI-routed
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Live RFQs */}
            <Reveal delay={0.1}>
              <div className="mt-4 rounded-2xl p-4" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 size={12} style={{ color: A }} />
                  <span className="text-[11px] font-medium text-white/50">Live RFQs</span>
                </div>
                <div className="space-y-2.5">
                  {LIVE_RFQS.map((rfq) => (
                    <div key={rfq.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <div>
                        <span className="text-[11px] text-white/60 block">{rfq.item}</span>
                        <span className="text-[9px] text-white/25">{rfq.id}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold block" style={{ color: rfq.status === "active" ? A : "rgba(255,255,255,0.4)" }}>{rfq.best}</span>
                        <span className="text-[9px] text-white/25">{rfq.responses}/{rfq.target} quotes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Steps + metrics */}
          <div className="lg:col-span-3 space-y-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.08}>
                <motion.div
                  className="rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: SC, border: `1px solid ${B1}` }}
                  whileHover={{ borderColor: BH }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-[18px]" style={{ backgroundColor: AM, border: `1px solid ${AB}` }}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold" style={{ color: A }}>Step {step.num}</span>
                      <h3 className="text-[14px] font-semibold text-white/85">{step.title}</h3>
                    </div>
                    <p className="text-[12px] text-white/35 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}

            {/* Metrics row */}
            <Reveal delay={0.35}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "< 4h", label: "Avg. quote response", icon: Clock },
                  { value: "94%", label: "Match accuracy", icon: Zap },
                  { value: "3.2x", label: "Faster than email", icon: CheckCircle2 },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                    <m.icon size={14} className="mx-auto mb-2" style={{ color: A }} />
                    <div className="text-[18px] font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{m.value}</div>
                    <div className="text-[10px] text-white/25">{m.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
