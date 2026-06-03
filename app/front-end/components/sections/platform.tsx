"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "../ui/motion";

const categories = [
  {
    icon: "🍽️",
    title: "F&B Procurement",
    desc: "AI-powered demand forecasting for food & beverage. Predict what you need before you need it. Eliminate over-ordering and reduce spoilage by up to 20%.",
    accent: "lime",
  },
  {
    icon: "🧹",
    title: "Housekeeping",
    desc: "Consumables tracking with automated reorder points. Never run out of linens, toiletries, or cleaning supplies.",
    accent: "purple",
  },
  {
    icon: "⚙️",
    title: "Engineering",
    desc: "Maintenance scheduling, spare parts inventory, and MRO procurement — all in one compliant workflow.",
    accent: "purple",
  },
  {
    icon: "✨",
    title: "Amenities",
    desc: "Guest experience supplies managed with par-level automation. Seasonal adjustments built into your forecast.",
    accent: "lime",
  },
  {
    icon: "🏗️",
    title: "Capital Equipment",
    desc: "Track high-value asset purchases, depreciation schedules, and vendor warranties. Compare supplier quotes before committing.",
    accent: "purple",
  },
];

export function PlatformSection() {
  return (
    <section id="platform" className="py-24 px-8">
      <div className="max-w-[1280px] mx-auto text-center">
        <FadeIn>
          <SectionLabel>THE PLATFORM</SectionLabel>
          <h2 className="text-3xl md:text-[42px] font-extrabold tracking-[-0.03em] leading-tight mb-3">
            From F&B to Capital Equipment.<br />Every Dirham Tracked.<br />Every Invoice Compliant.
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12" delayStep={0.08}>
          {categories.map((c, i) => (
            <StaggerItem key={i}>
              <motion.div
                className={`rounded-2xl p-7 text-left h-full ${i === 0 ? "md:col-span-2" : ""} ${i === 4 ? "md:col-span-2" : ""}`}
                style={{
                  background: "#0d0d0d",
                  border: "1px solid rgba(255,255,255,0.06)",
                  gridColumn: i === 0 || i === 4 ? "span 2" : undefined,
                }}
                whileHover={{
                  borderColor: c.accent === "lime" ? "rgba(140,255,46,0.3)" : "rgba(168,85,247,0.3)",
                  y: -4,
                  boxShadow: c.accent === "lime"
                    ? "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(140,255,46,0.08)"
                    : "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.08)",
                  transition: { duration: 0.3 },
                }}
              >
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px] mb-4"
                  style={{ background: c.accent === "lime" ? "rgba(140,255,46,0.12)" : "rgba(168,85,247,0.12)" }}
                >
                  {c.icon}
                </div>
                <h3 className="text-[18px] font-bold mb-2 tracking-[-0.01em]">{c.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{c.desc}</p>
                <Link
                  href="#"
                  className="inline-flex items-center gap-1 text-[13px] font-semibold mt-4 no-underline transition-all hover:gap-2"
                  style={{ color: c.accent === "lime" ? "#8cff2e" : "#a855f7" }}
                >
                  Explore →
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
