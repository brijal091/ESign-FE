'use client'

import Link from 'next/link'
import {
  FileText,
  Activity as ActivityIcon,
  Send,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import type { Document, DocumentStatus } from '@esign/types'
import {
  Card,
  EmptyState,
  Skeleton,
  TooltipProvider,
} from '@esign/ui'
import { useDocuments } from '../../../lib/hooks/use-documents'
import { useRecentActivity } from '../../../lib/hooks/use-audit'
import { ActivityItem } from '../../../components/audit/activity-item'
import { statusLabel } from '../../../lib/document-status'

const STATUS_TONE: Record<DocumentStatus, string> = {
  draft: 'bg-surface-sunken text-ink-muted',
  sent: 'bg-info-soft text-info-strong',
  viewed: 'bg-[oklch(0.96_0.025_280)] text-[oklch(0.46_0.13_280)]',
  signed: 'bg-warning-soft text-warning-strong',
  completed: 'bg-success-soft text-success-strong',
  declined: 'bg-surface-sunken text-ink-faint',
  expired: 'bg-danger-soft text-danger-strong',
}

const STATUS_BAR: Record<DocumentStatus, string> = {
  draft: 'bg-ink-faint/60',
  sent: 'bg-info',
  viewed: 'bg-[oklch(0.64_0.13_280)]',
  signed: 'bg-warning',
  completed: 'bg-success',
  declined: 'bg-ink-faint/40',
  expired: 'bg-danger',
}

const STATUS_ORDER: DocumentStatus[] = [
  'draft',
  'sent',
  'viewed',
  'signed',
  'completed',
  'declined',
  'expired',
]

interface Kpis {
  total: number
  inFlight: number
  completed: number
  declined: number
  recent7: number
  recent30: number
}

function computeKpis(docs: Document[]): Kpis {
  const now = Date.now()
  const d7 = now - 7 * 24 * 60 * 60 * 1000
  const d30 = now - 30 * 24 * 60 * 60 * 1000
  let inFlight = 0
  let completed = 0
  let declined = 0
  let recent7 = 0
  let recent30 = 0
  for (const d of docs) {
    if (d.status === 'sent' || d.status === 'viewed' || d.status === 'signed') inFlight++
    if (d.status === 'completed') completed++
    if (d.status === 'declined') declined++
    const t = new Date(d.createdAt).getTime()
    if (t >= d7) recent7++
    if (t >= d30) recent30++
  }
  return { total: docs.length, inFlight, completed, declined, recent7, recent30 }
}

function computeBreakdown(docs: Document[]): { status: DocumentStatus; count: number }[] {
  const counts = new Map<DocumentStatus, number>()
  for (const d of docs) counts.set(d.status, (counts.get(d.status) ?? 0) + 1)
  return STATUS_ORDER.map((s) => ({ status: s, count: counts.get(s) ?? 0 }))
}

export default function DashboardPage() {
  const { data: docs, isLoading: docsLoading, isError: docsError } = useDocuments()
  const recent = useRecentActivity({ limit: 10 })

  const list = docs ?? []
  const kpis = computeKpis(list)
  const breakdown = computeBreakdown(list)

  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-8 px-8 pb-4 pt-7">
          <div>
            <h1 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
              Dashboard
            </h1>
            <div className="mt-1 text-[13px] text-ink-subtle">
              Sending activity across your workspace
            </div>
          </div>
          <Link
            href="/documents"
            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-hover"
          >
            All documents
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-[18px] overflow-auto px-8 pb-8 pt-2">
          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard
              label="Total documents"
              icon={<FileText className="size-4" />}
              value={kpis.total}
              hint={`${kpis.recent7} this week`}
              loading={docsLoading}
              error={docsError}
            />
            <KpiCard
              label="In flight"
              icon={<Send className="size-4" />}
              value={kpis.inFlight}
              hint="Sent, viewed or partially signed"
              tone="brand"
              loading={docsLoading}
              error={docsError}
            />
            <KpiCard
              label="Completed"
              icon={<CheckCircle2 className="size-4" />}
              value={kpis.completed}
              hint={kpis.total > 0 ? `${Math.round((kpis.completed / kpis.total) * 100)}% of total` : '—'}
              tone="success"
              loading={docsLoading}
              error={docsError}
            />
            <KpiCard
              label="Declined"
              icon={<XCircle className="size-4" />}
              value={kpis.declined}
              hint="Signers who declined"
              tone="danger"
              loading={docsLoading}
              error={docsError}
            />
          </div>

          {/* Status breakdown */}
          <Card className="p-5 shadow-[var(--shadow-1)]">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-ink">Status breakdown</h3>
              <span className="text-xs text-ink-subtle">
                {kpis.total} document{kpis.total === 1 ? '' : 's'} · last 30 days: {kpis.recent30}
              </span>
            </div>
            {docsLoading ? (
              <div className="space-y-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} width="100%" height={26} />
                ))}
              </div>
            ) : docsError ? (
              <ErrorBlock message="Couldn't load documents." />
            ) : kpis.total === 0 ? (
              <EmptyState
                title="No documents yet"
                body="Upload your first PDF to start tracking sending activity."
              />
            ) : (
              <StatusBreakdown breakdown={breakdown} total={kpis.total} />
            )}
          </Card>

          {/* Recent activity */}
          <div className="overflow-hidden rounded-md border border-border bg-surface shadow-[var(--shadow-1)]">
            <div className="flex items-center justify-between px-5 pb-3 pt-4">
              <div>
                <h3 className="text-sm font-semibold text-ink">Recent activity</h3>
                <div className="mt-0.5 text-xs text-ink-subtle">
                  Latest events across all documents
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-[3px] font-mono text-[11px] text-success-strong">
                <span className="size-1.5 rounded-full bg-success" />
                Live
              </span>
            </div>
            {recent.isLoading ? (
              <div className="px-5 py-4">
                <div className="space-y-2.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} width="100%" height={28} />
                  ))}
                </div>
              </div>
            ) : recent.isError ? (
              <div className="px-5 py-4">
                <ErrorBlock message="Couldn't load recent activity." />
              </div>
            ) : !recent.data || recent.data.length === 0 ? (
              <div className="px-5 py-10">
                <EmptyState
                  title="Nothing here yet"
                  body="Activity will appear as documents are sent, viewed, and signed."
                />
              </div>
            ) : (
              <div>
                {recent.data.map((evt) => (
                  <ActivityItem key={evt.id} event={evt} variant="row" showDocumentLink />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

// ─── KPI ─────────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string
  value: number
  hint: string
  icon: React.ReactNode
  tone?: 'neutral' | 'brand' | 'success' | 'danger'
  loading?: boolean
  error?: boolean
}

const KPI_ICON_TONE: Record<NonNullable<KpiCardProps['tone']>, string> = {
  neutral: 'bg-surface-sunken text-ink-muted',
  brand: 'bg-brand-soft text-brand-strong',
  success: 'bg-success-soft text-success-strong',
  danger: 'bg-danger-soft text-danger-strong',
}

function KpiCard({ label, value, hint, icon, tone = 'neutral', loading, error }: KpiCardProps) {
  return (
    <Card className="p-5 shadow-[var(--shadow-1)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-ink-subtle">{label}</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums text-ink">
            {loading ? <Skeleton width={64} height={32} /> : error ? '—' : value.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-ink-muted">
            {loading ? <Skeleton width={120} height={11} /> : hint}
          </div>
        </div>
        <span
          aria-hidden
          className={`grid size-9 shrink-0 place-items-center rounded-sm ${KPI_ICON_TONE[tone]}`}
        >
          {icon}
        </span>
      </div>
    </Card>
  )
}

// ─── Status breakdown ────────────────────────────────────────────────────────

function StatusBreakdown({
  breakdown,
  total,
}: {
  breakdown: { status: DocumentStatus; count: number }[]
  total: number
}) {
  return (
    <ul className="space-y-2.5">
      {breakdown.map(({ status, count }) => {
        const pct = total === 0 ? 0 : (count / total) * 100
        return (
          <li key={status} className="grid items-center gap-3" style={{ gridTemplateColumns: '140px 1fr 80px' }}>
            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[status]}`}
            >
              {statusLabel(status)}
            </span>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
              <div
                className={`h-full rounded-full ${STATUS_BAR[status]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-right text-xs tabular-nums text-ink-muted">
              {count} · {pct.toFixed(0)}%
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-danger/30 bg-danger-soft/30 px-3 py-2.5 text-sm text-danger-strong">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <div>{message}</div>
    </div>
  )
}
