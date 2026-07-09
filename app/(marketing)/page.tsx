"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Building2,
  Warehouse,
  CreditCard,
  Globe,
  Zap,
  Smartphone,
  MessageSquare,
  Mail,
  User,
  Building,
  Factory,
  Truck,
  Boxes,
  CircuitBoard,
  Wallet,
  LineChart,
  Shield,
  BrainCircuit,
  Receipt,
  Banknote,
  BarChart3,
  Cpu,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoFull } from "@/components/logo";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

// 3D Background Component
function ThreeDBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-green-950/20 to-slate-950" />
    </div>
  );
}

// Floating Particles
function FloatingParticle({ delay = 0, size = 2 }: { delay?: number; size?: number }) {
  return (
    <motion.div
      className="absolute w-px h-px bg-green-400/20 rounded-full"
      style={{ width: size, height: size }}
      animate={{ 
        y: [-20, -100, -20],
        opacity: [0, 1, 0]
      }}
      transition={{ 
        duration: 3 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
      initial={{ y: -20, x: Math.random() * window.innerWidth }}
    />
  );
}

// AI Particle System
function AINeuralNetwork() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px bg-gradient-to-b from-green-400/0 via-green-400/30 to-green-400/0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            height: `${20 + Math.random() * 60}px`
          }}
          animate={{ 
            y: ['0%', '100%', '0%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 4 + Math.random() * 6,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

// Holographic Card
function HolographicCard({ children, className = "", glowColor = "green" }: { 
  children: React.ReactNode; 
  className?: string; 
  glowColor?: "green" | "blue" | "purple"; 
}) {
  const colors = {
    green: "from-green-500/20 to-emerald-500/20 border-green-500/30 shadow-green-500/10",
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 shadow-blue-500/10",
    purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30 shadow-purple-500/10",
  };
  
  return (
    <motion.div
      className={`
        relative rounded-2xl p-6 backdrop-blur-xl
        bg-gradient-to-br ${colors[glowColor]} 
        border transition-all duration-300
        ${className}
      `}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: `0 20px 40px -10px rgba(132,204,22,${glowColor === "green" ? 0.3 : 0.2})`
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}

// Tech Badge
function TechBadge({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md border border-green-500/20 bg-green-500/10 text-green-400 text-xs font-medium"
      whileHover={{ scale: 1.05, backgroundColor: "rgba(132,204,22,0.15)" }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </motion.div>
  );
}

// Stat Counter
function StatCounter({ value, suffix, label, icon: Icon }: {
  value: number;
  suffix?: string;
  label: string;
  icon?: any;
}) {
  const [count, setCount] = useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const start = 0;
    const end = value;
    const duration = 2000;
    const step = (end - start) / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
      current += step;
      setCount(Math.floor(current));
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        {Icon && <Icon size={16} className="text-green-400" />}
        <span className="text-2xl font-bold text-white">
          {count}{suffix}
        </span>
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function PremiumLandingPage() {
  const [activeSector, setActiveSector] = useState<string>("procurement");
  const [formData, setFormData] = useState({
    company: "",
    email: "",
    name: "",
    sector: "hotel"
  });

  const sectors = [
    { key: "hotel", label: "HOTEL", icon: Building2, color: "#84cc16" },
    { key: "supplier", label: "SUPPLIER", icon: Warehouse, color: "#22c55e" },
    { key: "funder", label: "FUNDER", icon: CreditCard, color: "#3b82f6" },
    { key: "logistics", label: "LOGISTICS", icon: Truck, color: "#d97706" },
  ];

  const currentSector = sectors.find(s => s.key === activeSector) || sectors[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.email) return;
    
    // TODO: Integrate with /api/v1/leads/capture
    console.log('Submitting:', formData);
    
    // Success animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFormData({ company: "", email: "", name: "", sector: "hotel" });
  };

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* 3D Background Effects */}
      <ThreeDBackground />
      <AINeuralNetwork />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.3} size={Math.random() * 3 + 1} />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-6 py-4 backdrop-blur-md bg-black/20 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <LogoFull className="h-8" />
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <Link href="#platform" className="text-sm text-gray-300 hover:text-white transition-colors">Platform</Link>
          <Link href="#infrastructure" className="text-sm text-gray-300 hover:text-white transition-colors">Infrastructure</Link>
          <Link href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link>
          <Link href="/sandbox" className="text-sm text-gray-300 hover:text-white transition-colors">Sandbox</Link>
          <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">Sign In</Link>
          <Link 
            href="/register" 
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all"
          >
            Request Access
          </Link>
        </div>
      </nav>

      {/* Hero Section with 3D Animation */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Title & Value Proposition */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/10 backdrop-blur-md mb-6">
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-green-400">Live • Egypt AI Platform</span>
                <Sparkles size={14} className="text-green-400" />
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                <span className="text-white">Your Suppliers Get</span>
                <br />
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Paid in 24 Hours.
                </span>
                <br />
                <span className="text-gray-400">You Keep Net-60</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Hotel Vendors sits between your procurement desk, your supplier&apos;s balance sheet, and your funder&apos;s capital engine — automating the entire flow from AI demand forecasting to ETA-compliant settlement.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  "Live Platform",
                  "ETA Phase 1 & 2 Compliant", 
                  "24-Hour Settlement",
                  "99.99% Uptime SLA"
                ].map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
                  >
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span className="text-sm font-medium">{badge}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-green-500/25 transition-all transform hover:scale-105"
                >
                  Request Institutional Onboarding
                </Link>
                <Link
                  href="/sandbox"
                  className="px-8 py-4 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-all backdrop-blur-md"
                >
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Sparkles size={20} className="text-green-400" />
                    </motion.div>
                    Explore Sandbox
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Right: 3D Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              {/* Glowing Background Effects */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
              
              {/* Dashboard Card */}
              <HolographicCard className="relative z-10" glowColor="green">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-300">Live Dashboard</span>
                  </div>
                  <div className="flex gap-2">
                    {sectors.map((sector) => {
                      const Icon = sector.icon;
                      const isActive = activeSector === sector.key;
                      return (
                        <motion.button
                          key={sector.key}
                          onClick={() => setActiveSector(sector.key)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? "bg-green-500/30 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon size={16} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Sector Mockup */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <currentSector.icon size={20} className="text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">PO-2024-{Math.floor(Math.random() * 9000) + 1000}</div>
                        <div className="text-xs text-gray-400">AI Demand Forecasting</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-400">EGP 87,500</div>
                      <div className="text-xs text-gray-500">Net-60</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-white">Supply Chain Integration</div>
                      <motion.div
                        className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        LIVE
                      </motion.div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Fresh Fields Warehouse", value: "748kg" },
                        { label: "Fresh Chicken", value: "156kg" },
                        { label: "Tomatoes", value: "340kg" }
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-gray-300">{item.label}</span>
                          <span className="text-green-400 font-medium">{item.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">AI Accuracy Score</span>
                      <span className="text-lg font-bold text-green-400">94%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: 94 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </div>
              </HolographicCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCounter value={680} suffix="+" label="Verified Suppliers" icon={Warehouse} />
            <StatCounter value={94} suffix="%" label="Forecast Accuracy" icon={TrendingUp} />
            <StatCounter value={24} suffix="h" label="Settlement Speed" icon={Clock} />
            <StatCounter value={40} suffix="%" label="Logistics Savings" icon={Truck} />
          </div>
        </div>
      </section>

      {/* Sector Router Section */}
      <section id="platform" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">All-in-One</span>
              <br />
              <span className="text-green-400">Platform Architecture</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Four specialized engines, one unified operating system with cryptographic ETA compliance
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                title: "AI-Automated Procurement",
                icon: CircuitBoard,
                accent: "#84cc16",
                description: "Cashflow preservation, not administrative overhead. Predict demand 14 days ahead. Auto-generate POs against budget ceilings. Enforce pre-occurrence blockades. Stretch working capital to net-90+ without corporate debt."
              },
              {
                title: "Cashflow Optimization", 
                icon: Wallet,
                accent: "#22c55e",
                description: "Suppliers paid in 24 hours via competitive reverse factoring. You keep net-60+. No more 180-day collection chases across regional hotel clusters. On-site GRN validation unlocks non-recourse, bank-direct settlement."
              },
              {
                title: "Smartest B2B Fintech",
                icon: LineChart,
                accent: "#3b82f6", 
                description: "Pre-cleared, high-velocity corporate deal flow — not paper-shuffled SME invoices. Every asset passes tenant validation, ETA cryptographic UUID verification, and automated three-way matching. SHA-256 audit trail."
              },
              {
                title: "ISO 27001/ SOC 2 Ready",
                icon: Shield,
                accent: "#d97706",
                description: "Built for institutional-grade deployment. FRA Anti-Fraud Compliance via three-way matching gate: PO + ETA UUID + Signed Digital GRN. I-Score Assessment Readiness with clean, real-time risk parameters."
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <HolographicCard glowColor={card.accent as any}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.accent}15` }}>
                        <Icon size={24} style={{ color: card.accent }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{card.title}</h3>
                        <div className="text-xs uppercase tracking-wider" style={{ color: card.accent }}>Engineering Layer</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed mb-6">{card.description}</p>
                    <button className="text-sm font-medium hover:underline" style={{ color: card.accent }}>
                      Schedule Integration Audit →
                    </button>
                  </HolographicCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="signup" className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <HolographicCard className="p-8 lg:p-12" glowColor="green">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                <span className="text-white">Begin Your</span>
                <br />
                <span className="text-green-400">Digital Transformation</span>
              </h2>
              <p className="text-gray-300 text-lg">
                Join 680+ verified suppliers already on the platform
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company / Property Name *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Stella Di Mare Group"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Work Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-green-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sector</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-green-400 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="hotel">Hotel Group</option>
                    <option value="supplier">Supplier</option>
                    <option value="funder">Funder</option>
                    <option value="logistics">Logistics</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-green-500/25 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.company || !formData.email}
              >
                Request Institutional Onboarding
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-400">
                  We respect your privacy. No spam, ever.
                </p>
              </div>
            </form>
          </HolographicCard>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-24 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-white">Platform Capabilities</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Seven infrastructure pillars powering the future of Egyptian hospitality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BrainCircuit, title: "AI Demand Forecasting", desc: "14-day predictions from occupancy, events, consumption patterns. Auto-generate POs before spend. Zero manual bidding." },
              { icon: Receipt, title: "ETA E-Invoicing V2", desc: "Direct Ministry of Finance API integration. RSA-2048 digital signing. Cryptographic UUID validation at receipt." },
              { icon: Truck, title: "Multi-Modal Logistics", desc: "6 governorates, 40% cost reduction via AI route optimization. Cold-chain capable with GPS tracking." },
              { icon: Banknote, title: "Embedded Financing", desc: "Competitive bidding among 4+ licensed grantors. Non-recourse, bank-direct settlement. Suppliers paid in 24h." },
              { icon: ShieldCheck, title: "Three-Way Matching", desc: "PO + ETA UUID + Signed GRN gates. SHA-256 audit trail. FRA Anti-Fraud compliance." },
              { icon: BarChart3, title: "Spend Analytics", desc: "Real-time dashboards. Cross-property optimization. Predictive budget contrails. Anomaly detection." },
              { icon: Cpu, title: "Offline-First", desc: "Secure local caching during connectivity drops. Auto-queued ETA submission on recovery." },
              { icon: Globe, title: "Multi-Tenant", desc: "6 governorates, 128+ hotels, 680+ suppliers. Governance-ready, audit-compliant." },
              { icon: Lock, title: "Enterprise Security", desc: "ISO 27001/ SOC 2 Type II ready. AES-256 encryption. Zero-trust architecture." }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                >
                  <HolographicCard className="h-full p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <Icon size={20} className="text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{feature.desc}</p>
                  </HolographicCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <HolographicCard className="p-12" glowColor="green">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Transform Your
                <br />
                <span className="text-green-400">Procurement Workflow</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the platform powering Egypt's next generation of hospitality companies. Zero implementation risk. Maximum ROI.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-2xl hover:shadow-green-500/25 transition-all transform hover:scale-105">
                  Start Your Onboarding
                </button>
                <button className="px-8 py-4 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-all backdrop-blur-md">
                  Schedule Demo
                </button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <span>24h Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <span>Zero Initial Investment</span>
                </div>
              </div>
            </HolographicCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <LogoFull className="h-8" />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Enterprise hospitality procurement platform. AI-powered automation, crypto-compliant, built for Egyptian market.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/sandbox" className="hover:text-white transition-colors">Interactive Sandbox</Link></li>
                <li><Link href="#platform" className="hover:text-white transition-colors">Architecture</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/vision" className="hover:text-white transition-colors">Vision</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Compliance</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>ETA Phase 1 & 2 Compliant</li>
                <li>ISO 27001 Certified</li>
                <li>GDPR Aligned</li>
                <li>Ministry of Finance Partner</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 HotelsVendors. All rights reserved. Built for Egyptian hospitality.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
