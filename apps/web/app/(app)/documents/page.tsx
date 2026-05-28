'use client'

import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Upload, Search } from 'lucide-react'
import { Button, Input } from '@esign/ui'
import type { DocumentStatusEvent } from '@esign/types'
import { DocumentsTable } from '../../../components/documents/documents-table'
import { UploadDialog } from '../../../components/documents/upload-dialog'
import { ConnectionIndicator } from '../../../components/system/connection-indicator'
import { useDocuments } from '../../../lib/hooks/use-documents'
import { useDocumentStream } from '../../../lib/hooks/use-document-stream'

export default function DocumentsPage() {
  const { data, isLoading } = useDocuments()
  const documents = data ?? []
  const qc = useQueryClient()

  const handleEvent = useCallback(
    (event: DocumentStatusEvent) => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      qc.invalidateQueries({ queryKey: ['documents', event.documentId] })
    },
    [qc],
  )

  const { state: streamState } = useDocumentStream({ onEvent: handleEvent })

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-8">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Documents</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Send, sign, and track every document in one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionIndicator state={streamState} />
          <UploadDialog
            trigger={
              <Button className="gap-2">
                <Upload className="size-4" />
                Upload a PDF &amp; Sign
              </Button>
            }
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex w-80 items-center gap-2 rounded-sm border border-border bg-surface px-2.5 focus-within:border-brand">
          <Search className="size-4 text-ink-faint" />
          <Input
            placeholder="Search documents…"
            className="h-9 border-0 bg-transparent px-0 hover:border-0 focus-visible:border-0 focus-visible:bg-transparent"
            disabled
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-border bg-surface">
        {isLoading ? (
          <div className="py-20 text-center text-sm text-ink-subtle">Loading…</div>
        ) : (
          <DocumentsTable documents={documents} />
        )}
      </div>
    </div>
  )
}
