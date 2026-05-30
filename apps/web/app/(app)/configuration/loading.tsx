import { Search } from 'lucide-react'
import { Skeleton } from '@esign/ui'

export default function ConfigurationLoading() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sub-nav */}
      <aside className="flex w-60 shrink-0 flex-col gap-1 border-r border-border bg-surface py-6">
        <div className="px-5 pb-3">
          <Skeleton width={92} height={11} radius={3} />
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="mx-2 flex items-center gap-2.5 py-2 pl-[18px] pr-3.5">
            <Skeleton width={15} height={15} radius={3} />
            <Skeleton width={`${50 + ((i * 9) % 30)}%`} height={11} radius={3} />
          </div>
        ))}
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden bg-paper">
        {/* Page header */}
        <div className="px-8 pb-[18px] pt-7">
          <Skeleton width={120} height={24} radius={5} />
          <div className="mt-2">
            <Skeleton width={420} height={13} radius={3} />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2.5 px-8 pb-[18px]">
          <div className="flex h-9 w-80 items-center gap-2.5 rounded-sm border border-border bg-surface px-3">
            <Search className="size-[15px] text-ink-faint" strokeWidth={1.5} />
            <span className="text-[13.5px] text-ink-faint">Search…</span>
          </div>
          <Skeleton width={132} height={36} radius={5} />
          <Skeleton width={148} height={36} radius={5} />
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <div className="overflow-hidden rounded-md border border-border bg-surface">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="grid items-center gap-3 px-4 py-3.5"
                style={{ gridTemplateColumns: '1fr 1fr 96px 96px 96px 24px' }}
              >
                <div className="flex items-center gap-2.5">
                  <Skeleton width={28} height={28} radius={999} />
                  <Skeleton width={`${52 + ((i * 7) % 24)}%`} height={11} radius={3} />
                </div>
                <Skeleton width="78%" height={11} radius={3} />
                <Skeleton width={56} height={18} radius={999} />
                <Skeleton width={64} height={11} radius={3} />
                <Skeleton width={56} height={11} radius={3} />
                <Skeleton width={18} height={18} radius={3} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
