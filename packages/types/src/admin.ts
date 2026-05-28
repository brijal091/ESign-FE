import { z } from 'zod'

export const AdminRoleSchema = z.enum(['user', 'orgadmin'])
export type AdminRole = z.infer<typeof AdminRoleSchema>

export const AdminUserSchema = z.object({
  id: z.number().int(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  mobile: z.string().nullable(),
  role: AdminRoleSchema,
  active: z.boolean(),
  lastLogin: z.string().nullable(),
})
export type AdminUser = z.infer<typeof AdminUserSchema>

export const InviteUserInputSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Valid email required'),
  mobile: z.string().optional(),
  role: AdminRoleSchema,
})
export type InviteUserInput = z.infer<typeof InviteUserInputSchema>

export const UpdateUserInputSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  mobile: z.string().optional(),
  role: AdminRoleSchema.optional(),
  active: z.boolean().optional(),
})
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>

const HEX_COLOR = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/

export const BrandingSchema = z.object({
  orgId: z.number().int(),
  companyName: z.string().nullable(),
  logoUrl: z.string().nullable(),
  primaryColor: z.string().nullable(),
  accentColor: z.string().nullable(),
  supportEmail: z.string().nullable(),
  emailFromName: z.string().nullable(),
  updatedAt: z.string().nullable(),
  updatedBy: z.number().int().nullable(),
})
export type Branding = z.infer<typeof BrandingSchema>

export const UpdateBrandingInputSchema = z.object({
  companyName: z.string().max(150).optional(),
  logoUrl: z.string().max(2048).optional(),
  primaryColor: z.string().regex(HEX_COLOR, 'Must be #RRGGBB or #RRGGBBAA').optional(),
  accentColor: z.string().regex(HEX_COLOR, 'Must be #RRGGBB or #RRGGBBAA').optional(),
  supportEmail: z.string().email().max(150).optional(),
  emailFromName: z.string().max(150).optional(),
})
export type UpdateBrandingInput = z.infer<typeof UpdateBrandingInputSchema>
