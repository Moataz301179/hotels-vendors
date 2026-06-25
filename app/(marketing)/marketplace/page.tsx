"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Truck,
  Banknote,
  Clock,
  Building2,
  Package,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Plug,
  Webhook,
  RefreshCw,
  Database,
  Layers,
  Code2,
  Terminal,
  Server,
  Cpu,
  GitBranch,
  Boxes,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

const accent = "var(--accent-base)";
const accentMuted = "rgba(52,211,153,0.08)";
const accentBorder = "rgba(52,211,153,0.20)";
const surface = "#111520";
const borderSubtle = "rgba(255,255,255,0.06)";

const CATEGORIES = [
  { name: "F&B", desc: "Food, beverages & kitchen equipment", icon: "🍽️" },
  { name: "Consumables", desc: "Linens, chemicals & cleaning supplies", icon: "🧴" },
  { name: "Guest Supplies", desc: "Amenities & room accessories", icon: "🛁" },
  { name: "FF&E", desc: "Furniture, fixtures & capital equipment", icon: "🪑" },
  { name: "Services", desc: "Maintenance, pest control & laundry", icon: "🔧" },
];

const API_HOOKS = [
  { method: "POST", path: "/api/v1/inventory/sync", desc: "Bulk inventory update from PMS or ERP", status: "active" },
  { method: "GET", path: "/api/v1/catalog/search", desc: "Search supplier catalogs with filters", status: "active" },
  { method: "POST", path: "/api/v1/orders", desc: "Create purchase order programmatically", status: "active" },
  { method: "GET", path: "/api/v1/orders/:id/eta", desc: "Retrieve ETA-compliant invoice UUID", status: "active" },
  { method: "POST", path: "/api/v1/webhooks/register", desc: "Register webhook for PO/delivery events", status: "active" },
  { method: "GET", path: "/api/v1/suppliers/:id/credit", desc: "Check supplier factoring credit limit", status: "beta" },
];

const PLUGIN_EXTENSIONS = [
  { name: "Opera PMS Connector", desc: "Sync inventory from Opera Cloud. Auto-reorder triggers based on par levels.", icon: Layers, version: "v2.4.1" },
  { name: "SAP Hospitality Bridge", desc: "Bi-directional sync with SAP. Purchase orders, invoices, and stock movements.", icon: Server, version: "v1.8.0" },
  { name: "Mews Hotels Integration", desc: "Real-time inventory from Mews. AI predicts consumption from occupancy data.", icon: Cpu, version: "v3.1.0" },
  { name: "Sherlock RMS Plugin", desc: "Revenue management data feeds AI procurement forecasts. 94% accuracy.", icon: GitBranch, version: "v2.0.3" },
  { name: "ETA E-Invoice Gateway", desc: "Direct integration with Egyptian Tax Authority. Auto-sign, submit, archive.", icon: Terminal, version: "v4.2.0" },
  { name: "Shark-Breaker Logistics", desc: "Shared-route optimization for Red Sea resorts. GPS tracking, auto-settlement.", icon: Truck, version: "v1.5.0" },
];

const HOTEL_GROUPS = [
  "Stella Di Mare", "Sunrise Resorts", "Jaz Hotels", "Baron Hotels",
  "Pickalbatros", "Marriott Hurghada", "Four Seasons Sharm", "Rixos Sharm",
];

