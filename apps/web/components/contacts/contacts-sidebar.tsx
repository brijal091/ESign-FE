'use client'

import {
  Users,
  Briefcase,
  Building,
  Package,
  Plus,
  Clock,
  CircleAlert,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@esign/ui'
import { CONTACT_GROUPS, SMART_GROUPS } from '../templates/data'

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  briefcase: Briefcase,
  building: Building,
  package: Package,
  clock: Clock,
  'circle-alert': CircleAlert,
}

function GroupRow({
  name,
  count,
  icon,
  active,
  onClick,
}: {
  name: string
  count: number
  icon: string
  active?: boolean
  onClick?: () => void
}) {
  const Icon = ICONS[icon] ?? Users
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative mx-2 flex items-center gap-2.5 rounded-sm py-2 pl-[18px] pr-3.5 text-left text-[13.5px] transition-colors',
        active
          ? 'bg-brand-soft font-semibold text-brand-strong'
          : 'font-medium text-ink-muted hover:bg-surface-hover hover:text-ink',
      )}
    >
      {active ? <span className="absolute inset-y-[7px] -left-2 w-[3px] rounded-full bg-brand" /> : null}
      <Icon className="size-[15px]" />
      <span className="flex-1">{name}</span>
      <span
        className={cn(
          'font-mono text-[11.5px] font-medium tabular-nums',
          active ? 'text-brand-strong' : 'text-ink-faint',
        )}
      >
        {count}
      </span>
    </button>
  )
}

export function ContactsSidebar({
  activeGroup = 'All Contacts',
  onSelectGroup,
}: {
  activeGroup?: string
  onSelectGroup?: (name: string) => void
}) {
  return (
    <aside className="flex w-60 shrink-0 flex-col gap-1 overflow-auto border-r border-border bg-surface py-6">
      <div className="px-5 pb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-subtle">
        Groups
      </div>
      {CONTACT_GROUPS.map((g) => (
        <GroupRow
          key={g.name}
          {...g}
          active={g.name === activeGroup}
          onClick={() => onSelectGroup?.(g.name)}
        />
      ))}
      <button className="mx-2 mt-1.5 flex items-center gap-2.5 rounded-sm py-2 pl-[18px] pr-3.5 text-left text-[13.5px] font-medium text-ink-subtle hover:bg-surface-hover hover:text-ink">
        <Plus className="size-[15px]" />
        New group
      </button>

      <div className="flex-1" />

      <div className="px-5 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-subtle">
        Smart
      </div>
      {SMART_GROUPS.map((g) => (
        <GroupRow key={g.name} {...g} />
      ))}
    </aside>
  )
}
