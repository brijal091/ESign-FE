import { FileText } from 'lucide-react'
import { EmptyState } from '@esign/ui'

export function DocumentsEmpty({ action }: { action: React.ReactNode }) {
  return (
    <div className="grid place-items-center px-6 py-20">
      <EmptyState
        icon={
          <span aria-hidden className="relative grid size-[120px] place-items-center">
            <span
              className="absolute inset-0 rounded-full opacity-50"
              style={{
                backgroundImage:
                  'radial-gradient(var(--color-border) 1px, transparent 1px)',
                backgroundSize: '12px 12px',
              }}
            />
            <span className="relative grid size-[72px] place-items-center rounded-full border border-border bg-surface-raised text-brand-strong shadow-[var(--shadow-2)]">
              <FileText className="size-9" strokeWidth={1.5} />
            </span>
          </span>
        }
        title="No documents yet"
        body="Upload a PDF to start collecting signatures. Drop one in, place your fields, and send."
        action={action}
      />
    </div>
  )
}

export function DocumentsFilterEmpty({ onClear }: { onClear: () => void }) {
  return (
    <div className="grid place-items-center px-6 py-20">
      <EmptyState
        icon={
          <span
            aria-hidden
            className="grid size-14 place-items-center rounded-full border border-border bg-surface-raised text-ink-faint shadow-[var(--shadow-1)]"
          >
            <FileText className="size-6" strokeWidth={1.5} />
          </span>
        }
        title="No documents match"
        body="Try clearing the status filter or searching with different keywords."
        action={
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-border bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-hover hover:border-border-strong"
          >
            Clear filters
          </button>
        }
      />
    </div>
  )
}