const VENDOR_PREVIEW = [
  // ═══ FF&E / Furniture (7) ═══
  { name: "ElKafoury Group", category: "FF&E", area: "New Cairo", signal: "MENA hotel fabrics, curtains, furniture, linen — founded 1996", email: "info@elkafourygroup.com", phone: "+20 1002271000", source: "elkafourygroup.com", featured: true },
  { name: "Rowad Furniture", category: "FF&E", area: "6th of October City", signal: "Hotel/resort fixed joinery + outdoor furniture", email: "sales@elrowadfurniture.com.eg", phone: "+20 12-210-22866", source: "rowadfurniture.com", featured: true },
  { name: "La Stanza", category: "FF&E", area: "5th Settlement", signal: "Hospitality furniture since 1986; natural woods, MDF, HPL", email: "info@lastanza.com", phone: "+20 1200417617", source: "lastanza.com", featured: false },
  { name: "A2Z for Furniture", category: "FF&E", area: "Hurghada", signal: "Luxury hotel/resort furniture — Red Sea-based", email: "info@a2zforfurniture.com", phone: "+20 1000360370", source: "a2zforfurniture.com", featured: true },
  { name: "Gloria Furniture", category: "FF&E", area: "Obour, Cairo", signal: "Custom hotel guest room furniture", email: "info@gloria-furniture.com", phone: "01222168959", source: "gloria-furniture.com", featured: false },
  { name: "CABS Group", category: "FF&E", area: "Katameya, Cairo", signal: "Hotel furniture, fixtures, guest amenities for Egypt + Gulf", email: "info@cabseg.com", phone: "+20 1220084004", source: "cabseg.com", featured: false },
  { name: "Woplek", category: "FF&E", area: "Egypt (export)", signal: "Made-to-order hotel/office furniture, global exporter", email: "info@woplek.com", phone: "+20 1211192111", source: "woplek.com", featured: false },
  // ═══ Guest Supplies / Amenities (14) ═══
  { name: "Siag Chemicals", category: "Consumables", area: "Cairo / 10th Ramadan", signal: "Pool chemicals, housekeeping, bathroom amenities for 3-5 star hotels", email: "info@siagchemicals.com", phone: "+20 2 4440563", source: "siagchemicals.com", featured: true },
  { name: "Adnanco", category: "Guest Supplies", area: "Sharm El-Sheikh", signal: "20+ years; mattresses, bedding, bath textiles for Red Sea hotels", email: "—", phone: "+20 11 11660606", source: "adnanco-eg.com", featured: true },
  { name: "Standard General Supplies", category: "Guest Supplies", area: "Hurghada (El Hadaba)", signal: "Bespoke linens + amenities for Red Sea luxury hotels", email: "—", phone: "+20 1222270760", source: "standardegy.com", featured: true },
  { name: "Master Nile", category: "Guest Supplies", area: "Cairo/Giza", signal: "Bathroom accessories, guest room items at factory prices", email: "info@masternile.com", phone: "+20 1223432705", source: "masternile.com", featured: false },
  { name: "Top Trade", category: "Guest Supplies", area: "Cairo", signal: "Bathroom amenities + housekeeping supplies distributor", email: "info@toptradeeg.com", phone: "+20 1282709997", source: "toptradeeg.com", featured: false },
  { name: "Three Brothers", category: "Guest Supplies", area: "Cairo", signal: "Hair dryers, safe boxes, minibars, bathroom accessories", email: "info@3brother4hotels.com", phone: "+2 01015630008", source: "3brother4hotels.com", featured: false },
  { name: "Shahed Group", category: "Guest Supplies", area: "Mohandiseen, Cairo", signal: "Housekeeping trolleys, laundry equipment from global brands", email: "shahedgroup@elshahedgroup.com", phone: "+20 19035", source: "shahedgroup.com", featured: false },
  { name: "MTS for Hotel Supplies", category: "Guest Supplies", area: "Sharm El-Sheikh", signal: "HORECA supplies + fleet delivery across Red Sea", email: "sales.cairo@mtshotelsupply.com", phone: "—", source: "mtshotelsupply.com", featured: true },
  { name: "Al AZIMA LINEN", category: "Guest Supplies", area: "Cairo", signal: "Industrial laundry & linen services for hotels", email: "—", phone: "—", source: "alazimalinen.com", featured: false },
  { name: "Dominick", category: "Guest Supplies", area: "Cairo", signal: "Guest room accessories + hospitality textiles", email: "—", phone: "—", source: "dominick-eg.com", featured: false },
  { name: "EITS", category: "Guest Supplies", area: "Cairo", signal: "Hospitality essentials + room supplies", email: "—", phone: "—", source: "eits-eg.com", featured: false },
  { name: "Hellen's", category: "Guest Supplies", area: "Cairo", signal: "Hotel guest supplies & amenities", email: "—", phone: "—", source: "hotelsupplies-eg.com", featured: false },
  { name: "KTC", category: "Guest Supplies", area: "Cairo", signal: "Hotel consumables + guest room accessories", email: "—", phone: "—", source: "ktc-eg.com", featured: false },
  { name: "Fantastic Trade", category: "Guest Supplies", area: "Cairo", signal: "Guest supplies + hotel consumables", email: "—", phone: "—", source: "fantastictrade-eg.com", featured: false },
  // ═══ Kitchen / Food Service Equipment (5) ═══
  { name: "ETTC (Egyptian Tabletop)", category: "FF&E", area: "Cairo + Sharm + Hurghada", signal: "Tabletop, glassware, kitchen utensils — multi-branch Red Sea", email: "customercare@ettcegypt.com", phone: "+20 1044411545", source: "ettcegypt.com", featured: true },
  { name: "Cairo Marketing (CMC)", category: "FF&E", area: "Cairo + Sharm + Alexandria", signal: "Industrial laundry, espresso machines, kitchen equipment since 1986", email: "cmc@cairo-markiting.com", phone: "+202 245 55 305", source: "cairo-marketing.com", featured: true },
  { name: "Mako Trade Egypt", category: "FF&E", area: "Hurghada", signal: "Kitchen/restaurant equipment (dishwashers, ovens, ice makers)", email: "info@mako-trading.com", phone: "+20 1127548293", source: "mako-trading.com", featured: false },
  { name: "Comet Group", category: "FF&E", area: "10th Ramadan + Hurghada + Sharm", signal: "Professional food service equipment + CAD design", email: "—", phone: "—", source: "cometgroup-eg.com", featured: false },
  { name: "EGYTL", category: "FF&E", area: "Cairo", signal: "Hotel & kitchen equipment; European brand distributor", email: "S_egytl@yahoo.com", phone: "+20 2 33 44 85 48", source: "egytl.com", featured: false },
  // ═══ Security (5) ═══
  { name: "Safe Guard (Travco)", category: "Security", area: "Egypt-wide", signal: "Hotel security services + Travco hospitality group", email: "amgad.gendy@travco.com", phone: "—", source: "safeguard-eg.com", featured: false },
  { name: "EGYPT SSC", category: "Security", area: "Egypt-wide", signal: "Security services for hotels & corporates", email: "—", phone: "—", source: "egyptssc.com", featured: false },
  { name: "Phoenix Security", category: "Security", area: "Egypt-wide", signal: "Hotel + corporate security solutions", email: "—", phone: "—", source: "phoenixsecurity-eg.com", featured: false },
  { name: "ASSC", category: "Security", area: "Egypt-wide", signal: "Security consulting for hospitality", email: "—", phone: "—", source: "african-egypt.com", featured: false },
  { name: "Titan Security Global", category: "Security", area: "Egypt-wide", signal: "International security services — Egypt office", email: "—", phone: "—", source: "titansecurityglobal.com", featured: false },
  // ═══ Hospitality Consulting (6) ═══
  { name: "Lozan Consulting", category: "Consulting", area: "Cairo", signal: "Hospitality development consulting for hotels & resorts", email: "omar@lozan.consulting", phone: "—", source: "lozan.consulting", featured: false },
  { name: "RHB Consultants", category: "Consulting", area: "Heliopolis, Cairo", signal: "Hospitality development/management/ops consulting", email: "Info@RHB-Consultants", phone: "—", source: "rhb-consultants.com", featured: false },
  { name: "Levvee", category: "Consulting", area: "Egypt", signal: "Hospitality strategy + ops consulting", email: "—", phone: "—", source: "levvee.com", featured: false },
  { name: "Delegation", category: "Consulting", area: "Egypt", signal: "Hospitality project management + consulting", email: "—", phone: "—", source: "delegation-eg.com", featured: false },
  { name: "SECTI", category: "Consulting", area: "Egypt", signal: "Hospitality education & training", email: "—", phone: "—", source: "secti-eg.com", featured: false },
  { name: "Hospitality MENA", category: "Consulting", area: "MENA region", signal: "Hospitality consulting + thought leadership", email: "—", phone: "—", source: "hospitalitymena.com", featured: false },
  // ═══ HVAC / MEP (4) ═══
  { name: "SAPINA Egypt", category: "HVAC", area: "Sharm El-Sheikh", signal: "HVAC + MEP for hotels + resorts", email: "—", phone: "—", source: "sapina-egy.com", featured: false },
  { name: "El-Dawlia", category: "HVAC", area: "Egypt", signal: "HVAC installation + maintenance for hospitality", email: "—", phone: "—", source: "el-dawlia.com", featured: false },
  { name: "AlHamd", category: "HVAC", area: "Egypt", signal: "HVAC + mechanical engineering for hotels", email: "—", phone: "—", source: "alhamd-eg.com", featured: false },
  { name: "EGAC", category: "HVAC", area: "Egypt", signal: "Air conditioning + ventilation systems", email: "—", phone: "—", source: "eg-ac.com", featured: false },
  // ═══ Pest Control (7) ═══
  { name: "German Pest Service", category: "Pest Control", area: "Hurghada", signal: "Pest control services for Red Sea hotels", email: "info@german-pestservice.com", phone: "—", source: "german-pestservice.com", featured: true },
  { name: "SOTAICO", category: "Pest Control", area: "Egypt", signal: "Integrated pest management solutions", email: "—", phone: "—", source: "sotaico.com", featured: false },
  { name: "Remedy Facility Mgmt", category: "Pest Control", area: "Obour, Cairo", signal: "Full-service: pest + cleaning + landscaping + pools", email: "info@remedyegypt.com", phone: "—", source: "remedyegypt.com", featured: true },
  { name: "Orkin Egypt", category: "Pest Control", area: "Egypt", signal: "Global brand — pest control for hospitality", email: "—", phone: "—", source: "orkin.com.eg", featured: false },
  { name: "Pestra", category: "Pest Control", area: "Egypt", signal: "Pest management for hotels & facilities", email: "pcmanager@pestraeg.com", phone: "—", source: "pestraeg.com", featured: false },
  { name: "SWF Pest Control", category: "Pest Control", area: "Egypt", signal: "Specialized pest control services", email: "—", phone: "—", source: "swfpestcontrol.com", featured: false },
  { name: "Top Control", category: "Pest Control", area: "Sharm El-Sheikh", signal: "Local pest control for South Sinai hotels", email: "—", phone: "—", source: "topcontrol-eg.com", featured: false },
  // ═══ Marine / Dive / Water Sports (4) ═══
  { name: "Egypt Sunmarine", category: "Marine", area: "Sharm El-Sheikh", signal: "Marine activities for resort guests since 2001", email: "emarketing@egyptsunmarine.com", phone: "—", source: "egyptsunmarine.com", featured: true },
  { name: "Beyond Limits Egypt", category: "Marine", area: "Sharm El-Sheikh", signal: "Dive equipment (MARES dealer) + water sports", email: "—", phone: "—", source: "beyondlimitsegypt.com", featured: false },
  { name: "Red Sea Group", category: "Marine", area: "Red Sea Governorate", signal: "Red Sea marine services + logistics", email: "—", phone: "—", source: "redseagroup.com.eg", featured: false },
  { name: "Red Sea Relax", category: "Marine", area: "Dahab + Hurghada", signal: "Dive trips + marine activities", email: "—", phone: "—", source: "redsearelax.com", featured: false },
  // ═══ Landscaping (4) ═══
  { name: "HydroGreen Egypt", category: "Landscaping", area: "Egypt", signal: "Landscaping + irrigation systems for hotels", email: "—", phone: "—", source: "hydrogreeneg.com", featured: false },
  { name: "LandMasters Egypt", category: "Landscaping", area: "Egypt", signal: "Landscape design + maintenance for resorts", email: "—", phone: "—", source: "landmastersegypt.com", featured: false },
  { name: "Egypt Scape", category: "Landscaping", area: "Egypt", signal: "Landscaping services for hospitality", email: "—", phone: "—", source: "egyptscape.com", featured: false },
  { name: "Sallam Pools & Landscaping", category: "Landscaping", area: "Hurghada", signal: "Pool maintenance + landscaping — Red Sea-based", email: "—", phone: "—", source: "sallam-eg.com", featured: false },
  // ═══ Logistics / Services (2) ═══
  { name: "Ramex Hotel Supplies", category: "Services", area: "Sharm + Nasr City", signal: "Multi-branch hotel supplies — Red Sea + Cairo", email: "—", phone: "069-3661712", source: "ramexweb.com", featured: false },
  { name: "New Star EG", category: "Services", area: "Heliopolis, Cairo", signal: "600+ outlet distribution; 8,000+ cafés/restaurants/hotels served", email: "info.ns@newstareg.com", phone: "+202 15789", source: "newstareg.com", featured: false },
];

