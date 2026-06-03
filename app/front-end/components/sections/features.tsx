"use client";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "../ui/motion";

const features = [
  { icon: "🔗", title: "Multi-Supplier Sync", desc: "Connect and track all your suppliers in one place. No more WhatsApp chaos.", accent: "lime" },
  { icon: "📊", title: "AI Demand Forecasting", desc: "Visualize procurement needs based on occupancy, seasonality, and historical data.", accent: "purple" },
  { icon: "📋", title: "Smart Purchase Orders", desc: "See exact projected cost before approving any PO — zero budget surprises.", accent: "lime" },
  { icon: "🏷️", title: "Custom Categories", desc: "Organize spending your way. Five built-in categories, unlimited custom ones.", accent: "purple" },
  { icon: "📧", title: "Weekly Reports", desc: "Get a snapshot of your procurement delivered to your inbox automatically.", accent: "lime" },
  { icon: "🔒", title: "ETA Compliant", desc: "Every invoice meets Egyptian Tax Authority e-invoicing requirements. Zero penalty risk.", accent: "purple" },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-[1280px] mx-auto text-center">
        <FadeIn>
          <SectionLabel color="purple">PLATFORM FEATURES</SectionLabel>
          <h2 className="text-3xl md:text-[42px] font-extrabold tracking-[-0.03em] leading-tight">
            Designed for Clarity.<br />Built for Better Procurement Decisions.
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {features.map((f, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="rounded-2xl p-6 text-left h-full"
                style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}
                whileHover={{
                  borderColor: f.accent === "lime" ? "rgba(140,255,46,0.3)" : "rgba(168,85,247,0.3)",
                  y: -2,
                  transition: { duration: 0.2 },
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[16px] mb-3"
                  style={{ background: f.accent === "lime" ? "rgba(140,255,46,0.12)" : "rgba(168,85,247,0.12)" }}
                >
                  {f.icon}
                </div>
                <h5 className="text-[14px] font-bold mb-1.5">{f.title}</h5>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{f.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
