import { Skeleton } from '@esign/ui'

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton width={200} height={28} radius={6} />
          <Skeleton width={320} height={14} radius={4} />
        </div>
        <Skeleton width={160} height={36} radius={6} />
      </div>

      {/* 4 KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-md border border-border bg-surface px-5 py-4"
          >
            <Skeleton width={92} height={11} radius={3} />
            <Skeleton width={`${48 + ((i * 13) % 30)}%`} height={28} radius={5} />
            <Skeleton width={64} height={14} radius={999} />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-md border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton width={160} height={16} radius={4} />
            <Skeleton width={140} height={28} radius={6} />
          </div>
          <Skeleton width="100%" height={220} radius={6} />
        </div>
        <div className="rounded-md border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton width={120} height={16} radius={4} />
            <Skeleton width={20} height={20} radius={4} />
          </div>
          <div className="grid place-items-center py-3">
            <Skeleton width={160} height={160} radius={999} />
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-md border border-border bg-surface p-5">
        <Skeleton width={160} height={16} radius={4} />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton width={28} height={28} radius={999} />
              <div className="flex-1 space-y-1.5">
                <Skeleton width={`${50 + ((i * 9) % 26)}%`} height={11} radius={3} />
                <Skeleton width={`${24 + ((i * 7) % 18)}%`} height={9} radius={3} />
              </div>
              <Skeleton width={56} height={10} radius={3} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
