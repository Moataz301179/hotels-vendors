"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Receipt, CheckCircle2, ShieldCheck, Clock, FileCheck, AlertCircle } from "lucide-react";

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

const INVOICES = [
  { id: "INV-2026-04521", supplier: "NileFresh Produce", amount: "EGP 124,500", status: "submitted", eta: "Submitted · UUID: 8f3a...2d1b", date: "Today, 10:42 AM" },
  { id: "INV-2026-04520", supplier: "Red Sea Linen Co.", amount: "EGP 68,200", status: "accepted", eta: "Accepted by ETA · UUID: 7c2e...9f4a", date: "Today, 09:15 AM" },
  { id: "INV-2026-04519", supplier: "Pharaoh Chemicals", amount: "EGP 42,800", status: "accepted", eta: "Accepted by ETA · UUID: 9a1d...3e7c", date: "Yesterday" },
  { id: "INV-2026-04518", supplier: "Cleopatra Amenities", amount: "EGP 31,600", status: "rejected", eta: "Rejected — code ETA-4012", date: "Yesterday" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  submitted: { bg: "rgba(234,179,8,0.1)", text: "#EAB308", dot: "#EAB308" },
  accepted: { bg: "rgba(34,197,94,0.1)", text: "#22C55E", dot: "#22C55E" },
  rejected: { bg: "rgba(239,68,68,0.1)", text: "#EF4444", dot: "#EF4444" },
};

export function InvoicingPortal() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: S1 }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: A }}>
              Layer 2 · Financing
            </span>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              E-Invoicing That&apos;s
              <br />
              Always ETA-Compliant
            </h2>
            <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
              Every invoice is digitally signed with RSA-2048, UUID-validated, and submitted to the Egyptian Tax Authority in real time. Zero manual tax work.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Invoice list */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${B1}` }}>
                  <div className="flex items-center gap-2">
                    <Receipt size={14} style={{ color: A }} />
                    <span className="text-[12px] font-semibold text-white/80">Recent Invoices</span>
                  </div>
                  <span className="text-[10px] text-white/25">Auto-synced with ETA</span>
                </div>
                <div className="divide-y" style={{ borderColor: B1 }}>
                  {INVOICES.map((inv, i) => {
                    const sc = STATUS_COLORS[inv.status];
                    return (
                      <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="p-4 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-[13px] font-medium text-white/80 block">{inv.id}</span>
                            <span className="text-[11px] text-white/30">{inv.supplier}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[14px] font-bold text-white block" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{inv.amount}</span>
                            <span className="text-[10px] text-white/25">{inv.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
                            <span className="text-[10px] font-medium" style={{ color: sc.text }}>{inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span>
                          </div>
                          <span className="text-[10px] text-white/20 font-mono">{inv.eta}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="p-3 text-center" style={{ borderTop: `1px solid ${B1}` }}>
                  <span className="text-[10px] text-white/20">All invoices cryptographically signed · SHA-256 audit trail</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Compliance status */}
          <div className="lg:col-span-2 space-y-4">
            <Reveal delay={0.05}>
              <div className="rounded-2xl p-5" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={14} style={{ color: A }} />
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: A }}>ETA Compliance</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Digital Signature", status: "RSA-2048", ok: true },
                    { label: "UUID Validation", status: "Active", ok: true },
                    { label: "ETA Submission", status: "Real-time", ok: true },
                    { label: "Phase 1 & 2", status: "Compliant", ok: true },
                    { label: "SHA-256 Audit Trail", status: "Enabled", ok: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-[12px] text-white/50">{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium" style={{ color: item.ok ? "#22C55E" : "#EF4444" }}>{item.status}</span>
                        <CheckCircle2 size={12} style={{ color: item.ok ? "#22C55E" : "#EF4444" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl p-5" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={14} style={{ color: A }} />
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: A }}>Submission Timeline</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { time: "0s", label: "Invoice generated", desc: "Auto-created from PO + delivery note" },
                    { time: "< 1s", label: "RSA-2048 signed", desc: "Cryptographic signature applied" },
                    { time: "< 3s", label: "ETA submitted", desc: "Real-time submission to Tax Authority" },
                    { time: "< 10s", label: "UUID received", desc: "Unique tracking ID returned" },
                  ].map((t) => (
                    <div key={t.time} className="flex items-start gap-3">
                      <div className="w-10 text-right shrink-0">
                        <span className="text-[11px] font-bold" style={{ color: A }}>{t.time}</span>
                      </div>
                      <div className="flex-1 pl-3" style={{ borderLeft: `1px solid ${AB}` }}>
                        <span className="text-[12px] text-white/60 block">{t.label}</span>
                        <span className="text-[10px] text-white/25">{t.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={12} style={{ color: "#EF4444" }} />
                  <span className="text-[11px] font-medium text-white/50">Rejection Handling</span>
                </div>
                <p className="text-[11px] text-white/30 leading-relaxed">
                  If ETA rejects an invoice, the system auto-flags the error, notifies the supplier, and provides a one-click correction workflow. Zero manual intervention.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Financing preview image */}
        <Reveal delay={0.2}>
          <div className="mt-8 rounded-2xl overflow-hidden" style={{ border: `1px solid ${B1}` }}>
            <img
              src="/previews/financing-preview.png"
              alt="ETA Invoice Clearance Pipeline &amp; Factoring Overview"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
