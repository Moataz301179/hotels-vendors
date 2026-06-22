export function ProcurementMatchingIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Left column — Hotel demands */}
      <rect x="4" y="10" width="22" height="10" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.4" />
      <rect x="8" y="14" width="14" height="3" rx="1" fill="#ffffff" opacity="0.2" />

      <rect x="4" y="26" width="22" height="10" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.35" />
      <rect x="8" y="30" width="10" height="3" rx="1" fill="#ffffff" opacity="0.15" />

      <rect x="4" y="42" width="22" height="10" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.3" />
      <rect x="8" y="46" width="16" height="3" rx="1" fill="#ffffff" opacity="0.18" />

      <rect x="4" y="58" width="22" height="10" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.25" />
      <rect x="8" y="62" width="12" height="3" rx="1" fill="#ffffff" opacity="0.12" />

      {/* Right column — Supplier capabilities */}
      <rect x="54" y="10" width="22" height="10" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.4" />
      <rect x="58" y="14" width="14" height="3" rx="1" fill="#ffffff" opacity="0.2" />

      <rect x="54" y="26" width="22" height="10" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.3" />
      <rect x="58" y="30" width="12" height="3" rx="1" fill="#ffffff" opacity="0.15" />

      <rect x="54" y="42" width="22" height="10" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.35" />
      <rect x="58" y="46" width="16" height="3" rx="1" fill="#ffffff" opacity="0.18" />

      <rect x="54" y="58" width="22" height="10" rx="2" stroke="#ffffff" strokeWidth="0.75" fill="none" opacity="0.25" />
      <rect x="58" y="62" width="10" height="3" rx="1" fill="#ffffff" opacity="0.12" />

      {/* Center matching engine */}
      <rect x="30" y="28" width="20" height="24" rx="4" stroke="#FF6B00" strokeWidth="1.2" fill="none" opacity="0.5" />
      <text x="40" y="38" textAnchor="middle" fill="#FF6B00" fontSize="4" opacity="0.7" fontFamily="monospace">MATCH</text>
      <text x="40" y="44" textAnchor="middle" fill="#FF6B00" fontSize="3.5" opacity="0.5" fontFamily="monospace">ENGINE</text>

      {/* Animated pulse */}
      <rect x="30" y="28" width="20" height="24" rx="4" stroke="#FF6B00" strokeWidth="0.5" fill="none" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
      </rect>

      {/* Matching lines — Hotel 1 → Supplier 1 (strong match) */}
      <path d="M26 15 L30 32" stroke="#FF6B00" strokeWidth="1" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M50 15 L50 32" stroke="#FF6B00" strokeWidth="1" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </path>

      {/* Matching lines — Hotel 2 → Supplier 3 */}
      <path d="M26 31 L30 40" stroke="#FF6B00" strokeWidth="0.75" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M50 47 L50 44" stroke="#FF6B00" strokeWidth="0.75" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
      </path>

      {/* Matching lines — Hotel 3 → Supplier 2 */}
      <path d="M26 47 L30 48" stroke="#FF6B00" strokeWidth="0.75" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.7;0.35" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M50 31 L50 40" stroke="#FF6B00" strokeWidth="0.75" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.7;0.35" dur="3s" repeatCount="indefinite" />
      </path>

      {/* Matching lines — Hotel 4 → Supplier 4 (weak match) */}
      <path d="M26 63 L30 50" stroke="#ffffff" strokeWidth="0.5" opacity="0.2" strokeDasharray="2 2" />
      <path d="M50 63 L50 52" stroke="#ffffff" strokeWidth="0.5" opacity="0.2" strokeDasharray="2 2" />

      {/* Score indicators */}
      <circle cx="34" cy="24" r="2" fill="#22C55E" opacity="0.6">
        <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="46" cy="24" r="2" fill="#22C55E" opacity="0.6">
        <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
