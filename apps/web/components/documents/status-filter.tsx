'use client'

import { cn } from '@esign/ui'
import type { DocumentStatus } from '@esign/types'
import { statusLabel } from '../../lib/document-status'

export type StatusFilterValue = 'all' | DocumentStatus

interface StatusFilterProps {
  value: StatusFilterValue
  onChange: (next: StatusFilterValue) => void
  counts: Record<StatusFilterValue, number>
}

const ORDER: StatusFilterValue[] = [
  'all',
  'draft',
  'sent',
  'viewed',
  'signed',
  'completed',
  'declined',
  'expired',
]

// dot color per chip — mirrors design tokens
const DOT_BG: Record<StatusFilterValue, string> = {
  all: 'bg-ink-faint',
  draft: 'bg-ink-faint',
  sent: 'bg-info',
  viewed: 'bg-[oklch(0.64_0.13_280)]',
  signed: 'bg-warning',
  completed: 'bg-success',
  declined: 'bg-ink-faint',
  expired: 'bg-danger',
}

function label(v: StatusFilterValue): string {
  return v === 'all' ? 'All' : statusLabel(v)
}

export function StatusFilter({ value, onChange, counts }: StatusFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter by status"
      className="flex flex-wrap items-center gap-1.5"
    >
      {ORDER.map((v) => {
        const active = value === v
        const count = counts[v] ?? 0
        return (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(v)}
            className={cn(
              'group inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors',
              active
                ? 'border-brand bg-brand-soft text-brand-strong shadow-[var(--shadow-1)]'
                : 'border-border bg-surface text-ink-muted hover:border-border-strong hover:bg-surface-hover hover:text-ink',
            )}
          >
            <span aria-hidden className={cn('size-1.5 rounded-full', DOT_BG[v])} />
            <span>{label(v)}</span>
            <span
              className={cn(
                'rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums leading-4',
                active
                  ? 'bg-brand/15 text-brand-strong'
                  : 'bg-surface-sunken text-ink-subtle group-hover:bg-surface',
              )}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
