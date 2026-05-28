'use client'

import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AlertCircle } from 'lucide-react'
import type {
  ActivityGranularity,
  ActivityPoint,
  CompletionTimeStats,
  DashboardSummary,
  DocumentStatus,
  PendingDoc,
  TopSigner,
} from '@esign/types'
import { Card, Skeleton, EmptyState } from '@esign/ui'
import { statusLabel } from '../../lib/document-status'

// ─── Shared ───────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<DocumentStatus, string> = {
  draft: 'var(--color-ink-faint)',
  sent: 'var(--color-info)',
  viewed: 'oklch(0.64 0.13 280)',
  signed: 'var(--color-warning)',
  completed: 'var(--color-success)',
  expired: 'var(--color-danger)',
  declined: 'var(--color-ink-subtle)',
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

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-danger/30 bg-danger-soft/30 px-3 py-2.5 text-sm text-danger-strong">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <div>{message}</div>
    </div>
  )
}

function ChartShell({
  title,
  subtitle,
  loading,
  error,
  empty,
  children,
  height = 260,
  action,
}: {
  title: string
  subtitle?: string
  loading?: boolean
  error?: boolean
  empty?: boolean
  children: React.ReactNode
  height?: number
  action?: React.ReactNode
}) {
  return (
    <Card className="p-5 shadow-[var(--shadow-1)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {subtitle ? <div className="mt-0.5 text-xs text-ink-subtle">{subtitle}</div> : null}
        </div>
        {action}
      </div>
      {loading ? (
        <Skeleton width="100%" height={height} />
      ) : error ? (
        <ErrorBlock message={`Couldn't load ${title.toLowerCase()}.`} />
      ) : empty ? (
        <EmptyState title="No data yet" body="Data will appear once activity starts." />
      ) : (
        <div style={{ width: '100%', height }}>{children}</div>
      )}
    </Card>
  )
}

// ─── Status donut ─────────────────────────────────────────────────────────────

export function StatusDonut({
  summary,
  loading,
  error,
}: {
  summary?: DashboardSummary
  loading?: boolean
  error?: boolean
}) {
  const data = useMemo(() => {
    if (!summary) return []
    return STATUS_ORDER.map((s) => ({
      key: s,
      label: statusLabel(s),
      value: summary.byStatus[s] ?? 0,
      color: STATUS_COLOR[s],
    })).filter((d) => d.value > 0)
  }, [summary])

  const total = summary?.total ?? 0
  const empty = !loading && !error && total === 0

  return (
    <ChartShell
      title="Status breakdown"
      subtitle={`${total} document${total === 1 ? '' : 's'}`}
      loading={loading}
      error={error}
      empty={empty}
      height={260}
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={64}
            outerRadius={96}
            paddingAngle={2}
            stroke="var(--color-surface)"
            strokeWidth={2}
          >
            {data.map((d) => (
              <Cell key={d.key} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--color-ink)',
              border: 'none',
              borderRadius: 4,
              color: 'var(--color-ink-inverse)',
              fontSize: 12,
            }}
            itemStyle={{ color: 'var(--color-ink-inverse)' }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: 'var(--color-ink-muted)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}

// ─── Activity area chart ──────────────────────────────────────────────────────

export function ActivityAreaChart({
  points,
  loading,
  error,
  granularity,
  onGranularityChange,
}: {
  points?: ActivityPoint[]
  loading?: boolean
  error?: boolean
  granularity: ActivityGranularity
  onGranularityChange: (g: ActivityGranularity) => void
}) {
  const empty = !loading && !error && (!points || points.length === 0)
  const data = points ?? []

  return (
    <ChartShell
      title="Sending activity"
      subtitle="Created vs completed"
      loading={loading}
      error={error}
      empty={empty}
      height={260}
      action={<GranularityToggle value={granularity} onChange={onGranularityChange} />}
    >
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-created" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="grad-completed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border-subtle)" strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="var(--color-ink-faint)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatDateTick}
          />
          <YAxis
            stroke="var(--color-ink-faint)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-ink)',
              border: 'none',
              borderRadius: 4,
              color: 'var(--color-ink-inverse)',
              fontSize: 12,
            }}
            itemStyle={{ color: 'var(--color-ink-inverse)' }}
            labelFormatter={(v) => formatDateTick(String(v ?? ''))}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: 'var(--color-ink-muted)' }}
          />
          <Area
            type="monotone"
            dataKey="created"
            name="Created"
            stroke="var(--color-brand)"
            strokeWidth={2}
            fill="url(#grad-created)"
          />
          <Area
            type="monotone"
            dataKey="completed"
            name="Completed"
            stroke="var(--color-success)"
            strokeWidth={2}
            fill="url(#grad-completed)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}

