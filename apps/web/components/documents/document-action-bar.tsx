'use client'

import { SendHorizontal, Download, Copy } from 'lucide-react'
import { Button, toast } from '@esign/ui'
import type { Document } from '@esign/types'

interface DocumentActionBarProps {
  doc: Document
}

/**
 * Sticky bottom action bar shown on the document detail page.
 * Secondary buttons left-aligned, destructive ghost ("Void") right-aligned.
 */
export function DocumentActionBar({ doc }: DocumentActionBarProps) {
  const canResend = doc.status === 'sent' || doc.status === 'viewed'
  const canVoid =
    doc.status === 'sent' ||
    doc.status === 'viewed' ||
    doc.status === 'signed' ||
    doc.status === 'draft'

  return (
    <div className="sticky bottom-0 -mx-6 mt-8 border-t border-border bg-surface-raised/95 px-6 py-3.5 backdrop-blur supports-[backdrop-filter]:bg-surface-raised/80">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!canResend}
          onClick={() => toast.message('Resend not yet implemented')}
          className="gap-1.5"
        >
          <SendHorizontal className="size-3.5" strokeWidth={1.5} />
          Resend
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => toast.message('Download not yet implemented')}
          className="gap-1.5"
        >
          <Download className="size-3.5" strokeWidth={1.5} />
          Download
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => toast.message('Duplicate not yet implemented')}
          className="gap-1.5"
        >
          <Copy className="size-3.5" strokeWidth={1.5} />
          Duplicate
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          disabled={!canVoid}
          onClick={() => toast.message('Void not yet implemented')}
          className="text-danger-strong hover:bg-danger-soft hover:text-danger-strong"
        >
          Void
        </Button>
      </div>
    </div>
  )
}
