'use client'

import type { DocumentField, FieldPosition, Signer } from '@esign/types'
import { PlacedField } from './placed-field'

interface FieldOverlayProps {
  fields: DocumentField[]
  signers: Signer[]
  pageNumber: number
  selectedFieldId: string | null
  onSelect: (id: string) => void
  onMoveField: (id: string, position: FieldPosition) => void
}

export function FieldOverlay({
  fields,
  signers,
  pageNumber,
  selectedFieldId,
  onSelect,
  onMoveField,
}: FieldOverlayProps) {
  const pageFields = fields.filter((f) => f.position.page === pageNumber)

  return (
    <div className="pointer-events-none absolute inset-0">
      {pageFields.map((field) => {
        const signer = signers.find((s) => s.id === field.signerId)
        const color = signer?.color ?? 'var(--color-signer-1)'
        const signerName = signer?.name ?? 'Unassigned'
        return (
          <PlacedField
            key={field.id}
            field={field}
            color={color}
            signerName={signerName}
            selected={field.id === selectedFieldId}
            onSelect={() => onSelect(field.id)}
            onCommit={(position) => onMoveField(field.id, position)}
          />
        )
      })}
    </div>
  )
}
