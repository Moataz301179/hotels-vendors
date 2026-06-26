"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Megaphone } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <PageHeader
        title="Campaigns"
        description="Create, manage, and optimize marketing campaigns"
      />
      <SectionCard title="Campaign Manager" description="Full campaign orchestration coming soon">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-500)]/10 flex items-center justify-center mb-4">
            <Megaphone className="w-8 h-8 text-[var(--accent-400)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Campaign Manager</h3>
          <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-md">
            The Marketing Agent is configuring campaign templates. 
            This module will launch with audience segmentation, A/B testing, and budget optimization.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
