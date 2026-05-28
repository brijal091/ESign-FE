'use client'

import { useState } from 'react'
import { Upload, UserPlus, Search, ChevronDown, Filter, Rows3, LayoutGrid, MoreHorizontal } from 'lucide-react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@esign/ui'
import { ContactsSidebar } from '../../../components/contacts/contacts-sidebar'
import { AddContactDialog, CsvImportDialog } from '../../../components/contacts/dialogs'
import { CONTACTS, SIGNER_COLORS, initials } from '../../../components/templates/data'

function FilterButton({ label, withFilterIcon }: { label: string; withFilterIcon?: boolean }) {
  return (
    <button className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-surface px-3 text-sm text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink">
      {withFilterIcon ? <Filter className="size-3.5" /> : null}
      {label}
      <ChevronDown className="size-3.5 text-ink-faint" />
    </button>
  )
}

function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-sunken px-2 py-0.5 text-[11px] font-medium text-ink-muted">
      {children}
    </span>
  )
}

export default function ContactsPage() {
  const [activeGroup, setActiveGroup] = useState('All Contacts')
  const [addOpen, setAddOpen] = useState(false)
  const [csvOpen, setCsvOpen] = useState(false)

  return (
    <div className="flex flex-1 overflow-hidden">
      <ContactsSidebar activeGroup={activeGroup} onSelectGroup={setActiveGroup} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 px-8 pb-4 pt-7">
          <div>
            <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-ink">Contacts</h1>
            <p className="mt-1 text-sm text-ink-muted">People you send documents to. 247 total · 12 added this month.</p>
          </div>
          <div className="flex gap-2.5">
            <Button variant="secondary" className="gap-2" onClick={() => setCsvOpen(true)}>
              <Upload className="size-4" /> Import CSV
            </Button>
            <Button className="gap-2" onClick={() => setAddOpen(true)}>
              <UserPlus className="size-4" /> Add Contact
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2.5 px-8 pb-[18px]">
          <div className="flex h-9 w-80 items-center gap-2.5 rounded-sm border border-border bg-surface px-3">
            <Search className="size-[15px] text-ink-subtle" />
            <span className="flex-1 text-[13.5px] text-ink-faint">Search by name, email, company…</span>
          </div>
          <FilterButton label="All tags" withFilterIcon />
          <FilterButton label="All companies" />
          <div className="flex-1" />
          <button className="grid size-9 place-items-center rounded-sm border border-border bg-surface text-ink" title="Table view">
            <Rows3 className="size-4" />
          </button>
          <button className="grid size-9 place-items-center rounded-sm border border-border bg-surface text-ink-muted hover:bg-surface-hover" title="Card view">
            <LayoutGrid className="size-4" />
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-8 pb-4">
          <div className="overflow-hidden rounded-md border border-border bg-surface">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 px-3">
                    <input type="checkbox" className="size-3.5 rounded-xs border border-border accent-[color:var(--brand)]" />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-36">Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="w-32">Last contacted</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {CONTACTS.map((c) => (
                  <TableRow key={c.email}>
                    <TableCell className="px-3">
                      <input type="checkbox" className="size-3.5 rounded-xs border border-border accent-[color:var(--brand)]" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span
                          className="grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-ink-inverse"
                          style={{ background: SIGNER_COLORS[c.colorIdx % SIGNER_COLORS.length] }}
                        >
                          {initials(c.name)}
                        </span>
                        <span className="truncate text-[13.5px] font-medium text-ink">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="truncate text-[13px] text-ink-muted">{c.email}</TableCell>
                    <TableCell
                      className={
                        'whitespace-nowrap font-mono text-xs tabular-nums ' +
                        (c.phone === '—' ? 'text-ink-faint' : 'text-ink-muted')
                      }
                    >
                      {c.phone}
                    </TableCell>
                    <TableCell className="truncate text-[13px] text-ink">{c.company}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {c.tags.map((t) => (
                          <TagChip key={t}>{t}</TagChip>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-[13px] tabular-nums text-ink-muted">{c.last}</TableCell>
                    <TableCell>
                      <button className="grid size-7 place-items-center rounded-sm text-ink-faint hover:bg-surface-hover hover:text-ink">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border-subtle bg-surface-sunken px-5 py-3">
              <span className="text-[13px] text-ink-muted">
                Showing <span className="font-medium text-ink">1–12</span> of{' '}
                <span className="font-medium text-ink">247</span>
              </span>
              <div className="flex items-center gap-1">
                <button disabled className="rounded-sm border border-border px-2.5 py-1 text-[13px] text-ink-faint opacity-50">
                  Prev
                </button>
                <button className="rounded-sm border border-border bg-surface px-2.5 py-1 text-[13px] text-ink hover:bg-surface-hover">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddContactDialog open={addOpen} onOpenChange={setAddOpen} />
      <CsvImportDialog open={csvOpen} onOpenChange={setCsvOpen} />
    </div>
  )
}
