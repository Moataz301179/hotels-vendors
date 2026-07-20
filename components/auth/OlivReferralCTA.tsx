"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { ChevronRight, CheckCircle2 } from "lucide-react";

interface OlivReferralCTAProps {
  userId: string;
  userType: "HOTEL" | "SUPPLIER";
  onOlivComplete?: () => void;
}

export default function OlivReferralCTA({
  userId,
  userType,
  onOlivComplete,
}: OlivReferralCTAProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleOlivClick = async () => {
    // 1. Notify backend of Oliv referral initiation
    await fetch("/api/v1/referrals/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        userType,
        referralCode: "CHV000",
        redirectUri: `${window.location.origin}/oliv/callback`,
      }),
    });

    // 2. Redirect to Oliv Finance with hardened parameters
    const olivUrl = new URL("https://oliv.finance/onboard");
    olivUrl.searchParams.set("ref", "CHV000");
    olivUrl.searchParams.set("hv_user_id", userId);
    olivUrl.searchParams.set("hv_user_type", userType);
    olivUrl.searchParams.set(
      "redirect_uri",
      `${window.location.origin}/oliv/callback`
    );

    window.location.href = olivUrl.toString();
  };

  return (
    <div className="mt-8 pt-6 border-t border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">
        Unlock Instant Financing via Oliv
      </h3>
      <div className="flex flex-col items-center">
        {/* Oliv Integration Badges */}
        <div className="flex items-center gap-6 mb-4">
          <div className="text-center">
            <img
              src="/images/logo-hotels-vendors.png"
              alt="Hotels Vendors"
              className="h-10 mb-1"
            />
            <span className="text-xs text-white/60">HotelsVendors</span>
          </div>
          <div className="text-center">
            <img
              src="https://oliv.finance/logo.svg"
              alt="Oliv Finance"
              className="h-10 mb-1"
            />
            <span className="text-xs text-white/60">Oliv Finance</span>
          </div>
        </div>

        {/* Referral Code Display */}
        <div className="bg-[#39ff7e]/10 px-4 py-2 rounded-md text-sm text-white/80 mb-3">
          Referral Code: <span className="font-mono text-white">CHV000</span>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleOlivClick}
          disabled={!session}
          className="w-full max-w-xs bg-[#39ff7e] hover:bg-[#32cd32] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {session
            ? "Connect to Oliv Finance"
            : "Sign in to Continue"}
        </button>

        {/* Secondary Text */}
        <p className="mt-3 text-xs text-white/60">
          Get up to 10M EGP credit line • Approval in 24h •{" "}
          <span className="underline">Learn how it works</span>
        </p>
      </div>
    </div>
  );
}