import type {
  Contact,
  ContactGroup,
  CreateContactInput,
  CsvImportResult,
  UpdateContactInput,
} from '@esign/types'
import { apiFetch } from './client'
import { ApiError } from './errors'
import { getToken } from '../auth/token-store'

// ─── BE shapes ────────────────────────────────────────────────────────────────

interface BeContact {
  id: number
  firstName: string | null
  lastName: string | null
  email: string | null
  type?: string | null
  contactNumber: string | null
  contactType: string | null
  tags: string | null
  dndEmail?: number | null
  dndTextMessages?: number | null
  dndCallsVoiceMails?: number | null
  dndInboundCalls?: number | null
}

interface BeContactListEnvelope {
  status: string
  message?: string
  data?: BeContact[]
}

interface BeGroup {
  id: string
  name: string
  createdAt: string
}

interface BeGroupListEnvelope {
  status: string
  message: string
  data: {
    groups: BeGroup[]
    counts: Record<string, number>
  }
}

interface BeGroupEnvelope {
  status: string
  message: string
  data: BeGroup
}

interface BeCsvEnvelope {
  status: string
  message: string
  data: {
    imported: number
    skipped: number
    errors: { row: number; reason: string }[]
  }
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function splitTags(s: string | null | undefined): string[] {
  if (!s) return []
  return s
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

function mapContact(c: BeContact): Contact {
  return {
    id: c.id,
    firstName: c.firstName ?? '',
    lastName: c.lastName ?? '',
    email: c.email ?? '',
    phone: c.contactNumber ?? '',
    company: c.contactType ?? '',
    type: c.type ?? '',
    tags: splitTags(c.tags),
    dndEmail: Boolean(c.dndEmail),
    dndTextMessages: Boolean(c.dndTextMessages),
    dndCallsVoiceMails: Boolean(c.dndCallsVoiceMails),
    dndInboundCalls: Boolean(c.dndInboundCalls),
  }
}

function mapGroup(g: BeGroup, count: number = 0): ContactGroup {
  return {
    id: g.id,
    name: g.name,
    createdAt: g.createdAt,
    memberCount: count,
  }
}

function toBeContactBody(input: CreateContactInput) {
  return {
    firstName: input.firstName,
    lastName: input.lastName ?? '',
    email: input.email ?? '',
    contactNumber: input.phone ?? '',
    contactType: input.company ?? '',
    tags: input.tags ?? '',
    type: '',
    timeZone: '',
    dndEmail: 0,
    dndTextmessages: 0,
    dndCallsVoiceMails: 0,
    dndInboundCalls: 0,
  }
}

// ─── Contacts CRUD ────────────────────────────────────────────────────────────

export async function listContacts(page: number = 1): Promise<Contact[]> {
  const res = await apiFetch<BeContactListEnvelope>(
    `/contactmanager/getAllContacts/${page}`,
  )
  return (res.data ?? []).map(mapContact)
}

export async function createContact(input: CreateContactInput): Promise<void> {
  await apiFetch(`/contactmanager/create-contact`, {
    method: 'POST',
    body: toBeContactBody(input),
  })
}

export async function updateContact(
  id: number,
  input: UpdateContactInput,
): Promise<void> {
  await apiFetch(`/contactmanager/update-contact/${id}`, {
    method: 'PUT',
    body: toBeContactBody(input),
  })
}

export async function deleteContact(id: number): Promise<void> {
  await apiFetch(`/contactmanager/delete-contact/${id}`, { method: 'DELETE' })
}

// ─── Groups ───────────────────────────────────────────────────────────────────

export async function listGroups(): Promise<ContactGroup[]> {
  const res = await apiFetch<BeGroupListEnvelope>(`/contactmanager/groups`)
  const { groups, counts } = res.data
  return groups.map((g) => mapGroup(g, Number(counts?.[g.id] ?? 0)))
}

export async function createGroup(name: string): Promise<ContactGroup> {
  const res = await apiFetch<BeGroupEnvelope>(`/contactmanager/groups`, {
    method: 'POST',
    body: { name },
  })
  return mapGroup(res.data, 0)
}

export async function renameGroup(id: string, name: string): Promise<ContactGroup> {
  const res = await apiFetch<BeGroupEnvelope>(`/contactmanager/groups/${id}`, {
    method: 'PATCH',
    body: { name },
  })
  return mapGroup(res.data)
}

export async function deleteGroup(id: string): Promise<void> {
  await apiFetch(`/contactmanager/groups/${id}`, { method: 'DELETE' })
}

export async function addGroupMembers(
  id: string,
  contactIds: number[],
): Promise<void> {
  await apiFetch(`/contactmanager/groups/${id}/members`, {
    method: 'POST',
    body: { contactIds },
  })
}

export async function removeGroupMember(
  id: string,
  contactId: number,
): Promise<void> {
  await apiFetch(`/contactmanager/groups/${id}/members/${contactId}`, {
    method: 'DELETE',
  })
}

// ─── CSV Import ───────────────────────────────────────────────────────────────

export async function importCsv(file: File): Promise<CsvImportResult> {
  const form = new FormData()
  form.append('file', file)

  const token = getToken()
  const res = await fetch('/api/be/contactmanager/import-csv', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })

  const payload = (await res.json().catch(() => null)) as BeCsvEnvelope | null
  if (!res.ok || payload?.status === 'FAILURE' || payload?.status === 'ERROR') {
    throw new ApiError(payload?.message ?? `CSV import failed (${res.status})`, res.status, payload)
  }

  const data = payload!.data
  return {
    imported: data.imported,
    skipped: data.skipped,
    errors: data.errors ?? [],
  }
}
