"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Menu, X, Package,
  Truck, CreditCard, Landmark, ShieldCheck, BarChart3,
  Search,
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

const HOTELS = [
  "Marriott Mena House", "Four Seasons Cairo", "Hilton Alexandria",
  "Mövenpick El Gouna", "Steigenberger Tahrir", "Kempinski Nile",
  "Jaz Aquamarine", "Rixos Sharm",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };



function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#800000]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="hidden lg:flex items-center gap-8">
            {["Product", "Solutions", "Pricing", "Enterprise"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-white/80 hover:text-white transition-colors">{item}</a>
            ))}
            <Link href="/about" className="text-sm font-medium text-white/80 hover:text-white transition-colors">About</Link>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/settings" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Settings</Link>
            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="px-5 py-2 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors">Get Started</Link>
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
    <section className="relative min-h-screen bg-black flex items-center justify-center pt-16">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          {/* Logo in center of hero */}
          <motion.div variants={fadeUp} className="mb-8 flex justify-center">
            <Image src="/logo-horse-only.png" alt="Hotels Vendors" width={160} height={62} className="object-contain" priority />
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            HOTELS VENDORS
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 text-xl text-white/60 font-medium tracking-widest uppercase">
            Smarter Together
          </motion.p>
          <motion.p variants={fadeUp} className="mt-8 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            The Procurement OS for Egyptian Hospitality. Connect hotels, suppliers, logistics, and factoring on one platform. Fixed pricing. ETA-compliant e-invoicing. AI-powered procurement intelligence.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="group px-8 py-4 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-2">
              Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/catalog" className="px-8 py-4 text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors">
              Explore Catalog
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: "10,000+", label: "Verified SKUs" },
              { value: "1,200+", label: "Suppliers" },
              { value: "EGP 2.4B", label: "GMV Processed" },
              { value: "48h", label: "Avg. Delivery" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-black py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-6">
          Trusted by leading Egyptian hotels
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {HOTELS.map((h) => (
            <span key={h} className="text-sm font-medium text-white/30 hover:text-white/60 transition-colors">{h}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="product" className="py-24 bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white">
            Platform Capabilities
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/40 max-w-2xl mx-auto">
            From catalog discovery to ETA-compliant invoicing — one platform, zero fragmentation.
          </motion.p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-colors"
            >
              <f.icon className="w-6 h-6 text-white/60 mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
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
    <section id="solutions" className="py-24 bg-[#080808] border-y border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">How It Works</h2>
          <p className="mt-4 text-white/40">From catalog to compliance in minutes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-white/10" />
          {steps.map((s, i) => (
            <motion.div key={s.num} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-mono text-white/30">{s.num}</span>
              <h4 className="mt-2 text-lg font-semibold text-white">{s.title}</h4>
              <p className="mt-2 text-sm text-white/40 max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Pricing</h2>
          <p className="mt-4 text-white/40">Simple, transparent pricing</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING.map((tier) => (
            <div key={tier.name} className={`relative rounded-lg p-6 border transition-colors ${tier.highlight ? "border-white/30 bg-white/[0.03]" : "border-white/[0.08] hover:border-white/20"}`}>
              {tier.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-wider">Most Popular</span>}
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">{tier.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-sm text-white/40">{tier.period}</span>
              </div>
              <p className="mt-2 text-sm text-white/40">{tier.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/50">
                    <CheckCircle2 className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`mt-6 block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${tier.highlight ? "bg-white text-black hover:bg-white/90" : "border border-white/20 text-white hover:bg-white/10"}`}>
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
    <section className="py-24 bg-[#800000]">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Transform Your Procurement</h2>
        <p className="mt-4 text-white/70 max-w-xl mx-auto">Join 200+ Egyptian hotels and 1,200+ suppliers already on the platform. Setup takes less than 10 minutes.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register" className="px-8 py-3.5 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors">Get Started Free</Link>
          <Link href="/catalog" className="px-8 py-3.5 text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors">Browse Catalog</Link>
        </div>
        <p className="mt-4 text-xs text-white/40">Free 14-day trial — No credit card required</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-sm font-bold text-white">Hotels Vendors</span>
            <p className="mt-4 text-xs text-white/30 leading-relaxed">The Digital Procurement Hub for Egyptian Hospitality. Hotels, suppliers, logistics, and factoring — unified.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              {["Catalog", "Orders", "ETA E-Invoicing", "Authority Matrix", "Pricing"].map((l) => (
                <li key={l}><a href="#" className="text-xs text-white/30 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              {["About", "Careers", "Blog", "Contact", "Partners"].map((l) => (
                <li key={l}><a href="#" className="text-xs text-white/30 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              {["Privacy", "Terms", "Security", "Compliance"].map((l) => (
                <li key={l}><a href="#" className="text-xs text-white/30 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/20">© 2026 Hotels Vendors. All rights reserved.</p>
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
