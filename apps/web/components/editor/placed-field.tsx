'use client'

import { useState, useCallback } from 'react'
import { cn } from '@esign/ui'
import type { DocumentField, FieldPosition } from '@esign/types'
import { fieldTypeMeta } from '../../lib/field-types'

const MIN_SIZE = 1 // percent

type Handle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

const HANDLE_CURSORS: Record<Handle, string> = {
  nw: 'nwse-resize',
  n: 'ns-resize',
  ne: 'nesw-resize',
  e: 'ew-resize',
  se: 'nwse-resize',
  s: 'ns-resize',
  sw: 'nesw-resize',
  w: 'ew-resize',
}

const HANDLE_POSITIONS: Record<Handle, string> = {
  nw: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2',
  n: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
  ne: 'right-0 top-0 translate-x-1/2 -translate-y-1/2',
  e: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
  se: 'right-0 bottom-0 translate-x-1/2 translate-y-1/2',
  s: 'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2',
  sw: 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2',
  w: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2',
}

const HANDLES: Handle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function applyResize(start: FieldPosition, handle: Handle, dx: number, dy: number): FieldPosition {
  let { x, y, width, height } = start
  const right = x + width
  const bottom = y + height

  if (handle.includes('e')) width = clamp(start.width + dx, MIN_SIZE, 100 - x)
  if (handle.includes('w')) {
    const newX = clamp(start.x + dx, 0, right - MIN_SIZE)
    width = right - newX
    x = newX
  }
  if (handle.includes('s')) height = clamp(start.height + dy, MIN_SIZE, 100 - y)
  if (handle.includes('n')) {
    const newY = clamp(start.y + dy, 0, bottom - MIN_SIZE)
    height = bottom - newY
    y = newY
  }
  return { page: start.page, x, y, width, height }
}

interface PlacedFieldProps {
  field: DocumentField
  color: string
  selected: boolean
  onSelect: () => void
  onCommit: (next: FieldPosition) => void
}

export function PlacedField({ field, color, selected, onSelect, onCommit }: PlacedFieldProps) {
  const meta = fieldTypeMeta(field.type)
  const Icon = meta.icon
  const [draft, setDraft] = useState<FieldPosition | null>(null)
  const pos = draft ?? field.position

  const startGesture = useCallback(
    (e: React.PointerEvent, handle: Handle | 'move') => {
      e.stopPropagation()
      e.preventDefault()

      if (!selected) onSelect()

      const pageEl = (e.currentTarget as HTMLElement).closest<HTMLElement>('[data-page]')
      if (!pageEl) return
      const rect = pageEl.getBoundingClientRect()

      const startX = e.clientX
      const startY = e.clientY
      const startPos: FieldPosition = { ...field.position }

      function onMove(ev: PointerEvent) {
        const dxPct = ((ev.clientX - startX) / rect.width) * 100
        const dyPct = ((ev.clientY - startY) / rect.height) * 100

        if (handle === 'move') {
          setDraft({
            page: startPos.page,
            width: startPos.width,
            height: startPos.height,
            x: clamp(startPos.x + dxPct, 0, 100 - startPos.width),
            y: clamp(startPos.y + dyPct, 0, 100 - startPos.height),
          })
        } else {
          setDraft(applyResize(startPos, handle, dxPct, dyPct))
        }
      }

      function onUp() {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        setDraft((prev) => {
          if (prev) onCommit(prev)
          return null
        })
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [field.position, selected, onSelect, onCommit],
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onPointerDown={(e) => startGesture(e, 'move')}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'pointer-events-auto absolute flex select-none items-center gap-1 rounded-sm border-2 px-1 text-[10px] font-medium leading-none',
        selected ? 'ring-2 ring-offset-1 ring-brand cursor-move' : 'cursor-pointer',
      )}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: `${pos.width}%`,
        height: `${pos.height}%`,
        borderColor: color,
        backgroundColor: `color-mix(in oklch, ${color} 18%, transparent)`,
        color,
      }}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span className="truncate">{meta.label}</span>

      {selected &&
        HANDLES.map((h) => (
          <span
            key={h}
            onPointerDown={(e) => startGesture(e, h)}
            className={cn(
              'absolute h-2 w-2 rounded-xs border bg-surface-raised',
              HANDLE_POSITIONS[h],
            )}
            style={{ borderColor: color, cursor: HANDLE_CURSORS[h] }}
          />
        ))}
    </div>
  )
}