function formatDateTick(value: string): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

// ─── Top signers bar chart ────────────────────────────────────────────────────

export function TopSignersBarChart({
  signers,
  loading,
  error,
}: {
  signers?: TopSigner[]
  loading?: boolean
  error?: boolean
}) {
  const empty = !loading && !error && (!signers || signers.length === 0)
  const data = (signers ?? []).map((s) => ({
    name: s.name || s.email,
    value: s.completedCount,
  }))

  return (
    <ChartShell
      title="Top signers"
      subtitle="Most completed in last 30 days"
      loading={loading}
      error={error}
      empty={empty}
      height={260}
    >
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 20, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border-subtle)" strokeDasharray="2 4" horizontal={false} />
          <XAxis
            type="number"
            stroke="var(--color-ink-faint)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="var(--color-ink-muted)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={140}
          />
          <Tooltip
            cursor={{ fill: 'var(--color-surface-sunken)' }}
            contentStyle={{
              background: 'var(--color-ink)',
              border: 'none',
              borderRadius: 4,
              color: 'var(--color-ink-inverse)',
              fontSize: 12,
            }}
            itemStyle={{ color: 'var(--color-ink-inverse)' }}
          />
          <Bar dataKey="value" name="Completed" fill="var(--color-brand)" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  )
}

// ─── Completion-time stat tiles ───────────────────────────────────────────────

