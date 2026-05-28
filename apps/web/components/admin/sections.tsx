'use client'

import { useState } from 'react'
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
  Send,
  Check,
  Mail,
} from 'lucide-react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@esign/ui'
import { SIGNER_COLORS, initials } from '../templates/data'
import { USERS, AUDIT } from './data'
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

function SearchBox({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex h-9 w-80 items-center gap-2.5 rounded-sm border border-border bg-surface px-3">
      <Search className="size-[15px] text-ink-subtle" />
      <span className="flex-1 text-[13.5px] text-ink-faint">{placeholder}</span>
    </div>
  )
}

function FilterChip({ label, icon: Icon }: { label: string; icon?: typeof Shield }) {
  return (
    <button className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-surface px-3 text-sm text-ink-muted hover:bg-surface-hover hover:text-ink">
      {Icon ? <Icon className="size-3.5" /> : null}
      {label}
      <ChevronDown className="size-3.5 text-ink-faint" />
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

function Kebab() {
  return (
    <button className="grid size-7 place-items-center rounded-sm text-ink-faint hover:bg-surface-hover hover:text-ink">
      <MoreHorizontal className="size-4" />
    </button>
  )
}

/* ============ Users ============ */
export function UsersSection() {
  const [inviteOpen, setInviteOpen] = useState(false)
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Users"
        subtitle="10 of 25 seats used. Admins can invite, change roles, and suspend access."
        actions={
          <Button className="gap-2" onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" /> Invite User
          </Button>
        }
      />
      <Toolbar>
        <SearchBox placeholder="Search by name or email…" />
        <FilterChip label="All roles" icon={Shield} />
        <FilterChip label="Active / Suspended" icon={Circle} />
        <div className="flex-1" />
        <span className="text-[13px] text-ink-subtle">
          <span className="font-semibold text-ink">10</span> users
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
              {USERS.map((u, i) => (
                <TableRow key={u.email}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={u.name} colorIdx={u.colorIdx} />
                      <span className="truncate text-[13.5px] font-medium text-ink">
                        {u.name}
                        {i === 0 ? <span className="ml-2 font-mono text-[10.5px] font-medium text-ink-faint">you</span> : null}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="truncate text-[13px] text-ink-muted">{u.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={u.role} />
                  </TableCell>
                  <TableCell>
                    <UserStatus status={u.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-[13px] tabular-nums text-ink-muted">{u.last}</TableCell>
                  <TableCell>
                    <Kebab />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}

function InviteUserDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>They&apos;ll get an email with a sign-in link. Seats are billed monthly.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" hint="">
              <Input placeholder="Jamie Liu" />
            </Field>
            <Field label="Email" hint="">
              <div className="flex h-9 items-center gap-2 rounded-sm border border-border bg-surface px-3 focus-within:border-brand">
                <Mail className="size-4 text-ink-faint" />
                <input placeholder="jamie@northbeam.io" className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint" />
              </div>
            </Field>
          </div>
          <Field label="Role" hint="You can change this later.">
            <Select value="Sender — create and send documents" icon={Shield} />
          </Field>
          <Field label="Welcome note" hint="Optional · added to the invite email">
            <textarea
              rows={3}
              defaultValue="Hey Jamie — adding you so you can send out the Q3 vendor renewals. Holler if anything's unclear. — Brijal"
              className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm leading-normal text-ink outline-none focus:border-brand"
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="gap-1.5" onClick={() => onOpenChange(false)}>
            <Send className="size-4" /> Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ============ Audit Log ============ */
export function AuditLogSection() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Audit Log"
        subtitle="Every action — by team members and signers — for compliance and forensics."
        actions={
          <Button variant="secondary" className="gap-2">
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />
      <Toolbar>
        <button className="inline-flex h-9 items-center gap-2.5 rounded-sm border border-border bg-surface px-3 text-[13.5px] font-medium text-ink">
          <Calendar className="size-3.5 text-ink-subtle" />
          <span className="font-mono text-[12.5px]">May 20 → May 27, 2026</span>
          <ChevronDown className="size-3.5 text-ink-subtle" />
        </button>
        <FilterChip label="All actors" icon={User} />
        <FilterChip label="8 action types" icon={Filter} />
        <div className="flex-1" />
        <span className="text-[13px] text-ink-subtle">
          <span className="font-semibold text-ink">1,284</span> events
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
              {AUDIT.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="whitespace-nowrap font-mono text-xs tabular-nums text-ink">{row.ts}</div>
                    <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wide text-ink-faint">UTC</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-2.5">
                      {row.actor.system ? (
                        <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border bg-surface-sunken text-ink-subtle">
                          <Cpu className="size-3" />
                        </span>
                      ) : (
                        <Avatar name={row.actor.signer ? row.actor.name[0] : row.actor.name} colorIdx={row.actor.colorIdx} size={24} />
                      )}
                      <div className="min-w-0">
                        <div
                          className={
                            'truncate text-ink ' +
                            (row.actor.signer ? 'font-mono text-xs' : 'text-[13px] font-medium')
                          }
                        >
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
                  <TableCell
                    className={'whitespace-nowrap font-mono text-[11.5px] tabular-nums ' + (row.ip === '—' ? 'text-ink-faint' : 'text-ink-muted')}
                  >
                    {row.ip}
                  </TableCell>
                  <TableCell className="truncate text-[12.5px] text-ink-muted" title={row.ua}>
                    {row.ua}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-border-subtle bg-surface-sunken px-5 py-3">
            <span className="text-[13px] text-ink-muted">
              Showing <span className="font-medium text-ink">1–14</span> of{' '}
              <span className="font-medium text-ink">1,284</span>
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
  )
}

/* ============ General Settings ============ */
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
                <CircleCheck className="size-3.5 text-success-strong" />
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
              <KeyRound className="size-3.5" /> Manage SSO
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
            <TriangleAlert className="size-3.5 shrink-0" />
            Shortening retention will permanently delete documents older than the new window after 14 days.
          </div>
        </SettingsCard>
      </div>
    </div>
  )
}

/* ============ Branding ============ */
function NorthbeamMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 19V5L19 19V5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FilledLogo({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex h-[120px] w-60 items-center gap-3 rounded-sm border border-border bg-surface px-3.5">
      <span className="grid size-[60px] shrink-0 place-items-center rounded-sm bg-ink text-paper">
        <NorthbeamMark size={32} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-ink">{name}</div>
        <div className="mt-0.5 text-xs text-ink-subtle">{size}</div>
      </div>
      <button className="rounded-sm border border-border px-2.5 py-1.5 text-[12.5px] font-medium text-ink-muted hover:bg-surface-hover">
        Replace
      </button>
    </div>
  )
}

function ColorInput({ swatch, value }: { swatch: string; value: string }) {
  return (
    <div className="flex h-10 items-center overflow-hidden rounded-sm border border-border bg-surface">
      <div className="relative h-full w-10 border-r border-border" style={{ background: swatch }}>
        <span className="absolute bottom-0.5 right-0.5 grid size-3.5 place-items-center rounded-[3px] bg-paper/80">
          <Pipette className="size-2 text-ink-muted" />
        </span>
      </div>
      <span className="flex-1 px-3 font-mono text-[13px] uppercase text-ink">{value}</span>
    </div>
  )
}

function BrandPreview() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface-sunken">
      <div className="flex h-14 items-center gap-2.5 bg-ink px-[18px] text-paper">
        <NorthbeamMark size={22} />
        <span className="font-display text-lg italic">Northbeam</span>
        <div className="flex-1" />
        <span className="text-[11.5px] text-paper/60">secure signing</span>
      </div>
      <div className="bg-surface-raised px-[22px] pb-[22px] pt-6">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-subtle">Document for review</div>
        <h4 className="font-display text-[22px] italic tracking-tight text-ink">Mutual NDA — Acme × Northbeam</h4>
        <p className="my-2.5 mb-4 text-[13px] leading-relaxed text-ink-muted">
          Hi Elena, here&apos;s the mutual NDA ahead of our Tuesday call. Two pages — should take under a minute.
        </p>
        <div className="mt-2 flex items-center gap-2.5 rounded-sm border border-border-subtle bg-surface px-3.5 py-3">
          <span className="grid size-[30px] place-items-center rounded-full text-[11px] font-semibold text-ink-inverse" style={{ background: 'oklch(0.78 0.06 38)' }}>
            BP
          </span>
          <div className="flex-1">
            <div className="text-[12.5px] font-medium text-ink">Brijal Patel</div>
            <div className="text-[11.5px] text-ink-subtle">brijal@northbeam.io</div>
          </div>
        </div>
        <button
          className="mt-[18px] inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm text-sm font-semibold text-white shadow-[var(--shadow-1)]"
          style={{ background: '#D97757' }}
        >
          Review and sign <ArrowRight className="size-4" />
        </button>
        <div className="mt-3.5 text-center text-[11px] text-ink-faint">Secured by ESign · northbeam.esign.app</div>
      </div>
    </div>
  )
}

export function BrandingSection() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto pb-20">
        <AdminPageHeader title="Branding" subtitle="Your logo and colors on every email, signing page, and audit certificate." />
        <div className="grid grid-cols-1 gap-6 px-8 pb-8 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <SettingsCard title="Logo" description="PNG or SVG with transparent background. Used on signing pages and email headers.">
              <FilledLogo name="northbeam-logo.svg" size="8.4 KB" />
            </SettingsCard>
            <SettingsCard title="Colors" description="Applied to buttons, links, and signer field tints across all surfaces.">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Primary">
                  <ColorInput swatch="#D97757" value="#D97757" />
                </Field>
                <Field label="Accent">
                  <ColorInput swatch="#2A6FDB" value="#2A6FDB" />
                </Field>
              </div>
            </SettingsCard>
            <SettingsCard title="Email" description="What recipients see in their inbox.">
              <div className="flex flex-col gap-3.5">
                <Field label="Email header image" hint="Optional · 1200×240 recommended">
                  <div className="flex h-16 items-center gap-3 rounded-sm border border-border bg-surface px-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-ink text-paper">
                      <NorthbeamMark size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-ink">header-2026.png</div>
                      <div className="text-xs text-ink-subtle">112 KB</div>
                    </div>
                    <button className="rounded-sm border border-border px-2.5 py-1.5 text-[12.5px] font-medium text-ink-muted hover:bg-surface-hover">
                      Replace
                    </button>
                  </div>
                </Field>
                <Field label="Sender 'from' name">
                  <Input defaultValue="Northbeam" />
                </Field>
              </div>
            </SettingsCard>
            <SettingsCard title="Custom subdomain" description="Where signers land — replaces app.esign.app.">
              <Field label="Subdomain">
                <div className="flex h-9 items-center rounded-sm border border-border bg-surface px-3">
                  <input defaultValue="northbeam" className="flex-1 bg-transparent text-sm text-ink outline-none" />
                  <span className="pl-1 font-mono text-[12.5px] text-ink-subtle">.esign.app</span>
                </div>
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
              <BrandPreview />
            </SettingsCard>
          </div>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-border bg-paper/90 px-8 py-3 backdrop-blur-md">
        <div className="inline-flex items-center gap-2 text-[13px] font-medium text-warning-strong">
          <span className="size-2 rounded-full bg-warning" /> 3 unsaved changes
        </div>
        <div className="flex gap-2.5">
          <Button variant="ghost">Discard</Button>
          <Button className="gap-1.5">
            <Check className="size-4" /> Save Changes
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
