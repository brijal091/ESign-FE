'use client'

import type { StreamState } from '../../lib/sse/document-stream'

const LABEL: Record<StreamState, string> = {
  open: 'Live',
  connecting: 'Connecting…',
  reconnecting: 'Reconnecting…',
  closed: 'Offline',
}

const DOT_CLASS: Record<StreamState, string> = {
  open: 'bg-emerald-500',
  connecting: 'bg-amber-500',
  reconnecting: 'bg-amber-500 animate-pulse',
  closed: 'bg-zinc-400',
}

export function ConnectionIndicator({ state }: { state: StreamState }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-ink-subtle"
      title={`Live updates: ${LABEL[state]}`}
      aria-live="polite"
    >
      <span className={`inline-block size-2 rounded-full ${DOT_CLASS[state]}`} />
      <span className="sr-only">{LABEL[state]}</span>
    </span>
  )
}
