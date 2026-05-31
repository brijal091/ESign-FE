// Mock data for Admin / Configuration (09). Mirrors the Paraph design.

export type Role = 'Admin' | 'Sender' | 'Viewer'
export type UserStatusValue = 'Active' | 'Suspended'

export interface AdminUser {
  name: string
  email: string
  role: Role
  status: UserStatusValue
  last: string
  colorIdx: number
}

export const USERS: AdminUser[] = [
  { name: 'Brijal Patel', email: 'brijal@northbeam.io', role: 'Admin', status: 'Active', last: '2m ago', colorIdx: 0 },
  { name: 'Sarah Chen', email: 'sarah@northbeam.io', role: 'Sender', status: 'Active', last: '1h ago', colorIdx: 1 },
  { name: 'Mira Okonkwo', email: 'mira@northbeam.io', role: 'Sender', status: 'Active', last: 'today', colorIdx: 2 },
  { name: 'Daniel Park', email: 'daniel@northbeam.io', role: 'Viewer', status: 'Active', last: 'yesterday', colorIdx: 1 },
  { name: 'Lin Park', email: 'lin.p@northbeam.io', role: 'Sender', status: 'Active', last: '3d ago', colorIdx: 2 },
  { name: 'Priya Shastri', email: 'priya@northbeam.io', role: 'Sender', status: 'Suspended', last: '2w ago', colorIdx: 5 },
  { name: 'Caleb Mwangi', email: 'caleb.m@northbeam.io', role: 'Viewer', status: 'Active', last: '4h ago', colorIdx: 4 },
  { name: 'Aisha Bello', email: 'aisha@northbeam.io', role: 'Admin', status: 'Active', last: '5h ago', colorIdx: 4 },
  { name: 'Mateo Ortiz', email: 'mateo@northbeam.io', role: 'Viewer', status: 'Suspended', last: '1mo ago', colorIdx: 3 },
  { name: 'Yusuf Demir', email: 'yusuf@northbeam.io', role: 'Sender', status: 'Active', last: '6d ago', colorIdx: 3 },
]

export type AuditAction =
  | 'document_created'
  | 'document_sent'
  | 'document_viewed'
  | 'document_signed'
  | 'document_completed'
  | 'document_declined'
  | 'otp_verified'
  | 'field_completed'

export interface AuditActor {
  name: string
  colorIdx: number
  signer?: boolean
  system?: boolean
}

export interface AuditRow {
  ts: string
  actor: AuditActor
  action: AuditAction
  doc: string
  ip: string
  ua: string
}

export const AUDIT: AuditRow[] = [
  { ts: 'May 27, 14:08:42', actor: { name: 'Brijal Patel', colorIdx: 0 }, action: 'document_created', doc: 'Mutual NDA · Acme × Northwind', ip: '73.18.244.91', ua: 'Chrome 124 · macOS 14.5' },
  { ts: 'May 27, 14:09:11', actor: { name: 'Brijal Patel', colorIdx: 0 }, action: 'document_sent', doc: 'Mutual NDA · Acme × Northwind', ip: '73.18.244.91', ua: 'Chrome 124 · macOS 14.5' },
  { ts: 'May 27, 14:21:03', actor: { name: 'elena@acme.com', signer: true, colorIdx: 5 }, action: 'document_viewed', doc: 'Mutual NDA · Acme × Northwind', ip: '104.220.18.6', ua: 'Safari 17 · iOS 17.4' },
  { ts: 'May 27, 14:22:48', actor: { name: 'elena@acme.com', signer: true, colorIdx: 5 }, action: 'otp_verified', doc: 'Mutual NDA · Acme × Northwind', ip: '104.220.18.6', ua: 'Safari 17 · iOS 17.4' },
  { ts: 'May 27, 14:24:17', actor: { name: 'elena@acme.com', signer: true, colorIdx: 5 }, action: 'field_completed', doc: 'Mutual NDA · Acme × Northwind', ip: '104.220.18.6', ua: 'Safari 17 · iOS 17.4' },
  { ts: 'May 27, 14:25:02', actor: { name: 'elena@acme.com', signer: true, colorIdx: 5 }, action: 'document_signed', doc: 'Mutual NDA · Acme × Northwind', ip: '104.220.18.6', ua: 'Safari 17 · iOS 17.4' },
  { ts: 'May 27, 14:25:09', actor: { name: 'system', system: true, colorIdx: 3 }, action: 'document_completed', doc: 'Mutual NDA · Acme × Northwind', ip: '—', ua: 'ESign backend' },
  { ts: 'May 27, 13:58:27', actor: { name: 'Sarah Chen', colorIdx: 1 }, action: 'document_created', doc: 'Vendor MSA · Brightway Print', ip: '98.207.61.4', ua: 'Chrome 124 · Win 11' },
  { ts: 'May 27, 13:59:13', actor: { name: 'Sarah Chen', colorIdx: 1 }, action: 'document_sent', doc: 'Vendor MSA · Brightway Print', ip: '98.207.61.4', ua: 'Chrome 124 · Win 11' },
  { ts: 'May 27, 11:42:08', actor: { name: 'mateo@brightway.print', signer: true, colorIdx: 3 }, action: 'document_viewed', doc: 'Vendor MSA · Brightway Print', ip: '67.182.91.117', ua: 'Firefox 125 · Win 11' },
  { ts: 'May 27, 11:44:51', actor: { name: 'mateo@brightway.print', signer: true, colorIdx: 3 }, action: 'document_declined', doc: 'Vendor MSA · Brightway Print', ip: '67.182.91.117', ua: 'Firefox 125 · Win 11' },
  { ts: 'May 27, 10:33:19', actor: { name: 'Mira Okonkwo', colorIdx: 2 }, action: 'document_created', doc: 'Q1 Contractor Onboarding · Caleb Mwangi', ip: '73.18.244.91', ua: 'Chrome 124 · macOS 14.5' },
  { ts: 'May 27, 10:35:02', actor: { name: 'Mira Okonkwo', colorIdx: 2 }, action: 'document_sent', doc: 'Q1 Contractor Onboarding · Caleb Mwangi', ip: '73.18.244.91', ua: 'Chrome 124 · macOS 14.5' },
  { ts: 'May 27, 10:48:14', actor: { name: 'caleb.m@northbeam.io', signer: true, colorIdx: 4 }, action: 'document_viewed', doc: 'Q1 Contractor Onboarding · Caleb Mwangi', ip: '192.168.4.21', ua: 'Chrome 124 · macOS 14.5' },
]

export const ADMIN_SECTIONS = [
  { key: 'General', icon: 'settings' as const },
  { key: 'Appearance', icon: 'monitor' as const },
  { key: 'Users', icon: 'users' as const },
  { key: 'Roles', label: 'Roles & Permissions', icon: 'shield-check' as const },
  { key: 'Branding', icon: 'palette' as const },
  { key: 'Audit Log', icon: 'scroll-text' as const },
  { key: 'Billing', icon: 'credit-card' as const },
  { key: 'Integrations', icon: 'plug' as const },
]
