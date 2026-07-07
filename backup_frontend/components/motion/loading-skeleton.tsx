"use client";

interface LoadingSkeletonProps {
  /** Number of skeleton rows to render (default: 4) */
  rows?: number;
  /** Number of columns per row (default: 3) */
  columns?: number;
  /** Additional Tailwind classes for the container */
  className?: string;
}

/**
 * Glassmorphism skeleton loader with a shimmer sweep animation.
 *
 * Uses a CSS @keyframes shimmer for the gradient sweep effect,
 * keeping the animation performant without JavaScript interpolation.
 * Styled to match the obsidian + glassmorphism dark theme.
 */
export function LoadingSkeleton({
  rows = 4,
  columns = 3,
  className = "",
}: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          animation: shimmer 1.5s infinite ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-shimmer {
            animation: none;
          }
        }
      `}</style>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-3 items-center rounded-xl overflow-hidden backdrop-blur-md bg-white/[0.03] border border-white/[0.06] px-4 py-3"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="relative flex-1 h-4 rounded-md bg-white/[0.06] overflow-hidden"
            >
              <div
                className="absolute inset-0 skeleton-shimmer"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
