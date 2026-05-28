import { useDraggable } from '@dnd-kit/core'
import { PenLine, Hash, Type, Calendar, CheckSquare } from 'lucide-react'
import type { FieldType } from '@esign/types'

interface PaletteItemProps {
  type: FieldType
  icon: React.ReactNode
  label: string
}

function PaletteItem({ type, icon, label }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium cursor-grab select-none hover:bg-muted transition-colors ${isDragging ? 'opacity-40' : ''}`}
    >
      {icon}
      {label}
    </div>
  )
}

export function FieldPalette() {
  return (
    <div className="flex flex-col gap-1.5 p-3 bg-muted/50 rounded-lg border border-border">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
        Fields
      </p>
      <PaletteItem type="signature" icon={<PenLine className="h-4 w-4 text-blue-600" />} label="Signature" />
      <PaletteItem type="initials" icon={<Hash className="h-4 w-4 text-purple-600" />} label="Initials" />
      <PaletteItem type="text" icon={<Type className="h-4 w-4 text-amber-600" />} label="Text" />
      <PaletteItem type="date" icon={<Calendar className="h-4 w-4 text-green-600" />} label="Date" />
      <PaletteItem type="checkbox" icon={<CheckSquare className="h-4 w-4 text-rose-600" />} label="Checkbox" />
      <p className="text-xs text-muted-foreground mt-2">Drag fields onto the document</p>
    </div>
  )
}
