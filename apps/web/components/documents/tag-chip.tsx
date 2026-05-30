import { cn } from '@esign/ui'

export interface TagChipProps {
  children: React.ReactNode
  variant?: 'default' | 'brand'
  className?: string
}

export function TagChip({ children, variant = 'default', className }: TagChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-medium leading-none',
        variant === 'brand'
          ? 'border border-transparent bg-brand-soft text-brand-strong'
          : 'border border-border bg-surface-raised text-ink-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}
