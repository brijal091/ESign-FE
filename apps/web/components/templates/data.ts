// Mock data for Templates & Contacts (08). Deterministic — mirrors the Paraph
// design. Swap for real API hooks (templates/contacts endpoints) later.

export const SIGNER_COLORS = [
  'var(--color-signer-1)',
  'var(--color-signer-2)',
  'var(--color-signer-3)',
  'var(--color-signer-4)',
  'var(--color-signer-5)',
  'var(--color-signer-6)',
]

export type TemplateCategory = 'NDA' | 'HR' | 'Sales' | 'Vendor' | 'Finance' | 'Brand' | 'Tax'

export interface Template {
  title: string
  category: TemplateCategory
  fields: number
  lastUsed: string
  lines?: number
}

export const TEMPLATES: Template[] = [
  { title: 'NDA — Standard', category: 'NDA', fields: 5, lastUsed: '3 days ago', lines: 8 },
  { title: 'NDA — Mutual', category: 'NDA', fields: 8, lastUsed: 'yesterday', lines: 9 },
  { title: 'Offer Letter', category: 'HR', fields: 7, lastUsed: '5 days ago', lines: 7 },
  { title: 'Vendor MSA', category: 'Vendor', fields: 12, lastUsed: '2 weeks ago', lines: 10 },
  { title: 'Statement of Work', category: 'Sales', fields: 9, lastUsed: 'today', lines: 8 },
  { title: 'Photography Release', category: 'Brand', fields: 4, lastUsed: 'last month', lines: 6 },
  { title: 'Equipment Lease', category: 'Finance', fields: 11, lastUsed: '1 week ago', lines: 9 },
  { title: 'W-9 Form', category: 'Tax', fields: 6, lastUsed: '4 days ago', lines: 7 },
  { title: 'Speaking Engagement', category: 'Brand', fields: 5, lastUsed: '2 days ago', lines: 8 },
]

export interface Contact {
  name: string
  email: string
  phone: string
  company: string
  tags: string[]
  last: string
  colorIdx: number
}

export const CONTACTS: Contact[] = [
  { name: 'Elena Mendoza', email: 'elena@acme.com', phone: '+1 (415) 555-0142', company: 'Acme Holdings', tags: ['Client', 'NDA'], last: '2h ago', colorIdx: 0 },
  { name: 'Sarah Chen', email: 'sarah@northwind.co', phone: '+1 (415) 555-0193', company: 'Northwind Co.', tags: ['Client'], last: 'yesterday', colorIdx: 1 },
  { name: 'Mira Okonkwo', email: 'mira@northbeam.io', phone: '+1 (510) 555-0118', company: 'Northbeam', tags: ['Internal'], last: '3d ago', colorIdx: 2 },
  { name: 'Caleb Mwangi', email: 'caleb.m@acme.com', phone: '+1 (415) 555-0177', company: 'Acme Holdings', tags: ['Client', 'New hire'], last: 'today', colorIdx: 4 },
  { name: 'Daniel Park', email: 'daniel@riverline.co', phone: '+1 (212) 555-0124', company: 'Riverline Holdings', tags: ['Client', 'VIP'], last: '1w ago', colorIdx: 1 },
  { name: 'Priya Shastri', email: 'priya@lumenstudio.io', phone: '+1 (415) 555-0162', company: 'Lumen Studio', tags: ['Vendor'], last: '4d ago', colorIdx: 5 },
  { name: 'Yusuf Demir', email: 'yusuf@tessera.studio', phone: '+1 (718) 555-0146', company: 'Tessera Studio', tags: ['Client'], last: '2w ago', colorIdx: 3 },
  { name: 'Aisha Bello', email: 'aisha@margate.co', phone: '+1 (212) 555-0185', company: 'Margate Co.', tags: ['Vendor'], last: '1mo ago', colorIdx: 4 },
  { name: 'Sana Ortiz', email: 'sana@folio.design', phone: '+1 (415) 555-0131', company: 'Folio', tags: ['Client', 'Brand'], last: '5d ago', colorIdx: 2 },
  { name: 'Brijal Patel', email: 'brijal@northbeam.io', phone: '+1 (415) 555-0109', company: 'Northbeam', tags: ['Internal'], last: 'today', colorIdx: 0 },
  { name: 'Lin Park', email: 'lin.p@northbeam.io', phone: '—', company: 'Northbeam', tags: ['Internal'], last: '6d ago', colorIdx: 2 },
  { name: 'Mateo Ortiz', email: 'mateo@brightway.print', phone: '+1 (503) 555-0155', company: 'Brightway Print', tags: ['Vendor'], last: '2d ago', colorIdx: 3 },
]

export const CONTACT_GROUPS = [
  { name: 'All Contacts', count: 247, icon: 'users' as const },
  { name: 'Clients', count: 86, icon: 'briefcase' as const },
  { name: 'Internal', count: 38, icon: 'building' as const },
  { name: 'Vendors', count: 23, icon: 'package' as const },
]

export const SMART_GROUPS = [
  { name: 'Recently contacted', count: 14, icon: 'clock' as const },
  { name: 'Unsigned for 7d+', count: 6, icon: 'circle-alert' as const },
]

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
}
