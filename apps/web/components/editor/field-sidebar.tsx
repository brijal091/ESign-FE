'use client'

import { useState } from 'react'
import { ChevronDown, FileText, Trash2, UserPlus } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ScrollArea,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  cn,
} from '@esign/ui'
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
      {children}
    </div>
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
  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-surface">
      {/* Document section */}
      <SectionLabel>Document</SectionLabel>
      <div className="mx-3 mb-2 flex items-center gap-2.5 rounded-sm border border-border bg-surface-raised px-3 py-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-danger-soft text-danger-strong">
          <FileText className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-ink">{doc.title}</div>
          <div className="text-xs text-ink-subtle">PDF document</div>
        </div>
      </div>

      <div className="h-px bg-border-subtle" />

      {/* Recipients section */}
      <SectionLabel>Recipients</SectionLabel>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1.5 px-3 pb-3">
          {doc.signers.map((signer, i) => (
            <SignerSection
              key={signer.id}
              signer={signer}
              colorFallback={SIGNER_COLORS[i % SIGNER_COLORS.length]}
              isSelected={signer.id === selectedSignerId}
              canDelete={doc.signers.length > 1}
              onSelect={() => onSelectSigner(signer.id)}
              onChangeName={(name) => onUpdateSigner(signer.id, { name })}
              onChangeEmail={(email) => onUpdateSigner(signer.id, { email })}
              onDelete={() => onDeleteSigner(signer.id)}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="h-px bg-border-subtle" />

      <div className="p-3">
        {doc.signers.length >= MAX_SIGNERS ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                disabled
                className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-dashed border-border px-3 py-2 text-xs text-ink-faint opacity-60"
              >
                <UserPlus className="size-3.5" />
                Add signer
              </button>
            </TooltipTrigger>
            <TooltipContent>Maximum {MAX_SIGNERS} signers in v1</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={onAddSigner}
            className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-dashed border-border px-3 py-2 text-xs font-medium text-brand-strong transition-colors hover:bg-brand-soft/50"
          >
            <UserPlus className="size-3.5" />
            Add signer
          </button>
        )}
      </div>
    </aside>
  )
}

interface SignerSectionProps {
  signer: Signer
  colorFallback: string
  isSelected: boolean
  canDelete: boolean
  onSelect: () => void
  onChangeName: (name: string) => void
  onChangeEmail: (email: string) => void
  onDelete: () => void
}

function SignerSection({
  signer,
  colorFallback,
  isSelected,
  canDelete,
  onSelect,
  onChangeName,
  onChangeEmail,
  onDelete,
}: SignerSectionProps) {
  const [open, setOpen] = useState(true)
  const [editing, setEditing] = useState(false)
  const color = signer.color ?? colorFallback

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          'overflow-hidden rounded-md border bg-surface-raised transition-colors',
          isSelected ? 'border-transparent' : 'border-border',
        )}
        style={isSelected ? { boxShadow: `inset 3px 0 0 0 ${color}` } : undefined}
      >
        <div
          className={cn(
            'flex items-center gap-2 px-2.5 py-2',
            isSelected && 'bg-surface-hover/60',
          )}
        >
          <CollapsibleTrigger className="rounded-xs p-0.5 text-ink-subtle hover:bg-surface-hover">
            <ChevronDown
              className={cn('size-3.5 transition-transform', !open && '-rotate-90')}
            />
          </CollapsibleTrigger>
          <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          <button
            type="button"
            onClick={() => {
              onSelect()
              setEditing(true)
            }}
            className="flex-1 truncate text-left text-sm font-medium text-ink"
          >
            {signer.name}
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xs p-1 text-ink-faint hover:bg-surface-hover hover:text-danger-strong"
              aria-label="Remove signer"
            >
              <Trash2 className="size-3" />
            </button>
          )}
        </div>

        {editing && (
          <div className="flex flex-col gap-1.5 px-2.5 pb-2.5">
            <input
              type="text"
              value={signer.name}
              onChange={(e) => onChangeName(e.target.value)}
              onBlur={() => setEditing(false)}
              autoFocus
              className="rounded-sm border border-border bg-surface px-2 py-1 text-xs text-ink outline-none focus:border-brand"
            />
            <input
              type="email"
              value={signer.email}
              onChange={(e) => onChangeEmail(e.target.value)}
              className="rounded-sm border border-border bg-surface px-2 py-1 text-xs text-ink outline-none focus:border-brand"
            />
          </div>
        )}

        <CollapsibleContent>
          <div className="grid grid-cols-2 gap-1.5 px-2.5 pb-2.5" onPointerDown={onSelect}>
            {FIELD_TYPES.map((meta) => (
              <DraggableField
                key={meta.type}
                type={meta.type}
                signerId={signer.id}
                color={color}
              />
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
