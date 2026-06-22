export function RfqRoutingIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Central hub */}
      <circle cx="40" cy="40" r="8" stroke="#FF6B00" strokeWidth="1.5" fill="none" />
      <circle cx="40" cy="40" r="3" fill="#FF6B00" opacity="0.6" />

      {/* Outer ring */}
      <circle cx="40" cy="40" r="24" stroke="#FF6B00" strokeWidth="0.75" fill="none" opacity="0.3" />
      <circle cx="40" cy="40" r="32" stroke="#FF6B00" strokeWidth="0.5" fill="none" opacity="0.15" />

      {/* Node 1 — top */}
      <rect x="34" y="8" width="12" height="8" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.5" />
      {/* Node 2 — bottom-left */}
      <rect x="8" y="50" width="12" height="8" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.5" />
      {/* Node 3 — bottom-right */}
      <rect x="60" y="50" width="12" height="8" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.5" />
      {/* Node 4 — left */}
      <rect x="6" y="26" width="12" height="8" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.4" />
      {/* Node 5 — right */}
      <rect x="62" y="26" width="12" height="8" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.4" />

      {/* Connection lines with directional arrows */}
      <path d="M40 32 L40 18" stroke="#FF6B00" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
      <path d="M35 22 L40 16 L45 22" stroke="#FF6B00" strokeWidth="0.75" fill="none" opacity="0.5" />

      <path d="M33 35 L16 52" stroke="#FF6B00" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
      <path d="M18 48 L12 54 L20 56" stroke="#FF6B00" strokeWidth="0.75" fill="none" opacity="0.5" />

      <path d="M47 35 L64 52" stroke="#FF6B00" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
      <path d="M62 48 L68 54 L60 56" stroke="#FF6B00" strokeWidth="0.75" fill="none" opacity="0.5" />

      <path d="M30 34 L14 30" stroke="#FF6B00" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.5" />
      <path d="M50 34 L66 30" stroke="#FF6B00" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.5" />

      {/* Pulse animation ring */}
      <circle cx="40" cy="40" r="8" stroke="#FF6B00" strokeWidth="0.5" fill="none" opacity="0.3">
        <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
