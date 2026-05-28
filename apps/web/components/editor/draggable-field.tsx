'use client'

import { useDraggable } from '@dnd-kit/core'
import { cn } from '@esign/ui'
import { fieldTypeMeta } from '../../lib/field-types'
import type { FieldType } from '@esign/types'

interface DraggableFieldProps {
  type: FieldType
  signerId: string
  color: string
}

export function DraggableField({ type, signerId, color }: DraggableFieldProps) {
  const meta = fieldTypeMeta(type)
  const Icon = meta.icon
  const id = `chip-${signerId}-${type}`
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { kind: 'field-chip', type, signerId },
  })

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      className={cn(
        'flex w-full cursor-grab items-center gap-1.5 rounded-sm border border-border bg-surface px-2 py-1.5 text-left text-xs text-ink transition-colors hover:bg-surface-hover active:cursor-grabbing',
        isDragging && 'opacity-40',
      )}
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <Icon className="size-3.5 shrink-0" style={{ color }} />
      <span className="truncate">{meta.label}</span>
    </button>
  )
}

export function FieldChipGhost({ type, color }: { type: FieldType; color: string }) {
  const meta = fieldTypeMeta(type)
  const Icon = meta.icon
  return (
    <div
      className="flex items-center gap-1.5 rounded-sm border border-border bg-surface-raised px-2 py-1.5 text-xs text-ink shadow-[var(--shadow-2)]"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <Icon className="size-3.5 shrink-0" style={{ color }} />
      <span>{meta.label}</span>
    </div>
  )
}
