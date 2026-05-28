import { z } from 'zod'

// ─── Contact ──────────────────────────────────────────────────────────────────

export const ContactSchema = z.object({
  id: z.number().int(),
  firstName: z.string().min(1),
  lastName: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')).default(''),
  phone: z.string().optional().default(''),
  company: z.string().optional().default(''),
  type: z.string().optional().default(''),
  tags: z.array(z.string()).default([]),
  dndEmail: z.boolean().default(false),
  dndTextMessages: z.boolean().default(false),
  dndCallsVoiceMails: z.boolean().default(false),
  dndInboundCalls: z.boolean().default(false),
})
export type Contact = z.infer<typeof ContactSchema>

export const CreateContactInputSchema = z.object({
  firstName: z.string().min(1, 'First name required').max(50),
  lastName: z.string().max(50).optional().default(''),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, 'Phone must be 10–15 digits')
    .optional()
    .or(z.literal('')),
  company: z.string().optional().default(''),
  tags: z.string().optional().default(''),
})
export type CreateContactInput = z.infer<typeof CreateContactInputSchema>

export type UpdateContactInput = CreateContactInput

// ─── Contact Group ────────────────────────────────────────────────────────────

export const ContactGroupSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.string(),
  memberCount: z.number().int().nonnegative().default(0),
})
export type ContactGroup = z.infer<typeof ContactGroupSchema>

export const CreateGroupInputSchema = z.object({
  name: z.string().min(1, 'Name required').max(255),
})
export type CreateGroupInput = z.infer<typeof CreateGroupInputSchema>

// ─── CSV Import ───────────────────────────────────────────────────────────────

export interface CsvImportRowError {
  row: number
  reason: string
}

export interface CsvImportResult {
  imported: number
  skipped: number
  errors: CsvImportRowError[]
}
