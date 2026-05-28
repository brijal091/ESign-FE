'use client'

import { useState } from 'react'
import { Upload, UserPlus } from 'lucide-react'
import { Button } from '@esign/ui'
import type { Contact } from '@esign/types'
import { GroupsPanel } from '../../../components/contacts/groups-panel'
import { ContactsTable } from '../../../components/contacts/contacts-table'
import { ContactFormDialog } from '../../../components/contacts/contact-form-dialog'
import { CsvImportDialog } from '../../../components/contacts/csv-import-dialog'

export default function ContactsPage() {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [csvOpen, setCsvOpen] = useState(false)
  const [editing, setEditing] = useState<Contact | null>(null)

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(c: Contact) {
    setEditing(c)
    setFormOpen(true)
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <GroupsPanel activeGroupId={activeGroupId} onSelectGroup={setActiveGroupId} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-4 px-8 pb-4 pt-7">
          <div>
            <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-ink">Contacts</h1>
            <p className="mt-1 text-sm text-ink-muted">People you send documents to.</p>
          </div>
          <div className="flex gap-2.5">
            <Button variant="secondary" className="gap-2" onClick={() => setCsvOpen(true)}>
              <Upload className="size-4" /> Import CSV
            </Button>
            <Button className="gap-2" onClick={openAdd}>
              <UserPlus className="size-4" /> Add Contact
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-auto px-8 pb-6">
          <ContactsTable onEdit={openEdit} onAdd={openAdd} />
        </div>
      </div>

      <ContactFormDialog open={formOpen} onOpenChange={setFormOpen} contact={editing} />
      <CsvImportDialog open={csvOpen} onOpenChange={setCsvOpen} />
    </div>
  )
}
