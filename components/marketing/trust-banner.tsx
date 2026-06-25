"use client";

import { motion } from "framer-motion";

const HOTEL_GROUPS = [
  { name: "Jaz Hotels", initials: "JZ", properties: 75 },
  { name: "Sunrise Resorts", initials: "SR", properties: 28 },
  { name: "Pickalbatros", initials: "PB", properties: 22 },
  { name: "Pyramisa", initials: "PY", properties: 12 },
  { name: "Baron Hotels", initials: "BR", properties: 8 },
  { name: "Stella Di Mare", initials: "ST", properties: 5 },
  { name: "Tolip Hotels", initials: "TL", properties: 7 },
  { name: "Coral Sea", initials: "CS", properties: 4 },
  { name: "Tropitel", initials: "TR", properties: 6 },
  { name: "Reef Oasis", initials: "RO", properties: 5 },
];

export function TrustBanner() {
  const duplicated = [...HOTEL_GROUPS, ...HOTEL_GROUPS];

  return (
    <section className="py-6 border-y" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "rgba(var(--background-rgb), 0.3)" }}>
      <div className="max-w-7xl mx-auto px-6 mb-4">
        <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] text-center">
          Trusted by Egypt&apos;s Leading Hotel Groups · موثوق من أكبر المجموعات الفندقية
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--background) 0%, transparent 100%)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--background) 0%, transparent 100%)" }}
        />

        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          {duplicated.map((hotel, i) => (
            <div
              key={`${hotel.initials}-${i}`}
              className="flex items-center gap-3 px-5 py-3 rounded-xl shrink-0 transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{
                  backgroundColor: "rgba(255,107,0,0.08)",
                  color: "#FF6B00",
                }}
              >
                {hotel.initials}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white/60 whitespace-nowrap">
                  {hotel.name}
                </div>
                <div className="text-[10px] text-white/20 whitespace-nowrap">
                  {hotel.properties} properties
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
