import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils'

/**
 * Paraph status badge mapping (DocumentStatus → UI label → variant):
 *   draft     → "Draft"            muted
 *   sent      → "To Sign"          info
 *   viewed    → "Viewed"           viewed (lavender)
 *   signed    → "Partially Signed" warning
 *   completed → "Fully Signed"     success
 *   declined  → "Cancelled"        muted + strikethrough
 *   expired   → "Expired"          danger
 */
export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors leading-snug',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand text-ink-inverse',
        secondary: 'border-transparent bg-surface-sunken text-ink-muted',
        outline: 'border-border text-ink',
        info: 'border-transparent bg-info-soft text-info-strong',
        success: 'border-transparent bg-success-soft text-success-strong',
        warning: 'border-transparent bg-warning-soft text-warning-strong',
        danger: 'border-transparent bg-danger-soft text-danger-strong',
        destructive: 'border-transparent bg-danger-soft text-danger-strong',
        // Document status variants
        draft: 'border-transparent bg-surface-sunken text-ink-muted',
        sent: 'border-transparent bg-info-soft text-info-strong',
        viewed: 'border-[oklch(0.88_0.06_280)] bg-[oklch(0.96_0.025_280)] text-[oklch(0.46_0.13_280)]',
        signed: 'border-transparent bg-warning-soft text-warning-strong',
        completed: 'border-transparent bg-success-soft text-success-strong',
        declined: 'border-transparent bg-surface-sunken text-ink-faint line-through',
        expired: 'border-transparent bg-danger-soft text-danger-strong',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
