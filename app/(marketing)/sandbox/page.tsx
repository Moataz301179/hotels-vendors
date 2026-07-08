"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
  Play,
  Eye,
  BarChart3,
  Building2,
  Store,
  Landmark,
  Truck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  DollarSign,
  Star,
  Clock,
  Users,
  Package,
  Home,
  Church,
  Hotel,
  Utensils,
  Warehouse,
  ShoppingBag,
  Percent,
  ChevronRight,
  Menu,
  X,
  Gift,
  Gem,
  Leaf,
  Award,
  Heart,
  Layers,
  Globe,
  Phone,
  Mail,
  MapPin,
  Quote,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react"

const roles = [
  {
    id: "hotel",
    label: "Hotel Manager",
    icon: Building2,
    color: "from-amber-500 to-orange-500",
    description: "Source products, compare suppliers, and manage procurement across your properties.",
    metrics: [
      { label: "Monthly Orders", value: "847", icon: Package, change: "+12.5%" },
      { label: "Avg. Savings", value: "23.4%", icon: Percent, change: "+3.2%" },
      { label: "Supplier Rating", value: "4.8", icon: Star, change: "+0.3" },
      { label: "Delivery Time", value: "2.1d", icon: Clock, change: "-0.4d" },
    ],
    steps: [
      {
        title: "Browse Curated Products",
        description: "Access thousands of pre-vetted hospitality products from verified suppliers. Filter by category, price, ratings, and delivery time.",
        items: [
          { label: "Bedding & Linens", icon: Home, value: "342 SKUs" },
          { label: "F&B Supplies", icon: Utensils, value: "1,247 SKUs" },
          { label: "Housekeeping", icon: Layers, value: "891 SKUs" },
          { label: "Amenities", icon: Gift, value: "456 SKUs" },
        ],
      },
      {
        title: "Compare & Select Suppliers",
        description: "Side-by-side comparison of pricing, minimum orders, delivery timelines, and quality certifications across multiple suppliers.",
        items: [
          { label: "Avg. Price Match", icon: DollarSign, value: "94%" },
          { label: "Top-Rated Suppliers", icon: Award, value: "28" },
          { label: "Quality Certified", icon: Shield, value: "100%" },
        ],
      },
      {
        title: "Place & Track Orders",
        description: "Place orders in seconds, get real-time tracking, and receive automated delivery updates. Consolidate multiple orders into single shipments.",
        items: [
          { label: "Same-Day Dispatch", icon: Zap, value: "76%" },
          { label: "On-Time Delivery", icon: CheckCircle2, value: "98.2%" },
          { label: "Order Accuracy", icon: Star, value: "99.5%" },
        ],
      },
    ],
  },
  {
    id: "supplier",
    label: "Supplier",
    icon: Store,
    color: "from-emerald-500 to-teal-500",
    description: "Showcase your products, manage orders, and grow your hospitality client base.",
    metrics: [
      { label: "Active Listings", value: "1,432", icon: Package, change: "+8.7%" },
      { label: "Monthly Revenue", value: "$284K", icon: DollarSign, change: "+15.2%" },
      { label: "Order Fulfillment", value: "97.8%", icon: CheckCircle2, change: "+1.2%" },
      { label: "Client Hotels", value: "64", icon: Building2, change: "+12" },
    ],
    steps: [
      {
        title: "List Your Products",
        description: "Create detailed product listings with pricing tiers, bulk discounts, delivery zones, and quality certifications.",
        items: [
          { label: "Product Categories", icon: Layers, value: "18" },
          { label: "Avg. Listing Views", icon: Eye, value: "2,847/mo" },
          { label: "Conversion Rate", icon: TrendingUp, value: "12.4%" },
        ],
      },
      {
        title: "Receive & Manage Orders",
        description: "Get real-time order notifications, manage inventory, update pricing, and communicate directly with hotel buyers.",
        items: [
          { label: "Avg. Order Value", icon: DollarSign, value: "$4,280" },
          { label: "Repeat Buyers", icon: Users, value: "73%" },
          { label: "Response Time", icon: Clock, value: "< 15 min" },
        ],
      },
      {
        title: "Grow Your Reach",
        description: "Access analytics dashboards, request reviews, get featured in curated lists, and expand to new hotel chains.",
        items: [
          { label: "Hotels in Network", icon: Building2, value: "847" },
          { label: "Monthly Leads", icon: Users, value: "156" },
          { label: "Growth Rate", icon: TrendingUp, value: "18.3%/mo" },
        ],
      },
    ],
  },
  {
    id: "distributor",
    label: "Distributor",
    icon: Truck,
    color: "from-blue-500 to-indigo-500",
    description: "Manage logistics, optimize delivery routes, and coordinate supply chains at scale.",
    metrics: [
      { label: "Monthly Shipments", value: "3,241", icon: Package, change: "+9.8%" },
      { label: "Delivery Success", value: "99.1%", icon: CheckCircle2, change: "+0.5%" },
      { label: "Route Efficiency", value: "94.3%", icon: TrendingUp, change: "+2.1%" },
      { label: "Active Clients", value: "128", icon: Building2, change: "+18" },
    ],
    steps: [
      {
        title: "View Delivery Schedule",
        description: "Centralized dashboard with all pending pickups, deliveries, and route optimization suggestions.",
        items: [
          { label: "Daily Deliveries", icon: Truck, value: "108" },
          { label: "Avg. Route Distance", icon: MapPin, value: "47 km" },
          { label: "Fuel Efficiency", icon: Activity, value: "+6.7%" },
        ],
      },
      {
        title: "Coordinate Fulfillment",
        description: "Real-time coordination between suppliers and hotels. Auto-assign drivers, optimize load balancing, and track in transit.",
        items: [
          { label: "Fleet Utilization", icon: Truck, value: "92%" },
          { label: "On-Time Pickup", icon: Clock, value: "96.4%" },
          { label: "Avg. Delivery Time", icon: Zap, value: "3.2 hrs" },
        ],
      },
      {
        title: "Performance Analytics",
        description: "Comprehensive analytics on delivery performance, cost per route, client satisfaction, and operational bottlenecks.",
        items: [
          { label: "Cost per Delivery", icon: DollarSign, value: "$12.40" },
          { label: "Client Rating", icon: Star, value: "4.9" },
          { label: "Incident Rate", icon: Shield, value: "0.3%" },
        ],
      },
    ],
  },
  {
    id: "procurement",
    label: "Procurement Officer",
    icon: Landmark,
    color: "from-purple-500 to-pink-500",
    description: "Oversee multi-property procurement, enforce compliance, and drive cost optimization.",
    metrics: [
      { label: "Properties Managed", value: "37", icon: Building2, change: "+5" },
      { label: "Total Spend", value: "$18.2M", icon: DollarSign, change: "-4.1%" },
      { label: "Compliance Rate", value: "96.7%", icon: Shield, change: "+2.3%" },
      { label: "Cost Savings", value: "$1.8M", icon: TrendingUp, change: "+22%" },
    ],
    steps: [
      {
        title: "Multi-Property Oversight",
        description: "Unified view of procurement across all properties. Set budgets, approve purchases, and enforce vendor compliance.",
        items: [
          { label: "Active Properties", icon: Building2, value: "37" },
          { label: "Budget Adherence", icon: CheckCircle2, value: "93%" },
          { label: "Policy Compliance", icon: Shield, value: "96.7%" },
        ],
      },
      {
        title: "Negotiate & Contract",
        description: "Leverage collective buying power across properties. Negotiate bulk discounts, manage contracts, and onboard new suppliers.",
        items: [
          { label: "Active Contracts", icon: FileText, value: "124" },
          { label: "Bulk Discount Rate", icon: Percent, value: "18.5%" },
          { label: "Avg. Contract Term", icon: Clock, value: "14 months" },
        ],
      },
      {
        title: "Reporting & Analytics",
        description: "Generate comprehensive reports on spend analysis, savings tracking, supplier performance, and compliance audits.",
        items: [
          { label: "Monthly Reports", icon: BarChart3, value: "Auto-generated" },
          { label: "Spend Categories", icon: PieChart, value: "24" },
          { label: "Audit Trail", icon: Shield, value: "Full" },
        ],
      },
    ],
  },
]

