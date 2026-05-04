"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Menu, X, Package, ShoppingCart,
  Truck, CreditCard, Landmark, ShieldCheck, BarChart3, Search,
} from "lucide-react";

const FEATURES = [
  { icon: Package, title: "Unified Catalog", desc: "10,000+ SKUs across F&B, housekeeping, linens, and engineering from verified Egyptian suppliers." },
  { icon: Truck, title: "Shared Logistics", desc: "Coastal-cluster fulfillment with real-time tracking. Cut delivery costs by 40%." },
  { icon: CreditCard, title: "Embedded Factoring", desc: "Non-recourse invoice financing. Suppliers get paid in 48 hours, not 90 days." },
  { icon: Landmark, title: "ETA E-Invoicing", desc: "Real-time submission to the Egyptian Tax Authority. Digitally signed, fully compliant." },
  { icon: ShieldCheck, title: "Authority Matrix", desc: "Multi-level approval chains for purchase orders by value, hierarchy, and tier." },
  { icon: BarChart3, title: "AI Intelligence", desc: "Demand forecasting, price benchmarking, and smart reorder alerts by season." },
];

const PRICING = [
  { name: "Starter", price: "0", period: "forever free", desc: "For small hotels exploring digital procurement", features: ["Browse verified catalog", "Basic search & filters", "Manual POs", "Email alerts", "Up to 3 users"], highlight: false },
  { name: "Professional", price: "4,500", period: "EGP / month", desc: "For growing hotels ready to automate", features: ["Everything in Starter", "AI price comparison", "Auto PO generation", "Authority Matrix", "ETA e-invoicing", "Up to 15 users", "Priority support"], highlight: true },
  { name: "Enterprise", price: "Custom", period: "tailored pricing", desc: "For hotel groups with 5+ properties", features: ["Everything in Pro", "Multi-property dashboard", "Opera / SAP integrations", "Dedicated AM", "White-label", "Unlimited users", "SLA guarantee"], highlight: false },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
];

const HOTELS = [
  "Marriott Mena House", "Four Seasons Cairo", "Hilton Alexandria",
  "Mövenpick El Gouna", "Steigenberger Tahrir", "Kempinski Nile",
  "Jaz Aquamarine", "Rixos Sharm",
];

