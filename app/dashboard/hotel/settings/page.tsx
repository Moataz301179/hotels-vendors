"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Bell,
  Shield,
  Users,
  Building2,
  CreditCard,
  Globe,
  Palette,
  Save,
  Building,
  MapPin,
  Phone,
  Mail,
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
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
        active ? "bg-surface-raised text-foreground border border-subtle" : "text-foreground-muted hover:text-foreground-tertiary hover:bg-surface-raised"
      }`}
    >
      <Icon size={14} />{label}
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-subtle">
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-foreground-muted mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-accent-base" : "bg-surface-raised"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function HotelSettingsPage() {
  const [activeSection, setActiveSection] = useState("organization");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Hotel Settings</h1>
          <p className="text-sm text-foreground-tertiary mt-0.5">Manage your hotel profile, preferences, and team access</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-base hover:bg-accent-base/80 text-xs text-foreground font-medium transition-all"
        >
          <Save size={14} /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </motion.div>

      <div className="flex gap-6">
        <motion.div variants={fadeInUp} className="w-44 flex-shrink-0 space-y-1">
          {SETTINGS_SECTIONS.map((section) => (
            <TabButton key={section.id} active={activeSection === section.id} onClick={() => setActiveSection(section.id)} icon={section.icon} label={section.label} />
          ))}
        </motion.div>

        <motion.div variants={fadeInUp} className="flex-1 min-w-0">
          {activeSection === "organization" && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Organization Profile</h3>
              <SettingRow label="Hotel Group Name" description="Legal entity name">
                <input type="text" defaultValue="Nile Luxury Hotels Group" className="w-56 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none focus:border-accent-base/50" />
              </SettingRow>
              <SettingRow label="Tax Registration Number" description="Egyptian tax ID">
                <input type="text" defaultValue="123-456-789" className="w-44 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground font-mono focus:outline-none focus:border-accent-base/50" />
              </SettingRow>
              <SettingRow label="Default Currency" description="Primary transaction currency">
                <select className="px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none">
                  <option className="bg-[var(--background)]">EGP - Egyptian Pound</option>
                  <option className="bg-[var(--background)]">USD - US Dollar</option>
                  <option className="bg-[var(--background)]">EUR - Euro</option>
                </select>
              </SettingRow>
              <SettingRow label="Headquarters" description="Primary business address">
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-foreground-muted" />
                  <input type="text" defaultValue="Cairo, Egypt" className="w-44 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none focus:border-accent-base/50" />
                </div>
              </SettingRow>
              <SettingRow label="Phone" description="Primary contact number">
                <input type="text" defaultValue="+20 2 1234 5678" className="w-44 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none focus:border-accent-base/50" />
              </SettingRow>
              <SettingRow label="Default Language" description="Interface language">
                <select className="px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none">
                  <option className="bg-[var(--background)]">English</option>
                  <option className="bg-[var(--background)]">العربية</option>
                </select>
              </SettingRow>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Notification Preferences</h3>
              <SettingRow label="Email Notifications" description="Receive order updates via email"><Toggle checked={true} onChange={() => {}} /></SettingRow>
              <SettingRow label="Push Notifications" description="Browser push for urgent updates"><Toggle checked={false} onChange={() => {}} /></SettingRow>
              <SettingRow label="Order Approval Alerts" description="When orders need your approval"><Toggle checked={true} onChange={() => {}} /></SettingRow>
              <SettingRow label="Delivery Updates" description="Shipment tracking and delivery confirmations"><Toggle checked={true} onChange={() => {}} /></SettingRow>
              <SettingRow label="Invoice Reminders" description="Due date and overdue alerts"><Toggle checked={true} onChange={() => {}} /></SettingRow>
              <SettingRow label="Marketing & Updates" description="Product updates and platform news"><Toggle checked={false} onChange={() => {}} /></SettingRow>
            </div>
          )}

          {activeSection === "security" && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Security Settings</h3>
              <SettingRow label="Two-Factor Authentication" description="Additional security layer for all users"><Toggle checked={true} onChange={() => {}} /></SettingRow>
              <SettingRow label="Session Timeout" description="Auto-logout after inactivity">
                <select className="px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none">
                  <option className="bg-[var(--background)]">30 minutes</option>
                  <option className="bg-[var(--background)]">1 hour</option>
                  <option className="bg-[var(--background)]">4 hours</option>
                  <option className="bg-[var(--background)]">Never</option>
                </select>
              </SettingRow>
              <SettingRow label="Approval Threshold" description="Orders above this amount require manager approval">
                <input type="text" defaultValue="EGP 50,000" className="w-36 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none focus:border-accent-base/50" />
              </SettingRow>
            </div>
          )}

          {activeSection === "billing" && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Billing</h3>
              <div className="rounded-xl bg-surface-raised border border-subtle p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-foreground-tertiary">Current Plan</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-base/10 text-accent-base">Enterprise</span>
                </div>
                <p className="text-lg font-bold text-foreground">EGP 15,000 / month</p>
                <p className="text-[11px] text-foreground-muted mt-0.5">Next invoice: July 1, 2026</p>
              </div>
              <SettingRow label="Payment Method" description="Default payment for invoices">
                <span className="text-xs text-foreground-tertiary">Bank Transfer · NBE account</span>
              </SettingRow>
              <SettingRow label="Billing Contact" description="Email for invoices">
                <input type="email" defaultValue="finance@nilehotels.com" className="w-48 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none focus:border-accent-base/50" />
              </SettingRow>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Appearance</h3>
              <SettingRow label="Theme" description="Interface color scheme">
                <select className="px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none">
                  <option className="bg-[var(--background)]">Dark</option>
                  <option className="bg-[var(--background)]">Light</option>
                  <option className="bg-[var(--background)]">System</option>
                </select>
              </SettingRow>
              <SettingRow label="Compact Mode" description="Reduce padding and spacing"><Toggle checked={false} onChange={() => {}} /></SettingRow>
              <SettingRow label="Show Animations" description="Enable motion effects"><Toggle checked={true} onChange={() => {}} /></SettingRow>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
