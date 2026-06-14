"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/layout/brand-logo";
import { BaseRegisterForm } from "@/components/auth/registration/base-register-form";

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <RegisterPage />
    </Suspense>
  );
}

function RegisterSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden p-8 space-y-5">
        <div className="h-6 bg-white/[0.04] rounded w-1/3" />
        <div className="h-12 bg-white/[0.04] rounded" />
        <div className="h-12 bg-white/[0.04] rounded" />
        <div className="h-12 bg-white/[0.04] rounded" />
      </div>
    </div>
  </div>
  );
}

function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sector, setSector] = useState<string | null>(null);

  useEffect(() => {
    const sectorParam = searchParams.get("sector") || searchParams.get("role");
    if (sectorParam) {
      setSector(sectorParam.toLowerCase());
    }
  }, [searchParams]);

  const sectorToRole: Record<string, string> = {
    procurement: "HOTEL",
    cashflow: "SUPPLIER",
    fintech: "FACTORING",
    ai: "LOGISTICS",
    hotel: "HOTEL",
    supplier: "SUPPLIER",
    factoring: "FACTORING",
    logistics: "LOGISTICS",
  };

  const activeRole = sector ? sectorToRole[sector] : null;

  if (!activeRole) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: "#000000" }}>
        <div className="w-full max-w-md text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-8"
          >
            <BrandLogo variant="light" size="md" />
          </motion.div>
          <div className="p-8 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] space-y-4">
            <h2 className="text-xl font-medium text-white">Access Denied</h2>
            <p className="text-sm text-white/40">
              Please select your stakeholder sector from the landing page to begin the correct onboarding process.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all"
              style={{ backgroundColor: "#84cc16", color: "#000000" }}
            >
              Return to Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: "#000000" }}>
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mb-8"
        >
          <BrandLogo variant="light" size="md" />
        </motion.div>

        <BaseRegisterForm role={activeRole} onSuccess={() => {}} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-white/30 mt-6"
        >
          Already have an account?{" "}
          <Link href="/login" className="text-[#84cc16] hover:opacity-80 font-medium transition-opacity">
            Sign in
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
