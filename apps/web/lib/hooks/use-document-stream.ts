'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { DocumentStatusEvent } from '@esign/types'
import { DocumentStream, type StreamState } from '../sse/document-stream'
import { getToken, subscribe } from '../auth/token-store'

export interface UseDocumentStreamOptions {
  documentId?: string
  enabled?: boolean
  onEvent?: (event: DocumentStatusEvent) => void
}

export interface UseDocumentStreamResult {
  state: StreamState
  lastEvent: DocumentStatusEvent | null
}

function getServerToken(): string | null {
  return null
}

export function useDocumentStream(
  options: UseDocumentStreamOptions = {},
): UseDocumentStreamResult {
  const { documentId, enabled = true, onEvent } = options

  const token = useSyncExternalStore(subscribe, getToken, getServerToken)

  const [state, setState] = useState<StreamState>('closed')
  const [lastEvent, setLastEvent] = useState<DocumentStatusEvent | null>(null)

  const onEventRef = useRef(onEvent)
  useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  useEffect(() => {
    if (!enabled || !token) return

    const path = documentId ? `/documents/${documentId}/stream` : '/documents/stream'
    const stream = new DocumentStream({
      path,
      token,
      onStateChange: setState,
      onEvent: (event) => {
        setLastEvent(event)
        onEventRef.current?.(event)
      },
    })

    stream.start()
    return () => stream.close()
  }, [documentId, enabled, token])

  const effectiveState: StreamState = !enabled || !token ? 'closed' : state
  return { state: effectiveState, lastEvent }
}
