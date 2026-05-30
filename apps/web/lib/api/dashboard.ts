import type {
  ActivityGranularity,
  ActivityPoint,
  CompletionTimeStats,
  DashboardSummary,
  PendingDoc,
  TopSigner,
} from '@esign/types'
import { apiFetch } from './client'

interface Envelope<T> {
  status: string
  message: string
  data: T
}

// ─── Summary ──────────────────────────────────────────────────────────────────

interface BeSummary {
  total: number
  counts: {
    draft: number
    sent: number
    viewed: number
    signed: number
    completed: number
    expired: number
    declined: number
  }
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await apiFetch<Envelope<BeSummary>>('/dashboard/summary')
  return {
    total: res.data.total,
    byStatus: { ...res.data.counts },
  }
}

// ─── Activity ─────────────────────────────────────────────────────────────────

interface BeActivityPoint {
  bucket: string
  created: number
  completed: number
}

interface BeActivityResponse {
  points: BeActivityPoint[]
}

export interface ActivityRange {
  from: string
  to: string
  granularity: ActivityGranularity
}

export async function fetchDashboardActivity(range: ActivityRange): Promise<ActivityPoint[]> {
  const qs = new URLSearchParams({
    from: range.from,
    to: range.to,
    granularity: range.granularity,
  })
  const res = await apiFetch<Envelope<BeActivityResponse>>(`/dashboard/activity?${qs}`)
  return res.data.points.map((p) => ({
    date: p.bucket,
    created: p.created,
    completed: p.completed,
  }))
}

// ─── Top signers ──────────────────────────────────────────────────────────────

interface BeTopSigner {
  email: string
  name: string
  signedCount: number
}

interface BeTopSignersResponse {
  items: BeTopSigner[]
}

export async function fetchTopSigners(limit = 5): Promise<TopSigner[]> {
  const res = await apiFetch<Envelope<BeTopSignersResponse>>(
    `/dashboard/top-signers?limit=${limit}`,
  )
  return res.data.items.map((s) => ({
    email: s.email,
    name: s.name,
    completedCount: s.signedCount,
  }))
}

// ─── Completion time ──────────────────────────────────────────────────────────

interface BeCompletionTime {
  sampleSize: number
  avgHours: number
  p50Hours: number
  p95Hours: number
}

export async function fetchCompletionTime(): Promise<CompletionTimeStats> {
  const res = await apiFetch<Envelope<BeCompletionTime>>('/dashboard/completion-time')
  return {
    sampleSize: res.data.sampleSize,
    avgHours: res.data.avgHours,
    p50Hours: res.data.p50Hours,
    p95Hours: res.data.p95Hours,
  }
}

// ─── Pending docs ─────────────────────────────────────────────────────────────

interface BePendingDoc {
  id: string
  title: string
  status: string
  updatedAt: string | null
  signerCount: number
  signedCount: number
}

interface BePendingResponse {
  items: BePendingDoc[]
}

export async function fetchPendingDocs(limit = 10): Promise<PendingDoc[]> {
  const res = await apiFetch<Envelope<BePendingResponse>>(`/dashboard/pending?limit=${limit}`)
  return res.data.items.map((d) => ({
    id: d.id,
    title: d.title,
    status: d.status as PendingDoc['status'],
    sentAt: d.updatedAt,
    signerCount: d.signerCount,
    signedCount: d.signedCount,
  }))
}
