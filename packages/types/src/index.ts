import { z } from 'zod'

export * from './auth'
export * from './template'
export * from './admin'
export * from './contact'
export * from './dashboard'

// ─── Field ────────────────────────────────────────────────────────────────────

export const FieldTypeSchema = z.enum([
  'signature',
  'initials',
  'name',
  'email',
  'phone',
  'company',
  'text',
  'multiline_text',
  'checkbox',
  'radio',
  'selection',
  'date',
  'strikethrough',
])
export type FieldType = z.infer<typeof FieldTypeSchema>

export const FieldPositionSchema = z.object({
  page: z.number().int().min(1),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().min(1).max(100),
  height: z.number().min(1).max(100),
})
export type FieldPosition = z.infer<typeof FieldPositionSchema>

export const DocumentFieldSchema = z.object({
  id: z.string().uuid(),
  type: FieldTypeSchema,
  position: FieldPositionSchema,
  signerId: z.string().uuid().nullable(),
  required: z.boolean().default(true),
  label: z.string().optional(),
  placeholder: z.string().optional(),
})
export type DocumentField = z.infer<typeof DocumentFieldSchema>

// ─── Signer ───────────────────────────────────────────────────────────────────

export const SignerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  order: z.number().int().min(1).optional(),
  color: z.string().optional(),
  viewedAt: z.string().datetime().nullable().optional(),
  signedAt: z.string().datetime().nullable().optional(),
  declinedAt: z.string().datetime().nullable().optional(),
  declineReason: z.string().nullable().optional(),
})
export type Signer = z.infer<typeof SignerSchema>

// ─── Document ─────────────────────────────────────────────────────────────────

export const DocumentStatusSchema = z.enum([
  'draft',
  'sent',
  'viewed',
  'signed',
  'completed',
  'expired',
  'declined',
])
export type DocumentStatus = z.infer<typeof DocumentStatusSchema>

export const WorkflowTypeSchema = z.enum(['sequential', 'parallel'])
export type WorkflowType = z.infer<typeof WorkflowTypeSchema>

export const DocumentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  status: DocumentStatusSchema,
  workflowType: WorkflowTypeSchema.default('sequential'),
  signers: z.array(SignerSchema),
  fields: z.array(DocumentFieldSchema),
  senderId: z.string().uuid().optional(),
  pageCount: z.number().int().optional(),
  fileSizeBytes: z.number().optional(),
  tags: z.array(z.string()).default([]),
  message: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  expiresAt: z.string().datetime().nullable().optional(),
})
export type Document = z.infer<typeof DocumentSchema>

// ─── Audit ────────────────────────────────────────────────────────────────────

export const AuditActionSchema = z.enum([
  'document_created',
  'document_sent',
  'document_viewed',
  'document_signed',
  'document_completed',
  'document_declined',
  'document_expired',
  'signer_invited',
  'otp_verified',
  'field_completed',
])
export type AuditAction = z.infer<typeof AuditActionSchema>

export const AuditEventSchema = z.object({
  id: z.string().uuid(),
  documentId: z.string().uuid(),
  action: AuditActionSchema,
  actorEmail: z.string().email().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: z.string().datetime(),
  metadata: z.record(z.unknown()).optional(),
})
export type AuditEvent = z.infer<typeof AuditEventSchema>

// ─── User ─────────────────────────────────────────────────────────────────────

export const UserRoleSchema = z.enum(['admin', 'sender', 'viewer'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  role: UserRoleSchema,
  active: z.boolean().default(true),
  createdAt: z.string().datetime(),
})
export type User = z.infer<typeof UserSchema>
