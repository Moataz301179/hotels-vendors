"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Users } from "lucide-react";

export default function LeadsPage() {
  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <PageHeader
        title="Lead Tracking"
        description="Pipeline management and lead scoring"
      />
      <SectionCard title="Lead Pipeline" description="CRM integration coming soon">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-500)]/10 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-[var(--accent-400)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Lead Tracking</h3>
          <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-md">
            Lead scoring, pipeline stages, and automated nurture sequences are being calibrated by the Marketing Agent.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
