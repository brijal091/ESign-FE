'use client'

// TODO(wire-up): Render this in the editor topbar (apps/web/app/(app)/documents/[id]/edit/page.tsx)
// next to the title — drive `status` from useUpdateDocument's mutation state:
//   useUpdateDocument.isPending -> 'saving'
//   useUpdateDocument.isError   -> 'error'
//   otherwise                   -> 'saved' (or 'idle' to hide).

import { AlertCircle, Check, Loader2 } from 'lucide-react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface SaveIndicatorProps {
  status: SaveStatus
  onRetry?: () => void
}

export function SaveIndicator({ status, onRetry }: SaveIndicatorProps) {
  if (status === 'idle') return null

  if (status === 'saving') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted">
        <Loader2
          className="size-3 animate-spin text-brand"
          strokeWidth={1.5}
          aria-hidden
        />
        Saving…
      </span>
    )
  }

  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12.5px] text-danger-strong">
        <AlertCircle className="size-[13px]" strokeWidth={1.5} aria-hidden />
        Couldn&apos;t save.
        <button
          type="button"
          onClick={onRetry}
          className="font-medium text-danger-strong underline underline-offset-2 hover:no-underline"
        >
          Retry
        </button>
      </span>
    )
  }

  // 'saved'
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-subtle">
      <Check className="size-[13px] text-success-strong" strokeWidth={1.5} aria-hidden />
      Saved
    </span>
  )
}
