'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { ActivityGranularity, CompletionTimeStats, DashboardSummary } from '@esign/types'
import { TooltipProvider } from '@esign/ui'
import {
  ActivityAreaChart,
  CompletionStats,
  PendingDocsTable,
  StatusDonut,
  TopSignersBarChart,
  presetRange,
  type DateRange,
  type RangePreset,
} from '../../../components/dashboard/charts'
import { KpiCard, RangeTabs } from '../../../components/dashboard/kpi'
import { RecentActivityCard } from '../../../components/dashboard/activity'
import {
  useCompletionTime,
  useDashboardActivity,
  useDashboardSummary,
  usePendingDocs,
  useTopSigners,
} from '../../../lib/hooks/use-dashboard'

// ─── Range bridge ────────────────────────────────────────────────────────────
// RangeTabs uses display labels; the activity hook + presetRange use ids.
const RANGE_LABEL_BY_PRESET: Record<RangePreset, string> = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
  custom: 'Custom',
}
const PRESET_BY_RANGE_LABEL: Record<string, RangePreset> = {
  '7 days': '7d',
  '30 days': '30d',
  '90 days': '90d',
  Custom: 'custom',
  // "Today" maps to a 1-day window via custom range below
  Today: 'custom',
}

function rangeForLabel(label: string, current: DateRange): { preset: RangePreset; range: DateRange } {
  if (label === 'Today') {
    const to = new Date()
    const from = new Date(to.getTime() - 24 * 60 * 60 * 1000)
    return { preset: 'custom', range: { from: from.toISOString(), to: to.toISOString() } }
  }
  const preset = PRESET_BY_RANGE_LABEL[label] ?? '30d'
  if (preset === 'custom') return { preset, range: current }
  return { preset, range: presetRange(preset, current) }
}

// ─── KPI helpers ─────────────────────────────────────────────────────────────

function pending(summary?: DashboardSummary): number {
  if (!summary) return 0
  const s = summary.byStatus
  return s.sent + s.viewed + s.signed
}

function formatAvg(stats?: CompletionTimeStats): string {
  if (!stats || stats.sampleSize === 0) return '—'
  const h = stats.avgHours
  if (h < 1) return `${Math.round(h * 60)} min`
  if (h < 24) return `${h.toFixed(1)} hrs`
  const d = h / 24
  return `${d.toFixed(1)} days`
}

function formatNumber(n: number | undefined): string {
  if (n === undefined || n === null) return '—'
  return n.toLocaleString()
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

  const rangeLabel = RANGE_LABEL_BY_PRESET[preset]

  const kpis = useMemo(() => {
    const summary = summaryQ.data
    const stats = completionQ.data
    const loadingS = summaryQ.isLoading || summaryQ.isError
    const loadingC = completionQ.isLoading || completionQ.isError
    return {
      total: loadingS ? '—' : formatNumber(summary?.total),
      completed: loadingS ? '—' : formatNumber(summary?.byStatus.completed),
      pending: loadingS ? '—' : formatNumber(pending(summary)),
      avg: loadingC ? '—' : formatAvg(stats),
    }
  }, [summaryQ.data, summaryQ.isLoading, summaryQ.isError, completionQ.data, completionQ.isLoading, completionQ.isError])

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
          <div className="flex items-center gap-3">
            <RangeTabs
              active={rangeLabel}
              onChange={(label) => {
                const next = rangeForLabel(label, range)
                setPreset(next.preset)
                setRange(next.range)
              }}
            />
            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-hover"
            >
              All documents
              <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[18px] overflow-auto px-8 pb-8 pt-2">
          {/* 1. KPI strip — label + tabular-num + DeltaBadge */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard
              label="Total documents"
              value={kpis.total}
              delta="—"
              deltaTone="muted"
              deltaSuffix="vs last period"
            />
            <KpiCard
              label="Completed"
              value={kpis.completed}
              delta="—"
              deltaTone="muted"
              deltaSuffix="vs last period"
            />
            <KpiCard
              label="Pending"
              value={kpis.pending}
              delta="—"
              deltaTone="muted"
              deltaSuffix="vs last period"
            />
            <KpiCard
              label="Avg. time to sign"
              value={kpis.avg}
              delta="—"
              deltaTone="muted"
              deltaSuffix="vs last period"
            />
          </div>

          {/* 3. Charts row — status donut + activity area + top signers bar */}
          <div className="grid gap-[18px] lg:grid-cols-3">
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
            <TopSignersBarChart
              signers={topSignersQ.data}
              loading={topSignersQ.isLoading}
              error={topSignersQ.isError}
            />
          </div>

          {/* 4. Completion-time tiles */}
          <CompletionStats
            stats={completionQ.data}
            loading={completionQ.isLoading}
            error={completionQ.isError}
          />

          {/* 5. Recent activity (mock-backed; no live endpoint yet) */}
          <RecentActivityCard />

          {/* 6. Pending docs compact */}
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
