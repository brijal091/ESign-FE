'use client'

import { useState } from 'react'
import { Users, Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from '@esign/ui'
import type { ContactGroup } from '@esign/types'
import { useContactGroups, useDeleteGroup } from '../../lib/hooks/use-contacts'
import { GroupFormDialog } from './group-form-dialog'

interface Props {
  activeGroupId: string | null
  onSelectGroup: (id: string | null) => void
}

export function GroupsPanel({ activeGroupId, onSelectGroup }: Props) {
  const { data: groups, isLoading, isError } = useContactGroups()
  const deleteMut = useDeleteGroup()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ContactGroup | null>(null)

  const totalCount = groups?.reduce((acc, g) => acc + g.memberCount, 0) ?? 0

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }
  function openRename(g: ContactGroup) {
    setEditing(g)
    setFormOpen(true)
  }

  async function onDelete(g: ContactGroup) {
    if (!confirm(`Delete group "${g.name}"? Members will not be removed.`)) return
    try {
      await deleteMut.mutateAsync(g.id)
      toast.success('Group deleted')
      if (activeGroupId === g.id) onSelectGroup(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col gap-1 overflow-auto border-r border-border bg-surface py-6">
      <div className="px-5 pb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-subtle">
        Groups
      </div>

      <button
        onClick={() => onSelectGroup(null)}
        className={cn(
          'relative mx-2 flex items-center gap-2.5 rounded-sm py-2 pl-[18px] pr-3.5 text-left text-[13.5px] transition-colors',
          activeGroupId === null
            ? 'bg-brand-soft font-semibold text-brand-strong'
            : 'font-medium text-ink-muted hover:bg-surface-hover hover:text-ink',
        )}
      >
        {activeGroupId === null ? (
          <span className="absolute inset-y-[7px] -left-2 w-[3px] rounded-full bg-brand" />
        ) : null}
        <Users className="size-[15px]" />
        <span className="flex-1">All contacts</span>
        <span
          className={cn(
            'font-mono text-[11.5px] font-medium tabular-nums',
            activeGroupId === null ? 'text-brand-strong' : 'text-ink-faint',
          )}
        >
          {totalCount}
        </span>
      </button>

      {isLoading ? (
        <div className="space-y-1.5 px-4 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p className="px-5 pt-3 text-xs text-danger-strong">Failed to load groups</p>
      ) : (
        groups?.map((g) => {
          const active = g.id === activeGroupId
          return (
            <div
              key={g.id}
              className={cn(
                'group relative mx-2 flex items-center gap-2.5 rounded-sm py-2 pl-[18px] pr-1.5 text-left text-[13.5px] transition-colors',
                active
                  ? 'bg-brand-soft font-semibold text-brand-strong'
                  : 'font-medium text-ink-muted hover:bg-surface-hover hover:text-ink',
              )}
            >
              {active ? <span className="absolute inset-y-[7px] -left-2 w-[3px] rounded-full bg-brand" /> : null}
              <button
                onClick={() => onSelectGroup(g.id)}
                className="flex flex-1 items-center gap-2.5 text-left"
              >
                <Users className="size-[15px]" />
                <span className="flex-1 truncate">{g.name}</span>
                <span
                  className={cn(
                    'font-mono text-[11.5px] font-medium tabular-nums',
                    active ? 'text-brand-strong' : 'text-ink-faint',
                  )}
                >
                  {g.memberCount}
                </span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="grid size-6 place-items-center rounded-sm text-ink-faint opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surface-hover hover:text-ink"
                    aria-label="Group actions"
                  >
                    <MoreHorizontal className="size-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openRename(g)}>
                    <Pencil className="mr-2 size-3.5" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(g)} className="text-danger-strong">
                    <Trash2 className="mr-2 size-3.5" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        })
      )}

      <button
        onClick={openCreate}
        className="mx-2 mt-1.5 flex items-center gap-2.5 rounded-sm py-2 pl-[18px] pr-3.5 text-left text-[13.5px] font-medium text-ink-subtle hover:bg-surface-hover hover:text-ink"
      >
        <Plus className="size-[15px]" />
        New group
      </button>

      <GroupFormDialog open={formOpen} onOpenChange={setFormOpen} group={editing} />
    </aside>
  )
}
