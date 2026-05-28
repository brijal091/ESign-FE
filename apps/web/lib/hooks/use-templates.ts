'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { InstantiateTemplateInput } from '@esign/types'
import {
  createTemplate,
  deleteTemplate,
  getTemplate,
  instantiateTemplate,
  listTemplates,
  type ListTemplatesParams,
} from '../api/templates'

const KEYS = {
  all: ['templates'] as const,
  list: (params: ListTemplatesParams) => ['templates', 'list', params] as const,
  one: (id: string) => ['templates', id] as const,
}

export function useTemplates(params: ListTemplatesParams = {}) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => listTemplates(params),
  })
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: KEYS.one(id),
    queryFn: () => getTemplate(id),
    enabled: Boolean(id),
  })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ file, name, category }: { file: File; name: string; category?: string }) =>
      createTemplate(file, name, category),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
    },
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
    },
  })
}

export function useInstantiateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: InstantiateTemplateInput }) =>
      instantiateTemplate(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      qc.invalidateQueries({ queryKey: KEYS.all })
    },
  })
}
