'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, ChevronDown, ArrowDownNarrowWide, FileText } from 'lucide-react'
import type { Template } from '@esign/types'
import { TEMPLATE_CATEGORIES } from '@esign/types'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  Skeleton,
  cn,
  toast,
} from '@esign/ui'
import { TemplateCard } from '../../../components/templates/template-card'
import { UploadTemplateDialog } from '../../../components/templates/upload-template-dialog'
import { InstantiateDialog } from '../../../components/templates/instantiate-dialog'
import {
  useDeleteTemplate,
  useTemplates,
} from '../../../lib/hooks/use-templates'

function useDebounced<T>(value: T, delay = 300): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}

export default function TemplatesPage() {
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState<string>('')
  const q = useDebounced(searchInput.trim(), 300)

  const queryParams = useMemo(
    () => ({ q: q || undefined, category: category || undefined, page: 0, pageSize: 50 }),
    [q, category],
  )
  const { data, isLoading, isError } = useTemplates(queryParams)
  const del = useDeleteTemplate()

  const [instTemplate, setInstTemplate] = useState<Template | null>(null)
  const [instOpen, setInstOpen] = useState(false)

  const templates = data?.templates ?? []
  const total = data?.total ?? 0

  function handleUse(t: Template) {
    setInstTemplate(t)
    setInstOpen(true)
  }

  async function handleDelete(t: Template) {
    if (!window.confirm(`Delete template "${t.name}"? This cannot be undone.`)) return
    try {
      await del.mutateAsync(t.id)
      toast.success('Template deleted')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4 px-8 pb-4 pt-7">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-ink">
            Templates
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Reusable documents with pre-placed fields and signer roles.
          </p>
        </div>
        <div className="flex gap-2.5">
          <UploadTemplateDialog
            trigger={
              <Button className="gap-2">
                <Plus className="size-4" /> New Template
              </Button>
            }
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2.5 px-8 pb-[18px]">
        <div className="flex h-9 w-80 items-center gap-2.5 rounded-sm border border-border bg-surface px-3 focus-within:border-border-strong">
          <Search className="size-[15px] text-ink-subtle" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search templates…"
            className="flex-1 bg-transparent text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-surface px-3 text-sm text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink">
              {category || 'All categories'}
              <ChevronDown className="size-3.5 text-ink-faint" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => setCategory('')}>All categories</DropdownMenuItem>
            {TEMPLATE_CATEGORIES.map((c) => (
              <DropdownMenuItem key={c} onSelect={() => setCategory(c)}>
                {c}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-surface px-3 text-sm text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink">
          <ArrowDownNarrowWide className="size-3.5" />
          Sort: Recent
          <ChevronDown className="size-3.5 text-ink-faint" />
        </button>

        <div className="flex-1" />
        <div className="text-[13px] text-ink-subtle">
          <span className="font-semibold text-ink">{total}</span>{' '}
          {total === 1 ? 'template' : 'templates'}
        </div>
      </div>

      {/* Grid / states */}
      <div className={cn('flex-1 overflow-auto px-8 pb-8', isError && 'grid place-items-center')}>
        {isLoading ? (
          <div
            className="grid justify-start gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, 280px)' }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={240} width={280} radius={8} />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Failed to load templates"
            body="Something went wrong while fetching templates. Try refreshing the page."
          />
        ) : templates.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              icon={<FileText className="size-10 text-ink-faint" />}
              title={q || category ? 'No matching templates' : 'No templates yet'}
              body={
                q || category
                  ? 'Try a different search or category filter.'
                  : 'Create a template to reuse documents with pre-placed fields and signer roles.'
              }
              action={
                !q && !category ? (
                  <UploadTemplateDialog
                    trigger={
                      <Button className="gap-2">
                        <Plus className="size-4" /> New Template
                      </Button>
                    }
                  />
                ) : null
              }
            />
          </div>
        ) : (
          <div
            className="grid justify-start gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, 280px)' }}
          >
            {templates.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                onUse={handleUse}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <InstantiateDialog
        key={instTemplate?.id ?? 'none'}
        template={instTemplate}
        open={instOpen}
        onOpenChange={(v) => {
          setInstOpen(v)
          if (!v) setInstTemplate(null)
        }}
      />
    </div>
  )
}
