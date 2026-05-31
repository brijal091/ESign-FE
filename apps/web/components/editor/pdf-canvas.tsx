'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { FileText, Loader2, Minus, Plus } from 'lucide-react'
import { cn } from '@esign/ui'
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

const ZOOM_STEPS = [50, 65, 80, 100, 115, 130, 150, 175, 200] as const
const DEFAULT_ZOOM = 100
const BASE_WIDTH = 820 // px @ 100%

export function PdfCanvas({
  fileUrl,
  fields,
  signers,
  selectedFieldId,
  onSelectField,
  onMoveField,
}: PdfCanvasProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const pageEls = useRef<Map<number, HTMLDivElement>>(new Map())

  const setPageRef = useCallback(
    (pageNumber: number) => (el: HTMLDivElement | null) => {
      if (el) pageEls.current.set(pageNumber, el)
      else pageEls.current.delete(pageNumber)
    },
    [],
  )

  // Track which page is currently most-visible
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || numPages === 0) return
    function onScroll() {
      if (!scroller) return
      const mid = scroller.scrollTop + scroller.clientHeight / 2
      let nearest = 1
      let nearestDist = Infinity
      for (const [pn, el] of pageEls.current.entries()) {
        const center = el.offsetTop + el.clientHeight / 2
        const dist = Math.abs(center - mid)
        if (dist < nearestDist) {
          nearestDist = dist
          nearest = pn
        }
      }
      setCurrentPage(nearest)
    }
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [numPages, zoom])

  const stepZoom = (dir: 1 | -1) => {
    const idx = ZOOM_STEPS.indexOf(zoom as (typeof ZOOM_STEPS)[number])
    if (idx === -1) {
      // Snap to nearest then move
      const sorted = [...ZOOM_STEPS]
      let nearestIdx = 0
      let best = Infinity
      sorted.forEach((s, i) => {
        const d = Math.abs(s - zoom)
        if (d < best) {
          best = d
          nearestIdx = i
        }
      })
      const next = ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, Math.max(0, nearestIdx + dir))]
      setZoom(next)
      return
    }
    const next = ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, Math.max(0, idx + dir))]
    setZoom(next)
  }

  const renderWidth = Math.round((BASE_WIDTH * zoom) / 100)

  function scrollToPage(pageNumber: number) {
    const el = pageEls.current.get(pageNumber)
    if (el && scrollerRef.current) {
      scrollerRef.current.scrollTo({ top: el.offsetTop - 32, behavior: 'smooth' })
    }
  }

  return (
    <section
      className="relative flex flex-1 overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundColor: 'var(--color-surface-sunken)',
      }}
    >
      {/* ── Left: page thumbnail strip ── */}
      {numPages > 0 && (
        <div className="no-scrollbar flex w-[100px] shrink-0 flex-col gap-1 overflow-y-auto border-r border-border bg-surface px-2 py-3">
          <Document file={fileUrl} loading={null} error={null}>
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => scrollToPage(pageNumber)}
                className={cn(
                  'mb-1 flex w-full flex-col items-center gap-1.5 rounded-sm p-1.5 transition-colors',
                  currentPage === pageNumber
                    ? 'bg-brand-soft ring-1 ring-brand'
                    : 'hover:bg-surface-hover',
                )}
              >
                <div className="w-full overflow-hidden rounded-[2px] shadow-[var(--shadow-1)] ring-1 ring-border">
                  <Page
                    pageNumber={pageNumber}
                    width={76}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </div>
                <span
                  className={cn(
                    'font-mono text-[9px] font-semibold tabular-nums',
                    currentPage === pageNumber ? 'text-brand-strong' : 'text-ink-faint',
                  )}
                >
                  {pageNumber}
                </span>
              </button>
            ))}
          </Document>
        </div>
      )}

      {/* ── Center: main PDF canvas ── */}
      <div
        ref={scrollerRef}
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
              <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
              Loading PDF…
            </div>
          }
          error={
            <div className="py-12 text-sm text-danger-strong">
              Couldn&apos;t load this PDF. Try again.
            </div>
          }
          className="flex flex-col items-center gap-6"
        >
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
            <DroppablePage key={pageNumber} page={pageNumber}>
              <div
                ref={setPageRef(pageNumber)}
                data-page={pageNumber}
                className="relative overflow-hidden rounded-[2px] bg-surface-raised shadow-[var(--shadow-2)] ring-1 ring-border"
              >
                <Page
                  pageNumber={pageNumber}
                  width={renderWidth}
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

      {/* Floating page indicator — top-right rounded pill */}
      {numPages > 0 && (
        <div className="pointer-events-none absolute right-6 top-4 flex items-center gap-2 rounded-full border border-border bg-surface-raised/95 px-3 py-1.5 text-xs text-ink-muted shadow-[var(--shadow-1)] backdrop-blur-sm">
          <FileText className="size-3.5 text-ink-subtle" strokeWidth={1.5} />
          <span>
            Page <strong className="font-semibold text-ink">{currentPage}</strong> of {numPages}
          </span>
        </div>
      )}

      {/* Floating zoom control — bottom-right */}
      {numPages > 0 && (
        <div className="absolute bottom-4 right-6 flex items-center overflow-hidden rounded-sm border border-border bg-surface-raised shadow-[var(--shadow-1)]">
          <button
            type="button"
            onClick={() => stepZoom(-1)}
            aria-label="Zoom out"
            className="grid size-8 place-items-center text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-40"
            disabled={zoom <= ZOOM_STEPS[0]}
          >
            <Minus className="size-3.5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(DEFAULT_ZOOM)}
            aria-label="Reset zoom"
            className="min-w-[56px] px-2 text-center font-mono text-xs font-medium tabular-nums text-ink hover:text-brand-strong"
          >
            {zoom}%
          </button>
          <button
            type="button"
            onClick={() => stepZoom(1)}
            aria-label="Zoom in"
            className="grid size-8 place-items-center text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-40"
            disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
          >
            <Plus className="size-3.5" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </section>
  )
}
