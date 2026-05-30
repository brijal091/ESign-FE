'use client'

import { ChevronDown, type LucideIcon } from 'lucide-react'
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@esign/ui'

export interface FilterChipOption<T extends string> {
  value: T
  label: string
  count?: number
}

interface FilterChipProps<T extends string> {
  label: string
  /** Selected value's label is shown when `active` is true and value is provided */
  value?: T
  options: FilterChipOption<T>[]
  onChange?: (next: T) => void
  /** Optional leading icon (e.g. Calendar for date-range) */
  icon?: LucideIcon
  /** Visual override: force the active treatment regardless of `value` */
  active?: boolean
  ariaLabel?: string
}

export function FilterChip<T extends string>({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  active,
  ariaLabel,
}: FilterChipProps<T>) {
  const selected = value !== undefined ? options.find((o) => o.value === value) : undefined
  const isActive = active ?? (selected !== undefined && selected.value !== options[0]?.value)
  const displayLabel = selected ? selected.label : label

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={ariaLabel ?? label}
        className={cn(
          'inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-sm border px-3 text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
          isActive
            ? 'border-[oklch(0.85_0.08_40)] bg-brand-soft text-brand-strong'
            : 'border-border bg-surface text-ink hover:border-border-strong hover:bg-surface-hover',
        )}
      >
        {Icon ? <Icon className="size-3.5" strokeWidth={1.5} /> : null}
        {displayLabel}
        <ChevronDown className="ml-0.5 size-3.5" strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px]">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => onChange?.(opt.value)}
            className={cn(
              'cursor-pointer text-[13px]',
              selected?.value === opt.value && 'bg-brand-soft text-brand-strong focus:bg-brand-soft',
            )}
          >
            <span className="flex-1">{opt.label}</span>
            {opt.count !== undefined ? (
              <span className="ml-3 font-mono text-[11px] tabular-nums text-ink-subtle">
                {opt.count}
              </span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
