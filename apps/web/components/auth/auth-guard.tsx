'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useAuth } from '../../lib/auth/use-auth'

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isHydrated } = useAuth()

  useEffect(() => {
    if (!isHydrated) return
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated, isHydrated, router])

  if (!isHydrated) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-paper text-sm text-ink-subtle"
        aria-busy="true"
        aria-live="polite"
      />
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper text-sm text-ink-subtle">
        Redirecting…
      </div>
    )
  }

  return <>{children}</>
}
