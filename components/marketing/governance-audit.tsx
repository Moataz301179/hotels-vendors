"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Lock, FileCheck, Eye, Fingerprint, Server, CheckCircle2 } from "lucide-react";

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

const CERTIFICATIONS = [
  { icon: ShieldCheck, title: "ETA Phase 1 & 2", desc: "Full e-invoicing compliance. Every invoice digitally signed, UUID-validated, submitted to Egyptian Tax Authority automatically.", color: "#22C55E", arabic: "متوافق مع الفوترة الإلكترونية" },
  { icon: Lock, title: "AES-256-GCM Encryption", desc: "Bank-grade encryption at rest. TLS 1.3 in transit. Keys rotated every 90 days.", color: "#3B82F6", arabic: "تشفير AES-256-GCM" },
  { icon: FileCheck, title: "ISO 27001 Aligned", desc: "Information security management aligned with ISO 27001. Regular third-party audits.", color: "#FF6B00", arabic: "متوافق مع ISO 27001" },
  { icon: Server, title: "Data Residency — Egypt", desc: "All tenant data hosted on servers within Egypt. Data never leaves Egyptian jurisdiction.", color: "#8B5CF6", arabic: "إقامة البيانات — مصر" },
  { icon: Eye, title: "FRA Anti-Fraud Compliance", desc: "Three-way matching: PO + ETA UUID + signed delivery note. SHA-256 audit trails.", color: "#EF4444", arabic: "مكافحة الاحتيال — هيئة الرقابة المالية" },
  { icon: Fingerprint, title: "Tenant Data Isolation", desc: "Each tenant operates in a fully isolated data scope. Cross-tenant access is architecturally impossible.", color: "#06B6D4", arabic: "عزل بيانات المستأجرين" },
];

const AUDIT_TRAIL = [
  { time: "2026-06-23 10:42:15", actor: "System", action: "Invoice INV-2026-04521 cryptographically signed", detail: "RSA-2048 · SHA-256: 8f3a...2d1b", severity: "info" },
  { time: "2026-06-23 10:42:16", actor: "ETA Gateway", action: "Invoice submitted to Egyptian Tax Authority", detail: "UUID: 8f3a-2d1b-9c4e-7f6a · Status: Accepted", severity: "success" },
  { time: "2026-06-23 10:42:17", actor: "Finance Engine", action: "Three-way match verified", detail: "PO ✓ · Delivery Note ✓ · Invoice ✓", severity: "success" },
  { time: "2026-06-23 10:42:18", actor: "Settlement", action: "Payment instruction sent to licensed grantor", detail: "EGP 124,500 → NileFresh Produce · 48h settlement", severity: "info" },
  { time: "2026-06-23 10:42:20", actor: "Compliance", action: "Anomaly scan passed", detail: "No flags · All thresholds within range", severity: "success" },
];

export function GovernanceAudit() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, " + AG + " 0%, transparent 70%)", opacity: 0.2 }}
      />
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: A }}>
              Governance, Risk &amp; Compliance
            </span>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Enterprise-Grade Security.
              <br />
              Regulator-Ready Audit Trails.
            </h2>
            <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
              AES-256 encryption. RSA 2048-bit digital signatures. Egyptian data residency. Every transaction is cryptographically auditable.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 gap-4">
              {CERTIFICATIONS.map((cert, i) => (
                <Reveal key={cert.title} delay={i * 0.06}>
                  <motion.div
                    className="rounded-2xl p-5 h-full transition-all duration-300 hover:-translate-y-1"
                    style={{ backgroundColor: SC, border: "1px solid " + B1 }}
                    whileHover={{ borderColor: BH }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cert.color + "15" }}>
                        <cert.icon size={18} style={{ color: cert.color }} />
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22C55E" }}>
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "#22C55E" }} />
                        Active
                      </span>
                    </div>
                    <h3 className="text-[13px] font-semibold text-white/80 mb-0.5">{cert.title}</h3>
                    <p className="text-[9px] text-white/20 mb-2" dir="rtl">{cert.arabic}</p>
                    <p className="text-[11px] text-white/30 leading-relaxed">{cert.desc}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Reveal delay={0.1}>
              <div className="rounded-2xl overflow-hidden h-full" style={{ backgroundColor: SC, border: "1px solid " + B1 }}>
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid " + B1 }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#22C55E" }} />
                    <span className="text-[11px] font-semibold text-white/60">Immutable Audit Trail</span>
                  </div>
                  <span className="text-[9px] text-white/20 font-mono">SHA-256</span>
                </div>
                <div className="p-4 space-y-0">
                  {AUDIT_TRAIL.map((entry, i) => (
                    <motion.div
                      key={entry.time}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.06 }}
                      className="flex gap-3 py-2.5"
                    >
                      <div className="w-1.5 shrink-0 flex justify-center pt-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.severity === "success" ? "#22C55E" : A }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-medium text-white/60">{entry.action}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-white/20">{entry.actor}</span>
                          <span className="text-[9px] text-white/10">·</span>
                          <span className="text-[9px] font-mono text-white/15">{entry.detail}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-3 text-center" style={{ borderTop: "1px solid " + B1 }}>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/20">
                    <CheckCircle2 size={10} style={{ color: "#22C55E" }} />
                    <span>Regulator-ready · Exportable · Tamper-proof</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <div className="mt-8 rounded-xl p-5 text-center" style={{ backgroundColor: "rgba(255,107,0,0.03)", border: "1px solid rgba(255,107,0,0.08)" }}>
            <p className="text-[12px] text-white/50 leading-relaxed">
              <strong style={{ color: A }}>Restaurants for E-Marketing</strong> operates as a{" "}
              <strong className="text-white/60">technical data orchestrator</strong> &mdash; not a bank, not a payment service provider, not a factoring company.
              All financial flows are processed through licensed institutions. Zero liability for counterparty collection defaults.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
