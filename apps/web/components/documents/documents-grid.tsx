'use client'

import Link from 'next/link'
import type { Document } from '@esign/types'
import { StatusBadge } from './status-badge'
import { SignerChips } from './signer-chips'
import { PdfThumb } from './pdf-thumb'
import { TagChip } from './tag-chip'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' })
}

function formatBytes(bytes?: number): string | null {
  if (!bytes || bytes <= 0) return null
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function metaLine(doc: Document): string {
  const parts: string[] = []
  if (doc.pageCount && doc.pageCount > 0) {
    parts.push(`${doc.pageCount} page${doc.pageCount === 1 ? '' : 's'}`)
  }
  const size = formatBytes(doc.fileSizeBytes)
  if (size) parts.push(size)
  return parts.join(' · ')
}

interface DocumentsGridProps {
  documents: Document[]
}

export function DocumentsGrid({ documents }: DocumentsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((doc) => {
        const meta = metaLine(doc)
        const strike = doc.status === 'declined'
        return (
          <Link
            key={doc.id}
            href={`/documents/${doc.id}`}
            className="group flex flex-col gap-3 rounded-md border border-border bg-surface p-4 shadow-[var(--shadow-1)] transition-colors hover:border-border-strong hover:bg-surface-raised"
          >
            <div className="flex items-start gap-3">
              <PdfThumb />
              <div className="min-w-0 flex-1">
                <div
                  className={
                    strike
                      ? 'line-clamp-2 text-sm font-medium text-ink-subtle line-through decoration-ink-faint'
                      : 'line-clamp-2 text-sm font-medium text-ink group-hover:text-brand-strong'
                  }
                >
                  {doc.title}
                </div>
                {meta ? (
                  <div className="mt-1 text-xs text-ink-subtle">{meta}</div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge status={doc.status} />
              {doc.tags.slice(0, 2).map((t) => (
                <TagChip key={t}>{t}</TagChip>
              ))}
              {doc.tags.length > 2 ? (
                <TagChip>+{doc.tags.length - 2}</TagChip>
              ) : null}
            </div>

            <div className="mt-auto flex items-center justify-between pt-1">
              <SignerChips signers={doc.signers} />
              <span className="font-mono text-[11px] tabular-nums text-ink-subtle">
                {formatDate(doc.createdAt)}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
