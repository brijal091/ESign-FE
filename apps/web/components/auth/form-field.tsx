'use client'

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { Input, Label, cn } from '@esign/ui'

interface FormFieldProps extends ComponentPropsWithoutRef<'input'> {
  label: string
  error?: string
  hint?: string
  action?: ReactNode
  iconLeading?: ReactNode
  iconTrailing?: ReactNode
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    { label, error, hint, action, iconLeading, iconTrailing, id, className, ...props },
    ref,
  ) => {
    const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`
    return (
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <Label htmlFor={fieldId}>{label}</Label>
          {action}
        </div>
        <div className="relative">
          {iconLeading ? (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle">
              {iconLeading}
            </span>
          ) : null}
          <Input
            {...props}
            id={fieldId}
            ref={ref}
            aria-invalid={!!error}
            className={cn(
              'h-11 transition-shadow focus-visible:shadow-[var(--shadow-focus)]',
              iconLeading && 'pl-10',
              iconTrailing && 'pr-10',
              error && 'border-danger',
              className,
            )}
          />
          {iconTrailing ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle">
              {iconTrailing}
            </span>
          ) : null}
        </div>
        {error ? (
          <p className="mt-1.5 flex items-center gap-[5px] text-xs leading-snug text-danger-strong">
            <AlertCircle size={13} strokeWidth={1.75} aria-hidden />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p className="mt-1.5 text-xs leading-snug text-ink-subtle">{hint}</p>
        ) : null}
      </div>
    )
  },
)
FormField.displayName = 'FormField'
