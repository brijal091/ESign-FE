import type {
  AdminRole,
  AdminUser,
  Branding,
  InviteUserInput,
  UpdateBrandingInput,
  UpdateUserInput,
} from '@esign/types'
import { apiFetch } from './client'

// ─── BE shapes ────────────────────────────────────────────────────────────────

interface BeAdminUser {
  id: number
  firstName: string
  lastName: string
  email: string
  mobile: string | null
  role: string
  active: boolean
  lastLogin: string | null
}

interface BeEnvelope<T> {
  status: string
  message: string
  data: T
}

interface BeAdminUserListData {
  users: BeAdminUser[]
  total: number
  page: number
  size: number
}

interface BeBranding {
  orgId: number
  companyName: string | null
  logoUrl: string | null
  primaryColor: string | null
  accentColor: string | null
  supportEmail: string | null
  emailFromName: string | null
  updatedAt: string | null
  updatedBy: number | null
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapRole(r: string): AdminRole {
  const up = r.toUpperCase()
  if (up === 'ROLE_ORGADMIN' || up === 'ORGADMIN') return 'orgadmin'
  return 'user'
}

function toBeRole(r: AdminRole): string {
  return r === 'orgadmin' ? 'ROLE_ORGADMIN' : 'ROLE_USER'
}

function mapUser(u: BeAdminUser): AdminUser {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    mobile: u.mobile ?? null,
    role: mapRole(u.role),
    active: u.active,
    lastLogin: u.lastLogin ?? null,
  }
}

function mapBranding(b: BeBranding): Branding {
  return {
    orgId: b.orgId,
    companyName: b.companyName ?? null,
    logoUrl: b.logoUrl ?? null,
    primaryColor: b.primaryColor ?? null,
    accentColor: b.accentColor ?? null,
    supportEmail: b.supportEmail ?? null,
    emailFromName: b.emailFromName ?? null,
    updatedAt: b.updatedAt ?? null,
    updatedBy: b.updatedBy ?? null,
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ListUsersParams {
  q?: string
  page?: number
  size?: number
}

export async function listUsers(
  params: ListUsersParams = {},
): Promise<{ users: AdminUser[]; total: number; page: number; size: number }> {
  const qs = new URLSearchParams()
  if (params.q) qs.set('q', params.q)
  if (params.page !== undefined) qs.set('page', String(params.page))
  if (params.size !== undefined) qs.set('size', String(params.size))
  const query = qs.toString() ? `?${qs}` : ''
  const res = await apiFetch<BeEnvelope<BeAdminUserListData>>(`/admin/users${query}`)
  return {
    users: res.data.users.map(mapUser),
    total: res.data.total,
    page: res.data.page,
    size: res.data.size,
  }
}

export async function createUser(input: InviteUserInput): Promise<AdminUser> {
  const body = {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    mobile: input.mobile ?? null,
    role: toBeRole(input.role),
  }
  const res = await apiFetch<BeEnvelope<BeAdminUser>>(`/admin/users`, {
    method: 'POST',
    body,
  })
  return mapUser(res.data)
}

export async function updateUser(
  id: number,
  input: UpdateUserInput,
): Promise<AdminUser> {
  const body: Record<string, unknown> = {}
  if (input.firstName !== undefined) body.firstName = input.firstName
  if (input.lastName !== undefined) body.lastName = input.lastName
  if (input.mobile !== undefined) body.mobile = input.mobile
  if (input.role !== undefined) body.role = toBeRole(input.role)
  if (input.active !== undefined) body.active = input.active

  const res = await apiFetch<BeEnvelope<BeAdminUser>>(`/admin/users/${id}`, {
    method: 'PATCH',
    body,
  })
  return mapUser(res.data)
}

export async function deleteUser(id: number): Promise<void> {
  await apiFetch(`/admin/users/${id}`, { method: 'DELETE' })
}

export async function getBranding(): Promise<Branding> {
  const res = await apiFetch<BeEnvelope<BeBranding>>(`/admin/branding`)
  return mapBranding(res.data)
}

export async function updateBranding(
  input: UpdateBrandingInput,
): Promise<Branding> {
  const res = await apiFetch<BeEnvelope<BeBranding>>(`/admin/branding`, {
    method: 'PATCH',
    body: input,
  })
  return mapBranding(res.data)
}
