'use client'

import { Suspense, use, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft,
  Pencil,
  Calendar,
  Workflow,
  Users,
  MessageSquare,
  Layers,
  AlertCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react'
import {
  buttonVariants,
  Card,
  EmptyState,
  Separator,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
  TooltipProvider,
} from '@esign/ui'
import { StatusBadge } from '../../../../components/documents/status-badge'
import { TagChip } from '../../../../components/documents/tag-chip'
import { SignersTab } from '../../../../components/documents/signers-tab'
import { DocumentActionBar } from '../../../../components/documents/document-action-bar'
import { ActivityItem } from '../../../../components/audit/activity-item'
import { ConnectionIndicator } from '../../../../components/system/connection-indicator'
import { useDocument } from '../../../../lib/hooks/use-documents'
import { useDocumentStream } from '../../../../lib/hooks/use-document-stream'
import { useDocumentTimeline } from '../../../../lib/hooks/use-audit'
import type { Document } from '@esign/types'

const VALID_TABS = ['overview', 'activity', 'signers'] as const
type TabKey = (typeof VALID_TABS)[number]

function isTabKey(v: string | null | undefined): v is TabKey {
  return !!v && (VALID_TABS as readonly string[]).includes(v)
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function shortId(id: string): string {
  return id.replace(/-/g, '').slice(0, 12).toUpperCase()
}

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <TooltipProvider>
      <Suspense fallback={<DetailSkeleton />}>
        <DocumentDetail id={id} />
      </Suspense>
    </TooltipProvider>
  )
}

function DocumentDetail({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const defaultTab: TabKey = isTabKey(tabParam) ? tabParam : 'overview'

  const { data: doc, isLoading, isError } = useDocument(id)
  const qc = useQueryClient()
  const onStreamEvent = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['documents', id] })
    qc.invalidateQueries({ queryKey: ['documents'] })
    qc.invalidateQueries({ queryKey: ['audit', 'document', id] })
  }, [qc, id])
  const { state: streamState } = useDocumentStream({ documentId: id, onEvent: onStreamEvent })

  if (isLoading) return <DetailSkeleton />

  if (isError || !doc) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-8">
        <BackLink />
        <Card className="mt-8 border-danger/30 bg-danger-soft/30 p-10 shadow-[var(--shadow-1)]">
          <EmptyState
            icon={
              <span className="grid size-12 place-items-center rounded-md bg-danger-soft text-danger-strong">
                <AlertCircle className="size-6" strokeWidth={1.5} />
              </span>
            }
            title="Document not found"
            body="This document doesn't exist or you don't have permission to view it."
            action={
              <Link href="/documents" className={buttonVariants({ variant: 'secondary' })}>
                Back to documents
              </Link>
            }
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 pt-8">
      <BackLink />

      {/* Header — eyebrow + title + status/tag/+Tag chip row */}
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-ink-subtle">
            Document · DOC-{shortId(doc.id)}
          </div>
          <h1 className="truncate text-2xl font-semibold tracking-tight text-ink">
            {doc.title}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-subtle">
            <StatusBadge status={doc.status} />
            {doc.tags.map((t) => (
              <TagChip key={t}>{t}</TagChip>
            ))}
            <button
              type="button"
              onClick={() => toast.message('Tag editor not yet implemented')}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-border-strong px-2 py-[3px] text-[11px] text-ink-subtle transition-colors hover:border-brand hover:text-brand-strong"
            >
              <Plus className="size-3" strokeWidth={1.5} />
              Tag
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ConnectionIndicator state={streamState} />
          <Link
            href={`/documents/${doc.id}/edit`}
            className={buttonVariants({ variant: 'default', size: 'sm', className: 'gap-1.5' })}
          >
            <Pencil className="size-3.5" strokeWidth={1.5} />
            Edit
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="mt-6 flex flex-1 flex-col">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="signers">Signers</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-5">
          <OverviewTab doc={doc} />
        </TabsContent>
        <TabsContent value="activity" className="mt-5">
          <ActivityTab id={doc.id} />
        </TabsContent>
        <TabsContent value="signers" className="mt-5">
          <SignersTab signers={doc.signers} />
        </TabsContent>
      </Tabs>

      {/* Sticky bottom action bar */}
      <DocumentActionBar doc={doc} />
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/documents"
      className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-brand-strong"
    >
      <ChevronLeft className="size-4" strokeWidth={1.5} />
      All documents
    </Link>
  )
}

// ─── Overview ────────────────────────────────────────────────────────────────

