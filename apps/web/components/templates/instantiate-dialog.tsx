'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X } from 'lucide-react'
import type { Template } from '@esign/types'
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
import { useInstantiateTemplate } from '../../lib/hooks/use-templates'

interface SignerRow {
  name: string
  email: string
}

export function InstantiateDialog({
  template,
  open,
  onOpenChange,
}: {
  template: Template | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [title, setTitle] = useState('')
  const [signers, setSigners] = useState<SignerRow[]>([{ name: '', email: '' }])
  const router = useRouter()
  const inst = useInstantiateTemplate()

  function updateSigner(i: number, patch: Partial<SignerRow>) {
    setSigners((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
  }

  function addSigner() {
    setSigners((prev) => [...prev, { name: '', email: '' }])
  }

  function removeSigner(i: number) {
    setSigners((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)))
  }

  async function handleSubmit() {
    if (!template) return
    const cleaned = signers
      .map((s) => ({ name: s.name.trim(), email: s.email.trim() }))
      .filter((s) => s.name && s.email)
    if (cleaned.length === 0) {
      toast.error('Add at least one signer')
      return
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (cleaned.some((s) => !emailRx.test(s.email))) {
      toast.error('One or more signer emails are invalid')
      return
    }
    try {
      const { documentId } = await inst.mutateAsync({
        id: template.id,
        input: { title: title.trim() || undefined, signers: cleaned },
      })
      toast.success('Document created from template')
      onOpenChange(false)
      router.push(`/documents/${documentId}/edit`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create document')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Use template</DialogTitle>
          <DialogDescription>
            {template ? (
              <>
                Create a new draft document from <strong>{template.name}</strong>.
              </>
            ) : (
              'Create a new draft document from this template.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="inst-title">Document title (optional)</Label>
            <Input
              id="inst-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={template?.name ?? ''}
              disabled={inst.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Signers</Label>
            <div className="space-y-2">
              {signers.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={s.name}
                    placeholder="Name"
                    onChange={(e) => updateSigner(i, { name: e.target.value })}
                    disabled={inst.isPending}
                  />
                  <Input
                    value={s.email}
                    placeholder="Email"
                    type="email"
                    onChange={(e) => updateSigner(i, { email: e.target.value })}
                    disabled={inst.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => removeSigner(i)}
                    disabled={inst.isPending || signers.length <= 1}
                    className="grid size-9 shrink-0 place-items-center rounded-sm text-ink-faint hover:bg-surface-hover hover:text-ink disabled:opacity-30"
                    aria-label="Remove signer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addSigner}
              disabled={inst.isPending}
              className="gap-1.5"
            >
              <Plus className="size-3.5" /> Add signer
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={inst.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={inst.isPending || !template}>
            {inst.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Creating…
              </>
            ) : (
              'Create draft'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
