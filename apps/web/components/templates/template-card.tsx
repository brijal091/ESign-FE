'use client'

import { ArrowRight, MoreHorizontal, TextCursorInput, Trash2 } from 'lucide-react'
import type { Template, TemplateCategory } from '@esign/types'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@esign/ui'

const CATEGORY_PALETTE: Record<TemplateCategory, { bg: string; fg: string }> = {
  NDA: { bg: 'var(--color-info-soft)', fg: 'var(--color-info-strong)' },
  HR: { bg: 'var(--color-success-soft)', fg: 'var(--color-success-strong)' },
  Sales: { bg: 'var(--color-brand-soft)', fg: 'var(--color-brand-strong)' },
  Vendor: { bg: 'oklch(0.955 0.035 280)', fg: 'oklch(0.460 0.130 280)' },
  Finance: { bg: 'var(--color-warning-soft)', fg: 'var(--color-warning-strong)' },
  Brand: { bg: 'oklch(0.94 0.05 320)', fg: 'oklch(0.45 0.15 320)' },
  Tax: { bg: 'oklch(0.93 0.005 60)', fg: 'oklch(0.42 0.014 60)' },
  Other: { bg: 'var(--color-surface-sunken)', fg: 'var(--color-ink-muted)' },
}

function CategoryBadge({ category }: { category: TemplateCategory | null }) {
  if (!category) return null
  const p = CATEGORY_PALETTE[category] ?? CATEGORY_PALETTE.Other
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: p.bg, color: p.fg }}
    >
      {category}
    </span>
  )
}

function FieldCountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-border-subtle bg-surface-sunken py-0.5 pl-1.5 pr-2 text-[11px] font-medium text-ink-muted">
      <TextCursorInput className="size-3" />
      {count} {count === 1 ? 'field' : 'fields'}
    </span>
  )
}

function TplThumb({ lines = 7 }: { lines?: number }) {
  return (
    <div className="relative h-[120px] w-full overflow-hidden border-b border-border bg-paper">
      <div
        className="absolute rounded-[2px] border border-border-subtle bg-surface-raised shadow-[var(--shadow-1)]"
        style={{ left: 18, top: 14, right: 36, bottom: -6, transform: 'rotate(-2.2deg)' }}
      />
      <div
        className="absolute overflow-hidden rounded-[2px] border border-border bg-surface-raised px-[18px] pt-3.5 shadow-[var(--shadow-1)]"
        style={{ left: 24, top: 10, right: 24, bottom: -10 }}
      >
        <div className="absolute left-0 top-0 h-[3px] w-[22px] bg-brand" />
        <div className="mb-1 mt-1 h-1.5 w-[62%] rounded-[1px] bg-ink/85" />
        <div className="mb-[9px] h-[3px] w-[38%] rounded-[1px] bg-brand" />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="mb-1 h-0.5 rounded-[1px] bg-border-strong/55"
            style={{ width: `${i === lines - 1 ? 38 : i % 3 === 2 ? 72 : 88}%` }}
          />
        ))}
        <div className="absolute bottom-3.5 left-[18px] w-[90px] border-t border-ink pt-0.5 font-mono text-[6px] uppercase tracking-wide text-ink-subtle">
          Signature
        </div>
        <div className="absolute bottom-3.5 right-[18px] w-[60px] border-t border-ink pt-0.5 font-mono text-[6px] uppercase tracking-wide text-ink-subtle">
          Date
        </div>
      </div>
    </div>
  )
}

function relativeTime(iso: string | null): string {
  if (!iso) return 'never'
  const then = new Date(iso).getTime()
  const now = Date.now()
  const sec = Math.max(0, Math.round((now - then) / 1000))
  if (sec < 60) return 'just now'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.round(hr / 24)
  if (day < 30) return `${day}d ago`
  const mo = Math.round(day / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.round(mo / 12)}y ago`
}

export function TemplateCard({
  template,
  onUse,
  onDelete,
}: {
  template: Template
  onUse: (t: Template) => void
  onDelete: (t: Template) => void
}) {
  const lastUsed = template.lastUsedAt
    ? `Last used ${relativeTime(template.lastUsedAt)}`
    : `Created ${relativeTime(template.createdAt)}`

  return (
    <div className="flex h-[240px] w-[280px] flex-col overflow-hidden rounded-md border border-border bg-surface shadow-[var(--shadow-1)] transition-shadow hover:shadow-[var(--shadow-2)]">
      <TplThumb lines={Math.min(10, Math.max(5, template.pageCount ?? 7))} />
      <div className="flex items-center gap-1.5 px-3.5 pt-2.5">
        <CategoryBadge category={template.category} />
        <FieldCountBadge count={template.fields.length} />
      </div>
      <div className="min-w-0 flex-1 px-3.5 pt-2">
        <h4 className="truncate text-sm font-semibold leading-snug text-ink">{template.name}</h4>
        <div className="mt-0.5 truncate text-xs text-ink-subtle">{lastUsed}</div>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border-subtle bg-surface-raised px-3 pb-3 pt-2.5">
        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() => onUse(template)}
        >
          Use <ArrowRight className="size-3.5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="grid size-7 place-items-center rounded-sm text-ink-faint hover:bg-surface-hover hover:text-ink"
              aria-label="Template actions"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => onDelete(template)}
              className="text-danger focus:text-danger"
            >
              <Trash2 className="size-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
