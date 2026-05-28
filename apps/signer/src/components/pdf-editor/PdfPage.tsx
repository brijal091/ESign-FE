import { useDroppable } from '@dnd-kit/core'
import { Page } from 'react-pdf'
import { PlacedField } from './PlacedField'
import type { DocumentField } from '@esign/types'

interface PdfPageProps {
  pageNumber: number
  width: number
  fields: DocumentField[]
  onRemove: (id: string) => void
}

export function PdfPage({ pageNumber, width, fields, onRemove }: PdfPageProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `overlay-page-${pageNumber}` })

  const pageFields = fields.filter((f) => f.position.page === pageNumber)

  return (
    <div className="relative shadow-md mb-4 bg-white" style={{ width }}>
      <Page
        pageNumber={pageNumber}
        width={width}
        renderAnnotationLayer={false}
        renderTextLayer={false}
      />
      {/* Drop overlay — absolute-positioned on top of the PDF canvas */}
      <div
        ref={setNodeRef}
        id={`pdf-page-overlay-${pageNumber}`}
        className={`absolute inset-0 ${isOver ? 'ring-2 ring-inset ring-primary/40' : ''}`}
        style={{ zIndex: 10 }}
      >
        {pageFields.map((field) => (
          <PlacedField key={field.id} field={field} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}
