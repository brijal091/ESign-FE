'use client'

import { useMemo, useState } from 'react'
import { MoreHorizontal, Search, ShieldCheck, UserCog, UserPlus } from 'lucide-react'
import type { AdminUser, AdminRole } from '@esign/types'
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
  toast,
} from '@esign/ui'
import {
  useAdminUsers,
  useDeleteUser,
  useUpdateUser,
} from '../../lib/hooks/use-admin'

const ROLE_LABEL: Record<AdminRole, string> = {
  orgadmin: 'Admin',
  user: 'Member',
}

function RoleBadge({ role }: { role: AdminRole }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'gap-1 font-medium',
        role === 'orgadmin'
          ? 'bg-danger-soft text-danger-strong'
          : 'bg-info-soft text-info-strong',
      )}
    >
      {role === 'orgadmin' ? <ShieldCheck className="size-3" /> : null}
      {ROLE_LABEL[role]}
    </Badge>
  )
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px]">
      <span
        className={cn(
          'size-2 rounded-full',
          active ? 'bg-success' : 'bg-ink-faint',
        )}
      />
      <span className={active ? 'text-ink' : 'text-ink-subtle'}>
        {active ? 'Active' : 'Suspended'}
      </span>
    </span>
  )
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  } catch {
    return '—'
  }
}

interface UsersTableProps {
  onInvite: () => void
  currentUserId?: number
}

export function UsersTable({ onInvite, currentUserId }: UsersTableProps) {
  const [search, setSearch] = useState('')
  const params = useMemo(
    () => ({ q: search.trim() || undefined, page: 0, size: 50 }),
    [search],
  )
  const { data, isLoading, isError } = useAdminUsers(params)
  const update = useUpdateUser()
  const del = useDeleteUser()

  const users = data?.users ?? []
  const total = data?.total ?? 0

  async function toggleActive(u: AdminUser) {
    try {
      await update.mutateAsync({ id: u.id, input: { active: !u.active } })
      toast.success(u.active ? 'User suspended' : 'User reactivated')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed')
    }
  }

  async function changeRole(u: AdminUser, role: AdminRole) {
    if (u.role === role) return
    try {
      await update.mutateAsync({ id: u.id, input: { role } })
      toast.success('Role updated')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed')
    }
  }

  async function handleDelete(u: AdminUser) {
    if (
      !window.confirm(
        `Remove ${u.firstName} ${u.lastName}? They will lose access immediately.`,
      )
    )
      return
    try {
      await del.mutateAsync(u.id)
      toast.success('User removed')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex h-9 w-80 items-center gap-2 rounded-sm border border-border bg-surface px-3 focus-within:border-brand">
          <Search className="size-[15px] text-ink-subtle" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="h-7 border-0 bg-transparent px-0 text-[13.5px] shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="flex-1" />
        <span className="text-[13px] text-ink-subtle">
          <span className="font-semibold text-ink">{total}</span> users
        </span>
        <Button className="gap-2" onClick={onInvite}>
          <UserPlus className="size-4" /> Invite User
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-32">Role</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-36">Last login</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`s-${i}`}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-danger">
                  Failed to load users.
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    icon={<UserCog className="size-8 text-ink-faint" />}
                    title="No users found"
                    body="Invite teammates to get started."
                    action={
                      <Button onClick={onInvite} className="gap-2">
                        <UserPlus className="size-4" /> Invite User
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => {
                const isSelf = currentUserId === u.id
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="truncate text-[13.5px] font-medium text-ink">
                          {u.firstName} {u.lastName}
                        </span>
                        {isSelf ? (
                          <span className="font-mono text-[10.5px] font-medium text-ink-faint">
                            you
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="truncate text-[13px] text-ink-muted">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={u.role} />
                    </TableCell>
                    <TableCell>
                      <StatusPill active={u.active} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-[13px] tabular-nums text-ink-muted">
                      {fmtDate(u.lastLogin)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-7 p-0 text-ink-faint hover:text-ink"
                            aria-label="User actions"
                            disabled={isSelf}
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              changeRole(u, u.role === 'orgadmin' ? 'user' : 'orgadmin')
                            }
                          >
                            {u.role === 'orgadmin' ? 'Make member' : 'Make admin'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(u)}>
                            {u.active ? 'Suspend' : 'Reactivate'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-danger focus:text-danger"
                            onClick={() => handleDelete(u)}
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
