import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Building2, Store, Truck, CheckCircle2 } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingPage } from "@/components/layout/marketing-page";

export const metadata: Metadata = {
  title: "Hotel Coverage — Where HotelsVendors Operates | Egypt, Red Sea to North Coast",
  description: "HotelsVendors serves hotels across Egypt: Sharm El-Sheikh, Hurghada, Cairo, Alexandria, El Gouna, Safaga, Marsa Matruh, and more. Shark-Breaker logistics coverage included.",
  keywords: ["hotel suppliers Sharm El-Sheikh", "Hurghada resort procurement", "Egypt hotel B2B marketplace", "coastal hotel suppliers Red Sea", "North Coast hotel procurement"],
  openGraph: {
    title: "Hotel Coverage — Where HotelsVendors Operates",
    description: "From Sharm El-Sheikh to Alexandria: Egypt's coastal hotel coverage map.",
    type: "website",
  },
};

type CityStatus = "active" | "limited" | "coming";

const CITIES: {
  name: string;
  nameAr: string;
  x: number;
  y: number;
  status: CityStatus;
  suppliers: number;
  hotels: number;
  logistics: string;
}[] = [
  { name: "Sharm El-Sheikh", nameAr: "شرم الشيخ", x: 305, y: 195, status: "active", suppliers: 84, hotels: 38, logistics: "Shark-Breaker hub" },
  { name: "Hurghada", nameAr: "الغردقة", x: 270, y: 165, status: "active", suppliers: 112, hotels: 52, logistics: "Shark-Breaker hub" },
  { name: "El Gouna", nameAr: "الجونة", x: 252, y: 155, status: "active", suppliers: 38, hotels: 18, logistics: "Shared routes" },
  { name: "Safaga", nameAr: "سفاجا", x: 258, y: 185, status: "limited", suppliers: 14, hotels: 7, logistics: "On-demand" },
  { name: "Cairo", nameAr: "القاهرة", x: 195, y: 105, status: "active", suppliers: 320, hotels: 124, logistics: "Full coverage" },
  { name: "Alexandria", nameAr: "الإسكندرية", x: 125, y: 48, status: "active", suppliers: 95, hotels: 42, logistics: "Full coverage" },
  { name: "Marsa Matruh", nameAr: "مرسى مطروح", x: 75, y: 45, status: "limited", suppliers: 22, hotels: 14, logistics: "Seasonal" },
  { name: "North Coast", nameAr: "الساحل الشمالي", x: 105, y: 42, status: "active", suppliers: 48, hotels: 28, logistics: "Seasonal (Oct–Apr)" },
  { name: "Aswan", nameAr: "أسوان", x: 215, y: 235, status: "coming", suppliers: 0, hotels: 0, logistics: "Q3 2026" },
  { name: "Luxor", nameAr: "الأقصر", x: 225, y: 215, status: "coming", suppliers: 0, hotels: 0, logistics: "Q3 2026" },
];

const STATUS_META: Record<CityStatus, { label: string; color: string; bg: string; border: string }> = {
  active: { label: "Active", color: "#2E7D4F", bg: "rgba(46,125,79,0.08)", border: "rgba(46,125,79,0.2)" },
  limited: { label: "Limited", color: "#B8860B", bg: "rgba(184,134,11,0.08)", border: "rgba(184,134,11,0.2)" },
  coming: { label: "Coming Soon", color: "#7A756E", bg: "rgba(122,117,110,0.08)", border: "rgba(122,117,110,0.2)" },
};

