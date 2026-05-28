'use client'

import { use, useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ChevronLeft, Plus, Send, PenLine } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Button, Input, Tooltip, TooltipTrigger, TooltipContent, toast } from '@esign/ui'
import { StatusBadge } from '../../../../../components/documents/status-badge'
import type { Document, DocumentField, Signer } from '@esign/types'
import {
  useDocument,
  usePdfBlobUrl,
  useSendDocument,
  useUpdateDocument,
} from '../../../../../lib/hooks/use-documents'
import { useEditorStore } from '../../../../../lib/stores/editor-store'
import { FieldSidebar } from '../../../../../components/editor/field-sidebar'
import { FieldChipGhost } from '../../../../../components/editor/draggable-field'
import { fieldTypeMeta } from '../../../../../lib/field-types'
import { droppableIdForPage } from '../../../../../components/editor/droppable-page'
import { SendDialog } from '../../../../../components/editor/send-dialog'

const PdfCanvas = dynamic(
  () => import('../../../../../components/editor/pdf-canvas').then((m) => m.PdfCanvas),
  { ssr: false, loading: () => <div className="flex-1 bg-surface-sunken" /> },
)

const SIGNER_COLORS = [
  'var(--color-signer-1)',
  'var(--color-signer-2)',
  'var(--color-signer-3)',
  'var(--color-signer-4)',
]

function nextSignerColor(existing: Signer[]): string {
  const used = new Set(existing.map((s) => s.color))
  return SIGNER_COLORS.find((c) => !used.has(c)) ?? SIGNER_COLORS[0]
}

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: doc, isLoading } = useDocument(id)
  const { url: pdfUrl } = usePdfBlobUrl(id)
  const update = useUpdateDocument(id)
  const send = useSendDocument(id)

  const selectedFieldId = useEditorStore((s) => s.selectedFieldId)
  const setSelectedField = useEditorStore((s) => s.setSelectedField)
  const activeDrag = useEditorStore((s) => s.activeDrag)
  const setActiveDrag = useEditorStore((s) => s.setActiveDrag)
  const selectedSignerId = useEditorStore((s) => s.selectedSignerId)
  const setSelectedSigner = useEditorStore((s) => s.setSelectedSigner)

  useEffect(() => {
    if (doc && !selectedSignerId && doc.signers[0]) {
      setSelectedSigner(doc.signers[0].id)
    }
  }, [doc, selectedSignerId, setSelectedSigner])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const data = event.active.data.current
      if (data?.kind === 'field-chip') {
        setActiveDrag({ type: data.type, signerId: data.signerId })
      }
    },
    [setActiveDrag],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDrag(null)
      if (!doc) return
      const overId = event.over?.id
      const overRect = event.over?.rect
      const dropped = event.active.rect.current.translated
      const data = event.active.data.current
      if (!overId || !overRect || !dropped || data?.kind !== 'field-chip') return

      const overPage = (event.over?.data.current as { page?: number } | undefined)?.page
      if (typeof overPage !== 'number' || event.over?.id !== droppableIdForPage(overPage)) return

      const xPx = dropped.left - overRect.left
      const yPx = dropped.top - overRect.top
      const xPct = (xPx / overRect.width) * 100
      const yPct = (yPx / overRect.height) * 100

      const { width, height } = fieldTypeMeta(data.type).defaultSize
      const x = Math.max(0, Math.min(100 - width, xPct))
      const y = Math.max(0, Math.min(100 - height, yPct))

      const newField: DocumentField = {
        id: crypto.randomUUID(),
        type: data.type,
        position: { page: overPage, x, y, width, height },
        signerId: data.signerId,
        required: true,
      }

      update.mutate({ fields: [...doc.fields, newField] })
    },
    [doc, setActiveDrag, update],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedFieldId && doc) {
        const tag = (e.target as HTMLElement | null)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        update.mutate({ fields: doc.fields.filter((f) => f.id !== selectedFieldId) })
        setSelectedField(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedFieldId, doc, update, setSelectedField])

  if (isLoading) return <div className="flex-1 p-6 text-sm text-ink-subtle">Loading…</div>
  if (!doc) return <NotFound />

  const activeColor =
    doc.signers.find((s) => s.id === activeDrag?.signerId)?.color ?? SIGNER_COLORS[0]

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-[calc(100vh-4rem)] flex-col bg-paper">
        <EditorTopBar
          doc={doc}
          onSendDocument={async (input) => {
            // Persist any signer / workflow / expiry edits made in the dialog (draft-only PATCH),
            // then transition draft → sent via the dedicated endpoint (issues tokens + emails).
            await update.mutateAsync({
              signers: input.signers,
              workflowType: input.workflowType,
              expiresAt: input.expiresAt,
            })
            await send.mutateAsync({ message: input.message })
          }}
          onTitleCommit={(next) => {
            if (next && next !== doc.title) update.mutate({ title: next })
          }}
        />

        <div className="flex flex-1 overflow-hidden">
          <FieldSidebar
            doc={doc}
            selectedSignerId={selectedSignerId}
            onSelectSigner={setSelectedSigner}
            onAddSigner={() => {
              const color = nextSignerColor(doc.signers)
              const newSigner: Signer = {
                id: crypto.randomUUID(),
                name: `Signer ${doc.signers.length + 1}`,
                email: `signer${doc.signers.length + 1}@example.com`,
                order: doc.signers.length + 1,
                color,
              }
              update.mutate({ signers: [...doc.signers, newSigner] })
              setSelectedSigner(newSigner.id)
            }}
            onUpdateSigner={(sid, patch) =>
              update.mutate({
                signers: doc.signers.map((s) => (s.id === sid ? { ...s, ...patch } : s)),
              })
            }
            onDeleteSigner={(sid) =>
              update.mutate({
                signers: doc.signers.filter((s) => s.id !== sid),
                fields: doc.fields.filter((f) => f.signerId !== sid),
              })
            }
          />

          {pdfUrl ? (
            <PdfCanvas
              fileUrl={pdfUrl}
              fields={doc.fields}
              signers={doc.signers}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedField}
              onMoveField={(fieldId, position) =>
                update.mutate({
                  fields: doc.fields.map((f) =>
                    f.id === fieldId ? { ...f, position } : f,
                  ),
                })
              }
            />
          ) : (
            <div className="flex flex-1 items-center justify-center bg-surface-sunken text-sm text-ink-subtle">
              No PDF attached to this document.
            </div>
          )}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDrag ? <FieldChipGhost type={activeDrag.type} color={activeColor} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

