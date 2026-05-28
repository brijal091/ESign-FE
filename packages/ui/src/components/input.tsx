import * as React from 'react'
import { cn } from '../utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-sm border border-border bg-surface px-3 py-1 text-sm text-ink transition-colors',
        'placeholder:text-ink-faint',
        'hover:border-border-strong',
        'focus-visible:outline-none focus-visible:border-brand focus-visible:bg-surface-raised',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-sunken',
        'aria-[invalid=true]:border-danger aria-[invalid=true]:bg-danger-soft/40',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
