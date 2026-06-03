"use client";

interface Job {
  id: string;
  jobType: string;
  jobName: string;
  status: string;
  squad: string;
  assignedAgent: string | null;
  createdAt: Date;
  durationMs: number | null;
}

interface JobQueueMiniProps {
  jobs: Job[];
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  RUNNING: { bg: "bg-[rgba(52,211,153,0.08)]", text: "text-[#34d399]" },
  COMPLETED: { bg: "bg-[rgba(52,211,153,0.06)]", text: "text-[#34d399]" },
  PENDING: { bg: "bg-[rgba(251,191,36,0.08)]", text: "text-[#fbbf24]" },
  FAILED: { bg: "bg-[rgba(239,68,68,0.08)]", text: "text-[#ef4444]" },
  WAITING_APPROVAL: { bg: "bg-[rgba(245,158,11,0.08)]", text: "text-[#f59e0b]" },
  SCHEDULED: { bg: "bg-[rgba(6,182,212,0.08)]", text: "text-[#06b6d4]" },
};

export function JobQueueMini({ jobs }: JobQueueMiniProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[11px] text-[rgba(255,255,255,0.25)]">No jobs in queue</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {jobs.map((job) => {
        const style = STATUS_STYLES[job.status] || { bg: "bg-white/[0.03]", text: "text-[rgba(255,255,255,0.40)]" };
        return (
          <div
            key={job.id}
            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.bg.replace("bg-", "bg-").replace("]", "")}`} style={{ backgroundColor: style.text.includes("34d399") ? "#34d399" : style.text.includes("fbbf24") ? "#fbbf24" : style.text.includes("ef4444") ? "#ef4444" : style.text.includes("f59e0b") ? "#f59e0b" : style.text.includes("06b6d4") ? "#06b6d4" : "rgba(255,255,255,0.20)" }} />
              <div className="min-w-0">
                <p className="text-[11px] text-white truncate">{job.jobName}</p>
                <p className="text-[9px] text-[rgba(255,255,255,0.25)]">
                  {job.squad} • {job.assignedAgent}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
                {job.status}
              </span>
              <span className="text-[9px] text-[rgba(255,255,255,0.20)] font-mono w-12 text-right">
                {job.durationMs ? `${(job.durationMs / 1000).toFixed(1)}s` : "—"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
