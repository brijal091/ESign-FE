import type {
  FieldType,
  InstantiateTemplateInput,
  Template,
  TemplateCategory,
  TemplateField,
} from '@esign/types'
import { apiFetch } from './client'
import { getToken } from '../auth/token-store'

// ─── BE shapes ────────────────────────────────────────────────────────────────

interface BeTemplateFieldResponse {
  id: string
  signerIndex: number | null
  type: string
  page: number
  x: number | string
  y: number | string
  width: number | string
  height: number | string
  required: boolean | null
  label: string | null
  placeholder: string | null
}

interface BeTemplateResponse {
  id: string
  name: string
  category: string | null
  pageCount: number | null
  fileSizeBytes: number | null
  createdAt: string
  updatedAt: string
  lastUsedAt: string | null
  fields: BeTemplateFieldResponse[]
}

interface BeTemplateEnvelope {
  status: string
  message: string
  data: BeTemplateResponse
}

interface BeTemplateListEnvelope {
  status: string
  message: string
  data: {
    templates: BeTemplateResponse[]
    total: number
    page: number
    pageSize: number
  }
}

interface BeDocumentEnvelopeMin {
  status: string
  message: string
  data: { id: string }
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function num(v: number | string): number {
  return typeof v === 'string' ? parseFloat(v) : v
}

const VALID_CATEGORIES: TemplateCategory[] = [
  'NDA',
  'HR',
  'Sales',
  'Vendor',
  'Finance',
  'Brand',
  'Tax',
  'Other',
]

function mapCategory(c: string | null): TemplateCategory | null {
  if (!c) return null
  return (VALID_CATEGORIES as string[]).includes(c) ? (c as TemplateCategory) : 'Other'
}

function mapField(f: BeTemplateFieldResponse): TemplateField {
  return {
    id: f.id,
    signerIndex: f.signerIndex ?? null,
    type: f.type as FieldType,
    position: {
      page: f.page,
      x: num(f.x),
      y: num(f.y),
      width: num(f.width),
      height: num(f.height),
    },
    required: f.required ?? true,
    label: f.label ?? undefined,
    placeholder: f.placeholder ?? undefined,
  }
}

function mapTemplate(t: BeTemplateResponse): Template {
  return {
    id: t.id,
    name: t.name,
    category: mapCategory(t.category),
    pageCount: t.pageCount,
    fileSizeBytes: t.fileSizeBytes,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    lastUsedAt: t.lastUsedAt,
    fields: (t.fields ?? []).map(mapField),
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ListTemplatesParams {
  q?: string
  category?: string
  page?: number
  pageSize?: number
}

export async function listTemplates(
  params: ListTemplatesParams = {},
): Promise<{ templates: Template[]; total: number; page: number; pageSize: number }> {
  const qs = new URLSearchParams()
  if (params.q) qs.set('q', params.q)
  if (params.category) qs.set('category', params.category)
  if (params.page !== undefined) qs.set('page', String(params.page))
  if (params.pageSize !== undefined) qs.set('pageSize', String(params.pageSize))

  const query = qs.toString() ? `?${qs}` : ''
  const res = await apiFetch<BeTemplateListEnvelope>(`/templates${query}`)
  return {
    templates: res.data.templates.map(mapTemplate),
    total: res.data.total,
    page: res.data.page,
    pageSize: res.data.pageSize,
  }
}

export async function getTemplate(id: string): Promise<Template | null> {
  try {
    const res = await apiFetch<BeTemplateEnvelope>(`/templates/${id}`)
    return mapTemplate(res.data)
  } catch {
    return null
  }
}

export async function createTemplate(
  file: File,
  name: string,
  category?: string,
): Promise<Template> {
  const form = new FormData()
  form.append('file', file)
  form.append('name', name)
  if (category) form.append('category', category)

  const token = getToken()
  const rawRes = await fetch('/api/be/templates', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })

  const payload = await rawRes.json().catch(() => null)
  if (!rawRes.ok || payload?.status === 'FAILURE' || payload?.status === 'ERROR') {
    throw new Error(payload?.message ?? `Upload failed (${rawRes.status})`)
  }

  return mapTemplate((payload as BeTemplateEnvelope).data)
}

export async function deleteTemplate(id: string): Promise<void> {
  await apiFetch(`/templates/${id}`, { method: 'DELETE' })
}

export async function instantiateTemplate(
  id: string,
  input: InstantiateTemplateInput,
): Promise<{ documentId: string }> {
  const body: Record<string, unknown> = {
    signers: input.signers.map((s) => ({ name: s.name, email: s.email })),
  }
  if (input.title) body.title = input.title

  const res = await apiFetch<BeDocumentEnvelopeMin>(`/templates/${id}/instantiate`, {
    method: 'POST',
    body,
  })
  return { documentId: res.data.id }
}
