import * as React from 'react'
import { cn } from '../utils'

const TONE_BG: Record<string, string> = {
  draft: 'bg-ink-faint',
  sent: 'bg-info',
  viewed: 'bg-[oklch(0.64_0.13_280)]',
  signed: 'bg-warning',
  completed: 'bg-success',
  declined: 'bg-ink-faint',
  expired: 'bg-danger',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  brand: 'bg-brand',
  muted: 'bg-ink-faint',
}

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof TONE_BG
  size?: 'sm' | 'md'
}

export function StatusDot({ tone = 'info', size = 'md', className, ...props }: StatusDotProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full',
        size === 'sm' ? 'size-2' : 'size-2.5',
        TONE_BG[tone] ?? TONE_BG.info,
        className,
      )}
      {...props}
    />
  )
}
