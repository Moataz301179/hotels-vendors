"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { CalendarDays } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <PageHeader
        title="Content Calendar"
        description="Schedule and manage content across all channels"
      />
      <SectionCard title="Publishing Schedule" description="Editorial calendar coming soon">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-500)]/10 flex items-center justify-center mb-4">
            <CalendarDays className="w-8 h-8 text-[var(--accent-400)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Content Calendar</h3>
          <p className="text-sm text-[var(--foreground-secondary)] mt-2 max-w-md">
            The Social Media Director is organizing the editorial pipeline. 
            Drag-and-drop scheduling, multi-channel publishing, and approval workflows coming soon.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
