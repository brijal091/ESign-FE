'use client'

import { Suspense, use } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ChevronLeft,
  FileText,
  Pencil,
  Calendar,
  Workflow,
  Users,
  MessageSquare,
  Layers,
  AlertCircle,
} from 'lucide-react'
import {
  Badge,
  buttonVariants,
  Card,
  EmptyState,
  Separator,
  Skeleton,
  StatusDot,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TooltipProvider,
} from '@esign/ui'
import { StatusBadge } from '../../../../components/documents/status-badge'
import { ActivityItem } from '../../../../components/audit/activity-item'
import { fieldTypeMeta } from '../../../../lib/field-types'
import { useDocument } from '../../../../lib/hooks/use-documents'
import { useDocumentTimeline } from '../../../../lib/hooks/use-audit'
import type { Document, DocumentField, Signer } from '@esign/types'

const VALID_TABS = ['overview', 'activity', 'fields'] as const
type TabKey = (typeof VALID_TABS)[number]

function isTabKey(v: string | null | undefined): v is TabKey {
  return !!v && (VALID_TABS as readonly string[]).includes(v)
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
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

  if (isLoading) return <DetailSkeleton />

  if (isError || !doc) {
    return (
      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-8">
        <BackLink />
        <Card className="mt-8 border-danger/30 bg-danger-soft/30 p-10 shadow-[var(--shadow-1)]">
          <EmptyState
            icon={
              <span className="grid size-12 place-items-center rounded-md bg-danger-soft text-danger-strong">
                <AlertCircle className="size-6" />
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
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-8">
      <BackLink />

      {/* Header */}
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-sm bg-danger-soft text-danger-strong"
            >
              <FileText className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-ink">{doc.title}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
                <StatusBadge status={doc.status} />
                <span>·</span>
                <span>Created {formatDate(doc.createdAt)}</span>
                {doc.updatedAt && doc.updatedAt !== doc.createdAt ? (
                  <span>· Updated {formatDate(doc.updatedAt)}</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <Link
          href={`/documents/${doc.id}/edit`}
          className={buttonVariants({ variant: 'secondary', size: 'sm' })}
        >
          <Pencil className="size-3.5" />
          Edit
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="mt-6 flex flex-1 flex-col">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-5">
          <OverviewTab doc={doc} />
        </TabsContent>
        <TabsContent value="activity" className="mt-5">
          <ActivityTab id={doc.id} />
        </TabsContent>
        <TabsContent value="fields" className="mt-5">
          <FieldsTab doc={doc} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/documents"
      className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-brand-strong"
    >
      <ChevronLeft className="size-4" />
      All documents
    </Link>
  )
}

// ─── Overview ────────────────────────────────────────────────────────────────

function OverviewTab({ doc }: { doc: Document }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card className="p-5 shadow-[var(--shadow-1)]">
          <h2 className="text-sm font-semibold text-ink">Document details</h2>
          <Separator className="my-3" />
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <Field icon={<Workflow className="size-3.5" />} label="Workflow">
              <span className="capitalize text-ink">{doc.workflowType}</span>
            </Field>
            <Field icon={<Layers className="size-3.5" />} label="Pages">
              <span className="text-ink">{doc.pageCount ?? '—'}</span>
            </Field>
            <Field icon={<Calendar className="size-3.5" />} label="Expires">
              <span className="text-ink">{formatDateTime(doc.expiresAt)}</span>
            </Field>
            <Field icon={<Users className="size-3.5" />} label="Signers">
              <span className="text-ink">{doc.signers.length}</span>
            </Field>
          </dl>
          {doc.message ? (
            <>
              <Separator className="my-4" />
              <div className="flex gap-2 text-sm">
                <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-ink-faint" />
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide text-ink-subtle">
                    Message
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-ink">{doc.message}</p>
                </div>
              </div>
            </>
          ) : null}
        </Card>

        <Card className="p-5 shadow-[var(--shadow-1)]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-ink">Signers</h2>
            <span className="text-xs text-ink-subtle">{doc.signers.length} total</span>
          </div>
          <Separator className="my-3" />
          {doc.signers.length === 0 ? (
            <p className="text-sm text-ink-muted">No signers configured.</p>
          ) : (
            <ul className="space-y-3">
              {doc.signers.map((s) => (
                <SignerRow key={s.id} signer={s} />
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="p-5 shadow-[var(--shadow-1)]">
          <h2 className="text-sm font-semibold text-ink">Fields summary</h2>
          <Separator className="my-3" />
          <FieldsSummary fields={doc.fields} />
        </Card>
        {doc.tags.length > 0 ? (
          <Card className="p-5 shadow-[var(--shadow-1)]">
            <h2 className="text-sm font-semibold text-ink">Tags</h2>
            <Separator className="my-3" />
            <div className="flex flex-wrap gap-1.5">
              {doc.tags.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  )
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink-subtle">
        <span className="text-ink-faint">{icon}</span>
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  )
}

type SignerTone = 'signed' | 'declined' | 'viewed' | 'pending'

function signerTone(s: Signer): SignerTone {
  if (s.signedAt) return 'signed'
  if (s.declinedAt) return 'declined'
  if (s.viewedAt) return 'viewed'
  return 'pending'
}

const TONE_DOT: Record<SignerTone, 'success' | 'danger' | 'warning' | 'muted'> = {
  signed: 'success',
  declined: 'danger',
  viewed: 'warning',
  pending: 'muted',
}

function signerStatusLabel(s: Signer): string {
  if (s.signedAt) return `Signed ${formatDateTime(s.signedAt)}`
  if (s.declinedAt) return `Declined ${formatDateTime(s.declinedAt)}`
  if (s.viewedAt) return `Viewed ${formatDateTime(s.viewedAt)}`
  return 'Awaiting'
}

function SignerRow({ signer }: { signer: Signer }) {
  const tone = signerTone(signer)
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-medium text-ink-strong"
        style={{ backgroundColor: signer.color ?? 'var(--color-signer-1)' }}
      >
        {signer.name.slice(0, 1).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-medium text-ink">{signer.name}</span>
          {signer.order !== undefined ? (
            <Badge variant="outline" className="font-mono text-[10px]">
              #{signer.order}
            </Badge>
          ) : null}
        </div>
        <div className="truncate text-xs text-ink-muted">{signer.email}</div>
        <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-subtle">
          <StatusDot tone={TONE_DOT[tone]} size="sm" />
          {signerStatusLabel(signer)}
        </div>
        {signer.declineReason ? (
          <div className="mt-1 rounded-sm bg-danger-soft/40 px-2 py-1 text-xs text-danger-strong">
            Reason: {signer.declineReason}
          </div>
        ) : null}
      </div>
    </li>
  )
}

function FieldsSummary({ fields }: { fields: DocumentField[] }) {
  if (fields.length === 0) {
    return <p className="text-sm text-ink-muted">No fields placed.</p>
  }
  const byType = new Map<string, number>()
  for (const f of fields) byType.set(f.type, (byType.get(f.type) ?? 0) + 1)
  return (
    <ul className="space-y-2">
      {Array.from(byType.entries()).map(([type, count]) => {
        const meta = fieldTypeMeta(type as DocumentField['type'])
        const Icon = meta.icon
        return (
          <li key={type} className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-2 text-ink">
              <Icon className="size-3.5 text-ink-faint" />
              {meta.label}
            </span>
            <span className="font-mono tabular-nums text-ink-muted">{count}</span>
          </li>
        )
      })}
    </ul>
  )
}

// ─── Activity ────────────────────────────────────────────────────────────────

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
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
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

// ─── Fields ──────────────────────────────────────────────────────────────────

function FieldsTab({ doc }: { doc: Document }) {
  if (doc.fields.length === 0) {
    return (
      <Card className="p-10 shadow-[var(--shadow-1)]">
        <EmptyState
          title="No fields placed"
          body="Open the editor to drop signature, text, and other fields onto this document."
          action={
            <Link href={`/documents/${doc.id}/edit`} className={buttonVariants({ variant: 'secondary' })}>
              Open editor
            </Link>
          }
        />
      </Card>
    )
  }

  // Group by page
  const byPage = new Map<number, DocumentField[]>()
  for (const f of doc.fields) {
    const arr = byPage.get(f.position.page) ?? []
    arr.push(f)
    byPage.set(f.position.page, arr)
  }
  const pages = Array.from(byPage.keys()).sort((a, b) => a - b)

  const signerById = new Map(doc.signers.map((s) => [s.id, s]))

  return (
    <div className="space-y-4">
      {pages.map((page) => {
        const items = byPage.get(page)!
        return (
          <Card key={page} className="overflow-hidden shadow-[var(--shadow-1)]">
            <div className="flex items-center justify-between border-b border-border-subtle bg-surface-sunken px-4 py-2">
              <h3 className="text-sm font-semibold text-ink">Page {page}</h3>
              <span className="font-mono text-xs text-ink-subtle">
                {items.length} field{items.length === 1 ? '' : 's'}
              </span>
            </div>
            <ul className="divide-y divide-border-subtle">
              {items.map((f) => {
                const meta = fieldTypeMeta(f.type)
                const Icon = meta.icon
                const signer = f.signerId ? signerById.get(f.signerId) : null
                return (
                  <li
                    key={f.id}
                    className="grid items-center gap-3 px-4 py-2.5 text-sm"
                    style={{ gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1.4fr) auto auto' }}
                  >
                    <span className="inline-flex items-center gap-2 text-ink">
                      <Icon className="size-3.5 text-ink-faint" />
                      <span className="font-medium">{meta.label}</span>
                      {f.label ? (
                        <span className="truncate text-ink-muted">· {f.label}</span>
                      ) : null}
                    </span>
                    <span className="inline-flex min-w-0 items-center gap-2">
                      {signer ? (
                        <>
                          <span
                            aria-hidden
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: signer.color ?? 'var(--color-signer-1)' }}
                          />
                          <span className="truncate text-ink-muted">{signer.name}</span>
                        </>
                      ) : (
                        <span className="text-ink-faint">Unassigned</span>
                      )}
                    </span>
                    <Badge variant={f.required ? 'default' : 'secondary'}>
                      {f.required ? 'Required' : 'Optional'}
                    </Badge>
                    <span className="font-mono text-[11px] tabular-nums text-ink-subtle">
                      {f.position.x.toFixed(1)}, {f.position.y.toFixed(1)} ·{' '}
                      {f.position.width.toFixed(1)}×{f.position.height.toFixed(1)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </Card>
        )
      })}
    </div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-6 py-8">
      <Skeleton width={100} height={14} />
      <div className="mt-4 flex items-center gap-3">
        <Skeleton width={40} height={40} radius={4} />
        <div className="flex-1 space-y-2">
          <Skeleton width="40%" height={22} />
          <Skeleton width="25%" height={12} />
        </div>
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
