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
  Palette,
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
  Package,
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
  { id: "profile", label: "Company Profile", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "shipping", label: "Shipping & Delivery", icon: Package },
  { id: "security", label: "Security", icon: Shield },
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
    <button onClick={onChange} className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-emerald-500" : "bg-surface-raised"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function SupplierSettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Supplier Settings</h1>
          <p className="text-sm text-foreground-tertiary mt-0.5">Manage your company profile, catalog defaults, and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs text-foreground font-medium transition-all"
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
          {activeSection === "profile" && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Company Profile</h3>
              <SettingRow label="Company Name" description="Legal business name">
                <input type="text" defaultValue="Premium Hospitality Supplies Ltd." className="w-56 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none focus:border-emerald-500/50" />
              </SettingRow>
              <SettingRow label="Tax ID" description="Egyptian Tax Registration Number">
                <input type="text" defaultValue="987-654-321" className="w-44 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground font-mono focus:outline-none focus:border-emerald-500/50" />
              </SettingRow>
              <SettingRow label="Commercial Registration" description="Commercial registry number">
                <input type="text" defaultValue="CR-2024-0042" className="w-44 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground font-mono focus:outline-none focus:border-emerald-500/50" />
              </SettingRow>
              <SettingRow label="Headquarters" description="Primary business location">
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-foreground-muted" />
                  <input type="text" defaultValue="Alexandria, Egypt" className="w-44 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none focus:border-emerald-500/50" />
                </div>
              </SettingRow>
              <SettingRow label="Phone" description="Primary contact number">
                <input type="text" defaultValue="+20 3 9876 5432" className="w-44 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none focus:border-emerald-500/50" />
              </SettingRow>
              <SettingRow label="Website" description="Company website">
                <div className="flex items-center gap-2">
                  <Globe size={12} className="text-foreground-muted" />
                  <input type="text" defaultValue="https://premiumsupplies.eg" className="w-44 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none focus:border-emerald-500/50" />
                </div>
              </SettingRow>
              <SettingRow label="Default Currency" description="Pricing currency for your products">
                <select className="px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none">
                  <option className="bg-[var(--background)]">EGP - Egyptian Pound</option>
                  <option className="bg-[var(--background)]">USD - US Dollar</option>
                </select>
              </SettingRow>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Notification Preferences</h3>
              <SettingRow label="Email Notifications" description="Receive order updates via email"><Toggle checked={true} onChange={() => {}} /></SettingRow>
              <SettingRow label="Push Notifications" description="Browser push for urgent updates"><Toggle checked={false} onChange={() => {}} /></SettingRow>
              <SettingRow label="New Order Alerts" description="When a hotel places an order"><Toggle checked={true} onChange={() => {}} /></SettingRow>
              <SettingRow label="Order Status Changes" description="When order status is updated by hotel"><Toggle checked={true} onChange={() => {}} /></SettingRow>
              <SettingRow label="Low Stock Alerts" description="When product stock is below threshold"><Toggle checked={true} onChange={() => {}} /></SettingRow>
              <SettingRow label="Marketing & Updates" description="Platform news and feature updates"><Toggle checked={false} onChange={() => {}} /></SettingRow>
            </div>
          )}

          {activeSection === "shipping" && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Shipping & Delivery</h3>
              <SettingRow label="Default Lead Time" description="Default number of days to fulfill orders">
                <select className="px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none">
                  <option className="bg-[var(--background)]">1-2 business days</option>
                  <option className="bg-[var(--background)]">3-5 business days</option>
                  <option className="bg-[var(--background)]">5-7 business days</option>
                  <option className="bg-[var(--background)]">7-14 business days</option>
                </select>
              </SettingRow>
              <SettingRow label="Shipping Areas" description="Regions you can deliver to">
                <input type="text" defaultValue="Cairo, Alexandria, Hurghada, Sharm El-Sheikh" className="w-64 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none focus:border-emerald-500/50" />
              </SettingRow>
              <SettingRow label="Free Shipping Threshold" description="Order amount for free delivery">
                <input type="text" defaultValue="EGP 10,000" className="w-28 px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none focus:border-emerald-500/50" />
              </SettingRow>
            </div>
          )}

          {activeSection === "security" && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Security Settings</h3>
              <SettingRow label="Two-Factor Authentication" description="Additional security layer"><Toggle checked={true} onChange={() => {}} /></SettingRow>
              <SettingRow label="Session Timeout" description="Auto-logout after inactivity">
                <select className="px-3 py-1.5 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground focus:outline-none">
                  <option className="bg-[var(--background)]">30 minutes</option>
                  <option className="bg-[var(--background)]">1 hour</option>
                  <option className="bg-[var(--background)]">4 hours</option>
                  <option className="bg-[var(--background)]">Never</option>
                </select>
              </SettingRow>
              <SettingRow label="API Access" description="Enable API key access for integrations">
                <Toggle checked={false} onChange={() => {}} />
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