export function CompletionStats({
  stats,
  loading,
  error,
}: {
  stats?: CompletionTimeStats
  loading?: boolean
  error?: boolean
}) {
  const empty = !loading && !error && (!stats || stats.sampleSize === 0)
  const tiles: { label: string; value: number | undefined }[] = [
    { label: 'Average', value: stats?.avgHours },
    { label: 'Median (p50)', value: stats?.p50Hours },
    { label: 'p95', value: stats?.p95Hours },
  ]

  return (
    <Card className="p-5 shadow-[var(--shadow-1)]">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <h3 className="text-sm font-semibold text-ink">Completion time</h3>
          <div className="mt-0.5 text-xs text-ink-subtle">
            {stats?.sampleSize ?? 0} completed document{stats?.sampleSize === 1 ? '' : 's'}
          </div>
        </div>
      </div>
      {error ? (
        <ErrorBlock message="Couldn't load completion time." />
      ) : empty ? (
        <EmptyState title="No completions yet" body="Stats appear once documents complete." />
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {tiles.map((t) => (
            <div
              key={t.label}
              className="flex flex-col gap-1 rounded-sm border border-border-subtle bg-surface-sunken/40 px-3 py-3"
            >
              <div className="text-[11px] uppercase tracking-wide text-ink-subtle">{t.label}</div>
              <div className="text-xl font-semibold tabular-nums text-ink">
                {loading ? (
                  <Skeleton width={60} height={22} />
                ) : t.value === undefined ? (
                  '—'
                ) : (
                  formatHours(t.value)
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function formatHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)}m`
  if (h < 48) return `${h.toFixed(1)}h`
  return `${(h / 24).toFixed(1)}d`
}

// ─── Pending docs table ───────────────────────────────────────────────────────

const STATUS_TONE: Record<DocumentStatus, string> = {
  draft: 'bg-surface-sunken text-ink-muted',
  sent: 'bg-info-soft text-info-strong',
  viewed: 'bg-[oklch(0.96_0.025_280)] text-[oklch(0.46_0.13_280)]',
  signed: 'bg-warning-soft text-warning-strong',
  completed: 'bg-success-soft text-success-strong',
  declined: 'bg-surface-sunken text-ink-faint',
  expired: 'bg-danger-soft text-danger-strong',
}

export function PendingDocsTable({
  docs,
  loading,
  error,
}: {
  docs?: PendingDoc[]
  loading?: boolean
  error?: boolean
}) {
  const empty = !loading && !error && (!docs || docs.length === 0)

  return (
    <Card className="p-0 shadow-[var(--shadow-1)]">
      <div className="flex items-baseline justify-between px-5 pb-3 pt-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Pending documents</h3>
          <div className="mt-0.5 text-xs text-ink-subtle">Sent or viewed, awaiting action</div>
        </div>
      </div>
      {loading ? (
        <div className="space-y-2 px-5 pb-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={32} />
          ))}
        </div>
      ) : error ? (
        <div className="px-5 pb-5">
          <ErrorBlock message="Couldn't load pending documents." />
        </div>
      ) : empty ? (
        <div className="px-5 pb-8">
          <EmptyState title="Nothing pending" body="All sent documents have been signed." />
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-border-subtle text-left text-[11px] uppercase tracking-wide text-ink-subtle">
              <th className="px-5 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Signers</th>
              <th className="px-5 py-2 text-right font-medium">Sent</th>
            </tr>
          </thead>
          <tbody>
            {(docs ?? []).map((d) => (
              <tr key={d.id} className="border-t border-border-subtle">
                <td className="px-5 py-2.5">
                  <a
                    href={`/documents/${d.id}`}
                    className="truncate text-ink hover:text-brand-strong hover:underline"
                  >
                    {d.title}
                  </a>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[d.status]}`}
                  >
                    {statusLabel(d.status)}
                  </span>
                </td>
                <td className="px-3 py-2.5 tabular-nums text-ink-muted">
                  {d.signedCount}/{d.signerCount}
                </td>
                <td className="px-5 py-2.5 text-right tabular-nums text-ink-subtle">
                  {d.sentAt ? formatRelative(d.sentAt) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  )
}

function formatRelative(iso: string): string {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return ''
  const diff = Date.now() - t
  const h = Math.round(diff / 3_600_000)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  return `${d}d ago`
}

// ─── Range picker + granularity toggle ────────────────────────────────────────

export type RangePreset = '7d' | '30d' | '90d' | 'custom'

export interface DateRange {
  from: string
  to: string
}

export function RangePicker({
  preset,
  range,
  onChange,
}: {
  preset: RangePreset
  range: DateRange
  onChange: (preset: RangePreset, range: DateRange) => void
}) {
  const presets: { id: RangePreset; label: string }[] = [
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
    { id: '90d', label: '90d' },
    { id: 'custom', label: 'Custom' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex overflow-hidden rounded-sm border border-border">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id, presetRange(p.id, range))}
            className={`px-2.5 py-1 text-xs font-medium ${
              preset === p.id
                ? 'bg-brand-soft text-brand-strong'
                : 'bg-surface text-ink-muted hover:bg-surface-hover'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {preset === 'custom' ? (
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={range.from.slice(0, 10)}
            onChange={(e) =>
              onChange('custom', { from: dateOnlyToIso(e.target.value, 'start'), to: range.to })
            }
            className="rounded-sm border border-border bg-surface px-2 py-1 text-xs text-ink"
          />
          <span className="text-xs text-ink-subtle">to</span>
          <input
            type="date"
            value={range.to.slice(0, 10)}
            onChange={(e) =>
              onChange('custom', { from: range.from, to: dateOnlyToIso(e.target.value, 'end') })
            }
            className="rounded-sm border border-border bg-surface px-2 py-1 text-xs text-ink"
          />
        </div>
      ) : null}
    </div>
  )
}

export function presetRange(preset: RangePreset, current: DateRange): DateRange {
  if (preset === 'custom') return current
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90
  const to = new Date()
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)
  return { from: from.toISOString(), to: to.toISOString() }
}

function dateOnlyToIso(date: string, edge: 'start' | 'end'): string {
  if (!date) return new Date().toISOString()
  const suffix = edge === 'start' ? 'T00:00:00.000Z' : 'T23:59:59.999Z'
  return `${date}${suffix}`
}

export function GranularityToggle({
  value,
  onChange,
}: {
  value: ActivityGranularity
  onChange: (v: ActivityGranularity) => void
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-sm border border-border">
      {(['day', 'week'] as const).map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => onChange(g)}
          className={`px-2.5 py-1 text-xs font-medium capitalize ${
            value === g
              ? 'bg-brand-soft text-brand-strong'
              : 'bg-surface text-ink-muted hover:bg-surface-hover'
          }`}
        >
          {g}
        </button>
      ))}
    </div>
  )
}
