'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { Input, Label, cn } from '@esign/ui'

interface FormFieldProps extends ComponentPropsWithoutRef<'input'> {
  label: string
  error?: string
  hint?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`
    return (
      <div className="space-y-1.5">
        <Label htmlFor={fieldId}>{label}</Label>
        <Input
          {...props}
          id={fieldId}
          ref={ref}
          aria-invalid={!!error}
          className={cn(error && 'border-danger', className)}
        />
        {error ? (
          <p className="text-xs leading-snug text-danger-strong">{error}</p>
        ) : hint ? (
          <p className="text-xs leading-snug text-ink-subtle">{hint}</p>
        ) : null}
      </div>
    )
  },
)
FormField.displayName = 'FormField'
