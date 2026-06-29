"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, FileCheck, Lock, Eye, Fingerprint, Server, CheckCircle2, ExternalLink } from "lucide-react";

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

const VALIDATIONS = [
  { icon: ShieldCheck, title: "ETA Phase 1 & 2", desc: "Full e-invoicing compliance. Every invoice digitally signed and UUID-tracked.", color: "#22C55E", status: "Active" },
  { icon: Lock, title: "RSA-2048 Signatures", desc: "Bank-grade cryptographic signing on every invoice and payment instruction.", color: "#3B82F6", status: "Active" },
  { icon: FileCheck, title: "FRA Anti-Fraud", desc: "Three-way matching: PO + ETA UUID + signed delivery note. SHA-256 audit trail.", color: "#EF4444", status: "Active" },
  { icon: Eye, title: "Real-Time Monitoring", desc: "24/7 automated monitoring of all transactions for suspicious patterns.", color: "#8B5CF6", status: "Active" },
  { icon: Fingerprint, title: "Tenant Isolation", desc: "Each tenant operates in a fully isolated data scope. Cross-tenant access is architecturally impossible.", color: "#06B6D4", status: "Active" },
  { icon: Server, title: "Egyptian Data Residency", desc: "All tenant data hosted on servers within Egypt. Data never leaves Egyptian jurisdiction.", color: "#FF6B00", status: "Active" },
];

const AUDIT_LOG = [
  { time: "10:42:15", event: "Invoice INV-2026-04521 signed", detail: "RSA-2048 · SHA-256: 8f3a...2d1b" },
  { time: "10:42:16", event: "ETA submission confirmed", detail: "UUID: 8f3a-2d1b-9c4e-7f6a" },
  { time: "10:42:17", event: "Three-way match passed", detail: "PO ✓ · Delivery ✓ · Invoice ✓" },
  { time: "10:42:18", event: "Settlement initiated", detail: "EGP 124,500 → NileFresh Produce" },
];

export function AuthorityValidation() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: S1 }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: A }}>
              Regulatory Compliance & Validation
            </span>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Built for Regulators.
              <br />
              Trusted by Banks.
            </h2>
            <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
              Every transaction meets Egyptian Tax Authority e-invoicing requirements and FRA anti-fraud standards. Cryptographic proof on every step.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Validation cards */}
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 gap-4">
              {VALIDATIONS.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.06}>
                  <motion.div
                    className="rounded-2xl p-5 h-full transition-all duration-300 hover:-translate-y-1"
                    style={{ backgroundColor: SC, border: `1px solid ${B1}` }}
                    whileHover={{ borderColor: BH }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: v.color + "15" }}>
                        <v.icon size={18} style={{ color: v.color }} />
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22C55E" }}>
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#22C55E" }} />
                        {v.status}
                      </span>
                    </div>
                    <h3 className="text-[13px] font-semibold text-white/80 mb-1">{v.title}</h3>
                    <p className="text-[11px] text-white/30 leading-relaxed">{v.desc}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right: Live audit log */}
          <div className="lg:col-span-2">
            <Reveal delay={0.1}>
              <div className="rounded-2xl overflow-hidden h-full" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${B1}` }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#22C55E" }} />
                    <span className="text-[11px] font-semibold text-white/60">Live Audit Log</span>
                  </div>
                  <span className="text-[9px] text-white/20 font-mono">Session: s-2847</span>
                </div>
                <div className="p-4 space-y-0">
                  {AUDIT_LOG.map((entry, i) => (
                    <motion.div
                      key={entry.time}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="flex gap-3 py-2.5"
                    >
                      <div className="w-16 shrink-0 text-right">
                        <span className="text-[10px] font-mono text-white/20">{entry.time}</span>
                      </div>
                      <div className="flex-1 pl-3" style={{ borderLeft: `1px solid ${AB}` }}>
                        <span className="text-[11px] text-white/60 block">{entry.event}</span>
                        <span className="text-[9px] font-mono text-white/20">{entry.detail}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-3 text-center" style={{ borderTop: `1px solid ${B1}` }}>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/20">
                    <CheckCircle2 size={10} style={{ color: "#22C55E" }} />
                    <span>SHA-256 hashed · Immutable · Regulator-ready</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Disclaimer */}
            <Reveal delay={0.2}>
              <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: "rgba(255,107,0,0.03)", border: `1px solid rgba(255,107,0,0.08)` }}>
                <p className="text-[11px] text-white/35 leading-relaxed">
                  <strong style={{ color: A }}>Restaurants for E-Marketing</strong> operates as a technical data orchestrator — not a bank, not a payment service provider, not a factoring company. All financial flows are processed through licensed institutions.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