const WHEEL_SEGMENTS = [
  { label: "1,000 LE", color: "#800000", text: "#ffffff" },
  { label: "2,000 LE", color: "#ffffff", text: "#000000" },
  { label: "3,000 LE", color: "#800000", text: "#ffffff" },
  { label: "Try Again", color: "#1a1a1a", text: "#ffffff" },
  { label: "4,000 LE", color: "#800000", text: "#ffffff" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setShowResult(false);
    const extraSpins = 5 + Math.random() * 3;
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    const randomOffset = Math.random() * segmentAngle;
    const newRotation = rotation + extraSpins * 360 + randomOffset;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const finalAngle = newRotation % 360;
      const index = Math.floor((360 - finalAngle + segmentAngle / 2) / segmentAngle) % WHEEL_SEGMENTS.length;
      setResult(WHEEL_SEGMENTS[index].label);
      setShowResult(true);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Spin to Win</p>
      <div className="relative">
        {/* Pointer */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white" />
        <div
          className="w-40 h-40 rounded-full border-2 border-white/20 relative overflow-hidden transition-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? "4s" : "0s",
            transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.3, 1)",
          }}
        >
          {WHEEL_SEGMENTS.map((seg, i) => {
            const angle = 360 / WHEEL_SEGMENTS.length;
            return (
              <div
                key={i}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((i * angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((i * angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos(((i + 1) * angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin(((i + 1) * angle - 90) * Math.PI / 180)}%)`,
                  backgroundColor: seg.color,
                }}
              >
                <span
                  className="text-[10px] font-bold absolute"
                  style={{
                    color: seg.text,
                    transform: `rotate(${i * angle + angle / 2}deg) translateY(-28px)`,
                  }}
                >
                  {seg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="px-5 py-2 text-xs font-semibold bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50 rounded"
      >
        {spinning ? "Spinning..." : "Spin Now"}
      </button>
      {showResult && result && (
        <div className="text-center">
          <p className="text-sm font-bold text-white">
            {result === "Try Again" ? result : `You won ${result}!`}
          </p>
          {result !== "Try Again" && (
            <p className="text-[10px] text-white/50 mt-1">Valid on yearly subscriptions</p>
          )}
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartCount] = useState(3);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#800000]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/knight-icon.svg" alt="" width={28} height={28} className="brightness-0 invert" />
          </Link>

          {/* Center: Nav links */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {["Product", "Solutions", "Pricing", "Enterprise"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-white/80 hover:text-white transition-colors">{item}</a>
            ))}
            <Link href="/about" className="text-sm font-medium text-white/80 hover:text-white transition-colors">About</Link>
          </div>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <Link href="/settings" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Settings</Link>
            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Sign In</Link>
            <Link href="/catalog" className="relative text-white/80 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors rounded">Get Started</Link>
          </div>

          <button className="lg:hidden p-2 text-white" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-[#800000] border-t border-white/20 px-6 py-4 space-y-3">
          {["Product", "Solutions", "Pricing", "Enterprise"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm text-white/80 hover:text-white">{item}</a>
          ))}
          <Link href="/about" className="block text-sm text-white/80 hover:text-white">About</Link>
          <div className="pt-2 flex gap-2">
            <Link href="/settings" className="flex-1 text-center py-2 text-sm border border-white/30 text-white">Settings</Link>
            <Link href="/login" className="flex-1 text-center py-2 text-sm border border-white/30 text-white">Sign In</Link>
            <Link href="/register" className="flex-1 text-center py-2 text-sm bg-white text-black font-semibold">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen bg-black pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Left: Content */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center lg:text-left">
            <motion.div variants={fadeUp} className="mb-6 flex justify-center lg:justify-start">
              <Image src="/knight-icon.svg" alt="Hotels Vendors" width={80} height={80} className="brightness-0 invert" />
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
              HOTELS VENDORS
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-2 text-sm text-white/50 font-medium tracking-[0.3em] uppercase">
              Smarter Together
            </motion.p>
            <motion.p variants={fadeUp} className="mt-6 text-base text-white/40 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              The Procurement OS for Egyptian Hospitality. Connect hotels, suppliers, logistics, and factoring on one platform. Fixed pricing. ETA-compliant e-invoicing. AI-powered procurement intelligence.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link href="/register" className="group px-6 py-3 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-2 rounded">
                Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/catalog" className="px-6 py-3 text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors rounded">
                Explore Catalog
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-lg mx-auto lg:mx-0">
              {[
                { value: "10,000+", label: "Verified SKUs" },
                { value: "1,200+", label: "Suppliers" },
                { value: "EGP 2.4B", label: "GMV Processed" },
                { value: "48h", label: "Avg. Delivery" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Images + Promo */}
          <div className="flex flex-col items-center gap-8">
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {HERO_IMAGES.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10"
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="200px" />
                </motion.div>
              ))}
            </div>
            <SpinWheel />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-black py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-5">
          Trusted by leading Egyptian hotels
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {HOTELS.map((h) => (
            <span key={h} className="text-xs font-medium text-white/25 hover:text-white/50 transition-colors">{h}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="product" className="py-20 bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-12">
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-bold text-white">Platform Capabilities</motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-white/35 max-w-xl mx-auto text-sm">
            From catalog discovery to ETA-compliant invoicing — one platform, zero fragmentation.
          </motion.p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors"
            >
              <f.icon className="w-5 h-5 text-white/50 mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-xs text-white/35 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", icon: Search, title: "Discover", desc: "Browse verified suppliers across 6 hospitality categories. Filter by price, MOQ, delivery zone, and certification." },
    { num: "02", icon: CheckCircle2, title: "Order", desc: "Build purchase orders with AI-suggested bundles. Route through your Authority Matrix for approval." },
    { num: "03", icon: Truck, title: "Fulfill", desc: "Track shared-logistics delivery in real time. Invoice auto-submits to ETA with digital signature." },
  ];
  return (
    <section id="solutions" className="py-20 bg-[#050505] border-y border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How It Works</h2>
          <p className="mt-3 text-white/35 text-sm">From catalog to compliance in minutes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-6 left-[20%] right-[20%] h-px bg-white/8" />
          {steps.map((s, i) => (
            <motion.div key={s.num} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="relative text-center">
              <div className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-4 h-4 text-white/60" />
              </div>
              <span className="text-[10px] font-mono text-white/25">{s.num}</span>
              <h4 className="mt-1 text-base font-semibold text-white">{s.title}</h4>
              <p className="mt-1 text-xs text-white/35 max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Pricing</h2>
          <p className="mt-3 text-white/35 text-sm">Simple, transparent pricing</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {PRICING.map((tier) => (
            <div key={tier.name} className={`relative rounded-lg p-5 border transition-colors ${tier.highlight ? "border-white/25 bg-white/[0.02]" : "border-white/[0.06] hover:border-white/12"}`}>
              {tier.highlight && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white text-black text-[9px] font-bold uppercase tracking-wider">Most Popular</span>}
              <h3 className="text-xs font-semibold text-white/35 uppercase tracking-wider">{tier.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
                <span className="text-xs text-white/35">{tier.period}</span>
              </div>
              <p className="mt-1 text-xs text-white/35">{tier.desc}</p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/50 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`mt-5 block w-full text-center py-2 rounded-lg text-xs font-semibold transition-colors ${tier.highlight ? "bg-white text-black hover:bg-white/90" : "border border-white/15 text-white hover:bg-white/8"}`}>
                {tier.highlight ? "Start 14-Day Trial" : tier.name === "Enterprise" ? "Contact Sales" : "Get Started Free"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 bg-[#800000]">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to Transform Your Procurement</h2>
        <p className="mt-3 text-white/65 text-sm max-w-lg mx-auto">Join 200+ Egyptian hotels and 1,200+ suppliers already on the platform. Setup takes less than 10 minutes.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className="px-6 py-3 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors rounded">Get Started Free</Link>
          <Link href="/catalog" className="px-6 py-3 text-sm font-semibold border border-white/25 text-white hover:bg-white/10 transition-colors rounded">Browse Catalog</Link>
        </div>
        <p className="mt-3 text-[10px] text-white/35">Free 14-day trial — No credit card required</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/knight-icon.svg" alt="" width={18} height={18} className="brightness-0 invert" />
              <span className="text-sm font-bold text-white">Hotels Vendors</span>
            </div>
            <p className="text-[11px] text-white/25 leading-relaxed">The Digital Procurement Hub for Egyptian Hospitality.</p>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-2">Product</h4>
            <ul className="space-y-1.5">
              {["Catalog", "Orders", "ETA E-Invoicing", "Authority Matrix", "Pricing"].map((l) => (
                <li key={l}><a href="#" className="text-[11px] text-white/25 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-2">Company</h4>
            <ul className="space-y-1.5">
              {["About", "Careers", "Blog", "Contact", "Partners"].map((l) => (
                <li key={l}><a href="#" className="text-[11px] text-white/25 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-2">Legal</h4>
            <ul className="space-y-1.5">
              {["Privacy", "Terms", "Security", "Compliance"].map((l) => (
                <li key={l}><a href="#" className="text-[11px] text-white/25 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-white/15">© 2026 Hotels Vendors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
