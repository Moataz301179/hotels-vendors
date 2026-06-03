"use client";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel } from "../ui/motion";

const stats = [
  { value: "10–20", label: "Daily supplier deliveries per hotel. Operations grind to a halt every morning." },
  { value: "60%", label: "Kitchen food waste before a guest sees their meal. 45–73% is avoidable." },
  { value: "~20%", label: "Of F&B inventory lost to spoilage from poor FIFO and over-ordering." },
  { value: "EGP 100K", label: "ETA penalty risk. Paper invoices are legally invalid since 2022." },
];

export function RealitySection() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-[1280px] mx-auto">
        <FadeIn>
          <SectionLabel>THE REALITY</SectionLabel>
          <h2 className="text-3xl md:text-[42px] font-extrabold tracking-[-0.03em] leading-tight mb-5">
            Egyptian Hotels Work With Hundreds of Suppliers.<br />
            And Still Run Out of Stock Before They Run Out of Month.
          </h2>
          <p className="text-[17px] leading-relaxed max-w-[600px]" style={{ color: "rgba(255,255,255,0.65)" }}>
            The HoReCa market in Egypt will hit $18.14 billion by 2029. Yet the average hotel procurement operation runs on WhatsApp messages, paper invoices, cash payments, and prayers.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {stats.map((s, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="rounded-2xl p-7 h-full"
                style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}
                whileHover={{
                  borderColor: "rgba(140,255,46,0.3)",
                  y: -2,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="text-[36px] font-black tracking-[-0.03em] text-[#8cff2e] mb-2">{s.value}</div>
                <div className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{s.label}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
