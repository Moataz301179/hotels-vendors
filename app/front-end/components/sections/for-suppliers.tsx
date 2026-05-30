"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, SectionLabel, TiltCard } from "../ui/motion";

const features = [
  { title: "Instant InstaPay Settlement", desc: "Receive full invoice amount in <10 seconds via IPN. Zero deduction. 24/7 including weekends." },
  { title: "Non-Recourse Factoring", desc: "Get paid within 24 hours. We take the credit risk. If the hotel doesn't pay, that's our problem." },
  { title: "Purchase Order Visibility", desc: "See confirmed orders before you deliver. Plan your logistics with real hotel commitment data." },
];

export function ForSuppliersSection() {
  return (
    <section id="suppliers" className="py-24 px-8">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <FadeIn delay={0.2} className="hidden lg:flex justify-center order-1 lg:order-1">
          <TiltCard>
            <div
              className="rounded-2xl p-8 w-full text-center"
              style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between pb-4 mb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                </div>
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>Invoice Status</span>
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="text-[48px] font-black text-[#8cff2e] tracking-[-0.04em]">&lt;10s</div>
              </motion.div>
              <p className="text-[13px] mt-2 mb-6" style={{ color: "rgba(255,255,255,0.65)" }}>InstaPay Settlement</p>

              <div className="flex gap-3 justify-center">
                <span className="px-4 py-2 rounded-lg text-[12px] font-semibold" style={{ background: "rgba(140,255,46,0.12)", border: "1px solid rgba(140,255,46,0.2)", color: "#8cff2e" }}>
                  ✓ Paid
                </span>
                <span className="px-4 py-2 rounded-lg text-[12px] font-semibold" style={{ background: "#171717", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)" }}>
                  Pending
                </span>
              </div>
            </div>
          </TiltCard>
        </FadeIn>

        <div className="order-2 lg:order-2">
          <FadeIn>
            <SectionLabel color="purple">FOR SUPPLIERS</SectionLabel>
            <h2 className="text-3xl md:text-[42px] font-extrabold tracking-[-0.03em] leading-tight mb-5">
              Get Paid.<br />Not Promised.
            </h2>
            <p className="text-[17px] leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
              The biggest barrier for Egyptian hospitality suppliers isn&apos;t finding buyers. It&apos;s collecting money after you&apos;ve delivered.
            </p>
            <p className="text-[17px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              When a hotel approves your invoice, get paid instantly via InstaPay — funds hit your account in under 10 seconds, 24/7, even on weekends.
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
                Become a Supplier
              </Link>
              <Link href="#suppliers" className="text-[15px] font-bold text-white px-8 py-3.5 rounded-xl bg-[#a855f7] hover:bg-[#b56dff] transition-all no-underline">
                Supplier FAQ
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
