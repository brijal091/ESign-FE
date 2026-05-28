import type { DocumentStatus } from '@esign/types'

type Variant =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'signed'
  | 'completed'
  | 'expired'
  | 'declined'

const MAP: Record<DocumentStatus, { label: string; variant: Variant }> = {
  draft: { label: 'Draft', variant: 'draft' },
  sent: { label: 'To Sign', variant: 'sent' },
  viewed: { label: 'Viewed', variant: 'viewed' },
  signed: { label: 'Partially Signed', variant: 'signed' },
  completed: { label: 'Fully Signed', variant: 'completed' },
  expired: { label: 'Expired', variant: 'expired' },
  declined: { label: 'Cancelled', variant: 'declined' },
}

export function statusLabel(status: DocumentStatus): string {
  return MAP[status].label
}

export function statusVariant(status: DocumentStatus): Variant {
  return MAP[status].variant
}
