import { Metadata } from "next";
import {
  Settings, Bell, Shield, Globe, Palette, Database,
  Save, RotateCcw, CheckCircle2, AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Platform Settings",
};

export default function AdminSettingsPage() {
  return (
    <div className="max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings size={22} className="text-[#8b5cf6]" />
            <span className="gradient-text-animated">Platform Settings</span>
          </h1>
          <p className="text-sm text-[rgba(255,255,255,0.40)] mt-0.5">
            Configure global platform behavior, notifications, and compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/70 hover:bg-white/[0.03] hover:text-white transition-colors">
            <RotateCcw size={12} />
            Reset
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/80 hover:bg-white/10 transition-colors">
            <Save size={12} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="space-y-4 animate-fade-in-up">
        {/* General */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
              <Globe size={16} className="text-white/40" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">General</h2>
              <p className="text-[10px] text-white/25">Platform name, timezone, and defaults</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5">Platform Name</label>
              <input
                type="text"
                defaultValue="Hotels Vendors"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5">Default Currency</label>
              <select className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#8b5cf6]/50 transition-colors">
                <option value="EGP">EGP — Egyptian Pound</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5">Timezone</label>
              <select className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#8b5cf6]/50 transition-colors">
                <option value="Africa/Cairo">Africa/Cairo (UTC+2)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5">Default Language</label>
              <select className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#8b5cf6]/50 transition-colors">
                <option value="en">English</option>
                <option value="ar">العربية (Arabic)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
              <Bell size={16} className="text-white/40" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Notifications</h2>
              <p className="text-[10px] text-white/25">Alert channels and thresholds</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "New tenant registration", desc: "Email + Dashboard", enabled: true },
              { label: "Order value exceeds threshold", desc: "Authority Matrix alert", enabled: true },
              { label: "ETA submission failure", desc: "Dead-letter queue notification", enabled: true },
              { label: "Security anomaly detected", desc: "Immediate escalation", enabled: true },
              { label: "Supplier document expiry", desc: "30-day advance warning", enabled: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-white">{item.label}</p>
                  <p className="text-[10px] text-white/25">{item.desc}</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.enabled ? "bg-[#34d399]/20" : "bg-white/[0.06]"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${item.enabled ? "right-0.5 bg-[#34d399]" : "left-0.5 bg-white/30"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
              <Shield size={16} className="text-white/40" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Compliance & Security</h2>
              <p className="text-[10px] text-white/25">ETA, Authority Matrix, and data policies</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "ETA e-invoicing mandatory", desc: "All invoices must pass ETA validation", enabled: true, critical: false },
              { label: "Authority Matrix enforcement", desc: "Multi-level approval for orders", enabled: true, critical: false },
              { label: "Cross-tenant isolation", desc: "Strict data boundary enforcement", enabled: true, critical: true },
              { label: "Audit log retention", desc: "Keep logs for 7 years", enabled: true, critical: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  {item.critical ? (
                    <AlertTriangle size={14} className="text-[#ef4444]" />
                  ) : (
                    <CheckCircle2 size={14} className="text-[#34d399]" />
                  )}
                  <div>
                    <p className="text-sm text-white">{item.label}</p>
                    <p className="text-[10px] text-white/25">{item.desc}</p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.enabled ? "bg-[#34d399]/20" : "bg-white/[0.06]"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${item.enabled ? "right-0.5 bg-[#34d399]" : "left-0.5 bg-white/30"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
              <Palette size={16} className="text-white/40" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Appearance</h2>
              <p className="text-[10px] text-white/25">Theme and branding</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5">Brand Color</label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg border border-white/[0.08]" style={{ background: "#8b5cf6" }} />
                <input
                  type="text"
                  defaultValue="#8b5cf6"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white font-mono focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5">Dashboard Theme</label>
              <select className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#8b5cf6]/50 transition-colors">
                <option value="dark">Dark (Default)</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
              <Database size={16} className="text-white/40" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Database & Backups</h2>
              <p className="text-[10px] text-white/25">Maintenance and data export</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-lg text-xs font-medium border border-white/10 text-white/70 hover:bg-white/[0.03] hover:text-white transition-colors">
              Export Tenant Data
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-medium border border-white/10 text-white/70 hover:bg-white/[0.03] hover:text-white transition-colors">
              Export Audit Log
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-medium border border-white/10 text-white/70 hover:bg-white/[0.03] hover:text-white transition-colors">
              Run Prune Job
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-medium border border-[#ef4444]/20 text-[#ef4444]/70 hover:bg-[#ef4444]/[0.03] transition-colors">
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
