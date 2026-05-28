'use client'

import Link from 'next/link'
import {
  Download,
  RefreshCw,
  FileText,
  FileUp,
  MoreHorizontal,
  Pencil,
  Activity,
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

function formatDate(iso: string): string {
  const d = new Date(iso)
  const month = d.toLocaleString('en-US', { month: 'short' })
  return `${month} ${d.getDate()}, ${d.getFullYear()}`
}

function relative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const min = Math.floor(ms / 60000)
  if (min < 60) return `${Math.max(min, 1)}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const days = Math.floor(hr / 24)
  return `${days}d ago`
}

export function DocumentsTable({ documents }: { documents: Document[] }) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <span
          aria-hidden
          className="grid size-12 place-items-center rounded-md border border-border bg-surface-raised text-ink-faint shadow-[var(--shadow-1)]"
        >
          <FileUp className="size-5" />
        </span>
        <div>
          <div className="text-base font-semibold text-ink">No documents yet</div>
          <div className="mt-1 max-w-sm text-sm text-ink-muted">
            Upload a PDF to start collecting signatures.
          </div>
        </div>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 px-3">
            <input
              type="checkbox"
              className="size-3.5 rounded-xs border border-border text-brand accent-[color:var(--brand)]"
            />
          </TableHead>
          <TableHead className="w-36">Created</TableHead>
          <TableHead>Document</TableHead>
          <TableHead className="w-44">Signers</TableHead>
          <TableHead className="w-44">Status</TableHead>
          <TableHead className="w-36">Last activity</TableHead>
          <TableHead className="w-24 text-right" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="px-3">
              <input
                type="checkbox"
                className="size-3.5 rounded-xs border border-border accent-[color:var(--brand)]"
              />
            </TableCell>
            <TableCell className="font-mono text-xs tabular-nums text-ink-subtle">
              {formatDate(doc.createdAt)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Link
                  href={`/documents/${doc.id}`}
                  className="group inline-flex min-w-0 items-center gap-2.5"
                >
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-sm bg-danger-soft text-danger-strong"
                  >
                    <FileText className="size-4" />
                  </span>
                  <span className="truncate font-medium text-ink group-hover:text-brand-strong">
                    {doc.title}
                  </span>
                </Link>
                <Link
                  href={`/documents/${doc.id}/edit`}
                  className="ml-1 text-xs text-ink-subtle hover:text-brand-strong"
                >
                  Edit
                </Link>
              </div>
            </TableCell>
            <TableCell>
              <SignerChips signers={doc.signers} />
            </TableCell>
            <TableCell>
              <StatusBadge status={doc.status} />
            </TableCell>
            <TableCell className="text-xs text-ink-subtle">{relative(doc.createdAt)}</TableCell>
            <TableCell className="text-right">
              <div className="inline-flex items-center justify-end gap-1">
                {doc.status === 'sent' || doc.status === 'viewed' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.message('Not yet implemented')}
                  >
                    <RefreshCw className="size-3.5" />
                    Resend
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.message('Not yet implemented')}
                  >
                    <Download className="size-3.5" />
                    Download
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="More actions">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/documents/${doc.id}/edit`}>
                        <Pencil className="size-3.5" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/documents/${doc.id}?tab=activity`}>
                        <Activity className="size-3.5" />
                        View activity
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/documents/${doc.id}`}>Open</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
