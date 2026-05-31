'use client'

import { useMutation } from '@tanstack/react-query'
import {
  ConfirmOtpResponseSchema,
  GenericApiResponseSchema,
  LoginResponseSchema,
  type ConfirmOtpRequest,
  type ConfirmOtpResponse,
  type GenericApiResponse,
  type LoginRequest,
  type LoginResponse,
  type RegisterOrganizationRequest,
  type ResetPasswordRequest,
  type SendOtpRequest,
  type SetPasswordRequest,
} from '@esign/types'
import { apiFetch } from './client'
import { writeSession } from '../auth/token-store'

const AUTH_BASE = '/authentication'

export function useLogin() {
  return useMutation({
    mutationFn: async (input: LoginRequest): Promise<LoginResponse> => {
      const result = await apiFetch(`${AUTH_BASE}/login`, {
        method: 'POST',
        body: input,
        auth: false,
        schema: LoginResponseSchema,
      })
      if (result.token) {
        writeSession({ token: result.token, role: result.role, user: result.userdetails })
      }
      return result
    },
  })
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (input: SendOtpRequest): Promise<GenericApiResponse> =>
      apiFetch(`${AUTH_BASE}/send-otp`, {
        method: 'POST',
        body: input,
        auth: false,
        schema: GenericApiResponseSchema,
      }),
  })
}

export function useConfirmOtp() {
  return useMutation({
    mutationFn: (input: ConfirmOtpRequest): Promise<ConfirmOtpResponse> =>
      apiFetch(`${AUTH_BASE}/confirm-otp`, {
        method: 'POST',
        body: input,
        auth: false,
        schema: ConfirmOtpResponseSchema,
      }),
  })
}

export function useRegisterOrganization() {
  return useMutation({
    mutationFn: async (input: RegisterOrganizationRequest): Promise<LoginResponse> => {
      const result = await apiFetch(`${AUTH_BASE}/register-organization`, {
        method: 'POST',
        body: input,
        auth: false,
        schema: LoginResponseSchema,
      })
      if (result.token) {
        writeSession({ token: result.token, role: result.role, user: result.userdetails })
      }
      return result
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordRequest): Promise<GenericApiResponse> =>
      apiFetch(`${AUTH_BASE}/reset-password`, {
        method: 'POST',
        body: input,
        auth: false,
        schema: GenericApiResponseSchema,
      }),
  })
}

export function useSetPasswordForNewUser() {
  return useMutation({
    mutationFn: (input: SetPasswordRequest): Promise<GenericApiResponse> =>
      apiFetch(`${AUTH_BASE}/set-password-for-new-user`, {
        method: 'POST',
        body: input,
        auth: false,
        schema: GenericApiResponseSchema,
      }),
  })
}
