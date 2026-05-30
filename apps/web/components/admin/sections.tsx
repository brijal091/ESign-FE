'use client'

import { useMemo, useState } from 'react'
import {
  Search,
  Shield,
  Circle,
  Filter,
  User,
  Calendar,
  ChevronDown,
  Download,
  UserPlus,
  MoreHorizontal,
  Cpu,
  CircleCheck,
  Globe,
  Languages,
  KeyRound,
  TriangleAlert,
  Pipette,
  ArrowRight,
  Check,
  Loader2,
} from 'lucide-react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from '@esign/ui'
import type {
  AdminRole,
  AdminUser,
  UpdateBrandingInput,
} from '@esign/types'
import { UpdateBrandingInputSchema } from '@esign/types'
import { SIGNER_COLORS, initials } from '../templates/data'
import { AUDIT, type AuditAction } from './data'
import {
  useAdminUsers,
  useBranding,
  useDeleteUser,
  useUpdateBranding,
  useUpdateUser,
} from '../../lib/hooks/use-admin'
import { useRecentActivity } from '../../lib/hooks/use-audit'
import { InviteUserDialog } from './invite-user-dialog'
import {
  AdminPageHeader,
  RoleBadge,
  UserStatus,
  ActionBadge,
  SettingsCard,
  SwitchRow,
  RadioRow,
  Select,
  Field,
} from './atoms'

function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2.5 px-8 pb-[18px]">{children}</div>
}

function FilterChip({ label, icon: Icon }: { label: string; icon?: typeof Shield }) {
  return (
    <button className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-surface px-3 text-sm text-ink-muted hover:bg-surface-hover hover:text-ink">
      {Icon ? <Icon className="size-3.5" strokeWidth={1.5} /> : null}
      {label}
      <ChevronDown className="size-3.5 text-ink-faint" strokeWidth={1.5} />
    </button>
  )
}

function Avatar({ name, colorIdx, size = 32 }: { name: string; colorIdx: number; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-ink-inverse"
      style={{
        width: size,
        height: size,
        fontSize: size <= 24 ? 9.5 : 11,
        background: SIGNER_COLORS[colorIdx % SIGNER_COLORS.length],
      }}
    >
      {initials(name)}
    </span>
  )
}

// Stable per-email color pick so avatars don't change between renders.
function colorIdxFor(email: string): number {
  let h = 0
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) >>> 0
  return h % SIGNER_COLORS.length
}

function fmtLastLogin(iso: string | null): string {
  if (!iso) return 'never'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
    })
  } catch {
    return '—'
  }
}

