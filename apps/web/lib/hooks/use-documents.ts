'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Document } from '@esign/types'
import {
  createDocument,
  deleteDocument,
  getDocument,
  getPdfBlob,
  listDocuments,
  sendDocument,
  updateDocument,
} from '../api/documents'

const KEYS = {
  all: ['documents'] as const,
  one: (id: string) => ['documents', id] as const,
  pdf: (id: string) => ['documents', id, 'pdf'] as const,
}

export function useDocuments() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: () => listDocuments().then((r) => r.documents),
  })
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: KEYS.one(id),
    queryFn: () => getDocument(id),
    enabled: Boolean(id),
  })
}

export function useUploadDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ file, title }: { file: File; title?: string }) => createDocument(file, title),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
    },
  })
}

export function useUpdateDocument(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (
      patch: Partial<Pick<Document, 'title' | 'tags' | 'workflowType' | 'expiresAt' | 'message' | 'signers' | 'fields' | 'status'>>,
    ) => updateDocument(id, patch),
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: KEYS.one(id) })
      const previous = qc.getQueryData<Document>(KEYS.one(id))
      qc.setQueryData<Document>(KEYS.one(id), (old) => (old ? { ...old, ...patch } : old))
      return { previous }
    },
    onError: (_err, _patch, ctx) => {
      if (ctx?.previous) qc.setQueryData(KEYS.one(id), ctx.previous)
    },
    onSuccess: (doc) => {
      qc.setQueryData(KEYS.one(id), doc)
      qc.invalidateQueries({ queryKey: KEYS.all })
    },
  })
}

export function useDeleteDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
    },
  })
}

export function useSendDocument(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (opts?: { message?: string; reminderEveryDays?: number; expiryDays?: number }) =>
      sendDocument(id, opts),
    onSuccess: (doc) => {
      qc.setQueryData(KEYS.one(id), doc)
      qc.invalidateQueries({ queryKey: KEYS.all })
    },
  })
}

export function usePdfBlobUrl(id: string): { url: string | null; loading: boolean } {
  const [resolved, setResolved] = useState<{ id: string; url: string | null } | null>(null)

  useEffect(() => {
    let cancelled = false
    let createdUrl: string | null = null

    getPdfBlob(id).then((blob) => {
      if (cancelled) return
      createdUrl = blob ? URL.createObjectURL(blob) : null
      setResolved({ id, url: createdUrl })
    })

    return () => {
      cancelled = true
      if (createdUrl) URL.revokeObjectURL(createdUrl)
    }
  }, [id])

  const loading = resolved?.id !== id
  const url = resolved?.id === id ? resolved.url : null
  return { url, loading }
}