export default function MarketplacePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: "var(--background)", fontFamily: "'Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      <MarketingNav />

      {/* ═══ Hero ═══ */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(163,230,53,0.05) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: accentMuted, border: `1px solid ${accentBorder}` }}>
            <Sparkles size={12} style={{ color: accent }} />
            <span className="text-[11px] font-medium" style={{ color: accent }}>Layer 1 — Marketplace & Inventory Orchestration</span>
          </div>

          <h1 className="text-[32px] sm:text-[44px] font-semibold tracking-tight mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Egypt&apos;s B2B Hospitality<br />Procurement Marketplace
          </h1>
          <p className="text-[15px] text-white/50 mb-8 max-w-2xl mx-auto leading-relaxed">
            Fixed-price catalogs from verified Egyptian suppliers. ETA-compliant invoicing.
            24-hour settlement via embedded factoring. Open API + plugin ecosystem.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@hotel.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[13px] text-white placeholder:text-white/20 outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${borderSubtle}` }}
                />
              </div>
              <button type="submit" className="px-6 py-3.5 rounded-xl text-[13px] font-medium transition-all hover:opacity-90 flex items-center gap-2" style={{ backgroundColor: accent, color: "#fff" }}>
                Join Waitlist <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl" style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <CheckCircle2 size={18} className="text-green-400" />
              <span className="text-[14px] text-green-400">You&apos;re on the list. We&apos;ll reach out when we launch.</span>
            </div>
          )}
          <p className="text-[11px] text-white/20 mt-3">No spam. Early access + priority onboarding for waitlist members.</p>
        </div>
      </section>

      {/* ═══ Hotel Groups Trust Bar ═══ */}
      <section className="py-8 border-y" style={{ borderColor: borderSubtle }}>
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/20 text-center mb-5">Trusted by procurement teams at</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {HOTEL_GROUPS.map((name) => (
              <span key={name} className="text-[12px] text-white/25 font-medium">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Layer 1 — Verified Vendor Preview Grid ═══ */}
      <section className="py-16" style={{ borderTop: `1px solid ${borderSubtle}` }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentMuted }}>
              <Boxes size={16} style={{ color: accent }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Layer 1 — Verified Suppliers</span>
          </div>
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Real Suppliers — Already Serving Red Sea Hotels
          </h2>
          <p className="text-[14px] text-white/40 max-w-2xl mb-8">
            Fifty verified Egyptian suppliers & service providers across FF&E, consumables, guest supplies, security, consulting, HVAC, pest control, marine services, and landscaping — actively supplying Sharm El-Sheikh, Hurghada, Dahab, El Gouna, Marsa Alam, and the wider Red Sea corridor.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VENDOR_PREVIEW.map((v) => {
              const initials = v.name
                .split(" ")
                .filter((w) => /^[A-Za-z]/.test(w))
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase();
              // Deterministic color from name
              const hue = v.name.charCodeAt(0) * 7 + v.name.length * 13;
              const avatarBg = v.featured
                ? accent
                : `hsl(${hue % 360}, 45%, 28%)`;
              const avatarColor = v.featured ? "#fff" : "rgba(255,255,255,0.85)";
              return (
                <div
                  key={v.name}
                  className="rounded-xl p-4 transition-all hover:scale-[1.02] hover:-translate-y-0.5 flex gap-3 items-start"
                  style={{
                    backgroundColor: "rgba(17,21,32,0.7)",
                    backdropFilter: "blur(8px)",
                    border: v.featured ? `1px solid ${accentBorder}` : `1px solid ${borderSubtle}`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-[13px] font-bold"
                    style={{ backgroundColor: avatarBg, color: avatarColor }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[13px] font-medium text-white/90 truncate">{v.name}</h3>
                      {v.featured && (
                        <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded" style={{ backgroundColor: accentMuted, color: accent }}>Featured</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: accentMuted, color: accent }}>{v.category}</span>
                      <span className="text-[10px] text-white/25">{v.area}</span>
                    </div>
                    <p className="text-[11px] text-white/35 leading-snug mb-1.5">{v.signal}</p>
                    <div className="flex items-center gap-2 text-[10px] text-white/25 flex-wrap">
                      {v.email !== "—" && <span>✉ {v.email}</span>}
                      {v.phone !== "—" && <span>☎ {v.phone}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-white/20 mt-6 text-center">
            Preview of verified suppliers — full catalog access requires waitlist registration. Data verified 2026-06-25.
          </p>
        </div>
      </section>

      {/* ═══ API Hooks ═══ */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentMuted }}>
              <Code2 size={16} style={{ color: accent }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Developer API</span>
          </div>
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            RESTful Hooks for Inventory Synchronization
          </h2>
          <p className="text-[14px] text-white/40 max-w-2xl mb-8">
            Connect your PMS, ERP, or proprietary system directly to the HotelsVendors marketplace. Real-time inventory sync, automated PO generation, and ETA invoice retrieval.
          </p>

          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${borderSubtle}` }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${borderSubtle}` }}>
              <Terminal size={14} className="text-white/40" />
              <span className="text-[11px] font-mono text-white/40">api.hotelsvendors.com/v1</span>
            </div>
            <div className="divide-y" style={{ borderColor: borderSubtle }}>
              {API_HOOKS.map((hook) => (
                <div key={hook.path} className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors" style={{ borderBottom: `1px solid ${borderSubtle}` }}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{
                    backgroundColor: hook.method === "GET" ? "rgba(59,130,246,0.15)" : "rgba(34,197,94,0.15)",
                    color: hook.method === "GET" ? "#60A5FA" : "#4ADE80",
                  }}>{hook.method}</span>
                  <code className="text-[12px] font-mono text-white/60 flex-1">{hook.path}</code>
                  <span className="text-[10px] text-white/30 hidden sm:block">{hook.desc}</span>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{
                    backgroundColor: hook.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)",
                    color: hook.status === "active" ? "#4ADE80" : "#FACC15",
                  }}>{hook.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Plugin Extensions ═══ */}
      <section className="py-20" style={{ borderTop: `1px solid ${borderSubtle}` }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentMuted }}>
              <Plug size={16} style={{ color: accent }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Plugin Ecosystem</span>
          </div>
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Hospitality Integrations & Extensions
          </h2>
          <p className="text-[14px] text-white/40 max-w-2xl mb-8">
            Pre-built connectors for major PMS, RMS, and ERP platforms. Deploy in hours, not months.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLUGIN_EXTENSIONS.map((plugin) => {
              const Icon = plugin.icon;
              return (
                <div key={plugin.name} className="rounded-xl p-5 transition-all hover:scale-[1.01]" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentMuted }}>
                      <Icon size={18} style={{ color: accent }} />
                    </div>
                    <span className="text-[10px] font-mono text-white/25">{plugin.version}</span>
                  </div>
                  <h3 className="text-[14px] font-medium text-white/90 mb-1">{plugin.name}</h3>
                  <p className="text-[12px] text-white/35 leading-relaxed">{plugin.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Product Categories ═══ */}
      <section className="py-20" style={{ borderTop: `1px solid ${borderSubtle}` }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Product Categories
            </h2>
            <p className="text-[14px] text-white/40 max-w-lg mx-auto">
              Five curated categories covering the full hospitality supply chain.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="rounded-xl p-5 transition-all hover:scale-[1.01]" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: accentMuted }}>
                  <span className="text-[18px]">{cat.icon}</span>
                </div>
                <h3 className="text-[14px] font-medium text-white/90 mb-1">{cat.name}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
            <div className="rounded-xl p-5 flex flex-col items-center justify-center text-center" style={{ backgroundColor: accentMuted, border: `1px solid ${accentBorder}` }}>
              <Sparkles size={20} style={{ color: accent }} className="mb-2" />
              <h3 className="text-[14px] font-medium mb-1" style={{ color: accent }}>AI Sourcing Agent</h3>
              <p className="text-[12px] text-white/40 leading-relaxed">Describe what you need. Our agent finds it from verified suppliers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Trust Signals ═══ */}
      <section className="py-12 border-t" style={{ borderColor: borderSubtle }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "Verified Suppliers", desc: "KYC + trade license verified" },
              { icon: Banknote, label: "48h Settlement", desc: "Embedded invoice factoring" },
              { icon: Truck, label: "Coastal Delivery", desc: "Shark-Breaker shared logistics" },
              { icon: Clock, label: "ETA Invoicing", desc: "Auto-generated compliant invoices" },
            ].map((signal) => (
              <div key={signal.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
                <signal.icon size={20} style={{ color: accent }} className="mx-auto mb-2" />
                <p className="text-[12px] font-medium text-white/70 mb-0.5">{signal.label}</p>
                <p className="text-[10px] text-white/30">{signal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 border-t" style={{ borderColor: borderSubtle }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Transform Your Procurement?
          </h2>
          <p className="text-[14px] text-white/40 mb-8 max-w-lg mx-auto">
            Join the waitlist for early access. Priority onboarding for coastal hotel procurement teams.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:opacity-90" style={{ backgroundColor: accent, color: "#fff" }}>
              Get Started Free <ArrowRight size={14} />
            </Link>
            <Link href="/become-supplier" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: `1px solid ${accentBorder}`, color: accent }}>
              Become a Supplier
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
