'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  InviteUserInput,
  UpdateBrandingInput,
  UpdateUserInput,
} from '@esign/types'
import {
  createUser,
  deleteUser,
  getBranding,
  listUsers,
  type ListUsersParams,
  updateBranding,
  updateUser,
} from '../api/admin'

const KEYS = {
  users: ['admin', 'users'] as const,
  usersList: (params: ListUsersParams) =>
    ['admin', 'users', 'list', params] as const,
  branding: ['admin', 'branding'] as const,
}

export function useAdminUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: KEYS.usersList(params),
    queryFn: () => listUsers(params),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: InviteUserInput) => createUser(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.users })
    },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateUserInput }) =>
      updateUser(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.users })
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.users })
    },
  })
}

export function useBranding() {
  return useQuery({
    queryKey: KEYS.branding,
    queryFn: getBranding,
  })
}

export function useUpdateBranding() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateBrandingInput) => updateBranding(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.branding })
    },
  })
}
