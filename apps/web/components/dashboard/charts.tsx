'use client'

import type { StatusSlice } from './data'

interface LineChartProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  areaColor?: string
}

const PAD = { top: 18, right: 18, bottom: 28, left: 36 }

export function LineChart({
  data,
  width = 760,
  height = 240,
  color = 'var(--color-brand)',
  areaColor = 'var(--color-brand-soft)',
}: LineChartProps) {
  const innerW = width - PAD.left - PAD.right
  const innerH = height - PAD.top - PAD.bottom
  const max = Math.max(...data) * 1.15
  const min = 0
  const xAt = (i: number) => PAD.left + (i / (data.length - 1)) * innerW
  const yAt = (v: number) => PAD.top + innerH - ((v - min) / (max - min)) * innerH

  // Smooth Catmull-Rom → Bezier
  const pts = data.map((v, i) => [xAt(i), yAt(v)] as const)
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`
  }
  const area = `${d} L ${pts[pts.length - 1][0]} ${PAD.top + innerH} L ${pts[0][0]} ${PAD.top + innerH} Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(min + (max - min) * p))
  const xLabels = data.map((_, i) => i).filter((i) => i % 5 === 0 || i === data.length - 1)

  const lastIdx = data.length - 1
  const lastX = xAt(lastIdx)
  const lastY = yAt(data[lastIdx])

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full">
      {yTicks.map((v, i) => {
        const y = yAt(v)
        return (
          <g key={i}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={y}
              y2={y}
              stroke="var(--color-border-subtle)"
              strokeWidth={1}
              strokeDasharray={i === 0 ? '0' : '2 4'}
            />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-ink-faint)">
              {v}
            </text>
          </g>
        )
      })}

      <path d={area} fill={areaColor} opacity={0.55} />
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {xLabels.map((i) => (
        <text
          key={i}
          x={xAt(i)}
          y={height - PAD.bottom + 16}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="var(--color-ink-subtle)"
        >
          Mar {i + 1}
        </text>
      ))}

      <circle cx={lastX} cy={lastY} r={3.5} fill={color} stroke="var(--color-surface)" strokeWidth={2} />
      <g transform={`translate(${lastX - 18} ${lastY - 30})`}>
        <rect width={36} height={20} rx={4} fill="var(--color-ink)" />
        <text x={18} y={14} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="500" fill="var(--color-ink-inverse)">
          {data[lastIdx]}
        </text>
      </g>
    </svg>
  )
}

interface DonutChartProps {
  slices: StatusSlice[]
  size?: number
  thickness?: number
  highlight?: string | null
  centerLabel?: string
  centerSub?: string
}

export function DonutChart({
  slices,
  size = 160,
  thickness = 22,
  highlight = null,
  centerLabel,
  centerSub,
}: DonutChartProps) {
  const R = size / 2
  const r = R - thickness / 2
  const c = 2 * Math.PI * r
  const total = slices.reduce((s, x) => s + x.count, 0)
  const gapDeg = 1.4
  let offsetDeg = -90

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }} className="block">
      <circle cx={R} cy={R} r={r} fill="none" stroke="var(--color-surface-sunken)" strokeWidth={thickness} />
      {slices.map((s) => {
        const portion = s.count / total
        const arcDeg = portion * 360 - gapDeg
        const arc = (arcDeg / 360) * c
        const dasharray = `${arc} ${c - arc}`
        const offset = -((offsetDeg + 90) / 360) * c
        const dim = highlight && s.key !== highlight
        const isHi = highlight && s.key === highlight
        offsetDeg += portion * 360
        return (
          <circle
            key={s.key}
            cx={R}
            cy={R}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={isHi ? thickness + 4 : thickness}
            strokeDasharray={dasharray}
            strokeDashoffset={offset}
            opacity={dim ? 0.18 : 1}
            transform={`rotate(-90 ${R} ${R})`}
            style={{ transition: 'opacity .2s, stroke-width .2s' }}
          />
        )
      })}
      {centerLabel && (
        <text
          x={R}
          y={R - 2}
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="22"
          fontWeight="600"
          fill="var(--color-ink)"
          style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
        >
          {centerLabel}
        </text>
      )}
      {centerSub && (
        <text x={R} y={R + 16} textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fill="var(--color-ink-subtle)">
          {centerSub}
        </text>
      )}
    </svg>
  )
}

export function DonutLegend({
  slices,
  highlight = null,
}: {
  slices: StatusSlice[]
  highlight?: string | null
}) {
  const total = slices.reduce((s, x) => s + x.count, 0)
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {slices.map((s) => {
        const dim = highlight && s.key !== highlight
        const isHi = highlight && s.key === highlight
        return (
          <li
            key={s.key}
            className="flex items-center gap-2.5 transition-opacity"
            style={{ opacity: dim ? 0.5 : 1 }}
          >
            <span
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{
                background: s.color,
                boxShadow: isHi ? `0 0 0 2px var(--color-surface), 0 0 0 3.5px ${s.color}` : 'none',
              }}
            />
            <span
              className="flex-1 text-sm"
              style={{ color: isHi ? 'var(--color-ink)' : 'var(--color-ink-muted)', fontWeight: isHi ? 600 : 500 }}
            >
              {s.label}
            </span>
            <span className="font-mono text-xs tabular-nums text-ink-muted">{s.count}</span>
            <span className="min-w-[30px] text-right font-mono text-[11px] tabular-nums text-ink-faint">
              {Math.round((s.count / total) * 100)}%
            </span>
          </li>
        )
      })}
    </ul>
  )
}
