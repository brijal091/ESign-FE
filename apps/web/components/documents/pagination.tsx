'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@esign/ui'

interface PaginationProps {
  /** 1-based current page */
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

/**
 * Generates a compact page list with a single ellipsis on each side.
 * Examples (current = 4, total = 10):
 *   1 … 3 [4] 5 … 10
 */
function buildPageList(page: number, totalPages: number): Array<number | 'gap-l' | 'gap-r'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const items: Array<number | 'gap-l' | 'gap-r'> = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)
  if (start > 2) items.push('gap-l')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < totalPages - 1) items.push('gap-r')
  items.push(totalPages)
  return items
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  if (total === 0) return null

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, page), totalPages)
  const from = (current - 1) * pageSize + 1
  const to = Math.min(current * pageSize, total)
  const items = buildPageList(current, totalPages)

  const canPrev = current > 1
  const canNext = current < totalPages

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 px-1 py-3.5"
    >
      <div className="text-[13px] text-ink-muted">
        Showing{' '}
        <span className="font-medium tabular-nums text-ink">
          {from}&ndash;{to}
        </span>{' '}
        of <span className="font-medium tabular-nums text-ink">{total}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(current - 1)}
          className={cn(
            'grid size-8 place-items-center rounded-sm border border-border bg-surface text-ink-muted transition-colors',
            canPrev
              ? 'hover:border-border-strong hover:text-ink'
              : 'cursor-not-allowed opacity-50',
          )}
        >
          <ChevronLeft className="size-4" strokeWidth={1.5} />
        </button>

        {items.map((it, idx) => {
          if (it === 'gap-l' || it === 'gap-r') {
            return (
              <span
                key={`${it}-${idx}`}
                aria-hidden
                className="px-1 text-ink-faint"
              >
                …
              </span>
            )
          }
          const active = it === current
          return (
            <button
              key={it}
              type="button"
              aria-current={active ? 'page' : undefined}
              aria-label={`Page ${it}`}
              onClick={() => onPageChange(it)}
              className={cn(
                'h-8 min-w-8 rounded-sm px-2 text-[13px] font-medium tabular-nums transition-colors',
                active
                  ? 'border border-[oklch(0.85_0.08_40)] bg-brand-soft text-brand-strong'
                  : 'border border-transparent text-ink-muted hover:bg-surface-hover hover:text-ink',
              )}
            >
              {it}
            </button>
          )
        })}

        <button
          type="button"
          aria-label="Next page"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(current + 1)}
          className={cn(
            'grid size-8 place-items-center rounded-sm border border-border bg-surface text-ink-muted transition-colors',
            canNext
              ? 'hover:border-border-strong hover:text-ink'
              : 'cursor-not-allowed opacity-50',
          )}
        >
          <ChevronRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  )
}
