'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, LogOut } from 'lucide-react'
import { Button } from '@esign/ui'

export default function SessionExpiredPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col">
      <div
        className="mb-5 grid size-16 place-items-center rounded-full bg-warning-soft text-warning-strong"
        aria-hidden
      >
        <LogOut className="size-7" strokeWidth={1.5} />
      </div>

      <h1 className="font-display text-[28px] font-medium leading-tight tracking-tight text-ink">
        You&apos;ve been signed out
      </h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
        For your security, we signed you out after 30 minutes of inactivity. Sign in
        again to pick up where you left off.
      </p>

      <Button
        size="lg"
        className="mt-6 w-full gap-2"
        onClick={() => router.push('/login')}
      >
        Sign In Again
        <ArrowRight className="size-4" strokeWidth={1.5} />
      </Button>

      <p className="mt-[18px] text-center text-[12.5px] text-ink-subtle">
        Session timeout can be adjusted in{' '}
        <a
          href="/configuration"
          className="text-ink underline decoration-border-strong underline-offset-[3px] hover:decoration-ink-muted"
        >
          workspace security settings
        </a>
        .
      </p>
    </div>
  )
}
