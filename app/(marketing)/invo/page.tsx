"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
  Search,
  Store,
  FileCheck,
  Package,
  BarChart3,
  Compass,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  DollarSign,
  Star,
  Clock,
  Building2,
  Users,
  Quote,
  CheckCircle2,
  Zap,
  Percent,
} from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Smart Product Search",
    description:
      "Search thousands of hospitality products across categories — bedding, F&B, housekeeping, amenities — with intelligent filters and real-time price comparison.",
  },
  {
    icon: Store,
    title: "Verified Suppliers",
    description:
      "Every supplier is vetted for quality, compliance, and reliability. Access ratings, certifications, and delivery performance metrics before placing an order.",
  },
  {
    icon: FileCheck,
    title: "Automated ETA Invoicing",
    description:
      "Each marketplace transaction generates a fully ETA-compliant e-invoice automatically. No manual entry, no compliance risk, no delays.",
  },
  {
    icon: Package,
    title: "Order Tracking",
    description:
      "Real-time order tracking from placement to delivery. Consolidated shipments, automated updates, and delivery confirmation across all your properties.",
  },
  {
    icon: BarChart3,
    title: "Procurement Analytics",
    description:
      "Comprehensive dashboards showing spend analysis, supplier performance, savings tracking, and category intelligence across your portfolio.",
  },
  {
    icon: Compass,
    title: "Supplier Discovery",
    description:
      "Discover new suppliers tailored to your needs. AI-powered recommendations based on your procurement patterns, location, and quality requirements.",
  },
]

const howItWorks = [
  {
    step: "01",
    title: "Hotel Places an Order",
    description:
      "Browse the marketplace, compare verified suppliers, and place an order with a few clicks. Every product is catalogued with transparent pricing, delivery timelines, and quality certifications.",
    items: [
      { label: "Products Listed", icon: Package, value: "4,200+" },
      { label: "Verified Suppliers", icon: Store, value: "1,200+" },
      { label: "Avg. Order Time", icon: Clock, value: "< 2 min" },
    ],
  },
  {
    step: "02",
    title: "ETA Invoice Generated Automatically",
    description:
      "The moment an order is placed, INVO generates a fully compliant ETA e-invoice. Tax calculations, supplier details, line-item breakdown — all handled automatically.",
    items: [
      { label: "Invoice Generation", icon: Zap, value: "< 5 sec" },
      { label: "ETA Compliance", icon: Shield, value: "100%" },
      { label: "Manual Work Saved", icon: Clock, value: "6 hrs/mo" },
    ],
  },
  {
    step: "03",
    title: "Order Fulfilled & Tracked",
    description:
      "Suppliers receive orders instantly. Real-time tracking, automated delivery updates, and confirmation. One marketplace, one workflow, end to end.",
    items: [
      { label: "Same-Day Dispatch", icon: Zap, value: "76%" },
      { label: "On-Time Delivery", icon: CheckCircle2, value: "98.2%" },
      { label: "Order Accuracy", icon: Star, value: "99.5%" },
    ],
  },
]

const testimonials = [
  {
    quote:
      "INVO turned our procurement into a competitive advantage. We source across 12 properties from one marketplace, and the automated ETA invoicing alone saves us days of manual work every month.",
    author: "Ahmed Hassan",
    role: "Group Procurement Director",
    company: "Nile Hospitality Group",
    avatar: "AH",
  },
  {
    quote:
      "Suppliers on INVO are vetted and reliable. Our on-time delivery rate hit 98% within two months. The 1% marketplace fee pays for itself ten times over in what we save on procurement overhead.",
    author: "Layla Mansour",
    role: "CEO",
    company: "Mansour Supplies Co.",
    avatar: "LM",
  },
  {
    quote:
      "The marketplace model changes everything. Instead of managing dozens of supplier relationships, we have one platform, one invoice format, one view of spend. It's procurement as it should be.",
    author: "Karim El-Shafei",
    role: "VP of Operations",
    company: "Pyramids Hotels & Resorts",
    avatar: "KE",
  },
]

const marketTicker = [
  { product: "Egyptian Cotton Sheets (King)", price: "EGP 1,280", change: "+2.3%" },
  { product: "Bottled Water (500ml x 24)", price: "EGP 84", change: "-0.8%" },
  { product: "Shampoo (400ml)", price: "EGP 36", change: "+1.1%" },
  { product: "Bath Towel (700gsm)", price: "EGP 215", change: "0.0%" },
  { product: "Coffee Beans (1kg)", price: "EGP 420", change: "+3.7%" },
  { product: "Mini Soap (25g)", price: "EGP 8.50", change: "-1.2%" },
]

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

