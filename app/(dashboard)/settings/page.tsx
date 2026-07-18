"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, Bell, Shield, Users, Building2, CreditCard,
  Globe, Palette, Database, Save, CheckCircle2,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const SETTINGS_SECTIONS = [
  { id: "general", label: "General", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "team", label: "Team", icon: Users },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
        active
          ? "bg-white/[0.06] text-white border border-white/[0.08]"
          : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
      <div>
        <p className="text-xs font-medium text-white">{label}</p>
        <p className="text-[11px] text-white/25 mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-accent-base" : "bg-white/10"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    orders: true,
    disputes: true,
    marketing: false,
  });

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-sm text-white/40 mt-0.5">Manage platform configuration, preferences, and integrations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-base hover:bg-accent-base/80 text-xs text-white font-medium transition-all">
          <Save size={14} />
          Save Changes
        </button>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <motion.div variants={fadeInUp} className="w-56 flex-shrink-0 space-y-1">
          {SETTINGS_SECTIONS.map((section) => (
            <TabButton
              key={section.id}
              active={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
              icon={section.icon}
              label={section.label}
            />
          ))}
        </motion.div>

        {/* Content */}
        <motion.div variants={fadeInUp} className="flex-1 min-w-0">
          {activeSection === "general" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">General Settings</h3>
              <SettingRow label="Platform Name" description="Displayed across the application and emails">
                <input
                  type="text"
                  defaultValue="Hotels Vendors"
                  className="w-48 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none focus:border-accent-base/50"
                />
              </SettingRow>
              <SettingRow label="Default Currency" description="Primary currency for all transactions">
                <select className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none">
                  <option className="bg-[#0a0a0a]">EGP - Egyptian Pound</option>
                  <option className="bg-[#0a0a0a]">USD - US Dollar</option>
                  <option className="bg-[#0a0a0a]">EUR - Euro</option>
                </select>
              </SettingRow>
              <SettingRow label="Default Language" description="Interface language for new users">
                <select className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none">
                  <option className="bg-[#0a0a0a]">English</option>
                  <option className="bg-[#0a0a0a]">العربية</option>
                </select>
              </SettingRow>
              <SettingRow label="Time Zone" description="Default timezone for scheduling and reports">
                <select className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none">
                  <option className="bg-[#0a0a0a]">Africa/Cairo (GMT+2)</option>
                  <option className="bg-[#0a0a0a]">UTC</option>
                </select>
              </SettingRow>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Notification Preferences</h3>
              <SettingRow label="Email Notifications" description="Receive updates via email">
                <Toggle checked={notifications.email} onChange={() => setNotifications({ ...notifications, email: !notifications.email })} />
              </SettingRow>
              <SettingRow label="Push Notifications" description="Browser push notifications">
                <Toggle checked={notifications.push} onChange={() => setNotifications({ ...notifications, push: !notifications.push })} />
              </SettingRow>
              <SettingRow label="Order Updates" description="Notifications for order status changes">
                <Toggle checked={notifications.orders} onChange={() => setNotifications({ ...notifications, orders: !notifications.orders })} />
              </SettingRow>
              <SettingRow label="Dispute Alerts" description="Notifications for new disputes">
                <Toggle checked={notifications.disputes} onChange={() => setNotifications({ ...notifications, disputes: !notifications.disputes })} />
              </SettingRow>
              <SettingRow label="Marketing Emails" description="Product updates and promotions">
                <Toggle checked={notifications.marketing} onChange={() => setNotifications({ ...notifications, marketing: !notifications.marketing })} />
              </SettingRow>
            </div>
          )}

          {activeSection === "security" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Security Settings</h3>
              <SettingRow label="Two-Factor Authentication" description="Require 2FA for all admin users">
                <Toggle checked={true} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="Session Timeout" description="Auto-logout after inactivity">
                <select className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none">
                  <option className="bg-[#0a0a0a]">15 minutes</option>
                  <option className="bg-[#0a0a0a]">30 minutes</option>
                  <option className="bg-[#0a0a0a]">1 hour</option>
                  <option className="bg-[#0a0a0a]">Never</option>
                </select>
              </SettingRow>
              <SettingRow label="Password Policy" description="Minimum requirements for user passwords">
                <select className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none">
                  <option className="bg-[#0a0a0a]">Strong (12+ chars)</option>
                  <option className="bg-[#0a0a0a]">Medium (8+ chars)</option>
                  <option className="bg-[#0a0a0a]">Basic (6+ chars)</option>
                </select>
              </SettingRow>
              <SettingRow label="API Key" description="Your platform API key for integrations">
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 rounded bg-white/[0.04] text-[10px] text-white/30 font-mono">hv_live_••••••••••••</code>
                  <button className="text-[10px] text-accent-base hover:underline">Regenerate</button>
                </div>
              </SettingRow>
            </div>
          )}

          {activeSection === "team" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Team Members</h3>
              <div className="space-y-3">
                {([] as { name: string; email: string; role: string; status: string }[]).length === 0 ? (
                  <div className="py-6 text-center">
                    <Users size={24} className="text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-white/30">No team members yet.</p>
                    <p className="text-[10px] text-white/20 mt-1">Invite team members to collaborate.</p>
                  </div>
                ) : ([] as { name: string; email: string; role: string; status: string }[]).map((member, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] text-white/40 font-medium">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">{member.name}</p>
                        <p className="text-[10px] text-white/25">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        member.role === "Admin" ? "bg-accent-base/10 text-accent-base" :
                        member.role === "Manager" ? "bg-blue-500/10 text-blue-400" :
                        "bg-white/10 text-white/40"
                      }`}>
                        {member.role}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${member.status === "active" ? "bg-emerald-400" : "bg-amber-400"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "organization" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Organization Profile</h3>
              <SettingRow label="Company Name" description="Legal entity name">
                <input
                  type="text"
                  placeholder="Enter company name"
                  className="w-48 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none focus:border-accent-base/50"
                />
              </SettingRow>
              <SettingRow label="Tax ID" description="Egyptian Tax Registration Number">
                <input
                  type="text"
                  placeholder="Enter tax ID"
                  className="w-48 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none focus:border-accent-base/50"
                />
              </SettingRow>
              <SettingRow label="Address" description="Registered business address">
                <input
                  type="text"
                  placeholder="Enter address"
                  className="w-64 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none focus:border-accent-base/50"
                />
              </SettingRow>
              <SettingRow label="Phone" description="Primary contact number">
                <input
                  type="text"
                  placeholder="Enter phone number"
                  className="w-48 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none focus:border-accent-base/50"
                />
              </SettingRow>
            </div>
          )}

          {activeSection === "billing" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Billing & Subscription</h3>
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/40">Current Plan</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-base/10 text-accent-base">Enterprise</span>
                </div>
                <p className="text-lg font-bold text-white">EGP 25,000 / month</p>
                <p className="text-[11px] text-white/25 mt-0.5">Next billing: June 8, 2026</p>
              </div>
              <SettingRow label="Payment Method" description="Default payment for invoices">
                <span className="text-xs text-white/60">Visa ending in 4242</span>
              </SettingRow>
              <SettingRow label="Auto-Renew" description="Automatically renew subscription">
                <Toggle checked={true} onChange={() => {}} />
              </SettingRow>
            </div>
          )}

          {activeSection === "integrations" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Connected Integrations</h3>
              <div className="space-y-3">
                {[
                  { name: "ETA E-Invoicing", status: "connected", desc: "Egyptian Tax Authority" },
                  { name: "Paymob", status: "connected", desc: "Payment processing" },
                  { name: "Google Maps", status: "connected", desc: "Route optimization" },
                  { name: "Slack", status: "disconnected", desc: "Team notifications" },
                  { name: "WhatsApp Business", status: "pending", desc: "Customer communication" },
                ].map((integration, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <div>
                      <p className="text-xs font-medium text-white">{integration.name}</p>
                      <p className="text-[10px] text-white/25">{integration.desc}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      integration.status === "connected" ? "bg-emerald-500/10 text-emerald-400" :
                      integration.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                      "bg-white/10 text-white/40"
                    }`}>
                      {integration.status === "connected" ? "Connected" : integration.status === "pending" ? "Pending" : "Disconnected"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Appearance</h3>
              <SettingRow label="Theme" description="Interface color scheme">
                <select className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none">
                  <option className="bg-[#0a0a0a]">Dark</option>
                  <option className="bg-[#0a0a0a]">Light</option>
                  <option className="bg-[#0a0a0a]">System</option>
                </select>
              </SettingRow>
              <SettingRow label="Accent Color" description="Primary brand color">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent-base border border-white/20" />
                  <span className="text-[11px] text-white/40">var(--accent-base)</span>
                </div>
              </SettingRow>
              <SettingRow label="Compact Mode" description="Reduce padding and spacing">
                <Toggle checked={false} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="Show Animations" description="Enable motion effects">
                <Toggle checked={true} onChange={() => {}} />
              </SettingRow>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
