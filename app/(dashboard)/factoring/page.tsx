"use client";

/**
 * Factoring Dashboard Landing Page
 * 
 * Entry point for hotels to learn about and apply for
 * reverse factoring services. Shows benefits, eligibility,
 * and CTA to start application.
 */

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Shield,
  Clock,
  ChevronRight,
  CheckCircle,
  Wallet,
  Percent,
  Zap,
  ArrowRight,
  Landmark
} from "lucide-react";
import { ButtonEnterprise } from "@/components/ui/button-enterprise";
import { CardEnterprise } from "@/components/ui/card-enterprise";

const BENEFITS = [
  {
    icon: Clock,
    title: "Get Paid in 24-48 Hours",
    description: "Instead of waiting 60-90 days for supplier payments, access your working capital immediately.",
  },
  {
    icon: Percent,
    title: "Low 2.5% Platform Fee",
    description: "Competitive rates with flexible payment terms. No hidden charges or setup fees.",
  },
  {
    icon: Shield,
    title: "Zero Risk to Credit Score",
    description: "Reverse factoring is supplier-led. Doesn't appear as debt on your balance sheet.",
  },
  {
    icon: Zap,
    title: "Automated Workflows",
    description: "AI-powered document verification and seamless integration with your procurement process.",
  },
];

const ELIGIBILITY_CRITERIA = [
  "Monthly procurement of 50,000+ EGP",
  "Minimum 2 years in operation",
  "Active commercial registration",
  "Valid tax card",
  "Hotel or hospitality establishment",
  "Operating in Egypt",
];

const PARTNERS = [
  { name: "National Bank of Egypt", type: "bank" },
  { name: "CIB", type: "bank" },
  { name: "QNB", type: "bank" },
  { name: "Banque Misr", type: "bank" },
  { name: "Fawry", type: "fintech" },
  { name: "InstaPay", type: "fintech" },
];

export default function FactoringLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
        
        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm mb-6">
                <Building2 className="w-4 h-4" />
                <span>Now Available for Egyptian Hotels</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Transform Your
                <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                  {" "}Working Capital
                </span>
              </h1>
              
              <p className="text-xl text-white/60 mb-8">
                Access up to 2,000,000 EGP in reverse factoring. 
                Get paid in 24-48 hours instead of waiting 60-90 days.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ButtonEnterprise
                  variant="primary"
                  size="lg"
                  onClick={() => router.push("/factoring/apply")}
                  className="group"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </ButtonEnterprise>
                <ButtonEnterprise
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push("/factoring/status")}
                >
                  Check Application Status
                </ButtonEnterprise>
              </div>
              
              <p className="text-sm text-white/40 mt-6">
                Free application. No commitment required. Response within 2-3 business days.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/[0.06] bg-[#0a0a10]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "2,000,000", label: "EGP Max Facility", suffix: "" },
              { value: "24", label: "Hour Approval", suffix: "h" },
              { value: "2.5", label: "Platform Fee", suffix: "%" },
              { value: "90", label: "Day Terms", suffix: "d" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                  <span className="text-indigo-400">{stat.suffix}</span>
                </div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Hotels Choose Our Factoring</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Join hundreds of Egyptian hotels already using our reverse factoring platform 
              to optimize their cash flow and grow their business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CardEnterprise variant="glass" className="p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
                        <p className="text-white/60">{benefit.description}</p>
                      </div>
                    </div>
                  </CardEnterprise>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 border-y border-white/[0.06] bg-[#0a0a10]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-white/60">Simple 4-step process to access your working capital</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Apply", desc: "Submit your application with business documents" },
              { step: "02", title: "Review", desc: "AI + human verification of your eligibility" },
              { step: "03", title: "Approve", desc: "Get approved for up to 2M EGP facility" },
              { step: "04", title: "Use", desc: "Factor invoices and get paid in 24-48h" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-5xl font-bold text-indigo-500/20 mb-4">{item.step}</div>
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
                {index < 3 && (
                  <ChevronRight className="w-6 h-6 text-white/10 absolute -right-3 top-1/2 hidden lg:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Are You Eligible?</h2>
              <p className="text-white/60 mb-8">
                Our reverse factoring program is designed for established hotels 
                and hospitality businesses in Egypt with consistent procurement needs.
              </p>
              
              <div className="space-y-4">
                {ELIGIBILITY_CRITERIA.map((criteria, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-white/80">{criteria}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <ButtonEnterprise
                  variant="primary"
                  size="lg"
                  onClick={() => router.push("/factoring/apply")}
                  className="group"
                >
                  Start Your Application
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </ButtonEnterprise>
              </div>
            </div>
            
            <CardEnterprise variant="elevated" className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Landmark className="w-6 h-6 text-indigo-400" />
                <h3 className="text-lg font-medium">Financing Partners</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {PARTNERS.map((partner) => (
                  <div
                    key={partner.name}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 text-center"
                  >
                    <div className="font-medium text-white/80">{partner.name}</div>
                    <div className="text-xs text-white/40 mt-1 capitalize">{partner.type}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/40 mt-6 text-center">
                Multiple financing partners ensure competitive rates and availability
              </p>
            </CardEnterprise>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm mb-6">
            <Wallet className="w-4 h-4" />
            <span>10+ Hotels Already Approved</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Cash Flow?</h2>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Join the growing network of Egyptian hotels using Hotels Vendors Factoring 
            to optimize working capital and focus on what matters most: 
            delivering exceptional guest experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonEnterprise
              variant="primary"
              size="lg"
              onClick={() => router.push("/factoring/apply")}
            >
              Apply for Factoring
            </ButtonEnterprise>
            <ButtonEnterprise
              variant="secondary"
              size="lg"
              onClick={() => window.open("https://wa.me/201002650604", "_blank")}
            >
              Contact Sales
            </ButtonEnterprise>
          </div>
        </div>
      </section>
    </div>
  );
}
