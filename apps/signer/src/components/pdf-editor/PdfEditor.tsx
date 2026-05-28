import { useState, useCallback, useRef } from 'react'
import { Document, pdfjs } from 'react-pdf'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { useDocumentFields } from '@esign/hooks'
import type { FieldType } from '@esign/types'
import { PdfPage } from './PdfPage'
import { FieldPalette } from './FieldPalette'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const PDF_WIDTH = 700

interface ActiveItem {
  type: FieldType
  id?: string
}

interface PdfEditorProps {
  fileUrl: string
}

export function PdfEditor({ fileUrl }: PdfEditorProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [activeItem, setActiveItem] = useState<ActiveItem | null>(null)
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const { fields, addField, updateFieldPosition, removeField } = useDocumentFields()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as ActiveItem
    setActiveItem(data)

    // Track pointer globally during drag
    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', () => window.removeEventListener('pointermove', onMove), {
      once: true,
    })
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const data = event.active.data.current as ActiveItem
      const over = event.over

      if (!over) {
        setActiveItem(null)
        return
      }

      const pageMatch = String(over.id).match(/overlay-page-(\d+)/)
      if (!pageMatch) {
        setActiveItem(null)
        return
      }
      const pageNumber = parseInt(pageMatch[1] ?? '1', 10)

      const overlayEl = document.getElementById(`pdf-page-overlay-${pageNumber}`)
      if (!overlayEl) {
        setActiveItem(null)
        return
      }

      const rect = overlayEl.getBoundingClientRect()
      const { x: px, y: py } = pointerRef.current
      const x = Math.max(0, Math.min(82, ((px - rect.left) / rect.width) * 100))
      const y = Math.max(0, Math.min(95, ((py - rect.top) / rect.height) * 100))

      if (data.id) {
        const existing = fields.find((f) => f.id === data.id)
        updateFieldPosition(data.id, {
          ...(existing?.position ?? { page: pageNumber, width: 18, height: 5 }),
          x,
          y,
          page: pageNumber,
        })
      } else {
        addField(data.type, { page: pageNumber, x, y, width: 18, height: 5 })
      }

      setActiveItem(null)
    },
    [addField, fields, updateFieldPosition],
  )

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4">
        {/* Palette */}
        <aside className="w-44 shrink-0 sticky top-4 self-start">
          <FieldPalette />
          <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Fields ({fields.length})
            </p>
            {fields.length === 0 ? (
              <p className="text-xs text-muted-foreground">No fields added yet</p>
            ) : (
              <ul className="space-y-1">
                {fields.map((f) => (
                  <li key={f.id} className="text-xs text-foreground">
                    {f.type} — p{f.position.page} ({Math.round(f.position.x)}%,{' '}
                    {Math.round(f.position.y)}%)
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* PDF pages */}
        <div className="flex-1 overflow-auto">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                Loading PDF...
              </div>
            }
            error={
              <div className="flex items-center justify-center h-64 text-destructive text-sm">
                Failed to load PDF. Check your network connection.
              </div>
            }
          >
            {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <PdfPage
                key={page}
                pageNumber={page}
                width={PDF_WIDTH}
                fields={fields}
                onRemove={removeField}
              />
            ))}
          </Document>
        </div>
      </div>

      <DragOverlay>
        {activeItem && (
          <div className="rounded border border-blue-400 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 shadow-lg opacity-80 pointer-events-none">
            {activeItem.type}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
