import { useDraggable } from '@dnd-kit/core'
import { X, PenLine, Type, Calendar, CheckSquare, Hash } from 'lucide-react'
import type { DocumentField, FieldType } from '@esign/types'

const FIELD_ICONS: Partial<Record<FieldType, React.ReactNode>> = {
  signature: <PenLine className="h-3 w-3" />,
  initials: <Hash className="h-3 w-3" />,
  text: <Type className="h-3 w-3" />,
  date: <Calendar className="h-3 w-3" />,
  checkbox: <CheckSquare className="h-3 w-3" />,
}

const FIELD_LABELS: Partial<Record<FieldType, string>> = {
  signature: 'Signature',
  initials: 'Initials',
  text: 'Text',
  date: 'Date',
  checkbox: 'Checkbox',
}

const FIELD_COLORS: Partial<Record<FieldType, string>> = {
  signature: 'bg-blue-50 border-blue-400 text-blue-700',
  initials: 'bg-purple-50 border-purple-400 text-purple-700',
  text: 'bg-amber-50 border-amber-400 text-amber-700',
  date: 'bg-green-50 border-green-400 text-green-700',
  checkbox: 'bg-rose-50 border-rose-400 text-rose-700',
}

interface PlacedFieldProps {
  field: DocumentField
  onRemove: (id: string) => void
}

export function PlacedField({ field, onRemove }: PlacedFieldProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: field.id,
    data: { type: field.type, id: field.id },
  })

  const { x, y, width, height } = field.position
  const colorClass = FIELD_COLORS[field.type]

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`absolute flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium cursor-grab select-none group ${colorClass} ${isDragging ? 'opacity-30' : 'opacity-90 hover:opacity-100'}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        minWidth: '80px',
        minHeight: '28px',
      }}
    >
      {FIELD_ICONS[field.type]}
      <span className="truncate flex-1">{FIELD_LABELS[field.type]}</span>
      <button
        className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity ml-auto"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          onRemove(field.id)
        }}
        aria-label="Remove field"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
