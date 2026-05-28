'use client'

import { ArrowDownRight, ArrowUpRight, Calendar, Minus } from 'lucide-react'
import { cn } from '@esign/ui'

type DeltaTone = 'success' | 'warning' | 'danger' | 'muted'

const TONE: Record<DeltaTone, string> = {
  success: 'bg-success-soft text-success-strong',
  warning: 'bg-warning-soft text-warning-strong',
  danger: 'bg-danger-soft text-danger-strong',
  muted: 'bg-surface-sunken text-ink-muted',
}

export function DeltaBadge({ value, tone = 'muted' }: { value: string; tone?: DeltaTone }) {
  const dir = /^[+↑]/.test(value) ? 'up' : /^[-−↓]/.test(value) ? 'down' : 'flat'
  const Icon = dir === 'up' ? ArrowUpRight : dir === 'down' ? ArrowDownRight : Minus
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full py-0.5 pl-1.5 pr-2 text-xs font-medium tabular-nums leading-snug',
        TONE[tone],
      )}
    >
      <Icon className="size-3" strokeWidth={2} />
      {value}
    </span>
  )
}

export interface KpiCardProps {
  label: string
  value: string
  delta: string
  deltaTone: DeltaTone
  deltaSuffix?: string
}

export function KpiCard({ label, value, delta, deltaTone, deltaSuffix }: KpiCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-md border border-border bg-surface px-5 pb-5 pt-[18px] shadow-[var(--shadow-1)]">
      <div className="text-sm font-medium text-ink-muted">{label}</div>
      <div className="text-[32px] font-semibold leading-none tracking-tight tabular-nums text-ink">{value}</div>
      <div className="-mt-0.5 flex items-center gap-2">
        <DeltaBadge value={delta} tone={deltaTone} />
        {deltaSuffix ? <span className="text-xs text-ink-subtle">{deltaSuffix}</span> : null}
      </div>
    </div>
  )
}

const RANGE_ITEMS = ['Today', '7 days', '30 days', '90 days', 'Custom']

export function RangeTabs({
  active = '30 days',
  onChange,
}: {
  active?: string
  onChange?: (value: string) => void
}) {
  return (
    <div className="inline-flex gap-0 rounded-sm border border-border bg-surface-sunken p-[3px]">
      {RANGE_ITEMS.map((t) => {
        const isActive = t === active
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange?.(t)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 text-sm transition-colors',
              isActive
                ? 'border border-border bg-surface font-semibold text-ink shadow-[var(--shadow-1)]'
                : 'border border-transparent font-medium text-ink-muted hover:text-ink',
            )}
          >
            {t === 'Custom' ? <Calendar className="size-3.5" /> : null}
            {t}
          </button>
        )
      })}
    </div>
  )
}
