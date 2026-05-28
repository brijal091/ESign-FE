'use client'

import type { AuthSession } from '@esign/types'

const STORAGE_KEY = 'esign:auth-session'
const CHANGE_EVENT = 'esign:auth-change'

export function readRawSession(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function readSession(): AuthSession | null {
  const raw = readRawSession()
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function writeSession(session: AuthSession | null): void {
  if (typeof window === 'undefined') return
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function getToken(): string | null {
  return readSession()?.token ?? null
}

export function subscribe(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener()
  }
  window.addEventListener(CHANGE_EVENT, listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener)
    window.removeEventListener('storage', onStorage)
  }
}
