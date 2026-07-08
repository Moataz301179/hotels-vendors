"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Play, Menu, X, Check, TrendingUp, Clock, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function useScroll() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])
  return scrolled
}

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
]

function Header() {
  const scrolled = useScroll()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#0f0d0a]/95 backdrop-blur-md border-b border-white/10" : "bg-transparent"
    }`}>
      <nav className="flex h-16 max-w-6xl mx-auto items-center justify-between px-5 lg:px-8">
        <Link href="/" className="z-50 flex items-center">
          <img src="/logo.svg" alt="HotelsVendors" className="h-6 sm:h-7" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
          <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden z-50 flex items-center justify-center h-10 w-10 text-white/60" aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 top-16 z-40 bg-[#0f0d0a] md:hidden">
          <div className="flex flex-col items-center gap-6 pt-16">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-lg text-white/80 hover:text-white">
                {l.label}
              </a>
            ))}
            <Separator className="w-12" />
            <Link href="/login" onClick={() => setOpen(false)} className="text-lg text-white/60 hover:text-white">
              Sign In
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)}>
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#b8aa88]/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-5 lg:px-8 pt-[4rem] pb-[4rem] sm:pt-40 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <Badge className="mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b8aa88] animate-pulse mr-2" />
            Series A Opportunity
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-white">
            Turning Hotel Procurement Into a<br />
            <span className="text-[#b8aa88]">Financial Advantage</span>
          </h1>

          <p className="mt-5 mx-auto text-lg leading-relaxed text-white/50 max-w-2xl">
            AI-powered procurement with embedded reverse factoring and ETA e-invoicing.
            Suppliers paid in 48 hours — you keep your terms.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sandbox">
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="w-4 h-4" /> See Platform
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 flex items-center justify-center gap-2 text-sm text-white/30"
          >
            <span className="flex -space-x-2">
              {[1,2,3,4].map(c => (
                <span key={c} className="w-7 h-7 rounded-full border-2 border-[#0f0d0a] bg-gradient-to-br from-white/20 to-white/5" />
              ))}
            </span>
            <span>Trusted by <strong className="text-white/50">500+ hotels</strong> across Egypt</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const stats = [
  { value: "680+", label: "Verified Suppliers", icon: Users },
  { value: "500+", label: "Active Hotels", icon: TrendingUp },
  { value: "2.5B+", label: "GMV (EGP)", icon: Clock },
  { value: "94%", label: "Forecast Accuracy", icon: Shield },
]

function StatsBar() {
  return (
    <section className="border-y border-white/10 mt-16">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <s.icon className="w-5 h-5 mx-auto mb-2 text-[#b8aa88]" />
              <div className="text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-white/40 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const features = [
  {
    title: "AI Demand Forecasting",
    description: "Predict inventory needs 14 days ahead with 94% accuracy using occupancy and seasonality data.",
    icon: TrendingUp,
  },
  {
    title: "Reverse Factoring Engine",
    description: "Suppliers paid in 48 hours while you keep Net-60 terms. No supply chain disruption.",
    icon: Clock,
  },
  {
    title: "ETA E-Invoicing",
    description: "Full Egyptian Tax Authority compliance, automated. Zero manual data entry.",
    icon: Shield,
  },
  {
    title: "Verified Supplier Marketplace",
    description: "680+ pre-vetted vendors across 6 governorates. Quality guaranteed.",
    icon: Users,
  },
]

function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Badge variant="secondary" className="mb-4">The Platform</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">The Intelligent Procurement Stack</h2>
          <p className="mt-3 text-white/50 max-w-xl mx-auto">
            Four integrated pillars that turn procurement into a competitive advantage.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card className="h-full hover:bg-white/[0.05] transition-colors">
                <CardContent className="p-5 sm:p-6">
                  <div className="w-10 h-10 rounded-lg bg-[#b8aa88]/10 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-[#b8aa88]" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const steps = [
  { step: "01", title: "Onboard", desc: "Register in 5 minutes. AI maps your suppliers automatically." },
  { step: "02", title: "Forecast", desc: "AI predicts demand from occupancy data and seasonal trends." },
  { step: "03", title: "Transact", desc: "One-click POs with automatic three-way matching." },
  { step: "04", title: "Settle", desc: "Auto-reconciliation. Suppliers paid in 48 hours." },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">From Signup to Savings in 24 Hours</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative"
            >
              <div className="text-5xl font-extrabold text-[#b8aa88]/20 mb-3">{s.step}</div>
              <h3 className="font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Transform Your Procurement?</h2>
          <p className="mt-3 text-white/50 max-w-md mx-auto">
            Join 500+ hotels. No credit card required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sandbox">
              <Button variant="outline" size="lg">
                Explore Sandbox
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0f0d0a]">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="HotelsVendors" className="h-6" />
            <span className="text-xs text-white/30">&copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-xs text-white/30 hover:text-white/60 transition-colors">Sign In</Link>
            <Link href="/signup" className="text-xs text-white/30 hover:text-white/60 transition-colors">Get Started</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0d0a]">
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <FeaturesSection />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
