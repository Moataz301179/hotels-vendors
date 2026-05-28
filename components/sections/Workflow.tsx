"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01", tag: "AUTH", title: "Hotel Sign-In & Onboarding",
    desc: "Secure gateway landing with multi-factor authentication. Establish your hotel entity, verify KYC documentation, and activate your procurement account in under 2 minutes.",
  },
  {
    num: "02", tag: "RBAC", title: "Team & Authorization Control",
    desc: "Management configures granular role-based access across administrative, purchasing, and approval authority tiers. Every staff member operates within their designated authorization perimeter.",
  },
  {
    num: "03", tag: "PROCURE", title: "Order Generation",
    desc: "Staff initiates procurement requests through the centralized AI-powered supplier network. Smart demand forecasting pre-populates order suggestions based on occupancy, seasonality, and consumption history.",
  },
  {
    num: "04", tag: "VALIDATE", title: "Verification & Validation",
    desc: "Automated order verification rules match requirements against budget gates, approval hierarchies, and supplier compliance records before execution. Zero unauthorized spend.",
  },
  {
    num: "05", tag: "FINTECH", title: "Fintech Checkout (Reverse Factoring)",
    desc: "At checkout, the hotel requests immediate supplier financing facilities. Reverse factoring optimizes working capital \u2014 suppliers get paid instantly, hotel preserves cash flow.",
  },
  {
    num: "06", tag: "LEDGER", title: "Confirmation & Recording",
    desc: "Instant terms confirmation. Payment schedules, invoice data, and delivery commitments are immutably recorded on the decentralized platform ledger. Full audit trail.",
  },
  {
    num: "07", tag: "ERP", title: "Enterprise Systems Integration",
    desc: "Seamless backend synchronization pushes active transaction logs directly to the hotel\u2019s internal ERP, Oracle NetSuite, or SAP architecture. Bidirectional data flow. Zero manual entry.",
  },
  {
    num: "08", tag: "ETA", title: "Tax Compliance Infrastructure",
    desc: "Fully integrated ETA e-invoicing components automatically map real-time compliance schemas. Every transaction generates Egyptian Tax Authority-compliant electronic invoices with digital signature and UUID.",
  },
];

export default function WorkflowSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="workflow" className="py-32 lg:py-[160px]" style={{ background: "#000000" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center mb-24">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] mb-6 px-4 py-1.5 rounded-full" style={{ color: "#00FF66", border: "1px solid rgba(0,255,102,0.25)", background: "rgba(0,255,102,0.06)" }}>
            THE WORKFLOW
          </span>
          <h2 className="text-[36px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.1]" style={{ color: "#FFFFFF" }}>
            End-to-End B2B<br />
            <span style={{ color: "rgba(255,255,255,0.55)" }}>Operational Cycle</span>
          </h2>
          <p className="mt-6 text-[16px] max-w-[640px] mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            From procurement request to tax-compliant settlement \u2014 eight orchestrated stages that eliminate manual intervention and optimize working capital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="group relative p-6 rounded-xl transition-all duration-300"
              style={{
                background: hoveredIdx === i ? "#080808" : "#050505",
                border: hoveredIdx === i ? "1px solid #00FF66" : "1px solid #1A1A1A",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md" style={{ background: "rgba(0,255,102,0.08)", color: "#00FF66", border: "1px solid rgba(0,255,102,0.15)" }}>
                  {step.tag}
                </span>
                <span className="text-[32px] font-black tracking-tight" style={{ color: "rgba(255,255,255,0.06)" }}>
                  {step.num}
                </span>
              </div>
              <h4 className="text-[16px] font-bold mb-3 tracking-[-0.01em]" style={{ color: "#FFFFFF" }}>
                {step.title}
              </h4>
              <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                {step.desc}
              </p>
              {i < STEPS.length - 1 && i % 4 !== 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px" style={{ background: "#1A1A1A" }} />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-xl text-center" style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}>
          <p className="text-[14px] font-semibold tracking-wide" style={{ color: "#00FF66" }}>
            Complete procurement-to-settlement cycle \u2014 fully automated, fully compliant
          </p>
        </div>
      </div>
    </section>
  );
}
