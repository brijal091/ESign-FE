'use client'

import { useDraggable } from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'
import { cn } from '@esign/ui'
import { fieldTypeMeta } from '../../lib/field-types'
import type { FieldType } from '@esign/types'

interface DraggableFieldProps {
  type: FieldType
  signerId: string | null
  color: string
  disabled?: boolean
}

export function DraggableField({ type, signerId, color, disabled = false }: DraggableFieldProps) {
  const meta = fieldTypeMeta(type)
  const Icon = meta.icon
  const id = `chip-${signerId ?? 'none'}-${type}`
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { kind: 'field-chip', type, signerId },
    disabled: disabled || signerId == null,
  })

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      aria-disabled={disabled || signerId == null}
      className={cn(
        'group/chip flex w-full items-center gap-2 rounded-sm border border-border bg-surface px-2.5 py-1.5 text-left text-xs font-medium text-ink transition-all',
        'hover:border-border-strong hover:bg-surface-hover hover:shadow-[var(--shadow-1)]',
        'active:cursor-grabbing',
        disabled || signerId == null
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-grab',
        isDragging && 'border-brand opacity-40 shadow-[var(--shadow-2)]',
      )}
    >
      <Icon
        className="size-3.5 shrink-0"
        strokeWidth={1.5}
        style={{ color: signerId == null ? 'var(--color-ink-faint)' : color }}
      />
      <span className="flex-1 truncate">{meta.label}</span>
      <GripVertical
        className="size-3 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover/chip:opacity-100"
        strokeWidth={1.5}
      />
    </button>
  )
}

export function FieldChipGhost({ type, color }: { type: FieldType; color: string }) {
  const meta = fieldTypeMeta(type)
  const Icon = meta.icon
  return (
    <div
      className="flex items-center gap-2 rounded-sm border border-brand bg-surface-raised px-2.5 py-1.5 text-xs font-medium text-ink shadow-[var(--shadow-2)]"
    >
      <Icon className="size-3.5 shrink-0" strokeWidth={1.5} style={{ color }} />
      <span>{meta.label}</span>
    </div>
  )
}
