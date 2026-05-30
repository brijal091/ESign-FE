'use client'

import { useEffect, useRef, useState } from 'react'
// NOTE: Parent must pass `key={field.id}` when rendering <FieldProperties /> so that the
// component remounts (and the useState initializers below re-fire) when the selected field
// changes. We deliberately avoid resetting drafts inside a useEffect — that pattern triggers
// the react-hooks/set-state-in-effect lint and causes cascading renders.
import { ChevronDown, Trash2, X } from 'lucide-react'
import { Button, Input, Switch, cn } from '@esign/ui'
import type { DocumentField, Signer } from '@esign/types'
import { fieldTypeMeta } from '../../lib/field-types'

interface FieldPropertiesProps {
  field: DocumentField
  signers: Signer[]
  onUpdate: (patch: Partial<DocumentField>) => void
  onDelete: () => void
  onClose: () => void
}

export function FieldProperties({
  field,
  signers,
  onUpdate,
  onDelete,
  onClose,
}: FieldPropertiesProps) {
  const meta = fieldTypeMeta(field.type)
  const Icon = meta.icon
  const [signerOpen, setSignerOpen] = useState(false)
  const signerRef = useRef<HTMLDivElement | null>(null)

  // Local debounced state for label/placeholder so typing isn't laggy.
  // Initialized from `field` once per mount; the consumer remounts via `key={field.id}` to
  // pick up a new selection (see note at top of file).
  const [labelDraft, setLabelDraft] = useState(() => field.label ?? '')
  const [placeholderDraft, setPlaceholderDraft] = useState(() => field.placeholder ?? '')

  // Close signer dropdown on outside click
  useEffect(() => {
    if (!signerOpen) return
    function onDown(e: MouseEvent) {
      if (!signerRef.current?.contains(e.target as Node)) setSignerOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [signerOpen])

  const currentSigner = signers.find((s) => s.id === field.signerId)
  const currentColor = currentSigner?.color ?? 'var(--color-signer-1)'

  const commitLabel = () => {
    if (labelDraft !== (field.label ?? '')) onUpdate({ label: labelDraft || undefined })
  }
  const commitPlaceholder = () => {
    if (placeholderDraft !== (field.placeholder ?? ''))
      onUpdate({ placeholder: placeholderDraft || undefined })
  }

  return (
    <div
      className={cn(
        'flex w-[280px] shrink-0 flex-col overflow-hidden border-l border-border bg-surface-raised',
        'animate-in slide-in-from-right-2 fade-in duration-200',
        'shadow-[var(--shadow-2)]',
      )}
    >
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-border-subtle px-3.5 py-3">
        <span
          className="grid size-7 shrink-0 place-items-center rounded-sm"
          style={{
            color: currentColor,
            backgroundColor: `color-mix(in oklch, ${currentColor} 14%, var(--color-surface))`,
          }}
        >
          <Icon className="size-3.5" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold leading-tight text-ink">
            {meta.label} field
          </div>
          <div className="text-[11px] text-ink-subtle">Configure this field</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close properties"
          className="grid size-6 place-items-center rounded text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
        >
          <X className="size-3.5" strokeWidth={1.5} />
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3.5 py-3.5">
        <PropField label="Label">
          <Input
            value={labelDraft}
            onChange={(e) => setLabelDraft(e.target.value)}
            onBlur={commitLabel}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur()
            }}
            placeholder={meta.label}
            className="h-8 text-xs"
          />
        </PropField>

        <PropField label="Placeholder">
          <Input
            value={placeholderDraft}
            onChange={(e) => setPlaceholderDraft(e.target.value)}
            onBlur={commitPlaceholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur()
            }}
            placeholder="(none)"
            className="h-8 text-xs"
          />
        </PropField>

        <label className="flex items-center justify-between border-t border-border-subtle pt-3">
          <span className="text-[13px] text-ink">Required</span>
          <Switch
            checked={field.required}
            onCheckedChange={(checked) => onUpdate({ required: checked })}
            size="sm"
          />
        </label>

        <PropField label="Assigned signer">
          <div ref={signerRef} className="relative">
            <button
              type="button"
              onClick={() => setSignerOpen((v) => !v)}
              className="flex h-8 w-full items-center gap-2 rounded-sm border border-border bg-surface px-2.5 text-left text-xs text-ink transition-colors hover:bg-surface-hover focus:border-brand focus:outline-none"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: currentColor }}
              />
              <span className="flex-1 truncate">
                {currentSigner?.name ?? 'Unassigned'}
              </span>
              <ChevronDown
                className={cn(
                  'size-3.5 shrink-0 text-ink-subtle transition-transform',
                  signerOpen && 'rotate-180',
                )}
                strokeWidth={1.5}
              />
            </button>
            {signerOpen && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-sm border border-border bg-surface-raised shadow-[var(--shadow-2)]">
                {signers.map((s) => {
                  const isCurrent = s.id === field.signerId
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onUpdate({ signerId: s.id })
                        setSignerOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs transition-colors',
                        isCurrent
                          ? 'bg-brand-soft/60 text-ink'
                          : 'text-ink-muted hover:bg-surface-hover hover:text-ink',
                      )}
                    >
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: s.color ?? 'var(--color-signer-1)' }}
                      />
                      <span className="min-w-0 flex-1 truncate font-medium">{s.name}</span>
                      {isCurrent && (
                        <span className="font-mono text-[10px] uppercase tracking-wide text-brand-strong">
                          ✓
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </PropField>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between gap-2 border-t border-border-subtle bg-surface px-3.5 py-2.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="gap-1.5 text-danger-strong hover:bg-danger-soft hover:text-danger-strong"
        >
          <Trash2 className="size-3.5" strokeWidth={1.5} />
          Delete
        </Button>
        <Button size="sm" onClick={onClose}>
          Done
        </Button>
      </footer>
    </div>
  )
}

function PropField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-subtle">
        {label}
      </span>
      {children}
    </div>
  )
}
