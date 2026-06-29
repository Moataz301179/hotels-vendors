"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Banknote, CreditCard, Globe, ArrowRight, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

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

const METHODS = [
  { name: "Bank Transfer", desc: "Local EGP via CIB, QNB, Banque Misr", icon: Banknote, fee: "0%", time: "Same day", color: "#22C55E" },
  { name: "Credit / Debit Card", desc: "Visa, Mastercard, Meeza", icon: CreditCard, fee: "1%", time: "Instant", color: "#3B82F6" },
  { name: "SWIFT International", desc: "USD, EUR, GBP for imported goods", icon: Globe, fee: "1.5%", time: "1-2 days", color: "#8B5CF6" },
];

const SETTLEMENT_FLOW = [
  { step: "01", title: "Hotel Places Order", desc: "PO generated, budget checked against ceiling" },
  { step: "02", title: "Supplier Delivers", desc: "Delivery note signed, three-way match initiated" },
  { step: "03", title: "Invoice Auto-Settled", desc: "ETA-compliant invoice triggers payment flow" },
  { step: "04", title: "Supplier Paid in 48h", desc: "Via reverse factoring — hotel keeps Net-60" },
];

export function PaymentGateway() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      <div
        className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full pointer-events-none -translate-y-1/2"
        style={{ background: `radial-gradient(circle, ${AG} 0%, transparent 70%)`, opacity: 0.25 }}
      />
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: A }}>
              Embedded Payment Infrastructure
            </span>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Pay Your Way.
              <br />
              Settle in 48 Hours.
            </h2>
            <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
              Multiple payment methods. Automatic settlement. Suppliers get paid in 48 hours via reverse factoring — hotels keep their Net-30/60 terms.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Payment methods */}
          <div className="space-y-4">
            <Reveal>
              <div className="rounded-2xl p-6" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: AM, border: `1px solid ${AB}` }}>
                    <CreditCard size={16} style={{ color: A }} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: A }}>Payment Methods</span>
                    <p className="text-[10px] text-white/25">All major Egyptian channels</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {METHODS.map((m, i) => (
                    <motion.div
                      key={m.name}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="flex items-center justify-between p-3.5 rounded-xl"
                      style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${B1}` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: m.color + "15" }}>
                          <m.icon size={16} style={{ color: m.color }} />
                        </div>
                        <div>
                          <span className="text-[13px] font-medium text-white/75 block">{m.name}</span>
                          <span className="text-[10px] text-white/25">{m.desc}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] font-bold block" style={{ color: m.color }}>{m.fee}</span>
                        <span className="text-[10px] text-white/25">{m.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="rounded-2xl p-5" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={14} style={{ color: A }} />
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: A }}>Security</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "PCI DSS", desc: "Level 1 compliant" },
                    { label: "TLS 1.3", desc: "In transit" },
                    { label: "AES-256", desc: "At rest" },
                    { label: "3D Secure", desc: "Card payments" },
                  ].map((s) => (
                    <div key={s.label} className="p-2.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <span className="text-[11px] font-medium text-white/60 block">{s.label}</span>
                      <span className="text-[10px] text-white/25">{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Settlement flow */}
          <div>
            <Reveal delay={0.05}>
              <div className="rounded-2xl p-6 h-full" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: AM, border: `1px solid ${AB}` }}>
                    <Clock size={16} style={{ color: A }} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: A }}>48-Hour Settlement Flow</span>
                    <p className="text-[10px] text-white/25">Reverse factoring — everyone wins</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {SETTLEMENT_FLOW.map((step, i) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: AM, border: `1px solid ${AB}` }}>
                        <span className="text-[12px] font-bold" style={{ color: A }}>{step.step}</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <h4 className="text-[13px] font-semibold text-white/80 mb-0.5">{step.title}</h4>
                        <p className="text-[11px] text-white/30 leading-relaxed">{step.desc}</p>
                      </div>
                      {i < SETTLEMENT_FLOW.length - 1 && (
                        <div className="absolute left-[19px] mt-10 w-px h-4" style={{ backgroundColor: AB }} />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-5" style={{ borderTop: `1px solid ${B1}` }}>
                  {[
                    { value: "48h", label: "Supplier payment" },
                    { value: "Net-60", label: "Hotel keeps" },
                    { value: "0%", label: "Recourse risk" },
                  ].map((m) => (
                    <div key={m.label} className="text-center">
                      <div className="text-[16px] font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>{m.value}</div>
                      <div className="text-[10px] text-white/25">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
