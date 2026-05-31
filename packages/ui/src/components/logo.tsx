import { cn } from '../utils'

// ─────────────────────────────────────────────────────────────────────────────
// Colour tokens — hardcoded so the mark renders correctly on any background
// without requiring CSS-variable support in the SVG context.
// Text uses currentColor so it inherits `text-ink` / `text-ink-inverse` etc.
// Pass variant="light" when placing on dark backgrounds to flip the text colour.
// ─────────────────────────────────────────────────────────────────────────────
const BRAND = '#C4602A'   // oklch(0.665 0.155 38) — terracotta

interface LogoMarkProps {
  /** Size in pixels (applied to both width and height). Default: 32 */
  size?: number
  /** Override the mark colour. Defaults to brand terracotta. */
  color?: string
  className?: string
}

/**
 * LogoMark — "Signed E" logomark.
 *
 * Geometric E letterform whose middle arm shortens and lifts (the gesture a
 * hand makes when signing off), plus a signature flourish curling off the
 * bottom arm. Single solid colour — pass `color` to override.
 */
export function LogoMark({ size = 32, color = BRAND, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn(className)}
    >
      {/* Vertical spine */}
      <path
        d="M16 12 V52"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top arm */}
      <path
        d="M16 12 H46"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Middle arm — shortened and slightly lifted (signature gesture) */}
      <path
        d="M16 32 L40 27"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom arm */}
      <path
        d="M16 52 H48"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Signature flourish — sweeps right and curls up off the bottom arm */}
      <path
        d="M48 52 C54 52 58 48 56 42"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

interface LogoWordmarkProps {
  /**
   * "light" — text in white (for dark backgrounds)
   * "dark"  — text in dark ink (default, for light backgrounds)
   */
  variant?: 'light' | 'dark'
  /** Height in pixels. Width scales proportionally. Default: 28 */
  height?: number
  className?: string
}

/**
 * LogoWordmark — "ESign" logotype with underline flourish.
 *
 * Composed of the LogoMark + the "ESign" wordmark text + a thin curved
 * underline flourish in brand terracotta.
 *
 * Use `variant="light"` when placed on dark/brand backgrounds.
 */
export function LogoWordmark({ variant = 'dark', height = 28, className }: LogoWordmarkProps) {
  const textColor = variant === 'light' ? '#F9F5EE' : '#2C2420'
  // Scale mark size relative to height
  const markSize = Math.round(height * 0.9)

  return (
    <span
      className={cn('inline-flex items-center gap-2 leading-none select-none', className)}
      aria-label="ESign"
    >
      <LogoMark size={markSize} />
      <span className="relative inline-flex flex-col leading-none">
        {/* Wordmark text */}
        <span
          style={{
            fontFamily: 'var(--font-display, "Geist", system-ui, sans-serif)',
            fontWeight: 700,
            fontSize: height,
            letterSpacing: '-0.025em',
            color: textColor,
            lineHeight: 1,
          }}
        >
          ESign
        </span>
        {/* Underline flourish */}
        <svg
          viewBox="0 0 76 10"
          fill="none"
          aria-hidden="true"
          style={{
            width: '100%',
            height: Math.max(6, Math.round(height * 0.32)),
            marginTop: Math.round(height * 0.1),
            overflow: 'visible',
          }}
        >
          <path
            d="M2 7 C18 3 50 9 74 4"
            stroke={BRAND}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </span>
    </span>
  )
}
