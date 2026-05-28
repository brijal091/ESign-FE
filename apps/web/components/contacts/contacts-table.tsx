'use client'

import { useMemo, useState } from 'react'
import { MoreHorizontal, Pencil, Trash2, Search, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@esign/ui'
import type { Contact } from '@esign/types'
import { useContacts, useDeleteContact } from '../../lib/hooks/use-contacts'
import { SIGNER_COLORS, initials } from '../templates/data'

interface Props {
  onEdit: (c: Contact) => void
  onAdd: () => void
}

function fullName(c: Contact): string {
  return `${c.firstName} ${c.lastName}`.trim() || '(no name)'
}

export function ContactsTable({ onEdit, onAdd }: Props) {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const { data, isLoading, isError, error } = useContacts(page)
  const deleteMut = useDeleteContact()

  const filtered = useMemo(() => {
    if (!data) return []
    const needle = q.trim().toLowerCase()
    if (!needle) return data
    return data.filter((c) => {
      return (
        fullName(c).toLowerCase().includes(needle) ||
        c.email.toLowerCase().includes(needle) ||
        c.company.toLowerCase().includes(needle) ||
        c.phone.toLowerCase().includes(needle)
      )
    })
  }, [data, q])

  async function onDelete(c: Contact) {
    if (!confirm(`Delete contact "${fullName(c)}"?`)) return
    try {
      await deleteMut.mutateAsync(c.id)
      toast.success('Contact deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-80 items-center gap-2.5 rounded-sm border border-border bg-surface px-3 focus-within:border-brand">
          <Search className="size-[15px] text-ink-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, company, phone…"
            className="flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-faint"
          />
        </div>
        <div className="flex-1" />
        <span className="text-xs text-ink-subtle">
          {data ? `${filtered.length} of ${data.length}` : ''}
        </span>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-40">Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-danger-strong">
                  {error instanceof Error ? error.message : 'Failed to load contacts'}
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10">
                  <EmptyState
                    icon={<UserPlus className="size-6" />}
                    title={q ? 'No matches' : 'No contacts yet'}
                    body={q ? 'Try a different search term.' : 'Add a contact or import a CSV.'}
                    action={q ? undefined : <Button onClick={onAdd}>Add contact</Button>}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c, idx) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-ink-inverse"
                        style={{ background: SIGNER_COLORS[idx % SIGNER_COLORS.length] }}
                      >
                        {initials(fullName(c))}
                      </span>
                      <span className="truncate text-[13.5px] font-medium text-ink">{fullName(c)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="truncate text-[13px] text-ink-muted">{c.email || '—'}</TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs tabular-nums text-ink-muted">
                    {c.phone || '—'}
                  </TableCell>
                  <TableCell className="truncate text-[13px] text-ink">{c.company || '—'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {c.tags.length === 0 ? (
                        <span className="text-xs text-ink-faint">—</span>
                      ) : (
                        c.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-full border border-border bg-surface-sunken px-2 py-0.5 text-[11px] font-medium text-ink-muted"
                          >
                            {t}
                          </span>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="grid size-7 place-items-center rounded-sm text-ink-faint hover:bg-surface-hover hover:text-ink">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(c)}>
                          <Pencil className="mr-2 size-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(c)} className="text-danger-strong">
                          <Trash2 className="mr-2 size-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-border-subtle bg-surface-sunken px-5 py-3">
          <span className="text-[13px] text-ink-muted">Page {page}</span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-sm border border-border bg-surface px-2.5 py-1 text-[13px] text-ink hover:bg-surface-hover disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={!data || data.length < 10}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-sm border border-border bg-surface px-2.5 py-1 text-[13px] text-ink hover:bg-surface-hover disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
