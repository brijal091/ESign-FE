'use client'

import { useQuery } from '@tanstack/react-query'
import type { ActivityGranularity } from '@esign/types'
import {
  type ActivityRange,
  fetchCompletionTime,
  fetchDashboardActivity,
  fetchDashboardSummary,
  fetchPendingDocs,
  fetchTopSigners,
} from '../api/dashboard'

const STALE = 30_000

const KEYS = {
  summary: ['dashboard', 'summary'] as const,
  activity: (range: ActivityRange) => ['dashboard', 'activity', range] as const,
  topSigners: (limit: number) => ['dashboard', 'top-signers', limit] as const,
  completionTime: ['dashboard', 'completion-time'] as const,
  pending: (limit: number) => ['dashboard', 'pending', limit] as const,
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: KEYS.summary,
    queryFn: fetchDashboardSummary,
    staleTime: STALE,
  })
}

export function useDashboardActivity(from: string, to: string, granularity: ActivityGranularity) {
  const range: ActivityRange = { from, to, granularity }
  return useQuery({
    queryKey: KEYS.activity(range),
    queryFn: () => fetchDashboardActivity(range),
    staleTime: STALE,
  })
}

export function useTopSigners(limit = 5) {
  return useQuery({
    queryKey: KEYS.topSigners(limit),
    queryFn: () => fetchTopSigners(limit),
    staleTime: STALE,
  })
}

export function useCompletionTime() {
  return useQuery({
    queryKey: KEYS.completionTime,
    queryFn: fetchCompletionTime,
    staleTime: STALE,
  })
}

export function usePendingDocs(limit = 10) {
  return useQuery({
    queryKey: KEYS.pending(limit),
    queryFn: () => fetchPendingDocs(limit),
    staleTime: STALE,
  })
}
