'use client'

import {
  Settings,
  Users,
  ShieldCheck,
  Palette,
  ScrollText,
  CreditCard,
  Plug,
  Monitor,
  ChevronDown,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Switch, cn } from '@esign/ui'
import { ADMIN_SECTIONS, type Role, type UserStatusValue, type AuditAction } from './data'

const SECTION_ICONS: Record<string, LucideIcon> = {
  settings: Settings,
  users: Users,
  'shield-check': ShieldCheck,
  palette: Palette,
  'scroll-text': ScrollText,
  'credit-card': CreditCard,
  plug: Plug,
  monitor: Monitor,
}

export function AdminSubNav({
  active,
  onSelect,
}: {
  active: string
  onSelect: (key: string) => void
}) {
  return (
    <aside className="flex w-60 shrink-0 flex-col gap-0.5 overflow-auto border-r border-border bg-surface py-6">
      <div className="px-5 pb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-subtle">
        Workspace
      </div>
      {ADMIN_SECTIONS.map((s) => {
        const Icon = SECTION_ICONS[s.icon] ?? Settings
        const isActive = s.key === active
        const label = s.label ?? s.key
        return (
          <button
            key={s.key}
            onClick={() => onSelect(s.key)}
            className={cn(
              'relative mx-2 flex items-center gap-2.5 rounded-sm py-2 pl-[18px] pr-3.5 text-left text-[13.5px] transition-colors',
              isActive
                ? 'bg-brand-soft font-semibold text-brand-strong'
                : 'font-medium text-ink-muted hover:bg-surface-hover hover:text-ink',
            )}
          >
            {isActive ? <span className="absolute inset-y-[7px] -left-2 w-[3px] rounded-full bg-brand" /> : null}
            <Icon className="size-[15px]" />
            <span className="flex-1">{label}</span>
          </button>
        )
      })}

      <div className="flex-1" />

      <div className="mx-4 my-3 flex flex-col gap-1.5 rounded-sm border border-border-subtle bg-surface-sunken p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-subtle">
          <Zap className="size-3" /> Business plan
        </div>
        <div className="text-xs leading-snug text-ink-muted">247 / 500 contacts · renews Jun 14</div>
        <a href="#" className="mt-0.5 text-xs font-medium text-brand-strong hover:underline">
          Upgrade →
        </a>
      </div>
    </aside>
  )
}

export function AdminPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-8 pb-[18px] pt-7">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
        {subtitle ? <p className="mt-1 text-[13.5px] text-ink-subtle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2.5">{actions}</div> : null}
    </div>
  )
}

const ROLE_PALETTE: Record<Role, { bg: string; fg: string; dot: string }> = {
  Admin: { bg: 'bg-danger-soft', fg: 'text-danger-strong', dot: 'bg-danger' },
  Sender: { bg: 'bg-info-soft', fg: 'text-info-strong', dot: 'bg-info' },
  Viewer: { bg: 'bg-surface-sunken', fg: 'text-ink-muted', dot: 'bg-ink-subtle' },
}

export function RoleBadge({ role }: { role: Role }) {
  const p = ROLE_PALETTE[role]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full py-0.5 pl-1.5 pr-2.5 text-[11.5px] font-semibold', p.bg, p.fg)}>
      <span className={cn('size-[5px] rounded-full', p.dot)} />
      {role}
    </span>
  )
}

export function UserStatus({ status }: { status: UserStatusValue }) {
  const active = status === 'Active'
  return (
    <span className={cn('inline-flex items-center gap-2 text-[13px]', active ? 'text-ink' : 'text-ink-subtle')}>
      <span
        className={cn('size-2 rounded-full', active ? 'bg-success' : 'bg-ink-faint')}
        style={active ? { boxShadow: '0 0 0 3px var(--color-success-soft)' } : undefined}
      />
      {status}
    </span>
  )
}

const ACTION_PALETTE: Record<AuditAction, string> = {
  document_created: 'bg-surface-sunken text-ink-muted',
  document_sent: 'bg-info-soft text-info-strong',
  document_viewed: 'bg-surface-sunken text-ink-muted',
  document_signed: 'bg-success-soft text-success-strong',
  document_completed: 'bg-success-soft text-success-strong',
  document_declined: 'bg-danger-soft text-danger-strong',
  otp_verified: 'bg-brand-soft text-brand-strong',
  field_completed: 'bg-surface-sunken text-ink-muted',
}

export function ActionBadge({ action }: { action: AuditAction }) {
  return (
    <span className={cn('inline-flex items-center whitespace-nowrap rounded-sm px-2 py-0.5 font-mono text-[11.5px] font-medium', ACTION_PALETTE[action])}>
      {action}
    </span>
  )
}

export function SettingsCard({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface shadow-[var(--shadow-1)]">
      <div className="flex items-start justify-between gap-4 border-b border-border-subtle px-6 pb-3.5 pt-[18px]">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h3>
          {description ? <p className="mt-0.5 text-[13px] text-ink-subtle">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

export function SwitchRow({
  title,
  sub,
  checked = false,
  last = false,
}: {
  title: string
  sub?: string
  checked?: boolean
  last?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-4 py-3', !last && 'border-b border-border-subtle')}>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-medium text-ink">{title}</div>
        {sub ? <div className="mt-0.5 text-[12.5px] text-ink-subtle">{sub}</div> : null}
      </div>
      <Switch defaultChecked={checked} />
    </div>
  )
}

export function RadioRow({
  label,
  sub,
  selected = false,
}: {
  label: string
  sub?: string
  selected?: boolean
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-sm border px-3.5 py-3',
        selected ? 'border-[oklch(0.85_0.08_40)] bg-brand-soft' : 'border-border-subtle',
      )}
    >
      <span
        className={cn(
          'mt-0.5 box-border size-4 shrink-0 rounded-full bg-surface transition-[border]',
          selected ? 'border-[5px] border-brand' : 'border-[1.5px] border-border-strong',
        )}
      />
      <div className="flex-1">
        <div className={cn('text-[13.5px]', selected ? 'font-semibold text-brand-strong' : 'font-medium text-ink')}>
          {label}
        </div>
        {sub ? (
          <div className={cn('mt-0.5 text-[12.5px]', selected ? 'text-[oklch(0.45_0.10_38)]' : 'text-ink-subtle')}>
            {sub}
          </div>
        ) : null}
      </div>
    </label>
  )
}

export function Select({ value, icon: Icon }: { value: string; icon?: LucideIcon }) {
  return (
    <div className="flex h-10 items-center gap-2.5 rounded-sm border border-border bg-surface px-3 text-sm text-ink">
      {Icon ? <Icon className="size-[15px] text-ink-subtle" /> : null}
      <span className="flex-1 truncate">{value}</span>
      <ChevronDown className="size-[15px] text-ink-subtle" />
    </div>
  )
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-ink">{label}</span>
        {hint ? <span className="text-xs text-ink-subtle">{hint}</span> : null}
      </div>
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </div>
  )
}
