'use client'

import * as React from 'react'
import { cn } from '../utils'

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
  id?: string
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, defaultChecked, onCheckedChange, disabled, size = 'md', className, id }, ref) => {
    const [internal, setInternal] = React.useState(defaultChecked ?? false)
    const isControlled = checked !== undefined
    const on = isControlled ? checked : internal

    const w = size === 'sm' ? 'w-8' : 'w-9'
    const h = size === 'sm' ? 'h-[18px]' : 'h-5'
    const knob = size === 'sm' ? 'size-3.5' : 'size-4'
    const translate = size === 'sm' ? 'translate-x-[14px]' : 'translate-x-4'

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        onClick={() => {
          if (disabled) return
          if (!isControlled) setInternal((v) => !v)
          onCheckedChange?.(!on)
        }}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          w,
          h,
          on ? 'bg-brand' : 'bg-border-strong',
          className,
        )}
      >
        <span
          className={cn(
            'inline-block rounded-full bg-surface-raised shadow-[var(--shadow-1)] transition-transform',
            knob,
            on ? translate : 'translate-x-0',
          )}
        />
      </button>
    )
  },
)
Switch.displayName = 'Switch'
