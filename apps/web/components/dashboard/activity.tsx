'use client'

import { ArrowRight } from 'lucide-react'
import { StatusDot } from '@esign/ui'
import { ACTIVITY, type ActivityItem } from './data'

function ActivityRow({ actor, action, document, time, status }: ActivityItem) {
  return (
    <div
      className="grid items-center gap-3 border-t border-border-subtle px-[18px] py-2.5"
      style={{ gridTemplateColumns: '14px minmax(0,1fr) auto' }}
    >
      <StatusDot tone={status} size="sm" />
      <div className="flex min-w-0 items-baseline gap-1.5">
        <span className="shrink-0 whitespace-nowrap text-[13.5px] font-medium text-ink">{actor}</span>
        <span className="shrink-0 whitespace-nowrap text-[13px] text-ink-muted">{action}</span>
        <span className="min-w-0 flex-1 truncate text-[13px] text-ink-muted">{document}</span>
      </div>
      <span className="whitespace-nowrap text-xs tabular-nums text-ink-subtle">{time}</span>
    </div>
  )
}

export function RecentActivityCard() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface shadow-[var(--shadow-1)]">
      <div className="flex items-center justify-between px-5 pb-3 pt-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Recent Activity</h3>
          <div className="mt-0.5 text-xs text-ink-subtle">Last 24 hours across all documents</div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-[3px] font-mono text-[11px] text-success-strong">
          <span className="size-1.5 rounded-full bg-success" />
          Live
        </span>
      </div>
      <div>
        {ACTIVITY.map((a, i) => (
          <ActivityRow key={i} {...a} />
        ))}
      </div>
      <div className="border-t border-border-subtle bg-surface-sunken px-5 py-3">
        <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-brand-strong hover:underline">
          View all activity <ArrowRight className="size-3.5" />
        </a>
      </div>
    </div>
  )
}
