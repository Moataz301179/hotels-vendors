"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Clock, ArrowRight, Building2, Store, Landmark, Truck, BarChart3 } from "lucide-react";

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

const PHASES = [
  { num: "01", title: "Demand Forecast", desc: "AI predicts what you need 14 days ahead based on occupancy, seasonality, and historical consumption.", icon: BarChart3, color: "#FF6B00", actor: "Hotel", time: "Day -14" },
  { num: "02", title: "RFQ & Sourcing", desc: "Automated RFQ routed to best-matched suppliers. Quotes received in hours, not days.", icon: Building2, color: "#FF6B00", actor: "Platform", time: "Day -7" },
  { num: "03", title: "Order & Approval", desc: "PO auto-generated, budget-checked, and approved. Three-way match pre-validated.", icon: CheckCircle2, color: "#22C55E", actor: "Hotel", time: "Day -5" },
  { num: "04", title: "Fulfillment", desc: "Supplier prepares order. Shared-route logistics optimized across multiple orders.", icon: Store, color: "#3B82F6", actor: "Supplier", time: "Day -2" },
  { num: "05", title: "Delivery & Verification", desc: "GPS-tracked delivery. Digital delivery note signed. Three-way match confirmed.", icon: Truck, color: "#8B5CF6", actor: "Carrier", time: "Day 0" },
  { num: "06", title: "Settlement", desc: "ETA-compliant invoice auto-generated. Supplier paid in 48h via factoring. Hotel keeps Net-60.", icon: Landmark, color: "#D4A843", actor: "Funder", time: "Day +2" },
];

export function LifecycleVisualizer() {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: S1 }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: A }}>
              End-to-End Procurement Lifecycle
            </span>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              From Forecast to Settlement.
              <br />
              Every Step Automated.
            </h2>
            <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
              One continuous flow — from AI demand prediction through to 48-hour supplier settlement. No gaps. No manual handoffs.
            </p>
          </div>
        </Reveal>

        {/* Timeline */}
        <Reveal>
          <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
            {/* Horizontal timeline */}
            <div className="hidden md:flex items-center justify-between mb-6 relative">
              <div className="absolute top-5 left-0 right-0 h-px" style={{ backgroundColor: B1 }} />
              {PHASES.map((phase, i) => (
                <button
                  key={phase.num}
                  onClick={() => setActivePhase(i)}
                  className="relative flex flex-col items-center gap-2 cursor-pointer group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 z-10"
                    style={{
                      backgroundColor: activePhase === i ? phase.color + "20" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${activePhase === i ? phase.color + "60" : B1}`,
                      boxShadow: activePhase === i ? `0 0 20px ${phase.color}30` : "none",
                    }}
                  >
                    <phase.icon size={16} style={{ color: activePhase === i ? phase.color : "rgba(255,255,255,0.3)" }} />
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: activePhase === i ? phase.color : "rgba(255,255,255,0.25)" }}>
                    {phase.time}
                  </span>
                </button>
              ))}
            </div>

            {/* Mobile timeline (vertical) */}
            <div className="md:hidden space-y-2">
              {PHASES.map((phase, i) => (
                <button
                  key={phase.num}
                  onClick={() => setActivePhase(i)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left cursor-pointer transition-all"
                  style={{
                    backgroundColor: activePhase === i ? phase.color + "10" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${activePhase === i ? phase.color + "40" : B1}`,
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: phase.color + "20" }}>
                    <phase.icon size={14} style={{ color: phase.color }} />
                  </div>
                  <div>
                    <span className="text-[12px] font-medium block" style={{ color: activePhase === i ? phase.color : "rgba(255,255,255,0.5)" }}>{phase.title}</span>
                    <span className="text-[10px] text-white/25">{phase.time} · {phase.actor}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Active phase detail */}
        <Reveal>
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-6"
            style={{ backgroundColor: SC, border: `1px solid ${PHASES[activePhase].color}30` }}
          >
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: PHASES[activePhase].color + "15", border: `1px solid ${PHASES[activePhase].color}40` }}
                  >
                    {(() => { const Icon = PHASES[activePhase].icon; return <Icon size={20} style={{ color: PHASES[activePhase].color }} />; })()}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: PHASES[activePhase].color }}>
                      Phase {PHASES[activePhase].num} · {PHASES[activePhase].time}
                    </span>
                    <h3 className="text-[18px] font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {PHASES[activePhase].title}
                    </h3>
                  </div>
                </div>
                <p className="text-[13px] text-white/40 leading-relaxed mb-4">{PHASES[activePhase].desc}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/25">Actor:</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: PHASES[activePhase].color + "15", color: PHASES[activePhase].color }}>
                    {PHASES[activePhase].actor}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[40px] font-bold" style={{ color: PHASES[activePhase].color, fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {activePhase + 1}/6
                  </div>
                  <div className="text-[10px] text-white/25 mt-1">Phases complete</div>
                  <div className="flex items-center justify-center gap-1 mt-3">
                    {PHASES.map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full transition-all"
                        style={{
                          backgroundColor: i <= activePhase ? PHASES[activePhase].color : "rgba(255,255,255,0.1)",
                          transform: i === activePhase ? "scale(1.3)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>

        {/* Summary */}
        <Reveal>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { value: "14 days", label: "Forecast window", sub: "AI prediction" },
              { value: "6 phases", label: "Automated flow", sub: "Zero manual handoffs" },
              { value: "48h", label: "To settlement", end: "End-to-end" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="text-[16px] font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{m.value}</div>
                <div className="text-[11px] text-white/40">{m.label}</div>
                <div className="text-[9px] text-white/20">{m.sub || m.end}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
