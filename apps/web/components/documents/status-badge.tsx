import { Badge, StatusDot } from '@esign/ui'
import type { DocumentStatus } from '@esign/types'
import { statusLabel, statusVariant } from '../../lib/document-status'

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const variant = statusVariant(status)
  return (
    <Badge variant={variant}>
      <StatusDot tone={variant} size="sm" />
      {statusLabel(status)}
    </Badge>
  )
}
