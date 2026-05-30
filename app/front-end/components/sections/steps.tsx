"use client";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "../ui/motion";

const steps = [
  { num: "Step 1", title: "Connect Your Suppliers", desc: "Onboard your existing suppliers onto the platform. They get a free dashboard to manage orders, invoices, and payments." },
  { num: "Step 2", title: "AI Forecasts Your Needs", desc: "Our engine analyzes occupancy, seasonality, consumption patterns, and events to predict exactly what you need — before you run out." },
  { num: "Step 3", title: "Order, Track & Pay — Compliant", desc: "Create POs with pre-order cost estimates. Track deliveries in real time. Every invoice is ETA e-invoicing compliant automatically." },
];

export function StepsSection() {
  return (
    <section id="how-it-works" className="py-24 px-8">
      <div className="max-w-[1280px] mx-auto text-center">
        <FadeIn>
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <h2 className="text-3xl md:text-[42px] font-extrabold tracking-[-0.03em] leading-tight">Three Steps to Procurement Clarity</h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {steps.map((s, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="rounded-2xl p-7 text-left h-full"
                style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}
                whileHover={{
                  borderColor: "rgba(140,255,46,0.3)",
                  y: -4,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(140,255,46,0.08)",
                  transition: { duration: 0.3 },
                }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8cff2e] mb-3">{s.num}</p>
                <h4 className="text-[16px] font-bold mb-2">{s.title}</h4>
                <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{s.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
