"use client";

interface Step {
  label: string;
  count?: number | string;
}

interface PipelineStepsProps {
  steps: Step[];
  activeIndex: number; // 0-based, the current active step
  className?: string;
}

export function PipelineSteps({ steps, activeIndex, className = "" }: PipelineStepsProps) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        const isFuture = index > activeIndex;

        return (
          <div key={step.label} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className="absolute top-[10px] left-[calc(50%+14px)] right-[calc(-50%+14px)] h-[1px]"
                style={{
                  background: isCompleted
                    ? "rgba(255,255,255,0.20)"
                    : "rgba(255,255,255,0.06)",
                }}
              />
            )}

            {/* Dot */}
            <div
              className={`relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center border transition-all duration-300 ${
                isCompleted
                  ? "bg-white border-white"
                  : isActive
                  ? "bg-[#022349] border-[#022349] shadow-[0_0_12px_rgba(2,35,73,0.50)]"
                  : "bg-transparent border-[rgba(255,255,255,0.15)]"
              }`}
            >
              {isCompleted && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5.5L3.5 7.5L8.5 2.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {isActive && (
                <span className="w-[6px] h-[6px] rounded-full bg-white" />
              )}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-[10px] font-medium uppercase tracking-wider text-center ${
                isActive ? "text-white" : "text-[rgba(255,255,255,0.35)]"
              }`}
            >
              {step.label}
            </span>

            {/* Count */}
            {step.count !== undefined && (
              <span
                className={`mt-0.5 text-xs font-semibold metric-value ${
                  isActive ? "text-white" : "text-[rgba(255,255,255,0.25)]"
                }`}
              >
                {step.count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
