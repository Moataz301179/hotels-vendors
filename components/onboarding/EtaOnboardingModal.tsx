"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ChevronUp,
  Key,
  FileText,
  ExternalLink,
  Play,
  Send,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Users,
  Mail,
  MessageCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────

interface EtaOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  onDemoActivated?: () => void;
  onUpgradeLive?: () => void;
}

type ModalTab = "credentials" | "delegate";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

// ─── ETA Registration Guide Steps ─────────────────────────────────

const ETA_REGISTRATION_STEPS: AccordionItem[] = [
  {
    id: "step-1",
    title: "Step 1: Access the Egyptian Tax Authority Portal",
    content: (
      <div className="space-y-3">
        <p className="text-[13px] text-white/50 leading-relaxed">
          Navigate to the official Egyptian Tax Authority e-invoicing portal:
        </p>
        <a
          href="https://invoicing.eta.gov.eg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: "#FFB000", backgroundColor: "rgba(132,204,22,0.08)", border: "1px solid rgba(132,204,22,0.15)" }}
        >
          <ExternalLink size={12} />
          https://invoicing.eta.gov.eg
        </a>
        <p className="text-[12px] text-white/30">
          You will need your company&apos;s registered Tax ID (9-10 digits) and an authorized signatory account.
        </p>
      </div>
    ),
  },
  {
    id: "step-2",
    title: "Step 2: Register Your ERP / Accounting System",
    content: (
      <div className="space-y-3">
        <p className="text-[13px] text-white/50 leading-relaxed">
          Under <strong className="text-white/70">&quot;ERP Registration&quot;</strong>, select <strong className="text-white/70">&quot;Third-Party Integration&quot;</strong> and fill in:
        </p>
        <ul className="space-y-2">
          {[
            "Integration Name: HotelsVendors (or your preferred label)",
            "Integration Type: API-Based (REST)",
            "Contact Email: Your company admin email",
            "Technical Contact: Your IT team lead",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0" style={{ backgroundColor: "rgba(132,204,22,0.1)" }}>
                <span className="text-[8px] font-bold" style={{ color: "#FFB000" }}>{i + 1}</span>
              </div>
              <span className="text-[12px] text-white/40">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-[12px] text-white/30">
          The ETA will review your registration within 1-3 business days.
        </p>
      </div>
    ),
  },
  {
    id: "step-3",
    title: "Step 3: Generate API Client Credentials",
    content: (
      <div className="space-y-3">
        <p className="text-[13px] text-white/50 leading-relaxed">
          Once approved, navigate to <strong className="text-white/70">&quot;API Management&quot; → &quot;Create Client&quot;</strong>:
        </p>
        <ul className="space-y-2">
          {[
            "Client Name: HotelsVendors-Production",
            "Grant Type: Client Credentials",
            "Scope: invoice:submit, invoice:read, invoice:cancel",
            "Environment: Pre-production (for testing) or Production",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0" style={{ backgroundColor: "rgba(132,204,22,0.1)" }}>
                <span className="text-[8px] font-bold" style={{ color: "#FFB000" }}>{i + 1}</span>
              </div>
              <span className="text-[12px] text-white/40">{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" style={{ color: "#3B82F6" }} />
          <p className="text-[11px] text-white/40">
            <strong className="text-white/60">Important:</strong> Copy the Client ID and Client Secret immediately. The secret is shown only once and cannot be retrieved later.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "step-4",
    title: "Step 4: Complete Pre-Production Testing",
    content: (
      <div className="space-y-3">
        <p className="text-[13px] text-white/50 leading-relaxed">
          Before going live, submit at least 10 test invoices to the pre-production environment:
        </p>
        <ul className="space-y-2">
          {[
            "Use the preprod API URL: api.preprod.invoicing.eta.gov.eg",
            "Submit sample invoices with valid Tax IDs",
            "Verify UUID generation and digital signature validation",
            "Request production access from ETA after successful testing",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0" style={{ backgroundColor: "rgba(132,204,22,0.1)" }}>
                <span className="text-[8px] font-bold" style={{ color: "#FFB000" }}>{i + 1}</span>
              </div>
              <span className="text-[12px] text-white/40">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────

export function EtaOnboardingModal({
  isOpen,
  onClose,
  tenantId,
  onDemoActivated,
  onUpgradeLive,
}: EtaOnboardingModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>("credentials");
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Credential form state
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [taxId, setTaxId] = useState("");
  const [environment, setEnvironment] = useState<"preprod" | "production">("preprod");

  // Delegate form state
  const [delegateEmail, setDelegateEmail] = useState("");
  const [delegateWhatsApp, setDelegateWhatsApp] = useState("");
  const [delegateSent, setDelegateSent] = useState(false);

  const toggleAccordion = useCallback((id: string) => {
    setExpandedAccordion((prev) => (prev === id ? null : id));
  }, []);

  const handleCopy = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const handleSubmitCredentials = useCallback(async () => {
    if (!clientId || !clientSecret || !taxId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboarding/upgrade-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clientSecret, taxId, environment }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        onUpgradeLive?.();
      }
    } catch {
      // silent fail
    } finally {
      setIsSubmitting(false);
    }
  }, [clientId, clientSecret, taxId, environment, onUpgradeLive]);

  const handleDemoBypass = useCallback(async () => {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/onboarding/demo-bypass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        onDemoActivated?.();
      }
    } catch {
      // silent fail
    } finally {
      setDemoLoading(false);
    }
  }, [onDemoActivated]);

  const handleDelegateInvite = useCallback(async () => {
    if (!delegateEmail && !delegateWhatsApp) return;
    try {
      await fetch("/api/onboarding/delegate-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: delegateEmail || undefined,
          whatsapp: delegateWhatsApp || undefined,
          tenantId,
        }),
      });
      setDelegateSent(true);
      setTimeout(() => setDelegateSent(false), 4000);
    } catch {
      // silent fail
    }
  }, [delegateEmail, delegateWhatsApp, tenantId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between p-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <h2 className="text-[18px] font-bold text-white">Connect Your ETA Credentials</h2>
              <p className="text-[12px] text-white/30 mt-1">Enable live Egyptian Tax Authority e-invoicing integration</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/[0.04]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <X size={16} />
            </button>
          </div>

          {/* ── Demo Bypass Button ── */}
          <div className="px-6 pt-4">
            <button
              onClick={handleDemoBypass}
              disabled={demoLoading}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-[13px] font-medium transition-all disabled:opacity-40"
              style={{
                backgroundColor: "rgba(132,204,22,0.06)",
                border: "1px dashed rgba(132,204,22,0.2)",
                color: "#FFB000",
              }}
            >
              {demoLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Setting up demo…
                </span>
              ) : (
                <>
                  <Play size={14} />
                  Skip and Explore with Demo Data
                </>
              )}
            </button>
            <p className="text-[10px] text-white/20 text-center mt-2">
              Try the platform with 30 days of mock HORECA data — no ETA keys required
            </p>
          </div>

          {/* ── Tab Switcher ── */}
          <div className="px-6 pt-5">
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
              <button
                onClick={() => setActiveTab("credentials")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-medium transition-all"
                style={{
                  backgroundColor: activeTab === "credentials" ? "rgba(132,204,22,0.08)" : "transparent",
                  color: activeTab === "credentials" ? "#FFB000" : "rgba(255,255,255,0.4)",
                }}
              >
                <Key size={13} />
                Enter API Keys
              </button>
              <button
                onClick={() => setActiveTab("delegate")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-medium transition-all"
                style={{
                  backgroundColor: activeTab === "delegate" ? "rgba(132,204,22,0.08)" : "transparent",
                  color: activeTab === "delegate" ? "#FFB000" : "rgba(255,255,255,0.4)",
                }}
              >
                <Users size={13} />
                Invite Financial Controller
              </button>
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "credentials" ? (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {/* ── Where to Find Keys Accordion ── */}
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                    <button
                      onClick={() => toggleAccordion("eta-guide")}
                      className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText size={14} style={{ color: "#FFB000" }} />
                        <span className="text-[12px] font-medium text-white/70">Where to Find Your ETA Keys — Step-by-Step Guide</span>
                      </div>
                      {expandedAccordion === "eta-guide" ? (
                        <ChevronUp size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                      ) : (
                        <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedAccordion === "eta-guide" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                            {ETA_REGISTRATION_STEPS.map((step) => (
                              <div key={step.id} className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                                <button
                                  onClick={() => toggleAccordion(step.id)}
                                  className="w-full flex items-center justify-between text-left"
                                >
                                  <span className="text-[12px] font-medium text-white/60">{step.title}</span>
                                  {expandedAccordion === step.id ? (
                                    <ChevronUp size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
                                  ) : (
                                    <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
                                  )}
                                </button>
                                <AnimatePresence>
                                  {expandedAccordion === step.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pt-3">{step.content}</div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Credential Form ── */}
                  {submitSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl p-6 text-center"
                      style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
                    >
                      <CheckCircle2 size={32} className="mx-auto mb-3" style={{ color: "#22C55E" }} />
                      <p className="text-[14px] font-medium text-white mb-1">Credentials Connected</p>
                      <p className="text-[12px] text-white/40">Your ETA integration is now live. Redirecting…</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1.5 block">ETA Client ID</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            placeholder="e.g., eta-client-xxxxxxxx"
                            className="w-full px-4 py-3 pr-10 rounded-xl text-[13px] text-white placeholder:text-white/15 outline-none transition-all"
                            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                          />
                          {clientId && (
                            <button
                              onClick={() => handleCopy(clientId, "clientId")}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                              style={{ color: "rgba(255,255,255,0.3)" }}
                            >
                              {copiedField === "clientId" ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1.5 block">ETA Client Secret</label>
                        <input
                          type="password"
                          value={clientSecret}
                          onChange={(e) => setClientSecret(e.target.value)}
                          placeholder="Your client secret (shown once by ETA)"
                          className="w-full px-4 py-3 rounded-xl text-[13px] text-white placeholder:text-white/15 outline-none transition-all"
                          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1.5 block">Company Tax ID</label>
                          <input
                            type="text"
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            placeholder="9-10 digit Tax ID"
                            className="w-full px-4 py-3 rounded-xl text-[13px] text-white placeholder:text-white/15 outline-none transition-all"
                            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1.5 block">Environment</label>
                          <select
                            value={environment}
                            onChange={(e) => setEnvironment(e.target.value as "preprod" | "production")}
                            className="w-full px-4 py-3 rounded-xl text-[13px] text-white outline-none transition-all appearance-none"
                            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                          >
                            <option value="preprod" style={{ backgroundColor: "#0a0a0a" }}>Pre-Production</option>
                            <option value="production" style={{ backgroundColor: "#0a0a0a" }}>Production</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={handleSubmitCredentials}
                        disabled={isSubmitting || !clientId || !clientSecret || !taxId}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#FFB000", color: "#000000" }}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            Connecting…
                          </span>
                        ) : (
                          <>Connect & Activate Live <Shield size={13} /></>
                        )}
                      </button>

                      <div className="flex items-center gap-2 justify-center">
                        <Clock size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
                        <p className="text-[10px] text-white/20">Credentials are AES-256-GCM encrypted at rest</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="delegate"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(132,204,22,0.04)", border: "1px solid rgba(132,204,22,0.1)" }}>
                    <div className="flex items-start gap-3">
                      <Users size={18} style={{ color: "#FFB000" }} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[13px] font-medium text-white mb-1">Invite Your Financial Controller</p>
                        <p className="text-[12px] text-white/40 leading-relaxed">
                          Your accountant or CFO can securely provide the ETA credentials on your behalf. They&apos;ll receive a unique magic-link token to enter the keys without accessing your dashboard.
                        </p>
                      </div>
                    </div>
                  </div>

                  {delegateSent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl p-5 text-center"
                      style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
                    >
                      <CheckCircle2 size={28} className="mx-auto mb-3" style={{ color: "#22C55E" }} />
                      <p className="text-[13px] font-medium text-white mb-1">Invitation Sent</p>
                      <p className="text-[11px] text-white/40">Your financial controller will receive a secure link to input the ETA keys.</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1.5 block">
                          <Mail size={10} className="inline mr-1 -mt-px" />
                          Financial Controller&apos;s Email
                        </label>
                        <input
                          type="email"
                          value={delegateEmail}
                          onChange={(e) => setDelegateEmail(e.target.value)}
                          placeholder="accounting@yourcompany.com"
                          className="w-full px-4 py-3 rounded-xl text-[13px] text-white placeholder:text-white/15 outline-none transition-all"
                          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                        />
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] text-white/20 uppercase tracking-wider">or</span>
                      </div>

                      <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1.5 block">
                          <MessageCircle size={10} className="inline mr-1 -mt-px" />
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          value={delegateWhatsApp}
                          onChange={(e) => setDelegateWhatsApp(e.target.value)}
                          placeholder="+20 1XX XXX XXXX"
                          className="w-full px-4 py-3 rounded-xl text-[13px] text-white placeholder:text-white/15 outline-none transition-all"
                          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                        />
                      </div>

                      <button
                        onClick={handleDelegateInvite}
                        disabled={!delegateEmail && !delegateWhatsApp}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#FFB000", color: "#000000" }}
                      >
                        Send Secure Invite <Send size={13} />
                      </button>

                      <p className="text-[10px] text-white/20 text-center">
                        A unique 24-hour magic token will be generated for secure key submission
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
