import { cn } from '../utils'

const BRAND = '#C4602A'

// ─── LogoMark ────────────────────────────────────────────────────────────────
// Bold sans "E" (Geist 700) over a hand-drawn terracotta swash.
// SVG paths taken directly from the design file.

interface LogoMarkProps {
  size?: number
  className?: string
}

export function LogoMark({ size = 40, className }: LogoMarkProps) {
  // Original viewBox: 120×92 — preserve aspect ratio
  const width = Math.round(size * (120 / 92))
  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 120 92"
      fill="none"
      aria-hidden="true"
      className={cn(className)}
    >
      <text
        x="22"
        y="58"
        fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fontSize="62"
        fill="currentColor"
        letterSpacing="-2"
      >
        E
      </text>
      {/* Hand-drawn wavy swash — terracotta */}
      <path
        d="M16 74 C34 64 48 84 64 74 S94 64 104 76"
        stroke={BRAND}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

// ─── LogoWordmark ─────────────────────────────────────────────────────────────
// Instrument Serif: italic "E" in terracotta + upright "Sign" in ink.
// Two-part flourish: main sweep + flick at end.
// WORDMARK ONLY — no separate icon.

interface LogoWordmarkProps {
  height?: number
  className?: string
}

export function LogoWordmark({ height = 28, className }: LogoWordmarkProps) {
  // Original viewBox: 300×120 — scale by height
  const width = Math.round(height * (300 / 120))
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 120"
      fill="none"
      aria-label="ESign"
      className={cn(className)}
    >
      <text
        x="20"
        y="78"
        fontFamily="'Instrument Serif', Georgia, serif"
        fontSize="76"
        letterSpacing="-1.5"
      >
        <tspan fontStyle="italic" fill={BRAND}>E</tspan>
        {/* currentColor → adapts to light/dark background */}
        <tspan fill="currentColor">Sign</tspan>
      </text>
      {/* Main flourish sweep */}
      <path
        d="M24 96 C70 84 120 104 168 92 C210 82 250 86 276 100"
        stroke={BRAND}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Flick up at the end */}
      <path
        d="M276 100 C284 103 286 98 282 94"
        stroke={BRAND}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
