'use client'

import { Rows3, LayoutGrid } from 'lucide-react'
import { cn } from '@esign/ui'

export type DocumentsView = 'list' | 'grid'

interface ViewToggleProps {
  value: DocumentsView
  onChange: (v: DocumentsView) => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="View"
      className="inline-flex items-center gap-px rounded-sm bg-surface-sunken p-0.5"
    >
      {(
        [
          { v: 'list' as const, Icon: Rows3, label: 'List view' },
          { v: 'grid' as const, Icon: LayoutGrid, label: 'Grid view' },
        ]
      ).map(({ v, Icon, label }) => {
        const active = value === v
        return (
          <button
            key={v}
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            onClick={() => onChange(v)}
            className={cn(
              'grid size-8 place-items-center rounded-sm transition-colors',
              active
                ? 'bg-surface text-ink shadow-[var(--shadow-1)]'
                : 'text-ink-muted hover:text-ink',
            )}
          >
            <Icon className="size-4" strokeWidth={1.5} />
          </button>
        )
      })}
    </div>
  )
}
