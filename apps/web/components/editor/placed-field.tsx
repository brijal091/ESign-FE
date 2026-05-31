'use client'

import { useState, useCallback, useEffect } from 'react'
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
  signerName: string
  selected: boolean
  onSelect: () => void
  onCommit: (next: FieldPosition) => void
}

export function PlacedField({
  field,
  color,
  signerName,
  selected,
  onSelect,
  onCommit,
}: PlacedFieldProps) {
  const meta = fieldTypeMeta(field.type)
  const Icon = meta.icon
  const [draft, setDraft] = useState<FieldPosition | null>(null)
  const pos = draft ?? field.position

  // Clear draft only after field.position has been updated (optimistic or server).
  // This prevents a flicker frame where draft=null but field.position is still stale.
  const { x, y, width, height } = field.position
  useEffect(() => {
    setDraft(null)
  }, [x, y, width, height])

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
        // Keep draft alive — cleared by the useEffect above once field.position syncs.
        // Clearing it here would cause a 1-frame snap back to the old position.
        setDraft((prev) => {
          if (prev) onCommit(prev)
          return prev
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
        'pointer-events-auto group/field absolute select-none rounded-[3px] transition-shadow',
        selected ? 'cursor-move' : 'cursor-pointer',
      )}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: `${pos.width}%`,
        height: `${pos.height}%`,
        border: selected ? '2px solid var(--color-brand)' : `1.5px dashed ${color}`,
        background: `color-mix(in oklch, ${color} 14%, var(--color-surface))`,
        boxShadow: selected ? 'var(--shadow-focus)' : undefined,
      }}
    >
      {/* Colored top tag showing signer name (visible on hover or when selected) */}
      <span
        className={cn(
          'pointer-events-none absolute -top-[1px] left-0 flex max-w-full -translate-y-full items-center gap-1 rounded-t-[3px] px-1.5 py-[3px] font-mono text-[9.5px] font-semibold uppercase leading-none tracking-tight text-white shadow-[var(--shadow-1)]',
          selected ? 'opacity-100' : 'opacity-0 transition-opacity group-hover/field:opacity-100',
        )}
        style={{ backgroundColor: color }}
      >
        <Icon className="size-2.5 shrink-0" strokeWidth={1.5} />
        <span className="truncate">{signerName}</span>
      </span>

      {/* Body: icon + label */}
      <div
        className="flex h-full items-center gap-1 overflow-hidden px-1.5 text-[10px] font-medium leading-none"
        style={{ color }}
      >
        <Icon className="size-3 shrink-0" strokeWidth={1.5} />
        <span className="truncate">{field.label ?? meta.label}</span>
      </div>

      {/* Resize handles (only when selected) */}
      {selected &&
        HANDLES.map((h) => (
          <span
            key={h}
            onPointerDown={(e) => startGesture(e, h)}
            className={cn(
              'absolute h-2 w-2 rounded-[2px] border-[1.5px] border-surface',
              HANDLE_POSITIONS[h],
            )}
            style={{ backgroundColor: 'var(--color-brand)', cursor: HANDLE_CURSORS[h] }}
          />
        ))}

      {/* Permanent small SE handle when not selected (matches design's resize dot) */}
      {!selected && (
        <span
          className="pointer-events-none absolute -bottom-[3px] -right-[3px] size-2 rounded-[2px] border-[1.5px] border-surface opacity-70"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  )
}
