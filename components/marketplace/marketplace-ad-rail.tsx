"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Megaphone, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategoryImage } from "@/lib/marketplace/product-images";

const CAMPAIGNS = [
  {
    eyebrow: "Sponsored supplier",
    title: "Fresh produce, delivered for your next service",
    detail: "Priority hotel supply from verified hospitality vendors",
    action: "Shop F&B",
    href: "?category=fb",
    image: getCategoryImage("fb"),
    accent: "#f59e0b",
    tint: "rgba(245,158,11,0.22)",
  },
  {
    eyebrow: "Featured collection",
    title: "Room-ready essentials in one order",
    detail: "Linens, guest amenities, and housekeeping replenishment",
    action: "Explore rooms",
    href: "?category=lin",
    image: getCategoryImage("lin"),
    accent: "#2dd4bf",
    tint: "rgba(45,212,191,0.2)",
  },
  {
    eyebrow: "Seasonal offer",
    title: "Equip your property before peak season",
    detail: "Hotel-grade furniture, fixtures, and operating supplies",
    action: "Browse FFE",
    href: "?category=ffe",
    image: getCategoryImage("ffe"),
    accent: "#a78bfa",
    tint: "rgba(167,139,250,0.22)",
  },
];

export function MarketplaceAdRail() {
  const [active, setActive] = useState(0);
  const campaign = CAMPAIGNS[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % CAMPAIGNS.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const move = (direction: number) => {
    setActive((current) => (current + direction + CAMPAIGNS.length) % CAMPAIGNS.length);
  };

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-5" aria-label="Sponsored marketplace campaigns">
      <div className="relative min-h-[190px] overflow-hidden rounded-[26px] border border-white/10 bg-[#101016] shadow-2xl shadow-black/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -35 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 78% 45%, ${campaign.tint}, transparent 38%), linear-gradient(105deg, #111118 0%, #17171f 58%, ${campaign.tint} 100%)` }} />
            <div className="absolute right-0 top-0 h-full w-[48%] sm:w-[34%] overflow-hidden">
              <Image src={campaign.image} alt="" fill sizes="(max-width: 640px) 48vw, 34vw" className="object-cover opacity-80 mix-blend-screen" priority={active === 0} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111118] via-[#111118]/35 to-transparent" />
            </div>
            <div className="relative z-10 flex min-h-[190px] items-center px-5 py-6 sm:px-9">
              <div className="max-w-xl">
                <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: campaign.accent }}>
                  <Megaphone className="h-3.5 w-3.5" />
                  {campaign.eyebrow}
                </div>
                <h2 className="max-w-lg text-xl font-semibold leading-tight text-white sm:text-3xl">{campaign.title}</h2>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-white/55 sm:text-sm">{campaign.detail}</p>
                <Link href={campaign.href} className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-[#101016] transition-transform hover:scale-[1.03]" style={{ backgroundColor: campaign.accent }}>
                  <Sparkles className="h-3.5 w-3.5" />
                  {campaign.action}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 right-5 z-20 flex items-center gap-2 sm:right-8">
          <button type="button" onClick={() => move(-1)} aria-label="Previous campaign" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/70 backdrop-blur transition-colors hover:border-white/35 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {CAMPAIGNS.map((item, index) => (
              <button key={item.title} type="button" onClick={() => setActive(index)} aria-label={`Show campaign ${index + 1}`} className={`h-1.5 rounded-full transition-all ${index === active ? "w-7" : "w-1.5 bg-white/30"}`} style={index === active ? { backgroundColor: campaign.accent } : undefined} />
            ))}
          </div>
          <button type="button" onClick={() => move(1)} aria-label="Next campaign" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/70 backdrop-blur transition-colors hover:border-white/35 hover:text-white">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
