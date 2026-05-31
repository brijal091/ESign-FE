'use client'

import { useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  TriangleAlert,
  UserPlus,
  X,
} from 'lucide-react'
import { ScrollArea, Tooltip, TooltipTrigger, TooltipContent, cn } from '@esign/ui'
import type { Document, Signer } from '@esign/types'
import { FIELD_TYPES } from '../../lib/field-types'
import { DraggableField } from './draggable-field'

const SIGNER_COLORS = [
  'var(--color-signer-1)',
  'var(--color-signer-2)',
  'var(--color-signer-3)',
  'var(--color-signer-4)',
  'var(--color-signer-5)',
  'var(--color-signer-6)',
]
const MAX_SIGNERS = SIGNER_COLORS.length

interface FieldSidebarProps {
  doc: Document
  selectedSignerId: string | null
  onSelectSigner: (id: string) => void
  onAddSigner: () => void
  onUpdateSigner: (id: string, patch: Partial<Signer>) => void
  onDeleteSigner: (id: string) => void
}

function SectionHeader({
  title,
  count,
  expanded,
  onToggle,
  action,
}: {
  title: string
  count?: number
  expanded: boolean
  onToggle: () => void
  action?: React.ReactNode
}) {
  return (
    <header className="flex items-center justify-between px-4 pb-2 pt-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-subtle"
      >
        {expanded ? (
          <ChevronDown className="size-3.5 text-ink-subtle" strokeWidth={1.5} />
        ) : (
          <ChevronRight className="size-3.5 text-ink-subtle" strokeWidth={1.5} />
        )}
        <span>{title}</span>
        {count !== undefined && (
          <span className="ml-1 rounded-full bg-surface-sunken px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">
            {count}
          </span>
        )}
      </button>
      {action}
    </header>
  )
}

