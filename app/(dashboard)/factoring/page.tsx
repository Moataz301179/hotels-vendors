"use client";

import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  Landmark,
  FileCheck,
  AlertCircle,
  ArrowRight,
  Bell,
  BarChart3,
  Users,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Total Factored", value: "2.4M EGP", change: "+340K", icon: Wallet, color: "#3b82f6" },
  { label: "Active Facilities", value: 18, change: "+3", icon: Landmark, color: "#10b981" },
  { label: "Approval Rate", value: "94%", change: "+2%", icon: FileCheck, color: "#f59e0b" },
  { label: "Avg Turnaround", value: "18h", change: "-4h", icon: Clock, color: "#8b5cf6" },
];

const FACILITIES = [
  { name: "Nile Commercial Bank", type: "Credit Line", limit: "500K EGP", used: "320K EGP", rate: "12.5%", status: "Active" },
  { name: "Cairo Finance Corp", type: "Factoring", limit: "1.2M EGP", used: "890K EGP", rate: "8.2%", status: "Active" },
  { name: "Red Sea Capital", type: "Credit Line", limit: "300K EGP", used: "120K EGP", rate: "14.0%", status: "Pending" },
  { name: "Alexandria Trade Bank", type: "Factoring", limit: "800K EGP", used: "450K EGP", rate: "9.5%", status: "Active" },
];

const PENDING_REQUESTS = [
  { id: "FR-2026-0012", hotel: "Jaz Aquamarine", amount: "45,000 EGP", risk: "Low", days: 2 },
  { id: "FR-2026-0011", hotel: "Sunrise Arabian Beach", amount: "28,500 EGP", risk: "Medium", days: 1 },
  { id: "FR-2026-0010", hotel: "Pickalbatros Palace", amount: "62,000 EGP", risk: "Low", days: 3 },
];

const QUICK_ACTIONS = [
  { label: "New Facility", desc: "Onboard partner", icon: Landmark, to: "/factoring", color: "#3b82f6" },
  { label: "Review Requests", desc: "Pending approvals", icon: FileCheck, to: "/factoring", color: "#10b981" },
  { label: "Risk Heatmap", desc: "Portfolio view", icon: BarChart3, to: "/factoring", color: "#f59e0b" },
  { label: "Reconciliation", desc: "ETA matching", icon: ShieldCheck, to: "/factoring", color: "#8b5cf6" },
];

export default function FinanceDashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight">Finance & Liquidity</h1>
            <p className="text-[13px] text-white/40 mt-1">Manage credit facilities, factoring, and payment reconciliation</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e11d48]" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.06]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#10b98115] text-[#10b981]">
                  {stat.change}
                </span>
              </div>
              <div className="text-[24px] font-bold text-white">{stat.value}</div>
              <div className="text-[12px] text-white/40 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.to}
                  className="group p-4 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${action.color}15` }}>
                    <action.icon className="w-4.5 h-4.5" style={{ color: action.color }} />
                  </div>
                  <div className="text-[13px] font-semibold text-white">{action.label}</div>
                  <div className="text-[11px] text-white/30 mt-0.5">{action.desc}</div>
                </Link>
              ))}
            </div>

            {/* Facilities Table */}
            <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-white">Credit Facilities</h2>
                <Link href="/factoring" className="text-[12px] text-[#e11d48] hover:text-[#be123c] flex items-center gap-1">
                  Manage <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Partner</th>
                      <th className="px-6 py-3 text-left text-[11px] font-medium text-white/30 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-right text-[11px] font-medium text-white/30 uppercase tracking-wider">Limit</th>
                      <th className="px-6 py-3 text-right text-[11px] font-medium text-white/30 uppercase tracking-wider">Used</th>
                      <th className="px-6 py-3 text-right text-[11px] font-medium text-white/30 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-right text-[11px] font-medium text-white/30 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {FACILITIES.map((f) => (
                      <tr key={f.name} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-[13px] font-medium text-white">{f.name}</td>
                        <td className="px-6 py-4 text-[13px] text-white/40">{f.type}</td>
                        <td className="px-6 py-4 text-[13px] text-white text-right">{f.limit}</td>
                        <td className="px-6 py-4 text-[13px] text-white text-right">{f.used}</td>
                        <td className="px-6 py-4 text-[13px] text-white text-right">{f.rate}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                            f.status === "Active" ? "bg-[#10b98115] text-[#10b981]" : "bg-[#f59e0b15] text-[#f59e0b]"
                          }`}>
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Requests */}
            <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
                  Pending Requests
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f59e0b15] text-[#f59e0b]">{PENDING_REQUESTS.length}</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {PENDING_REQUESTS.map((req) => (
                  <div key={req.id} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium text-white">{req.id}</span>
                      <span className="text-[11px] text-white/20">{req.days}d</span>
                    </div>
                    <div className="text-[12px] text-white/30">{req.hotel}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-white">{req.amount}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                        req.risk === "Low" ? "bg-[#10b98115] text-[#10b981]" : "bg-[#f59e0b15] text-[#f59e0b]"
                      }`}>
                        {req.risk} Risk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-white/[0.06]">
                <Link href="/factoring" className="text-[12px] text-[#e11d48] hover:text-[#be123c] flex items-center justify-center gap-1">
                  Review All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Portfolio Health */}
            <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.06] p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#10b981]" />
                <h2 className="text-[14px] font-semibold text-white">Portfolio Yield</h2>
              </div>
              <div className="text-[32px] font-bold text-white">11.2%</div>
              <div className="text-[12px] text-white/40 mt-1">Annualized return across all facilities</div>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full rounded-full bg-[#10b981]" style={{ width: "78%" }} />
                </div>
                <span className="text-[11px] text-white/30">78% utilized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
