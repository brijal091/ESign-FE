// Signer-side API client. Talks to the Spring Boot backend's /signing/** endpoints through the
// Vite dev proxy (/api/be). Auth is the signing token from the invitation link (?token=…),
// sent as a Bearer header; the PDF/download URLs pass it as a query param so <Document>/anchors work.

const BASE = '/api/be'

export function getToken(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('token')
}

export interface SignerField {
  id: string
  type: string
  page: number
  x: number
  y: number
  width: number
  height: number
  required: boolean
  label: string | null
  placeholder: string | null
  filledValue: string | null
}

export interface CurrentSigner {
  id: string
  name: string
  email: string
  signingOrder: number | null
  colorIndex: number
  viewedAt: string | null
  signedAt: string | null
}

export interface SigningDocument {
  documentId: string
  title: string
  status: string
  workflowType: string
  pageCount: number
  message: string | null
  expiresAt: string | null
  currentSigner: CurrentSigner
  fields: SignerField[]
}

export class SigningApiError extends Error {
  code?: string
  httpStatus: number
  constructor(message: string, httpStatus: number, code?: string) {
    super(message)
    this.code = code
    this.httpStatus = httpStatus
  }
}

interface Envelope<T> {
  status: string
  message: string
  data: T
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  })
  const payload = (await res.json().catch(() => null)) as
    | (Envelope<T> & { data?: { code?: string } })
    | null
  if (!res.ok || payload?.status === 'FAILURE' || payload?.status === 'ERROR') {
    throw new SigningApiError(
      payload?.message ?? `Request failed (${res.status})`,
      res.status,
      (payload?.data as { code?: string } | undefined)?.code,
    )
  }
  return (payload as Envelope<T>).data
}

const withToken = (path: string) => `${BASE}${path}?token=${encodeURIComponent(getToken() ?? '')}`

export const signingApi = {
  getDocument: () => call<SigningDocument>('/signing/document'),
  pdfUrl: () => withToken('/signing/document/pdf'),
  downloadUrl: () => withToken('/signing/download'),
  consent: () =>
    call<void>('/signing/consent', { method: 'POST', body: JSON.stringify({ accepted: true }) }),
  fillField: (fieldId: string, value: string) =>
    call<void>(`/signing/fields/${fieldId}`, { method: 'POST', body: JSON.stringify({ value }) }),
  complete: () => call<void>('/signing/complete', { method: 'POST' }),
  decline: (reason: string) =>
    call<void>('/signing/decline', { method: 'POST', body: JSON.stringify({ reason }) }),
}
