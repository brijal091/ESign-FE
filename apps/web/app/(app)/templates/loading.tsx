import { Search } from 'lucide-react'
import { Skeleton } from '@esign/ui'

export default function TemplatesLoading() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 px-8 pb-4 pt-7">
        <div className="space-y-2">
          <Skeleton width={160} height={28} radius={6} />
          <Skeleton width={320} height={14} radius={4} />
        </div>
        <Skeleton width={160} height={36} radius={6} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2.5 px-8 pb-[18px]">
        <div className="flex h-9 w-80 items-center gap-2.5 rounded-sm border border-border bg-surface px-3">
          <Search className="size-[15px] text-ink-faint" strokeWidth={1.5} />
          <span className="text-[13.5px] text-ink-faint">Search templates…</span>
        </div>
        <Skeleton width={132} height={36} radius={5} />
        <Skeleton width={132} height={36} radius={5} />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div
          className="grid justify-start gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, 280px)' }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-md border border-border bg-surface"
            >
              <Skeleton width={280} height={160} radius={0} />
              <div className="space-y-2 p-3.5">
                <Skeleton width={`${55 + ((i * 7) % 30)}%`} height={13} radius={4} />
                <Skeleton width={`${30 + ((i * 11) % 22)}%`} height={10} radius={3} />
                <div className="flex items-center gap-2 pt-1.5">
                  <Skeleton width={48} height={18} radius={999} />
                  <Skeleton width={56} height={10} radius={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
