'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Send,
  XCircle,
} from 'lucide-react'
import type { ActivityGranularity, DashboardSummary } from '@esign/types'
import { Card, Skeleton, TooltipProvider } from '@esign/ui'
import {
  ActivityAreaChart,
  CompletionStats,
  PendingDocsTable,
  RangePicker,
  StatusDonut,
  TopSignersBarChart,
  presetRange,
  type DateRange,
  type RangePreset,
} from '../../../components/dashboard/charts'
import {
  useCompletionTime,
  useDashboardActivity,
  useDashboardSummary,
  usePendingDocs,
  useTopSigners,
} from '../../../lib/hooks/use-dashboard'

interface Kpis {
  total: number
  inFlight: number
  completed: number
  declined: number
}

function computeKpis(summary?: DashboardSummary): Kpis {
  if (!summary) return { total: 0, inFlight: 0, completed: 0, declined: 0 }
  const s = summary.byStatus
  return {
    total: summary.total,
    inFlight: s.sent + s.viewed + s.signed,
    completed: s.completed,
    declined: s.declined,
  }
}

export default function DashboardPage() {
  const [preset, setPreset] = useState<RangePreset>('30d')
  const [range, setRange] = useState<DateRange>(() => presetRange('30d', { from: '', to: '' }))
  const [granularity, setGranularity] = useState<ActivityGranularity>('day')

  const summaryQ = useDashboardSummary()
  const activityQ = useDashboardActivity(range.from, range.to, granularity)
  const topSignersQ = useTopSigners(5)
  const completionQ = useCompletionTime()
  const pendingQ = usePendingDocs(10)

  const kpis = useMemo(() => computeKpis(summaryQ.data), [summaryQ.data])

  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-8 px-8 pb-4 pt-7">
          <div>
            <h1 className="text-[28px] font-semibold leading-[1.15] tracking-tight text-ink">
              Dashboard
            </h1>
            <div className="mt-1 text-[13px] text-ink-subtle">
              Sending activity across your workspace
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RangePicker
              preset={preset}
              range={range}
              onChange={(p, r) => {
                setPreset(p)
                setRange(r)
              }}
            />
            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-hover"
            >
              All documents
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[18px] overflow-auto px-8 pb-8 pt-2">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard
              label="Total documents"
              icon={<FileText className="size-4" />}
              value={kpis.total}
              loading={summaryQ.isLoading}
              error={summaryQ.isError}
            />
            <KpiCard
              label="In flight"
              icon={<Send className="size-4" />}
              value={kpis.inFlight}
              tone="brand"
              loading={summaryQ.isLoading}
              error={summaryQ.isError}
            />
            <KpiCard
              label="Completed"
              icon={<CheckCircle2 className="size-4" />}
              value={kpis.completed}
              tone="success"
              loading={summaryQ.isLoading}
              error={summaryQ.isError}
            />
            <KpiCard
              label="Declined"
              icon={<XCircle className="size-4" />}
              value={kpis.declined}
              tone="danger"
              loading={summaryQ.isLoading}
              error={summaryQ.isError}
            />
          </div>

          <div className="grid gap-[18px] lg:grid-cols-[1fr_1.5fr]">
            <StatusDonut
              summary={summaryQ.data}
              loading={summaryQ.isLoading}
              error={summaryQ.isError}
            />
            <ActivityAreaChart
              points={activityQ.data}
              loading={activityQ.isLoading}
              error={activityQ.isError}
              granularity={granularity}
              onGranularityChange={setGranularity}
            />
          </div>

          <div className="grid gap-[18px] lg:grid-cols-2">
            <TopSignersBarChart
              signers={topSignersQ.data}
              loading={topSignersQ.isLoading}
              error={topSignersQ.isError}
            />
            <CompletionStats
              stats={completionQ.data}
              loading={completionQ.isLoading}
              error={completionQ.isError}
            />
          </div>

          <PendingDocsTable
            docs={pendingQ.data}
            loading={pendingQ.isLoading}
            error={pendingQ.isError}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}

// ─── KPI ─────────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string
  value: number
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

function KpiCard({ label, value, icon, tone = 'neutral', loading, error }: KpiCardProps) {
  return (
    <Card className="p-5 shadow-[var(--shadow-1)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-ink-subtle">{label}</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums text-ink">
            {loading ? <Skeleton width={64} height={32} /> : error ? '—' : value.toLocaleString()}
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