const features = [
  {
    icon: Zap,
    title: "Real-Time Comparison",
    description: "Compare pricing, quality ratings, and delivery timelines across suppliers instantly.",
  },
  {
    icon: Shield,
    title: "Verified Suppliers",
    description: "Every supplier is vetted for quality, reliability, and compliance with hospitality standards.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Detailed dashboards with spend analysis, savings tracking, and procurement intelligence.",
  },
  {
    icon: Globe,
    title: "Multi-Property Support",
    description: "Manage procurement across your entire portfolio from a single unified platform.",
  },
]

const testimonials = [
  {
    quote: "This platform transformed how we manage procurement across our 12 properties. We're saving 23% on average and the onboarding was seamless.",
    author: "Ahmed Hassan",
    role: "Group Procurement Director",
    company: "Nile Hospitality Group",
    avatar: "AH",
  },
  {
    quote: "As a supplier, the platform gave us direct access to hotel buyers we could never reach before. Our revenue through the platform grew 340% in 6 months.",
    author: "Layla Mansour",
    role: "CEO",
    company: "Mansour Supplies Co.",
    avatar: "LM",
  },
  {
    quote: "The analytics alone are worth it. We can see exactly where every dollar goes and negotiate better contracts with real data.",
    author: "Karim El-Shafei",
    role: "VP of Operations",
    company: "Pyramids Hotels & Resorts",
    avatar: "KE",
  },
]

