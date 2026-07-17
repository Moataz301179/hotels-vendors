"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <PageHeader
        title="Analytics"
        description="Campaign performance, attribution, and ROI insights"
      />
      <SectionCard title="Performance Dashboard" description="Advanced analytics coming soon">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-500)]/10 flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-[var(--accent-400)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Marketing Analytics</h3>
          <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-md">
            Attribution modeling, cohort analysis, and channel ROI reporting are being configured by the Marketing Agent.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
