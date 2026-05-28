// Mock analytics data for the Dashboard (07). Deterministic — mirrors the
// Paraph design spec. Swap for real API data via a TanStack Query hook later.

export const VOLUME_30: number[] = [
  18, 22, 17, 26, 31, 29, 24, 20, 28, 35, 32, 40, 47, 42, 38, 44, 51, 58, 53, 49,
  56, 62, 68, 64, 71, 75, 70, 78, 84, 92,
]

export interface StatusSlice {
  key: string
  label: string
  count: number
  color: string
}

// Sums to 1,284 — matches the "Total Sent" KPI.
export const STATUS_SLICES: StatusSlice[] = [
  { key: 'completed', label: 'Fully Signed', count: 892, color: 'var(--color-status-signed)' },
  { key: 'pending', label: 'Pending · To Sign', count: 267, color: 'var(--color-status-sent)' },
  { key: 'draft', label: 'Drafts', count: 78, color: 'var(--color-status-draft)' },
  { key: 'expired', label: 'Expired', count: 25, color: 'var(--color-warning)' },
  { key: 'declined', label: 'Declined', count: 22, color: 'var(--color-status-declined)' },
]

export type ActivityStatus = 'completed' | 'viewed' | 'sent' | 'signed' | 'declined' | 'draft'

export interface ActivityItem {
  actor: string
  action: string
  document: string
  time: string
  status: ActivityStatus
}

export const ACTIVITY: ActivityItem[] = [
  { actor: 'Elena Marquez', action: 'signed', document: 'Mutual NDA · Acme × Northwind', time: '2m ago', status: 'completed' },
  { actor: 'Lin Park', action: 'viewed', document: 'Q1 Contractor Onboarding', time: '14m ago', status: 'viewed' },
  { actor: 'Sana Ortiz', action: 'signed', document: 'NDA · Folio × Brightway', time: '1h ago', status: 'completed' },
  { actor: 'You', action: 'sent', document: 'Vendor MSA · Brightway Print', time: '2h ago', status: 'sent' },
  { actor: 'Caleb Mwangi', action: 'viewed', document: 'Offer Letter · Caleb Mwangi', time: '3h ago', status: 'viewed' },
  { actor: 'Priya Shastri', action: 'signed', document: 'SOW #2026-014 · Lumen Studio', time: '4h ago', status: 'signed' },
  { actor: 'You', action: 'sent', document: 'Mutual NDA · Tessera × Folio', time: 'yesterday', status: 'sent' },
  { actor: 'Daniel Park', action: 'declined', document: 'Equipment lease · Margate Co.', time: 'yesterday', status: 'declined' },
]
