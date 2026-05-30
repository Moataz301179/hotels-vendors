"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel, TiltCard } from "../ui/motion";

const features = [
  { title: "AI Demand Forecasting", desc: "Predict F&B, housekeeping, and amenity needs based on occupancy, events, seasonality, and historical data." },
  { title: "Cost Estimation Pre-Order", desc: "See exact projected cost before approving any PO — no budget surprises." },
  { title: "Reorder Alerts", desc: "Automatic notifications when inventory hits par level, with suggested order quantities." },
  { title: "Spend Analytics Dashboard", desc: "Real-time visibility across all 5 categories, all properties, all suppliers — in one view." },
];

export function ForHotelsSection() {
  return (
    <section id="hotels" className="py-24 px-8">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <FadeIn>
            <SectionLabel>FOR HOTELS</SectionLabel>
            <h2 className="text-3xl md:text-[42px] font-extrabold tracking-[-0.03em] leading-tight mb-5">
              Control Before.<br />Not After.
            </h2>
            <p className="text-[17px] leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.65)" }}>
              Most procurement platforms tell you what you spent last month. We tell you what you should order next week.
            </p>
          </FadeIn>

          <StaggerContainer className="mt-8">
            {features.map((f, i) => (
              <StaggerItem key={i}>
                <div className="flex gap-4 mb-6">
                  <div
                    className="w-6 h-6 min-w-[24px] rounded-md flex items-center justify-center text-[13px] font-bold mt-0.5"
                    style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}
                  >
                    →
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold mb-1">{f.title}</h4>
                    <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{f.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/register" className="text-[15px] font-bold text-[#050505] px-8 py-3.5 rounded-xl bg-[#8cff2e] hover:bg-[#a0ff4a] transition-all no-underline">
                Request Hotel Demo
              </Link>
              <Link href="#platform" className="text-[15px] font-bold text-white px-8 py-3.5 rounded-xl bg-[#a855f7] hover:bg-[#b56dff] transition-all no-underline">
                Learn More
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="hidden lg:flex justify-center">
          <TiltCard>
            <div
              className="rounded-2xl p-6 w-full"
              style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between pb-4 mb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                </div>
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>Forecasting Dashboard</span>
              </div>
              <p className="text-[12px] mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>Weekly Demand Forecast — F&B</p>

              {/* Mini chart */}
              <div className="flex items-end gap-2 h-[100px]">
                {[50, 70, 45, 85, 60, 95, 75].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{ opacity: i === 5 ? 1 : 0.15, background: "#8cff2e" }}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div className="text-[20px] font-extrabold text-[#8cff2e]">-18%</div>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>Waste Reduction</div>
                </div>
                <div>
                  <div className="text-[20px] font-extrabold text-[#a855f7]">EGP 15K</div>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>Monthly Savings</div>
                </div>
                <div>
                  <div className="text-[20px] font-extrabold">94%</div>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>Forecast Accuracy</div>
                </div>
              </div>
            </div>
          </TiltCard>
        </FadeIn>
      </div>
    </section>
  );
}