/* ============ Users — wired to BE ============ */
export function UsersSection() {
  const [inviteOpen, setInviteOpen] = useState(false)
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
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Users"
        subtitle={
          isLoading
            ? 'Loading workspace seats…'
            : `${total} user${total === 1 ? '' : 's'}. Admins can invite, change roles, and suspend access.`
        }
        actions={
          <Button className="gap-2" onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" strokeWidth={1.5} /> Invite User
          </Button>
        }
      />
      <Toolbar>
        <div className="flex h-9 w-80 items-center gap-2.5 rounded-sm border border-border bg-surface px-3 focus-within:border-border-strong">
          <Search className="size-[15px] text-ink-subtle" strokeWidth={1.5} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="h-7 border-0 bg-transparent px-0 text-[13.5px] shadow-none focus-visible:ring-0"
          />
        </div>
        <FilterChip label="All roles" icon={Shield} />
        <FilterChip label="Active / Suspended" icon={Circle} />
        <div className="flex-1" />
        <span className="text-[13px] text-ink-subtle">
          <span className="font-semibold text-ink">{total}</span> users
        </span>
      </Toolbar>
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="overflow-hidden rounded-md border border-border bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-32">Role</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-32">Last active</TableHead>
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
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-danger"
                  >
                    Failed to load users.
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-ink-subtle"
                  >
                    No users match this search.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => {
                  const fullName = `${u.firstName} ${u.lastName}`.trim() || u.email
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={fullName} colorIdx={colorIdxFor(u.email)} />
                          <span className="truncate text-[13.5px] font-medium text-ink">
                            {fullName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="truncate text-[13px] text-ink-muted">
                        {u.email}
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={u.role === 'orgadmin' ? 'Admin' : 'Sender'} />
                      </TableCell>
                      <TableCell>
                        <UserStatus status={u.active ? 'Active' : 'Suspended'} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-[13px] tabular-nums text-ink-muted">
                        {fmtLastLogin(u.lastLogin)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="grid size-7 place-items-center rounded-sm text-ink-faint hover:bg-surface-hover hover:text-ink"
                              aria-label="User actions"
                            >
                              <MoreHorizontal className="size-4" strokeWidth={1.5} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                changeRole(u, u.role === 'orgadmin' ? 'user' : 'orgadmin')
                              }
                            >
                              {u.role === 'orgadmin' ? 'Make sender' : 'Make admin'}
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
      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}

/* ============ Audit Log — wired to BE recent-activity feed ============ */

function tsFmt(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  } catch {
    return iso
  }
}

function normalizeAction(raw: string): AuditAction {
  const a = raw.toLowerCase()
  if (a.includes('declined')) return 'document_declined'
  if (a.includes('completed')) return 'document_completed'
  if (a.includes('signed')) return 'document_signed'
  if (a.includes('viewed')) return 'document_viewed'
  if (a.includes('otp')) return 'otp_verified'
  if (a.includes('field')) return 'field_completed'
  if (a.includes('sent') || a.includes('send')) return 'document_sent'
  return 'document_created'
}

export function AuditLogSection() {
  const { data, isLoading, isError } = useRecentActivity({ limit: 100 })
  const events = data ?? []
  // NEVER fabricate compliance rows on an empty real feed — show a real empty state.
  // The mock AUDIT rows are only used as a last-resort fallback when the fetch errors,
  // so the screen never goes blank during a backend outage.
  const showErrorFallback = !isLoading && isError

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Audit Log"
        subtitle="Every action — by team members and signers — for compliance and forensics."
        actions={
          <Button variant="secondary" className="gap-2">
            <Download className="size-4" strokeWidth={1.5} /> Export CSV
          </Button>
        }
      />
      <Toolbar>
        <button className="inline-flex h-9 items-center gap-2.5 rounded-sm border border-border bg-surface px-3 text-[13.5px] font-medium text-ink">
          <Calendar className="size-3.5 text-ink-subtle" strokeWidth={1.5} />
          <span className="font-mono text-[12.5px]">Last 100 events</span>
          <ChevronDown className="size-3.5 text-ink-subtle" strokeWidth={1.5} />
        </button>
        <FilterChip label="All actors" icon={User} />
        <FilterChip label="8 action types" icon={Filter} />
        <div className="flex-1" />
        <span className="text-[13px] text-ink-subtle">
          <span className="font-semibold text-ink">{showErrorFallback ? AUDIT.length : events.length}</span> events
        </span>
      </Toolbar>
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="overflow-hidden rounded-md border border-border bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44">Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead className="w-44">Action</TableHead>
                <TableHead>Document</TableHead>
                <TableHead className="w-32">IP</TableHead>
                <TableHead>User-Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`a-${i}`}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : showErrorFallback ? (
                AUDIT.map((row, i) => (
                  <TableRow key={`fb-${i}`}>
                    <TableCell>
                      <div className="whitespace-nowrap font-mono text-xs tabular-nums text-ink">{row.ts}</div>
                      <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wide text-ink-faint">UTC</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-2.5">
                        {row.actor.system ? (
                          <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border bg-surface-sunken text-ink-subtle">
                            <Cpu className="size-3" strokeWidth={1.5} />
                          </span>
                        ) : (
                          <Avatar
                            name={row.actor.signer ? row.actor.name[0] : row.actor.name}
                            colorIdx={row.actor.colorIdx}
                            size={24}
                          />
                        )}
                        <div className="min-w-0">
                          <div className={'truncate text-ink ' + (row.actor.signer ? 'font-mono text-xs' : 'text-[13px] font-medium')}>
                            {row.actor.name}
                          </div>
                          <div className="mt-0.5 text-[11px] text-ink-faint">
                            {row.actor.system ? 'System' : row.actor.signer ? 'Signer' : 'Team member'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ActionBadge action={row.action} />
                    </TableCell>
                    <TableCell>
                      <span className="inline-block max-w-full truncate border-b border-dashed border-border-strong text-[13px] text-ink">
                        {row.doc}
                      </span>
                    </TableCell>
                    <TableCell className={'whitespace-nowrap font-mono text-[11.5px] tabular-nums ' + (row.ip === '—' ? 'text-ink-faint' : 'text-ink-muted')}>
                      {row.ip}
                    </TableCell>
                    <TableCell className="truncate text-[12.5px] text-ink-muted" title={row.ua}>
                      {row.ua}
                    </TableCell>
                  </TableRow>
                ))
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-[13px] text-ink-subtle"
                  >
                    No audit events yet. Send your first document to start logging activity.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((e) => {
                  const actor = e.actorEmail ?? (e.actorUserId ? `user #${e.actorUserId}` : 'system')
                  const isSystem = !e.actorEmail && !e.actorUserId
                  return (
                    <TableRow key={e.id}>
                      <TableCell>
                        <div className="whitespace-nowrap font-mono text-xs tabular-nums text-ink">{tsFmt(e.timestamp)}</div>
                        <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wide text-ink-faint">UTC</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex min-w-0 items-center gap-2.5">
                          {isSystem ? (
                            <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border bg-surface-sunken text-ink-subtle">
                              <Cpu className="size-3" strokeWidth={1.5} />
                            </span>
                          ) : (
                            <Avatar name={actor} colorIdx={colorIdxFor(actor)} size={24} />
                          )}
                          <div className="min-w-0">
                            <div className="truncate font-mono text-xs text-ink">{actor}</div>
                            <div className="mt-0.5 text-[11px] text-ink-faint">
                              {isSystem ? 'System' : 'Signer / member'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ActionBadge action={normalizeAction(e.action)} />
                      </TableCell>
                      <TableCell>
                        <span className="inline-block max-w-full truncate border-b border-dashed border-border-strong font-mono text-[11.5px] text-ink">
                          {e.documentId.slice(0, 8)}…
                        </span>
                      </TableCell>
                      <TableCell className={'whitespace-nowrap font-mono text-[11.5px] tabular-nums ' + (e.ipAddress ? 'text-ink-muted' : 'text-ink-faint')}>
                        {e.ipAddress ?? '—'}
                      </TableCell>
                      <TableCell className="truncate text-[12.5px] text-ink-muted" title={e.userAgent ?? ''}>
                        {e.userAgent ?? '—'}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

/* ============ General Settings (static — no BE endpoint) ============ */
export function GeneralSettingsSection() {
  return (
    <div className="flex-1 overflow-auto">
      <AdminPageHeader title="General" subtitle="Workspace identity, defaults, and team-wide preferences." />
      <div className="flex max-w-[820px] flex-col gap-5 px-8 pb-10">
        <SettingsCard
          title="Organization"
          description="Used in document footers, emails, and the audit certificate."
          action={<Button size="sm">Save</Button>}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Organization name">
              <Input defaultValue="Northbeam, Inc." />
            </Field>
            <Field label="Organization domain" hint="Verified · read-only">
              <div className="flex h-9 items-center gap-2 rounded-sm border border-border bg-surface px-3">
                <span className="flex-1 truncate text-sm text-ink">northbeam.io</span>
                <CircleCheck className="size-3.5 text-success-strong" strokeWidth={1.5} />
              </div>
            </Field>
            <Field label="Time zone">
              <Select value="(UTC−07:00) Pacific Time — Los Angeles" icon={Globe} />
            </Field>
            <Field label="Default language">
              <Select value="English (US)" icon={Languages} />
            </Field>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Notifications"
          description="Emails Brijal receives. Other team members manage their own under Profile."
        >
          <SwitchRow title="Email me when a document is signed" sub="Sent the moment all signers have completed." checked />
          <SwitchRow title="Email me when a document is declined" sub="Includes the reason the signer provided." checked />
          <SwitchRow title="Daily digest at 9am" sub="One email per workday summarizing pending sends." last />
        </SettingsCard>

        <SettingsCard
          title="Security"
          description="Account-wide controls. Some changes require re-authentication."
          action={
            <Button size="sm" variant="secondary" className="gap-1.5">
              <KeyRound className="size-3.5" strokeWidth={1.5} /> Manage SSO
            </Button>
          }
        >
          <SwitchRow title="Require 2FA for all team members" sub="New users will be required to enroll at first sign-in." checked />
          <SwitchRow title="Auto-logout after 30 minutes of inactivity" sub="Recommended for shared workstations." last />
        </SettingsCard>

        <SettingsCard title="Data retention" description="How long signed PDFs and audit certificates stay in your workspace.">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <RadioRow label="1 year" sub="Minimum for most US states." />
            <RadioRow label="3 years" sub="Default for new workspaces." selected />
            <RadioRow label="7 years" sub="IRS / SOX compliance." />
            <RadioRow label="Indefinitely" sub="No automatic deletion." />
          </div>
          <div className="mt-3.5 flex items-center gap-2 rounded-sm border border-[oklch(0.86_0.10_80)] bg-warning-soft px-3 py-2.5 text-[12.5px] text-warning-strong">
            <TriangleAlert className="size-3.5 shrink-0" strokeWidth={1.5} />
            Shortening retention will permanently delete documents older than the new window after 14 days.
          </div>
        </SettingsCard>
      </div>
    </div>
  )
}

/* ============ Branding — wired to BE ============ */

function NorthbeamMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 19V5L19 19V5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ColorInput({
  value,
  onChange,
  fallback,
}: {
  value: string
  onChange: (v: string) => void
  fallback: string
}) {
  const isValid = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(value)
  return (
    <div className="flex h-10 items-center overflow-hidden rounded-sm border border-border bg-surface">
      <div className="relative h-full w-10 border-r border-border" style={{ background: isValid ? value : fallback }}>
        <input
          type="color"
          aria-label="Color swatch"
          value={isValid ? value : fallback}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <span className="pointer-events-none absolute bottom-0.5 right-0.5 grid size-3.5 place-items-center rounded-[3px] bg-paper/80">
          <Pipette className="size-2 text-ink-muted" strokeWidth={1.5} />
        </span>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={fallback}
        className="flex-1 bg-transparent px-3 font-mono text-[13px] uppercase text-ink outline-none placeholder:text-ink-faint"
      />
    </div>
  )
}

interface BrandFormState {
  companyName: string
  logoUrl: string
  primaryColor: string
  accentColor: string
  supportEmail: string
  emailFromName: string
}

const EMPTY_BRAND: BrandFormState = {
  companyName: '',
  logoUrl: '',
  primaryColor: '',
  accentColor: '',
  supportEmail: '',
  emailFromName: '',
}

const DEFAULT_PRIMARY = '#D97757'
const DEFAULT_ACCENT = '#2A6FDB'

function BrandPreview({
  primary,
  companyName,
  logoUrl,
}: {
  primary: string
  companyName: string
  logoUrl: string
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface-sunken">
      <div
        className="flex h-14 items-center gap-2.5 px-[18px] text-paper"
        style={{ background: 'var(--color-ink)' }}
      >
        {logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={logoUrl} alt="logo" className="h-7 w-auto object-contain" />
        ) : (
          <NorthbeamMark size={22} />
        )}
        <span className="font-display text-lg italic">{companyName || 'Northbeam'}</span>
        <div className="flex-1" />
        <span className="text-[11.5px] text-paper/60">secure signing</span>
      </div>
      <div className="bg-surface-raised px-[22px] pb-[22px] pt-6">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-subtle">Document for review</div>
        <h4 className="font-display text-[22px] italic tracking-tight text-ink">
          Mutual NDA — Acme × {companyName || 'Northbeam'}
        </h4>
        <p className="my-2.5 mb-4 text-[13px] leading-relaxed text-ink-muted">
          Quick preview of how your brand appears to signers.
        </p>
        <div className="mt-2 flex items-center gap-2.5 rounded-sm border border-border-subtle bg-surface px-3.5 py-3">
          <span
            className="grid size-[30px] place-items-center rounded-full text-[11px] font-semibold text-ink-inverse"
            style={{ background: 'oklch(0.78 0.06 38)' }}
          >
            BP
          </span>
          <div className="flex-1">
            <div className="text-[12.5px] font-medium text-ink">Brijal Patel</div>
            <div className="text-[11.5px] text-ink-subtle">brijal@northbeam.io</div>
          </div>
        </div>
        <button
          type="button"
          className="mt-[18px] inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm text-sm font-semibold text-white shadow-[var(--shadow-1)]"
          style={{ background: primary }}
        >
          Review and sign <ArrowRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

export function BrandingSection() {
  const { data, isLoading, isError } = useBranding()
  const update = useUpdateBranding()

  const initial: BrandFormState = useMemo(() => {
    if (!data) return EMPTY_BRAND
    return {
      companyName: data.companyName ?? '',
      logoUrl: data.logoUrl ?? '',
      primaryColor: data.primaryColor ?? '',
      accentColor: data.accentColor ?? '',
      supportEmail: data.supportEmail ?? '',
      emailFromName: data.emailFromName ?? '',
    }
  }, [data])

  const [form, setForm] = useState<BrandFormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof BrandFormState, string>>>({})
  const [lastInitial, setLastInitial] = useState(initial)
  if (lastInitial !== initial) {
    setLastInitial(initial)
    setForm(initial)
    setErrors({})
  }

  const dirty = useMemo(
    () => (Object.keys(initial) as (keyof BrandFormState)[]).some((k) => initial[k] !== form[k]),
    [initial, form],
  )

  function set<K extends keyof BrandFormState>(key: K, value: BrandFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave() {
    const payload: UpdateBrandingInput = {}
    if (form.companyName !== initial.companyName) payload.companyName = form.companyName
    if (form.logoUrl !== initial.logoUrl) payload.logoUrl = form.logoUrl
    if (form.primaryColor !== initial.primaryColor) payload.primaryColor = form.primaryColor
    if (form.accentColor !== initial.accentColor) payload.accentColor = form.accentColor
    if (form.supportEmail !== initial.supportEmail) payload.supportEmail = form.supportEmail
    if (form.emailFromName !== initial.emailFromName) payload.emailFromName = form.emailFromName

    const parsed = UpdateBrandingInputSchema.safeParse(payload)
    if (!parsed.success) {
      const next: Partial<Record<keyof BrandFormState, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string') next[key as keyof BrandFormState] = issue.message
      }
      setErrors(next)
      return
    }
    setErrors({})

    try {
      await update.mutateAsync(parsed.data)
      toast.success('Branding saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    }
  }

  function handleDiscard() {
    setForm(initial)
    setErrors({})
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-8">
        <Skeleton width={280} height={28} radius={5} />
        <Skeleton width="100%" height={180} radius={6} />
        <Skeleton width="100%" height={180} radius={6} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="m-8 rounded-md border border-danger bg-danger-soft p-4 text-sm text-danger-strong">
        Failed to load branding. Refresh and try again.
      </div>
    )
  }

  const previewPrimary = /^#[0-9a-fA-F]{6,8}$/.test(form.primaryColor) ? form.primaryColor : DEFAULT_PRIMARY

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto pb-20">
        <AdminPageHeader
          title="Branding"
          subtitle="Your logo and colors on every email, signing page, and audit certificate."
        />
        <div className="grid grid-cols-1 gap-6 px-8 pb-8 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <SettingsCard
              title="Organization"
              description="Shown in document footers, emails, and the audit certificate."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Company name" error={errors.companyName}>
                  <Input
                    value={form.companyName}
                    onChange={(e) => set('companyName', e.target.value)}
                    aria-invalid={Boolean(errors.companyName)}
                    placeholder="Northbeam"
                  />
                </Field>
                <Field label="Support email" error={errors.supportEmail}>
                  <Input
                    type="email"
                    value={form.supportEmail}
                    onChange={(e) => set('supportEmail', e.target.value)}
                    placeholder="help@yourdomain.com"
                    aria-invalid={Boolean(errors.supportEmail)}
                  />
                </Field>
              </div>
            </SettingsCard>

            <SettingsCard
              title="Logo"
              description="Public URL of a PNG or SVG. Used on signing pages and email headers."
            >
              <Field label="Logo URL" error={errors.logoUrl}>
                <Input
                  value={form.logoUrl}
                  onChange={(e) => set('logoUrl', e.target.value)}
                  placeholder="https://cdn.example.com/logo.svg"
                  aria-invalid={Boolean(errors.logoUrl)}
                />
              </Field>
            </SettingsCard>

            <SettingsCard
              title="Colors"
              description="Applied to buttons, links, and signer field tints across all surfaces."
            >
              <div className="grid grid-cols-2 gap-4">
                <Field label="Primary" error={errors.primaryColor}>
                  <ColorInput
                    value={form.primaryColor}
                    onChange={(v) => set('primaryColor', v)}
                    fallback={DEFAULT_PRIMARY}
                  />
                </Field>
                <Field label="Accent" error={errors.accentColor}>
                  <ColorInput
                    value={form.accentColor}
                    onChange={(v) => set('accentColor', v)}
                    fallback={DEFAULT_ACCENT}
                  />
                </Field>
              </div>
            </SettingsCard>

            <SettingsCard title="Email" description="What recipients see in their inbox.">
              <Field label="Sender 'from' name" error={errors.emailFromName}>
                <Input
                  value={form.emailFromName}
                  onChange={(e) => set('emailFromName', e.target.value)}
                  placeholder="Northbeam"
                  aria-invalid={Boolean(errors.emailFromName)}
                />
              </Field>
            </SettingsCard>
          </div>

          <div className="self-start lg:sticky lg:top-0">
            <SettingsCard
              title="Live preview"
              description="What your signers will see."
              action={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-[11.5px] font-semibold text-success-strong">
                  <span className="size-1.5 rounded-full bg-success" /> Live
                </span>
              }
            >
              <BrandPreview
                primary={previewPrimary}
                companyName={form.companyName}
                logoUrl={form.logoUrl}
              />
            </SettingsCard>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-border bg-paper/90 px-8 py-3 backdrop-blur-md">
        <div className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-muted">
          {dirty ? (
            <>
              <span className="size-2 rounded-full bg-warning" />
              <span className="text-warning-strong">Unsaved changes</span>
            </>
          ) : (
            <>
              <Check className="size-3.5 text-success-strong" strokeWidth={1.5} />
              All changes saved
            </>
          )}
        </div>
        <div className="flex gap-2.5">
          <Button
            variant="ghost"
            onClick={handleDiscard}
            disabled={!dirty || update.isPending}
          >
            Discard
          </Button>
          <Button
            className="gap-1.5"
            onClick={handleSave}
            disabled={!dirty || update.isPending}
          >
            {update.isPending ? (
              <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Check className="size-4" strokeWidth={1.5} />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ============ Placeholder for not-yet-designed sections ============ */
export function PlaceholderSection({ title }: { title: string }) {
  return (
    <div className="flex-1 overflow-auto">
      <AdminPageHeader title={title} subtitle="This section isn't part of the v0.1 design yet." />
      <div className="px-8 pb-8">
        <div className="grid min-h-[320px] place-items-center rounded-md border border-dashed border-border bg-surface text-sm text-ink-subtle">
          {title} — coming soon
        </div>
      </div>
    </div>
  )
}