function OverviewTab({ doc }: { doc: Document }) {
  const completed = doc.signers.filter((s) => s.signedAt).length
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card className="p-5 shadow-[var(--shadow-1)]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            Document details
          </h2>
          <Separator className="my-3" />
          <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 text-sm">
            <MetaRow label="File size">
              <span className="text-ink">{formatBytes(doc.fileSizeBytes)}</span>
            </MetaRow>
            <MetaRow label="Pages">
              <span className="inline-flex items-center gap-1.5 text-ink">
                <Layers className="size-3.5 text-ink-faint" strokeWidth={1.5} />
                {doc.pageCount ?? '—'}
              </span>
            </MetaRow>
            <MetaRow label="Created">
              <span className="text-ink">{formatDateTime(doc.createdAt)}</span>
            </MetaRow>
            <MetaRow label="Updated">
              <span className="text-ink">{formatDateTime(doc.updatedAt)}</span>
            </MetaRow>
            <MetaRow label="Expires">
              <span className="inline-flex items-center gap-1.5 text-ink">
                <Calendar className="size-3.5 text-ink-faint" strokeWidth={1.5} />
                {formatDateTime(doc.expiresAt)}
              </span>
            </MetaRow>
          </dl>
        </Card>

        {doc.message ? (
          <Card className="p-5 shadow-[var(--shadow-1)]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Message
            </h2>
            <Separator className="my-3" />
            <div className="flex gap-2 text-sm">
              <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-ink-faint" strokeWidth={1.5} />
              <p className="min-w-0 whitespace-pre-wrap text-ink">{doc.message}</p>
            </div>
          </Card>
        ) : null}

        <Card className="p-5 shadow-[var(--shadow-1)]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Recent activity
            </h2>
            <Link
              href={`/documents/${doc.id}?tab=activity`}
              className="text-xs font-medium text-brand-strong hover:underline"
            >
              View all
            </Link>
          </div>
          <Separator className="my-3" />
          <ActivitySummary id={doc.id} />
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="p-5 shadow-[var(--shadow-1)]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            Workflow
          </h2>
          <Separator className="my-3" />
          <dl className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-3 text-sm">
            <MetaRow label="Type">
              <span className="inline-flex items-center gap-1.5 capitalize text-ink">
                <Workflow className="size-3.5 text-ink-faint" strokeWidth={1.5} />
                {doc.workflowType}
              </span>
            </MetaRow>
            <MetaRow label="Signers">
              <span className="inline-flex items-center gap-1.5 text-ink">
                <Users className="size-3.5 text-ink-faint" strokeWidth={1.5} />
                {doc.signers.length}
              </span>
            </MetaRow>
            <MetaRow label="Complete">
              <span className="inline-flex items-center gap-1.5 text-ink">
                <CheckCircle2 className="size-3.5 text-success-strong" strokeWidth={1.5} />
                {completed} of {doc.signers.length}
              </span>
            </MetaRow>
          </dl>
        </Card>
      </div>
    </div>
  )
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="pt-px text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
        {label}
      </dt>
      <dd className="m-0 text-sm">{children}</dd>
    </>
  )
}

// ─── Activity ────────────────────────────────────────────────────────────────

function ActivitySummary({ id }: { id: string }) {
  const { data, isLoading, isError } = useDocumentTimeline(id)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton width={28} height={28} radius={999} />
            <div className="flex-1 space-y-1.5 pt-1">
              <Skeleton width="48%" height={12} />
              <Skeleton width="24%" height={9} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="text-sm text-danger-strong">Couldn't load activity.</p>
  }

  if (!data || data.length === 0) {
    return <p className="text-sm text-ink-muted">No activity yet.</p>
  }

  const recent = data.slice(0, 4)
  return (
    <ul className="relative">
      {recent.map((evt) => (
        <ActivityItem key={evt.id} event={evt} variant="timeline" />
      ))}
    </ul>
  )
}

function ActivityTab({ id }: { id: string }) {
  const { data, isLoading, isError } = useDocumentTimeline(id)

  if (isLoading) {
    return (
      <Card className="p-6 shadow-[var(--shadow-1)]">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton width={32} height={32} radius={999} />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton width="40%" height={14} />
                <Skeleton width="22%" height={10} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-danger/30 bg-danger-soft/30 p-6 shadow-[var(--shadow-1)]">
        <div className="flex items-start gap-3 text-sm text-danger-strong">
          <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
          <div>
            <div className="font-medium">Couldn't load activity</div>
            <div className="mt-0.5 text-danger-strong/80">Try again in a moment.</div>
          </div>
        </div>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-10 shadow-[var(--shadow-1)]">
        <EmptyState
          title="No activity yet"
          body="Events will appear here as the document moves through your workflow."
        />
      </Card>
    )
  }

  return (
    <Card className="p-6 shadow-[var(--shadow-1)]">
      <ul className="relative">
        {data.map((evt) => (
          <ActivityItem key={evt.id} event={evt} variant="timeline" />
        ))}
      </ul>
    </Card>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-8">
      <Skeleton width={100} height={14} />
      <div className="mt-4 space-y-2">
        <Skeleton width="20%" height={10} />
        <Skeleton width="40%" height={22} />
        <Skeleton width="25%" height={12} />
      </div>
      <div className="mt-6 flex gap-2">
        <Skeleton width={90} height={32} radius={4} />
        <Skeleton width={90} height={32} radius={4} />
        <Skeleton width={90} height={32} radius={4} />
      </div>
      <Skeleton className="mt-5" width="100%" height={260} radius={8} />
    </div>
  )
}
