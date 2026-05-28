import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { EmptyState, buttonVariants } from '@esign/ui'
import { Illust404 } from '../components/system/illustrations'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-10">
      <EmptyState
        icon={<Illust404 />}
        title="We couldn't find that page"
        body="It may have been deleted, or the link is broken. Check the URL, or head back to your documents."
        action={
          <Link href="/documents" className={buttonVariants({ className: 'gap-2' })}>
            Go to Documents <ArrowRight className="size-4" />
          </Link>
        }
      />
      <div className="mt-7 font-mono text-[11.5px] tracking-wide text-ink-faint">/documents/8f2c-1d4b · 404</div>
    </div>
  )
}
