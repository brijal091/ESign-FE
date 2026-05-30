import { Search } from 'lucide-react'
import { Skeleton } from '@esign/ui'

export default function ContactsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton width={140} height={28} radius={6} />
          <Skeleton width={300} height={14} radius={4} />
        </div>
        <div className="flex gap-2">
          <Skeleton width={120} height={36} radius={6} />
          <Skeleton width={140} height={36} radius={6} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-80 items-center gap-2.5 rounded-sm border border-border bg-surface px-3">
          <Search className="size-[15px] text-ink-faint" strokeWidth={1.5} />
          <span className="text-[13.5px] text-ink-faint">Search contacts…</span>
        </div>
        <Skeleton width={120} height={36} radius={5} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-border bg-surface">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid items-center gap-3.5 px-4 py-3.5"
            style={{ gridTemplateColumns: '16px 28px 1fr 1fr 120px 100px 24px' }}
          >
            <Skeleton width={16} height={16} radius={3} />
            <Skeleton width={28} height={28} radius={999} />
            <Skeleton width={`${55 + ((i * 7) % 28)}%`} height={11} radius={3} />
            <Skeleton width={`${48 + ((i * 9) % 30)}%`} height={11} radius={3} />
            <Skeleton width="70%" height={10} radius={3} />
            <Skeleton width={64} height={18} radius={999} />
            <Skeleton width={18} height={18} radius={3} />
          </div>
        ))}
      </div>
    </div>
  )
}
