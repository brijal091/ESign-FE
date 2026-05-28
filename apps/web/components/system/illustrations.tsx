// Bespoke system-state illustrations from the Paraph design (09/10).

export function Illust404() {
  return (
    <div className="relative grid h-[200px] w-[320px] place-items-center">
      <div
        className="absolute inset-0 grid select-none place-items-center font-display italic leading-none text-surface-sunken"
        style={{ fontSize: 200, letterSpacing: '-0.04em' }}
      >
        404
      </div>
      <svg width="320" height="200" viewBox="0 0 320 200" className="relative">
        <path d="M 28 168 Q 80 140, 130 152 T 232 110" stroke="var(--color-border-strong)" strokeWidth="2" fill="none" strokeDasharray="2 6" strokeLinecap="round" />
        <g stroke="var(--color-ink-faint)" strokeWidth="1.5" strokeLinecap="round">
          <line x1="24" y1="164" x2="32" y2="172" />
          <line x1="32" y1="164" x2="24" y2="172" />
        </g>
        <g transform="translate(180,46) rotate(14)">
          <rect x="0" y="0" width="84" height="104" rx="2" fill="var(--color-surface)" stroke="var(--color-border-strong)" strokeWidth="1.5" filter="drop-shadow(0 4px 10px oklch(0.21 0.018 60 / 0.10))" />
          <line x1="10" y1="22" x2="74" y2="22" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
          <line x1="10" y1="32" x2="64" y2="32" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
          <line x1="10" y1="42" x2="70" y2="42" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
          <line x1="10" y1="52" x2="50" y2="52" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
          <line x1="10" y1="86" x2="50" y2="86" stroke="var(--color-ink)" strokeWidth="1.5" />
          <text x="60" y="82" fontFamily="var(--font-display)" fontStyle="italic" fontSize="22" fill="var(--color-brand)">?</text>
        </g>
      </svg>
    </div>
  )
}

export function Illust500() {
  return (
    <div className="relative grid h-[180px] w-[220px] place-items-center">
      <svg width="220" height="180" viewBox="0 0 220 180">
        <circle cx="110" cy="90" r="68" fill="none" stroke="var(--color-border)" strokeWidth="1.4" strokeDasharray="2 6" />
        <g transform="translate(48,26) rotate(-8)">
          <path d="M 0 0 L 56 0 L 50 18 L 58 36 L 48 54 L 56 72 L 46 90 L 54 108 L 0 108 Z" fill="var(--color-surface)" stroke="var(--color-border-strong)" strokeWidth="1.5" filter="drop-shadow(0 4px 8px oklch(0.21 0.018 60 / 0.10))" />
          <line x1="10" y1="22" x2="42" y2="22" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
          <line x1="10" y1="34" x2="36" y2="34" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
          <line x1="10" y1="58" x2="40" y2="58" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
          <line x1="10" y1="70" x2="32" y2="70" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
        </g>
        <g transform="translate(118,38) rotate(10)">
          <path d="M 6 0 L 60 0 L 60 108 L 16 108 L 24 90 L 14 72 L 22 54 L 12 36 L 20 18 Z" fill="var(--color-surface-raised)" stroke="var(--color-border-strong)" strokeWidth="1.5" filter="drop-shadow(0 4px 8px oklch(0.21 0.018 60 / 0.10))" />
          <line x1="28" y1="22" x2="54" y2="22" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
          <line x1="22" y1="34" x2="50" y2="34" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
          <line x1="26" y1="58" x2="54" y2="58" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
          <line x1="22" y1="70" x2="48" y2="70" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6" />
        </g>
        <g fill="var(--color-border-strong)">
          <rect x="106" y="60" width="3" height="3" rx="0.5" transform="rotate(20 107 61)" />
          <rect x="100" y="84" width="2" height="4" rx="0.5" transform="rotate(-12 101 86)" />
          <rect x="116" y="112" width="3" height="2" rx="0.5" />
          <rect x="98" y="124" width="2" height="2" rx="0.5" />
        </g>
        <g stroke="var(--color-danger)" strokeWidth="1.5" strokeLinecap="round">
          <line x1="108" y1="50" x2="108" y2="40" />
          <line x1="102" y1="56" x2="94" y2="50" />
          <line x1="116" y1="56" x2="124" y2="50" />
        </g>
      </svg>
    </div>
  )
}
