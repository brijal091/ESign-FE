import { Skeleton } from '@esign/ui'

export default function EditorLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-paper">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
        <Skeleton width={108} height={28} radius={5} />
        <span className="h-5 w-px bg-border" />
        <Skeleton width={220} height={20} radius={4} />
        <Skeleton width={68} height={20} radius={999} />
        <div className="ml-auto flex items-center gap-3">
          <Skeleton width={208} height={32} radius={5} />
          <span className="h-5 w-px bg-border" />
          <Skeleton width={96} height={32} radius={5} />
          <Skeleton width={84} height={32} radius={5} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-[280px] shrink-0 flex-col gap-4 border-r border-border bg-surface px-3 py-4">
          <Skeleton width={120} height={11} radius={3} />
          <Skeleton width="100%" height={56} radius={6} />
          <Skeleton width={120} height={11} radius={3} />
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={48} radius={6} />
          ))}
          <Skeleton width={100} height={11} radius={3} />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} width="100%" height={44} radius={5} />
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex flex-1 flex-col items-center gap-4 overflow-auto bg-surface-sunken px-8 py-6">
          <Skeleton width={680} height={880} radius={6} />
        </div>
      </div>
    </div>
  )
}
