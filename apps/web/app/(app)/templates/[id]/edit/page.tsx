'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Bookmark,
  Eye,
  FileText,
  Hash,
  Plus,
  UserPlus,
} from 'lucide-react'
import { Button, Input, toast } from '@esign/ui'
import { useTemplate } from '../../../../../lib/hooks/use-templates'
import { fieldTypeMeta } from '../../../../../lib/field-types'

const ROLE_COLORS = [
  'var(--color-signer-1)',
  'var(--color-signer-2)',
  'var(--color-signer-3)',
  'var(--color-signer-4)',
  'var(--color-signer-5)',
  'var(--color-signer-6)',
]

function roleColor(idx: number | null): string {
  if (idx === null) return ROLE_COLORS[0]
  return ROLE_COLORS[idx % ROLE_COLORS.length]
}

function roleLabel(idx: number | null): string {
  if (idx === null) return 'Unassigned'
  return ['Recipient', 'Counterparty', 'Witness', 'Approver', 'CC', 'Other'][idx] ??
    `Role ${idx + 1}`
}

export default function TemplateEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: template, isLoading, isError } = useTemplate(id)
  const [tags, setTags] = useState('')

  if (isLoading) {
    return <div className="flex-1 p-6 text-sm text-ink-subtle">Loading template…</div>
  }

  if (isError || !template) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-paper p-6 text-center">
        <div className="text-lg font-semibold text-ink">Template not found</div>
        <Link
          href="/templates"
          className="text-sm font-medium text-brand-strong hover:underline"
        >
          Back to templates
        </Link>
      </div>
    )
  }

  // Group fields by role
  const roleIndexes = Array.from(
    new Set(template.fields.map((f) => f.signerIndex)),
  ).sort((a, b) => (a ?? -1) - (b ?? -1))

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-paper">
      {/* Top bar — design 08.02 */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
        <Link
          href="/templates"
          className="flex items-center gap-1.5 rounded-sm px-2 py-1 text-sm text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} />
          Templates
        </Link>

        <span className="h-5 w-px bg-border" />

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-[13px] text-ink-subtle">Template:</span>
          <span className="truncate text-base font-medium text-ink">
            {template.name}
          </span>
          {template.category ? (
            <span className="inline-flex items-center rounded-full border border-border bg-surface-raised px-2 py-0.5 text-[11px] font-medium text-ink-muted">
              {template.category}
            </span>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex w-44 items-center gap-1.5 rounded-sm border border-border bg-surface px-2 focus-within:border-brand">
            <Hash className="size-3.5 text-ink-faint" strokeWidth={1.5} />
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags…"
              className="h-8 border-0 bg-transparent px-0 text-xs hover:border-0 focus-visible:border-0 focus-visible:bg-transparent"
            />
          </div>

          <span className="h-5 w-px bg-border" />

          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5"
            onClick={() => toast.message('Preview not yet implemented')}
          >
            <Eye className="size-3.5" strokeWidth={1.5} />
            Preview
          </Button>

          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => toast.message('Template saved')}
          >
            <Bookmark className="size-3.5" strokeWidth={1.5} />
            Save as Template
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — Document + Signer roles + Field types (read-only) */}
        <aside className="flex w-[280px] shrink-0 flex-col overflow-auto border-r border-border bg-surface">
          <section className="border-b border-border-subtle px-3 py-4">
            <header className="mb-2 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-subtle">
                Document
              </h3>
              <span className="font-mono text-[10.5px] text-ink-faint">1</span>
            </header>
            <div className="flex items-center gap-2.5 rounded-sm border border-border-subtle bg-surface-raised p-2.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-sm bg-danger-soft text-danger-strong">
                <FileText className="size-4" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-ink">
                  {template.name}.pdf
                </div>
                <div className="mt-0.5 text-[11.5px] text-ink-subtle">
                  {template.pageCount ?? '—'} pages ·{' '}
                  {template.fileSizeBytes
                    ? `${(template.fileSizeBytes / 1024).toFixed(0)} KB`
                    : '—'}
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-border-subtle px-3 py-4">
            <header className="mb-2 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-subtle">
                Signer roles
              </h3>
              <button
                type="button"
                className="grid size-5 place-items-center rounded text-ink-subtle hover:bg-surface-hover hover:text-ink"
                aria-label="Add role"
                onClick={() => toast.message('Role editing not yet implemented')}
              >
                <UserPlus className="size-3.5" strokeWidth={1.5} />
              </button>
            </header>
            <div className="flex flex-col gap-1.5">
              {roleIndexes.length === 0 ? (
                <div className="rounded-sm border border-dashed border-border bg-surface-sunken px-2.5 py-3 text-[12px] text-ink-subtle">
                  No roles defined yet.
                </div>
              ) : (
                roleIndexes.map((idx) => {
                  const count = template.fields.filter((f) => f.signerIndex === idx).length
                  return (
                    <div
                      key={String(idx)}
                      className="flex items-center gap-2.5 rounded-sm border border-border-subtle bg-surface-raised px-2.5 py-2"
                    >
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ background: roleColor(idx) }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-medium text-ink">
                          {roleLabel(idx)}
                        </div>
                        <div className="text-[11px] text-ink-subtle">
                          role · filled at send
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-ink-faint">
                        {count}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </section>

          <section className="px-3 py-4">
            <header className="mb-2 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-subtle">
                Fields
              </h3>
              <span className="font-mono text-[10.5px] text-ink-faint">
                {template.fields.length}
              </span>
            </header>
            <div className="flex flex-col gap-1">
              {template.fields.length === 0 ? (
                <div className="rounded-sm border border-dashed border-border bg-surface-sunken px-2.5 py-3 text-[12px] text-ink-subtle">
                  No fields placed yet.
                </div>
              ) : (
                template.fields.map((f) => {
                  const meta = fieldTypeMeta(f.type)
                  const Icon = meta.icon
                  return (
                    <div
                      key={f.id}
                      className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-[12.5px] text-ink-muted hover:bg-surface-hover"
                    >
                      <span
                        className="size-1.5 shrink-0 rounded-full"
                        style={{ background: roleColor(f.signerIndex) }}
                      />
                      <Icon className="size-3.5 text-ink-subtle" strokeWidth={1.5} />
                      <span className="flex-1 truncate">{f.label ?? meta.label}</span>
                      <span className="font-mono text-[10.5px] text-ink-faint">
                        p{f.position.page}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </section>

          <div className="mt-auto p-3">
            <Button
              size="sm"
              variant="secondary"
              className="w-full gap-1.5"
              onClick={() => toast.message('Role editing not yet implemented')}
            >
              <Plus className="size-3.5" strokeWidth={1.5} />
              Add role
            </Button>
          </div>
        </aside>

        {/* Canvas — graceful no-preview state (template PDF not yet served by BE) */}
        <div className="flex flex-1 items-center justify-center overflow-auto bg-surface-sunken p-8">
          <div className="flex max-w-[440px] flex-col items-center gap-3 rounded-md border border-dashed border-border bg-surface px-8 py-10 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand-strong">
              <FileText className="size-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-lg text-ink">PDF preview unavailable</h3>
            <p className="text-[13px] leading-relaxed text-ink-muted">
              The template&apos;s {template.fields.length}{' '}
              {template.fields.length === 1 ? 'field is' : 'fields are'} listed in the
              sidebar. Visual placement on the PDF canvas will land once the template
              file endpoint ships on the backend.
            </p>
            <Link
              href="/templates"
              className="mt-2 text-[13px] font-medium text-brand-strong hover:underline"
            >
              Back to templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
