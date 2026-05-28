import { z } from 'zod'

const FieldTypeSchema = z.enum([
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

const FieldPositionSchema = z.object({
  page: z.number().int().min(1),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().min(1).max(100),
  height: z.number().min(1).max(100),
})

export const TEMPLATE_CATEGORIES = [
  'NDA',
  'HR',
  'Sales',
  'Vendor',
  'Finance',
  'Brand',
  'Tax',
  'Other',
] as const

export const TemplateCategorySchema = z.enum(TEMPLATE_CATEGORIES)
export type TemplateCategory = z.infer<typeof TemplateCategorySchema>

export const TemplateFieldSchema = z.object({
  id: z.string().uuid(),
  signerIndex: z.number().int().min(0).nullable(),
  type: FieldTypeSchema,
  position: FieldPositionSchema,
  required: z.boolean().default(true),
  label: z.string().optional(),
  placeholder: z.string().optional(),
})
export type TemplateField = z.infer<typeof TemplateFieldSchema>

export const TemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  category: TemplateCategorySchema.nullable(),
  pageCount: z.number().int().nullable(),
  fileSizeBytes: z.number().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastUsedAt: z.string().datetime().nullable(),
  fields: z.array(TemplateFieldSchema),
})
export type Template = z.infer<typeof TemplateSchema>

export const InstantiateSignerSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Invalid email'),
})
export type InstantiateSigner = z.infer<typeof InstantiateSignerSchema>

export const InstantiateTemplateInputSchema = z.object({
  title: z.string().optional(),
  signers: z.array(InstantiateSignerSchema).min(1, 'At least one signer required'),
})
export type InstantiateTemplateInput = z.infer<typeof InstantiateTemplateInputSchema>
