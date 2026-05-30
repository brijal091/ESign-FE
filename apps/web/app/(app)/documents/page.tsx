'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { UploadCloud, Search, Calendar } from 'lucide-react'
import { Button, Input } from '@esign/ui'
import type { Document, DocumentStatusEvent } from '@esign/types'
import { DocumentsTable } from '../../../components/documents/documents-table'
import { DocumentsGrid } from '../../../components/documents/documents-grid'
import { UploadDialog } from '../../../components/documents/upload-dialog'
import {
  DocumentsEmpty,
  DocumentsFilterEmpty,
} from '../../../components/documents/documents-empty'
import type { StatusFilterValue } from '../../../components/documents/status-filter'
import { FilterChip, type FilterChipOption } from '../../../components/documents/filter-chip'
import { ViewToggle, type DocumentsView } from '../../../components/documents/view-toggle'
import { Pagination } from '../../../components/documents/pagination'
import { ConnectionIndicator } from '../../../components/system/connection-indicator'
import { useDocuments } from '../../../lib/hooks/use-documents'
import { useDocumentStream } from '../../../lib/hooks/use-document-stream'
import { statusLabel } from '../../../lib/document-status'

const PAGE_SIZE = 10

type SenderFilter = 'all' | 'me' | 'team'
type DateRangeFilter = 'all' | '7d' | '30d' | '90d'

const STATUS_ORDER: StatusFilterValue[] = [
  'all',
  'draft',
  'sent',
  'viewed',
  'signed',
  'completed',
  'declined',
  'expired',
]

const SENDER_OPTIONS: FilterChipOption<SenderFilter>[] = [
  { value: 'all', label: 'All senders' },
  { value: 'me', label: 'Sent by me' },
  { value: 'team', label: 'Sent by team' },
]

const DATE_OPTIONS: FilterChipOption<DateRangeFilter>[] = [
  { value: 'all', label: 'Any time' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

function withinRange(iso: string, range: DateRangeFilter): boolean {
  if (range === 'all') return true
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return new Date(iso).getTime() >= cutoff
}

export default function DocumentsPage() {
  const { data, isLoading } = useDocuments()
  const documents = useMemo<Document[]>(() => data ?? [], [data])
  const qc = useQueryClient()

  const [status, setStatus] = useState<StatusFilterValue>('all')
  const [sender, setSender] = useState<SenderFilter>('all')
  const [dateRange, setDateRange] = useState<DateRangeFilter>('all')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<DocumentsView>('list')
  const [page, setPage] = useState(1)

  const handleEvent = useCallback(
    (event: DocumentStatusEvent) => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      qc.invalidateQueries({ queryKey: ['documents', event.documentId] })
    },
    [qc],
  )

  const { state: streamState } = useDocumentStream({ onEvent: handleEvent })

  const counts = useMemo<Record<StatusFilterValue, number>>(() => {
    const c: Record<StatusFilterValue, number> = {
      all: documents.length,
      draft: 0,
      sent: 0,
      viewed: 0,
      signed: 0,
      completed: 0,
      declined: 0,
      expired: 0,
    }
    for (const d of documents) c[d.status] += 1
    return c
  }, [documents])

  const statusOptions = useMemo<FilterChipOption<StatusFilterValue>[]>(
    () =>
      STATUS_ORDER.map((v) => ({
        value: v,
        label: v === 'all' ? 'All status' : statusLabel(v),
        count: counts[v],
      })),
    [counts],
  )

  const filtered = useMemo<Document[]>(() => {
    const q = query.trim().toLowerCase()
    return documents.filter((d) => {
      if (status !== 'all' && d.status !== status) return false
      if (!withinRange(d.createdAt, dateRange)) return false
      if (q) {
        const hay = [
          d.title,
          ...d.tags,
          ...d.signers.flatMap((s) => [s.name, s.email]),
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [documents, status, dateRange, query])

  // Reset paging whenever filter inputs change.
  useEffect(() => {
    setPage(1)
  }, [status, sender, dateRange, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  )

  const uploadTrigger = (
    <Button className="gap-2" size="default">
      <UploadCloud className="size-4" strokeWidth={1.5} />
      Upload a PDF &amp; Sign
    </Button>
  )

  const hasDocuments = documents.length > 0
  const showFilterEmpty = hasDocuments && filtered.length === 0

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
          <UploadDialog trigger={uploadTrigger} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="flex w-full max-w-[320px] items-center gap-2 rounded-sm border border-border bg-surface px-3 transition-colors focus-within:border-brand focus-within:bg-surface-raised">
          <Search className="size-4 text-ink-faint" strokeWidth={1.5} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents…"
            className="h-9 border-0 bg-transparent px-0 text-[13.5px] hover:border-0 focus-visible:border-0 focus-visible:bg-transparent"
            aria-label="Search documents"
          />
        </div>

        <FilterChip<StatusFilterValue>
          label="All status"
          value={status}
          options={statusOptions}
          onChange={setStatus}
        />
        <FilterChip<SenderFilter>
          label="All senders"
          value={sender}
          options={SENDER_OPTIONS}
          onChange={setSender}
        />
        <FilterChip<DateRangeFilter>
          label="Date range"
          value={dateRange}
          options={DATE_OPTIONS}
          onChange={setDateRange}
          icon={Calendar}
        />

        <div className="ml-auto">
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      {/* List / Grid */}
      {isLoading ? (
        <div className="overflow-hidden rounded-md border border-border bg-surface py-20 text-center text-sm text-ink-subtle shadow-[var(--shadow-1)]">
          Loading…
        </div>
      ) : !hasDocuments ? (
        <div className="overflow-hidden rounded-md border border-border bg-surface shadow-[var(--shadow-1)]">
          <DocumentsEmpty
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <UploadDialog
                  trigger={
                    <Button className="gap-2">
                      <UploadCloud className="size-4" strokeWidth={1.5} />
                      Upload your first document
                    </Button>
                  }
                />
              </div>
            }
          />
        </div>
      ) : showFilterEmpty ? (
        <div className="overflow-hidden rounded-md border border-border bg-surface shadow-[var(--shadow-1)]">
          <DocumentsFilterEmpty
            onClear={() => {
              setStatus('all')
              setSender('all')
              setDateRange('all')
              setQuery('')
            }}
          />
        </div>
      ) : view === 'list' ? (
        <div className="overflow-hidden rounded-md border border-border bg-surface shadow-[var(--shadow-1)]">
          <DocumentsTable documents={paginated} />
        </div>
      ) : (
        <DocumentsGrid documents={paginated} />
      )}

      {/* Pagination */}
      {!isLoading && filtered.length > 0 ? (
        <Pagination
          page={currentPage}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  )
}
