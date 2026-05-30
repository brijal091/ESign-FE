'use client'

import { Toaster as Sonner } from 'sonner'
import {
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  TriangleAlert,
  X,
} from 'lucide-react'

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      gap={10}
      offset={20}
      visibleToasts={4}
      closeButton
      icons={{
        success: <CheckCircle2 className="h-[18px] w-[18px] text-success-strong" strokeWidth={1.5} />,
        info: <Info className="h-[18px] w-[18px] text-info-strong" strokeWidth={1.5} />,
        warning: <TriangleAlert className="h-[18px] w-[18px] text-warning-strong" strokeWidth={1.5} />,
        error: <AlertCircle className="h-[18px] w-[18px] text-danger-strong" strokeWidth={1.5} />,
        loading: <Loader2 className="h-[18px] w-[18px] animate-spin text-ink-muted" strokeWidth={1.5} />,
        close: <X className="h-[14px] w-[14px]" strokeWidth={1.5} />,
      }}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: [
            'group/toast relative flex w-full items-start gap-2.5',
            'px-3.5 py-3 pr-9',
            'min-h-[56px] max-w-[380px]',
            'rounded-md border shadow-[var(--shadow-2)]',
            'bg-surface-raised border-border-subtle text-ink',
            'font-sans',
          ].join(' '),
          title: 'text-[13.5px] font-semibold leading-snug text-ink',
          description: 'mt-0.5 text-[13px] leading-[1.45] text-ink-muted',
          icon: 'mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center [&_svg]:h-[18px] [&_svg]:w-[18px]',
          content: 'flex-1 min-w-0',
          closeButton: [
            // override Sonner's default absolute positioning + circular bg
            '!left-auto !right-2.5 !top-2.5 !translate-x-0 !translate-y-0',
            '!h-6 !w-6 !rounded !border-0 !bg-transparent',
            '!text-ink-subtle hover:!text-ink hover:!bg-surface-sunken',
            'transition-colors',
          ].join(' '),
          actionButton:
            '!h-7 !rounded-sm !bg-brand !px-2.5 !text-[12.5px] !font-medium !text-ink-inverse hover:!bg-brand-strong',
          cancelButton:
            '!h-7 !rounded-sm !bg-surface-sunken !px-2.5 !text-[12.5px] !font-medium !text-ink-muted hover:!text-ink',
          default:
            'bg-surface-raised border-border-subtle',
          success:
            '!bg-success-soft !border-success/40 !text-ink',
          info:
            '!bg-info-soft !border-info/40 !text-ink',
          warning:
            '!bg-warning-soft !border-warning/50 !text-ink',
          error:
            '!bg-danger-soft !border-danger/50 !text-ink',
          loading:
            'bg-surface-raised border-border-subtle',
        },
      }}
    />
  )
}