export default function CoveragePage() {
  const activeCities = CITIES.filter((c) => c.status === "active");
  const totalSuppliers = CITIES.reduce((sum, c) => sum + c.suppliers, 0);
  const totalHotels = CITIES.reduce((sum, c) => sum + c.hotels, 0);

  return (
    <MarketingPage>
      <MarketingNav />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="label-upper mb-3 block">Coverage Map</span>
          <h1 className="text-[clamp(28px,5vw,48px)] font-medium leading-[1.05] tracking-tight mb-5">
            Serving Egypt&apos;s<br />
            <span className="text-gradient-accent">Coastal Hotel Corridor.</span>
          </h1>
          <p className="text-[15px] text-secondary max-w-2xl leading-relaxed mb-6">
            From Sharm El-Sheikh to Marsa Matruh — HotelsVendors connects coastal resorts with
            Cairo-based suppliers through our Shark-Breaker shared logistics network.
          </p>
          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-4">
            {[
              { val: `${activeCities.length}`, label: "Active cities" },
              { val: `${totalSuppliers}+`, label: "Verified suppliers" },
              { val: `${totalHotels}+`, label: "Hotel properties" },
              { val: "6", label: "Governorates" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[22px] md:text-[26px] font-semibold metric-value" style={{ color: "var(--accent-base)" }}>{s.val}</div>
                <div className="text-[10px] label-upper">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 marketing-section">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Map */}
            <div className="md:col-span-3 surface-card p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-medium" style={{ color: "var(--text-primary)" }}>Coverage Map</h2>
                <div className="flex items-center gap-3 text-[9px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#2E7D4F" }}/> Active</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#B8860B" }}/> Limited</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#9D978E" }}/> Coming</span>
                </div>
              </div>
              <svg viewBox="0 0 400 280" className="w-full h-auto" role="img" aria-label="Map of Egypt showing HotelsVendors coverage">
                {/* Mediterranean Sea */}
                <rect x="0" y="0" width="400" height="55" fill="#E5EEF7" opacity="0.4"/>
                <text x="18" y="28" fontSize="8" fill="#2B6CB0" opacity="0.5">Mediterranean Sea</text>
                {/* Red Sea label */}
                <text x="310" y="240" fontSize="8" fill="#A16207" opacity="0.5">Red Sea</text>
                {/* Egypt outline */}
                <path d="M 60 35 L 340 35 L 355 75 L 365 140 L 350 200 L 320 260 L 275 272 L 215 265 L 150 272 L 105 255 L 80 205 L 60 145 L 60 35 Z"
                  fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5"/>
                {/* Nile */}
                <path d="M 210 55 Q 218 105 210 155 Q 205 195 210 260"
                  fill="none" stroke="#B8D4E8" strokeWidth="3" opacity="0.6"/>
                {/* Cairo hub */}
                <rect x="198" y="96" width="22" height="13" rx="3" fill="#A16207"/>
                <text x="201" y="105" fontSize="6" fill="#F8FAFC" fontWeight="600">CAI</text>
                {/* Shark-Breaker routes from Cairo */}
                {CITIES.filter(c => c.status !== "coming").map((city) => (
                  <path
                    key={`route-${city.name}`}
                    d={`M 210 110 Q ${(210 + city.x) / 2} ${(110 + city.y) / 2 - 10} ${city.x} ${city.y}`}
                    fill="none"
                    stroke={city.status === "active" ? "#A16207" : "#CBD5E1"}
                    strokeWidth="1"
                    strokeDasharray={city.status === "active" ? "0" : "3 2"}
                    opacity="0.5"
                  />
                ))}
                {/* Cities */}
                {CITIES.map((city) => {
                  const meta = STATUS_META[city.status];
                  return (
                    <g key={city.name}>
                      {city.status === "active" && (
                        <>
                          <circle cx={city.x} cy={city.y} r="16" fill={meta.color} opacity="0.1"/>
                          <circle cx={city.x} cy={city.y} r="9" fill={meta.color} opacity="0.15"/>
                        </>
                      )}
                      <circle cx={city.x} cy={city.y} r="4" fill={meta.color} stroke="#F8FAFC" strokeWidth="1.5"/>
                      <text x={city.x + 8} y={city.y + 3} fontSize="7" fill="#1A1816" fontWeight="500">
                        {city.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* City list */}
            <div className="md:col-span-2 space-y-2">
              <h2 className="label-upper mb-3">Cities</h2>
              {CITIES.map((city) => {
                const meta = STATUS_META[city.status];
                return (
                  <div
                    key={city.name}
                    className="surface-card p-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MapPin size={14} style={{ color: meta.color }} className="shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[12px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                          {city.name}
                          <span className="text-[10px] ml-1.5" dir="rtl" style={{ color: "var(--text-muted)" }}>{city.nameAr}</span>
                        </div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          {city.suppliers > 0 ? `${city.suppliers} suppliers · ${city.hotels} hotels` : city.logistics}
                        </div>
                      </div>
                    </div>
                    <span
                      className="status-pill shrink-0"
                      style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
                    >
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Active city highlights */}
      <section className="py-16 marketing-section-alt">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="label-upper mb-8 text-center">Top Coverage Zones</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                city: "Sharm El-Sheikh",
                icon: Building2,
                stats: [
                  { label: "Active hotels", value: "38" },
                  { label: "Suppliers", value: "84" },
                  { label: "Shark-Breaker routes", value: "Daily" },
                ],
                note: "Largest coastal hub. Full logistics coverage.",
              },
              {
                city: "Hurghada",
                icon: Store,
                stats: [
                  { label: "Active hotels", value: "52" },
                  { label: "Suppliers", value: "112" },
                  { label: "Shark-Breaker routes", value: "Daily" },
                ],
                note: "Highest supplier density. 48h delivery to all major resorts.",
              },
              {
                city: "Cairo",
                icon: Truck,
                stats: [
                  { label: "Active hotels", value: "124" },
                  { label: "Suppliers", value: "320" },
                  { label: "Shark-Breaker routes", value: "Full" },
                ],
                note: "Central logistics hub. Origin point for coastal routes.",
              },
            ].map((zone) => (
              <div key={zone.city} className="surface-card p-6">
                <zone.icon size={20} className="mb-3" style={{ color: "var(--accent-base)" }} />
                <h3 className="text-[15px] font-medium mb-3" style={{ color: "var(--text-primary)" }}>{zone.city}</h3>
                <div className="space-y-2 mb-4">
                  {zone.stats.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-[12px]">
                      <span style={{ color: "var(--text-muted)" }}>{s.label}</span>
                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{s.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-secondary pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  {zone.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming soon CTA */}
      <section className="py-16 marketing-section">
        <div className="mx-auto max-w-7xl px-6">
          <div className="surface-card p-8 md:p-10 text-center relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-[300px] h-[200px] rounded-full blur-[80px] pointer-events-none"
              style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }}
            />
            <div className="relative z-10">
              <h2 className="text-[22px] md:text-[26px] font-medium mb-3">
                Don&apos;t See Your City?
              </h2>
              <p className="text-[14px] text-secondary max-w-lg mx-auto mb-2">
                We&apos;re expanding to Aswan, Luxor, and additional Red Sea ports in Q3 2026.
                Register your interest to be first in line when we launch.
              </p>
              <p className="text-[11px] text-muted mb-6">
                Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/register" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--accent-base)] text-[var(--accent-text)] text-sm font-semibold rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5">
                  Register Interest <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--border-visible)] text-[var(--foreground-secondary)] text-sm font-medium rounded-xl transition-all duration-200 hover:border-[var(--accent-base)] hover:text-[var(--foreground)]">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </MarketingPage>
  );
}
