import { Search } from 'lucide-react'
import { Skeleton } from '@esign/ui'

export default function DocumentsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton width={160} height={28} radius={6} />
          <Skeleton width={280} height={14} radius={4} />
        </div>
        <Skeleton width={180} height={36} radius={6} />
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex w-80 items-center gap-2.5 rounded-sm border border-border bg-surface px-3 py-2">
        <Search className="size-4 text-ink-faint" />
        <span className="text-[13.5px] text-ink-faint">Search documents…</span>
      </div>

      {/* 6 ghost rows */}
      <div className="overflow-hidden rounded-md border border-border bg-surface">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid items-center gap-3.5 px-4 py-3.5"
            style={{ gridTemplateColumns: '16px 32px 1fr 140px 90px 90px 24px' }}
          >
            <Skeleton width={16} height={16} radius={3} />
            <Skeleton width={28} height={32} radius={3} />
            <div className="flex flex-col gap-1.5">
              <Skeleton width={`${55 + ((i * 7) % 30)}%`} height={11} radius={3} />
              <Skeleton width={`${28 + ((i * 11) % 22)}%`} height={9} radius={3} />
            </div>
            <Skeleton width="82%" height={10} radius={3} />
            <Skeleton width={68} height={20} radius={999} />
            <Skeleton width={66} height={10} radius={3} />
            <Skeleton width={18} height={18} radius={3} />
          </div>
        ))}
      </div>
    </div>
  )
}
