import type { ZodSchema } from 'zod'
import { ApiError } from './errors'
import { getToken, writeSession } from '../auth/token-store'

const DEFAULT_BASE = '/api/be'

function baseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? DEFAULT_BASE
}

export interface ApiFetchOptions<T> extends Omit<RequestInit, 'body'> {
  body?: unknown
  schema?: ZodSchema<T>
  auth?: boolean
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions<T> = {},
): Promise<T> {
  const { body, schema, auth = true, headers, ...init } = options

  const finalHeaders = new Headers(headers)
  if (body !== undefined && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json')
  }
  if (auth) {
    const token = getToken()
    if (token && !finalHeaders.has('Authorization')) {
      finalHeaders.set('Authorization', `Bearer ${token}`)
    }
  }

  const url = `${baseUrl()}${path.startsWith('/') ? path : `/${path}`}`

  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (err) {
    throw new ApiError(
      err instanceof Error ? `Network error: ${err.message}` : 'Network error',
      0,
    )
  }

  // Best-effort streaming endpoints (SSE) must never log the user out — they
  // are enhancements and may legitimately 401 if the BE feature is not deployed.
  if (response.status === 401 && !isStreamPath(path)) {
    writeSession(null)
  }

  let payload: unknown = null
  const contentType = response.headers.get('Content-Type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      payload = await response.json()
    } catch {
      payload = null
    }
  } else {
    payload = await response.text().catch(() => null)
  }

  if (!response.ok) {
    const message = extractMessage(payload) ?? `Request failed with status ${response.status}`
    throw new ApiError(message, response.status, payload)
  }

  if (isFailurePayload(payload)) {
    const message = extractMessage(payload) ?? 'Request failed'
    throw new ApiError(message, response.status, payload)
  }

  if (schema) {
    const parsed = schema.safeParse(payload)
    if (!parsed.success) {
      throw new ApiError('Unexpected response from server', response.status, {
        payload,
        issues: parsed.error.issues,
      })
    }
    return parsed.data
  }

  return payload as T
}

function isStreamPath(path: string): boolean {
  return /\/stream(\/?$|\?)/.test(path)
}

function extractMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const msg = (payload as { message?: unknown }).message
  return typeof msg === 'string' ? msg : undefined
}

function isFailurePayload(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') return false
  const status = (payload as { status?: unknown }).status
  return status === 'FAILURE' || status === 'ERROR'
}
