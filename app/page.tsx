"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Menu, X, Package, ShoppingCart,
  Truck, CreditCard, Landmark, ShieldCheck, BarChart3, Search,
  MessageCircle, XIcon,
} from "lucide-react";

const CATEGORY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500&h=280&fit=crop", label: "Linens", count: "2,400+ SKUs" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=280&fit=crop", label: "F&B", count: "4,100+ SKUs" },
  { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=280&fit=crop", label: "Cleaning", count: "1,800+ SKUs" },
  { src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=280&fit=crop", label: "Engineering", count: "1,700+ SKUs" },
];

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

const WHEEL_SEGMENTS = [
  "1,000 LE",
  "2,000 LE",
  "3,000 LE",
  "Try Again",
  "4,000 LE",
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowOffer(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showOffer && !open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 bg-white text-black p-4 rounded shadow-xl max-w-[240px] text-sm relative"
        >
          <button onClick={() => setShowOffer(false)} className="absolute top-2 right-2 text-black/30 hover:text-black">
            <XIcon className="w-3 h-3" />
          </button>
          <p className="font-semibold mb-1 text-xs">Need help getting started?</p>
          <p className="text-[11px] text-black/50 mb-3">I can guide you through registration.</p>
          <Link href="/register" className="inline-block px-4 py-2 text-[11px] font-semibold bg-[#800000] text-white rounded hover:bg-[#660000]">
            Register Now
          </Link>
        </motion.div>
      )}
      <button
        onClick={() => { setOpen(!open); setShowOffer(false); }}
        className="w-12 h-12 rounded-full bg-[#800000] border border-white/20 flex items-center justify-center shadow-xl hover:bg-[#660000] transition-colors"
      >
        <MessageCircle className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}

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
      setResult(WHEEL_SEGMENTS[index]);
      setShowResult(true);
    }, 4000);
  };

  const segAngle = 360 / WHEEL_SEGMENTS.length;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-white" />
        <div
          className="w-36 h-36 rounded-full border-2 border-white/20 relative overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? "4s" : "0s",
            transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.3, 1)",
          }}
        >
          {WHEEL_SEGMENTS.map((seg, i) => {
            const startAngle = i * segAngle;
            const endAngle = (i + 1) * segAngle;
            const midAngle = startAngle + segAngle / 2;
            const x1 = 50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
            const isRed = seg !== "Try Again";
            return (
              <div
                key={i}
                className="absolute w-full h-full"
                style={{
                  clipPath: `polygon(50% 50%, ${x1}% ${y1}%, ${x2}% ${y2}%)`,
                  backgroundColor: isRed ? "#800000" : "#1a1a1a",
                }}
              >
                <span
                  className="text-[9px] font-bold absolute left-1/2 top-1/2"
                  style={{
                    color: "#ffffff",
                    transform: `rotate(${midAngle}deg) translateX(-50%) translateY(-42px)`,
                    transformOrigin: "center",
                  }}
                >
                  {seg}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="px-5 py-2 text-[11px] font-semibold bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50 rounded"
      >
        {spinning ? "Spinning..." : "Spin Now"}
      </button>
      <p className="text-[10px] text-white/40 uppercase tracking-wider">Spin to claim your discount now</p>
      {showResult && result && (
        <p className="text-xs font-bold text-white">
          {result === "Try Again" ? result : `You won ${result}!`}
        </p>
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
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/hotelsvendors.png" alt="Hotels Vendors" width={130} height={70} className="object-contain" priority />
          </Link>
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {["Product", "Solutions", "Pricing", "Enterprise"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] font-medium text-white/75 hover:text-white transition-colors tracking-wide">{item}</a>
            ))}
            <Link href="/about" className="text-[13px] font-medium text-white/75 hover:text-white transition-colors tracking-wide">About</Link>
          </div>
          <div className="hidden lg:flex items-center gap-5">
            <Link href="/settings" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors">Settings</Link>
            <Link href="/login" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors">Sign In</Link>
            <Link href="/catalog" className="relative text-white/60 hover:text-white transition-colors">
              <ShoppingCart className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white text-black text-[8px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
            <Link href="/register" className="px-4 py-1.5 text-[12px] font-semibold bg-white text-black hover:bg-white/90 transition-colors rounded-sm">Get Started</Link>
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
    <section className="bg-black pt-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          {/* Left: Content */}
          <div className="lg:col-span-3">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center lg:text-left">
              <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-space), system-ui, sans-serif", letterSpacing: "0.04em" }}>
                HOTELS VENDORS
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-2 text-xs text-white/40 font-medium tracking-[0.4em] uppercase">
                Smarter Together
              </motion.p>
              <motion.p variants={fadeUp} className="mt-6 text-sm text-white/40 max-w-md mx-auto lg:mx-0 leading-relaxed">
                The Procurement OS for Egyptian Hospitality. One platform for hotels, suppliers, logistics, and factoring.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link href="/register" className="px-6 py-2.5 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-2">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/catalog" className="px-6 py-2.5 text-sm font-semibold border border-white/20 text-white hover:bg-white/5 transition-colors">
                  Explore Catalog
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-10 grid grid-cols-4 gap-3 max-w-md mx-auto lg:mx-0">
                {[
                  { value: "10,000+", label: "SKUs" },
                  { value: "1,200+", label: "Suppliers" },
                  { value: "2.4B", label: "EGP GMV" },
                  { value: "48h", label: "Delivery" },
                ].map((stat) => (
                  <div key={stat.label} className="border border-white/10 rounded p-3 text-center">
                    <p className="text-base font-bold text-white">{stat.value}</p>
                    <p className="text-[9px] text-white/30 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Single column images + wheel */}
          <div className="lg:col-span-2 flex flex-col items-center gap-4">
            <div className="flex flex-col gap-3 w-full max-w-xs">
              {CATEGORY_IMAGES.map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="relative aspect-[16/9] rounded overflow-hidden border border-white/10 group"
                >
                  <Image src={cat.src} alt={cat.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="350px" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-sm font-bold text-white">{cat.label}</p>
                    <p className="text-[10px] text-white/50">{cat.count}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="w-full max-w-xs border border-white/10 rounded p-4 flex flex-col items-center gap-2 bg-white/[0.01]">
              <SpinWheel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {HOTELS.map((h) => (
            <span key={h} className="text-[11px] font-medium text-white/20 hover:text-white/50 transition-colors tracking-wide">{h}</span>
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
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-14">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-white">Platform Capabilities</motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-white/35 max-w-lg mx-auto text-sm">From catalog discovery to ETA-compliant invoicing — one platform, zero fragmentation.</motion.p>
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
              className="p-6 rounded border border-white/[0.06] hover:border-white/15 transition-colors"
            >
              <f.icon className="w-5 h-5 text-white/40 mb-4" />
              <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
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
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold text-white">How It Works</h2>
          <p className="mt-3 text-white/35 text-sm">From catalog to compliance in minutes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <motion.div key={s.num} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="border border-white/[0.06] rounded p-6 text-center hover:border-white/15 transition-colors">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-4 h-4 text-white/50" />
              </div>
              <span className="text-[10px] font-mono text-white/20">{s.num}</span>
              <h4 className="mt-2 text-base font-semibold text-white">{s.title}</h4>
              <p className="mt-2 text-xs text-white/35 leading-relaxed">{s.desc}</p>
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
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold text-white">Pricing</h2>
          <p className="mt-3 text-white/35 text-sm">Simple, transparent pricing</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {PRICING.map((tier) => (
            <div key={tier.name} className={`relative rounded border p-6 transition-colors ${tier.highlight ? "border-white/25 bg-white/[0.02]" : "border-white/[0.06] hover:border-white/12"}`}>
              {tier.highlight && <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white text-black text-[9px] font-bold uppercase tracking-wider">Most Popular</span>}
              <h3 className="text-xs font-semibold text-white/35 uppercase tracking-wider">{tier.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
                <span className="text-xs text-white/35">{tier.period}</span>
              </div>
              <p className="mt-2 text-xs text-white/35">{tier.desc}</p>
              <ul className="mt-5 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/50 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`mt-6 block w-full text-center py-2.5 rounded text-xs font-semibold transition-colors ${tier.highlight ? "bg-white text-black hover:bg-white/90" : "border border-white/15 text-white hover:bg-white/8"}`}>
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
        <h2 className="text-2xl font-bold text-white">Ready to Transform Your Procurement</h2>
        <p className="mt-4 text-white/60 text-sm max-w-md mx-auto">Join 200+ Egyptian hotels and 1,200+ suppliers. Setup takes less than 10 minutes.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className="px-7 py-3 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors">Get Started Free</Link>
          <Link href="/catalog" className="px-7 py-3 text-sm font-semibold border border-white/25 text-white hover:bg-white/10 transition-colors">Browse Catalog</Link>
        </div>
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
            <div className="mb-3">
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
      <ChatbotWidget />
    </main>
  );
}
