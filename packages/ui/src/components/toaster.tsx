'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'bg-surface-raised text-ink border border-border shadow-[var(--shadow-2)] rounded-md',
          description: 'text-ink-muted',
          actionButton: 'bg-brand text-ink-inverse',
          cancelButton: 'bg-surface-sunken text-ink-muted',
          success: '!border-success/30',
          error: '!border-danger/30',
          warning: '!border-warning/40',
          info: '!border-info/30',
        },
      }}
    />
  )
}
