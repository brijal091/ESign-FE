import { z } from 'zod'

export const OtpOperationSchema = z.union([z.literal(1), z.literal(2)])
export type OtpOperation = z.infer<typeof OtpOperationSchema>

export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const SendOtpRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  operation: OtpOperationSchema,
})
export type SendOtpRequest = z.infer<typeof SendOtpRequestSchema>

export const ConfirmOtpRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().regex(/^[0-9]{6}$/, 'OTP must be exactly 6 digits'),
  operation: OtpOperationSchema,
})
export type ConfirmOtpRequest = z.infer<typeof ConfirmOtpRequestSchema>

export const RegisterOrganizationRequestSchema = z.object({
  verificationToken: z.string().min(1),
  orgName: z.string().min(1, 'Organization name is required').max(100),
  userFirstName: z.string().min(1, 'First name is required').max(50),
  userMiddleName: z.string().max(50).optional(),
  userLastName: z.string().min(1, 'Last name is required').max(50),
  userMobileNumber: z.string().regex(/^[0-9]{10,15}$/, 'Mobile number must be 10-15 digits'),
  userEmail: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type RegisterOrganizationRequest = z.infer<typeof RegisterOrganizationRequestSchema>

export const ResetPasswordRequestSchema = z.object({
  verificationToken: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>

export const SetPasswordRequestSchema = z.object({
  token: z.string().min(1, 'Invalid request'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type SetPasswordRequest = z.infer<typeof SetPasswordRequestSchema>

export const ApiStatusSchema = z.enum(['SUCCESS', 'FAILURE', 'ERROR'])
export type ApiStatus = z.infer<typeof ApiStatusSchema>

export const AuthUserDetailsSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    mobileNumber: z.string().optional(),
    orgId: z.union([z.string(), z.number()]).optional(),
    orgName: z.string().optional(),
  })
  .passthrough()
export type AuthUserDetails = z.infer<typeof AuthUserDetailsSchema>

export const LoginResponseSchema = z.object({
  status: ApiStatusSchema,
  message: z.string(),
  token: z.string().optional(),
  role: z.string().optional(),
  userdetails: AuthUserDetailsSchema.optional(),
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>

export const GenericApiResponseSchema = z
  .object({
    status: ApiStatusSchema,
    message: z.string(),
  })
  .passthrough()
export type GenericApiResponse = z.infer<typeof GenericApiResponseSchema>

export const ConfirmOtpResponseSchema = GenericApiResponseSchema.extend({
  verificationToken: z.string().optional(),
})
export type ConfirmOtpResponse = z.infer<typeof ConfirmOtpResponseSchema>

export const AuthSessionSchema = z.object({
  token: z.string(),
  role: z.string().optional(),
  user: AuthUserDetailsSchema.optional(),
})
export type AuthSession = z.infer<typeof AuthSessionSchema>