interface TopBarProps {
  doc: Document
  onSendDocument: (input: {
    signers: Signer[]
    workflowType: Document['workflowType']
    expiresAt: string | null
    message: string
  }) => Promise<void> | void
  onTitleCommit: (next: string) => void
}

function EditorTopBar({ doc, onSendDocument, onTitleCommit }: TopBarProps) {
  const [tags, setTags] = useState('')
  const sent = doc.status !== 'draft'

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      {/* Left: back + inline-editable title */}
      <Link
        href="/documents"
        className="flex items-center gap-1 rounded-sm px-2 py-1 text-sm text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
      >
        <ChevronLeft className="size-4" />
        Documents
      </Link>

      <span className="h-5 w-px bg-border" />

      <input
        key={doc.title}
        defaultValue={doc.title}
        onBlur={(e) => onTitleCommit(e.target.value)}
        className="min-w-0 max-w-xs flex-1 rounded-sm bg-transparent px-1.5 py-1 text-base font-medium text-ink outline-none transition-colors hover:bg-surface-hover focus:bg-surface-hover"
      />

      <StatusBadge status={doc.status} />

      {/* Right: tags + Sign Now + Send */}
      <div className="ml-auto flex items-center gap-3">
        <div className="flex w-52 items-center gap-1 rounded-sm border border-border bg-surface px-2 focus-within:border-brand">
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags…"
            className="h-8 border-0 bg-transparent px-0 text-xs hover:border-0 focus-visible:border-0 focus-visible:bg-transparent"
          />
          <button
            type="button"
            onClick={() => toast.message('Not yet implemented')}
            className="rounded-xs p-0.5 text-ink-faint hover:text-ink"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        <span className="h-5 w-px bg-border" />

        <Button
          size="sm"
          variant="secondary"
          className="gap-1.5"
          onClick={() => toast.message('Not yet implemented')}
        >
          <PenLine className="size-3.5" />
          Sign Now
        </Button>

        {sent ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button size="sm" className="gap-1.5" disabled>
                  <Send className="size-3.5" />
                  Sent
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              This document has already been sent. Only Draft documents can be sent.
            </TooltipContent>
          </Tooltip>
        ) : (
          <SendDialog
            doc={doc}
            onSend={onSendDocument}
            trigger={
              <Button size="sm" className="gap-1.5">
                <Send className="size-3.5" />
                Send
              </Button>
            }
          />
        )}
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-paper p-6 text-center">
      <div className="text-lg font-semibold text-ink">Document not found</div>
      <Link href="/documents" className="text-sm font-medium text-brand-strong hover:underline">
        Back to documents
      </Link>
    </div>
  )
}
