import { cn } from '../utils'

const BRAND = '#C4602A' // terracotta

// ─── LogoMark ────────────────────────────────────────────────────────────────
// Bold sans-serif "E" + hand-drawn wavy swash below (terracotta).
// Use as the app icon / favicon companion.

interface LogoMarkProps {
  size?: number
  className?: string
}

export function LogoMark({ size = 40, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={cn(className)}
    >
      {/* Bold sans-serif "E" — drawn as paths so it renders identically everywhere */}
      {/* Vertical spine */}
      <rect x="18" y="14" width="9" height="38" rx="1" fill="currentColor" />
      {/* Top arm */}
      <rect x="18" y="14" width="30" height="9" rx="1" fill="currentColor" />
      {/* Middle arm — slightly shorter, centered */}
      <rect x="18" y="30.5" width="24" height="8" rx="1" fill="currentColor" />
      {/* Bottom arm */}
      <rect x="18" y="43" width="30" height="9" rx="1" fill="currentColor" />
      {/* Wavy hand-drawn swash below — terracotta */}
      <path
        d="M14 66 C22 60 30 72 40 65 C50 58 58 70 66 64"
        stroke={BRAND}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

// ─── LogoWordmark ─────────────────────────────────────────────────────────────
// "ESign" wordmark — italic serif "E" in terracotta, "Sign" in current ink,
// with a flowing signature underline flourish in terracotta.
// WORDMARK ONLY — no separate icon precedes it.

interface LogoWordmarkProps {
  height?: number
  className?: string
}

export function LogoWordmark({ height = 28, className }: LogoWordmarkProps) {
  const fontSize = height
  // The flourish SVG sits below the text; scale it proportionally
  const flourishH = Math.round(height * 0.45)
  const flourishMt = Math.round(height * 0.04)

  return (
    <span
      className={cn('inline-flex flex-col leading-none select-none', className)}
      aria-label="ESign"
    >
      {/* Text row */}
      <span style={{ lineHeight: 1, display: 'inline-flex', alignItems: 'baseline' }}>
        {/* Italic serif "E" in terracotta */}
        <span
          style={{
            fontFamily: 'var(--font-display, "Instrument Serif", Georgia, serif)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: fontSize,
            color: BRAND,
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          E
        </span>
        {/* Upright serif "Sign" in current ink */}
        <span
          style={{
            fontFamily: 'var(--font-display, "Instrument Serif", Georgia, serif)',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: fontSize,
            color: 'currentColor',
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          Sign
        </span>
      </span>

      {/* Signature flourish — single flowing pen stroke, flicks up at end */}
      <svg
        viewBox="0 0 120 20"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          width: '100%',
          height: flourishH,
          marginTop: flourishMt,
          display: 'block',
          overflow: 'visible',
        }}
      >
        <path
          d="M2 14 C15 10 35 16 55 12 C75 8 95 15 110 10 C114 9 117 7 118 4"
          stroke={BRAND}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  )
}
