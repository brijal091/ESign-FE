'use client'

import { useEffect, useState } from 'react'
import { WifiOff, RotateCw } from 'lucide-react'

export function OfflineBanner() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      className="relative z-20 flex shrink-0 items-center gap-2.5 border-b px-6 py-2.5"
      style={{
        background: 'color-mix(in srgb, var(--color-danger) 12%, var(--color-paper))',
        borderColor: 'color-mix(in srgb, var(--color-danger) 28%, var(--color-border))',
      }}
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-danger text-ink-inverse">
        <WifiOff className="size-3" strokeWidth={1.5} />
      </span>
      <div className="flex flex-1 items-baseline gap-2">
        <span className="text-[13.5px] font-semibold text-danger-strong">You&apos;re offline.</span>
        <span className="text-[13px] text-ink-muted">
          Some features may be unavailable. Changes will sync when you reconnect.
        </span>
      </div>
      <button
        onClick={() => location.reload()}
        title="Retry connection"
        className="grid size-[30px] place-items-center rounded-sm border border-border bg-surface text-ink-muted hover:bg-surface-hover"
      >
        <RotateCw className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  )
}
