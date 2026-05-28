'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Loader2 } from 'lucide-react'
import type { DocumentField, FieldPosition, Signer } from '@esign/types'
import { DroppablePage } from './droppable-page'
import { FieldOverlay } from './field-overlay'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfCanvasProps {
  fileUrl: string
  fields: DocumentField[]
  signers: Signer[]
  selectedFieldId: string | null
  onSelectField: (id: string | null) => void
  onMoveField: (id: string, position: FieldPosition) => void
}

export function PdfCanvas({
  fileUrl,
  fields,
  signers,
  selectedFieldId,
  onSelectField,
  onMoveField,
}: PdfCanvasProps) {
  const [numPages, setNumPages] = useState<number>(0)

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-surface-sunken">
      <div
        className="flex flex-1 flex-col items-center gap-6 overflow-auto px-6 py-8"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) onSelectField(null)
        }}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="flex items-center gap-2 py-12 text-sm text-ink-subtle">
              <Loader2 className="size-4 animate-spin" />
              Loading PDF…
            </div>
          }
          error={
            <div className="py-12 text-sm text-danger-strong">Couldn&apos;t load this PDF. Try again.</div>
          }
          className="flex flex-col items-center gap-6"
        >
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
            <DroppablePage key={pageNumber} page={pageNumber}>
              <div
                data-page={pageNumber}
                className="relative overflow-hidden rounded-sm shadow-[var(--shadow-2)] ring-1 ring-border"
              >
                <Page
                  pageNumber={pageNumber}
                  width={820}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
                <FieldOverlay
                  fields={fields}
                  signers={signers}
                  pageNumber={pageNumber}
                  selectedFieldId={selectedFieldId}
                  onSelect={onSelectField}
                  onMoveField={onMoveField}
                />
              </div>
            </DroppablePage>
          ))}
        </Document>
      </div>

      {/* Floating page indicator */}
      {numPages > 0 ? (
        <div className="pointer-events-none absolute right-5 top-5 rounded-sm border border-border bg-surface-raised/90 px-2.5 py-1 font-mono text-xs text-ink-muted shadow-[var(--shadow-1)] backdrop-blur-sm">
          Page 1 of {numPages}
        </div>
      ) : null}
    </div>
  )
}
