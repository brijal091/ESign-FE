import { useState, useCallback } from 'react'
import { type DocumentField, type FieldType, type FieldPosition } from '@esign/types'

function generateId(): string {
  return crypto.randomUUID()
}

export function useDocumentFields(initial: DocumentField[] = []) {
  const [fields, setFields] = useState<DocumentField[]>(initial)

  const addField = useCallback(
    (type: FieldType, position: FieldPosition, signerId: string | null = null) => {
      const field: DocumentField = {
        id: generateId(),
        type,
        position,
        signerId,
        required: true,
      }
      setFields((prev) => [...prev, field])
      return field.id
    },
    [],
  )

  const updateFieldPosition = useCallback((id: string, position: FieldPosition) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, position } : f)))
  }, [])

  const removeField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const assignSigner = useCallback((id: string, signerId: string | null) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, signerId } : f)))
  }, [])

  return { fields, addField, updateFieldPosition, removeField, assignSigner }
}
