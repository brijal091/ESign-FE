import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AlignLeft,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  X,
} from 'lucide-react'
import type { SignerField } from '../../lib/api'

/* ---------- helpers ---------- */

const INPUT_TYPE: Record<string, string> = {
  email: 'email',
  phone: 'tel',
  date: 'date',
  text: 'text',
  name: 'text',
  company: 'text',
}

const PLACEHOLDER: Record<string, string> = {
  email: 'name@company.com',
  phone: '+1 555 0100',
  company: 'Acme Inc.',
  name: 'Full name',
  text: 'Type here…',
}

function parseOptions(field: SignerField): string[] {
  // Selection options ride along in `placeholder` as a "|"-separated list.
  // Falls back to empty array; caller is expected to degrade to text input.
  const raw = field.placeholder ?? ''
  if (!raw.includes('|')) return []
  return raw
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
}

/* ---------- shared shell: floating popover anchored to a field ---------- */

function PopoverSurface({
  onClose,
  children,
  align = 'below',
  width = 248,
}: {
  onClose: () => void
  children: React.ReactNode
  align?: 'below' | 'overlay'
  width?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute z-30 rounded-md border border-border bg-surface-raised shadow-[var(--shadow-3)]"
      style={{
        width,
        left: '50%',
        transform: 'translateX(-50%)',
        ...(align === 'below' ? { top: 'calc(100% + 6px)' } : { top: 0 }),
      }}
      role="dialog"
    >
      {children}
    </div>
  )
}

/* ---------- 1. Inline text input (text / email / phone / company / name) ---------- */

export function InlineTextEditor({
  field,
  defaultValue,
  onCommit,
  onCancel,
}: {
  field: SignerField
  defaultValue?: string
  onCommit: (value: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState(field.filledValue ?? defaultValue ?? '')
  const ref = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    ref.current?.focus()
    ref.current?.select()
  }, [])

  const inputType = INPUT_TYPE[field.type] ?? 'text'

  function commit() {
    const trimmed = value.trim()
    if (trimmed.length === 0 && field.required) {
      onCancel()
      return
    }
    onCommit(trimmed)
  }

  return (
    <input
      ref={ref}
      type={inputType}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          commit()
        } else if (e.key === 'Escape') {
          e.preventDefault()
          onCancel()
        }
      }}
      placeholder={field.placeholder ?? PLACEHOLDER[field.type] ?? field.label ?? ''}
      className="absolute inset-0 z-30 w-full rounded-xs border-[1.5px] border-brand bg-surface px-1.5 text-[11px] font-medium text-ink outline-none placeholder:text-ink-faint"
      style={{
        boxShadow: '0 0 0 4px oklch(0.665 0.155 38 / 0.22)',
      }}
    />
  )
}

/* ---------- 2. Multiline textarea (floating popover) ---------- */

export function MultilineEditor({
  field,
  onCommit,
  onCancel,
}: {
  field: SignerField
  onCommit: (value: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState(field.filledValue ?? '')
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    ref.current?.focus()
    ref.current?.select()
  }, [])

  function commit() {
    onCommit(value.trim())
  }

  return (
    <PopoverSurface onClose={onCancel} width={280}>
      <div className="px-3 pb-1 pt-2.5">
        <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-subtle">
          <AlignLeft className="size-3" /> {field.label ?? 'Multiline text'}
        </div>
        <textarea
          ref={ref}
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={field.placeholder ?? 'Type your answer…'}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault()
              onCancel()
            }
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              commit()
            }
          }}
          className="min-h-[88px] w-full resize-y rounded-sm border border-border bg-surface px-2.5 py-2 text-[13px] leading-snug text-ink outline-none placeholder:text-ink-faint focus:border-brand"
        />
      </div>
      <div className="flex items-center justify-end gap-1.5 border-t border-border-subtle bg-surface px-3 py-2">
        <button
          onClick={onCancel}
          className="rounded-sm px-2.5 py-1 text-xs font-medium text-ink-muted hover:bg-surface-hover"
        >
          Cancel
        </button>
        <button
          onClick={commit}
          disabled={field.required && value.trim().length === 0}
          className="inline-flex items-center gap-1 rounded-sm bg-brand px-3 py-1 text-xs font-semibold text-ink-inverse hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check className="size-3" strokeWidth={2.5} /> Save
        </button>
      </div>
    </PopoverSurface>
  )
}

