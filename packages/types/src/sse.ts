import { z } from 'zod'

const DocumentStatusEnum = z.enum([
  'draft',
  'sent',
  'viewed',
  'signed',
  'completed',
  'expired',
  'declined',
])

export const DocumentStatusEventSchema = z.object({
  orgId: z.string(),
  documentId: z.string(),
  status: DocumentStatusEnum,
  timestamp: z.string(),
  actorEmail: z.string().email().optional(),
})
export type DocumentStatusEvent = z.infer<typeof DocumentStatusEventSchema>

export const SSE_EVENT_DOCUMENT_STATUS = 'document-status' as const
