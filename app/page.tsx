"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Menu, X, Package, ShoppingCart,
  Truck, CreditCard, Landmark, ShieldCheck, BarChart3, Search,
  MessageCircle, XIcon, Zap, Users, FileCheck, TrendingUp,
  ChevronRight, Building2, MapPin, Clock,
} from "lucide-react";

const CATEGORY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop", label: "Linens & Textiles", count: "2,400+ SKUs" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", label: "Food & Beverage", count: "4,100+ SKUs" },
  { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", label: "Housekeeping", count: "1,800+ SKUs" },
  { src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop", label: "Engineering", count: "1,700+ SKUs" },
];

const FEATURES = [
  { icon: Package, title: "Unified Catalog", desc: "10,000+ SKUs across F&B, housekeeping, linens, and engineering from verified Egyptian suppliers." },
  { icon: Truck, title: "Shared Logistics", desc: "Coastal-cluster fulfillment with real-time tracking. Cut delivery costs by 40%." },
  { icon: CreditCard, title: "Embedded Factoring", desc: "Non-recourse invoice financing. Suppliers get paid in 48 hours, not 90 days." },
  { icon: Landmark, title: "ETA E-Invoicing", desc: "Real-time submission to the Egyptian Tax Authority. Digitally signed, fully compliant." },
  { icon: ShieldCheck, title: "Authority Matrix", desc: "Multi-level approval chains for purchase orders by value, hierarchy, and supplier tier." },
  { icon: BarChart3, title: "AI Intelligence", desc: "Demand forecasting, price benchmarking, and smart reorder alerts by season." },
];

const PRICING = [
  { name: "Starter", price: "0", period: "free forever", desc: "For small hotels exploring digital procurement", features: ["Browse verified catalog", "Basic search & filters", "Manual POs", "Email alerts", "Up to 3 users"], highlight: false },
  { name: "Professional", price: "4,500", period: "EGP / month", desc: "For growing hotels ready to automate", features: ["Everything in Starter", "AI price comparison", "Auto PO generation", "Authority Matrix", "ETA e-invoicing", "Up to 15 users", "Priority support"], highlight: true },
  { name: "Enterprise", price: "Custom", period: "tailored pricing", desc: "For hotel groups with 5+ properties", features: ["Everything in Pro", "Multi-property dashboard", "Opera / SAP integrations", "Dedicated AM", "White-label options", "Unlimited users", "SLA guarantee"], highlight: false },
];

const HOTELS = [
  "Marriott Mena House", "Four Seasons", "Hilton Alexandria",
  "Mövenpick El Gouna", "Steigenberger", "Kempinski Nile",
  "Jaz Aquamarine", "Rixos Sharm",
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowOffer(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {showOffer && !open && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 frame bg-[#0a0a0a] p-3 max-w-[200px] relative"
        >
          <button onClick={() => setShowOffer(false)} className="absolute top-2 right-2 text-white/20 hover:text-white/60">
            <XIcon className="w-3 h-3" />
          </button>
          <p className="text-[11px] font-medium text-white/70 pr-4">Need help getting started?</p>
          <Link href="/register" className="inline-block mt-2 px-3 py-1.5 text-[10px] font-semibold bg-white text-black hover:bg-white/90 transition-colors">
            Register Now
          </Link>
        </motion.div>
      )}
      <button
        onClick={() => { setOpen(!open); setShowOffer(false); }}
        className="w-10 h-10 frame-strong bg-[#800000] flex items-center justify-center hover:bg-[#660000] transition-colors"
      >
        <MessageCircle className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartCount] = useState(3);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#800000] border-b border-white/[0.08]">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex h-[52px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo-horse.png" alt="" width={26} height={30} className="object-contain" priority />
            <span className="text-[13px] font-semibold text-white tracking-wide">HOTELS VENDORS</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {["Product", "Solutions", "Pricing", "About"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-medium text-white/55 hover:text-white transition-colors tracking-wide uppercase">
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/settings" className="text-[11px] font-medium text-white/40 hover:text-white transition-colors">Settings</Link>
            <Link href="/login" className="text-[11px] font-medium text-white/40 hover:text-white transition-colors">Sign In</Link>
            <Link href="/catalog" className="relative text-white/40 hover:text-white transition-colors">
              <ShoppingCart className="w-[15px] h-[15px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white text-black text-[7px] font-bold flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
            <Link href="/register" className="px-3 py-1.5 text-[11px] font-semibold bg-white text-black hover:bg-white/90 transition-colors">
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-1.5 text-white" onClick={() => setOpen(!open)}>
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#800000] border-t border-white/[0.08] px-5 py-3 space-y-2">
          {["Product", "Solutions", "Pricing", "About"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block text-[11px] text-white/60 hover:text-white uppercase tracking-wide">{item}</a>
          ))}
          <div className="pt-2 flex gap-2">
            <Link href="/settings" className="flex-1 text-center py-2 text-[11px] border border-white/20 text-white">Settings</Link>
            <Link href="/login" className="flex-1 text-center py-2 text-[11px] border border-white/20 text-white">Sign In</Link>
            <Link href="/register" className="flex-1 text-center py-2 text-[11px] bg-white text-black font-semibold">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="bg-black pt-[52px]">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="frame p-5 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
            {/* Left content */}
            <div className="lg:col-span-3">
              <span className="text-[10px] font-semibold text-white/25 tracking-[0.2em] uppercase">Digital Procurement Hub</span>
              <h1 className="mt-2 text-[22px] sm:text-[26px] font-semibold text-white leading-[1.2] tracking-tight">
                One platform for Egyptian hospitality procurement
              </h1>
              <p className="mt-2.5 text-xs text-white/35 leading-relaxed max-w-md">
                Connect hotels, suppliers, logistics, and factoring on a single compliant platform. From catalog discovery to ETA e-invoice submission.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link href="/register" className="px-4 py-2 text-[11px] font-semibold bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-1.5">
                  Start Free <ArrowRight className="w-3 h-3" />
                </Link>
                <Link href="/catalog" className="px-4 py-2 text-[11px] font-semibold border border-white/12 text-white hover:bg-white/[0.03] transition-colors flex items-center gap-1.5">
                  Explore Catalog <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Compact stats */}
              <div className="mt-5 grid grid-cols-4 gap-2 max-w-sm">
                {[
                  { value: "10K+", label: "SKUs" },
                  { value: "1,200+", label: "Suppliers" },
                  { value: "2.4B", label: "EGP GMV" },
                  { value: "48h", label: "Delivery" },
                ].map((stat) => (
                  <div key={stat.label} className="frame surface-fill p-2 text-center">
                    <p className="text-sm font-semibold text-white">{stat.value}</p>
                    <p className="text-[9px] text-white/25 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: category grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-2">
                {CATEGORY_IMAGES.map((cat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    className="relative aspect-[4/3] overflow-hidden frame group cursor-pointer"
                  >
                    <Image src={cat.src} alt={cat.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="200px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5">
                      <p className="text-[11px] font-semibold text-white">{cat.label}</p>
                      <p className="text-[9px] text-white/40">{cat.count}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="bg-black">
      <div className="mx-auto max-w-6xl px-5 pb-8">
        <div className="frame p-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <span className="text-[9px] font-medium text-white/20 uppercase tracking-wider">Trusted by</span>
          {HOTELS.map((h) => (
            <span key={h} className="text-[10px] font-medium text-white/20 hover:text-white/45 transition-colors">{h}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="product" className="bg-black py-6">
      <div className="mx-auto max-w-6xl px-5">
        <div className="frame p-5 lg:p-6">
          <div className="mb-5">
            <span className="text-[10px] font-semibold text-white/25 tracking-[0.2em] uppercase">Platform</span>
            <h2 className="mt-1 text-base font-semibold text-white">Capabilities</h2>
            <p className="mt-1 text-[11px] text-white/30 max-w-md">From catalog discovery to ETA-compliant invoicing — one platform, zero fragmentation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="frame surface-fill p-4 frame-hover transition-all duration-200 group"
              >
                <div className="w-8 h-8 frame flex items-center justify-center mb-3 group-hover:border-white/15 transition-colors">
                  <f.icon className="w-4 h-4 text-white/35 group-hover:text-white/55 transition-colors" />
                </div>
                <h3 className="text-[12px] font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-[11px] text-white/30 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", icon: Search, title: "Discover", desc: "Browse verified suppliers across 6 categories. Filter by price, MOQ, and delivery zone." },
    { num: "02", icon: FileCheck, title: "Order", desc: "Build purchase orders with AI-suggested bundles. Route through your Authority Matrix." },
    { num: "03", icon: Truck, title: "Fulfill", desc: "Track shared-logistics delivery in real time. Invoice auto-submits to ETA." },
  ];

  return (
    <section id="solutions" className="bg-black py-6">
      <div className="mx-auto max-w-6xl px-5">
        <div className="frame p-5 lg:p-6">
          <div className="mb-5">
            <span className="text-[10px] font-semibold text-white/25 tracking-[0.2em] uppercase">Process</span>
            <h2 className="mt-1 text-base font-semibold text-white">How It Works</h2>
            <p className="mt-1 text-[11px] text-white/30">From catalog to compliance in three steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`frame surface-fill p-4 relative ${i < 2 ? 'md:step-line' : ''}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] font-mono text-white/15">{s.num}</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                <div className="w-7 h-7 frame flex items-center justify-center mb-2.5">
                  <s.icon className="w-3.5 h-3.5 text-white/40" />
                </div>
                <h4 className="text-[12px] font-semibold text-white">{s.title}</h4>
                <p className="mt-1 text-[11px] text-white/30 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-black py-6">
      <div className="mx-auto max-w-6xl px-5">
        <div className="frame p-5 lg:p-6">
          <div className="mb-5">
            <span className="text-[10px] font-semibold text-white/25 tracking-[0.2em] uppercase">Pricing</span>
            <h2 className="mt-1 text-base font-semibold text-white">Simple, transparent plans</h2>
            <p className="mt-1 text-[11px] text-white/30">No hidden fees. Scale as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {PRICING.map((tier) => (
              <div
                key={tier.name}
                className={`frame p-4 transition-all duration-200 ${tier.highlight ? 'frame-accent bg-[#800000]/[0.03]' : 'surface-fill frame-hover'}`}
              >
                {tier.highlight && (
                  <span className="inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-white text-black mb-3">Most Popular</span>
                )}
                <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">{tier.price}</span>
                  <span className="text-[10px] text-white/30">{tier.period}</span>
                </div>
                <p className="mt-1.5 text-[11px] text-white/30 leading-relaxed">{tier.desc}</p>
                <ul className="mt-3 space-y-1.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[11px] text-white/35">
                      <CheckCircle2 className="w-3 h-3 text-white/30 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`mt-4 block w-full text-center py-2 text-[11px] font-semibold transition-colors ${
                    tier.highlight
                      ? "bg-white text-black hover:bg-white/90"
                      : "border border-white/10 text-white hover:bg-white/[0.03]"
                  }`}
                >
                  {tier.highlight ? "Start 14-Day Trial" : tier.name === "Enterprise" ? "Contact Sales" : "Get Started Free"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricsBanner() {
  const metrics = [
    { icon: Building2, value: "200+", label: "Hotels Onboarded" },
    { icon: MapPin, value: "6", label: "Coastal Clusters" },
    { icon: Clock, value: "48h", label: "Avg. Delivery" },
    { icon: TrendingUp, value: "40%", label: "Cost Reduction" },
  ];

  return (
    <section className="bg-black py-6">
      <div className="mx-auto max-w-6xl px-5">
        <div className="frame p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {metrics.map((m, i) => (
              <div key={i} className="flex items-center gap-3 frame surface-fill p-3">
                <div className="w-7 h-7 frame flex items-center justify-center shrink-0">
                  <m.icon className="w-3.5 h-3.5 text-white/30" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{m.value}</p>
                  <p className="text-[9px] text-white/25 uppercase tracking-wider">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-black py-6">
      <div className="mx-auto max-w-6xl px-5">
        <div className="frame p-6 lg:p-8 text-center">
          <h2 className="text-lg font-semibold text-white">Ready to transform your procurement?</h2>
          <p className="mt-2 text-[11px] text-white/35 max-w-sm mx-auto">Join 200+ Egyptian hotels and 1,200+ suppliers. Setup takes less than 10 minutes.</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Link href="/register" className="px-5 py-2 text-[11px] font-semibold bg-white text-black hover:bg-white/90 transition-colors">
              Get Started Free
            </Link>
            <Link href="/catalog" className="px-5 py-2 text-[11px] font-semibold border border-white/12 text-white hover:bg-white/[0.03] transition-colors">
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Image src="/logo-horse.png" alt="" width={18} height={22} className="object-contain" />
              <span className="text-[12px] font-semibold text-white tracking-wide">HOTELS VENDORS</span>
            </div>
            <p className="text-[10px] text-white/25 leading-relaxed max-w-[200px]">The Digital Procurement Hub for Egyptian Hospitality.</p>
          </div>
          <div>
            <h4 className="text-[9px] font-semibold text-white uppercase tracking-wider mb-2">Product</h4>
            <ul className="space-y-1">
              {["Catalog", "Orders", "ETA E-Invoicing", "Authority Matrix", "Pricing"].map((l) => (
                <li key={l}><a href="#" className="text-[10px] text-white/25 hover:text-white/60 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[9px] font-semibold text-white uppercase tracking-wider mb-2">Company</h4>
            <ul className="space-y-1">
              {["About", "Careers", "Blog", "Contact"].map((l) => (
                <li key={l}><a href="#" className="text-[10px] text-white/25 hover:text-white/60 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[9px] font-semibold text-white uppercase tracking-wider mb-2">Legal</h4>
            <ul className="space-y-1">
              {["Privacy", "Terms", "Security", "Compliance"].map((l) => (
                <li key={l}><a href="#" className="text-[10px] text-white/25 hover:text-white/60 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[9px] text-white/15">© 2026 Hotels Vendors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <MetricsBanner />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