/* ---------- 3. Date popover (uses native date input, styled to brand) ---------- */

export function DateEditor({
  field,
  onCommit,
  onCancel,
}: {
  field: SignerField
  onCommit: (value: string) => void
  onCancel: () => void
}) {
  const today = new Date().toISOString().slice(0, 10)
  const [value, setValue] = useState(field.filledValue ?? today)
  const ref = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <PopoverSurface onClose={onCancel} width={232}>
      <div className="px-3 py-2.5">
        <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-subtle">
          <CalendarIcon className="size-3" /> {field.label ?? 'Pick a date'}
        </div>
        <input
          ref={ref}
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault()
              onCancel()
            }
            if (e.key === 'Enter') {
              e.preventDefault()
              onCommit(value)
            }
          }}
          className="w-full rounded-sm border border-border bg-surface px-2.5 py-2 text-[13px] font-medium text-ink outline-none focus:border-brand"
        />
        <div className="mt-2 flex items-center justify-between gap-1.5">
          <button
            onClick={() => onCommit(today)}
            className="rounded-sm px-2 py-1 text-[11px] font-medium text-brand-strong hover:bg-brand-soft"
          >
            Today
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onCancel}
              className="rounded-sm px-2 py-1 text-[11px] font-medium text-ink-muted hover:bg-surface-hover"
            >
              Cancel
            </button>
            <button
              onClick={() => onCommit(value)}
              className="inline-flex items-center gap-1 rounded-sm bg-brand px-2.5 py-1 text-[11px] font-semibold text-ink-inverse hover:bg-brand-hover"
            >
              <Check className="size-3" strokeWidth={2.5} /> Set
            </button>
          </div>
        </div>
      </div>
    </PopoverSurface>
  )
}

/* ---------- 4. Selection dropdown ---------- */

export function SelectionEditor({
  field,
  onCommit,
  onCancel,
}: {
  field: SignerField
  onCommit: (value: string) => void
  onCancel: () => void
}) {
  const options = parseOptions(field)

  // No options → degrade to a focused text input.
  if (options.length === 0) {
    return <InlineTextEditor field={field} onCommit={onCommit} onCancel={onCancel} />
  }

  return (
    <PopoverSurface onClose={onCancel} width={236}>
      <div className="flex items-center justify-between px-3 pb-1.5 pt-2.5">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-subtle">
          <ChevronDown className="size-3" /> {field.label ?? 'Choose one'}
        </div>
        <button
          onClick={onCancel}
          aria-label="Close"
          className="grid size-5 place-items-center rounded-xs text-ink-subtle hover:bg-surface-hover hover:text-ink"
        >
          <X className="size-3" />
        </button>
      </div>
      <div className="p-1.5 pt-0">
        {options.map((o) => {
          const isSel = field.filledValue === o
          return (
            <button
              key={o}
              type="button"
              onClick={() => onCommit(o)}
              className={`flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-[13px] transition-colors ${
                isSel
                  ? 'bg-brand-soft font-semibold text-brand-strong'
                  : 'font-medium text-ink hover:bg-brand-soft/60 hover:text-brand-strong'
              }`}
            >
              <span className="flex-1 truncate">{o}</span>
              {isSel ? <Check className="size-3.5 text-brand-strong" strokeWidth={2.5} /> : null}
            </button>
          )
        })}
      </div>
    </PopoverSurface>
  )
}
