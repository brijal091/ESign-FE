'use client'

import { useState } from 'react'
import {
  FilePlus2,
  Send,
  Eye,
  PenTool,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  ShieldCheck,
  KeyRound,
  TextCursorInput,
  Activity,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger, Tooltip, TooltipContent, TooltipTrigger } from '@esign/ui'
import type { AuditEvent } from '../../lib/api/audit'

// ─── Action humanization ─────────────────────────────────────────────────────

interface ActionMeta {
  label: string
  icon: LucideIcon
  tone: 'neutral' | 'brand' | 'success' | 'warning' | 'danger'
}

const ACTION_MAP: Record<string, ActionMeta> = {
  document_created: { label: 'Document created', icon: FilePlus2, tone: 'neutral' },
  document_sent: { label: 'Document sent', icon: Send, tone: 'brand' },
  document_viewed: { label: 'Document viewed', icon: Eye, tone: 'warning' },
  document_signed: { label: 'Document signed', icon: PenTool, tone: 'success' },
  document_completed: { label: 'Document completed', icon: CheckCircle2, tone: 'success' },
  document_declined: { label: 'Document declined', icon: XCircle, tone: 'danger' },
  document_expired: { label: 'Document expired', icon: Clock, tone: 'warning' },
  signer_invited: { label: 'Signer invited', icon: UserPlus, tone: 'brand' },
  consent_recorded: { label: 'Consent recorded', icon: ShieldCheck, tone: 'success' },
  otp_verified: { label: 'OTP verified', icon: KeyRound, tone: 'success' },
  field_completed: { label: 'Field completed', icon: TextCursorInput, tone: 'neutral' },
}

function humanize(action: string): ActionMeta {
  return (
    ACTION_MAP[action] ?? {
      label: action.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()),
      icon: Activity,
      tone: 'neutral',
    }
  )
}

// ─── Time formatting ─────────────────────────────────────────────────────────

function relative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 0) return 'just now'
  const sec = Math.floor(ms / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const days = Math.floor(hr / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

function absolute(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// ─── Tone styles ─────────────────────────────────────────────────────────────

const TONE_CLASSES: Record<ActionMeta['tone'], string> = {
  neutral: 'bg-surface-sunken text-ink-muted',
  brand: 'bg-brand-soft text-brand-strong',
  success: 'bg-success-soft text-success-strong',
  warning: 'bg-warning-soft text-warning-strong',
  danger: 'bg-danger-soft text-danger-strong',
}

// ─── Components ──────────────────────────────────────────────────────────────

export interface ActivityItemProps {
  event: AuditEvent
  showDocumentLink?: boolean
  /** Variant controls density: 'timeline' is for the doc-detail vertical timeline,
   *  'row' is for compact dashboard list rows. */
  variant?: 'timeline' | 'row'
}

export function ActivityItem({ event, showDocumentLink = false, variant = 'timeline' }: ActivityItemProps) {
  const [open, setOpen] = useState(false)
  const meta = humanize(event.action)
  const Icon = meta.icon
  const hasMetadata = event.metadata && Object.keys(event.metadata).length > 0

  if (variant === 'row') {
    return (
      <div
        className="grid items-center gap-3 border-t border-border-subtle px-[18px] py-2.5"
        style={{ gridTemplateColumns: '20px minmax(0,1fr) auto' }}
      >
        <span aria-hidden className={`grid size-5 place-items-center rounded-sm ${TONE_CLASSES[meta.tone]}`}>
          <Icon className="size-3" />
        </span>
        <div className="flex min-w-0 items-baseline gap-1.5">
          <span className="shrink-0 whitespace-nowrap text-[13.5px] font-medium text-ink">
            {event.actorEmail ?? 'System'}
          </span>
          <span className="shrink-0 whitespace-nowrap text-[13px] text-ink-muted">{meta.label}</span>
          {showDocumentLink && event.documentId ? (
            <span className="min-w-0 flex-1 truncate text-[13px] text-ink-subtle">
              · doc {event.documentId.slice(0, 8)}
            </span>
          ) : null}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="whitespace-nowrap text-xs tabular-nums text-ink-subtle">
              {relative(event.timestamp)}
            </span>
          </TooltipTrigger>
          <TooltipContent>{absolute(event.timestamp)}</TooltipContent>
        </Tooltip>
      </div>
    )
  }

  // timeline variant
  return (
    <li className="relative flex gap-4 pb-5 last:pb-0">
      {/* Vertical connector */}
      <span aria-hidden className="absolute left-[15px] top-8 bottom-0 w-px bg-border-subtle last:hidden" />
      <span
        aria-hidden
        className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-surface ${TONE_CLASSES[meta.tone]}`}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1 pt-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-medium text-ink">{meta.label}</span>
          <span className="text-sm text-ink-muted">by {event.actorEmail ?? 'System'}</span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-subtle">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="tabular-nums">{relative(event.timestamp)}</span>
            </TooltipTrigger>
            <TooltipContent>{absolute(event.timestamp)}</TooltipContent>
          </Tooltip>
          {event.ipAddress ? (
            <span className="font-mono tabular-nums">IP {event.ipAddress}</span>
          ) : null}
        </div>
        {hasMetadata ? (
          <Collapsible open={open} onOpenChange={setOpen} className="mt-2">
            <CollapsibleTrigger className="inline-flex items-center gap-1 text-xs text-brand-strong hover:underline">
              <ChevronDown
                className={`size-3 transition-transform ${open ? 'rotate-180' : ''}`}
              />
              {open ? 'Hide details' : 'Show details'}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="mt-1.5 max-w-full overflow-auto rounded-sm border border-border-subtle bg-surface-sunken p-2.5 font-mono text-[11px] leading-relaxed text-ink-muted">
                {JSON.stringify(event.metadata, null, 2)}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        ) : null}
      </div>
    </li>
  )
}
