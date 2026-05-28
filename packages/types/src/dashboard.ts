import { z } from 'zod'

const DocumentStatusSchema = z.enum([
  'draft',
  'sent',
  'viewed',
  'signed',
  'completed',
  'expired',
  'declined',
])

export const DashboardSummarySchema = z.object({
  total: z.number().int().min(0),
  byStatus: z.object({
    draft: z.number().int().min(0),
    sent: z.number().int().min(0),
    viewed: z.number().int().min(0),
    signed: z.number().int().min(0),
    completed: z.number().int().min(0),
    expired: z.number().int().min(0),
    declined: z.number().int().min(0),
  }),
})
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>

export const ActivityGranularitySchema = z.enum(['day', 'week'])
export type ActivityGranularity = z.infer<typeof ActivityGranularitySchema>

export const ActivityPointSchema = z.object({
  date: z.string(),
  created: z.number().int().min(0),
  completed: z.number().int().min(0),
})
export type ActivityPoint = z.infer<typeof ActivityPointSchema>

export const ActivitySeriesSchema = z.object({
  points: z.array(ActivityPointSchema),
})
export type ActivitySeries = z.infer<typeof ActivitySeriesSchema>

export const TopSignerSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  completedCount: z.number().int().min(0),
})
export type TopSigner = z.infer<typeof TopSignerSchema>

export const CompletionTimeStatsSchema = z.object({
  sampleSize: z.number().int().min(0),
  avgHours: z.number().min(0),
  p50Hours: z.number().min(0),
  p95Hours: z.number().min(0),
})
export type CompletionTimeStats = z.infer<typeof CompletionTimeStatsSchema>

export const PendingDocSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  status: DocumentStatusSchema,
  sentAt: z.string().datetime().nullable(),
  signerCount: z.number().int().min(0),
  signedCount: z.number().int().min(0),
})
export type PendingDoc = z.infer<typeof PendingDocSchema>
