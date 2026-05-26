"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings, Bell, Shield, Users, Building2, CreditCard,
  Globe, Palette, Database, Save, CheckCircle2,
} from "lucide-react";
import { useTheme, THEMES, type ThemeName } from "@/components/theme/theme-provider";

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

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>; label: string }) {
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
      className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-[#bef264]" : "bg-white/10"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

/* ─── THEME SELECTOR ─── */
function ThemeSelector() {
  const { themeName, setTheme, themes } = useTheme();

  return (
    <div className="space-y-3">
      {themes.map((t) => {
        const config = THEMES[t];
        const active = themeName === t;
        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              active
                ? "border-white/[0.12] bg-white/[0.04]"
                : "border-white/[0.04] bg-transparent hover:border-white/[0.08] hover:bg-white/[0.02]"
            }`}
          >
            <div
              className="w-10 h-10 rounded-lg flex-shrink-0 border border-white/[0.08]"
              style={{ background: config.accent }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-white">{config.name}</span>
                {active && (
                  <span className="text-[9px] font-semibold text-[#bef264] bg-[#bef264]/10 px-1.5 py-0.5 rounded">Active</span>
                )}
              </div>
              <p className="text-[11px] text-white/30 truncate">{config.description}</p>
            </div>
          </button>
        );
      })}
    </div>
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

  // Handle URL query param for tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && SETTINGS_SECTIONS.some((s) => s.id === tab)) {
      setActiveSection(tab);
    }
  }, []);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Settings</h1>
          <p className="text-xs text-white/40">Manage your account, team, and preferences</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#bef264] text-white text-xs font-medium rounded-lg hover:bg-[#6d28d9] transition-colors">
          <Save size={14} />
          Save Changes
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0">
          <div className="space-y-0.5">
            {SETTINGS_SECTIONS.map((section) => (
              <TabButton
                key={section.id}
                active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
                icon={section.icon}
                label={section.label}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div variants={fadeInUp} className="flex-1 min-w-0">
          {activeSection === "general" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">General Settings</h3>
              <SettingRow label="Language" description="Interface language">
                <select className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none">
                  <option className="bg-[#0a0a0a]">English</option>
                  <option className="bg-[#0a0a0a]">العربية</option>
                </select>
              </SettingRow>
              <SettingRow label="Time Zone" description="Your local time zone">
                <select className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none">
                  <option className="bg-[#0a0a0a]">Africa/Cairo (GMT+2)</option>
                </select>
              </SettingRow>
              <SettingRow label="Currency" description="Primary currency for transactions">
                <select className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white focus:outline-none">
                  <option className="bg-[#0a0a0a]">EGP (Egyptian Pound)</option>
                  <option className="bg-[#0a0a0a]">USD (US Dollar)</option>
                </select>
              </SettingRow>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Notification Preferences</h3>
              <SettingRow label="Email Notifications" description="Receive updates via email">
                <Toggle checked={notifications.email} onChange={() => toggleNotification("email")} />
              </SettingRow>
              <SettingRow label="Push Notifications" description="Browser push notifications">
                <Toggle checked={notifications.push} onChange={() => toggleNotification("push")} />
              </SettingRow>
              <SettingRow label="Order Updates" description="Status changes for your orders">
                <Toggle checked={notifications.orders} onChange={() => toggleNotification("orders")} />
              </SettingRow>
              <SettingRow label="Dispute Alerts" description="When a dispute requires attention">
                <Toggle checked={notifications.disputes} onChange={() => toggleNotification("disputes")} />
              </SettingRow>
              <SettingRow label="Marketing" description="Product updates and promotions">
                <Toggle checked={notifications.marketing} onChange={() => toggleNotification("marketing")} />
              </SettingRow>
            </div>
          )}

          {activeSection === "security" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Security</h3>
              <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security">
                <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white hover:bg-white/[0.06] transition-colors">
                  Enable
                </button>
              </SettingRow>
              <SettingRow label="Session Management" description="Active login sessions">
                <span className="text-xs text-white/40">1 active session</span>
              </SettingRow>
              <SettingRow label="Password" description="Last changed 30 days ago">
                <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white hover:bg-white/[0.06] transition-colors">
                  Change
                </button>
              </SettingRow>
            </div>
          )}

          {activeSection === "team" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Team Members</h3>
              <div className="space-y-3">
                {[
                  { name: user?.name || "You", role: "Owner", email: user?.email || "" },
                  { name: "Ahmed Hassan", role: "Procurement Manager", email: "ahmed@example.com" },
                  { name: "Sara Mahmoud", role: "Finance Lead", email: "sara@example.com" },
                ].map((member) => (
                  <div key={member.email} className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-[11px] font-bold text-white/60">
                        {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">{member.name}</p>
                        <p className="text-[10px] text-white/30">{member.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-white/40 px-2 py-1 rounded bg-white/[0.04]">{member.role}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] text-xs text-white rounded-lg hover:bg-white/[0.06] transition-colors">
                <Users size={14} />
                Invite Member
              </button>
            </div>
          )}

          {activeSection === "organization" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Organization</h3>
              <SettingRow label="Company Name" description="Your organization's display name">
                <span className="text-xs text-white/60">{user?.tenantName || "Not set"}</span>
              </SettingRow>
              <SettingRow label="Tax ID" description="Egyptian Tax Authority registration number">
                <span className="text-xs text-white/40">—</span>
              </SettingRow>
              <SettingRow label="Industry" description="Your business category">
                <span className="text-xs text-white/40">Hospitality</span>
              </SettingRow>
            </div>
          )}

          {activeSection === "billing" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Plan &amp; Billing</h3>
              <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white">Current Plan</span>
                  <span className="text-[10px] font-semibold text-[#bef264] bg-[#bef264]/10 px-2 py-0.5 rounded">Pro</span>
                </div>
                <p className="text-[24px] font-bold text-white">EGP 4,500<span className="text-[13px] font-normal text-white/40">/month</span></p>
                <p className="text-[11px] text-white/30 mt-1">Billed monthly. Next billing date: June 15, 2026.</p>
              </div>
              <SettingRow label="Payment Method" description="Your default payment method">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-white/30" />
                  <span className="text-xs text-white/40">•••• 4242</span>
                </div>
              </SettingRow>
              <SettingRow label="Invoice History" description="Download past invoices">
                <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white hover:bg-white/[0.06] transition-colors">
                  View
                </button>
              </SettingRow>
            </div>
          )}

          {activeSection === "integrations" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Integrations</h3>
              <SettingRow label="ETA E-Invoicing" description="Egyptian Tax Authority connection">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-xs text-emerald-400">Connected</span>
                </div>
              </SettingRow>
              <SettingRow label="Slack" description="Team notifications">
                <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white hover:bg-white/[0.06] transition-colors">
                  Connect
                </button>
              </SettingRow>
              <SettingRow label="Webhooks" description="Custom event endpoints">
                <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white hover:bg-white/[0.06] transition-colors">
                  Configure
                </button>
              </SettingRow>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Appearance</h3>
              <p className="text-[11px] text-white/30 mb-4">Select a theme to customize the interface colors.</p>
              <ThemeSelector />
              <div className="mt-6 pt-4 border-t border-white/[0.04]">
                <SettingRow label="Compact Mode" description="Reduce padding and spacing">
                  <Toggle checked={false} onChange={() => {}} />
                </SettingRow>
                <SettingRow label="Show Animations" description="Enable motion effects">
                  <Toggle checked={true} onChange={() => {}} />
                </SettingRow>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
