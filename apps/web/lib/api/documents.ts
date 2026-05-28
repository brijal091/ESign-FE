import type { Document, DocumentField, FieldType, Signer } from '@esign/types'
import { apiFetch } from './client'
import { getToken } from '../auth/token-store'

// ─── Backend response shapes ──────────────────────────────────────────────────

interface BeSignerResponse {
  id: string
  name: string
  email: string
  signingOrder: number | null
  colorIndex: number
  viewedAt: string | null
  signedAt: string | null
  declinedAt: string | null
  declineReason: string | null
}

interface BeFieldResponse {
  id: string
  signerId: string | null
  type: string
  page: number
  x: number
  y: number
  width: number
  height: number
  required: boolean
  label: string | null
  placeholder: string | null
}

interface BeDocumentResponse {
  id: string
  title: string
  status: string
  workflowType: string
  pageCount: number
  fileSizeBytes: number
  tags: string[]
  message: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  signers: BeSignerResponse[]
  fields: BeFieldResponse[]
}

interface BeListEnvelope {
  status: string
  message: string
  data: {
    documents: BeDocumentResponse[]
    total: number
    page: number
    pageSize: number
  }
}

interface BeDocumentEnvelope {
  status: string
  message: string
  data: BeDocumentResponse
}

// ─── Transform: backend → frontend ───────────────────────────────────────────

function mapSigner(s: BeSignerResponse): Signer {
  return {
    id: s.id,
    name: s.name,
    email: s.email,
    order: s.signingOrder ?? undefined,
    color: `var(--color-signer-${Math.min(Math.max(s.colorIndex, 1), 4)})`,
    viewedAt: s.viewedAt,
    signedAt: s.signedAt,
    declinedAt: s.declinedAt,
    declineReason: s.declineReason,
  }
}

function mapField(f: BeFieldResponse): DocumentField {
  return {
    id: f.id,
    type: f.type as FieldType,
    position: { page: f.page, x: f.x, y: f.y, width: f.width, height: f.height },
    signerId: f.signerId,
    required: f.required,
    label: f.label ?? undefined,
    placeholder: f.placeholder ?? undefined,
  }
}

function mapDocument(d: BeDocumentResponse): Document {
  return {
    id: d.id,
    title: d.title,
    status: d.status as Document['status'],
    workflowType: d.workflowType as Document['workflowType'],
    pageCount: d.pageCount,
    fileSizeBytes: d.fileSizeBytes,
    tags: d.tags ?? [],
    message: d.message,
    expiresAt: d.expiresAt,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    signers: d.signers.map(mapSigner),
    fields: d.fields.map(mapField),
  }
}

// ─── Transform: frontend → backend request bodies ────────────────────────────

function colorToCssVar(css: string | undefined): number {
  const match = css?.match(/--color-signer-(\d)/)
  const n = match ? parseInt(match[1], 10) : 1
  return Math.min(Math.max(n, 1), 4)
}

function toBeSigners(signers: Signer[]) {
  return signers.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    signingOrder: s.order ?? null,
    colorIndex: colorToCssVar(s.color),
  }))
}

function toBeFields(fields: DocumentField[]) {
  return fields.map((f) => ({
    id: f.id,
    signerId: f.signerId,
    type: f.type,
    page: f.position.page,
    x: f.position.x,
    y: f.position.y,
    width: f.position.width,
    height: f.position.height,
    required: f.required,
    label: f.label ?? null,
    placeholder: f.placeholder ?? null,
  }))
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function listDocuments(params?: {
  status?: string
  page?: number
  pageSize?: number
}): Promise<{ documents: Document[]; total: number; page: number; pageSize: number }> {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.page !== undefined) qs.set('page', String(params.page))
  if (params?.pageSize !== undefined) qs.set('pageSize', String(params.pageSize))

  const query = qs.toString() ? `?${qs}` : ''
  const res = await apiFetch<BeListEnvelope>(`/documents${query}`)
  return {
    documents: res.data.documents.map(mapDocument),
    total: res.data.total,
    page: res.data.page,
    pageSize: res.data.pageSize,
  }
}

export async function getDocument(id: string): Promise<Document | null> {
  try {
    const res = await apiFetch<BeDocumentEnvelope>(`/documents/${id}`)
    return mapDocument(res.data)
  } catch {
    return null
  }
}

export async function createDocument(file: File, title?: string): Promise<Document> {
  const form = new FormData()
  form.append('file', file)
  if (title) form.append('title', title)

  const token = getToken()
  const rawRes = await fetch('/api/be/documents', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })

  const payload = await rawRes.json().catch(() => null)
  if (!rawRes.ok || payload?.status === 'FAILURE' || payload?.status === 'ERROR') {
    throw new Error(payload?.message ?? `Upload failed (${rawRes.status})`)
  }

  return mapDocument((payload as BeDocumentEnvelope).data)
}

export async function updateDocument(
  id: string,
  patch: Partial<Pick<Document, 'title' | 'tags' | 'workflowType' | 'expiresAt' | 'message' | 'signers' | 'fields' | 'status'>>,
): Promise<Document> {
  const body: Record<string, unknown> = {}
  if (patch.title !== undefined) body.title = patch.title
  if (patch.tags !== undefined) body.tags = patch.tags
  if (patch.workflowType !== undefined) body.workflowType = patch.workflowType
  if (patch.expiresAt !== undefined) body.expiresAt = patch.expiresAt
  if (patch.message !== undefined) body.message = patch.message
  if (patch.signers !== undefined) body.signers = toBeSigners(patch.signers)
  if (patch.fields !== undefined) body.fields = toBeFields(patch.fields)
  // status transitions (e.g. draft → sent) are handled by Phase B /send endpoint

  const res = await apiFetch<BeDocumentEnvelope>(`/documents/${id}`, {
    method: 'PATCH',
    body,
  })
  return mapDocument(res.data)
}

export async function sendDocument(
  id: string,
  opts?: { message?: string; reminderEveryDays?: number; expiryDays?: number },
): Promise<Document> {
  const body: Record<string, unknown> = {}
  if (opts?.message) body.message = opts.message
  if (opts?.reminderEveryDays !== undefined) body.reminderEveryDays = opts.reminderEveryDays
  if (opts?.expiryDays !== undefined) body.expiryDays = opts.expiryDays

  const res = await apiFetch<BeDocumentEnvelope>(`/documents/${id}/send`, {
    method: 'POST',
    body,
  })
  return mapDocument(res.data)
}

export async function deleteDocument(id: string): Promise<void> {
  await apiFetch(`/documents/${id}`, { method: 'DELETE' })
}

export async function getPdfBlob(id: string): Promise<Blob | null> {
  const token = getToken()
  const res = await fetch(`/api/be/documents/${id}/pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) return null
  return res.blob()
}
