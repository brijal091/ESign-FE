'use client'

import Link from 'next/link'
import {
  Download,
  Send,
  XCircle,
  MoreHorizontal,
  Pencil,
  Activity,
  Copy,
  Trash2,
} from 'lucide-react'
import type { Document } from '@esign/types'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from '@esign/ui'
import { StatusBadge } from './status-badge'
import { SignerChips } from './signer-chips'
import { PdfThumb } from './pdf-thumb'
import { TagChip } from './tag-chip'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const month = d.toLocaleString('en-US', { month: 'short' })
  return `${month} ${d.getDate()}`
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

function relative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 0) return 'just now'
  const min = Math.floor(ms / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const days = Math.floor(hr / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

function lastActivityLabel(doc: Document): string {
  const iso = doc.updatedAt ?? doc.createdAt
  switch (doc.status) {
    case 'completed':
      return `Signed ${relative(iso)}`
    case 'signed':
      return `Signed ${relative(iso)}`
    case 'sent':
      return `Sent ${relative(iso)}`
    case 'viewed':
      return `Viewed ${relative(iso)}`
    case 'declined':
      return `Cancelled ${relative(iso)}`
    case 'expired':
      return `Expired ${relative(iso)}`
    default:
      return `Updated ${relative(iso)}`
  }
}

export interface DocumentsTableProps {
  documents: Document[]
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 px-3">
            <input
              type="checkbox"
              aria-label="Select all"
              className="size-3.5 rounded-xs border border-border-strong accent-[color:var(--brand)]"
            />
          </TableHead>
          <TableHead className="w-[110px]">Created</TableHead>
          <TableHead>Document</TableHead>
          <TableHead className="w-[200px]">Signers</TableHead>
          <TableHead className="w-[150px]">Status</TableHead>
          <TableHead className="w-[160px]">Last activity</TableHead>
          <TableHead className="w-[180px]">Tags</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => {
          const meta = metaLine(doc)
          const strike = doc.status === 'declined'
          return (
            <TableRow
              key={doc.id}
              className={strike ? 'text-ink-subtle [&_td]:line-through decoration-ink-faint' : undefined}
            >
              <TableCell className="px-3">
                <input
                  type="checkbox"
                  aria-label={`Select ${doc.title}`}
                  className="size-3.5 rounded-xs border border-border-strong accent-[color:var(--brand)]"
                />
              </TableCell>
              <TableCell className="font-mono text-[12px] tabular-nums text-ink-muted">
                {formatDate(doc.createdAt)}
              </TableCell>
              <TableCell>
                <Link
                  href={`/documents/${doc.id}`}
                  className="group flex min-w-0 items-center gap-3"
                >
                  <PdfThumb />
                  <span className="min-w-0">
                    <span
                      className={
                        strike
                          ? 'block truncate text-sm font-medium text-ink-subtle'
                          : 'block truncate text-sm font-medium text-ink group-hover:text-brand-strong'
                      }
                    >
                      {doc.title}
                    </span>
                    {meta ? (
                      <span className="mt-0.5 block truncate text-xs text-ink-subtle no-underline">
                        {meta}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </TableCell>
              <TableCell>
                <SignerChips signers={doc.signers} />
              </TableCell>
              <TableCell>
                <StatusBadge status={doc.status} />
              </TableCell>
              <TableCell className="text-[13px] text-ink-muted">
                {lastActivityLabel(doc)}
              </TableCell>
              <TableCell>
                {doc.tags.length === 0 ? (
                  <span className="text-xs text-ink-faint">—</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 2).map((t) => (
                      <TagChip key={t}>{t}</TagChip>
                    ))}
                    {doc.tags.length > 2 ? (
                      <TagChip>+{doc.tags.length - 2}</TagChip>
                    ) : null}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="More actions">
                      <MoreHorizontal className="size-4" strokeWidth={1.5} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/documents/${doc.id}`}>
                        <Activity className="size-3.5" strokeWidth={1.5} />
                        View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/documents/${doc.id}/edit`}>
                        <Pencil className="size-3.5" strokeWidth={1.5} />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => toast.message('Download not yet implemented')}
                    >
                      <Download className="size-3.5" strokeWidth={1.5} />
                      Download
                    </DropdownMenuItem>
                    {(doc.status === 'sent' || doc.status === 'viewed') ? (
                      <DropdownMenuItem
                        onSelect={() => toast.message('Resend not yet implemented')}
                      >
                        <Send className="size-3.5" strokeWidth={1.5} />
                        Resend
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem
                      onSelect={() => toast.message('Duplicate not yet implemented')}
                    >
                      <Copy className="size-3.5" strokeWidth={1.5} />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {(doc.status === 'sent' || doc.status === 'viewed' || doc.status === 'signed') ? (
                      <DropdownMenuItem
                        onSelect={() => toast.message('Cancel not yet implemented')}
                        className="text-danger-strong focus:text-danger-strong"
                      >
                        <XCircle className="size-3.5" strokeWidth={1.5} />
                        Cancel
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onSelect={() => toast.message('Delete not yet implemented')}
                        className="text-danger-strong focus:text-danger-strong"
                      >
                        <Trash2 className="size-3.5" strokeWidth={1.5} />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