function FileText({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white mb-4"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg text-neutral-400 max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [displayed, setDisplayed] = useState("0")
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const numStr = value.replace(/[^0-9.]/g, "")
    const prefix = value.replace(/[0-9.]/g, "")
    const num = parseFloat(numStr)
    if (isNaN(num)) {
      setDisplayed(value)
      return
    }
    const isDecimal = numStr.includes(".")
    const duration = 1500
    const steps = 30
    let step = 0
    const interval = setInterval(() => {
      step++
      const progress = Math.min(step / steps, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = num * eased
      setDisplayed(
        prefix +
          (isDecimal ? current.toFixed(1) : Math.round(current).toString()) +
          suffix
      )
      if (progress >= 1) clearInterval(interval)
    }, duration / steps)
    return () => clearInterval(interval)
  }, [isInView, value, suffix])

  return <span ref={ref}>{displayed}</span>
}

export default function SandboxPage() {
  const [activeRole, setActiveRole] = useState(roles[0].id)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  const currentRole = roles.find((r) => r.id === activeRole)!

  return (
    <div className="min-h-screen bg-[#0a0808] text-white overflow-hidden" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0a0808]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg text-white" style={{ fontFamily: "var(--font-sans)" }}>
              HotelsVendors
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setActiveRole(role.id)
                  setActiveStepIndex(0)
                }}
                className={`text-sm transition-all duration-300 ${
                  activeRole === role.id
                    ? "text-white font-medium"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {role.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              className="text-sm text-neutral-400 hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Sign In
            </button>
            <button className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-sm font-medium text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300" style={{ fontFamily: "var(--font-sans)" }}>
              Get Started
            </button>
          </div>
          <button
            className="md:hidden text-neutral-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0a0808]/95 backdrop-blur-xl border-b border-white/10 md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setActiveRole(role.id)
                    setActiveStepIndex(0)
                    setMobileMenuOpen(false)
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
                    activeRole === role.id
                      ? "bg-white/10 text-white"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {role.label}
                </button>
              ))}
              <hr className="border-white/5" />
              <button className="block w-full text-left px-4 py-3 text-neutral-400" style={{ fontFamily: "var(--font-sans)" }}>Sign In</button>
              <button className="w-full px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-sm font-medium text-white" style={{ fontFamily: "var(--font-sans)" }}>
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-[4rem] pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-8"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <Sparkles className="w-4 h-4" />
              Interactive Demo – No Sign Up Required
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Experience the Future of{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-transparent bg-clip-text">
                Hotel Procurement
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Try the platform risk-free. Explore real procurement workflows, compare suppliers,
              and see exactly how much you could save — before committing a single dollar.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-base font-semibold text-white hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 flex items-center gap-2 group" style={{ fontFamily: "var(--font-sans)" }}>
                <Play className="w-5 h-5" />
                Start Interactive Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-white/10 rounded-full text-base font-medium text-neutral-300 hover:bg-white/5 transition-all duration-300 flex items-center gap-2" style={{ fontFamily: "var(--font-sans)" }}>
                <Eye className="w-5 h-5" />
                Watch Overview Video
              </button>
            </motion.div>
            {/* Hero Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {[
                { value: "847+", label: "Hotels Onboarded" },
                { value: "1,200+", label: "Verified Suppliers" },
                { value: "23.4%", label: "Avg. Cost Savings" },
                { value: "99.2%", label: "Delivery Success" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-sm text-neutral-500 mt-1" style={{ fontFamily: "var(--font-sans)" }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Dashboard Preview */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Your Dashboard, Live"
            subtitle="Real data. Real insights. See exactly what your procurement dashboard looks like."
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Dashboard Mockup */}
            <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/5">
              {/* Dashboard Header */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-sm text-neutral-500" style={{ fontFamily: "var(--font-sans)" }}>
                    HotelsVendors Dashboard — {currentRole.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Demo Data
                </div>
              </div>
              {/* Dashboard Content */}
              <div className="p-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {currentRole.metrics.map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-neutral-500 uppercase tracking-wider" style={{ fontFamily: "var(--font-sans)" }}>
                          {metric.label}
                        </span>
                        <metric.icon className="w-4 h-4 text-neutral-500" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-sans)" }}>
                        <AnimatedCounter value={metric.value} />
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400" style={{ fontFamily: "var(--font-sans)" }}>{metric.change}</span>
                        <span className="text-xs text-neutral-600 ml-1" style={{ fontFamily: "var(--font-sans)" }}>vs last month</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {/* Chart Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 bg-white/5 rounded-xl p-5 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-sans)" }}>Spend Overview</h4>
                        <p className="text-xs text-neutral-500" style={{ fontFamily: "var(--font-sans)" }}>Monthly procurement spend by category</p>
                      </div>
                      <LineChart className="w-5 h-5 text-neutral-500" />
                    </div>
                    {/* Fake chart bars */}
                    <div className="flex items-end gap-2 h-32">
                      {[40, 55, 45, 70, 60, 80, 65, 75, 85, 70, 90, 78].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          className="flex-1 bg-gradient-to-t from-amber-500/60 to-amber-400/30 rounded-t-sm relative group"
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: "var(--font-sans)" }}>
                            ${h * 120}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                        <div key={i} className="flex-1 text-[10px] text-neutral-600 text-center" style={{ fontFamily: "var(--font-sans)" }}>{m}</div>
                      ))}
                    </div>
                  </div>
                  {/* Recent Activity */}
                  <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-sans)" }}>Recent Activity</h4>
                      <Activity className="w-5 h-5 text-neutral-500" />
                    </div>
                    <div className="space-y-3">
                      {[
                        { action: "Order #2847 fulfilled", time: "2 min ago", status: "completed" },
                        { action: "New supplier added — Nile Textiles", time: "15 min ago", status: "success" },
                        { action: "Bulk discount approved — 18%", time: "1 hr ago", status: "pending" },
                        { action: "Delivery rescheduled — Cairo Marriott", time: "2 hrs ago", status: "warning" },
                        { action: "Monthly report generated", time: "3 hrs ago", status: "completed" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            item.status === "completed" ? "bg-green-500" :
                            item.status === "success" ? "bg-amber-500" :
                            item.status === "pending" ? "bg-blue-500" : "bg-orange-500"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-neutral-300 truncate" style={{ fontFamily: "var(--font-sans)" }}>{item.action}</p>
                            <p className="text-[10px] text-neutral-600" style={{ fontFamily: "var(--font-sans)" }}>{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-orange-500/5 rounded-3xl blur-2xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Choose Your Role"
            subtitle="See the platform from your perspective. Each role has a tailored experience."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
            {roles.map((role) => {
              const isActive = activeRole === role.id
              const Icon = role.icon
              return (
                <motion.button
                  key={role.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveRole(role.id)
                    setActiveStepIndex(0)
                  }}
                  className={`relative overflow-hidden rounded-xl p-4 md:p-5 text-left transition-all duration-300 border ${
                    isActive
                      ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-orange-500/5 shadow-lg shadow-amber-500/10"
                      : "border-white/5 bg-white/5 hover:bg-white/[0.07] hover:border-white/10"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeRoleBg"
                      className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/5"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-white mb-1" style={{ fontFamily: "var(--font-sans)" }}>
                      {role.label}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2" style={{ fontFamily: "var(--font-sans)" }}>
                      {role.description}
                    </p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Walkthrough Steps */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={`How It Works — ${currentRole.label}`}
            subtitle="A step-by-step walkthrough of your workflow on HotelsVendors."
          />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Step Navigation */}
            <div className="lg:col-span-2 space-y-3">
              {currentRole.steps.map((step, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  onClick={() => setActiveStepIndex(i)}
                  className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-300 ${
                    activeStepIndex === i
                      ? "border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent"
                      : "border-white/5 bg-white/[0.03] hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      activeStepIndex === i
                        ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
                        : "bg-white/10 text-neutral-500"
                    }`} style={{ fontFamily: "var(--font-sans)" }}>
                      {i + 1}
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold ${
                        activeStepIndex === i ? "text-white" : "text-neutral-400"
                      }`} style={{ fontFamily: "var(--font-sans)" }}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-0.5 line-clamp-1" style={{ fontFamily: "var(--font-sans)" }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Step Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStepIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border border-white/10 rounded-2xl p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg" style={{ fontFamily: "var(--font-sans)" }}>
                      {activeStepIndex + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sans)" }}>
                        {currentRole.steps[activeStepIndex].title}
                      </h3>
                      <p className="text-sm text-neutral-500" style={{ fontFamily: "var(--font-sans)" }}>
                        {currentRole.steps[activeStepIndex].description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentRole.steps[activeStepIndex].items.map((item, i) => {
                      const Icon = item.icon
                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                          className="bg-white/[0.04] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Icon className="w-4 h-4 text-amber-400" />
                            <span className="text-xs text-neutral-400" style={{ fontFamily: "var(--font-sans)" }}>{item.label}</span>
                          </div>
                          <div className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-sans)" }}>
                            {item.value}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                    <button
                      onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                      disabled={activeStepIndex === 0}
                      className="px-4 py-2 text-sm text-neutral-500 disabled:opacity-30 hover:text-white transition-colors flex items-center gap-1"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      Previous
                    </button>
                    {activeStepIndex < currentRole.steps.length - 1 ? (
                      <button
                        onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                        className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-sm font-medium text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 flex items-center gap-2"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        Next Step
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveRole("hotel")}
                        className="px-5 py-2 bg-white/10 rounded-full text-sm font-medium text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        Explore Other Roles
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Everything You Need"
            subtitle="Powerful features designed for hospitality procurement at every scale."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white/[0.03] border border-white/5 rounded-xl p-6 hover:bg-white/[0.06] hover:border-amber-500/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center mb-4 group-hover:from-amber-500/30 group-hover:to-orange-500/20 transition-all">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2" style={{ fontFamily: "var(--font-sans)" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Trusted by Industry Leaders"
            subtitle="Hear from procurement professionals already using HotelsVendors."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/[0.03] border border-white/5 rounded-xl p-6 hover:bg-white/[0.06] transition-all"
              >
                <Quote className="w-8 h-8 text-amber-500/30 mb-4" />
                <p className="text-sm text-neutral-300 leading-relaxed mb-6" style={{ fontFamily: "var(--font-sans)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white" style={{ fontFamily: "var(--font-sans)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-sans)" }}>{t.author}</div>
                    <div className="text-xs text-neutral-500" style={{ fontFamily: "var(--font-sans)" }}>{t.role}, {t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-amber-500/5 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/15 to-orange-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-8" style={{ fontFamily: "var(--font-sans)" }}>
              <Sparkles className="w-4 h-4" />
              Start Saving Today
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "var(--font-sans)" }}>
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text">
                Procurement Operations
              </span>
              ?
            </h2>
            <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto" style={{ fontFamily: "var(--font-sans)" }}>
              Join hundreds of hotels and suppliers already saving time and money.
              Get started free — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-base font-semibold text-white hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 flex items-center gap-2 group" style={{ fontFamily: "var(--font-sans)" }}>
                <Building2 className="w-5 h-5" />
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-white/10 rounded-full text-base font-medium text-neutral-300 hover:bg-white/5 transition-all duration-300 flex items-center gap-2" style={{ fontFamily: "var(--font-sans)" }}>
                <Phone className="w-5 h-5" />
                Schedule a Demo
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-neutral-600 flex-wrap">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                No credit card
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                Free 14-day trial
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                Dedicated support
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-white" style={{ fontFamily: "var(--font-sans)" }}>
                  HotelsVendors
                </span>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-xs" style={{ fontFamily: "var(--font-sans)" }}>
                The intelligent procurement platform for the hospitality industry.
              </p>
            </div>
            {[
              { title: "Platform", links: ["Dashboard", "Marketplace", "Analytics", "Integrations"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Support", links: ["Help Center", "Documentation", "API Status", "Community"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-sans)" }}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <button className="text-sm text-neutral-600 hover:text-neutral-400 transition-colors" style={{ fontFamily: "var(--font-sans)" }}>
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-700" style={{ fontFamily: "var(--font-sans)" }}>
              &copy; 2026 HotelsVendors. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <button className="text-xs text-neutral-700 hover:text-neutral-500 transition-colors" style={{ fontFamily: "var(--font-sans)" }}>Privacy Policy</button>
              <button className="text-xs text-neutral-700 hover:text-neutral-500 transition-colors" style={{ fontFamily: "var(--font-sans)" }}>Terms of Service</button>
              <button className="text-xs text-neutral-700 hover:text-neutral-500 transition-colors" style={{ fontFamily: "var(--font-sans)" }}>Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
