'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  cn,
  toast,
} from '@esign/ui'
import type { Document, Signer, WorkflowType } from '@esign/types'

interface SendDialogProps {
  doc: Document
  trigger: React.ReactNode
  onSend: (input: {
    signers: Signer[]
    workflowType: WorkflowType
    expiresAt: string | null
    message: string
  }) => Promise<void> | void
}

function defaultExpiry(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function SendDialog({ doc, trigger, onSend }: SendDialogProps) {
  const [open, setOpen] = useState(false)
  const [signers, setSigners] = useState<Signer[]>(doc.signers)
  const [workflowType, setWorkflowType] = useState<WorkflowType>(doc.workflowType)
  const [expiresAt, setExpiresAt] = useState<string>(defaultExpiry())
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      // Re-sync from current doc each time the dialog re-opens.
      setSigners(doc.signers)
      setWorkflowType(doc.workflowType)
      setExpiresAt(defaultExpiry())
      setMessage('')
    }
  }

  const hasInvalidEmail = signers.some((s) => !isValidEmail(s.email))
  const fieldCount = doc.fields.length
  const unassignedSigners = doc.signers.filter(
    (s) => !doc.fields.some((f) => f.signerId === s.id),
  )

  async function handleSubmit() {
    if (hasInvalidEmail) {
      toast.error('Fix invalid signer emails before sending')
      return
    }
    if (fieldCount === 0) {
      toast.error('Place at least one field before sending')
      return
    }
    setSubmitting(true)
    try {
      await onSend({
        signers,
        workflowType,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        message,
      })
      toast.success(`Document sent to ${signers.length} signer${signers.length > 1 ? 's' : ''}`)
      setOpen(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not send document')
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send for signature</DialogTitle>
          <DialogDescription>
            {fieldCount} field{fieldCount === 1 ? '' : 's'} placed across {doc.signers.length}{' '}
            signer{doc.signers.length === 1 ? '' : 's'}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wide text-ink-subtle">
              Signers
            </Label>
            <div className="flex flex-col gap-2">
              {signers.map((signer) => {
                const invalid = !isValidEmail(signer.email)
                const noFields = !doc.fields.some((f) => f.signerId === signer.id)
                return (
                  <div key={signer.id} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: signer.color ?? 'var(--color-signer-1)' }}
                    />
                    <Input
                      value={signer.name}
                      onChange={(e) =>
                        setSigners((curr) =>
                          curr.map((s) =>
                            s.id === signer.id ? { ...s, name: e.target.value } : s,
                          ),
                        )
                      }
                      className="h-8 w-24 text-xs"
                      placeholder="Name"
                    />
                    <Input
                      value={signer.email}
                      onChange={(e) =>
                        setSigners((curr) =>
                          curr.map((s) =>
                            s.id === signer.id ? { ...s, email: e.target.value } : s,
                          ),
                        )
                      }
                      className={cn('h-8 flex-1 text-xs', invalid && 'border-danger')}
                      placeholder="email@example.com"
                      type="email"
                    />
                    {noFields && (
                      <span
                        className="text-[10px] text-ink-subtle"
                        title="This signer has no fields"
                      >
                        no fields
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            {unassignedSigners.length > 0 && (
              <div className="rounded-sm border border-danger/40 bg-danger-soft px-3 py-2 text-[11px] text-danger-strong">
                {unassignedSigners.length} signer{unassignedSigners.length === 1 ? '' : 's'} have no
                fields. Assign at least one field to each signer before sending.
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs uppercase tracking-wide text-ink-subtle">
              Signing order
            </Label>
            <div className="flex gap-2">
              {(['sequential', 'parallel'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setWorkflowType(t)}
                  className={cn(
                    'flex-1 rounded-sm border px-3 py-1.5 text-xs capitalize transition-colors',
                    workflowType === t
                      ? 'border-brand bg-brand-soft text-brand-strong'
                      : 'border-border text-ink-muted hover:bg-surface-hover',
                  )}
                >
                  {t === 'sequential' ? 'Sign in order' : 'Anyone first'}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-ink-subtle">
              {workflowType === 'sequential'
                ? 'Each signer is invited only after the previous one finishes.'
                : 'All signers are invited at the same time.'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="send-expiry" className="text-xs uppercase tracking-wide text-ink-subtle">
                Expires
              </Label>
              <Input
                id="send-expiry"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="send-message" className="text-xs uppercase tracking-wide text-ink-subtle">
              Message (optional)
            </Label>
            <textarea
              id="send-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Add a personal message for all recipients…"
              className="rounded-sm border border-border bg-surface px-2.5 py-2 text-xs text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-brand"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || hasInvalidEmail || unassignedSigners.length > 0}
            className="gap-1.5"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
