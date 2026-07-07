"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Share2 } from "lucide-react";

export default function SocialPage() {
  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <PageHeader
        title="Social Media"
        description="Manage presence across LinkedIn, Instagram, and Facebook"
      />
      <SectionCard title="Social Command" description="Cross-platform management coming soon">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-500)]/10 flex items-center justify-center mb-4">
            <Share2 className="w-8 h-8 text-[var(--accent-400)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Social Media Director</h3>
          <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-md">
            The Social Media Director is setting up cross-platform publishing, sentiment monitoring, and engagement analytics.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
