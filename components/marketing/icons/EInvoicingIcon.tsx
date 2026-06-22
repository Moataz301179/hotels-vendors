export function EInvoicingIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Document body */}
      <rect x="18" y="12" width="44" height="56" rx="3" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.3" />

      {/* Document lines */}
      <line x1="24" y1="22" x2="56" y2="22" stroke="#ffffff" strokeWidth="0.75" opacity="0.4" />
      <line x1="24" y1="28" x2="48" y2="28" stroke="#ffffff" strokeWidth="0.75" opacity="0.3" />
      <line x1="24" y1="34" x2="52" y2="34" stroke="#ffffff" strokeWidth="0.75" opacity="0.3" />
      <line x1="24" y1="40" x2="44" y2="40" stroke="#ffffff" strokeWidth="0.75" opacity="0.25" />

      {/* Stamp / seal */}
      <circle cx="46" cy="52" r="10" stroke="#FF6B00" strokeWidth="1.2" fill="none" opacity="0.6" />
      <circle cx="46" cy="52" r="6" stroke="#FF6B00" strokeWidth="0.75" fill="none" opacity="0.4" />

      {/* Checkmark in stamp */}
      <path d="M42 52 L45 55 L51 48" stroke="#FF6B00" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* UUID barcode lines */}
      <line x1="24" y1="46" x2="36" y2="46" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
      <line x1="24" y1="48" x2="33" y2="48" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
      <line x1="24" y1="50" x2="38" y2="50" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
      <line x1="24" y1="52" x2="30" y2="52" stroke="#ffffff" strokeWidth="0.5" opacity="0.35" />
      <line x1="24" y1="54" x2="35" y2="54" stroke="#ffffff" strokeWidth="0.5" opacity="0.25" />

      {/* Connection arrows — submission pipeline */}
      <path d="M18 20 L8 14" stroke="#FF6B00" strokeWidth="0.75" opacity="0.4" />
      <path d="M8 14 L8 8" stroke="#FF6B00" strokeWidth="0.75" opacity="0.4" />
      <rect x="2" y="2" width="12" height="6" rx="1.5" stroke="#FF6B00" strokeWidth="0.75" fill="none" opacity="0.5">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
      </rect>
      <text x="8" y="6.5" textAnchor="middle" fill="#FF6B00" fontSize="3.5" opacity="0.7" fontFamily="monospace">ETA</text>

      {/* Validation feedback */}
      <path d="M62 20 L72 14" stroke="#FF6B00" strokeWidth="0.75" opacity="0.4" />
      <path d="M72 14 L72 8" stroke="#FF6B00" strokeWidth="0.75" opacity="0.4" />
      <rect x="66" y="3" width="12" height="6" rx="1.5" stroke="#22C55E" strokeWidth="0.75" fill="none" opacity="0.5">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" begin="1.5s" repeatCount="indefinite" />
      </rect>
      <path d="M68 6 L70 8 L74 4" stroke="#22C55E" strokeWidth="0.75" fill="none" opacity="0.7" strokeLinecap="round" />

      {/* Flow direction arrows on connection */}

      {/* Digital signature wave */}
      <path d="M24 62 C28 58, 32 66, 36 62 C40 58, 44 66, 48 62" stroke="#FF6B00" strokeWidth="0.75" fill="none" opacity="0.4" strokeDasharray="2 1">
        <animate attributeName="stroke-dashoffset" values="0;-6" dur="1.5s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}
