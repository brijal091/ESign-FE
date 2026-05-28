'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
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
import type { ContactGroup } from '@esign/types'
import { useCreateGroup, useRenameGroup } from '../../lib/hooks/use-contacts'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  group?: ContactGroup | null
}

export function GroupFormDialog(props: Props) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <GroupFormBody key={props.group?.id ?? 'new'} {...props} />
    </Dialog>
  )
}

function GroupFormBody({ onOpenChange, group }: Props) {
  const editing = Boolean(group)
  const [name, setName] = useState<string>(group?.name ?? '')
  const [error, setError] = useState<string | null>(null)
  const createMut = useCreateGroup()
  const renameMut = useRenameGroup()
  const submitting = createMut.isPending || renameMut.isPending

  async function onSubmit() {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Name required')
      return
    }
    if (trimmed.length > 255) {
      setError('Max 255 characters')
      return
    }
    setError(null)
    try {
      if (group) {
        await renameMut.mutateAsync({ id: group.id, name: trimmed })
        toast.success('Group renamed')
      } else {
        await createMut.mutateAsync(trimmed)
        toast.success('Group created')
      }
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    }
  }

  return (
    <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{editing ? 'Rename group' : 'New group'}</DialogTitle>
          <DialogDescription>
            {editing ? 'Update the group name.' : 'Organize contacts into a group.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>
            Name <span className="text-danger-strong">*</span>
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSubmit()
            }}
          />
          {error ? <p className="text-xs text-danger-strong">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting} className="gap-1.5">
            <Check className="size-4" /> {editing ? 'Save' : 'Create'}
          </Button>
      </DialogFooter>
    </DialogContent>
  )
}
