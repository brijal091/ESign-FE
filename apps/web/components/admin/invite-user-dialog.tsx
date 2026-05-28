'use client'

import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import type { AdminRole, InviteUserInput } from '@esign/types'
import { InviteUserInputSchema } from '@esign/types'
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
  toast,
} from '@esign/ui'
import { useCreateUser } from '../../lib/hooks/use-admin'

interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ROLES: { value: AdminRole; label: string; hint: string }[] = [
  { value: 'user', label: 'Member', hint: 'Send and manage documents' },
  { value: 'orgadmin', label: 'Admin', hint: 'Full workspace access' },
]

const EMPTY: InviteUserInput = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  role: 'user',
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const [form, setForm] = useState<InviteUserInput>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof InviteUserInput, string>>>({})
  const create = useCreateUser()

  function reset() {
    setForm(EMPTY)
    setErrors({})
  }

  function handleClose(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned: InviteUserInput = {
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      mobile: form.mobile?.trim() || undefined,
    }
    const parsed = InviteUserInputSchema.safeParse(cleaned)
    if (!parsed.success) {
      const next: Partial<Record<keyof InviteUserInput, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string') {
          next[key as keyof InviteUserInput] = issue.message
        }
      }
      setErrors(next)
      return
    }
    setErrors({})
    try {
      await create.mutateAsync(parsed.data)
      toast.success(`Invite sent to ${parsed.data.email}`)
      handleClose(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to invite user')
    }
  }

  function set<K extends keyof InviteUserInput>(key: K, value: InviteUserInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
          <DialogDescription>
            They&apos;ll receive an email with a sign-in link.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                aria-invalid={Boolean(errors.firstName)}
                autoFocus
              />
              {errors.firstName ? (
                <span className="text-xs text-danger">{errors.firstName}</span>
              ) : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                aria-invalid={Boolean(errors.lastName)}
              />
              {errors.lastName ? (
                <span className="text-xs text-danger">{errors.lastName}</span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="flex h-9 items-center gap-2 rounded-sm border border-border bg-surface px-3 focus-within:border-brand">
              <Mail className="size-4 text-ink-faint" />
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                aria-invalid={Boolean(errors.email)}
                placeholder="jamie@northbeam.io"
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
            {errors.email ? (
              <span className="text-xs text-danger">{errors.email}</span>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mobile">Mobile (optional)</Label>
            <Input
              id="mobile"
              value={form.mobile ?? ''}
              onChange={(e) => set('mobile', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Role</Label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => {
                const selected = form.role === r.value
                return (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => set('role', r.value)}
                    className={
                      'flex flex-col items-start gap-0.5 rounded-sm border px-3 py-2 text-left transition-colors ' +
                      (selected
                        ? 'border-brand bg-brand-soft text-ink'
                        : 'border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink')
                    }
                  >
                    <span className="text-[13.5px] font-semibold">{r.label}</span>
                    <span className="text-[11.5px] text-ink-subtle">{r.hint}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleClose(false)}
              disabled={create.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-1.5" disabled={create.isPending}>
              <Send className="size-4" />
              {create.isPending ? 'Sending…' : 'Send invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

