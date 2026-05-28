'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateContactInput, UpdateContactInput } from '@esign/types'
import {
  addGroupMembers,
  createContact,
  createGroup,
  deleteContact,
  deleteGroup,
  importCsv,
  listContacts,
  listGroups,
  removeGroupMember,
  renameGroup,
  updateContact,
} from '../api/contacts'

const KEYS = {
  all: ['contacts'] as const,
  list: (page: number) => ['contacts', 'list', page] as const,
  groupsAll: ['contact-groups'] as const,
  groupsList: ['contact-groups', 'list'] as const,
}

export function useContacts(page: number = 1) {
  return useQuery({
    queryKey: KEYS.list(page),
    queryFn: () => listContacts(page),
  })
}

export function useCreateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateContactInput) => createContact(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
    },
  })
}

export function useUpdateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateContactInput }) =>
      updateContact(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
    },
  })
}

export function useDeleteContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteContact(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
    },
  })
}

// ─── Groups ───────────────────────────────────────────────────────────────────

export function useContactGroups() {
  return useQuery({
    queryKey: KEYS.groupsList,
    queryFn: () => listGroups(),
  })
}

export function useCreateGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createGroup(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.groupsAll })
    },
  })
}

export function useRenameGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => renameGroup(id, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.groupsAll })
    },
  })
}

export function useDeleteGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.groupsAll })
    },
  })
}

export function useAddGroupMembers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, contactIds }: { id: string; contactIds: number[] }) =>
      addGroupMembers(id, contactIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.groupsAll })
    },
  })
}

export function useRemoveGroupMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, contactId }: { id: string; contactId: number }) =>
      removeGroupMember(id, contactId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.groupsAll })
    },
  })
}

export function useImportCsv() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importCsv(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
    },
  })
}
