'use client'

import {
  DocumentStatusEventSchema,
  SSE_EVENT_DOCUMENT_STATUS,
  type DocumentStatusEvent,
} from '@esign/types'

export type StreamState = 'connecting' | 'open' | 'reconnecting' | 'closed'

export interface DocumentStreamOptions {
  path: string
  token: string
  baseUrl?: string
  onEvent?: (event: DocumentStatusEvent) => void
  onStateChange?: (state: StreamState) => void
}

const DEFAULT_BASE = '/api/be'
const BACKOFF_MS = [1000, 2000, 4000, 8000, 16000, 30000]

export class DocumentStream {
  private readonly opts: DocumentStreamOptions
  private controller: AbortController | null = null
  private state: StreamState = 'closed'
  private attempt = 0
  private retryTimer: ReturnType<typeof setTimeout> | null = null
  private stopped = false

  constructor(opts: DocumentStreamOptions) {
    this.opts = opts
  }

  start(): void {
    if (this.state !== 'closed') return
    this.stopped = false
    void this.connect()
  }

  close(): void {
    this.stopped = true
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
      this.retryTimer = null
    }
    this.controller?.abort()
    this.controller = null
    this.setState('closed')
  }

  getState(): StreamState {
    return this.state
  }

  private setState(s: StreamState): void {
    if (this.state === s) return
    this.state = s
    this.opts.onStateChange?.(s)
  }

  private async connect(): Promise<void> {
    if (this.stopped) return
    this.setState(this.attempt === 0 ? 'connecting' : 'reconnecting')

    const base = (this.opts.baseUrl ?? DEFAULT_BASE).replace(/\/$/, '')
    const url = `${base}${this.opts.path.startsWith('/') ? this.opts.path : `/${this.opts.path}`}`

    this.controller = new AbortController()

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'text/event-stream',
          Authorization: `Bearer ${this.opts.token}`,
          'Cache-Control': 'no-cache',
        },
        signal: this.controller.signal,
        cache: 'no-store',
      })

      if (!res.ok || !res.body) {
        throw new Error(`SSE connect failed: ${res.status}`)
      }

      this.setState('open')
      this.attempt = 0

      await this.readStream(res.body)
      if (!this.stopped) this.scheduleReconnect()
    } catch (err) {
      if ((err as Error).name === 'AbortError' || this.stopped) return
      this.scheduleReconnect()
    }
  }

  private async readStream(body: ReadableStream<Uint8Array>): Promise<void> {
    const reader = body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    try {
      for (;;) {
        const { value, done } = await reader.read()
        if (done) return
        buffer += decoder.decode(value, { stream: true })

        let sepIndex: number
        while ((sepIndex = this.findEventBoundary(buffer)) !== -1) {
          const raw = buffer.slice(0, sepIndex)
          buffer = buffer.slice(sepIndex).replace(/^(\r?\n){1,2}/, '')
          this.dispatchRaw(raw)
        }
      }
    } finally {
      try {
        reader.releaseLock()
      } catch {
        // noop
      }
    }
  }

  private findEventBoundary(buf: string): number {
    const a = buf.indexOf('\n\n')
    const b = buf.indexOf('\r\n\r\n')
    if (a === -1) return b
    if (b === -1) return a
    return Math.min(a, b)
  }

  private dispatchRaw(raw: string): void {
    let eventName = 'message'
    const dataLines: string[] = []

    for (const line of raw.split(/\r?\n/)) {
      if (line.length === 0) continue
      if (line.startsWith(':')) continue // heartbeat / comment
      const idx = line.indexOf(':')
      const field = idx === -1 ? line : line.slice(0, idx)
      const value = idx === -1 ? '' : line.slice(idx + 1).replace(/^ /, '')
      if (field === 'event') eventName = value
      else if (field === 'data') dataLines.push(value)
    }

    if (eventName !== SSE_EVENT_DOCUMENT_STATUS) return
    if (dataLines.length === 0) return

    const dataStr = dataLines.join('\n')
    let parsed: unknown
    try {
      parsed = JSON.parse(dataStr)
    } catch {
      return
    }

    const result = DocumentStatusEventSchema.safeParse(parsed)
    if (!result.success) return
    this.opts.onEvent?.(result.data)
  }

  private scheduleReconnect(): void {
    if (this.stopped) return
    const delay = BACKOFF_MS[Math.min(this.attempt, BACKOFF_MS.length - 1)]
    this.attempt += 1
    this.setState('reconnecting')
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null
      void this.connect()
    }, delay)
  }
}