export default function InvoPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg-canvas)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--accent-base) 0%, transparent 60%)",
            opacity: 0.05,
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--accent-base) 0%, transparent 70%)",
            opacity: 0.08,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
              style={{
                backgroundColor: "var(--accent-base)",
                opacity: 0.15,
                color: "var(--accent-base)",
                border: "1px solid",
                borderColor: "var(--accent-base)",
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "var(--accent-base)" }} />
              <span style={{ color: "var(--accent-base)" }}>The Hospitality Procurement Marketplace</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              One Marketplace for{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(to right, var(--accent-base), #f97316)",
                }}
              >
                Hospitality Procurement
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Hotels buy supplies from verified suppliers through INVO. Every transaction
              generates an ETA-compliant e-invoice automatically. One percent commission.
              Zero friction.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                className="px-8 py-4 rounded-full text-base font-semibold text-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
                style={{
                  backgroundColor: "var(--accent-base)",
                  boxShadow: "0 4px 20px rgba(var(--accent-base), 0.3)",
                }}
              >
                <Building2 className="w-5 h-5" />
                Register as Hotel Buyer
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="px-8 py-4 rounded-full text-base font-medium text-neutral-300 hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Store className="w-5 h-5" />
                Register as Supplier
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {[
                { value: "847+", label: "Hotels Onboarded" },
                { value: "1,200+", label: "Verified Suppliers" },
                { value: "EGP 2.4B+", label: "Marketplace Volume" },
                { value: "1%", label: "Commission per Transaction" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Market Price Ticker */}
      <section className="py-12 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "var(--accent-base)", opacity: 0.03 }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-4 h-4" style={{ color: "var(--accent-base)" }} />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
            >
              Market Prices — Live from INVO
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {marketTicker.map((item, i) => (
              <motion.div
                key={item.product}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p
                  className="text-xs mb-1 truncate"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
                >
                  {item.product}
                </p>
                <p
                  className="text-base font-semibold text-white"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {item.price}
                </p>
                <p
                  className={`text-xs ${
                    item.change.startsWith("+")
                      ? "text-green-400"
                      : item.change.startsWith("-")
                      ? "text-red-400"
                      : "text-neutral-500"
                  }`}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {item.change}
                </p>
              </motion.div>
            ))}
          </div>
          <p
            className="text-xs mt-4 text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            Indicative prices from recent marketplace transactions. Updated daily.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Everything INVO Does"
            subtitle="A full-stack procurement marketplace built for hospitality. From discovery to delivery to compliance."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-xl p-6 transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all"
                    style={{
                      backgroundColor: "var(--accent-base)",
                      opacity: 0.15,
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: "var(--accent-base)", opacity: 1 }}
                    />
                  </div>
                  <h3
                    className="text-base font-semibold text-white mb-2"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--accent-base) 0%, transparent 60%)",
            opacity: 0.02,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="How INVO Works"
            subtitle="Three steps from order to delivery. One marketplace, one workflow."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative rounded-2xl p-8"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="text-5xl font-bold mb-6"
                  style={{ color: "var(--accent-base)", opacity: 0.2, fontFamily: "var(--font-sans)" }}
                >
                  {step.step}
                </div>
                <h3
                  className="text-xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
                >
                  {step.description}
                </p>
                <div className="space-y-2">
                  {step.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="flex items-center justify-between py-2 rounded-lg px-3"
                        style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5"
                            style={{ color: "var(--accent-base)" }}
                          />
                          <span className="text-xs"
                            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
                          >
                            {item.label}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-white"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {item.value}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {i < howItWorks.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6"
                    style={{ color: "var(--accent-base)", opacity: 0.3 }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "EGP 2.4B+", label: "Marketplace Volume", sub: "Annualized GMV" },
              { value: "1%", label: "Commission", sub: "Per successful transaction" },
              { value: "99.2%", label: "Delivery Success", sub: "On-time, in-full" },
              { value: "4.8/5", label: "Supplier Rating", sub: "Across all categories" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center rounded-xl p-6"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ color: "var(--accent-base)", fontFamily: "var(--font-sans)" }}
                >
                  <AnimatedCounter value={stat.value} />
                </div>
                <div
                  className="text-sm font-medium text-white mb-1"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {stat.label}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
                >
                  {stat.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Trusted by Hotels & Suppliers"
            subtitle="See what procurement professionals say about INVO."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl p-6 transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Quote className="w-8 h-8 mb-4"
                  style={{ color: "var(--accent-base)", opacity: 0.3 }}
                />
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: "linear-gradient(to bottom right, var(--accent-base), #f97316)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div
                      className="text-sm font-medium text-white"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {t.author}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
                    >
                      {t.role}, {t.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--accent-base) 0%, transparent 80%)",
            opacity: 0.06,
          }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--accent-base) 0%, transparent 70%)",
            opacity: 0.1,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
              style={{
                backgroundColor: "var(--accent-base)",
                opacity: 0.15,
                border: "1px solid",
                borderColor: "var(--accent-base)",
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "var(--accent-base)" }} />
              <span style={{ color: "var(--accent-base)" }}>Join the Marketplace</span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Ready to Transform Your{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--accent-base), #f97316)",
                }}
              >
                Procurement Operations
              </span>
              ?
            </h2>
            <p
              className="text-lg mb-10 max-w-xl mx-auto"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
            >
              Hotels source from verified suppliers. Suppliers reach qualified buyers.
              Every transaction generates an ETA-compliant e-invoice. Join Egypt&apos;s
              fastest-growing hospitality marketplace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="px-8 py-4 rounded-full text-base font-semibold text-white hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
                style={{ backgroundColor: "var(--accent-base)" }}
              >
                <Building2 className="w-5 h-5" />
                Register as Hotel
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="px-8 py-4 rounded-full text-base font-medium transition-all duration-300 flex items-center gap-2"
                style={{
                  color: "var(--text-secondary)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Store className="w-5 h-5" />
                Register as Supplier
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs flex-wrap"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                No setup fees
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                1% per transaction
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                ETA invoices included
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                Cancel anytime
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
