import { apiFetch } from './client'

// ─── Backend response shapes ──────────────────────────────────────────────────

interface BeAuditEvent {
  id: string
  documentId: string
  action: string
  actorEmail: string | null
  actorUserId: number | null
  ipAddress: string | null
  userAgent: string | null
  metadata: Record<string, unknown> | null
  timestamp: string
}

interface BeAuditEnvelope {
  status: string
  message: string
  data: { events: BeAuditEvent[]; count: number }
}

// ─── Frontend types ───────────────────────────────────────────────────────────

export interface AuditEvent {
  id: string
  documentId: string
  action: string
  actorEmail: string | null
  actorUserId: number | null
  ipAddress: string | null
  userAgent: string | null
  metadata: Record<string, unknown> | null
  timestamp: string
}

function mapEvent(e: BeAuditEvent): AuditEvent {
  return {
    id: e.id,
    documentId: e.documentId,
    action: e.action,
    actorEmail: e.actorEmail,
    actorUserId: e.actorUserId,
    ipAddress: e.ipAddress,
    userAgent: e.userAgent,
    metadata: e.metadata,
    timestamp: e.timestamp,
  }
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function getDocumentTimeline(documentId: string): Promise<AuditEvent[]> {
  const res = await apiFetch<BeAuditEnvelope>(`/audit/document/${documentId}`)
  return res.data.events.map(mapEvent)
}

export interface RecentActivityParams {
  limit?: number
  since?: string
}

export async function getRecentActivity(
  params: RecentActivityParams = {},
): Promise<AuditEvent[]> {
  const qs = new URLSearchParams()
  if (params.limit !== undefined) qs.set('limit', String(params.limit))
  if (params.since) qs.set('since', params.since)
  const query = qs.toString() ? `?${qs}` : ''
  const res = await apiFetch<BeAuditEnvelope>(`/audit/recent${query}`)
  return res.data.events.map(mapEvent)
}
