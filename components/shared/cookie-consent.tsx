"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "hv_cookie_consent";

interface CookieConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

const CURRENT_VERSION = "1.0";

function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CURRENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function storeConsent(consent: CookieConsent) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  // Also send to server for logging
  fetch("/api/v1/user/consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(consent),
  }).catch(() => {
    // Non-blocking — consent is already stored locally
  });
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const consent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION,
    };
    storeConsent(consent);
    setVisible(false);
  };

  const acceptSelected = () => {
    const consent: CookieConsent = {
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION,
    };
    storeConsent(consent);
    setVisible(false);
  };

  const rejectAll = () => {
    const consent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION,
    };
    storeConsent(consent);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-[#12121a]/95 backdrop-blur-xl p-6 shadow-2xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-[15px] font-semibold text-white mb-1">Cookie Preferences</h3>
            <p className="text-[13px] text-white/40 leading-relaxed">
              We use cookies to provide essential platform functionality, analyze usage, and improve
              your experience. You can customize your preferences below. Necessary cookies cannot be
              disabled as they are required for the platform to function.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[13px] font-medium text-white/70">Necessary</span>
                <p className="text-[11px] text-white/30">Required for authentication and security</p>
              </div>
              <input
                type="checkbox"
                checked
                disabled
                className="h-4 w-4 rounded border-white/20 bg-white/[0.03] text-[#39ff7e]"
              />
            </label>
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <span className="text-[13px] font-medium text-white/70">Analytics</span>
                <p className="text-[11px] text-white/30">Help us understand how you use the platform</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/[0.03] text-[#39ff7e] focus:ring-[#39ff7e]/20"
              />
            </label>
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <span className="text-[13px] font-medium text-white/70">Marketing</span>
                <p className="text-[11px] text-white/30">Personalized recommendations and promotions</p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/[0.03] text-[#39ff7e] focus:ring-[#39ff7e]/20"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={rejectAll}
              className="px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-[13px] font-medium text-white/50 hover:text-white/70 hover:border-white/[0.12] transition-all"
            >
              Reject All
            </button>
            <button
              onClick={acceptSelected}
              className="px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] text-[13px] font-medium text-white/50 hover:text-white/70 hover:border-white/[0.12] transition-all"
            >
              Accept Selected
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 rounded-xl bg-[#39ff7e] text-[13px] font-semibold text-[#07090f] hover:shadow-[0_0_20px_rgba(57,255,126,0.15)] transition-all"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function hasAnalyticsConsent(): boolean {
  const consent = getStoredConsent();
  return consent?.analytics ?? false;
}

export function hasMarketingConsent(): boolean {
  const consent = getStoredConsent();
  return consent?.marketing ?? false;
}
