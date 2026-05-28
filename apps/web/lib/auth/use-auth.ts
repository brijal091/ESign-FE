'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { AuthSession } from '@esign/types'
import { readRawSession, subscribe, writeSession } from './token-store'

let cachedRaw: string | null = null
let cachedSession: AuthSession | null = null

function snapshot(): AuthSession | null {
  const raw = readRawSession()
  if (raw === cachedRaw) return cachedSession
  cachedRaw = raw
  try {
    cachedSession = raw ? (JSON.parse(raw) as AuthSession) : null
  } catch {
    cachedSession = null
  }
  return cachedSession
}

function serverSnapshot(): AuthSession | null {
  return null
}

export function useAuthSession(): AuthSession | null {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}

export function useAuth() {
  const session = useAuthSession()
  const signOut = useCallback(() => writeSession(null), [])
  return {
    session,
    isAuthenticated: !!session?.token,
    user: session?.user ?? null,
    role: session?.role ?? null,
    signOut,
  }
}
