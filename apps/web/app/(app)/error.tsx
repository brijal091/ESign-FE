'use client'

import Link from 'next/link'
import { RotateCw, Hash } from 'lucide-react'
import { Button, EmptyState, buttonVariants } from '@esign/ui'
import { Illust500 } from '../../components/system/illustrations'

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-paper px-6 py-10">
      <EmptyState
        icon={<Illust500 />}
        title="Something went wrong"
        body="We hit an unexpected error. Our team has been notified and is on it."
        action={
          <div className="flex gap-2.5">
            <Button onClick={reset} className="gap-2">
              <RotateCw className="size-4" /> Try Again
            </Button>
            <Link href="/documents" className={buttonVariants({ variant: 'ghost' })}>
              Go to Documents
            </Link>
          </div>
        }
      />
      <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-[11.5px] text-ink-subtle">
        <Hash className="size-3 text-ink-faint" />
        error · req_7a4f9c2e · 2026-05-27 14:31 UTC
      </div>
    </div>
  )
}
