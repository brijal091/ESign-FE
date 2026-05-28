'use client'

import { useQuery } from '@tanstack/react-query'
import { getDocumentTimeline, getRecentActivity, type RecentActivityParams } from '../api/audit'

const KEYS = {
  documentTimeline: (id: string) => ['audit', 'document', id] as const,
  recent: (params: RecentActivityParams) => ['audit', 'recent', params] as const,
}

export function useDocumentTimeline(documentId: string) {
  return useQuery({
    queryKey: KEYS.documentTimeline(documentId),
    queryFn: () => getDocumentTimeline(documentId),
    enabled: Boolean(documentId),
  })
}

export function useRecentActivity(params: RecentActivityParams = {}) {
  return useQuery({
    queryKey: KEYS.recent(params),
    queryFn: () => getRecentActivity(params),
  })
}
