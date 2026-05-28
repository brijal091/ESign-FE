'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Mail, Phone, Building2, Check } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@esign/ui'
import type { Contact, CreateContactInput } from '@esign/types'
import { CreateContactInputSchema } from '@esign/types'
import { useCreateContact, useUpdateContact } from '../../lib/hooks/use-contacts'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  contact?: Contact | null
}

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  tags: string
}

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  tags: '',
}

export function ContactFormDialog(props: Props) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <ContactFormBody key={props.contact?.id ?? 'new'} {...props} />
    </Dialog>
  )
}

function initialFromContact(contact: Props['contact']): FormState {
  if (!contact) return EMPTY
  return {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    tags: contact.tags.join(', '),
  }
}

function ContactFormBody({ onOpenChange, contact }: Props) {
  const editing = Boolean(contact)
  const [form, setForm] = useState<FormState>(() => initialFromContact(contact))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const createMut = useCreateContact()
  const updateMut = useUpdateContact()
  const submitting = createMut.isPending || updateMut.isPending

  function set<K extends keyof FormState>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }))
  }

  async function onSubmit() {
    const parsed = CreateContactInputSchema.safeParse({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      company: form.company,
      tags: form.tags,
    })
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState | undefined
        if (key) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})

    const input: CreateContactInput = parsed.data
    try {
      if (contact) {
        await updateMut.mutateAsync({ id: contact.id, input })
        toast.success('Contact updated')
      } else {
        await createMut.mutateAsync(input)
        toast.success('Contact added')
      }
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    }
  }

  return (
    <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit contact' : 'New contact'}</DialogTitle>
          <DialogDescription>
            {editing ? 'Update contact details.' : "Add one person. They won't be notified."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>
                First name <span className="text-danger-strong">*</span>
              </Label>
              <Input
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                aria-invalid={Boolean(errors.firstName)}
              />
              {errors.firstName ? <p className="text-xs text-danger-strong">{errors.firstName}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label>Last name</Label>
              <Input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <div className="flex h-9 items-center gap-2 rounded-sm border border-border bg-surface px-3 focus-within:border-brand">
              <Mail className="size-4 text-ink-faint" />
              <input
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="flex-1 bg-transparent text-sm text-ink outline-none"
                placeholder="name@company.com"
              />
            </div>
            {errors.email ? <p className="text-xs text-danger-strong">{errors.email}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                Phone <span className="text-xs font-normal text-ink-subtle">Optional</span>
              </Label>
              <div className="flex h-9 items-center gap-2 rounded-sm border border-border bg-surface px-3 focus-within:border-brand">
                <Phone className="size-4 text-ink-faint" />
                <input
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="5551234567"
                  className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </div>
              {errors.phone ? <p className="text-xs text-danger-strong">{errors.phone}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                Company <span className="text-xs font-normal text-ink-subtle">Optional</span>
              </Label>
              <div className="flex h-9 items-center gap-2 rounded-sm border border-border bg-surface px-3 focus-within:border-brand">
                <Building2 className="size-4 text-ink-faint" />
                <input
                  value={form.company}
                  onChange={(e) => set('company', e.target.value)}
                  placeholder="Acme Holdings"
                  className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              Tags <span className="text-xs font-normal text-ink-subtle">Comma-separated</span>
            </Label>
            <Input
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              placeholder="vip, client"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting} className="gap-1.5">
            <Check className="size-4" /> {editing ? 'Save' : 'Add'}
          </Button>
      </DialogFooter>
    </DialogContent>
  )
}
