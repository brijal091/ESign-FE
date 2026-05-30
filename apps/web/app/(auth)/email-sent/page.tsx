'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Mail, MailCheck } from 'lucide-react'

export default function EmailSentPage() {
  return (
    <Suspense fallback={null}>
      <EmailSent />
    </Suspense>
  )
}

function EmailSent() {
  const params = useSearchParams()
  const email = params.get('email') ?? ''

  return (
    <div className="flex flex-col items-center text-center">
      <div
        aria-hidden
        className="relative mb-[22px] grid h-24 w-24 place-items-center rounded-full bg-brand-soft text-brand-strong"
      >
        <Mail size={40} strokeWidth={1.6} />
        <span
          className="absolute -right-2 -top-2 h-2.5 w-2.5 rounded-full bg-brand opacity-80"
          style={{ boxShadow: '0 1px 2px oklch(0.4 0.1 38 / 0.25)' }}
        />
        <span
          className="absolute -right-6 top-1 h-1.5 w-1.5 rounded-full bg-brand opacity-50"
        />
        <span
          className="absolute -right-9 top-4 h-1 w-1 rounded-full bg-brand opacity-30"
        />
      </div>

      <h2 className="m-0 font-sans text-[22px] font-semibold leading-tight tracking-[-0.01em] text-ink">
        Check your email
      </h2>

      <p className="mt-2 max-w-[320px] font-sans text-[14.5px] leading-[1.5] text-ink-muted">
        {email ? (
          <>
            We sent a link to{' '}
            <strong className="font-semibold text-ink">{email}</strong>. It
            expires in 24 hours.
          </>
        ) : (
          <>
            We sent you a link. It expires in 24 hours. Follow it to continue.
          </>
        )}
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-sm border border-dashed border-border-strong bg-surface-sunken px-3.5 py-2.5 font-mono text-[12px] text-ink-subtle">
        <MailCheck size={14} className="text-ink-subtle" aria-hidden />
        Tip: check spam if it doesn&apos;t arrive in 2 minutes.
      </div>

      <div className="mt-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-brand-strong transition-colors hover:underline"
        >
          <ArrowLeft size={14} aria-hidden />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