export function FieldSidebar({
  doc,
  selectedSignerId,
  onSelectSigner,
  onAddSigner,
  onUpdateSigner,
  onDeleteSigner,
}: FieldSidebarProps) {
  const [docOpen, setDocOpen] = useState(true)
  const [recipientsOpen, setRecipientsOpen] = useState(true)

  const selectedSigner = useMemo(
    () => doc.signers.find((s) => s.id === selectedSignerId) ?? null,
    [doc.signers, selectedSignerId],
  )
  const selectedSignerColor =
    selectedSigner?.color ??
    SIGNER_COLORS[(doc.signers.findIndex((s) => s.id === selectedSignerId) + SIGNER_COLORS.length) % SIGNER_COLORS.length]

  const fieldCountBySigner = useMemo(() => {
    const m = new Map<string | null, number>()
    for (const f of doc.fields) m.set(f.signerId, (m.get(f.signerId) ?? 0) + 1)
    return m
  }, [doc.fields])

  return (
    <aside className="flex h-full min-h-0 w-80 shrink-0 flex-col border-l border-border bg-surface">
      <ScrollArea className="min-h-0 flex-1">
        {/* ───── Document ───── */}
        <section className="border-b border-border-subtle pb-3">
          <SectionHeader
            title="Document"
            count={1}
            expanded={docOpen}
            onToggle={() => setDocOpen((v) => !v)}
          />
          {docOpen && (
            <div className="px-3">
              <div className="flex items-center gap-2.5 rounded-sm border border-border-subtle bg-surface-raised px-2.5 py-2">
                <PdfThumb />
                <div className="min-w-0 flex-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-[13px] font-medium text-ink">
                        {doc.title.length > 20 ? `${doc.title.slice(0, 20)}…` : doc.title}
                      </div>
                    </TooltipTrigger>
                    {doc.title.length > 20 && (
                      <TooltipContent side="right">{doc.title}</TooltipContent>
                    )}
                  </Tooltip>
                  <div className="mt-0.5 text-[11.5px] text-ink-subtle">PDF document</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ───── Recipients ───── */}
        <section className="border-b border-border-subtle pb-3">
          <SectionHeader
            title="Recipients"
            count={doc.signers.length}
            expanded={recipientsOpen}
            onToggle={() => setRecipientsOpen((v) => !v)}
            action={
              doc.signers.length >= MAX_SIGNERS ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      disabled
                      aria-label="Add signer"
                      className="grid size-[22px] place-items-center rounded text-ink-faint opacity-50"
                    >
                      <UserPlus className="size-3.5" strokeWidth={1.5} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Maximum {MAX_SIGNERS} signers in v1</TooltipContent>
                </Tooltip>
              ) : (
                <button
                  type="button"
                  onClick={onAddSigner}
                  aria-label="Add signer"
                  className="grid size-[22px] place-items-center rounded text-ink-subtle transition-colors hover:bg-surface-hover hover:text-ink"
                >
                  <UserPlus className="size-3.5" strokeWidth={1.5} />
                </button>
              )
            }
          />
          {recipientsOpen && (
            <div className="px-3">
              <div className="flex flex-col gap-1.5">
                {doc.signers.map((signer, i) => (
                  <SignerRow
                    key={signer.id}
                    signer={signer}
                    color={signer.color ?? SIGNER_COLORS[i % SIGNER_COLORS.length]}
                    isSelected={signer.id === selectedSignerId}
                    canDelete={doc.signers.length > 1}
                    fieldCount={fieldCountBySigner.get(signer.id) ?? 0}
                    onSelect={() => onSelectSigner(signer.id)}
                    onChangeName={(name) => onUpdateSigner(signer.id, { name })}
                    onChangeEmail={(email) => onUpdateSigner(signer.id, { email })}
                    onDelete={() => onDeleteSigner(signer.id)}
                  />
                ))}
              </div>

              {/* Warning for unassigned signer */}
              {selectedSigner && (fieldCountBySigner.get(selectedSigner.id) ?? 0) === 0 && (
                <div className="mt-2 flex items-start gap-1.5 rounded-sm border border-warning/40 bg-warning-soft px-2.5 py-2 text-[11.5px] leading-snug text-warning-strong">
                  <TriangleAlert className="mt-px size-3.5 shrink-0" strokeWidth={1.5} />
                  <span>Drag a field type onto the PDF to assign it to {selectedSigner.name}.</span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ───── Field types palette ───── */}
        <section className="pb-3">
          <header className="flex items-center justify-between px-4 pb-2 pt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-subtle">
                Field types
              </span>
              <span className="text-[10px] font-semibold text-ink-faint">
                {FIELD_TYPES.length}
              </span>
            </div>
            {selectedSigner && (
              <span className="flex items-center gap-1 text-[10px] text-ink-faint">
                <span>Drag onto</span>
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ backgroundColor: selectedSignerColor }}
                />
                <span className="max-w-[110px] truncate font-medium text-ink-muted">
                  {selectedSigner.name}
                </span>
              </span>
            )}
          </header>
          {selectedSignerId == null ? (
            <div className="mx-3 flex items-start gap-2 rounded-sm border border-brand/30 bg-brand-soft px-3 py-2.5 text-[12px] leading-snug text-brand-strong">
              <span className="mt-px shrink-0 text-base leading-none">↑</span>
              <span>Select a recipient above to start placing fields on the PDF.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5 px-3">
              {FIELD_TYPES.map((meta) => (
                <DraggableField
                  key={meta.type}
                  type={meta.type}
                  signerId={selectedSignerId}
                  color={selectedSignerColor}
                  disabled={false}
                />
              ))}
            </div>
          )}
        </section>
      </ScrollArea>

      <div className="z-10 mt-auto shrink-0 border-t border-border-subtle bg-surface-raised p-3">
        {doc.signers.length >= MAX_SIGNERS ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                disabled
                className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-dashed border-border px-3 py-1.5 text-xs text-ink-faint opacity-60"
              >
                <UserPlus className="size-3.5" strokeWidth={1.5} />
                Add signer
              </button>
            </TooltipTrigger>
            <TooltipContent>Maximum {MAX_SIGNERS} signers in v1</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={onAddSigner}
            className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-dashed border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-brand hover:bg-brand-soft/40 hover:text-brand-strong"
          >
            <UserPlus className="size-3.5" strokeWidth={1.5} />
            Add signer
          </button>
        )}
      </div>
    </aside>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   PdfThumb — small page-shaped chip with a folded corner and brand accent.
   ─────────────────────────────────────────────────────────────────────── */
function PdfThumb() {
  return (
    <div className="relative grid size-9 shrink-0 place-items-end overflow-hidden rounded-[3px] border border-border-strong bg-surface-raised">
      {/* paper rules */}
      <div className="absolute inset-x-1 top-1.5 flex flex-col gap-1">
        <span className="h-px bg-border-subtle" />
        <span className="h-px w-3/4 bg-border-subtle" />
        <span className="h-px w-1/2 bg-border-subtle" />
      </div>
      {/* corner fold */}
      <span
        className="absolute right-0 top-0 size-2.5 bg-surface-sunken"
        style={{ clipPath: 'polygon(0 0, 100% 100%, 100% 0)' }}
      />
      {/* PDF label */}
      <span className="mb-0.5 mr-0.5 rounded-[2px] bg-danger px-1 font-mono text-[8px] font-semibold leading-none tracking-tight text-white">
        PDF
      </span>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────────────────────
   SignerRow — collapsed: colored dot · name · count · X
                edit:     name + email inputs
   ─────────────────────────────────────────────────────────────────────── */
interface SignerRowProps {
  signer: Signer
  color: string
  isSelected: boolean
  canDelete: boolean
  fieldCount: number
  onSelect: () => void
  onChangeName: (name: string) => void
  onChangeEmail: (email: string) => void
  onDelete: () => void
}

function SignerRow({
  signer,
  color,
  isSelected,
  canDelete,
  fieldCount,
  onSelect,
  onChangeName,
  onChangeEmail,
  onDelete,
}: SignerRowProps) {
  const [editing, setEditing] = useState(false)
  // Local copies — only committed on blur/Enter, never on every keystroke
  const [localName, setLocalName] = useState(signer.name)
  const [localEmail, setLocalEmail] = useState(signer.email)

  function openEdit() {
    setLocalName(signer.name)
    setLocalEmail(signer.email)
    setEditing(true)
  }

  function commit() {
    const trimmedName = localName.trim()
    const trimmedEmail = localEmail.trim()
    if (trimmedName && trimmedName !== signer.name) onChangeName(trimmedName)
    if (trimmedEmail !== signer.email) onChangeEmail(trimmedEmail)
    setEditing(false)
  }

  function cancel() {
    setLocalName(signer.name)
    setLocalEmail(signer.email)
    setEditing(false)
  }

  // Close and commit when focus moves fully outside the edit area
  function handleEditBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      commit()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') { e.preventDefault(); cancel() }
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-sm border bg-surface transition-colors',
        isSelected ? 'border-brand bg-brand-soft/50' : 'border-border-subtle hover:bg-surface-hover',
      )}
    >
      {isSelected && (
        <span
          className="pointer-events-none absolute inset-y-0 left-0 w-[2px]"
          style={{ backgroundColor: 'var(--color-brand)' }}
        />
      )}
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center gap-2.5 px-2.5 py-2 pl-3 text-left"
      >
        <span
          className="size-3 shrink-0 rounded-full ring-2 ring-surface"
          style={{ backgroundColor: color, boxShadow: `0 0 0 1.5px ${color}` }}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-medium text-ink">{signer.name}</div>
          {signer.email && (
            <div className="mt-px truncate text-[11.5px] text-ink-subtle">{signer.email}</div>
          )}
        </div>
        {fieldCount > 0 && (
          <span
            className="rounded-full border bg-surface-raised px-1.5 py-px font-mono text-[10.5px] font-semibold"
            style={{ color, borderColor: color }}
          >
            {fieldCount}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); editing ? commit() : openEdit() }}
          aria-label="Edit signer"
          className="grid size-[22px] shrink-0 place-items-center rounded text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
        >
          <Pencil className="size-3" strokeWidth={1.5} />
        </button>
        {canDelete && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            aria-label="Remove signer"
            className="grid size-[22px] shrink-0 place-items-center rounded text-ink-faint transition-colors hover:bg-surface-hover hover:text-danger-strong"
          >
            <X className="size-3.5" strokeWidth={1.5} />
          </button>
        )}
      </button>

      {editing && (
        <div
          className="flex flex-col gap-1.5 px-2.5 pb-2.5"
          onBlur={handleEditBlur}
          onKeyDown={handleKeyDown}
        >
          <input
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            autoFocus
            placeholder="Name"
            className="rounded-sm border border-border bg-surface px-2 py-1 text-xs text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-brand"
          />
          <input
            type="email"
            value={localEmail}
            onChange={(e) => setLocalEmail(e.target.value)}
            placeholder="email@example.com"
            className="rounded-sm border border-border bg-surface px-2 py-1 text-xs text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-brand"
          />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={commit}
              className="flex-1 rounded-sm bg-brand px-2 py-1 text-[11px] font-medium text-white transition-colors hover:bg-brand-hover"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancel}
              className="flex-1 rounded-sm border border-border px-2 py-1 text-[11px] font-medium text-ink-muted transition-colors hover:bg-surface-hover"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

